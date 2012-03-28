jQuery(document).ready ->

  # Disable clickevents
  $('#cr-stage').mousedown (e) ->
    e.preventDefault()

  window.OpenTower =
    towers: []
    enemies: []
    distance: (set1, set2) ->
      dx = set2.x - set1.x
      dy = set2.y - set1.y
      return Math.sqrt( (dx * dx) + (dy * dy) )
    collided: (obj1, obj2) ->
      distance = @distance(obj1._center(), obj2._center())
      r_and_r =  (obj1._r + obj2._r)
      if distance >= r_and_r
        return false
      else
        real_length_r_and_r = (Math.sqrt((obj1._r * obj1._r) + (obj2._r * obj2._r)))
        return ((distance <= r_and_r) or (distance < real_length_r_and_r))
    detectCollisions: ->
      for tower, i in @towers
        for enemy, ei in @enemies
          if @collided(tower, enemy)
            return
            #console.log ei + ' in range of tower ' + i

  window.Map =
    waypoints:
      [
        [-1, 20]
        [777, 20]
        [777, 180]
        [64, 180]
        [63, 280]
        [980, 280]
      ]

  Crafty.init('940', '400')
  
  Crafty.bind('EnterFrame', -> OpenTower.detectCollisions())

  #the loading screen that will display while our assets load
  Crafty.background("#75A874");

  window.MapDirections=[
    (x, y) ->
      if (x > 777) and (y < 120 and y < 200)
        return 'south'
    (x, y) ->
      if x > 776 and (y > 200 and y < 300)
        return 'west'
    (x, y) ->
      if x < 64 and y > 200
        return 'south'
    (x, y) ->
      if x < 64 and y > 300
        return 'east'
  ]

  Crafty.c 'OpenCollisionable',
    _radius: 100
    _center: ->
      # Get the center coordinate of the current object
      # Return [x, y]
      {'x': this.x + (@_radius/2), 'y': this.y + (@_radius/2)}
    init: ->
      # Set the half radius. If you want a different radius on an object, recaculate when needed
      @_r = @_radius/2

  # Load components
  Crafty.c 'Enemy',
    _movespeed: 6
    _health: 100
    _reward: 1
    _direction: 'east'
    _waypoint: 0
    init: ->
      @bind 'EnterFrame', @doMove
    doMove: ->
      enemy = this
      wp = Map.waypoints[@_waypoint]
      next_wp = Map.waypoints[@_waypoint+1]

      if next_wp
       
        # first determine general direction
        movedir_x = next_wp[0] - wp[0]
        movedir_x = if movedir_x <= 0 then (if movedir_x == 0 then 'none' else 'left') else 'right'
        
        # move accordingly on x-axis
        change_waypoint_x_wise = false
        if movedir_x == 'left'
            if enemy.x > next_wp[0]
              enemy.x = enemy.x - enemy._movespeed
            if (enemy.x - @_movespeed) <= next_wp[0]
              change_waypoint_x_wise = true
        else if movedir_x == 'right'
            if enemy.x < next_wp[0]
              enemy.x = enemy.x + enemy._movespeed
            if (enemy.x + @_movespeed) >= next_wp[0]
              change_waypoint_x_wise = true
        else
          change_waypoint_x_wise = true

        #console.log 'x:' +  change_waypoint_x_wise + ' to x ' + next_wp[0]
        
        # Checking if moving up or down.
        movedir_y = next_wp[1] - wp[1]
        movedir_y = if movedir_y <= 0 then (if movedir_y == 0 then 'none' else 'up') else 'down'
        
        # move accordingly on y-axis
        change_waypoint_y_wise = false
        # move accordingly on y-axis
        if movedir_y == 'up'
            if enemy.y > next_wp[1]
              enemy.y = enemy.y - enemy._movespeed
            if (enemy.y - @_movespeed) <= next_wp[1]
              change_waypoint_y_wise = true
        else if movedir_y == 'down'
            if enemy.y < next_wp[1]
              enemy.y = enemy.y + enemy._movespeed
            if (enemy.y + @_movespeed) >= next_wp[1]
              change_waypoint_y_wise = true
        else
            change_waypoint_y_wise = true
        
        #console.log 'y:' + change_waypoint_y_wise + ' ti y ' + next_wp[1]
        if (change_waypoint_x_wise == true and change_waypoint_y_wise == true)
          @_waypoint++;
      else 
        this.destroy()
  ###
  # Turret!
  ###
  Crafty.c 'Turret',
    _target: null
    init: ->
      # Set the initial area that this turret will target
      #console.log @collision(new Crafty.circle(@x,@y,200))
      #@bind 'EnterFrame', @checkCollision
    checkCollision: ->
      if @_area.containsPoint(enemy.x, enemy.y)
        console.log('it contains me')
        enemy._movespeed = 0

  #turn the sprite map into usable components
  Crafty.sprite 32, "img/firefox.png",
      firefoxTurret: [0, 0]

  Crafty.sprite 32, "img/internet_explorer.png",
      ie_enemy: [0, 0]

  Crafty.sprite 32, "img/firefox_placable.png",
      firefoxPlacable: [0, 0]

  #the loading screen that will display while our assets load
  Crafty.scene "main", ->

    placableTower = Crafty.e("2D, DOM, firefoxPlacable, Draggable")
                    .attr({ x: 100, y: 100, z:1, h: 32, w: 32 })
                    .bind "StartDrag", (e) ->
                    .bind "StopDrag", (e) ->
                      this.x = Math.round(this.x / 32) * 32
                      this.y = Math.round(this.y / 32) * 32

    OpenTower.towers.push (Crafty.e("2D, DOM, firefoxTurret, Turret, OpenCollisionable")
                    .attr({ x: 550, y: 210, z:1, h: 200, w: 200 }))
    OpenTower.towers.push (Crafty.e("2D, DOM, firefoxTurret, Turret, OpenCollisionable")
                    .attr({ x: 300, y: 210, z:1, h: 200, w: 200 }))
    OpenTower.towers.push (Crafty.e("2D, DOM, firefoxTurret, Turret, OpenCollisionable")
                    .attr({ x: 20, y: 210, z:1, h: 200, w: 200 }))

    OpenTower.enemies.push(Crafty.e("2D, DOM, ie_enemy, Enemy, OpenCollisionable")
                .attr({ x: -1 * 32, y: 0, z:1 }))
    OpenTower.enemies.push(Crafty.e("2D, DOM, ie_enemy, Enemy, OpenCollisionable")
                .attr({ x: -2 * 32, y: 0, z:1 }))
    OpenTower.enemies.push(Crafty.e("2D, DOM, ie_enemy, Enemy, OpenCollisionable")
                    .attr({ x: -4 * 32, y: 0, z:1 }))      
    OpenTower.enemies.push(Crafty.e("2D, DOM, ie_enemy, Enemy, OpenCollisionable")
                    .attr({ x: -10 * 32, y: 0, z:1 }))      


    
  #Crafty.bind 'EnterFrame', ->
    #window.enemy.doMove()
  
  Crafty.scene('main')
