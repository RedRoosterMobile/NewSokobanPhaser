


/*


var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            fps: 60,
            gravity: { y: 100 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
*/




/*
TODO: 
- camera follow
- parallax - background (clouds)
- pooled bullets
- poolet enemies
- spawn enemies
- ships
- 

*/

export class RauserScene extends Phaser.Scene {
    private phaserSprite: Phaser.GameObjects.Sprite;
    cursors:Phaser.Types.Input.Keyboard.CursorKeys;
    sprite: Phaser.Physics.Arcade.Image;
    text: Phaser.GameObjects.Text;
    
 
    preload(): void {
        // https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/asteroids/bullets.png
        // https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/asteroids/ship.png
        this.load.image('bullet', 'assets/rauser/bullets.png');
        this.load.image('ship', 'assets/rauser/ship.png');
    }
    create():void {

    this.sprite = this.physics.add.image(400, 300, 'ship');

    this.sprite.setDamping(true);
    this.sprite.setDrag(0.99);
    this.sprite.setMaxVelocity(200);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
}

update():void
{
    //this.sprite.body.gameObject.

    if (this.cursors.up.isDown)
    {
        // @ts-ignore: Unreachable code error
        this.physics.velocityFromRotation(this.sprite.rotation, 300, this.sprite.body.acceleration);
    }
    else
    {
        this.sprite.setAcceleration(0);
    }

    if (this.cursors.left.isDown)
    {
        this.sprite.setAngularVelocity(-300);
    }
    else if (this.cursors.right.isDown)
    {
        this.sprite.setAngularVelocity(300);
    }
    else
    {
        this.sprite.setAngularVelocity(0);
    }

    // @ts-ignore: Unreachable code error
    this.text.setText('Speed: ' + this.sprite.body.speed);

    // if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    // {
    //     fireBullet();
    // }

    this.physics.world.wrap(this.sprite, 32);

    // bullets.forEachExists(screenWrap, this);
}
  
}










