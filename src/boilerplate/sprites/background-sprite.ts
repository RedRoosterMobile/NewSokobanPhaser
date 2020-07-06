// better backround colors
// https://www.google.com/search?q=sunset+indonesia&tbm=isch&ved=2ahUKEwj--teky67qAhWXt6QKHW5GD5MQ2-cCegQIABAA&oq=sunset+indonesia&gs_lcp=CgNpbWcQAzICCAAyBggAEAUQHjIGCAAQBRAeMgYIABAIEB4yBggAEAgQHjIGCAAQCBAeMgYIABAIEB4yBggAEAgQHjIGCAAQCBAeMgYIABAIEB46BAgAEEM6BQgAELEDOgcIABCxAxBDUJt5WNCVAWCTlwFoAHAAeAGAAcoCiAHKCpIBCDE0LjEuMC4xmAEAoAEBqgELZ3dzLXdpei1pbWc&sclient=img&ei=mtX9Xv7FI5fvkgXujL2YCQ&bih=660&biw=1440#imgrc=g3oLo6HeP3UXcM
export class Background extends Phaser.Physics.Arcade.Sprite {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  bg1: Phaser.GameObjects.TileSprite;
  bg2: Phaser.GameObjects.TileSprite;
  bg3: Phaser.GameObjects.TileSprite;

  constructor(scene, x, y, worldSizeX, worldSizeY) {
    super(scene, x, y, null);
    // screen size?

    /*const graphics = this.scene.add.graphics();
        graphics.fillGradientStyle(0xff0000, 0xff0000, 0xffff00, 0xffff00, 1);
        graphics.fillRect(0, 0, worldSizeX, worldSizeY);

        this.load.image('bg1', 'assets/rauser/clouds_front.png');
        this.load.image('bg2', 'assets/rauser/clouds_center.png');
        this.load.image('bg3', 'assets/rauser/clouds_back.png');

        graphics.generateTexture('bgGradient',100,worldSizeY);*/

    let sky = this.scene.add
      .tileSprite(0, 0, worldSizeX, worldSizeY, 'bgGradient')
      .setOrigin(0.5, 0)
      .setScrollFactor(0, 1)
      .setTint(0xffeeff);

    // FIXME: why is this shit so super CPU heavy???

    this.bg3 = this.scene.add
      .tileSprite(0, 0, 800, 600, 'bg1')
      .setScrollFactor(0)
      .setScale(4)
      .setTint(0x123456)
      .setAlpha(0.1);
    this.bg3.tilePositionX = 50;
    this.bg2 = this.scene.add
      .tileSprite(0, 0, 800, 600, 'bg1')
      .setScrollFactor(0)
      .setScale(5)
      .setTint(0xff3456)
      .setAlpha(0.3);
    this.bg2.tilePositionX = 100;
    this.bg1 = this.scene.add
      .tileSprite(0, 0, 800, 600, 'bg1')
      .setScrollFactor(0)
      .setScale(6)
      .setTint(0xffff56)
      .setAlpha(0.8);
    this.bg1.tilePositionX = 500;
  }

  updateBackground(velocityX, velocityY) {
    // https://www.youtube.com/watch?v=pknZUn82x2U best way tilesprites
    // https://www.html5gamedevs.com/topic/36524-tilesprite-for-parallax/
    const damperX = 500;
    this.bg1.tilePositionX += velocityX / damperX;
    this.bg2.tilePositionX += (velocityX / damperX) * 0.5;
    this.bg3.tilePositionX += (velocityX / damperX) * 0.1;

    const damperY = 10000 / 2;
    this.bg1.tilePositionY += velocityY / damperY;
    this.bg2.tilePositionY += (velocityY / damperY) * 0.5;
    this.bg3.tilePositionY += (velocityY / damperY) * 0.1;
  }
  updateBackgroundFromCamera() {
    const cam = this.scene.cameras.main;
    cam.scrollX;
  }

  initBg(): void {
    // load all the stuff
    // layer 1 small clouds
    // layer 2 big clouds
    // idea: put in container and only move layer 2 relative to layer 1?
  }
}
