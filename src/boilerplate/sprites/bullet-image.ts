// https://github.com/photonstorm/phaser3-examples/blob/master/public/src/games/topdownShooter/topdown_combatMechanics.js

import { Tilemaps } from 'phaser';
import { Plane } from './plane-sprite';

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
    super(scene, x, y, 'bullet');
    this.speed = 1;
    this.born = 0;
    this.direction = 0;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.setOrigin(0.5, 0.5);
    this.setScale(5);
    this.setSize(12, 12);
    //this.setScale(10);
    this.sound = this.scene.sound.add('sndMachineGun');
  }

  playFireSound(loop = false) {
    // idea volume depending on distance to target
    //this.target.plane.
    let soundConfige: Phaser.Types.Sound.SoundConfig = {
      mute: false,
      volume: 0.5,
      rate: 0.5,
      detune: 0,
      seek: 0.4,
      loop: loop,
      delay: 0,
    };
    if (this.target) {
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.target.x,
        this.target.y
      );
      soundConfige = {
        ...soundConfige,
        rate: 1,
        volume: (1 / distance) * 1000,
      };
    }

    // @ts-ignore
    this.sound.play(soundConfige);
  }

  // works
  fireAtTarget(shooter, target): void {
    this.target = target;
    this.isLockedOnTarget = true;
    this.playFireSound();

    this.setPosition(shooter.x, shooter.y); // Initial position
    this.direction = Math.atan((target.x - this.x) / (target.y - this.y));

    //this.direction = shooter.rotation;

    //this.direction = Math.atan( (0-this.x) / (0-this.y));

    // Calculate X and y velocity of bullet to moves it from shooter to target
    if (target.y >= this.y) {
      this.xSpeed = this.speed * Math.sin(this.direction);
      this.ySpeed = this.speed * Math.cos(this.direction);
    } else {
      this.xSpeed = -this.speed * Math.sin(this.direction);
      this.ySpeed = -this.speed * Math.cos(this.direction);
    }

    this.rotation = shooter.rotation; // angle bullet with shooters rotation
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

  fireStraight2(x, y, rotation): void {
    this.playFireSound();
    this.setPosition(x + 25, y); // Initial position
    this.rotation = rotation; // angle bullet with shooters rotation

    this.scene.physics.velocityFromRotation(
      rotation,
      40000,
      // @ts-ignore
      this.body.acceleration
    );
    this.direction = Math.atan(x / y);
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
