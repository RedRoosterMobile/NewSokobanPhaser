
// wegGL version
// https://codepen.io/alaingalvan/pen/ICasz

// pixi js version
// https://pixijs.io/pixi-filters/docs/PIXI.filters.GodrayFilter.html
// pixi src
// https://github.com/search?q=org%3Apixijs+godray&type=Code

// pixi: da real src
// https://github.com/pixijs/pixi-filters/tree/9ccb70a5f716a06a41e6ce1b15dfc4245deca111/filters/godray/src


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
}``