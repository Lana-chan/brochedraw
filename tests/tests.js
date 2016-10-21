casper.test.begin("Atualização de valor máximo de quadros", 2, function(test) {
  casper.start('www/index.html', function() {
    this.echo("Mudando número de quadros para 6");
    this.fill("form#anim-form", {
      "anim-frame-count": 6
    }, false);
    this.echo("Valor máximo para quadro deve ser 6 agora");
    var value = this.getElementAttribute('#anim-frame', 'max');
    test.assertEquals(value, "6");
    this.echo("Mudando quadro para 6");
    this.fill("form#anim-form", {
      "anim-frame": 6
    }, false);
    this.echo("Mudando número de quadros para 4");
    this.fill("form#anim-form", {
      "anim-frame-count": 4
    }, false);
    test.assertEquals(value, "4");
  }).run(function() {
    test.done();
  });
});
