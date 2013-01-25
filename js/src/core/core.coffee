define ['libs/crafty', 'underscore'], () ->
    OpenTower =
      towers: []
      enemies: {}
      enemy_index: 0
      target_assignments: {}
      distance: (set1, set2) ->
        dx = set2.x - set1.x
        dy = set2.y - set1.y
        return Math.sqrt( (dx * dx) + (dy * dy) )
      ###
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
      ###
      spawnEnemies: (number = 1, interval = 5) ->
        start = -1
        for num in [0...number]
          #OpenTower.enemies[num] = Crafty.e("2D, DOM, ie_enemy, Enemy, OpenCollisionable, WiredHitBox").attr
          OpenTower.add_enemy Crafty.e("2D, Canvas, ie_enemy, Enemy, OpenCollisionable, WiredHitBox").attr
            x: (start - (interval * num)) * 32
            y: 32
            z:1

      add_enemy: (enemy) ->
        OpenTower.enemies[OpenTower.enemy_index] = enemy
        enemy.setMyIndex OpenTower.enemy_index
        OpenTower.enemy_index = OpenTower.enemy_index + 1

      removeEnemy: (number) ->
        delete this.enemies[number]
   
    
        # Return the OpenTower object (AMD)
    return OpenTower
