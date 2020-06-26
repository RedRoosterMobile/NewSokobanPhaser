// from:
// https://www.shadertoy.com/view/XdcXDn

#define amp 0.02
#define tint_color vec4(0.45, 0.89,0.99, 1)

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    
    vec2 p = uv +
        (vec2(.5)-texture(iChannel0, uv*0.3+vec2(iTime*0.05, iTime*0.025)).xy)*amp +
        (vec2(.5)-texture(iChannel0, uv*0.3-vec2(-iTime*0.005, iTime*0.0125)).xy)*amp;
    
	fragColor = texture(iChannel0, p)*tint_color;
}