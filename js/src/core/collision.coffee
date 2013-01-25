define ['opentower/core/core'], (OpenTower) ->
  OpenTower.collided = (obj1, obj2) ->
        if obj1 and obj2 
          distance = @distance(obj1._center(), obj2._center())
          r_and_r =  (obj1._r + obj2._r)
          if distance >= r_and_r
            return false
          else
            real_length_r_and_r = (Math.sqrt((obj1._r * obj1._r) + (obj2._r * obj2._r)))
            return ((distance <= r_and_r) or (distance < real_length_r_and_r))
  
  OpenTower.detectCollisions = ->
        _.each OpenTower.towers, (tower, i) ->
          _.each OpenTower.enemies, (enemy, ei) ->
            if OpenTower.collided(tower, enemy)
              tower.fire(enemy)
              #console.log ei + ' in range of tower ' + i 

