// https://github.com/photonstorm/phaser3-examples/blob/master/public/src/games/topdownShooter/topdown_combatMechanics.js

import { Plane } from './plane-sprite';
import { SettingsSingleton } from '../utils/settings-singleton';

var gameSettings = {
  ...SettingsSingleton.getInstance().settings,
};

export class Bullet extends Phaser.GameObjects.Image {
  // analysis: https://www.youtube.com/watch?v=3X0yxfQGABc
  // luftrauser:
  //
  // player bullets
  // big white dots with border in background color
  // enemy bullets (std. planes)
  // big white dots with dark border

  // muzzle when shooting (white long, inner color slightly different) (64px?)
  // exhaust pipe plain white

  // particle?
  // random smoke
  // smoke grayish dots in the same color

  speed = 1;
  born = 0;
  xSpeed = 0;
  ySpeed = 0;
  direction = 0;
  isLockedOnTarget = false;
  sound: Phaser.Sound.BaseSound;
  target: Plane;

  constructor(scene, x = 0, y = 0) {
    // how to add scpecific bullet classes? inheritance? make this abstract class
    super(scene, x, y, 'bullet');
    this.speed = 1;
    this.born = 0;
    this.direction = 0;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.setOrigin(0.5, 0.5);
    this.setScale(2);
    //this.setSize(12, 12); // ?
    this.setTint(0xee9900);
    this.sound = this.scene.sound.add('sndMachineGun');
  }

  playFireSound(loop = false) {
    // idea volume depending on distance to target
    let soundConfig: Phaser.Types.Sound.SoundConfig = {
      mute: false,
      volume: gameSettings.sfxVolume,
      rate: 0.5,
      detune: 0,
      seek: 0.4,
      loop: loop,
      delay: 0,
    };
    if (this.target) {
      // enemies
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.target.x,
        this.target.y
      );
      soundConfig = {
        ...soundConfig,
        rate: 1,
        volume: (gameSettings.sfxVolume / distance) * 1000,
      };
    }

    this.sound.play(soundConfig);
  }

  // works
  fireAtTarget(shooter, target): void {
    this.target = target;
    this.isLockedOnTarget = true;
    this.playFireSound();

    this.setPosition(shooter.x, shooter.y); // Initial position
    this.direction = Math.atan((target.x - this.x) / (target.y - this.y));
    // Calculate X and y velocity of bullet to moves it from shooter to target
    if (target.y >= this.y) {
      this.xSpeed = this.speed * Math.sin(this.direction);
      this.ySpeed = this.speed * Math.cos(this.direction);
    } else {
      this.xSpeed = -this.speed * Math.sin(this.direction);
      this.ySpeed = -this.speed * Math.cos(this.direction);
    }

    //this.rotation = shooter.rotation; // angle bullet with shooters rotation
    this.rotation = Phaser.Math.Angle.BetweenPoints(shooter, target);


    //this.rotation = shooter.rotation + Phaser.Math.DegToRad(-90);
    this.born = 0; // Time since new bullet spawned
  }

  fireStraight(shooter): void {
    this.setPosition(shooter.x, shooter.y); // Initial position
    this.rotation = shooter.rotation; // angle bullet with shooters rotation

    this.scene.physics.velocityFromRotation(
      shooter.rotation,
      4000,
      // @ts-ignore
      this.body.acceleration
    );
    this.direction = Math.atan(shooter.x / shooter.y);
  }

  // @TODO: move method to plane!
  fireStraight2(rotation): void {
    this.playFireSound();
    this.rotation = rotation; // angle bullet with shooters rotation
    const vec2:Phaser.Math.Vector2 = new Phaser.Math.Vector2(128,0);
    this.scene.physics.velocityFromRotation(
      rotation,
      6000,
      // @ts-ignore
      this.body.velocity
    );

    this.born = 0; // Time since new bullet spawned
  }
  // Updates the position of the bullet each cycle
  update(time: number, delta: number): void {
    if (this.isLockedOnTarget) {
      this.x += this.xSpeed * delta;
      this.y += this.ySpeed * delta;
    }
    this.born += delta;
    if (this.born > 1000) {
      this.setActive(false);
      this.setVisible(false);
      this.destroy();
    }
  }
}
