jQuery(document).ready ->
  Crafty.init('940', '400')
  #the loading screen that will display while our assets load
  Crafty.background("#000");

  # Load components
  Crafty.c 'Turret',
    Turret: (turretType = 'firefox', gridX, gridY) ->
      # setup animations
      this.requires("SpriteAnimation, Collision, Grid")

  #turn the sprite map into usable components
  Crafty.sprite 32, "img/firefox.png",
      firefoxTurret: [0, 0]


  Crafty.sprite 32, "img/internet_explorer.png",
      ie_enemy: [0, 0]

  #the loading screen that will display while our assets load
  Crafty.scene "main", ->
    Crafty.e("2D, DOM, firefoxTurret")
                .attr({ x: 20 * 32, y: 10 * 32, z:1 })
                
    Crafty.e("2D, DOM, firefoxTurret")
                .attr({ x: 10 * 32, y: 20 * 32, z:1 })
                                          
    window.enemy= Crafty.e("2D, DOM, ie_enemy")
                .attr({ x: 2 * 16, y: 3 * 16, z:1 })
                .bind "enterframe", ->
                    this.rotation += rotation;
                    this.y -= this._yspeed;
                    this.x += this._xspeed;
                     
                    if(this._y > Crafty.viewport.height)
                        this.destroy();
                        if(!this.hit) 
                            score -= (index+1) * 10;
                            scoreEnt.text("Score: "+score); 

                
  Crafty.scene('main')

  PlaceTurrent = (type, x, y) ->
    Crafty.e("2D, DOM, firefoxTurret")
      .attr({ x: 20 * 16, y: 10 * 16, z:1 })
