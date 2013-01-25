define((require) ->
  
  # Load Crafty
  require('libs/crafty')
  
  # Load OpenTower
  OpenTower = require('opentower/core/core')
  
  # Load plugins
  require('opentower/core/collision')

  # Debug helper
  window.OpenTower = OpenTower

  # New version
  jQuery(document).ready ->
    # Disable clickevents
    $('#cr-stage').mousedown (e) ->
      e.preventDefault()

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

    #the loading screen that will display while our assets load
    Crafty.background("#75A874");

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
      _name: 'Dr Evil'
      _movespeed: 10
      _health: 100
      _reward: 1
      _direction: 'east'
      _waypoint: 0
      _hitbox: null
      init: ->
        this.requires 'Collision'
        this.collision()
        @bind 'EnterFrame', @doMove

        @onHit 'Bullet', (bullet) =>
          bullet = bullet[0].obj
          #console.log "hitty"
          @doDamage(bullet._damage)
      
      setMyIndex: (val) ->
        @_my_index = val
      
      doDamage: (damage) ->
        #console.log "I, #{@_name}, index #{@_my_index}, am hit with #{damage} and my health is #{@_health}"
        @_health = @_health - damage
        if @_health <= 0
          OpenTower.removeEnemy(@_my_index)
          this.destroy()

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
          
          if (change_waypoint_x_wise == true and change_waypoint_y_wise == true)
            @_waypoint++
        else 
          this.destroy()

        Crafty.trigger('enemy:moved', this)

    ###
    # Bullet!
    ###
    Crafty.c "Bullet"
      _target: null
      _goal: null
      _speed: 10
      _damage: 20
      init: ->
        window.bully = this
        this.requires "2D, Canvas, Color, Physics, Collision, Tween, Bullet"
        this.color "red"
        this.attr(w: 5, h: 5)
        @_goal = [0, 0]
      go: ->
        this.tween({alpha: 0.0, x: @_target.x, y: @_target.y}, 5)

    
    ###
    # Turret!
    ###
    Crafty.c 'Turret',
      _target: null
      _fireTimeout: 0
      _rate: 10
      _damage: 20
      _range: 100
      init: ->
        # Set the initial area that this turret will target
        #console.log @collision(new Crafty.circle(@x,@y,200))
        #@bind 'EnterFrame', @checkCollision
        this.requires('2D, Canvas, firefoxTurret, Draggable, OpenCollisionable, WiredHitBox')
        
        @_hitbox = new Crafty.circle(this._x+16, this._y+16, @_range)

        this.collision(@_hitbox)

        this.bind "StopDrag", (e) ->
                        # snap to grid
                        this.x = Math.round(this.x / 32) * 32
                        this.y = Math.round(this.y / 32) * 32
        this.bind "EnterFrame", ->
          @_fireTimeout-- unless @_fireTimeout == 0

        window.turry = this
      
      ###     
      checkCollision: ->
        if @_area.containsPoint(enemy.x, enemy.y)
          enemy._movespeed = 0
      ###
      
      shootCannon: (target) ->
        tower = this
        Crafty.audio.play("laser")
        entity = Crafty.e("Bullet").attr(x: tower._x, y: tower._y, _target: target, _damage: tower._damage).go()

      fire: (enemy) ->
        if @_fireTimeout == 0
          @shootCannon(enemy)
          @_fireTimeout = @_fireTimeout + @_rate

    #turn the sprite map into usable components
    Crafty.sprite 32, "img/firefox.png",
        firefoxTurret: [0, 0]

    Crafty.sprite 32, "img/internet_explorer.png",
        ie_enemy: [0, 0]

    Crafty.sprite 32, "img/firefox_placable.png",
        firefoxPlacable: [0, 0]

    Crafty.sprite 16, "img/bullet.png",
        bullet: [0, 0]

    # Load audio
    Crafty.audio.add laser: ["audio/laser.wav", "audio/laser.mp3", "audio/laser.ogg"]

    #the loading screen that will display while our assets load
    Crafty.scene "main", ->
      console.log 'main'
      tower1 = Crafty.e("Turret").attr({ x: 550, y: 210, z:1, h: 32, w: 32 })
      tower2 = Crafty.e("Turret").attr({ x: 400, y: 210, z:1, h: 32, w: 32 })
      tower3 = Crafty.e("Turret").attr({ x: 600, y: 210, z:1, h: 32, w: 32 })
    
      OpenTower.towers.push (tower1)
      OpenTower.towers.push (tower2)
      OpenTower.towers.push (tower3)

      OpenTower.spawnEnemies(10)
                     
      Crafty.bind('EnterFrame', -> OpenTower.detectCollisions())
      
      #OpenTower.towers.push (Crafty.e("Turret")
      #                .attr({ x: 550, y: 210, z:1, h: 32, w: 32 }))
      #OpenTower.towers.push (Crafty.e("Turret")
      #                .attr({ x: 300, y: 210, z:1, h: 32, w: 32 }))
      #OpenTower.towers.push (Crafty.e("Turret")
      #                .attr({ x: 20, y: 210, z:1, h: 32, w: 32 }))
      
      ###
      OpenTower.enemies.push(Crafty.e("2D, DOM, ie_enemy, Enemy, OpenCollisionable")
                  .attr({ x: -1 * 32, y: 0, z:1 }))
      OpenTower.enemies.push(Crafty.e("2D, DOM, ie_enemy, Enemy, OpenCollisionable")
                  .attr({ x: -2 * 32, y: 0, z:1 }))
      OpenTower.enemies.push(Crafty.e("2D, DOM, ie_enemy, Enemy, OpenCollisionable")
                      .attr({ x: -4 * 32, y: 0, z:1 }))      
      OpenTower.enemies.push(Crafty.e("2D, DOM, ie_enemy, Enemy, OpenCollisionable")
                      .attr({ x: -10 * 32, y: 0, z:1 }))      
      ###

      
    #Crafty.bind 'EnterFrame', ->
      #window.enemy.doMove()
    
    Crafty.scene('main')

    Crafty.bind 'EnemyDestroyed', (event) ->
      console.log event
)
