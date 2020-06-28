// https://github.com/photonstorm/phaser3-examples/blob/master/public/src/games/topdownShooter/topdown_combatMechanics.js

export class Enemy extends Phaser.GameObjects.Image  {

  speed     = 0.01;
  born      = 0;
  xSpeed    = 0;
  ySpeed    = 0;
  direction = 0;
  hp        = 10;
  target: Enemy;

  sound:Phaser.Sound.BaseSound;

  constructor(scene,x=0,y=0) {
    super(scene,x,y,'enemy');
    // super.setTexture('');
    this.speed = 0.1;
    this.born = 0;
    this.direction = 0;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.setSize(12, 12);
    this.setScale(4);
    //this.hp = 10;
  }

  // TODO: somehow passing an object to the constructor 
  // to change properites of enemy: class, texture, hp, speed, ...

  playFireSound(loop=false) {

  }

  decreaseHealth(value:number) : void {
    this.hp-=value;
    if ( this.hp <= 0 ) {
      // TODO: explosionz!!!!!!

      console.log('AAAHHHHHHHRGHHH!!!');
      // or set inactive??? dunno...
      this.setActive(false);
      this.setVisible(false);
      this.destroy();
    }
  }

  moveToTarget(target) {

        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

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

  // Updates the position of the bullet each cycle
  update(time:number, delta:number):void {
    if (this.target) {
      // less speed on y (we are planes and have to turn..)
      this.scene.physics.accelerateToObject(this, this.target, 320, 300, 250);
    }
    /*
      this.x += this.xSpeed * delta;
      this.y += this.ySpeed * delta;
      */
     /*this.moveToTarget({
       x:this.x + this.xSpeed * delta,
       y:this.y += this.ySpeed * delta
      });*/

  }


}