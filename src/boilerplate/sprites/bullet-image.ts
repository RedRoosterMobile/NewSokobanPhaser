// https://github.com/photonstorm/phaser3-examples/blob/master/public/src/games/topdownShooter/topdown_combatMechanics.js

export class Bullet extends Phaser.GameObjects.Image  {

  speed =1;
  born=0;
  xSpeed=0;
  ySpeed=0;
  direction=0

  constructor(scene,x=0,y=0) {
    super(scene,x,y,'bullet');
    this.speed = 1;
    this.born = 0;
    this.direction = 0;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.setSize(12, 12);
  }

  fire(shooter, target):void {
        this.setPosition(shooter.x, shooter.y); // Initial position
        //this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

        this.direction = shooter.rotation;

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
  // Updates the position of the bullet each cycle
  update(time, delta):void
  {
      this.x += this.xSpeed * delta;
      this.y += this.ySpeed * delta;
      this.born += delta;
      if (this.born > 1800)
      {
        console.log('killing bullet');
          this.setActive(false);
          this.setVisible(false);
      }
  }

}