// you can set these 4 uniform variables dynamically or hardwire them:
uniform float   uKa, uKd, uKs;	 // coefficients of each type of lighting
uniform float   uShininess;	 // specular exponent

// interpolated from the vertex shader:
varying  vec2  vST;                  // texture coords
varying  vec3  vN;                   // normal vector
varying  vec3  vL;                   // vector from point to light
varying  vec3  vE;                   // vector from point to eye

const vec3 OBJECTCOLOR          = vec3( .9, .5, .2);           // color to make the object
const vec3 SPECULARCOLOR        = vec3( 1., 1., 1. );

void
main( )
{
    vec3 myColor = OBJECTCOLOR;
    
    vec3 Normal    = normalize(vN);
    vec3 Light     = normalize(vL);
    vec3 Eye       = normalize(vE);

    vec3 ambient = uKa * myColor;
    float dd = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
    vec3 diffuse = uKd * dd * myColor;

    float s = 0.;
    if( dd > 0. )              // only do specular if the light can see the point
    {
        vec3 ref = normalize(  reflect( -Light, Normal )  );
        float cosphi = dot( Eye, ref );
        if( cosphi > 0. )
            s = pow( max( cosphi, 0. ), uShininess );
    }
    vec3 specular = uKs * s * SPECULARCOLOR.rgb;
    gl_FragColor = vec4( ambient + diffuse + specular,  1. );
}
