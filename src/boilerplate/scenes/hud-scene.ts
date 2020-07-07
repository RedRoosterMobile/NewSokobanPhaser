import { SettingsSingleton } from '../utils/settings-singleton';
import { virtualScreen, getWorldSize } from '../utils/render-constants';

const gameSettings = SettingsSingleton.getInstance().settings;
export default class HUDScene extends Phaser.Scene {
  text: Phaser.GameObjects.Text;
  constructor() {
    super('hud-scene');
  }

  preload(): void {
    // load bitmap font
  }

  create(): void {
    console.log('preloading HUDDDDDDD scene.........!!!!!');
    // create hud
    const test = this.add
      .image(this.game.config.width as number, 0, 'dasboot')
      .setOrigin(1, 0)
      .setScale(1);

    this.text = this.add.text(10, 10, '', {
      font: '32px Arial',
      fill: '#22e1ff',
    });
  }

  update(time: number, delta: number): void {
    // update HUD
    gameSettings.score;
    gameSettings.currentStreak;
    gameSettings.streakLevels;

    this.text.setText(
      'fps:' + Phaser.Math.RoundTo(this.game.loop.actualFps, -2) + ' score:' + gameSettings.score
    );
  }
}
