export class DamageParticle extends Phaser.GameObjects.Particles.Particle {
  t: number;
  i: number;
  scene: Phaser.Scene;
  anim: Phaser.Animations.Animation;
  constructor(
    emitter: Phaser.GameObjects.Particles.ParticleEmitter,
    scene: Phaser.Scene
  ) {
    super(emitter);
    this.scene = scene;
    let config = {
      key: 'walk__',
      // @ts-ignore
      frames: this.scene.anims.generateFrameNumbers('debreeSprite'),
      frameRate: 2,
      repeat: -1,
    };

    // @ts-ignore
    this.anim = this.scene.anims.create(config);

    this.t = 0;
    this.i = 0;
  }

  update(delta: number, step: number, processors) {
    let result = super.update(delta, step, processors);

    this.t += delta;

    if (this.t >= this.anim.msPerFrame) {
      this.i++;

      if (this.i > 17) {
        this.i = 0;
      }

      this.frame = this.anim.frames[this.i].frame;

      this.t -= this.anim.msPerFrame;
    }

    return result;
  }
}

/*

https://phaser.io/examples/v3/view/game-objects/particle-emitter/custom-particles
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

let anim;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('mummy', 'assets/animations/mummy37x45.png', { frameWidth: 37, frameHeight: 45 });
}

function create ()
{
    let config = {
        key: 'walk',
        frames: this.anims.generateFrameNumbers('mummy'),
        frameRate: 18,
        repeat: -1
    };

    anim = this.anims.create(config);

    let particles = this.add.particles('mummy');

    // use: white gray and dark pixel frame
    // explosion animation gray and white and black circles
    let emitter = particles.createEmitter({
        x: 100,
        y: 100,
        frame: 0,
        quantity: 1,
        frequency: 200,
        angle: { min: 0, max: 30 },
        speed: 200,
        gravityY: 100,
        lifespan: { min: 1000, max: 2000 },
        particleClass: DamageParticle
    });
}*/
