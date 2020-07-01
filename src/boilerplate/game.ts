import "phaser";
import { RauserScene } from "./scenes/rauser-scene";

// rauser game configuration
const config: Phaser.Types.Core.GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: "game",
  scene: RauserScene,
  physics: {
    default: 'arcade',
    arcade: {
        fps: 60,
        gravity: { y: 0 }, // 200
        debug: false
    },
  },
  render: {
      antialias: false,
      pixelArt: true,
      roundPixels: true
  },
  plugins: {
    /*scene: [
      {
        key: "LightraysPlugin",
        plugin: LightraysPlugin,
        mapping: "lightrays"
      }
    ]*/
  },
  callbacks: {
    postBoot: game => {
      // @ts-ignore
      //game.renderer.addPipeline("Custom", new CustomPipeline(game));
    }
  },
  backgroundColor: 0x22e1ff
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

// when the page is loaded, create our game instance
window.addEventListener("load", () => {
  const game = new Game(config);
  // @ts-ignore
  window.game = game;
});
