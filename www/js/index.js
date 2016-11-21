// init fastclick
$(function() {
  FastClick.attach(document.body);
});

document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
  
}

// external panels
$(function () {
  //$("[data-role=header],[data-role=footer]").toolbar().enhanceWithin();
  $("[data-role=panel]").panel().enhanceWithin();
  broche.initialize();
  draw.initialize();
  widgets.initialize();
});

var widgets = {
  initialize: function() {
    // atualiza slider de quadro atual quando número de quadros muda
    $("#anim-frame-count").change(function() {
      $("#anim-frame").attr("max", $("#anim-frame-count").val()).slider('refresh');
    });
  }
}

// brocheDraw

var broche = {
  anim: [],
  
  // monta mensagem para envio serial
  msg: function() {    
    msg = "T" + $("#text-msg").val();
    if($("#text-wrap").is(":checked") == true) msg = msg + " ... ";
    msg = msg + "\n";
    return msg;
  },
  
  // inicializa matriz 2d * págs para guardar animação
  initialize: function() {
    
  },
  
  // atualiza animação ao mudar widget
  updateFromWidgets: function() { 
  },
  
  // atualiza widget ao carregar nova animação
  updateToWidgets: function() {
  }
};

// serial comms
var comms = {
  // função callback de falha na serial  
  serialFail: function() {
    alert("Não foi possível estabelecer comunicação serial!");
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
  initialize: function() {
    
  }
};
