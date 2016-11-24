casper.test.on("fail", function () {
    casper.exit(1);
});

casper.test.begin("Atualização de valor máximo de quadros", 2, function(test) {
  casper.start('www/index.html', function() {
    this.echo("Mudando número de quadros para 6");
    this.sendKeys('input[id="anim-frame-count"]', 6);
    var value = this.getElementAttribute('#anim-frame', 'max');
    test.assertEquals(value, "6", "Quadro máximo é 6");
    
    this.echo("Mudando quadro para 6");
    this.sendKeys('input[id="anim-frame"]', 6);
    this.echo("Mudando número de quadros para 4");
    this.sendKeys('input[id="anim-frame-count"]', 4);
    test.assertFieldCSS("#anim-frame", "4", "Quadro atual é 4");
  });
  
  casper.run(function() {
    test.done();
  });
});
