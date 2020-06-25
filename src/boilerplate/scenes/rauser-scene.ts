import { Tilemaps } from "phaser";

import {Plane} from './../sprites/plane-sprite';

/*
TODO:
- camera follow OK... ish
- parallax - background (clouds)
- pooled bullets
- pooled enemies
- spawn enemies
- startship OK
- ships
*/

export class RauserScene extends Phaser.Scene {
    private phaserSprite: Phaser.GameObjects.Sprite;
    // plane: Phaser.Physics.Arcade.Image;
    planeObj: Plane;
    text: Phaser.GameObjects.Text;
    background: Phaser.GameObjects.Image;
    dasBoot: Phaser.GameObjects.Image;

    preload(): void {
        // https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/asteroids/bullets.png
        // https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/asteroids/ship.png
        this.load.image('bullet', 'assets/rauser/bullets.png');
        this.load.image('player', 'assets/rauser/plane1.png');

        this.load.image('planeBody', 'assets/rauser/plane_body.png');
        this.load.image('planePhysics', 'assets/rauser/plane_transparent.png');
        this.load.image('planeWings', 'assets/rauser/plane_wings.png');

        this.load.image('dasboot', 'assets/rauser/das_boot.png');
    }
    create():void {
        //this.background = this.add.image(400, 300, "background").setScale(1.7);

        // @ts-ignore
        let worldSizeX:number = parseInt(this.game.config.width) * 4;
        // @ts-ignore
        let worldSizeY:number = parseInt(this.game.config.height) * 4;


        // the total size of the world
        this.physics.world.setBounds(0, 0, worldSizeX, worldSizeY, true, true, true, true);
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0xff0000, 0xff0000, 0xffff00, 0xffff00, 1);
        graphics.fillRect(0, 0, worldSizeX, worldSizeY);
        //this.add.tileSprite(0, 0, 800*2, 600*2, 'background');
        this.dasBoot = this.add.image(worldSizeX/2, worldSizeY, "dasboot").setOrigin(0.5,1).setScale(10);

        const worldView = this.cameras.main.worldView;

        this.planeObj = new Plane(
            this,
            worldSizeX/2,
            worldSizeY
        );
        this.cameras.main.setZoom(0.5);

        this.cameras.main.startFollow(this.planeObj.plane, true,  0.09, 0.09);

        this.text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
    }

  update():void {
    this.planeObj.updatePlane();
    // @ts-ignore
    this.text.setText('Speed: ' + this.planeObj.plane.body.speed);
  }

}










