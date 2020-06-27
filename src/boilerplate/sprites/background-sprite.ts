// Phaser.GameObjects.TileSprite
export class Background extends Phaser.Physics.Arcade.Sprite  {
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

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

        this.scene.add.image(width * 0.5, height * 0.5, 'bg3')
            .setScrollFactor(0)

        this.createAligned(this.scene, totalWidth, 'bg2', 0.25)
        this.createAligned(this.scene, totalWidth, 'bg1', 0.5)

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        //createAligned(this, totalWidth, 'ground', 1)
        //createAligned(this, totalWidth, 'plants', 1.25)
    }

    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {number} totalWidth 
     * @param {string} texture 
     * @param {number} scrollFactor 
     */
    createAligned = (scene, totalWidth, texture, scrollFactor) => {
        const w = scene.textures.get(texture).getSourceImage().width
        const count = Math.ceil(totalWidth / w) * scrollFactor

        let x = 0
        for (let i = 0; i < count; ++i)
        {
            const m = scene.add.image(x, scene.scale.height, texture)
                .setOrigin(0, 1)
                .setScrollFactor(1,scrollFactor)

            x += m.width
        }
    }

    updateBackground() {
        const cam = this.scene.cameras.main
		const speed = 5

		if (this.cursors.right.isDown)
		{
			cam.scrollX += speed
		}
		else if (this.cursors.left.isDown)
		{
			cam.scrollX -= speed
		}
    }

    initBg():void {
        // load all the stuff
        
        // layer 1 small clouds
        // layer 2 big clouds

        // idea: put in container and only move layer 2 relative to layer 1?
    }

    
}