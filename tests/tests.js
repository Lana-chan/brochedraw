var html_fixture = "../www/index.html";
var sources = ["./assert.js"];
var tests = [];

tests.push(function max_frame_increase () {
    document.getElementsById('anim-frame-count')[0].value = 6;
    setTimeout(function() {
      assert(document.getElementsById('anim-frame').slider("option", "max"), 6);
    }, 100);
})

/*tests.push(function max_frame_clamp () {
    assert(document.getElementsByClassName('chart')[0].id,
        "chart_60eb0dc5-6b41-4ca1-94d0-1760c1f3d87b");
})*/
