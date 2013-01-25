(function() {

  define(function(require) {
    var OpenTower;
    require('libs/crafty');
    OpenTower = require('opentower/core/core');
    require('opentower/core/collision');
    window.OpenTower = OpenTower;
    return jQuery(document).ready(function() {
      $('#cr-stage').mousedown(function(e) {
        return e.preventDefault();
      });
      window.Map = {
        waypoints: [[-1, 20], [777, 20], [777, 180], [64, 180], [63, 280], [980, 280]]
      };
      Crafty.init('940', '400');
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
        _movespeed: 10,
        _health: 100,
        _reward: 1,
        _direction: 'east',
        _waypoint: 0,
        _hitbox: null,
        init: function() {
          var _this = this;
          this.requires('Collision');
          this.collision();
          this.bind('EnterFrame', this.doMove);
          return this.onHit('Bullet', function(bullet) {
            bullet = bullet[0].obj;
            return _this.doDamage(bullet._damage);
          });
        },
        setMyIndex: function(val) {
          return this._my_index = val;
        },
        doDamage: function(damage) {
          this._health = this._health - damage;
          if (this._health <= 0) {
            OpenTower.removeEnemy(this._my_index);
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
              this._waypoint++;
            }
          } else {
            this.destroy();
          }
          return Crafty.trigger('enemy:moved', this);
        }
      });
      /*
          # Bullet!
      */

      Crafty.c("Bullet", {
        _target: null,
        _goal: null,
        _speed: 10,
        _damage: 20,
        init: function() {
          window.bully = this;
          this.requires("2D, Canvas, Color, Physics, Collision, Tween, Bullet");
          this.color("red");
          this.attr({
            w: 5,
            h: 5
          });
          return this._goal = [0, 0];
        },
        go: function() {
          return this.tween({
            alpha: 0.0,
            x: this._target.x,
            y: this._target.y
          }, 5);
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
        _range: 100,
        init: function() {
          this.requires('2D, Canvas, firefoxTurret, Draggable, OpenCollisionable, WiredHitBox');
          this._hitbox = new Crafty.circle(this._x + 16, this._y + 16, this._range);
          this.collision(this._hitbox);
          this.bind("StopDrag", function(e) {
            this.x = Math.round(this.x / 32) * 32;
            return this.y = Math.round(this.y / 32) * 32;
          });
          this.bind("EnterFrame", function() {
            if (this._fireTimeout !== 0) {
              return this._fireTimeout--;
            }
          });
          return window.turry = this;
        },
        /*     
        checkCollision: ->
          if @_area.containsPoint(enemy.x, enemy.y)
            enemy._movespeed = 0
        */

        shootCannon: function(target) {
          var entity, tower;
          tower = this;
          Crafty.audio.play("laser");
          return entity = Crafty.e("Bullet").attr({
            x: tower._x,
            y: tower._y,
            _target: target,
            _damage: tower._damage
          }).go();
        },
        fire: function(enemy) {
          if (this._fireTimeout === 0) {
            this.shootCannon(enemy);
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
      Crafty.sprite(16, "img/bullet.png", {
        bullet: [0, 0]
      });
      Crafty.audio.add({
        laser: ["audio/laser.wav", "audio/laser.mp3", "audio/laser.ogg"]
      });
      Crafty.scene("main", function() {
        var tower1, tower2, tower3;
        console.log('main');
        tower1 = Crafty.e("Turret").attr({
          x: 550,
          y: 210,
          z: 1,
          h: 32,
          w: 32
        });
        tower2 = Crafty.e("Turret").attr({
          x: 400,
          y: 210,
          z: 1,
          h: 32,
          w: 32
        });
        tower3 = Crafty.e("Turret").attr({
          x: 600,
          y: 210,
          z: 1,
          h: 32,
          w: 32
        });
        OpenTower.towers.push(tower1);
        OpenTower.towers.push(tower2);
        OpenTower.towers.push(tower3);
        OpenTower.spawnEnemies(10);
        return Crafty.bind('EnterFrame', function() {
          return OpenTower.detectCollisions();
        });
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
      return Crafty.bind('EnemyDestroyed', function(event) {
        return console.log(event);
      });
    });
  });

}).call(this);
