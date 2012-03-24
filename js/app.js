(function() {

  jQuery(document).ready(function() {
    var PlaceTurrent;
    Crafty.init('940', '400');
    Crafty.background("#000");
    Crafty.c('Enemy', {
      _xspeed: 3,
      _yspeed: 2,
      init: function() {},
      doeNep: function() {
        return console.log('hoi');
      }
    });
    Crafty.sprite(32, "img/firefox.png", {
      firefoxTurret: [0, 0]
    });
    Crafty.sprite(32, "img/internet_explorer.png", {
      ie_enemy: [0, 0]
    });
    Crafty.scene("main", function() {
      Crafty.e("2D, DOM, firefoxTurret").attr({
        x: 20 * 32,
        y: 10 * 32,
        z: 1
      });
      Crafty.e("2D, DOM, firefoxTurret").attr({
        x: 9 * 32,
        y: 12 * 32,
        z: 1
      });
      return window.enemy = Crafty.e("2D, DOM, ie_enemy, Enemy").attr({
        x: 2 * 16,
        y: 3 * 16,
        z: 1
      });
    });
    Crafty.scene('main');
    PlaceTurrent = function(type, x, y) {
      return Crafty.e("2D, DOM, firefoxTurret").attr({
        x: 20 * 16,
        y: 10 * 16,
        z: 1
      });
    };
    return Crafty.bind('EnterFrame', function() {
      return window.enemy.doeNep();
    });
  });

}).call(this);
