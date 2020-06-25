// TODO:
// - no/less gravity when flying sideways (because of updrift, depending on speed)
// - wings!

import { Tilemaps } from "phaser";


// check this!
// https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html

export class Plane extends Phaser.Physics.Arcade.Sprite  {
  plane:   Phaser.Physics.Arcade.Image;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  renderContainer:   Phaser.GameObjects.Container;
  graphics: Phaser.GameObjects.Graphics;

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


    this.plane = this.scene.physics.add.image(x, y, 'player',0);
    this.plane.setInteractive(true);
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    //this.plane.setBounce(1, 0.2);
    this.plane.setCollideWorldBounds(true);
    this.plane.setDamping(true);
    this.plane.setDrag(0.99);
    this.plane.setMaxVelocity(400);
    this.plane.setAngle(-90);




    this.graphics = this.scene.add.graphics();

    this.graphics.fillGradientStyle(0xff0000, 0xff0000, 0xffff00, 0xffff00, 1);
    this.graphics.fillRect(0, 0, 50, 50);


    this.renderContainer = this.scene.add.container(0, 0, [this.plane, this.graphics]);
    //this.container = new Container(this.scene , x , y , [this.plane, graphics]);

    // this.plane.addChild(game.make.sprite(-50, -50, 'mummy'));
  }



  updatePlane():void {

    //const scaleFactor = Math.abs(Math.sin(this.plane.rotation));
    // TODO: use this for wings later on
    //this.plane.setScale(1*scaleFactor);
    // thrust
    if (this.cursors.up.isDown) {
      // @ts-ignore
      this.scene.physics.velocityFromRotation(this.plane.rotation, 300*2, this.plane.body.acceleration);
  }
  else {
      this.plane.setAcceleration(0);
  }

  // steer
  if (this.cursors.left.isDown) {
      this.plane.setAngularVelocity(-300);
  }
  else if (this.cursors.right.isDown) {
      this.plane.setAngularVelocity(300);
  }
  else {
      this.plane.setAngularVelocity(0);
  }
  this.graphics.x = this.plane.x;
  this.graphics.y = this.plane.y;
  this.graphics.angle = this.plane.angle;

  // @ts-ignore
  //this.text.setText('Speed: ' + this.plane.body.speed);
  }


}
