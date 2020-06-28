// TODO:
// - no/less gravity when flying sideways (because of updrift, depending on speed)
// - wings! OK
// - bullet sound: flak from Wings of Fury (Bassy as hell!) OK
// - LAG of wings (workaround: embrace the lag: use a transparent pic for physics, body and wings will have the same lag..)
// - engine sound. Rip this and add more bass (Wings of Fury) https://www.youtube.com/watch?v=ZZSwdqg6VE4
// - when hitting the water, add some sort of water updrift that gives the planes an upwards push while under water
// -> aka REVERSE GRAVITY and amplifiy it!
// - add more (and harder) enemies depending on score
//- intro music? https://www.remix64.com/track/mano/wings-of-fury-orchestral-remix/

import { Tilemaps } from "phaser";


// check this!
// https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html


//bullets
//https://blog.ourcade.co/posts/2020/fire-bullets-from-facing-direction-phaser-3/
export class Plane extends Phaser.Physics.Arcade.Sprite  {
  plane:   Phaser.Physics.Arcade.Image;
  wings: Phaser.GameObjects.Image;
  planeBody: Phaser.GameObjects.Image;
  boost: Phaser.GameObjects.Sprite;
  muzzleAnimation: Phaser.GameObjects.Sprite;
  muzzle: Phaser.GameObjects.Image;
  renderContainer:   Phaser.GameObjects.Container;
  hpMax: 300;
  hp: number;
  fireCallback: Function;
  isShooting: boolean;

  cursors: Phaser.Types.Input.Keyboard.CursorKeys;


  constructor(scene:Phaser.Scene,x:number,y:number) {
    super(scene,x,y,null);

    this.hp= 300;
    this.hpMax= 300;
    this.isShooting= false;

    this.setOrigin(0,0);
    this.createPlane(x,y);

  }
  createPlane(x:number,y:number):void {

    this.plane = this.scene.physics.add.image(x, y, 'planePhysics',0);
    this.plane.setInteractive(true, function(){});
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.plane.setBounce(1, 1);
    this.plane.setCollideWorldBounds(true);
    this.plane.setDamping(true);
    this.plane.setDrag(0.99);
    this.plane.setMaxVelocity(600);
    this.plane.setAngle(-90);
    this.setOrigin(0,0);
    this.plane.setGravity(0 , 200);

    this.wings = this.scene.add.image(0,0,'planeWings');
    this.planeBody = this.scene.add.image(0, 0, 'planeBody',0);
    this.boost = this.scene.add.sprite(-32-8, 0, "boostSprites", 0);
    this.muzzleAnimation = this.scene.add.sprite(-32-8, 0, "boostSprites", 0);
    this.muzzleAnimation.setVisible(false);
    this.muzzleAnimation.flipY= true;
    this.muzzleAnimation.setScale(1.5,0.2);
    
    this.muzzle = this.scene.add.image(0, 0, "car", 0)
    this.muzzle.setVisible(false);
    

    
    // https://phaser.io/examples/v3/view/game-objects/container/add-array-of-sprites-to-container
    // Add some sprites - positions are relative to the Container x/y
    //this.renderContainer = this.scene.add.container(0, 0, [this.planeBody, this.wings, this.boost, this.muzzle]);
    this.renderContainer = this.scene.add.container(0, 0, [this.planeBody, this.wings, this.boost, this.muzzleAnimation]);
    this.boost.setOrigin(0.5,0);
    this.boost.setAngle(90);

    this.muzzleAnimation.setOrigin(0.5,0.5);
    this.muzzleAnimation.setAngle(90);
    this.muzzleAnimation.x=64;

    this.muzzle.setOrigin(0.5,0.5);
    //this.muzzle.setAngle(90);
    //this.muzzle.x=64;

    this.createAnims();
  }

  decreaseHealth(value:number) : void {
    console.log(typeof this.hp, value);
    this.hp -= value;
    console.log(this.hp);
    if ( this.hp <= 0 ) {
      // TODO: explosionz!!!!!!

      console.log('YOU DIE!!!');
      // explosionz, 
      this.setActive(false);
      this.setVisible(false);
      this.destroy();
    }
    
  }

  increaseHealth(value:number) : void {
    if (this.hp <= this.hpMax)
      this.hp+=value;
  }

  setFireCallback(callback:Function) {
    this.fireCallback= callback;
  }

  createAnims():void{

    this.scene.anims.create({
      key: "boost",
      repeat: -1,
      frameRate: 30,
      frames: this.scene.anims.generateFrameNames("boostSprites", {
        prefix: "boost_",
        suffix: ".png",
        start: 1,
        end: 4,
        zeroPad: 2
      })
    });
  }
  animateIfNecessary = (animationName, animatedSprite, frameRate = 20) => {
      if (
        animatedSprite.anims.isPlaying &&
        animatedSprite.anims.currentAnim.key === animationName
      ) {
        // you are already playing .. play on..
      } else if (animatedSprite.anims.isPlaying) {
        // something else is playing
        animatedSprite.play(animationName);
      } else {
        // nothing else is playing
        animatedSprite.play(animationName);
      }
  };

  knockback(knockbackAmount= 10):void  {
  
    
      // @ts-ignore
      const vector = this.scene.physics.velocityFromAngle(this.plane.angle+180,knockbackAmount, this.plane.body.acceleration);
      this.plane.setVelocityX(this.plane.body.velocity.x + vector.x);
      this.plane.setVelocityY(this.plane.body.velocity.y + vector.y);
      //this.scene.physics.velocityFromRotation(this.plane.rotation, 300*2, this.plane.body.acceleration);
      //this.scene.physics.velocityFromRotation(this.plane.rotation, 40000, this.plane.body.acceleration);
  }

  updatePlane():void {

    if (!this.active || !this.plane.body) {
      console.log('probaly dead!', this.hp);
      //TODO: show dramatic explosions
      return;
    }
    if (this.cursors.shift.isDown) {
      //this.knockback();

    }
    // recover health when not shooting
    if (!this.isShooting) {
      this.increaseHealth(1);
    }

    
    if (this.cursors.space.isDown && !this.isShooting) {
      if (this.fireCallback) {
        this.fireCallback();
        this.isShooting = true;
        // TODO
        // - play only once per shot..
        // - hide after shot
        this.muzzleAnimation.setVisible(true);
        this.animateIfNecessary('boost',this.muzzleAnimation,0);
        this.knockback();
        // knockback?? (see super crate box code..)
        //Phaser.Math.RotateAroundDistance();
        //this.plane.body.bounce.
        //this.plane.setVelocityX(this.plane.body.velocity.x*-0.98 );
        //this.plane.setVelocityY(this.plane.body.velocity.y*-0.98 );
        
        
        this.plane.body.velocity.y 

        // wait until next shot
        this.scene.time.delayedCall(250,()=>{
          //this.muzzleAnimation.p
          this.muzzleAnimation.setVisible(false);
          this.isShooting = false;
        });
      }
    }
    // thrust
    if (this.cursors.up.isDown) {
        // @ts-ignore


        this.scene.physics.velocityFromRotation(this.plane.rotation, 300*2, this.plane.body.acceleration);
        this.boost.setVisible(true);
        this.animateIfNecessary('boost',this.boost,60);
        this.plane.setGravity(0 , 0);
        //console.log(this.renderContainer);
        /*this.scene.tweens.add({
          targets: this.plane,
          props: {
            gravitiyY: 0
          },
          delay: 0,
          duration: 100,
          ease: "Linear",
          easeParams: null,
          hold: 0,
          repeat: 1,
        });*/
        
    } else {
      // TODO: while x velocity is still active don't add too much gravity
      const {worldSizeY} = this.getWorldSize();
      if (this.plane.y > worldSizeY) {
        console.log('reversing gravity');
        // under water: add updrift
        const factor = Math.abs(this.plane.y - worldSizeY);
        console.log(factor);
        this.plane.setGravity(0 , -10*factor);
      }  else {
        this.plane.setGravity(0 , 400);
      } 
      
        
      this.boost.setVisible(false);
      this.plane.setAcceleration(0);
    }

    // steer
    if (this.cursors.left.isDown && !this.cursors.up.isDown) {
        this.plane.setAngularVelocity(-300);
    }
    else if (this.cursors.left.isDown && this.cursors.up.isDown) {
      // slow turning while accellerating
      this.plane.setAngularVelocity(-150);
    }
    else if (this.cursors.right.isDown && !this.cursors.up.isDown) {
        this.plane.setAngularVelocity(300);
    }
    else if (this.cursors.right.isDown && this.cursors.up.isDown) {
      // slow turning while accellerating
      this.plane.setAngularVelocity(150);
    }
    else {
        this.plane.setAngularVelocity(0);
    }
    this.updateWings();
    // @ts-ignore
    //this.scene.text.setText('Speed: ' + this.plane.body.speed + ' fps:'+ this.scene.game.loop.actualFps);
  }
  getWorldSize():any {
    // @ts-ignore
    const worldSizeX:number = parseInt(this.scene.game.config.width) * 4;
    // @ts-ignore
    const worldSizeY:number = parseInt(this.scene.game.config.height) * 4;
    return {worldSizeX,worldSizeY};
}
  updateWings():void {
    this.renderContainer.setAngle(this.plane.angle);
    this.renderContainer.setX(this.plane.x);
    this.renderContainer.setY(this.plane.y);
    this.updateWingsScale();
    // update muzzle
    const thePoint = new Phaser.Geom.Point(-100000,0);
    const newPoint = Phaser.Math.RotateAroundDistance(thePoint,this.plane.x,this.plane.y, this.plane.rotation,-100);
    this.muzzle.x =  newPoint.x;
    this.muzzle.y =  newPoint.y;
    //this.muzzle.setAngle(this.plane.angle);
  }

  updateWingsScale():void {
    // da orignial scale effect from luftrausers
    const scaleFactor = Math.abs(Math.sin(this.plane.rotation))*1;
    this.wings.scaleY = Phaser.Math.Clamp(1*scaleFactor,0.1,1);
  }
}
