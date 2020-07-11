// check these
// https://github.com/photonstorm/phaser3-examples/blob/master/public/assets/shaders/bundle.glsl.js
// https://labs.phaser.io/edit.html?src=src/display/shaders/shader%20test%206.js&v=3.23.0

// http://glslsandbox.com/

export const blur = `
#ifdef GL_ES
precision mediump float;
#endif
const float pi = atan(1.0) * 4.0;
const int samples = 256;
const float sigma = sqrt(float(samples));
uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0;
varying vec2 fragCoord;
float normpdf(in float x, in float sigma)
{
    return 0.39894 * exp(-0.5 * x * x / (sigma * sigma)) / sigma;
}
vec4 texture(sampler2D s, vec2 c)
{
    return texture2D(s, c);
}
void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec3 c = texture(iChannel0, fragCoord.xy / resolution.xy).rgb;
    //declare stuff
    const int mSize = 11;
    const int kSize = (mSize - 1) / 2;
    float kernel[mSize];
    vec3 final_colour = vec3(0.0);
    //create the 1-D kernel
    float sigma = 7.0;
    float Z = 0.0;
    for (int j = 0; j <= kSize; ++j)
    {
        kernel[kSize + j] = kernel[kSize - j] = normpdf(float(j), sigma);
    }
    //get the normalization factor (as the gaussian has been clamped)
    for (int j = 0; j < mSize; ++j)
    {
        Z += kernel[j];
    }
    //read out the texels
    for (int i = -kSize; i <= kSize; ++i)
    {
        for (int j = -kSize; j <= kSize; ++j)
        {
            final_colour += kernel[kSize + j] * kernel[kSize + i] * texture(iChannel0, (fragCoord.xy + vec2(float(i), float(j))) / resolution.xy).rgb;
        }
    }
    fragColor = vec4(final_colour / (Z * Z), 1.0);
}
void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}
`;


// compiles...but kills image?
// https://www.shadertoy.com/view/XdcXDn
export const water1 = `
#ifdef GL_ES
precision mediump float;
#endif

#define amp 0.02
#define tint_color vec4(0.45, 0.89,0.99, 1)

uniform sampler2D iChannel0;
uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iTime;                 // shader playback time (in seconds)
varying vec2      fragCoord;             // no idea..


vec4 texture(sampler2D s, vec2 c)
{
    return texture2D(s, c);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    
    vec2 p = uv +
        (vec2(.5)-texture(iChannel0, uv*0.3+vec2(iTime*0.05, iTime*0.025)).xy)*amp +
        (vec2(.5)-texture(iChannel0, uv*0.3-vec2(-iTime*0.005, iTime*0.0125)).xy)*amp;
    
	fragColor = texture(iChannel0, p)*tint_color;
}
void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}
`;

// broken
//retro-frag.glsl #version 440 compatibility
export const dunno =`#version 320 es
#ifdef GL_ES
precision mediump float;
#endif


uniform sampler2D texture;
uniform ivec3 bit_precision; // A syntax error happens on this line for some reason

void main() {
    vec3 prec_fac = vec3(float(1 << bit_precision.x), float(1 << bit_precision.y), float(1 << bit_precision.z));
    vec3 factor_adjust = 1.0f / (prec_fac - 1.0f);
    //vec4 color = texture2D(texture, gl_TexCoord[0].xy);
    vec4 color = texture(texture, gl_TexCoord[0].xy);
    vec4 low_color = vec4(
        floor(color.x * (prec_fac.x + 0.01f)) * factor_adjust.x,
        floor(color.y * (prec_fac.y + 0.01f)) * factor_adjust.y,
        floor(color.z * (prec_fac.z + 0.01f)) * factor_adjust.z,
        1.0f);

    gl_FragColor = low_color;
}
`;


// compiles, does nothing (input??)
export const water2 = `
#ifdef GL_ES
precision mediump float;
#endif
// Shader Inputs
uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iTime;                 // shader playback time (in seconds)
uniform float     iTimeDelta;            // render time (in seconds)
uniform int       iFrame;                // shader playback frame
uniform float     iChannelTime[4];       // channel playback time (in seconds)
uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
//uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
uniform vec4      iDate;                 // (year, month, day, time in seconds)
//uniform sampler2D iChannel0;
varying vec2 fragCoord;

float fade(float t) {
    // return t*t*(3.0-2.0*t); // Old fade, yields discontinuous second derivative
    return t*t*t*(t*(t*6.0-15.0)+10.0); // Improved fade, yields C2-continuous noise
  }
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
  return mod289(((x*34.0)+1.0)*x);
  }
  vec4 taylorInvSqrt(vec4 r)
  {
  return 1.79284291400159 - 0.85373472095314 * r;
  }
  vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
  }
  
  // Classic Perlin noise implementation found on https://github.com/ashima/webgl-noise
  //license :
  /*Copyright (C) 2011 by Ashima Arts (Simplex noise)
  Copyright (C) 2011 by Stefan Gustavson (Classic noise)
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.*/
  float cnoise(vec3 P)
  {
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
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
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
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
  
  float fbm(vec3 P,float lacunarity, float gain)
  {
      float sum = 0.0;
      float amp = 1.7;
      float add = 0.0;
      vec3 pp = P;
       
      for(int i = 0; i < 5; i+=1)
      {
        add = cnoise(vec3(pp.x, pp.y*4.0, pp.z));
        add += sin(pp.y*0.5)*0.5;
        if(add > 0.0)
          add = (1.0 - add)*(1.0 - add);
        else
          add = (-1.0 - add) * (-1.0 - add);
  
        sum += amp * add;
        amp *= gain;
        pp *= lacunarity;
          
      }
      
      return sum*(1.0-gain)/(1.0-amp);
   
  }
  void mainImage( out vec4 fragColor, in vec2 fragCoord ){
   
    float val = fbm(vec3(vec2(fragCoord.x*.5/iResolution.x + iMouse.x/iResolution.x,
                              fragCoord.y*.5/iResolution.y + iTime/100.0)*3.0 + iMouse.y/iResolution.y,
                                 iTime/5.0), 2.1, 0.45);
   
      val = 0.6 + val/2.0;
  
    fragColor = vec4(val*val*0.5, val*val*0.5, val, 1);
    }
    void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}
`;


// somehow set values like this
// https://github.com/MrHATuan/Phaser/blob/4afa92ece6c7e8040cbec2f1743cb93081507d18/Lib/phaser-examples/examples/wip/crt.js
// or 
// https://github.com/sbuff25/Web_Technologies_Spring_2020/blob/d76173aae1bb080cb42695d92481864ad4e728be/Week_13/assets/phaser3-examples-master/public/src/display/shaders/shader%20test%205.js
// compiles, does nothing (input??)
export const noob=`
#ifdef GL_ES
precision mediump float;
#endif
uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iTime;                 // shader playback time (in seconds)
uniform float     iTimeDelta;            // render time (in seconds)
uniform int       iFrame;                // shader playback frame
uniform float     iChannelTime[4];       // channel playback time (in seconds)
uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
//uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
uniform vec4      iDate;                 // (year, month, day, time in seconds)
varying vec2 fragCoord;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;

    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

    // Output to screen
    fragColor = vec4(col,1.0);
}
void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}
`


// https://github.com/sbuff25/Web_Technologies_Spring_2020/blob/d76173aae1bb080cb42695d92481864ad4e728be/Week_13/assets/phaser3-examples-master/public/src/display/shaders/shader%20test%205.js
export const water3 = `
precision mediump float;
uniform float time;
uniform vec2 resolution;
varying vec2 fragCoord;
void main( void ) {
    vec2 uv =  (fragCoord.xy -.5 * resolution.xy) / resolution.y ;
    
    float t = time * .8;
    
    vec3 ro = vec3(0, 0, -1);
        vec3 lookat = vec3(sin(t)/2.0 - 1.0, cos(t)/2.0 - 2.0, 0.0);
        float zoom = 0.05 + sin(t) / 50.0;
    
        vec3 f = normalize(lookat - ro),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f, r),
        c = ro + f * zoom,
        i = c + uv.x * r + uv.y * u,
        rd = normalize(i-ro);
    
        float dS, dO;
        vec3 p;
    
        for(int i=0; i<1000; i++) {
            p = ro + rd * dO;
            dS = -(length(vec2(length(p.yz)-1.0, p.x)) - 0.65 - (cos(t) + sin(t)) / 10.0);
            if(dS<.0001) break;
            dO += dS;
    }
    
    vec3 col = vec3(0);
    
    float x = atan(p.y, p.z) + t * 0.5;
    float y = atan(length(p.yz)-1., p.x);
    
    // Basically vert / horiz
    float bands = sin(y*20.+x*20.);
    
    // Size and orientation.
    float ripples = sin((x*20.-y*40.)*3.)*.5+.5;
    
    // Speed & size
    float waves = sin(x*30.+y*10.+t*6.);
    
    float b1 = smoothstep(-0.0, 1.0, bands-0.5);
    float b2 = smoothstep(-0.5, .5, bands-.35);
    
    float m = b1*(1.4-b2);
    m = max(m, ripples*b2*max(0., waves));
    m += max(0., waves*.65*b2);
    
    float fd = length(ro-p);
    col += m;
    col.rb *= 2.5;
    col.z *= 2.5*abs(cos(t));
    col = mix(col, vec3(0.2,0.75,0.75), 1.-exp(-0.80*fd*fd));
    gl_FragColor = vec4( col, 1.0 );
}
`;

// Tileable Water Caustic
// https://www.shadertoy.com/view/MdlXz8
const water5 = `
#ifdef GL_ES
precision mediump float;
#endif
#define TAU 6.28318530718
#define MAX_ITER 5

uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iTime;                 // shader playback time (in seconds)
varying vec2 fragCoord;
void mainImage( out vec4 fragColor, in vec2 fragCoord ) 
{
	float time = iTime * .5+23.0;
    // uv should be the 0-1 uv of texture...
	vec2 uv = fragCoord.xy / iResolution.xy;
    
    #ifdef SHOW_TILING
	vec2 p = mod(uv*TAU*2.0, TAU)-250.0;
    #else
    vec2 p = mod(uv*TAU, TAU)-250.0;
    #endif
	vec2 i = vec2(p);
	float c = 1.0;
	float inten = .005;

	for (int n = 0; n < MAX_ITER; n++) 
	{
		float t = time * (1.0 - (3.5 / float(n+1)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}
	c /= float(MAX_ITER);
	c = 1.17-pow(c, 1.4);
	vec3 colour = vec3(pow(abs(c), 8.0));
    colour = clamp(colour + vec3(0.0, 0.35, 0.5), 0.0, 1.0);
    

	#ifdef SHOW_TILING
	// Flash tile borders...
	vec2 pixel = 2.0 / iResolution.xy;
	uv *= 2.0;

	float f = floor(mod(iTime*.5, 2.0)); 	// Flash value.
	vec2 first = step(pixel, uv) * f;		   	// Rule out first screen pixels and flash.
	uv  = step(fract(uv), pixel);				// Add one line of pixels per tile.
	colour = mix(colour, vec3(1.0, 1.0, 0.0), (uv.x + uv.y) * first.x * first.y); // Yellow line
	
	#endif
	fragColor = vec4(colour, 1.0);
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}
`;

const plasm=`

precision highp float;

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

void main( void ) {

    vec2 position = ( fragCoord.xy / resolution.xy );

    float color = 0.0;
    color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
    color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
    color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
    color *= sin( time / 10.0 ) * 0.5;

    
    gl_FragColor = vec4( vec3( sin( color + time / 3.0 ) * 0.75, cos( color + time / 3.0 ) * 0.75, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}
`;

var tunnel = `
precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0;
uniform float alpha;
uniform float origin;

varying vec2 fragCoord;

#define S 0.79577471545 // Precalculated 2.5 / PI
#define E 0.0001

void main(void) {
    vec2 p = (origin * fragCoord.xy / resolution.xy - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    vec2 t = vec2(S * atan(p.x, p.y), 1.0 / max(length(p), E));
    vec3 c = texture2D(iChannel0, t + vec2(time * 0.1, time)).xyz;
    gl_FragColor = vec4(c / (t.y + 0.5), alpha);
}
`;
