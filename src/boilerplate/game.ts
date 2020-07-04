import 'phaser';
import { RauserScene } from './scenes/rauser-scene';

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
});
