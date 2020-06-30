// TODO:
// - no/less gravity when flying sideways (because of updrift, depending on speed)
// - wings! OK
// - bullet sound: flak from Wings of Fury (Bassy as hell!) OK
// - LAG of wings (workaround: embrace the lag: use a transparent pic for physics, body and wings will have the same lag..)
// - engine sound. Rip this and add more bass (Wings of Fury) https://www.youtube.com/watch?v=ZZSwdqg6VE4
// - when hitting the water, add some sort of water updrift that gives the planes an upwards push while under water
// -> aka REVERSE GRAVITY and amplifiy it! OK
// - when plane gets close to the water, show thrustwaves in the water. FlipY depending on velocity?
// - different particle effects depending on damage level
// - particel effect editor: https://labs.phaser.io/view.html?src=src/game%20objects/particle%20emitter/particle%20editor.js&v=3.23.0
// - add more (and harder) enemies depending on score
// - intro music? https://www.remix64.com/track/mano/wings-of-fury-orchestral-remix/

import { Tilemaps } from "phaser";



const sumArrayValues = (values) => {
  return values.reduce((p, c) => p + c, 0)
}

const arrAvg = arr => sumArrayValues(arr) / arr.length

const weightedMean = (factorsArray, weightsArray) => {
  return sumArrayValues(factorsArray.map((factor, index) => factor * weightsArray[index])) / sumArrayValues(weightsArray)
}

// weightedMean([251, 360, 210], [0.1, 0.5, 0.7]);

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
  camMuzzle: Phaser.GameObjects.Image;
  renderContainer:   Phaser.GameObjects.Container;
  hpMax: 300;
  hp: number;
  fireCallback: Function;
  isShooting: boolean;
  emitter:Phaser.GameObjects.Particles.ParticleEmitter;
  initialZoom: integer

  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
  emitterFrame: number;
  isCamTweening: boolean;


  constructor(scene:Phaser.Scene,x:number,y:number) {
    super(scene,x,y,null);

    this.hp= 10;
    this.hpMax= 300;
    this.isShooting= false;
    this.isCamTweening = false;

    this.emitterFrame = 1;


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

    // waaay better. let camera follow muzzle. move the muzzele further when speeding and rotation is heavy left or right. come closer when 0 or 180 deg
    this.muzzle = this.scene.add.image(0, 0, "car", 0)
    this.camMuzzle = this.scene.add.image(0, 0, "car", 0)
    this.muzzle.setVisible(false);
    //this.camMuzzle.setVisible(false);



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
    this.camMuzzle.setOrigin(0.5,0.5);
    //this.muzzle.setAngle(90);
    //this.muzzle.x=64;

    this.createParticles()
    this.createAnims();
    // nausea + 10000!
    //this.scene.input.keyboard.on('keyup-' + 'UP',   this.justWentOffTheGas);
    this.initialZoom=this.scene.cameras.main.zoom;
  }

  /*

  Observation:
  ------------

  while boosting:
  when fliying right - plane should be on the left side of the camera
  when fliying left - plane should be on the left right of the camera
  when fliying up - plane should be on the left bottom of the camera
  when fliying down - plane should be on the left top of the camera

  while ideling:
  normal?

  */

  justWentOffTheGas = (event):void => {
    console.log('UP key is UP: camera zoom tween here', event.timeStamp);
    let previousZoom = 0.4;//this.scene.cameras.main.zoom;
    const targetVector:Phaser.Math.Vector2 = new Phaser.Math.Vector2(this.scene.cameras.main.scrollX,this.scene.cameras.main.scrollY);
    this.scene.physics.velocityFromRotation(this.plane.rotation, 400, targetVector);
    const diff = event.timeStamp-this.cursors.up.timeDown;

    this.scene.tweens.add({
      targets: this.scene.cameras.main,
      props: {
        //zoom: previousZoom-0.01,
        scrollX: this.scene.cameras.main.scrollX+targetVector.x*diff/10000,
        scrollY: this.scene.cameras.main.scrollY+targetVector.y*diff/10000,
      },
      delay: 0,
      yoyo: false,
      duration: Phaser.Math.Clamp(diff,0,400),
      // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/tween/#ease-equations
      ease: "Cubic.easeIn",
      easeParams: null,
      hold: 0,
      repeat: 0,
      onComplete: () => {
        this.scene.cameras.main.zoom=previousZoom;
      }
    });
    //this.scene.cameras.main.zoom=previousZoom;

  }

  createParticles():void {
    this.particles = this.scene.add.particles('debreeSprite');
    this.emitter = this.particles.createEmitter( {
      x: this.plane.x,
      y: this.plane.y,
      frame: 0,
      quantity: 0, // 3
      frequency: 100,
      angle: { min: 0, max: 360 },
      scale: { start: 5, end: 1 },
      speed: 200,
      gravityY: this.plane.body.gravity.y,
      lifespan: { min: 1000, max: 2000 },
    });
    this.emitter.setFrame(0);
  }

  decreaseHealth(value:number) : void {
    console.log(typeof this.hp, value);
    this.hp -= value;
    console.log(this.hp);
    this.emitter.setQuantity(3);
    if ( this.hp <= 0 ) {
      // TODO: explosionz!!!!!!

      console.log('YOU DIE!!!');
      this.plane.setVelocityX(0);
      this.plane.setVelocityY(0);
      this.plane.setGravity(0,0);
      this.plane.setActive(false);
      this.plane.destroy();
      // explosionz,
      this.setActive(false);
      this.setVisible(false);
      this.destroy();
    }

  }

  increaseHealth(value:number) : void {
    if (this.hp < this.hpMax)
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
  }

  updatePlane():void {

    if (!this.active || !this.plane.body) {
      // console.log('probaly dead!', this.hp);
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
        this.knockback(10);


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

        const { worldSizeY } = this.getWorldSize();
        if ( this.plane.y > worldSizeY ) {
          const factor = Math.abs(this.plane.y - worldSizeY);
          this.plane.setGravity(0 , -10 * factor);
        }  else {
          this.plane.setGravity(0 , 0);
        }
    } else {
      // TODO: while x velocity is still active don't add too much gravity
      const { worldSizeY } = this.getWorldSize();
      if (this.plane.y > worldSizeY) {
        const factor = Math.abs(this.plane.y - worldSizeY);
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
    const rotation = this.plane.rotation;

    const thePoint = new Phaser.Geom.Point(-100000,0);
    const newMuzzlePoint = Phaser.Math.RotateAroundDistance(thePoint,this.plane.x,this.plane.y, rotation,-100);
    const thePoint2 = new Phaser.Geom.Point(-100000,0);

    // TODO: try velocity
    //const camRotation = Math.abs(Math.cos(rotation)*300)*-1;
    const speed = Math.sqrt(Math.pow(this.plane.body.velocity.x,2)+Math.pow(this.plane.body.velocity.y,2));


    //console.log(speed);
    // when going straight left/right and speeding
    let camRotation;

    if (this.cursors.left.isDown || this.cursors.right.isDown) {
     //camRotation = speed/4*-1;
    } else {
      //camRotation = speed/2*-1;
    }

    let secret = Math.abs(Math.sin(this.plane.angle));
    secret = Math.atan( (this.camMuzzle.x) / (this.camMuzzle.y));

    //Phaser.Math.Interpolation.
    camRotation = speed/2 * -1;
    let camRotation2 = Math.abs(Math.cos(rotation)*300)*-1;

    //const averageRotation = arrAvg([camRotation,camRotation2]);
    //const averageRotation = arrAvg([camRotation,camRotation2]);

    // change weight depending on rotation?
    //const averageRotation = weightedMean([camRotation,camRotation2], [Math.abs(Math.cos(rotation)),Math.abs(Math.sin(rotation))]);

    let averageRotation = weightedMean([camRotation,camRotation2], [0.9,0.1]);


    /*
    It’s more simple than it looks. Just sum all positions of the objects you want the camera to focus on,
    possibly with different weights (eg: player has higher weight vs bullets).
    The average position is where the camera should focus. Apply some lerps on that and that’s it.’
    */




    // tween cam rotation on speed? the higher the speed, the longer the duration of the tween
    // might help againt nausea while sterring at high speeds


    //console.log(this.plane.an);

    const newCamPoint = Phaser.Math.RotateAroundDistance(thePoint2,this.plane.x,this.plane.y, rotation,averageRotation);
    this.muzzle.x =  newMuzzlePoint.x;
    this.muzzle.y =  newMuzzlePoint.y;


    if (this.cursors.up.isDown) {
      this.camMuzzle.x = newCamPoint.x;
      this.camMuzzle.y = newCamPoint.y;
    } else {
      if (this.isCamTweening)
        return;
      // tween
      this.scene.tweens.add({
        onStart: () => {
          this.isCamTweening = true;
        },
        targets: this.camMuzzle,
        props: {
          x: newMuzzlePoint.x,
          y: newMuzzlePoint.y
        },
        delay: 0,
        yoyo: false,
        duration: 200,
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/tween/#ease-equations
        ease: "Linear.easeIn",
        easeParams: null,
        hold: 0,
        repeat: 0,
        onComplete: () => {
          this.isCamTweening = false;
        }
      });
      //this.camMuzzle.x = newPoint.x;
      //this.camMuzzle.y = newPoint.y;
    }
    //this.muzzle.setAngle(this.plane.angle);

    this.updateParticles();
  }

  updateParticles():void {
    this.emitter.setPosition(this.plane.x,this.plane.y);
    if (this.hp <= 299 ) {

      this.emitterFrame += 1;
      if (this.emitterFrame > 3) {
        this.emitterFrame = 0;
      }

      //console.log('pausing emitter');
      //this.emitter.stop();
    } else {
      this.emitterFrame = 0;
      //console.log('resuming emitter', this.hp, this.hpMax);
      //this.emitter.start();
    }
    this.emitter.setFrame(this.emitterFrame);
  }

  updateWingsScale():void {
    // da orignial scale effect from luftrausers
    const scaleFactor = Math.abs(Math.sin(this.plane.rotation))*1;
    this.wings.scaleY = Phaser.Math.Clamp(1*scaleFactor,0.1,1);
  }
}
