document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
  
}

$(function () {
  // init fastclick
  //FastClick.attach(document.body);

  // external panels
  //$("[data-role=header],[data-role=footer]").toolbar().enhanceWithin();
  $("[data-role=panel]").panel().enhanceWithin();
  draw.initialize();
  widgets.initialize();
});

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function hexByte(n) {
  return pad(n.toString(16), 2);
}

// brocheDraw

// funções de conversão
var broche = {
  // monta mensagem para envio serial
  msg: function() {    
    msg = "T" + widgets.msg;
    if(widgets.wrap == true) msg = msg + " ... ";
    msg = msg + "\n";
    return msg;
  },
  
  anim: function() {
    var size = hexByte(widgets.frameCount);
    var speed = hexByte(widgets.speed);
    var framedata = '';
    
    for(var i = 1; i <= widgets.frameCount; i++) {
      var frame = draw.frames[i];
      for(var y = 1; y <= 8; y++) {
        var b = 0;
        for(var x = 1; x <= 8; x++) {
          var sx = pad(x, 2);
          var sy = pad(y, 2);
          if(frame[sy + sx] == true)
            b += Math.pow(2, 8-x);
        }
        framedata += hexByte(b);
      }
    }
    
    var out = hexByte("A".charCodeAt(0)) + size + speed + framedata;
    return out;
  }
};

// controladores dos widgets do app
var widgets = {
  frame: 1,
  frameCount: 1,
  speed: 10,
  msg: '',
  wrap: false,
  
  initialize: function() {
    // atualiza slider de quadro atual quando número de quadros muda
    $("#anim-frame-count").change(function() {
      widgets.frameCount = parseInt($("#anim-frame-count").val());
      $("#anim-frame").attr("max", $("#anim-frame-count").val()).slider('refresh');
    });
    
    // atualiza quadro atual
    $("#anim-frame").change(function() {
      widgets.frame = parseInt($("#anim-frame").val());
      widgets.updateDraw();
    });
    
    $("#anim-speed").change(function() { widgets.speed = parseInt($("#anim-speed").val()); });
    $("#text-msg").change(function() { widgets.msg = $("#text-msg").val(); });
    $("#text-wrap").change(function() { widgets.wrap = $("#text-wrap").is(":checked"); });
  },
  
  // atualiza animação a partir do armazenado
  updateDraw: function() {
    $('.pixel').addClass('off').removeClass('on');
    var frame = draw.frames[widgets.frame];
    for(var id in frame)
      if(frame.hasOwnProperty(id))
        $('#'+id).addClass('on').removeClass('off');
  },
  
  // atualiza textbox ao carregar mensagem
  updateText: function() {
    $("#text-msg").val(widgets.msg);
    $("#text-wrap").prop('checked', widgets.wrap).checkboxradio('refresh');
  }
}

// serial comms
var comms = {
  // função callback de falha na serial  
  serialFail: function() {
    alert("Não foi possível estabelecer comunicação serial!");
    comms.connected = false;
  },
  
  // status
  connected: false,

  // função para conectar
  connect: function() {
    console.log("requesting permission");
    serial.requestPermission({vid: '2341', pid: '0043'},
      function() {
        console.log("opening serial");
        serial.open({baudRate: 9600},
          function() {
            alert("Conectado!");
            comms.connected = true;
          },
          this.serialFail
        );
      },
      this.serialFail
    );
  },
  
  // função chamada ao clicar subir
  upload: function() {
    if(comms.connected == false) {
      alert("O broche não está conectado!");
    } else {
      if($("#xfer-anim").is(":checked") == false && $("#xfer-text").is(":checked") == false) {
        alert("Não há nada selecionado para subir!");
      } else {
        if($("#xfer-anim").is(":checked") == true) {
          console.log("sending anim");
          console.log(broche.anim());
          serial.writeHex(broche.anim());
        }
        if($("#xfer-text").is(":checked") == true) {
          console.log("sending text");
          console.log(broche.msg());
          serial.write(broche.msg());
        }
        serial.write("SQ");
        alert("Upload realizado! O broche irá reiniciar.");
      }
    }
  },
  
  // função chamada ao clicar baixar
  download: function() {
    if(!comms.connected) {
      alert("O broche não está conectado!");
    } else {
      if($("#xfer-anim").is(":checked") == false && $("#xfer-text").is(":checked") == false) {
        alert("Não há nada selecionado para baixar!");
      } else {
        // TODO
      }
    }
  }
}

var draw = {
  // guarda informação dos quadros
  frames: [],
  // status = false if wasn't drawing before, true if is drawing
  drawStatus: false,
  // state = the state next drawn pixels get
  state: false,

  // inicializa funções de desenho
  initialize: function() {
    for(i = 1; i < 15; i++) {
      this.frames[i] = {};
    }
    
    $(".pixel").on('touchstart', this.clickPixel);
    $(window).on('touchmove', this.slidePixel);
    $(window).on('touchend', this.unclickPixel);
  },
  
  // clica num pixel
  clickPixel: function(e) {
    draw.drawStatus = true;
    if(draw.frames[widgets.frame][e.target.id] == true) {
      draw.state = false;
      draw.turnOff(e.target.id);
    } else {
      draw.state = true;
      draw.turnOn(e.target.id);
    }
  },
  
  // função chamada quando desliza sobre um pixel
  slidePixel: function(e) {
    if(draw.drawStatus == true) {
      var xPos = e.originalEvent.touches[0].pageX;
      var yPos = e.originalEvent.touches[0].pageY;
      var element = document.elementFromPoint(xPos,yPos);
      if($(element).hasClass('pixel') == true) {
        if(draw.state == true) {
          draw.turnOn(element.id);
        } else {
          draw.turnOff(element.id);
        }
      }
      e.preventDefault();
    }
  },
  
  // levanta o clique
  unclickPixel: function(e) {
    draw.drawStatus = false;
  },
  
  // liga pixel
  turnOn: function(id) {
    draw.frames[widgets.frame][id] = true;
    $('#'+id).addClass('on').removeClass('off');
  },
  
  // desliga pixel
  turnOff: function(id) {
    delete draw.frames[widgets.frame][id];
    $('#'+id).addClass('off').removeClass('on');
  },
  
  // limpa frame
  clearFrame: function() {
    draw.frames[widgets.frame] = {};
    $('.pixel').addClass('off').removeClass('on');
  }
};
