// Generated by CoffeeScript 1.4.0
(function() {

  jQuery(document).ready(function() {
    $('#cr-stage').mousedown(function(e) {
      return e.preventDefault();
    });
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
        if (obj1 && obj2) {
          distance = this.distance(obj1._center(), obj2._center());
          r_and_r = obj1._r + obj2._r;
          if (distance >= r_and_r) {
            return false;
          } else {
            real_length_r_and_r = Math.sqrt((obj1._r * obj1._r) + (obj2._r * obj2._r));
            return (distance <= r_and_r) || (distance < real_length_r_and_r);
          }
        }
      },
      detectCollisions: function() {
        var ei, enemy, i, tower, _i, _len, _ref, _results;
        _ref = this.towers;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          tower = _ref[i];
          _results.push((function() {
            var _j, _len1, _ref1, _results1;
            _ref1 = this.enemies;
            _results1 = [];
            for (ei = _j = 0, _len1 = _ref1.length; _j < _len1; ei = ++_j) {
              enemy = _ref1[ei];
              if (this.collided(tower, enemy)) {
                _results1.push(tower.fire(enemy));
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          }).call(this));
        }
        return _results;
      },
      spawnEnemies: function(number, interval) {
        var num, start, _i, _results;
        if (number == null) {
          number = 1;
        }
        if (interval == null) {
          interval = 5;
        }
        start = -1;
        _results = [];
        for (num = _i = 0; 0 <= number ? _i < number : _i > number; num = 0 <= number ? ++_i : --_i) {
          OpenTower.enemies[num] = Crafty.e("2D, DOM, ie_enemy, Enemy, OpenCollisionable").attr({
            x: (start - (interval * num)) * 32,
            y: 32,
            z: 1
          });
          _results.push(OpenTower.enemies[num].setLeIndex(num));
        }
        return _results;
      },
      removeEnemy: function(number) {
        return delete this.enemies[number];
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
      _name: 'Dr Evil',
      _movespeed: 6,
      _health: 100,
      _reward: 1,
      _direction: 'east',
      _waypoint: 0,
      init: function() {
        return this.bind('EnterFrame', this.doMove);
      },
      setLeIndex: function(val) {
        return this._le_index = val;
      },
      hit: function(damage) {
        console.log("I, " + this._name + ", index " + this._le_index + ", am hit and my health is " + this._health);
        this._health = this._health - damage;
        if (this._health <= 0) {
          OpenTower.removeEnemy(this._le_index);
          return this.destroy();
        }
      },
      doMove: function() {
        var change_waypoint_x_wise, change_waypoint_y_wise, enemy, movedir_x, movedir_y, next_wp, wp;
        enemy = this;
        wp = Map.waypoints[this._waypoint];
        next_wp = Map.waypoints[this._waypoint + 1];
        if (next_wp) {
          movedir_x = next_wp[0] - wp[0];
          movedir_x = movedir_x <= 0 ? (movedir_x === 0 ? 'none' : 'left') : 'right';
          change_waypoint_x_wise = false;
          if (movedir_x === 'left') {
            if (enemy.x > next_wp[0]) {
              enemy.x = enemy.x - enemy._movespeed;
            }
            if ((enemy.x - this._movespeed) <= next_wp[0]) {
              change_waypoint_x_wise = true;
            }
          } else if (movedir_x === 'right') {
            if (enemy.x < next_wp[0]) {
              enemy.x = enemy.x + enemy._movespeed;
            }
            if ((enemy.x + this._movespeed) >= next_wp[0]) {
              change_waypoint_x_wise = true;
            }
          } else {
            change_waypoint_x_wise = true;
          }
          movedir_y = next_wp[1] - wp[1];
          movedir_y = movedir_y <= 0 ? (movedir_y === 0 ? 'none' : 'up') : 'down';
          change_waypoint_y_wise = false;
          if (movedir_y === 'up') {
            if (enemy.y > next_wp[1]) {
              enemy.y = enemy.y - enemy._movespeed;
            }
            if ((enemy.y - this._movespeed) <= next_wp[1]) {
              change_waypoint_y_wise = true;
            }
          } else if (movedir_y === 'down') {
            if (enemy.y < next_wp[1]) {
              enemy.y = enemy.y + enemy._movespeed;
            }
            if ((enemy.y + this._movespeed) >= next_wp[1]) {
              change_waypoint_y_wise = true;
            }
          } else {
            change_waypoint_y_wise = true;
          }
          if (change_waypoint_x_wise === true && change_waypoint_y_wise === true) {
            return this._waypoint++;
          }
        } else {
          return this.destroy();
        }
      }
    });
    /*
      # Turret!
    */

    Crafty.c('Turret', {
      _target: null,
      _fireTimeout: 0,
      _rate: 10,
      _damage: 20,
      init: function() {
        this.requires('2D, DOM, firefoxTurret, Draggable, OpenCollisionable');
        this.bind("StopDrag", function(e) {
          this.x = Math.round(this.x / 32) * 32;
          return this.y = Math.round(this.y / 32) * 32;
        });
        return this.bind("EnterFrame", function() {
          if (this._fireTimeout !== 0) {
            return this._fireTimeout--;
          }
        });
      },
      checkCollision: function() {
        if (this._area.containsPoint(enemy.x, enemy.y)) {
          return enemy._movespeed = 0;
        }
      },
      fire: function(enemy) {
        if (this._fireTimeout === 0) {
          console.log("boom");
          enemy.hit(this._damage);
          return this._fireTimeout = this._fireTimeout + this._rate;
        }
      }
    });
    Crafty.sprite(32, "img/firefox.png", {
      firefoxTurret: [0, 0]
    });
    Crafty.sprite(32, "img/internet_explorer.png", {
      ie_enemy: [0, 0]
    });
    Crafty.sprite(32, "img/firefox_placable.png", {
      firefoxPlacable: [0, 0]
    });
    Crafty.scene("main", function() {
      OpenTower.towers.push(Crafty.e("Turret").attr({
        x: 550,
        y: 210,
        z: 1,
        h: 32,
        w: 32
      }));
      OpenTower.towers.push(Crafty.e("Turret").attr({
        x: 300,
        y: 210,
        z: 1,
        h: 32,
        w: 32
      }));
      return OpenTower.towers.push(Crafty.e("Turret").attr({
        x: 20,
        y: 210,
        z: 1,
        h: 32,
        w: 32
      }));
      /*
          OpenTower.enemies.push(Crafty.e("2D, DOM, ie_enemy, Enemy, OpenCollisionable")
                      .attr({ x: -1 * 32, y: 0, z:1 }))
          OpenTower.enemies.push(Crafty.e("2D, DOM, ie_enemy, Enemy, OpenCollisionable")
                      .attr({ x: -2 * 32, y: 0, z:1 }))
          OpenTower.enemies.push(Crafty.e("2D, DOM, ie_enemy, Enemy, OpenCollisionable")
                          .attr({ x: -4 * 32, y: 0, z:1 }))      
          OpenTower.enemies.push(Crafty.e("2D, DOM, ie_enemy, Enemy, OpenCollisionable")
                          .attr({ x: -10 * 32, y: 0, z:1 }))
      */

    });
    Crafty.scene('main');
    Crafty.bind('EnemyDestroyed', function(event) {
      return console.log(event);
    });
    return OpenTower.spawnEnemies(5);
  });

}).call(this);