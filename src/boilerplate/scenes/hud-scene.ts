import * as dat from 'dat.gui';
import { SettingsSingleton } from '../utils/settings-singleton';
import { virtualScreen, getWorldSize } from '../utils/render-constants';

// dat.GUI https://jsfiddle.net/yw645yuh/4/
// https://github.com/dataarts/dat.gui

const gameSettings = SettingsSingleton.getInstance().settings;
export default class HUDScene extends Phaser.Scene {
  text: Phaser.GameObjects.Text;
  gui: any;
  music: Phaser.Sound.BaseSound;
  constructor() {
    super('hud-scene');
    this.gui = new dat.GUI();
  }

  preload(): void {
    // load bitmap font
    this.load.audio('sndGameMusic', 'assets/rauser/sounds/rauser_bounce.mp3');
  }

  create(): void {
    const soundConfig = {
      mute: false,
      volume: 0.1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    };
    this.sound.play('sndGameMusic', soundConfig);
    this.music = this.sound.get('sndGameMusic');

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

    this.gui.add(gameSettings, 'maxFighters', 0, 100, 1);
    this.gui.add(gameSettings, 'fighterSpawnInterval', 1000, 12000, 1000);
    this.gui.add(gameSettings, 'maxBattleships', 0, 100, 1);
    this.gui.add(gameSettings, 'battleshipSpawnInterval', 1000, 32000, 1000);
    this.gui.add(gameSettings, 'zoom', 0.1, 0.5, 0.1);
    this.gui.add(gameSettings, 'sfxVolume', 0.0, 1.0, 0.01);
    this.gui.add(gameSettings, 'musicVolume', 0.0, 1.0, 0.01);
  }

  update(time: number, delta: number): void {
      /*
    if (!this.music.isPlaying) {
        this.music.play('sndGameMusic');

    }*/
    // @ts-ignore
    this.music.setVolume(gameSettings.musicVolume);
    
    // update HUD
    gameSettings.score;
    gameSettings.currentStreak;
    gameSettings.streakLevels;

    this.text.setText(
      'fps:' +
        Phaser.Math.RoundTo(this.game.loop.actualFps, -2) +
        ' score:' +
        gameSettings.score
    );
  }
}
