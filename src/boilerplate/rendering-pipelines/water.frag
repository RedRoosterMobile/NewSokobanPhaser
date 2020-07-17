precision mediump float;

//
// https://www.shadertoy.com/view/MdlXz8
// run shaders in the browser
// https://thebookofshaders.com/04/
// sin and cosine, easing functions, gold!
// https://thebookofshaders.com/05/
// easing functions
// https://thebookofshaders.com/edit.php#06/easing.frag
// the book
// https://thebookofshaders.com/03/
// sin(), cos(), tan(), asin(), acos(), atan(), pow(), exp(), 
// log(), sqrt(), abs(), sign(), floor(), ceil(), fract(), 
// mod(), min(), max() and clamp().
// #22E1FF
// (34,225,255)
#define amp .02
#define tint_color vec4(.45,.89,.99,1)
#define tint_color2 vec4(0.066, 0.4377,0.4961, 1) // percetages
#define tint_color2 vec4(0.52, 1.0,0.57 , 1) // hsl

vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz),
                 vec4(c.gb, K.xy),
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),
                 vec4(c.r, p.yzx),
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                d / (q.x + e),
                q.x);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main(void){
    
    vec2 uv=outTexCoord;
    "//uv.y *= -1.0;",
    //"uv.y += (sin((uv.x + (time * 0.5)) * 10.0) * 0.1) + (sin((uv.x + (time * 0.2)) * 32.0) * 0.01);",
    uv.x+=(sin((uv.y+(time*.5))*10.)*.1)+(sin((uv.y+(time*.2))*32.)*.01);
    //"uv.x += (sin((uv.y + (time * 0.5)) * 10.0) * amp/2.0) + (sin((uv.y + (time * amp)) * 32.0) * amp/20.0);",
    vec4 texColor=texture2D(uMainSampler,uv)*tint_color;
    gl_FragColor=texColor;
    
}