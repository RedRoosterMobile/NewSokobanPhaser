


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

import { Tilemaps } from "phaser";




/*
TODO:
- camera follow OK... ish
- parallax - background (clouds)
- pooled bullets
- pooled enemies
- spawn enemies
- startship
- ships
- when flying sideways (no gravity, because of updrift, depending on speed)

*/

export class RauserScene extends Phaser.Scene {
    private phaserSprite: Phaser.GameObjects.Sprite;
    cursors:Phaser.Types.Input.Keyboard.CursorKeys;
    plane: Phaser.Physics.Arcade.Image;
    text: Phaser.GameObjects.Text;
    background: Phaser.GameObjects.Image;

    preload(): void {
        // https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/asteroids/bullets.png
        // https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/asteroids/ship.png




        this.load.image('bullet', 'assets/rauser/bullets.png');
        this.load.image('player', 'assets/rauser/plane1.png');
        this.load.image('player', 'assets/rauser/plane1.png');
        this.load.image('dasboot', 'assets/rauser/das_boot.png');

    }
    create():void {
        //this.background = this.add.image(400, 300, "background").setScale(1.7);



        // @ts-ignore
        let worldSizeX:number = parseInt(this.game.config.width) * 4;
        // @ts-ignore
        let worldSizeY:number = parseInt(this.game.config.height) * 4;


        // the total size of the world
        this.physics.world.setBounds(0, 0, worldSizeX, worldSizeY,true,true, true, true);
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0xff0000, 0xff0000, 0xffff00, 0xffff00, 1);
        graphics.fillRect(0, 0, worldSizeX, worldSizeY);
        //this.add.tileSprite(0, 0, 800*2, 600*2, 'background');
        this.background = this.add.image(worldSizeX/2, worldSizeY, "dasboot").setOrigin(0.5,1).setScale(10);



        this.plane = this.physics.add.image(400, 300, 'player');
        this.plane.setBounce(1, 0.2);
        this.plane.setCollideWorldBounds(true);

        // does not scale... why?
        this.plane.setScale(0.5);
        //this.sprite.setInteractive(true);
        const worldView = this.cameras.main.worldView;


        console.log(worldView.centerX);

        this.cameras.main.startFollow(this.plane, true,  0.09, 0.09);
        // zoom out
        this.cameras.main.setZoom(0.5);
        this.plane.setDamping(true);
        this.plane.setDrag(0.99);
        this.plane.setMaxVelocity(400);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
    }


updatePlane():void {
    const currentRotation = Math.abs(this.plane.rotation);
    // console.log(currentRotation);

    if (currentRotation<0.50) {
        //this.sprite.setDisplaySize(128,10);
        this.plane.setScale(0.5)

        //console.log('changing size',this.sprite.height);
    }

    this.plane.setScale(1)
}

update():void {
    //this.sprite.body.gameObject.
    this.updatePlane();

    if (this.cursors.up.isDown) {
        // @ts-ignore
        this.physics.velocityFromRotation(this.plane.rotation, 300*2, this.plane.body.acceleration);
    }
    else {
        this.plane.setAcceleration(0);
    }

    if (this.cursors.left.isDown) {
        this.plane.setAngularVelocity(-300);
    }
    else if (this.cursors.right.isDown) {
        this.plane.setAngularVelocity(300);
    }
    else {
        this.plane.setAngularVelocity(0);
    }

    // @ts-ignore
    this.text.setText('Speed: ' + this.plane.body.speed);

    // if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    // {
    //     fireBullet();
    // }

    //this.physics.world.wrap(this.sprite, 32);

    // bullets.forEachExists(screenWrap, this);
    }

}










