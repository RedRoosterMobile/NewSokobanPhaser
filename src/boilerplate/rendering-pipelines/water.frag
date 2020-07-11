precision mediump float;
#define amp .02
#define tint_color vec4(.45,.89,.99,1)

uniform float time;
uniform vec2 resolution;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

void main(void){
    
    vec2 uv=outTexCoord;
    "//uv.y *= -1.0;",
    //"uv.y += (sin((uv.x + (time * 0.5)) * 10.0) * 0.1) + (sin((uv.x + (time * 0.2)) * 32.0) * 0.01);",
    uv.x+=(sin((uv.y+(time*.5))*10.)*.1)+(sin((uv.y+(time*.2))*32.)*.01);
    //"uv.x += (sin((uv.y + (time * 0.5)) * 10.0) * amp/2.0) + (sin((uv.y + (time * amp)) * 32.0) * amp/20.0);",
    vec4 texColor=texture2D(uMainSampler,uv)*tint_color;
    gl_FragColor=texColor;
    
}