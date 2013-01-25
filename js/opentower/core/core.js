(function() {

  define(['libs/crafty', 'underscore'], function() {
    var OpenTower;
    OpenTower = {
      towers: [],
      enemies: {},
      enemy_index: 0,
      target_assignments: {},
      distance: function(set1, set2) {
        var dx, dy;
        dx = set2.x - set1.x;
        dy = set2.y - set1.y;
        return Math.sqrt((dx * dx) + (dy * dy));
      },
      /*
            collided: (obj1, obj2) ->
              if obj1 and obj2 
                distance = @distance(obj1._center(), obj2._center())
                r_and_r =  (obj1._r + obj2._r)
                if distance >= r_and_r
                  return false
                else
                  real_length_r_and_r = (Math.sqrt((obj1._r * obj1._r) + (obj2._r * obj2._r)))
                  return ((distance <= r_and_r) or (distance < real_length_r_and_r))
      
            detectCollisions: ->
              _.each OpenTower.towers, (tower, i) ->
                _.each OpenTower.enemies, (enemy, ei) ->
                  if OpenTower.collided(tower, enemy)
                    tower.fire(enemy)
                    #console.log ei + ' in range of tower ' + i
      */

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
          _results.push(OpenTower.add_enemy(Crafty.e("2D, Canvas, ie_enemy, Enemy, OpenCollisionable, WiredHitBox").attr({
            x: (start - (interval * num)) * 32,
            y: 32,
            z: 1
          })));
        }
        return _results;
      },
      add_enemy: function(enemy) {
        OpenTower.enemies[OpenTower.enemy_index] = enemy;
        enemy.setMyIndex(OpenTower.enemy_index);
        return OpenTower.enemy_index = OpenTower.enemy_index + 1;
      },
      removeEnemy: function(number) {
        return delete this.enemies[number];
      }
    };
    return OpenTower;
  });

}).call(this);
