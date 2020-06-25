import { Tilemaps } from "phaser";

import {Plane} from './../sprites/plane-sprite';
import {Bullet} from './../sprites/bullet-image';
import {Enemy} from './../sprites/enemy-image';

/*
TODO:
- camera follow OK... ish
- parallax - background (clouds)
- pooled bullets OK
- pooled enemies
- bullet direction according to ship rotation
- spawn enemies
- startship OK
- ships
*/

var gameSettings = {
    maxEnemies: 2
};

export class RauserScene extends Phaser.Scene {
    private phaserSprite: Phaser.GameObjects.Sprite;
    // plane: Phaser.Physics.Arcade.Image;
    planeObj: Plane;
    text: Phaser.GameObjects.Text;
    background: Phaser.GameObjects.Image;
    dasBoot: Phaser.GameObjects.Image;
    enemyBullets: Phaser.Physics.Arcade.Group;
    playerBullets: Phaser.Physics.Arcade.Group;
    enemies:Phaser.Physics.Arcade.Group


    preload(): void {
        // https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/asteroids/bullets.png
        // https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/asteroids/ship.png
        this.load.image('bullet', 'assets/rauser/bullets.png');
        this.load.image('player', 'assets/rauser/plane1.png');

        this.load.image('enemy', 'assets/car90.png');

        this.load.image('planeBody', 'assets/rauser/plane_body.png');
        this.load.image('planePhysics', 'assets/rauser/plane_transparent.png');
        this.load.image('planeWings', 'assets/rauser/plane_wings.png');
        this.load.atlas("boostSprites", 'assets/rauser/boost.png', 'assets/rauser/boost.json');

        this.load.image('dasboot', 'assets/rauser/das_boot.png');

        this.load.audio('sndMachineGun', 'assets/rauser/sounds/bassy_machine_gun.ogg');
        this.load.audio('sndGameMusic', 'assets/rauser/sounds/loop.ogg');
    }

    create():void {
        // this.background = this.add.image(400, 300, "background").setScale(1.7);
        //this.sound.add("sndGameMusic").play();
        const soundConfig = {
            mute: false,
            volume: 0.5,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
          };

        //this.sound.play('sndGameMusic',soundConfig);

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
        this.cameras.main.setZoom(0.4);

        this.cameras.main.startFollow(this.planeObj.plane, true,  0.09, 0.09);

        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        this.text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
// Add 2 groups for Bullet objects
this.playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
this.enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

        this.physics.add.collider(this.playerBullets, this.enemies, ()=>{
            console.log('hit me baby one more time');
        });




    // Fires bullet from player on left click of mouse
    this.input.on('pointerdown',  (pointer, time, lastFired)=> {

        // Get bullet from bullets group
        /*
        let bullet: Bullet = this.playerBullets.get().setActive(true).setVisible(true);
        if (bullet) {
            console.log('schiessbefehl!');
            bullet.fireAtTarget(this.planeObj.plane, {x:worldSizeX,y:0});
        }

        let bullet2: Bullet = this.playerBullets.get().setActive(true).setVisible(true);
        if (bullet2) {
            console.log('schiessbefehl! 2');
            bullet2.fireStraight(this.planeObj.plane);
        }
        */

        let bullet3: Bullet = this.playerBullets.get().setActive(true).setVisible(true);
        if (bullet3) {
            console.log('schiessbefehl! 3');
            // @ts-ignore
            bullet3.fireAtTarget(this.planeObj.plane, {x:this.planeObj.plane.body.acceleration.y,y:this.planeObj.plane.body.acceleration.x});
        }

    });
    }






  update():void {
    this.planeObj.updatePlane();

    if (this.enemies.getLength()<gameSettings.maxEnemies) {

        // @ts-ignore
        let worldSizeX:number = parseInt(this.game.config.width) * 4;
        // @ts-ignore
        let worldSizeY:number = parseInt(this.game.config.height) * 4;
        let anEnemy: Enemy = this.enemies.get().setActive(true).setVisible(true);
        anEnemy.x = Phaser.Math.Between(0,worldSizeX);
        anEnemy.y = Phaser.Math.Between(0,worldSizeY);
        //anEnemy.x = worldSizeX/2;
        //anEnemy.y = worldSizeY/2;
        console.log('creating enemy at ',anEnemy.x, anEnemy.y );
    }
    // @ts-ignore
    this.text.setText('Speed: ' + this.planeObj.plane.body.speed);
  }

}










