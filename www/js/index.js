// init fastclick
$(function() {
  FastClick.attach(document.body);
});

// external panels
$(function () {
    //$("[data-role=header],[data-role=footer]").toolbar().enhanceWithin();
    $("[data-role=panel]").panel().enhanceWithin();
});

/*$(document).on("pagecreate", function () {
    $("[data-role=panel]").one("panelbeforeopen", function () {
        var height = $.mobile.pageContainer.pagecontainer("getActivePage").outerHeight();
        $(".ui-panel-wrapper").css("height", height + 1);
    });
});*/

var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
    
    //page transition fade é feia
    $.mobile.defaultPageTransition = "slide";

    broche.initializeAnim();
    draw.initialize();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  }
};

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
    serial.open({},
      function() {
        if($("#xfer-anim").is(":checked")) {
        
        }
        if($("#xfer-text").is(":checked")) {
          serial.write(msg);
          serial.writeHex('10',
            function succes() {
              alert("Sucesso!");
              serial.write("SQ");
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

app.initialize();
