// Phaser.GameObjects.TileSprite
export class Background extends Phaser.Physics.Arcade.Sprite  {

    constructor(scene,x,y, worldSizeX, worldSizeY) {
        super(scene,x,y,null);
        // screen size?

        
        /*const graphics = this.scene.add.graphics();
        graphics.fillGradientStyle(0xff0000, 0xff0000, 0xffff00, 0xffff00, 1);
        graphics.fillRect(0, 0, worldSizeX, worldSizeY);

        graphics.generateTexture('bgGradient',100,worldSizeY);*/
        

        let sky = this.scene.add
        .tileSprite(0, 0, worldSizeX, worldSizeY,'bgGradient')
        .setOrigin(0.5, 0)
        .setScrollFactor(0,1)
        .setTint(0xffeeff);
        //let image = this.scene.add.image(400, 300, 'bgGradient');
        
        
    }

    initBg():void {
        // load all the stuff
        
        // layer 1 small clouds
        // layer 2 big clouds

        // idea: put in container and only move layer 2 relative to layer 1?
    }

    
}