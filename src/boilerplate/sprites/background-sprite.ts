// Phaser.GameObjects.TileSprite
export class Background extends Phaser.Physics.Arcade.Sprite  {
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    bg1:Phaser.GameObjects.TileSprite;
    bg2:Phaser.GameObjects.TileSprite;
    bg3:Phaser.GameObjects.TileSprite;

    constructor(scene,x,y, worldSizeX, worldSizeY) {
        super(scene,x,y,null);
        // screen size?

        
        /*const graphics = this.scene.add.graphics();
        graphics.fillGradientStyle(0xff0000, 0xff0000, 0xffff00, 0xffff00, 1);
        graphics.fillRect(0, 0, worldSizeX, worldSizeY);

        this.load.image('bg1', 'assets/rauser/clouds_front.png');
        this.load.image('bg2', 'assets/rauser/clouds_center.png');
        this.load.image('bg3', 'assets/rauser/clouds_back.png');

        graphics.generateTexture('bgGradient',100,worldSizeY);*/
        

        let sky = this.scene.add
        .tileSprite(0, 0, worldSizeX, worldSizeY,'bgGradient')
        .setOrigin(0.5, 0)
        .setScrollFactor(0,1)
        .setTint(0xffeeff);
        //let image = this.scene.add.image(400, 300, 'bgGradient');
        
        const width = this.scene.scale.width
        const height = this.scene.scale.height
        const totalWidth = width * 10

         this.bg3 = this.scene.add.tileSprite(0,0,800, 600, 'bg3')
            .setScrollFactor(0).setScale(4);
         this.bg2 = this.scene.add.tileSprite(0,0,800, 600, 'bg2')
            .setScrollFactor(0).setScale(4);
         this.bg1 = this.scene.add.tileSprite(0,0,800, 600, 'bg1')
            .setScrollFactor(0).setScale(4);;

        //this.createAligned(this.scene, totalWidth, 'bg2', 0.25)
        //this.createAligned(this.scene, totalWidth, 'bg1', 0.5)

        
        //createAligned(this, totalWidth, 'ground', 1)
        //createAligned(this, totalWidth, 'plants', 1.25)
    }


    // TODO: use velocity of player!!
    updateBackground(velocityX,velocityY) {
        // https://www.youtube.com/watch?v=pknZUn82x2U best way tlesprites


        const damperX = 50;
        this.bg1.tilePositionX += velocityX/damperX;
        this.bg2.tilePositionX += velocityX/damperX *0.5;
        this.bg3.tilePositionX += velocityX/damperX * 0.1;

        const damperY = 1000;
        this.bg1.tilePositionY += velocityY/damperY;
        this.bg2.tilePositionY += velocityY/damperY *0.5;
        this.bg3.tilePositionY += velocityY/damperY * 0.1;

     
    }

    initBg():void {
        // load all the stuff
        
        // layer 1 small clouds
        // layer 2 big clouds

        // idea: put in container and only move layer 2 relative to layer 1?
    }

    
}