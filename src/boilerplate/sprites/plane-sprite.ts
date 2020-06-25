export class Plane extends Phaser.Physics.Arcade.Sprite  {
  plane:   Phaser.Physics.Arcade.Image;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene:Phaser.Scene,x:number,y:number) {
    super(scene,x,y,null);

    this.setInteractive(true);
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    // @ts-ignore
    let worldSizeX:number = parseInt(this.game.config.width) * 4;
    // @ts-ignore
    let worldSizeY:number = parseInt(this.game.config.height) * 4;

    this.plane = this.scene.physics.add.image(worldSizeX/2, worldSizeY, 'player');
    this.plane.setBounce(1, 0.2);
    this.plane.setCollideWorldBounds(true);
  }

  updatePlane():void {
    const scaleFactor = Math.abs(Math.sin(this.plane.rotation));
    // TODO: use this for wings later on
    this.plane.setScale(1*scaleFactor);
  }
  update():void {
    this.updatePlane();

    // thrust
    if (this.cursors.up.isDown) {
        // @ts-ignore
        this.physics.velocityFromRotation(this.plane.rotation, 300*2, this.plane.body.acceleration);
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

    // @ts-ignore
    this.text.setText('Speed: ' + this.plane.body.speed);
  }


}
