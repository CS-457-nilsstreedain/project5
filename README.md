# project3a
## Requirements:
The goals of this sub-project are to use displacement mapping to turn a simple shape into a more interesting one, re-compute its normals, and light it.

Using a GLIB file (for glman) or using the GLSL API, use the following uniform variables:

Parameter | What It Does | Does it have to be varied?
-|-|-
uA | Sine wave amplitude | Yes
uP | Sine wave period | Yes
uKa | Ambient coefficient | No
uKd | Diffuse coefficient | No
uKs | Specular coefficient | No
uShininess | Specular exponent | No
uLightX | X light location | No
uLightY | Y light location | No
uLightZ | Z light location | No

## The Scenario:
You have a curtain with pleats. The curtain starts out as a large group of small quadrilaterals in the X-Y plane. The pleats will be created in the vertex shadetr with a sine wave that goes up and down in the Z direction. The top of the curtain is fixed on a rod, so the pleating is zero there, and increases in amplitude as you go down in -Y.

## Creating the Vertices
As the first part of this is displacing vertices, you need to have enough vertices to displace.

If you are using glman, there is a built-in command in glman to get a quad with a lot of vertices:
```
QuadXY  0.  1.  128 128
```

If you are using the API, do something like this:
```
float xmin = -1.f;
float xmax =  1.f;
float ymin = -1.f;
float ymax =  1.f;
float dx = xmax - xmin;
float dy = ymax - ymin;
float z = 0.f;
int numy = 128;		// set this to what you want it to be
int numx = 128;		// set this to what you want it to be
for( int iy = 0; iy < numy; iy++ )
{
        glBegin( GL_QUAD_STRIP );
        glNormal3f( 0., 0., 1. );
        for( int ix = 0; ix <= numx; ix++ )
        {
                glTexCoord2f( (float)ix/(float)numx, (float)(iy+0)/(float)numy );
                glVertex3f( xmin + dx*(float)ix/(float)numx, ymin + dy*(float)(iy+0)/(float)numy, z );
                glTexCoord2f( (float)ix/(float)numx, (float)(iy+1)/(float)numy );
                glVertex3f( xmin + dx*(float)ix/(float)numx, ymin + dy*(float)(iy+1)/(float)numy, z );
        }
        glEnd();
}
```

It is best if this is placed in a display list. (Normally, that wouldn't be a good option because vertices in display lists are fixed and cannot be displaced. However, in this case, it is a good tghing to do because the displacement will happen in the vertex shader.)

## Pleats:
This shape is a sine wave where the amplitude increases as you go down in -Y. If (x,y,z) are the coordinates of the current vertex, do something like this in the vertex shader:

```
float z = uA * (Y0-y) * sin( 2.*π*x/uP );
```

where A is a constant that controls amplitude of the pleat fold, Y0 is the top of the curtain where there is no z displacement, and P is the period of the sine wave. Y0 can just be a constant set in the vertex shader (1. is a good value).

The original gl_Vertex.x and gl_Vertex.y, plus this new z become the new vertex that gets used everywhere in place of gl_Vertex, something like this:
```
vec4 vert = gl_Vertex;
vert.z = ???;
// now use vert everywhere you would have used gl_Vertex
```

## Getting the Normal Vectors of the Displaced Surface

There is no function to automatically recalculate the normal vectors for the displaced surface. You have to do it yourself. But, in this case, it's not too hard. I'll walk you through it.

The cross product of two vectors gives you a third vector that is perpendicular to both. So, all you have to do to get the normal vector is determine 2 vectors that lie on the surface at the point in question, then take take their cross product, and then normalize it.

Tangent vectors lie on the surface. Each tangent slope is determined by taking calculus derivatives:
```
float dzdx = uA * (Y0-vert.y) * (2.*π/uP) * cos( 2.*π*vert.x/uP )
float dzdy = -uA * sin( 2.*π*vert.x/uP )
```

Here I've done the calculus for you. I'd be happy to show how this was done, if you're interested.

The full vec3 tangent vectors are then formed like this:
```
vec3 Tx = vec3(1., 0., dzdx )
vec3 Ty = vec3(0., 1., dzdy )
vec3 normal = normalize( cross( Tx, Ty ) );
// now use normal everywhere you would have used gl_Normal
```

Then assign vN = normal and pass it over to the fragment shader as an out vec3.

Be sure your video shows this to be the correct normal by rotating your object to show that lighting works correctly.

## Lighting
See Project #1.

## Shader Flow

## Sample .glib File
The question marks are not glman-isms -- they are asking you to determine good values in those places.
```
##OpenGL GLIB

Perspective 70
LookAt 0 0 4  0 0 0  0 1 0

Vertex		pleats.vert
Fragment	pleats.frag
Program		Pleats					\
		uA <? ? ?>				\
		uP <? ? ?>				\
                uKa <0. 0.1 1.0>                        \
                uKd <0. 0.6 1.0>                        \
                uKs <0. 0.3 1.0>                        \
                uShininess <1. 10. 100.>                \
                uLightX <-20. 5. 20.>                   \
                uLightY <-20. 10. 20.>                  \
                uLightZ <-20. 20. 20.> 

QuadXY  -0.2  1.  128  128
```

If you are using the API:
1. You don't need to vary uKa, uKd, uKs, uShininess, uLightX, uLightY, uLightZ, uColor, and uSpecularColor. You can pick values you like and just set them as uniform variables when you create the shader program.
2. You do need to show that your scene responds correctly to changes in uA and uP.
3. One way to do that is to Keytime animate them.
4. Another way is to have keyboard keys that change them between a low value and a high value.

Note that you need to break the curtain down into many sub-quads (the "128 128" above) so that there are enough vertices to create a smoother displacement function.

## Grading:
Feature | Points
-|-
Correctly show the effect of changing uA | 20
Correctly show the effect of changing uP | 20
Use per-fragment lighting to show that you have computed the displaced normals correctly | 10
**Potential Total | 50**
