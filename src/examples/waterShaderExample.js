var CustomPipeline2 = new Phaser.Class({

    Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,

    initialize:

    function CustomPipeline2 (game)
    {
        Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
            game: game,
            renderer: game.renderer,
            fragShader: [
            "precision mediump float;",
            "#define amp 0.02",
            "#define tint_color vec4(0.45, 0.89,0.99, 1)",

            "uniform float     time;",
            "uniform vec2      resolution;",
            "uniform sampler2D iChannel0;", // name does not matter???
            "varying vec2 outTexCoord;",

            "void main( void ) {",

                "vec2 uv = outTexCoord;",
                "uv.x *= 1.0;",
                "vec2 part1 = (vec2(.5)-texture2D(iChannel0, uv*0.3+vec2(time*0.05, time*0.025)).xy)*amp;",
                "vec2 p = uv + part1 + (vec2(.5)-texture2D(iChannel0, uv*0.3-vec2(-time*0.005, time*0.0125)).xy)*amp;",
                "p.x += (sin((uv.y + (time * 0.5)) * 10.0) * amp/2.0) + (sin((uv.y + (time * amp)) * 32.0) * amp/20.0);",
                "gl_FragColor = texture2D(iChannel0, p)*tint_color; ",
                //"uv.x += (sin((uv.y + (time * 0.5)) * 10.0) * amp/2.0) + (sin((uv.y + (time * amp)) * 32.0) * amp/20.0);",
                //"vec4 texColor = texture2D(uMainSampler, uv)*tint_color;",
                //"gl_FragColor = texColor;",

            "}"
            ].join('\n')
        });
    } 

});

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var time = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('volcano', 'assets/pics/rick-and-morty-by-sawuinhaff-da64e7y.png');
    //this.load.image('hotdog', 'assets/sprites/hotdog.png');

    customPipeline = game.renderer.addPipeline('Custom', new CustomPipeline2(game));
    customPipeline.setFloat2('resolution', game.config.width, game.config.height);
}

function create ()
{
    this.add.image(400, 300, 'volcano');
    //this.add.image(400, 300, 'hotdog').setScrollFactor(0);

    this.cameras.main.setRenderToTexture(customPipeline);

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        acceleration: 0.06,
        drag: 0.0005,
        maxSpeed: 1.0
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
}

function update (t, delta)
{
    controls.update(delta);

    customPipeline.setFloat1('time', time);

    time += 0.005;
}
