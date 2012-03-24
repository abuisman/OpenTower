(function() {

  jQuery(document).ready(function() {
    var PlaceTurrent;
    Crafty.init('940', '400');
    Crafty.background("#000");
    Crafty.c('Turret', {
      Turret: function(turretType, gridX, gridY) {
        if (turretType == null) turretType = 'firefox';
        return this.requires("SpriteAnimation, Collision, Grid");
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
        x: 10 * 32,
        y: 20 * 32,
        z: 1
      });
      return window.enemy = Crafty.e("2D, DOM, ie_enemy").attr({
        x: 2 * 16,
        y: 3 * 16,
        z: 1
      }).bind("enterframe", function() {
        this.rotation += rotation;
        this.y -= this._yspeed;
        this.x += this._xspeed;
        if (this._y > Crafty.viewport.height) {
          this.destroy();
          if (!this.hit) {
            score -= (index + 1) * 10;
            return scoreEnt.text("Score: " + score);
          }
        }
      });
    });
    Crafty.scene('main');
    return PlaceTurrent = function(type, x, y) {
      return Crafty.e("2D, DOM, firefoxTurret").attr({
        x: 20 * 16,
        y: 10 * 16,
        z: 1
      });
    };
  });

}).call(this);
