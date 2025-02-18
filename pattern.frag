uniform sampler2D uImageUnit;

uniform float uSc;
uniform float uTc;
uniform float uRad;
uniform float uMag;
uniform float uWhirl;
uniform float uMosaic;

varying vec2 vST;

void
main( )
{
    // Change (s,t) so that (0,0) is at the Magic Lens center:
    vec2 st = vST - vec2(uSc, uTc);
    float r = length(st);
    
    // If outside the Magic Lens, sample normally.
    if (r > uRad) {
        vec3 rgb = texture2D(uImageUnit, vST).rgb;
        gl_FragColor = vec4(rgb, 1.0);
    }
    else {
        float rPrime = r / uMag;
        float theta = atan(st.t, st.s);
        float thetaPrime = theta - uWhirl * rPrime;
        
        st = rPrime * vec2(cos(thetaPrime), sin(thetaPrime));
        st += vec2(uSc, uTc);
        
        // Mosaic effect: snap stNew to the center of a grid block.
        st = floor(st / uMosaic) * uMosaic + 0.5 * uMosaic;
        
        vec3 rgb = texture2D(uImageUnit, st).rgb;
        gl_FragColor = vec4(rgb, 1.0);
    }
}
