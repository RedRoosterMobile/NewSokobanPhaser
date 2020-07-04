// https://github.com/photonstorm/phaser3-examples/blob/master/public/src/games/topdownShooter/topdown_combatMechanics.js

import { Bullet } from './bullet-image';
import { Plane } from './plane-sprite';
import { SettingsSingleton } from '../utils/settings-singleton';
import {virtualScreen, getWorldSize} from '../utils/render-constants';

var gameSettings = {
  ...SettingsSingleton.getInstance().settings,
};

// todo make interfaces for all enemy classes and put them in config
const battleshipConfig = {
  key: 'battleship', // battleshipSprite battleshipTurretSprite battleshipTurretGunSprite
  hp: 80,
  maxSpeed: 30,
  // for
  bulletImpact: 35, // ouch!
  fireInterval: 2000, // 2 s
  maxBullets: 30, // bullets per interval
  bulletInterval: 16 * 2, // fire every second render, if bullets available
  turretRotationSpeed: 1 * Math.PI, // 0.5 arc per sec, 2 sec per arc
  gravityY: 200,
};

export class Battleship extends Phaser.Physics.Arcade.Sprite {
  speed = 0.01;
  born = 0;
  xSpeed = 0;
  ySpeed = 0;
  direction = 0;
  hp = 10;
  target: Plane;

  sound: Phaser.Sound.BaseSound;
  bullets: any;

  plane: Phaser.Physics.Arcade.Image;
  wings: Phaser.GameObjects.Image;
  planeBody: Phaser.GameObjects.Image;
  renderContainer: Phaser.GameObjects.Container;
  shooterRotation: any;
  rotateTo: any;
  explosions: Phaser.GameObjects.Sprite;
  sound2: Phaser.Sound.BaseSound;
  particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
  emitter: Phaser.GameObjects.Particles.ParticleEmitter;
  emitterFrame: number;

  constructor(scene, x = 0, y = 0) {
    super(scene, x, y, 'battleship');
    //this.setOrigin(0.5,1);
    this.setScale(10);
    this.speed = 0.1;
    this.born = 0;
    this.direction = 0;
    this.xSpeed = 0;
    this.ySpeed = 0;

    this.emitterFrame = 0;
    //this.sound = this.scene.sound.add("sndExplosion");
    this.sound2 = this.scene.sound.add('sndExplosion2');
  }

  // TODO: somehow passing an object to the constructor
  // to change properites of enemy: class, texture, hp, speed, ...
  playExplosionSound(loop = false) {
    const soundConfige: Phaser.Types.Sound.SoundConfig = {
      mute: false,
      volume: gameSettings.sfxVolume,
      rate: Phaser.Math.Between(150, 300) / 100,
      detune: Phaser.Math.Between(100, 500),
      seek: 0,
      loop: loop,
      delay: 0,
    };

    //if(Phaser.Math.Between(0,1)) {
    this.sound2.play(soundConfige);
    //} else {
    //  this.sound2.play(soundConfige);
    //}
  }

  // GOLD!!!
  // https://phaser.discourse.group/t/rotating-a-sprite-towards-the-pointer/921/3
  rotateTowardsFlyingDirection(): void {
    // Also see alternative method in
    // <https://codepen.io/samme/pen/gOpPLLx>

    const targetVelocity = { x: 100, y: 100 };

    let ROTATION_SPEED_DEGREES = Phaser.Math.RadToDeg(
      battleshipConfig.turretRotationSpeed
    );
    let TOLERANCE = 0.06 * battleshipConfig.turretRotationSpeed;

    //var angleToPointer = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
    const angleToPointer = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.x + targetVelocity.x,
      this.y + targetVelocity.y
    );
    const angleDelta = Phaser.Math.Angle.Wrap(angleToPointer - this.rotation);

    if (Phaser.Math.Within(angleDelta, 0, TOLERANCE)) {
      this.rotation = angleToPointer;
      this.setAngularVelocity(0);
    } else {
      this.setAngularVelocity(Math.sign(angleDelta) * ROTATION_SPEED_DEGREES);
    }
  }

  decreaseHealth(value: number): void {
    this.hp -= value;
    if (this.hp <= 0) {
      // TODO: explosionz!!!!!!
      /*
      this.explosions
        .setVisible(true)
        .setScale(Phaser.Math.Between(4, 8))
        .setTint(0xffc922)
        .setAlpha(0.7);

      this.explosions.anims.play('explode' + Phaser.Math.Between(1, 3));
      */

      this.playExplosionSound();
      // or set inactive??? dunno...
      this.setActive(false);
      this.setVisible(false);

      /*
      this.emitter.setSpeed(200 );
      this.emitter.setFrequency(12);
      
      
      let oneShotTimer = this.scene.time.delayedCall(1200, () => {
        this.explosions.destroy();
        this.particles.destroy();
      });*/

      //this.renderContainer.destroy();

      this.destroy();
    }
  }
  getWorldSize(): any {
    return getWorldSize();
  }

  moveToTarget(target) {
    const { worldSizeY } = this.getWorldSize();
    this.target = target;
    this.direction = Math.atan(
      (target.x - this.x) /
        (Phaser.Math.Clamp(target.y, 0, worldSizeY - 600) - this.y)
    );
    // Calculate X and y velocity of bullet to moves it from shooter to target
    if (target.y >= this.y) {
      this.xSpeed = this.speed * Math.sin(this.direction);
      this.ySpeed = this.speed * Math.cos(this.direction);
    } else {
      this.xSpeed = -this.speed * Math.sin(this.direction);
      this.ySpeed = -this.speed * Math.cos(this.direction);
    }
    this.born = 0; // Time since new bullet spawned
  }

  fireAtTarget(shooter, target): void {
    //this.setPosition(shooter.x, shooter.y); // Initial position
    this.direction = Math.atan((target.x - this.x) / (target.y - this.y));
    // Calculate X and y velocity of bullet to moves it from shooter to target
    if (target.y >= this.y) {
      this.xSpeed = this.speed * Math.sin(this.direction);
      this.ySpeed = this.speed * Math.cos(this.direction);
    } else {
      this.xSpeed = -this.speed * Math.sin(this.direction);
      this.ySpeed = -this.speed * Math.cos(this.direction);
    }

    this.shooterRotation = shooter.rotation; // angle bullet with shooters rotation
    this.born = 0; // Time since new bullet spawned
  }
  setTarget(target): void {
    this.target = target;
  }
  setBullets(bullets): void {
    this.bullets = bullets;
  }

  // Updates the position of the bullet each cycle
  update(time: number, delta: number): void {
    if (this.target) {
      // less speed on y (we are planes and have to turn..)

      this.scene.physics.accelerateToObject(this, this.target, 150, 50, 0);
      // ummm, why does this work??
      // this.setAngularVelocity(300);

      const shootInterval = 10;//Phaser.Math.Between(0, 10);
      if (Math.round(time * 100) % shootInterval == 0) {
        const aBullet: Bullet = this.bullets
          .get()
          .setActive(true)
          .setVisible(true);
        aBullet.rotation = this.shooterRotation;
        const { worldSizeY } = this.getWorldSize();
        if (this.y < worldSizeY) {
          aBullet.fireAtTarget(this, this.target);
        }
      }
    }

    this.x += this.xSpeed * delta;
    //this.y += this.ySpeed * delta;

    /*this.moveToTarget({
       x:this.x + this.xSpeed * delta,
       y:this.y += this.ySpeed * delta
      });*/
  }
}
