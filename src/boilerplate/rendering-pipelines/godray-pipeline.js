
// wegGL version
// https://codepen.io/alaingalvan/pen/ICasz

// pixi js version
// https://pixijs.io/pixi-filters/docs/PIXI.filters.GodrayFilter.html
// pixi src
// https://github.com/search?q=org%3Apixijs+godray&type=Code

// pixi: da real src
// https://github.com/pixijs/pixi-filters/tree/9ccb70a5f716a06a41e6ce1b15dfc4245deca111/filters/godray/src




import Phaser from "phaser";
/* docs from pixi: 
* https://github.com/pixijs/pixi-filters/blob/9ccb70a5f716a06a41e6ce1b15dfc4245deca111/filters/godray/src/GodrayFilter.js
* @example
*  displayObject.filters = [new GodrayFilter()];
* @param {object} [options] Filter options
* @param {number} [options.angle=30] Angle/Light-source of the rays.
* @param {number} [options.gain=0.5] General intensity of the effect.
* @param {number} [options.lacunrity=2.5] The density of the fractal noise.
* @param {boolean} [options.parallel=true] `true` to use `angle`, `false` to use `center`
* @param {number} [options.time=0] The current time position.
* @param {PIXI.Point|number[]} [options.center=[0,0]] Focal point for non-parallel rays,
*        to use this `parallel` must be set to `false`.
*/

const perlinNoise =`
vec3 mod289(vec3 x)
{
return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 mod289(vec4 x)
{
return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 permute(vec4 x)
{
return mod289(((x * 34.0) + 1.0) * x);
}
vec4 taylorInvSqrt(vec4 r)
{
return 1.79284291400159 - 0.85373472095314 * r;
}
vec3 fade(vec3 t)
{
return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}
// Classic Perlin noise, periodic variant
float pnoise(vec3 P, vec3 rep)
{
vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
Pi0 = mod289(Pi0);
Pi1 = mod289(Pi1);
vec3 Pf0 = fract(P); // Fractional part for interpolation
vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
vec4 iy = vec4(Pi0.yy, Pi1.yy);
vec4 iz0 = Pi0.zzzz;
vec4 iz1 = Pi1.zzzz;
vec4 ixy = permute(permute(ix) + iy);
vec4 ixy0 = permute(ixy + iz0);
vec4 ixy1 = permute(ixy + iz1);
vec4 gx0 = ixy0 * (1.0 / 7.0);
vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
gx0 = fract(gx0);
vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
vec4 sz0 = step(gz0, vec4(0.0));
gx0 -= sz0 * (step(0.0, gx0) - 0.5);
gy0 -= sz0 * (step(0.0, gy0) - 0.5);
vec4 gx1 = ixy1 * (1.0 / 7.0);
vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
gx1 = fract(gx1);
vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
vec4 sz1 = step(gz1, vec4(0.0));
gx1 -= sz1 * (step(0.0, gx1) - 0.5);
gy1 -= sz1 * (step(0.0, gy1) - 0.5);
vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);
vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
g000 *= norm0.x;
g010 *= norm0.y;
g100 *= norm0.z;
g110 *= norm0.w;
vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
g001 *= norm1.x;
g011 *= norm1.y;
g101 *= norm1.z;
g111 *= norm1.w;
float n000 = dot(g000, Pf0);
float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
float n111 = dot(g111, Pf1);
vec3 fade_xyz = fade(Pf0);
vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
return 2.2 * n_xyz;
}
float turb(vec3 P, vec3 rep, float lacunarity, float gain)
{
float sum = 0.0;
float sc = 1.0;
float totalgain = 1.0;
for (float i = 0.0; i < 6.0; i++)
{
  sum += totalgain * pnoise(P * sc, rep);
  sc *= lacunarity;
  totalgain *= gain;
}
return abs(sum);
}
`;

const CustomPipeline = new Phaser.Class({
  Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,
  initialize: function CustomPipeline(game) {
    //console.log(game.renderer);
    Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
      game: game,
      renderer: game.renderer,
      //fragShader: WaterFrag,
      fragShader: `
      precision mediump float;
     varying vec2 outTexCoord;
uniform sampler2D iChannel0;
uniform vec4 filterArea;
uniform vec2 resolution;

uniform vec2 light;
uniform bool parallel;
//#define parallel false
uniform float aspect;

uniform float gain;
uniform float lacunarity;
uniform float time;

${perlinNoise}

void main(void) {
vec2 coord = outTexCoord * filterArea.xy / resolution.xy;

float d;

if (parallel) {
  float _cos = light.x;
  float _sin = light.y;
  d = (_cos * coord.x) + (_sin * coord.y * aspect);
} else {
  float dx = coord.x - light.x / resolution.x;
  float dy = (coord.y - light.y / resolution.y) * aspect;
  float dis = sqrt(dx * dx + dy * dy) + 0.00001;
  d = dy / dis;
}

vec3 dir = vec3(d, d, 0.0);

float noise = turb(dir + vec3(time, 0.0, 62.1 + time) * 0.05, vec3(480.0, 320.0, 480.0), lacunarity, gain);
noise = mix(noise, 0.0, 0.3);
//fade vertically.
vec4 mist = vec4(noise, noise, noise, 1.0) * (1.0 - coord.y);
mist.a = 1.0;

gl_FragColor = texture2D(iChannel0, outTexCoord) + mist;
}
      `,
      //topology: game.renderer.gl.TRIANGLES
    });
  }
});

export default CustomPipeline;

// shadertoy version (buffers?) https://www.shadertoy.com/view/ltcXDH#
const fragShader = `//blend everything together
#define raysIntensity 0.25
#define raysSaturation 0.5
#define raysBlend 2
//0 = Addition, 1 = Lighten Only (max()), 2 = Volumetric Lightning
//any other number will show only the rays

vec3 colorWeights = vec3(0.299, 0.587, 0.114);

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 ps = vec2(1.0) / iResolution.xy;
 	vec2 uv = fragCoord * ps;
    vec3 col = texture(iChannel0, uv).rgb;
    vec3 rays = texture(iChannel1, uv).rgb;
    
    rays = mix(vec3(dot(rays, colorWeights)), rays, raysSaturation);
    rays = pow(rays, vec3(2.2)); //linear-to-gamma
    
    //addition
    #if raysBlend == 0
    col += rays * vec3(raysIntensity);
    //lighten only
    #elif raysBlend == 1
    col = max(col, rays * vec3(raysIntensity));
    //volumetric lighting
    #elif raysBlend == 2
    col += rays * vec3(raysIntensity);
    col -= mix(vec3(0.0), vec3(1.0) - rays, raysIntensity);
    //only rays
    #else
    col = rays;
    #endif
    fragColor = vec4(col, 1.0);
}`