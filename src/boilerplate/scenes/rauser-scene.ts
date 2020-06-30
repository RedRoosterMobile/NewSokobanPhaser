import { Tilemaps } from "phaser";

import {Plane} from './../sprites/plane-sprite';
import {Bullet} from './../sprites/bullet-image';
import {Enemy} from './../sprites/enemy-image';
import {Background} from './../sprites/background-sprite';
import {DamageParticle} from './../sprites/damage-particle';

/*


https://community.adobe.com/t5/air/adobe-air-error-message-macosx-catalina/td-p/10683302?page=1

TODO:
- camera follow OK... ish
- unlimited x tiled background (no left/right bounds!)
- parallax - background (clouds)
- pooled bullets OK
- pooled enemies OK
- bullet direction according to ship rotation (shoot straight!)
- spawn enemies OK
- startship OK
- battleships (drop bombs?)
- deep techno sound that changes parts upon user interaction (timing?)
- idea: fade in when sth happens and fade out after a while (sinus LFOs?)
- yep, this is how THEY did it.. /Applications/Luftrausers.app/Contents/Resources/data/bgm/luftrauser_bass3.ogg
- post processing: shaders https://www.shadertoy.com/view/4slGRM
- camera: base on rotation?
- https://unwinnable.com/2014/06/16/notes-on-luftrausers/


"When you rotate your plane in Luftrausers, the camera swings around like it has been attached
to the end of a morning star. You continue to move left across the screen with your last thrust,
but as you rotate to face the right, the camera swings around, always keeping your plane’s tail
closer to one edge of the screen or another. Thrust forward again and the plane is practically
slammed against that edge of the screen, like the pilot’s head would be slammed against their chair.
It’s nauseating, but it communicates an excessive amount of feedback through the simple act of
rotating a thumbstick left or right then jamming it straight forward."
*/

var gameSettings = {
    maxEnemies: 1,
    zoom: 0.3
};

export class RauserScene extends Phaser.Scene {
    private phaserSprite: Phaser.GameObjects.Sprite;
    // plane: Phaser.Physics.Arcade.Image;
    planeObj: Plane;
    text: Phaser.GameObjects.Text;
    background: Background;
    dasBoot: Phaser.GameObjects.Image;
    enemyBullets: Phaser.Physics.Arcade.Group;
    playerBullets: Phaser.Physics.Arcade.Group;
    enemies:Phaser.Physics.Arcade.Group


    preload(): void {
        // https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/asteroids/bullets.png
        // https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/asteroids/ship.png
        this.load.image('bullet', 'assets/rauser/bullets.png');
        this.load.image('player', 'assets/rauser/plane1.png');
        this.load.image('bgGradient', 'assets/rauser/bg_gradient.png');

        this.load.image('enemy', 'assets/car90.png');

        this.load.image('planeBody', 'assets/rauser/plane_body-fs8.png');
        this.load.image('planePhysics', 'assets/rauser/plane_transparent-fs8.png');
        this.load.image('planeWings', 'assets/rauser/plane_wings-fs8.png');

        this.load.atlas("boostSprites", 'assets/rauser/boost-fs8.png', 'assets/rauser/boost.json');
        this.load.spritesheet('debreeSprite','assets/rauser/debree_sprite.png', { frameWidth: 1, frameHeight: 1 });

        this.load.image('dasboot', 'assets/rauser/das_boot-fs8.png');

        this.load.image('bg1', 'assets/rauser/clouds_pixel_800_600-fs8.png');

        this.load.audio('sndMachineGun', 'assets/rauser/sounds/bassy_machine_gun.ogg');
        this.load.audio('sndGameMusic', 'assets/rauser/sounds/loop.ogg');
        this.load.audio('sndExplosion', 'assets/rauser/sounds/explosion.mp3');
    }

    getWorldSize():any {
        // @ts-ignore
        const worldSizeX:number = parseInt(this.game.config.width) * 4;
        // @ts-ignore
        const worldSizeY:number = parseInt(this.game.config.height) * 4;
        return {worldSizeX,worldSizeY};
    }

    create():void {
        const soundConfig = {
            mute: false,
            volume: 0.0,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
          };
        this.sound.play('sndGameMusic',soundConfig);

        const {worldSizeX,worldSizeY} = this.getWorldSize();

        const waterDepth = 400;
        // the total size of the world
        this.physics.world.setBounds(0, 0, worldSizeX, worldSizeY+waterDepth, false, false, true, true);
        //const graphics = this.add.graphics();
        //graphics.fillGradientStyle(0xff0000, 0xff0000, 0xffff00, 0xffff00, 1);
        //graphics.fillRect(0, 0, worldSizeX, worldSizeY);
        this.background = new Background(this,0,0,worldSizeX,worldSizeY);


        /*this.sky = scene.add
        .tileSprite(0, 0, x * 2, y * 2, "sky")
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setTint(0xffeeff);*/

        //this.add.tileSprite(0, 0, 800*2, 600*2, 'background');
        this.dasBoot = this.add.image(worldSizeX/2, worldSizeY, "dasboot").setOrigin(0.5,1).setScale(10);

        const worldView = this.cameras.main.worldView;

        this.planeObj = new Plane(
            this,
            worldSizeX/2,
            worldSizeY
        );
        this.cameras.main.setZoom(gameSettings.zoom);

        this.cameras.main.startFollow(this.planeObj.camMuzzle, true,  0.09, 0.09);

        // TODO: go back to normal array..
        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });

        this.text = this.add.text(10, 10, '', { font: '64px Courier', fill: '#00ff00' });

        // Add 2 groups for Bullet objects
        this.playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

        // player shoots enemy
        this.physics.add.overlap(this.playerBullets,this.enemies,(playerBullet:Bullet, enemy:Enemy)=>{
            playerBullet.setActive(false);
            playerBullet.setVisible(false);
            enemy.decreaseHealth(2);
        });
        // player and enemy collide
        this.physics.add.overlap(this.planeObj.plane,this.enemies,(player:any, enemy:Enemy)=>{
            // TODO only once per
            console.log('crashing..');
            enemy.decreaseHealth(0.2);
            this.planeObj.decreaseHealth(0.2);
        });
        // enemy shoots player
        this.physics.add.overlap(this.enemyBullets,this.planeObj.plane,(enemyBullet:Bullet, player:any) => {
            console.log('player got hit');
            // somehow this is destroying the player..
            enemyBullet.setActive(false);
            enemyBullet.setVisible(false);
            this.planeObj.decreaseHealth(5);
        });

        const playerFireCallBack = () => {
            const bullet: Bullet = this.playerBullets.get().setActive(true).setVisible(true);
            const bullet2: Bullet = this.playerBullets.get().setActive(true).setVisible(true);
            const bullet3: Bullet = this.playerBullets.get().setActive(true).setVisible(true);
            if (bullet) {
                //  d.translateX
                //bullet.fireStraight(this.planeObj.plane);
                //http://labs.phaser.io/edit.html?src=src\game%20objects\container\parent%20matrix.js
                // https://phaser.discourse.group/t/translate-inner-position-of-rotating-container-into-absolute-position/1762
                //https://phaser.discourse.group/t/object-position-to-canvas-pixel-position/1099/6
                // @ts-ignore

                const targetRotation = this.planeObj.plane.rotation;
                const targetAngle = Phaser.Math.RadToDeg(targetRotation);
                const diff = 10;
                bullet.fireStraight2(this.planeObj.muzzle.x,this.planeObj.muzzle.y,targetRotation);
                bullet2.fireStraight2(this.planeObj.muzzle.x,this.planeObj.muzzle.y,Phaser.Math.DegToRad(targetAngle-diff));
                bullet3.fireStraight2(this.planeObj.muzzle.x,this.planeObj.muzzle.y,Phaser.Math.DegToRad(targetAngle+diff));
                const en = this.enemies.getFirstAlive();
                if (en) {
                    //bullet3.fireAtTarget(this.planeObj.plane, {x:en.x,y:en.y});
                    // somehow use world coordinates for muzzle
                    // http://labs.phaser.io/edit.html?src=src\game%20objects\container\parent%20matrix.js
                    //bullet.fireStraight2(this.planeObj.muzzle.displayOriginX,this.planeObj.muzzle.displayOriginY,this.planeObj.plane.rotation);
                }
            }
        }
        // todo: heatseaking missle fireAtTarget (get closetst enemy?)
        this.planeObj.setFireCallback(playerFireCallBack);

        // Fires bullet from player on left click of mouse
        this.input.on('pointerdown',  (pointer, time, lastFired)=> {
            // Get bullet from bullets group
            // TODO: move into player class
            playerFireCallBack();
        });



        // use: white gray and dark pixel frame
        // explosion animation gray and white and black circles
        /*let emitter = particles.createEmitter({
            alpha: { start: 1, end: 0 },
            scale: { start: 0.5, end: 2.5 },
            //tint: { start: 0xff945e, end: 0xff945e },
            speed: 20,
            accelerationY: -300,
            angle: { min: -85, max: -95 },
            rotate: { min: -180, max: 180 },
            lifespan: { min: 1000, max: 1100 },
            blendMode: 'ADD',
            frequency: 110,
            maxParticles: 10,
            // @ts-ignore
            particleClass: DamageParticle

        });*/




    }

    // TODO: spawn closer to player (world coordinates)
    spawnEnemies():void {
        if (this.enemies.getLength() < gameSettings.maxEnemies) {
            const {worldSizeX,worldSizeY} = this.getWorldSize();
            let anEnemy: Enemy = this.enemies.get().setActive(true).setVisible(true);

            Phaser.Actions.RotateAroundDistance([anEnemy], this.planeObj, Phaser.Math.DegToRad(Phaser.Math.Between(0+180+90,180+180+90)), (this.game.config.height as number)*4 );
            //anEnemy.x = Phaser.Math.Between(0,worldSizeX);
            //anEnemy.y = Phaser.Math.Between(0,worldSizeY);
            anEnemy.setTarget(this.planeObj.plane);
            anEnemy.setBullets(this.enemyBullets);
            //this.planeObj.x
            //this.planeObj.y

            console.log('creating enemy at ',anEnemy.x, anEnemy.y );
        }

    }


  update(time, delta):void {
    if (this.planeObj)
        this.planeObj.updatePlane();

    if (this.planeObj.active) {
        this.spawnEnemies();
        const velocity = this.planeObj.plane.body.velocity;
        this.background.updateBackground(velocity.x,velocity.y);
    }


    // @ts-ignore
    //this.text.setText('Speed: ' + this.planeObj.plane.body.speed+ ' fps:'+ this.game.loop.actualFps);

  }

}










