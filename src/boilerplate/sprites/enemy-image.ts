// https://github.com/photonstorm/phaser3-examples/blob/master/public/src/games/topdownShooter/topdown_combatMechanics.js

import { Bullet } from "./bullet-image";
import { Plane } from "./plane-sprite";


var ROTATION_SPEED = 1 * Math.PI; // 0.5 arc per sec, 2 sec per arc
var ROTATION_SPEED_DEGREES = Phaser.Math.RadToDeg(ROTATION_SPEED);
var TOLERANCE = 0.06 * ROTATION_SPEED;

export class Enemy extends Phaser.Physics.Arcade.Sprite  {

  speed     = 0.01;
  born      = 0;
  xSpeed    = 0;
  ySpeed    = 0;
  direction = 0;
  hp        = 10;
  target: Plane;

  sound:Phaser.Sound.BaseSound;
  bullets: any;

  plane:   Phaser.Physics.Arcade.Image;
  wings: Phaser.GameObjects.Image;
  planeBody: Phaser.GameObjects.Image;
  renderContainer: Phaser.GameObjects.Container;
  shooterRotation: any;
  rotateTo: any;
  explosions: Phaser.GameObjects.Sprite;
  sound2: Phaser.Sound.BaseSound;

  constructor(scene,x=0,y=0) {
    super(scene,x,y,'planePhysics');
    this.speed = 0.1;
    this.born = 0;
    this.direction = 0;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.createPlane(x,y);
    //this.sound = this.scene.sound.add("sndExplosion");
    this.sound2 = this.scene.sound.add("sndExplosion2");
  }

  createPlane(x:number,y:number):void {
    this.setOrigin(0,0);


    const enemyTint = 0x000000;

    this.planeBody = this.scene.add.image(0, 0, 'planeBody',0);
    this.planeBody.setTint(enemyTint);


    this.wings = this.scene.add.image(0,0,'planeWings');
    this.wings.setTint(enemyTint);
    this.renderContainer = this.scene.add.container(0, 0, [this.planeBody, this.wings]);


    this.explosions = this.scene.add.sprite(0, 0, 'explosionsSprite',0);
    this.explosions.setScale(4);
    this.scene.anims.create({
      key: 'explode1',
      frames: this.scene.anims.generateFrameNumbers('explosionsSprite',{start:1,end:6}),
      frameRate: 5,
      repeat: -1
    });
    this.scene.anims.create({
      key: 'explode2',
      frames: this.scene.anims.generateFrameNumbers('explosionsSprite',{start:6,end:12}),
      frameRate: 5,
      repeat: -1
    });
    this.scene.anims.create({
      key: 'explode3',
      frames: this.scene.anims.generateFrameNumbers('explosionsSprite',{start:12,end:18}),
      frameRate: 5,
      repeat: -1
    });
    this.explosions.setVisible(false);
  }

  // TODO: somehow passing an object to the constructor
  // to change properites of enemy: class, texture, hp, speed, ...
  playExplosionSound(loop=false) {
    const soundConfige:Phaser.Types.Sound.SoundConfig = {
      mute: false,
      volume: 1,
      rate: Phaser.Math.Between(150,300)/100,
      detune: Phaser.Math.Between(100,500),
      seek: 0,
      loop: loop,
      delay: 0
    };

    //if(Phaser.Math.Between(0,1)) {
    this.sound2.play(soundConfige);
    //} else {
    //  this.sound2.play(soundConfige);
    //}
  }

  playFireSound(loop=false) {

  }

  updateWings():void {
    this.updateRotation();
    this.explosions.x=this.x;
    this.explosions.y=this.y;

    this.renderContainer.setAngle(this.angle);
    this.renderContainer.setX(this.x);
    this.renderContainer.setY(this.y);
    // da orignial scale effect from luftrausers
    const scaleFactor = Math.abs(Math.sin(this.rotation))*1;
    this.wings.scaleY = Phaser.Math.Clamp(1*scaleFactor,0.1,1);
  }

  updateRotation():void {
    if (this.target) {
      this.rotateTowardsFlyingDirection();
    }
  }

  // GOLD!!!
  // https://phaser.discourse.group/t/rotating-a-sprite-towards-the-pointer/921/3
  rotateTowardsFlyingDirection():void {
    // Also see alternative method in
    // <https://codepen.io/samme/pen/gOpPLLx>

    //var angleToPointer = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
    const angleToPointer = Phaser.Math.Angle.Between(this.x, this.y,this.x+ this.body.velocity.x, this.y+this.body.velocity.y);
    const angleDelta = Phaser.Math.Angle.Wrap(angleToPointer - this.rotation);

    if (Phaser.Math.Within(angleDelta, 0, TOLERANCE)) {
      this.rotation = angleToPointer;
      this.setAngularVelocity(0);
    } else {
      this.setAngularVelocity(Math.sign(angleDelta) * ROTATION_SPEED_DEGREES);
    }
  }

  decreaseHealth(value:number) : void {
    this.hp-=value;
    if ( this.hp <= 0 ) {
      // TODO: explosionz!!!!!!
      this.explosions.setVisible(true).setScale(Phaser.Math.Between(4,8));

      this.explosions.anims.play('explode'+Phaser.Math.Between(1,3));
      this.playExplosionSound();
      // or set inactive??? dunno...
      this.setActive(false);
      this.setVisible(false);

      // TODO: tween idea:
      /*
      - enable explosions sheet (BOTH RANDOMLY)
      - tween y to bottom
      - after tween particle explosion effect
      */
      setTimeout(()=>{
        this.explosions.destroy();
      },1200);
      this.renderContainer.destroy()
      this.destroy();
    }
  }
  getWorldSize():any {
    const worldSizeX:number = (this.scene.game.config.width as number) * 4;
    const worldSizeY:number = (this.scene.game.config.height as number) * 4;
    return {worldSizeX,worldSizeY};
  }

  moveToTarget(target) {
        const {worldSizeY}=this.getWorldSize();
        this.target = target;
        this.direction = Math.atan( (target.x-this.x) / (Phaser.Math.Clamp(target.y,0,worldSizeY-600)-this.y));
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
        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= this.y) {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
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
  update(time:number, delta:number):void {
    this.updateWings();
    if (this.target) {

      // less speed on y (we are planes and have to turn..)

      this.scene.physics.accelerateToObject(this, this.target, 320, 300, 250);
      // ummm, why does this work??
      // this.setAngularVelocity(300);

      const {worldSizeY} = this.getWorldSize();

      if ( this.y > (worldSizeY-100) ) {
        const factor = Math.abs(this.y - worldSizeY);
        // @ts-ignore
        this.body.setGravity(0 , -10 * factor);
      }  else {
        // @ts-ignore
        this.body.setGravity(0 , 200);
      }
      //this.moveToTarget(this.target);
    }

    const shootInterval = 100 + Phaser.Math.Between(0,100);
    if ((Math.round(time*100)%shootInterval)==0) {
      const aBullet:Bullet = this.bullets.get().setActive(true).setVisible(true);
      aBullet.rotation = this.shooterRotation;
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