import { Tilemaps } from 'phaser';

import { Plane } from './../sprites/plane-sprite';
import { Bullet } from './../sprites/bullet-image';
import { Enemy } from './../sprites/enemy-image';
import { Background } from './../sprites/background-sprite';
import { DamageParticle } from './../sprites/damage-particle';

import HUD from './hud-scene'


import { virtualScreen, getWorldSize } from '../utils/render-constants';
import {
  blur,
  water1,
  water2,
  water3,
  dunno,
  noob,
} from './../shaders/shader-lib';

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
import { SettingsSingleton } from '../utils/settings-singleton';
import { Battleship } from '../sprites/battleship-sprite';

const gameSettings = SettingsSingleton.getInstance().settings;

export class RauserScene extends Phaser.Scene {
  planeObj: Plane;
  text: Phaser.GameObjects.Text;
  background: Background;
  dasBoot: Phaser.GameObjects.Image;
  enemyBullets: Phaser.Physics.Arcade.Group;
  playerBullets: Phaser.Physics.Arcade.Group;
  enemies: Phaser.Physics.Arcade.Group;
  previousDirection: string;
  waterGraphics: Phaser.GameObjects.Graphics;
  battleships: Phaser.Physics.Arcade.Group;
  fighterSpawnTime: number;
  battleshipSpawnTime: number;

  preload(): void {
    // https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/asteroids/bullets.png
    // https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/asteroids/ship.png
    //this.load.image('bullet', 'assets/rauser/bullets.png');
    this.load.image('bullet', 'assets/rauser/bullet_gray.png');
    this.load.image('bullets', 'assets/rauser/bullets.png');
    this.load.image('player', 'assets/rauser/plane1.png');
    this.load.image('bgGradient', 'assets/rauser/bg_gradient.png');
    this.load.image('battleship', 'assets/rauser/battleship.png');

    this.load.image('car', 'assets/car90.png');

    this.load.image('planeBody', 'assets/rauser/plane_body-fs8.png');
    this.load.image('planePhysics', 'assets/rauser/plane_transparent-fs8.png');
    this.load.image('planeWings', 'assets/rauser/plane_wings-fs8.png');

    this.load.atlas(
      'boostSprites',
      'assets/rauser/boost-fs8.png',
      'assets/rauser/boost.json'
    );

    this.load.spritesheet('debreeSprite', 'assets/rauser/debree_sprite.png', {
      frameWidth: 1,
      frameHeight: 1,
    });
    this.load.spritesheet('explosionsSprite', 'assets/rauser/explosions.png', {
      frameWidth: 20,
      frameHeight: 20,
    });

    this.load.image('dasboot', 'assets/rauser/das_boot-fs8.png');

    this.load.image('bg1', 'assets/rauser/clouds_pixel_800_600-fs8.png');

    this.load.audio(
      'sndMachineGun',
      'assets/rauser/sounds/bassy_machine_gun.ogg'
    );
    this.load.audio('sndGameMusic', 'assets/rauser/sounds/rauser_bounce.mp3');
    this.load.audio('sndExplosion', 'assets/rauser/sounds/explosion.mp3');
    this.load.audio(
      'sndExplosion2',
      'assets/rauser/sounds/explosion_dj_fx_1_kg.mp3'
    );
  }

  getWorldSize(): any {
    return getWorldSize();
  }

  create(): void {
      
    
    this.scene.add('hud-scene', HUD, true)
    //this.scene.run('hud-scene')
    const soundConfig = {
      mute: false,
      volume: gameSettings.musicVolume,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    };
    this.sound.play('sndGameMusic', soundConfig);

    const { worldSizeX, worldSizeY } = this.getWorldSize();
    this.fighterSpawnTime = 0;
    this.battleshipSpawnTime = 0;

    const waterDepth = 400;
    // the total size of the world
    this.physics.world.setBounds(
      0,
      0,
      worldSizeX,
      worldSizeY + waterDepth,
      false,
      false,
      true,
      true
    );
    //const graphics = this.add.graphics();
    //graphics.fillGradientStyle(0xff0000, 0xff0000, 0xffff00, 0xffff00, 1);
    //graphics.fillRect(0, 0, worldSizeX, worldSizeY);
    this.background = new Background(this, 0, 0, worldSizeX, worldSizeY);

    /*this.sky = scene.add
        .tileSprite(0, 0, x * 2, y * 2, "sky")
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setTint(0xffeeff);*/

    //this.add.tileSprite(0, 0, 800*2, 600*2, 'background');
    this.dasBoot = this.add
      .image(worldSizeX / 2, worldSizeY, 'dasboot')
      .setOrigin(0.5, 1)
      .setScale(10);

    const worldView = this.cameras.main.worldView;
    this.shaderStuff();

    this.planeObj = new Plane(this, worldSizeX / 2, worldSizeY);

    // 320/800
    const resolutionZoomFactor =
      (this.game.config.width as number) / virtualScreen.WIDTH;
    this.cameras.main.setZoom(gameSettings.zoom * resolutionZoomFactor);

    this.cameras.main.startFollow(this.planeObj.camMuzzle, true, 0.09, 0.09);

    // TODO: go back to normal array.. WHY?
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
      createCallback: (enemy: Enemy) => {
        enemy.body.setCircle(64, 0, 0);
      },
    });

    this.battleships = this.physics.add.group({
      classType: Battleship,
      runChildUpdate: true,
      createCallback: (battleship: Battleship) => {
        battleship.body.setSize(247, 43 - 16);
        battleship.body.setOffset(0, 20);
      },
    });

    this.text = this.add.text(10, 10, '', {
      font: '64px Courier',
      fill: '#00ff00',
    });

    // Add 2 groups for Bullet objects
    this.playerBullets = this.physics.add.group({
      classType: Bullet,
      createCallback: (bullet: Bullet) => {
        bullet.createForPlayer();
      },
      runChildUpdate: true,
    });
    this.enemyBullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
      createCallback: (bullet: Bullet) => {
        bullet.createForEnemyPlane();
      },
    });

    // player shoots enemy
    this.physics.add.overlap(
      this.playerBullets,
      this.enemies,
      (playerBullet: Bullet, enemy: Enemy) => {
        playerBullet.setActive(false);
        playerBullet.setVisible(false);
        enemy.decreaseHealth(2);
      }
    );
    // player and enemy collide
    this.physics.add.overlap(
      this.planeObj.plane,
      this.enemies,
      (player: any, enemy: Enemy) => {
        // TODO only once per hit?
        enemy.decreaseHealth(0.2);
        this.planeObj.decreaseHealth(0.2);
      }
    );

    // player and battleship collide
    this.physics.add.overlap(
      this.planeObj.plane,
      this.battleships,
      (player: any, battleship: Battleship) => {
        // TODO only once per hit!
        battleship.decreaseHealth(0.02);
        this.planeObj.decreaseHealth(0.2);
      }
    );
    // player shoots enemy
    this.physics.add.overlap(
      this.playerBullets,
      this.battleships,
      (playerBullet: Bullet, battleship: Battleship) => {
        playerBullet.setActive(false);
        playerBullet.setVisible(false);
        battleship.decreaseHealth(2);
      }
    );
    // enemy shoots player
    this.physics.add.overlap(
      this.enemyBullets,
      this.planeObj.plane,
      (enemyBullet: Bullet, player: any) => {
        // somehow this is destroying the player..
        enemyBullet.setActive(false);
        enemyBullet.setVisible(false);
        this.planeObj.decreaseHealth(5);
      }
    );


    // todo: heatseaking missle fireAtTarget (get closetst enemy?)
    this.planeObj.setBullets(this.playerBullets);

    // Fires bullet from player on left click of mouse
    this.input.on('pointerdown', (pointer, time, lastFired) => {
      // Get bullet from bullets group
      // TODO: move into player class
      this.planeObj.fire();
    });

    this.waterGraphics = this.add.graphics();
    //graphics.fillGradientStyle(0xff0000, 0xff0000, 0xffff00, 0xffff00, 1);
    this.waterGraphics.fillGradientStyle(
      0x22e1ff,
      0x22e1ff,
      0x22e1aa,
      0x22e199,
      1
    );
    //graphics.fillGradientStyle(0xff0000, 0xff0000, 0xffff00, 0xffff00, 1);
    this.waterGraphics.fillRect(-450, worldSizeY, worldSizeX, 400);
  }
  shaderStuff(): void {
    let blurBaseShader = new Phaser.Display.BaseShader('blur', water3);

    let blurShader = this.add.shader(blurBaseShader, 0, 0, 128, 128, [
      //let blurShader = new Phaser.GameObjects.Shader(this, blurBaseShader, 0, 0, 2048, 2048, [
      'planeBody',
    ]);

    blurShader.setRenderToTexture('blurred_image', true);
  }

  // TODO: spawn closer to player (world coordinates)
  spawnEnemies(time): void {
    let interval =
      time - this.fighterSpawnTime > gameSettings.fighterSpawnInterval;
    if (this.enemies.getLength() < gameSettings.maxFighters && interval) {
      const { x, y } = this.planeObj.plane;

      const { worldSizeX, worldSizeY } = this.getWorldSize();
      let anEnemy: Enemy = this.enemies.get().setActive(true).setVisible(true);
      const circleAroundPlayer = new Phaser.Geom.Circle(x, y, worldSizeY);
      Phaser.Actions.PlaceOnCircle(
        [anEnemy],
        circleAroundPlayer,
        Phaser.Math.DegToRad(Phaser.Math.Between(-180,0))
      );
      anEnemy.setTarget(this.planeObj.plane);
      anEnemy.setBullets(this.enemyBullets);

      console.log('creating enemy at ', anEnemy.x, anEnemy.y);
      this.fighterSpawnTime = time;
    } else if (this.fighterSpawnTime != 0 && interval) {
      // enough fighters exist..
      this.fighterSpawnTime = time;
    }
  }

  spawnBattleships(time): void {
    let interval =
      time - this.battleshipSpawnTime > gameSettings.battleshipSpawnInterval;
    if (
      this.battleships.getLength() < gameSettings.maxBattleships &&
      interval
    ) {
      let battleship: Battleship = this.battleships
        .get()
        .setActive(true)
        .setVisible(true);
      let { x, y } = this.planeObj.plane.body;
      const { worldSizeX, worldSizeY } = this.getWorldSize();
      //battleship.setRandomPosition(0,worldSizeY,300,0);
      //battleship.body.x=battleship.x=0;
      //battleship.body.y=battleship.y=worldSizeY;

      const spawnLeftOfPlayer = !!Phaser.Math.Between(0, 1);

      battleship.x = spawnLeftOfPlayer
        ? this.planeObj.plane.x - worldSizeY
        : this.planeObj.plane.x + worldSizeY * 2;
      battleship.y = worldSizeY + 16;

      battleship.setTarget(this.planeObj.plane);
      battleship.setBullets(this.enemyBullets);
      //battleship.setOrigin(0.5,0.8);
      //battleship.setOrigin(1,-1);
      console.log(
        `creating ship ${spawnLeftOfPlayer ? 'left' : 'right'} of player `,
        battleship.x,
        battleship.y
      );
      this.battleshipSpawnTime = time;
    } else if (this.battleshipSpawnTime != 0 && interval) {
      // enough fighters exist..
      this.battleshipSpawnTime = time;
    }
  }

  update(time, delta): void {
    //this.sound.play('sndGameMusic', soundConfig);
    if (this.planeObj) this.planeObj.updatePlane();

    if (this.planeObj.active && time > 4000) {
      this.spawnEnemies(time);
      this.spawnBattleships(time);
      const { x: velX, y: velY } = this.planeObj.plane.body.velocity;

      this.background.updateBackground(velX, velY);
      // check if plane is turning
      // green line goa

      // idea: spawn enemies more to the left or right,
      // depending where the player goes
      const planeX = this.planeObj.plane.x;

      this.zoomToSpeed(velX, velY);

      if (Math.abs(velX) > 5) {
        if (planeX > velX + planeX) {
          if (velX < 10 && velX > -15) {
            console.log('turning left');
          }
        } else {
          if (velX < 10) {
            console.log('turning right');
          }
        }
      }

      /*
      this.text.setText(
        'Speed: ' +
          // @ts-ignore
          this.planeObj.plane.body.speed +
          ' fps:' +
          this.game.loop.actualFps
      );*/
    }

    if (this.waterGraphics) this.waterGraphics.x = this.planeObj.plane.x - 1200;
  }

  zoomToSpeed(velX, velY): void {
    const speed = Math.sqrt(Math.pow(velX, 2) + Math.pow(velY, 2));

    const resolutionZoomFactor =
      (this.game.config.width as number) / virtualScreen.WIDTH;
    //console.log('speed', speed); // 600 max always positive
    this.cameras.main.zoom = Math.max(
      gameSettings.zoom * resolutionZoomFactor - speed / 60000
    );
  }
}
