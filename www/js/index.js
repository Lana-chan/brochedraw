document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
  
}

$(function () {
  // init fastclick
  FastClick.attach(document.body);

  // external panels
  //$("[data-role=header],[data-role=footer]").toolbar().enhanceWithin();
  $("[data-role=panel]").panel().enhanceWithin();
  draw.initialize();
  widgets.initialize();
});

var widgets = {
  frame: 1,
  
  initialize: function() {
    // atualiza slider de quadro atual quando número de quadros muda
    $("#anim-frame-count").change(function() {
      $("#anim-frame").attr("max", $("#anim-frame-count").val()).slider('refresh');
    });
    
    // atualiza quadro atual
    $("#anim-frame").change(function() {
      widgets.frame = $("#anim-frame").val();
      draw.updateFromWidgets();
    });
  }
}

// brocheDraw

var broche = {
  // monta mensagem para envio serial
  msg: function() {    
    msg = "T" + $("#text-msg").val();
    if($("#text-wrap").is(":checked") == true) msg = msg + " ... ";
    msg = msg + "\n";
    return msg;
  },
};

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
          // TODO: código para subir binary anim
        }
        if($("#xfer-text").is(":checked") == true) {
          console.log("sending text");
          console.log(broche.msg());
          serial.write(broche.msg());
        }
        serial.write("SQ");
        alert("Upload realizado! Broche reiniciando...");
      }
    }
  },
  
  // função chamada ao clicar baixar
  download: function() {
    if(!comms.connected) {
      alert("O broche não está conectado!");
    } else if($("#xfer-anim").is(":checked") == false && $("#xfer-text").is(":checked") == false) {
      alert("Não há nada selecionado para baixar!");
    } else {
    
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
    $("body").on('vmouseup', this.unclickPixel);
    $(".pixel").on('vmousedown', this.clickPixel);
    $(".pixel").on('vmouseenter', this.slidePixel);
    
    // ignore scroll quando desenha
    $(window).on('touchmove', function(e) {
      if(draw.drawStatus == true) e.preventDefault();
    });
  },
  
  // levanta o clique
  unclickPixel: function(e) {
    draw.drawStatus = false;
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
    //draw.frame[1].
  },
  
  // função chamada quando desliza sobre um pixel
  slidePixel: function(e) {
    if(draw.drawStatus == true) {
      if(draw.state == true) {
        draw.turnOn(e.target.id);
      } else {
        draw.turnOff(e.target.id);
      }
    }
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
  },
  
  // atualiza animação ao mudar widget
  updateFromWidgets: function() {
    $('.pixel').addClass('off').removeClass('on');
    var frame = draw.frames[widgets.frame];
    for(var id in frame)
      if(frame.hasOwnProperty(id))
        $('#'+id).addClass('on').removeClass('off');
  },
  
  // atualiza widget ao carregar nova animação
  updateFromComms: function() {
  }

};
