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
  broche.initializeAnim();
  draw.initialize();
});

// brocheDraw

var broche = {
  anim: [],
  
  // monta mensagem para envio serial
  msg: function() {    
    msg = "T" + $("#text-msg").value;
    if($("#text-wrap").is(":checked")) msg = msg + " ... ";
    return msg;
  },
  
  // inicializa matriz 2d * págs para guardar animação
  initializeAnim: function() {
    
  },
  
  // função callback de falha na serial  
  serialFail: function() {
    alert("Não foi possível estabelecer comunicação serial!");
  },
  
  // função callback de sucesso ao conectar serial para subir
  upSuccess: function() {
    serial.open({baudRate: 9600},
      function() {
        if($("#xfer-anim").is(":checked")) {
        
        }
        if($("#xfer-text").is(":checked")) {
          serial.write(this.msg,
            function() {
              serial.writeHex('10',
                function succes() {
                  alert("Sucesso!");
                  serial.write("SQ");
                },
                this.serialFail
              );
            },
            this.serialFail
          );
        }
      },
      this.serialFail
    );
  },
  
  // função chamada ao clicar subir
  upload: function() {
    if($("#xfer-anim").is(":checked") == false && $("#xfer-text").is(":checked") == false) {
      alert("Não há nada selecionado para subir!");
    } else {
      serial.requestPermission(this.upSuccess, this.serialFail);
    }
  },
  
  // função chamada ao clicar baixar
  download: function() {
    if($("#xfer-anim").is(":checked") == false && $("#xfer-text").is(":checked") == false) {
      alert("Não há nada selecionado para baixar!");
    } else {
    
    }
  },
  
  // atualiza animação ao mudar widget
  updateFromWidgets: function() { 
  },
  
  // atualiza widget ao carregar nova animação
  updateToWidgets: function() {
  }
};

var draw = {
  initialize: function() {
    console.log("ogij");
    $("#screen-table").on("vmousedown", function() {
      console.log("asdfg");
    });
  }
};
