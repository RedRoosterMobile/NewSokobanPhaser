import 'phaser';
import { RauserScene } from './scenes/rauser-scene';
import CustomPipeline from './rendering-pipelines/custom-pipeline';

// main game configuration
/*const config: Phaser.Types.Core.GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: "game",
  scene: MainScene
};*/

// 4/3      = 1,333
// 320/240  = 1,333
// 800/600  = 1,333
// 1024/768 = 1,333
// rauser game configuration
const config: Phaser.Types.Core.GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.WEBGL,
  parent: 'game',
  scene: RauserScene,
  physics: {
    default: 'arcade',
    arcade: {
      fps: 60,
      gravity: { y: 0 }, // 200
      debug: false,
    },
  },
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true,
  },
  plugins: {
    global: [{}],
  },
  callbacks: {
    postBoot: game => {
      console.log('post boot: loading custom pipeline');
      // @ts-ignore
      var customPipeline = game.renderer.addPipeline('Custom', new CustomPipeline(game));

      customPipeline.setFloat2('resolution', game.config.width, game.config.height);
      // @ts-ignore
      window.customPipeline = customPipeline; 
    }
  },
  backgroundColor: 0x22e1ff,
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

// when the page is loaded, create our game instance
window.addEventListener('load', () => {
  const game = new Game(config);
  // @ts-ignore
  window.game = game;
});
