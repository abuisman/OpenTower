(function() {

  jQuery(document).ready(function() {
    window.OpenTower = {
      towers: [],
      enemies: [],
      distance: function(set1, set2) {
        var dx, dy;
        dx = set2.x - set1.x;
        dy = set2.y - set1.y;
        return Math.sqrt((dx * dx) + (dy * dy));
      },
      collided: function(obj1, obj2) {
        var distance, r_and_r, real_length_r_and_r;
        distance = this.distance(obj1._center(), obj2._center());
        r_and_r = obj1._r + obj2._r;
        if (distance >= r_and_r) {
          return false;
        } else {
          real_length_r_and_r = Math.sqrt((obj1._r * obj1._r) + (obj2._r * obj2._r));
          return (distance <= r_and_r) || (distance < real_length_r_and_r);
        }
      },
      detectCollisions: function() {
        var ei, enemy, i, tower, _len, _len2, _ref, _ref2;
        _ref = this.towers;
        for (i = 0, _len = _ref.length; i < _len; i++) {
          tower = _ref[i];
          _ref2 = this.enemies;
          for (ei = 0, _len2 = _ref2.length; ei < _len2; ei++) {
            enemy = _ref2[ei];
            if (this.collided(tower, enemy)) return;
          }
        }
      }
    };
    window.Map = {
      waypoints: [[-1, 20], [777, 20], [777, 180], [64, 180], [63, 280], [980, 280]]
    };
    Crafty.init('940', '400');
    Crafty.bind('EnterFrame', function() {
      return OpenTower.detectCollisions();
    });
    Crafty.background("#75A874");
    window.MapDirections = [
      function(x, y) {
        if ((x > 777) && (y < 120 && y < 200)) return 'south';
      }, function(x, y) {
        if (x > 776 && (y > 200 && y < 300)) return 'west';
      }, function(x, y) {
        if (x < 64 && y > 200) return 'south';
      }, function(x, y) {
        if (x < 64 && y > 300) return 'east';
      }
    ];
    Crafty.c('OpenCollisionable', {
      _radius: 100,
      _center: function() {
        return {
          'x': this.x + (this._radius / 2),
          'y': this.y + (this._radius / 2)
        };
      },
      init: function() {
        return this._r = this._radius / 2;
      }
    });
    Crafty.c('Enemy', {
      _movespeed: 1,
      _health: 100,
      _reward: 1,
      _direction: 'east',
      init: function() {
        return this.bind('EnterFrame', this.doMove);
      },
      doMove: function() {
        switch (this._direction) {
          case 'north':
            this.y = this.y - this._movespeed;
            break;
          case 'east':
            this.x = this.x + this._movespeed;
            break;
          case 'south':
            this.y = this.y + this._movespeed;
            break;
          case 'west':
            this.x = this.x - this._movespeed;
        }
        return this.determineDirection();
      },
      determineDirection: function() {
        var enemy;
        enemy = this;
        return jQuery.each(MapDirections, function(index, func) {
          return enemy._direction = (func(enemy.x, enemy.y)) === void 0 ? enemy._direction : func(enemy.x, enemy.y);
        });
      }
    });
    /*
      # Turret!
    */
    Crafty.c('Turret', {
      _target: null,
      init: function() {},
      checkCollision: function() {
        if (this._area.containsPoint(enemy.x, enemy.y)) {
          console.log('it contains me');
          return enemy._movespeed = 0;
        }
      }
    });
    Crafty.sprite(32, "img/firefox.png", {
      firefoxTurret: [0, 0]
    });
    Crafty.sprite(32, "img/internet_explorer.png", {
      ie_enemy: [0, 0]
    });
    Crafty.scene("main", function() {
      OpenTower.towers.push(Crafty.e("2D, DOM, firefoxTurret, Turret, WiredHitBox, OpenCollisionable").attr({
        x: 550,
        y: 210,
        z: 1,
        h: 200,
        w: 200
      }));
      OpenTower.towers.push(Crafty.e("2D, DOM, firefoxTurret, Turret, WiredHitBox, OpenCollisionable").attr({
        x: 300,
        y: 210,
        z: 1,
        h: 200,
        w: 200
      }));
      OpenTower.towers.push(Crafty.e("2D, DOM, firefoxTurret, Turret, WiredHitBox, OpenCollisionable").attr({
        x: 20,
        y: 210,
        z: 1,
        h: 200,
        w: 200
      }));
      OpenTower.enemies.push(Crafty.e("2D, DOM, ie_enemy, Enemy, WiredHitBox, OpenCollisionable").attr({
        x: -1 * 32,
        y: 0,
        z: 1
      }));
      OpenTower.enemies.push(Crafty.e("2D, DOM, ie_enemy, Enemy, WiredHitBox, OpenCollisionable").attr({
        x: -2 * 32,
        y: 0,
        z: 1
      }));
      OpenTower.enemies.push(Crafty.e("2D, DOM, ie_enemy, Enemy, WiredHitBox, OpenCollisionable").attr({
        x: -4 * 32,
        y: 0,
        z: 1
      }));
      return OpenTower.enemies.push(Crafty.e("2D, DOM, ie_enemy, Enemy, WiredHitBox, OpenCollisionable").attr({
        x: -10 * 32,
        y: 0,
        z: 1
      }));
    });
    return Crafty.scene('main');
  });

}).call(this);
