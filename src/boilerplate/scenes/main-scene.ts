/**
 * @author       RedRoosterMobile
 * @copyright    2020 - 2099 da red rocking rooster
 * @license      {@link https://github.com/digitsensitive/phaser3-typescript/blob/master/LICENSE.md | MIT License}
 */

// https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/tilemaps/tiles/drawtiles1_n.png
// https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/tilemaps/tiles/drawtiles1.png
// https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/sprites/car90.png
// https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/tilemaps/csv/grid.csv



/*
https://www.crazygames.com/blog/2018/10/24/Sokoban-Series-Part-3-Handling-Input/


sample level

#   = wall   = 2
' ' = empty  = 0
.   = target = 1
$   = box    = 4
@   = player = 5

mod:
########
#c  @  #
## $   #
# . $  #
# .  $ #
##. ####
##  ####
########

########
####@  #
## $   #
# . $  #
# .  $ #
##. ####
##  ####
########

*/



 // copy this: https://phaser.io/examples/v3/view/game-objects/lights/dynamic-tilemap-layer
export class MainScene extends Phaser.Scene {
  private phaserSprite: Phaser.GameObjects.Sprite;

  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  light: Phaser.GameObjects.Light;
  layer: Phaser.Tilemaps.DynamicTilemapLayer;
  player: Phaser.GameObjects.Image;
  box: Phaser.GameObjects.Image;
  offsets = [];

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    this.load.image('tiles', [ 'assets/drawtiles1_4.png', 'assets/drawtiles1_n_4.png' ]);
    this.load.image('car', 'assets/car90.png');
    this.load.image('box', 'assets/car90.png');
    //this.load.tilemapCSV('map', 'assets/grid.csv');
    this.load.tilemapCSV('map', 'assets/sokoban_01.csv');
  }

  create(): void {
    //this.phaserSprite = this.add.sprite(400, 300, "car");
    var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });

    var tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);
    console.log(tileset);

    this.layer = map.createDynamicLayer(0, tileset, 0, 0).setPipeline('Light2D');


    this.layer.forEachTile( (tile) => {
      if (tile.index === 5) {
        this.player = this.add.image(tile.pixelX+16, tile.pixelY+16, 'car');
      } else if (tile.index === 4) {
        this.box = this.add.image(tile.pixelX+16, tile.pixelY+16, 'box').setTint(0x1188FF);
      }
    })
    

    this.cursors = this.input.keyboard.createCursorKeys();

    this.light = this.lights.addLight(0, 0, 200).setScrollFactor(0,0);

    this.lights.enable().setAmbientColor(0x555555);

    // this.input.on('pointermove', function (pointer) {

    //     light.x = pointer.x;
    //     light.y = pointer.y;

    // });

    this.lights.addLight(0, 100, 100).setColor(0xff0000).setIntensity(3.0);
    this.lights.addLight(0, 200, 100).setColor(0x00ff00).setIntensity(3.0);
    this.lights.addLight(0, 300, 100).setColor(0x0000ff).setIntensity(3.0);
    this.lights.addLight(0, 400, 100).setColor(0xffff00).setIntensity(3.0);

    this.offsets = [ 0.1, 0.3, 0.5, 0.7 ];
  }


  animate = (player:Phaser.GameObjects.Image, x:number,y:number,angle:number) => {
    this.player.x ;
    this.player.y = this.player.y + y;
    this.player.angle = angle;
  }

  update(): void {
    if (this.input.keyboard.checkDown(this.cursors.left, 100))
    {
        var tile = this.layer.getTileAtWorldXY(this.player.x - 32, this.player.y, true);

        if (tile.index === 2)
        {
            //  Blocked, we can't move
        }
        else
        {
          this.player.x -= 32;
          this.player.angle = 180;
          //this.anims.add()
          //this.animate(this.player,-32,this.player.y,180);
        }
    }
    else if (this.input.keyboard.checkDown(this.cursors.right, 100))
    {
        var tile = this.layer.getTileAtWorldXY(this.player.x + 32, this.player.y, true);

        if (tile.index === 2)
        {
            //  Blocked, we can't move
        }
        else
        {
          this.player.x += 32;
          this.player.angle = 0;
        }
    }
    else if (this.input.keyboard.checkDown(this.cursors.up, 100))
    {
        var tile = this.layer.getTileAtWorldXY(this.player.x, this.player.y - 32, true);

        if (tile.index === 2)
        {
            //  Blocked, we can't move
        }
        else
        {
          this.player.y -= 32;
          this.player.angle = -90;
        }
    }
    else if (this.input.keyboard.checkDown(this.cursors.down, 100))
    {
        var tile = this.layer.getTileAtWorldXY(this.player.x, this.player.y + 32, true);

        if (tile.index === 2)
        {
            //  Blocked, we can't move
        }
        else
        {
          this.player.y += 32;
          this.player.angle = 90;
        }
    }

    this.light.x = this.player.x;
    this.light.y = this.player.y;

    var index = 0;

    this.lights.forEachLight( (currLight)=> {
        if (this.light !== currLight)
        {
            currLight.x = 400 + Math.sin(this.offsets[index]) * 1000;
            this.offsets[index] += 0.02;
            index += 1;
        }
    });
  }
}
