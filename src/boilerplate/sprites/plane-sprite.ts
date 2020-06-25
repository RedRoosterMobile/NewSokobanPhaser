// TODO:
// - no/less gravity when flying sideways (because of updrift, depending on speed)
// - wings!
// - LAG of wings (workaround: embrace the lag: use a transparent pic for physics, body and wings will have the same lag..)

import { Tilemaps } from "phaser";


// check this!
// https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html

export class Plane extends Phaser.Physics.Arcade.Sprite  {



  plane:   Phaser.Physics.Arcade.Image;
  wings: Phaser.GameObjects.Image;

  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  renderContainer:   Phaser.GameObjects.Container;
  rightWing: Phaser.GameObjects.Image;
  leftWing: Phaser.GameObjects.Image;
  planeBody: Phaser.GameObjects.Image;

  constructor(scene:Phaser.Scene,x:number,y:number) {
    super(scene,x,y,null);


    /*
    // @ts-ignore
    let worldSizeX:number = parseInt(this.scene.game.config.width) * 4;
    // @ts-ignore
    let worldSizeY:number = parseInt(this.scene.game.config.height) * 4;
    */

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

    this.wings = this.scene.add.image(0,0,'planeWings');
    this.planeBody = this.scene.add.image(0, 0, 'planeBody',0);

    // https://phaser.io/examples/v3/view/game-objects/container/add-array-of-sprites-to-container
    // this shit cointainer does not work at all... what's it good for if I have to do everything manually anyway???
    //this.renderContainer = this.scene.add.container(0, 0, [this.plane, this.wings]);
    //this.container = new Container(this.scene , x , y , [this.plane, graphics]);

    // this.plane.addChild(game.make.sprite(-50, -50, 'mummy'));
  }

  updatePlane():void {
    // thrust
    if (this.cursors.up.isDown) {
        // @ts-ignore
        this.scene.physics.velocityFromRotation(this.plane.rotation, 300*2, this.plane.body.acceleration);
        this.updateWings();
        // @ts-ignore
        //this.scene.physics.velocityFromRotation(this.leftWing.rotation, 300*2, this.plane.body.acceleration);
    }
    else {
        this.plane.setAcceleration(0);
        this.updateWings();
    }

    // steer
    if (this.cursors.left.isDown) {
        this.plane.setAngularVelocity(-300);
        this.updateWings();
    }
    else if (this.cursors.right.isDown) {
        this.plane.setAngularVelocity(300);
        this.updateWings();
    }
    else {
        this.plane.setAngularVelocity(0);
        this.updateWings();
    }
    this.updateWings();
    // @ts-ignore
    //this.text.setText('Speed: ' + this.plane.body.speed);
  }
  updateWings():void {
    this.wings.setAngle(this.plane.angle);
    this.wings.setX(this.plane.x)
    this.wings.setY(this.plane.y);
    this.planeBody.setAngle(this.plane.angle);
    this.planeBody.setX(this.plane.x);
    this.planeBody.setY(this.plane.y);
    this.updateWingsScale();
  }

  updateWingsScale():void {
    // somehow only do this when left button is pressed but x-vector is positive
    // or when right button is pressed and x-vector is negative
    //console.log(this.plane.body.velocity);

/*
    const scaleFactor = Math.abs(Math.sin(this.plane.rotation))*1;

    if (this.cursors.up.isDown && this.cursors.left.isDown && this.plane.body.velocity.x > 0) {
      this.wings.setScale(Phaser.Math.Clamp(1*scaleFactor,0.5,1),1);
    } else if (this.cursors.up.isDown && this.cursors.right.isDown && this.plane.body.velocity.x < 0) {
      this.wings.setScale(Phaser.Math.Clamp(1*scaleFactor,0.5,1),1);
    } else {

      //this.wings.scaleY = 1;


    }
    */


    // @ts-ignore
    const secretSauce = (Math.abs(this.plane.body.acceleration.x) > Math.abs(this.plane.body.velocity.x));

    const isPlaneTurning = secretSauce;
    if (this.cursors.space.isDown) {
      // @ts-ignore
      console.log( this.plane.body);
    }
    const tweenTime:number = 100;
    const easing = 'Sine.easeInOut';
    if (isPlaneTurning) {
      const scaleFactor = Math.abs(Math.sin(this.plane.rotation))*1;

      // TODO: find an easing function that works
      this.scene.tweens.add({
        targets: this.wings,
        scaleX: Phaser.Math.Clamp(1*scaleFactor,0.5,1),
        duration: tweenTime,
        repeat: 1,
        easing:easing
    });
    } else {
      this.wings.setScale(1);
      /*this.scene.tweens.add({
        targets: this.wings,
        scaleX: 1,
        duration: 0,
        repeat: 1,
        easing:easing
    });*/
    }
  }


}
