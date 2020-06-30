// https://github.com/photonstorm/phaser3-examples/blob/master/public/src/games/topdownShooter/topdown_combatMechanics.js

import { Bullet } from "./bullet-image";

export class Enemy extends Phaser.Physics.Arcade.Sprite  {

  speed     = 0.01;
  born      = 0;
  xSpeed    = 0;
  ySpeed    = 0;
  direction = 0;
  hp        = 10;
  target: Enemy;

  sound:Phaser.Sound.BaseSound;
  bullets: any;

  plane:   Phaser.Physics.Arcade.Image;
  wings: Phaser.GameObjects.Image;
  planeBody: Phaser.GameObjects.Image;
  renderContainer: Phaser.GameObjects.Container;

  constructor(scene,x=0,y=0) {
    //super(scene,x,y,'enemy');
    super(scene,x,y,null);
    // super.setTexture('');
    this.speed = 0.1;
    this.born = 0;
    this.direction = 0;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.setOrigin(0,0);
    this.createPlane(x,y);
    this.sound = this.scene.sound.add("sndExplosion");
  }

  createPlane(x:number,y:number):void {
    this.plane = this.scene.physics.add.image(x, y, 'planePhysics',0);
    this.plane.setBounce(1, 1);
    //this.plane.setCollideWorldBounds(true);
    this.plane.setDamping(true);
    this.plane.setDrag(0.99);
    this.plane.setMaxVelocity(600);
    this.plane.setAngle(-90);
    this.setOrigin(0,0);
    this.plane.setGravity(0 , 200);

    this.wings = this.scene.add.image(0,0,'planeWings');
    this.planeBody = this.scene.add.image(0, 0, 'planeBody',0);
    this.renderContainer = this.scene.add.container(0, 0, [this.planeBody, this.wings]);

  }

  // TODO: somehow passing an object to the constructor
  // to change properites of enemy: class, texture, hp, speed, ...
  playExplosionSound(loop=false) {
    const soundConfige:Phaser.Types.Sound.SoundConfig = {
      mute: false,
      volume: 0.5,
      rate: Phaser.Math.Between(1.1,2.1),
      detune: 0,
      seek: 0,
      loop: loop,
      delay: 0
    };
    this.sound.play(soundConfige);
  }
  playFireSound(loop=false) {

  }

  updateWings():void {
    this.renderContainer.setAngle(this.plane.angle);
    this.renderContainer.setX(this.plane.x);
    this.renderContainer.setY(this.plane.y);
    // da orignial scale effect from luftrausers
    const scaleFactor = Math.abs(Math.sin(this.plane.rotation))*1;
    this.wings.scaleY = Phaser.Math.Clamp(1*scaleFactor,0.1,1);
  }

  decreaseHealth(value:number) : void {
    this.hp-=value;
    if ( this.hp <= 0 ) {
      // TODO: explosionz!!!!!!
      this.playExplosionSound();
      console.log('AAAHHHHHHHRGHHH!!!');
      // or set inactive??? dunno...
      this.setActive(false);
      this.setVisible(false);
      this.destroy();
    }
  }
  getWorldSize():any {
    // @ts-ignore
    const worldSizeX:number = parseInt(this.scene.game.config.width) * 4;
    // @ts-ignore
    const worldSizeY:number = parseInt(this.scene.game.config.height) * 4;
    return {worldSizeX,worldSizeY};
}

  moveToTarget(target) {
        const {worldSizeY}=this.getWorldSize()

        this.direction = Math.atan( (target.x-this.x) / (Phaser.Math.Clamp(target.y,0,worldSizeY-600)-this.y));

        //this.direction = shooter.rotation;


        //this.direction = Math.atan( (0-this.x) / (0-this.y));


        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }


        this.born = 0; // Time since new bullet spawned
  }



  fireAtTarget(shooter, target):void {

        this.playFireSound();
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

        //this.direction = shooter.rotation;

        console.log(this.direction, shooter.rotation);
        //this.direction = Math.atan( (0-this.x) / (0-this.y));


        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.rotation = shooter.rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
  }
  setTarget(target): void {
    this.target = target;
  }
  setBullets(bullets): void {
    this.bullets = bullets;
  }

  // Updates the position of the bullet each cycle
  update(time:number, delta:number):void {
    this.updateWings();
    if (this.target) {
      // less speed on y (we are planes and have to turn..)

      this.scene.physics.accelerateToObject(this, this.target, 320, 300, 250);
      const {worldSizeY} = this.getWorldSize();

      if ( this.y > (worldSizeY-100) ) {
        const factor = Math.abs(this.y - worldSizeY);
        // @ts-ignore
        this.body.setGravity(0 , -10 * factor);
      }  else {
        // @ts-ignore
        this.body.setGravity(0 , 0);
      }
      //this.moveToTarget(this.target);
    }

    const shootInterval = 100 + Phaser.Math.Between(0,100);
    if ((Math.round(time*100)%shootInterval)==0) {
      const aBullet:Bullet = this.bullets.get().setActive(true).setVisible(true);
      aBullet.fireAtTarget(this,this.target);
    }

      this.x += this.xSpeed * delta;
      this.y += this.ySpeed * delta;

     /*this.moveToTarget({
       x:this.x + this.xSpeed * delta,
       y:this.y += this.ySpeed * delta
      });*/

  }


}