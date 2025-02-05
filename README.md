# project3a
## Requirements:
The goals of this sub-project are to continue to use displacement mapping from Project #3A to turn a simple shape into a more interesting one, re-compute its normals, apply bump-mapping (this is the new part), and light it.

Using a GLIB file (for glman) or using the GLSL API, use the following uniform variables:

Parameter | What It Does | Does it have to be varied?
-|-|-
uA | Sine wave amplitude | No
uP | Sine wave period | No
uKa | Ambient coefficient | No
uKd | Diffuse coefficient | No
uKs | Specular coefficient | No
uShininess | Specular exponent | No
uLightX | X light location | No
uLightY | Y light location | No
uLightZ | Z light location | No
uNoiseAmp | Noise amplitude | Yes
uNoiseFreq | Noise frequency | Yes

## The Scenario:
You have a curtain with pleats. The curtain starts out as a large group of quadrilaterals in the X-Y plane. The pleats will be created in the vertex shadetr with a sine wave that goes up and down in the Z direction. The top of the curtain is fixed on a rod, so the pleating is zero there, and increases in amplitude as you go down in -Y.

## Pleats:
This shape is a sine wave where the amplitude increases as you go down in -Y. If (x,y,z) are the vertex coordinates being processed right now, do something like this in the vertex shader:
```
float z = uA * (Y0-y) * sin( 2.*π*x/uP )
```

where A is a constant that controls amplitude of the pleat fold, Y0 is the top of the curtain where there is no z displacement, and P is the period of the sine wave. Y0 can just be a constant set in the vertex shader (1. is a good value).

The original gl_Vertex.x and gl_Vertex.y, plus this new z become the new vertex that gets used everywhere in place of gl_Vertex.

## Creating the Vertices
See Project #3A.

## Getting the Normal Vectors of the Displaced Surface:
See Project #3A.

## Lighting
See Project #1.

## Sample .glib File
The question marks are not glman-isms -- they are asking you to determine good values in those places.
```
Vertex		pleats.vert
Fragment	pleats.frag
Program		Pleats					\
		uA <? ? ?>				\
		uP <? ? ?>				\
                uNoiseAmp <0. 0. ?>			\
             uNoiseFreq <1. 1. ?>		\
                uKa <0. 0.1 1.0>                        \
                uKd <0. 0.6 1.0>                        \
                uKs <0. 0.3 1.0>                        \
                uShininess <1. 10. 100.>                \
                uLightX <-20. 5. 20.>                   \
                uLightY <-20. 10. 20.>                  \
                uLightZ <-20. 20. 20.>                  \
                uColor {1. .7 0. 1.}                    \
                uSpecularColor {1. 1. 1. 1.}

QuadXY  -0.2  1.  128  128
```

Note that you need to break the quad down into many sub-quads (the "128 128" above) so that there are enough vertices to create a smoother displacement function.

### Bump-Mapping
You've determined the normal. Now you want to perturb it in a seemingly random, yet coherent, way. Sounds like a job for noise, right?

Use the noise texture capability to get two noise values. These will be treated as an angle to rotate the normal about x and an angle to rotate the normal about y. Allow the variation of two more uniform variables: uNoiseAmp and uNoiseFreq.

So, in the fragment shader, you will do this:
```
        vec4 nvx = texture( Noise3, uNoiseFreq*vMC );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;	// -1. to +1.
	angx *= uNoiseAmp;

        vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;	// -1. to +1.
	angy *= uNoiseAmp;
```

where vMC are the vec3 model coordinates passed over from the vertex shader. (You could also get the noise from a 2D noise texture using (s,t).
Perturb the normal like this:
```
vec3
PerturbNormal2( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}
```

After perturbing the normal, multiply it by the gl_NormalMatrix and normalize it:
```
vec3 n = PerturbNormal2( angx, angy, vN );
n = normalize(  gl_NormalMatrix * n  );
```

## Grading:

Feature | Points
-|-
Correctly show the effect of changing uNoiseAmp | 15
Correctly show the effect of changing uNoiseFreq | 15
Use per-fragment lighting to show that you have computed the bump-mapped normals correctly | 20
Potential Total | 50
