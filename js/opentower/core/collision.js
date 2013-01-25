(function() {

  define(['opentower/core/core'], function(OpenTower) {
    OpenTower.collided = function(obj1, obj2) {
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
    };
    return OpenTower.detectCollisions = function() {
      return _.each(OpenTower.towers, function(tower, i) {
        return _.each(OpenTower.enemies, function(enemy, ei) {
          if (OpenTower.collided(tower, enemy)) {
            return tower.fire(enemy);
          }
        });
      });
    };
  });

}).call(this);
