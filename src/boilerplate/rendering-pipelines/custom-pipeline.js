
import Phaser from "phaser";
//import WaterFrag from "!!file-loader!./water.frag";
//import TextureTintVert from "./TextureTint.vert";

// shader for single objects!!!
// https://phaser.io/examples/v3/view/renderer/custom-pipeline

// why shaders?
// https://www.dynetisgames.com/2018/12/09/shaders-phaser-3/#Distortion_shader

const CustomPipeline = new Phaser.Class({
  Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,
  initialize: function CustomPipeline(game) {
    //console.log(game.renderer);
    Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
      game: game,
      renderer: game.renderer,
      //fragShader: WaterFrag,
      fragShader: [
        "precision mediump float;",
        "#define amp 0.02",
        "#define tint_color vec4(0.45, 0.89,0.99, 1)",

        "uniform float     time;",
        "uniform vec2      resolution;",
        "uniform sampler2D uMainSampler;",
        "varying vec2 outTexCoord;",

        "void main( void ) {",

            "vec2 uv = outTexCoord;",
            "uv.x *= 1.0;",
            "vec2 part1 = (vec2(.5)-texture2D(uMainSampler, uv*0.3+vec2(time*0.05, time*0.025)).xy)*amp;",
            "vec2 p = uv + part1 + (vec2(.5)-texture2D(uMainSampler, uv*0.3-vec2(-time*0.005, time*0.0125)).xy)*amp;",
            "p.x += (sin((uv.y + (time * 0.5)) * 10.0) * amp/2.0) + (sin((uv.y + (time * amp)) * 32.0) * amp/20.0);",
            "gl_FragColor = texture2D(uMainSampler, p)*tint_color; ",
            //"uv.x += (sin((uv.y + (time * 0.5)) * 10.0) * amp/2.0) + (sin((uv.y + (time * amp)) * 32.0) * amp/20.0);",
            //"vec4 texColor = texture2D(uMainSampler, uv)*tint_color;",
            //"gl_FragColor = texColor;",

        "}"
        ].join('\n'),
      //topology: game.renderer.gl.TRIANGLES
    });
  }
});

export default CustomPipeline;