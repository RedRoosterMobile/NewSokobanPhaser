#ifdef GL_ES
precision mediump float;
#endif

const float amp = 0.02;

uniform vec2 iResolution;
uniform sampler2D iChannel0;

const float pi = atan(1.0) * 4.0;
const int samples = 256;
//const float sigma = sqrt(float(samples));
uniform float iTime;
varying vec2 fragCoord;
uniform tint_color =  vec4(0.45, 0.89,0.99, 1)

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