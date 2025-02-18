# project5
## Requirements:
1. In computer graphics (and especially in visualization), there is a technique called a Magic Lens. A Magic Lens is some shape, usually a rectangle or circle, into which a different version of the display is drawn. The Magic Lens can be moved around the scene to show different representations in different regions. Your job is to create a circular Magic Lens for an image display. Inside the Magic Lens, the image needs to be able to be magnified, whirled, and mosaic'ed.
2.
Parameter | What It Does | Does it have to be varied?
-|-|-
uSc | s center of the ML | Yes
uTc | t center of the ML | Yes
uRad | Radius of the ML | Yes
uMag | Magnification Factor | Yes
uWhirl | Whirl coefficient | Yes
uMosaic | Mosaic'ing coefficient | Yes

3. Draw a quadrilateral that has (s,t) coordinates and map an image to it using a 2D Texture. Use an image of your own choosing -- not one of mine!
4. If you are using glman, your glib file could look something like this:
```
##OpenGL GLIB
Ortho -5. 5.   -5. 5.
LookAt 0 0 2  0 0 0  0 1 0

Texture2D 5 image.bmp

Vertex   magnifywhirlmosaic.vert
Fragment magnifywhirlmosaic.frag
Program  MagnifyWhirlMosaic				\
	uSc	<0. .5 1.>				\
	uTc	<0. .5 1.>				\
	uRad   	<0.01 ?? ??>				\
	uMag	<.1 ?? ??>				\
	uWhirl	<-30. 0. 30.>				\
	uMosaic <0.001 0.001 0.1>			\
	uImageUnit  5

QuadXY .1 1.
```

## Hints
- Change the fragment's (s,t) so that it is with respect to the center (uSc,uTc) of the Magic Lens.
```
vec2 st = vST - vec2(???,???);  // make (0,0) the center of the circle
```
- Inside the fragment shader, you need to see if the current fragment is inside the Magic Lens circle. If it is not, do a texture lookup as normal.
```
if( current fragment is outside uRad )
{
	vec3 rgb = texture( uImageUnit, vST ).rgb;
	gl_FragColor = vec4( rgb, 1. );
}
```
- Otherwise, do these things:
```
else
{
```
- Magnifying:
```
	float r = the length of st
	float r' = << if you want to magnify the image by uMag, you do ????? to the length of its (s,t) >>
```
- Whirling:
```
	float θ  = atan( st.t, st.s );
	float θ' = θ - uWhirl * r';
```
- Restoring (s,t)
Undo what you did when you changed the fragment's (s,t) to make it with respect to the center (uSc,uTc) of the Magic Lens.
```
	st = r' * vec2( cosθ',sinθ' );      // now in the range -1. to +1.
	st += ?;
```
- Mosaic'ing
```
	// which block of pixels will this pixel be in?
	int numins = ???        // same as with the ellipses except use uMosaic instead of uAd and uBd
	int numint = ???
	float sc = ???		// center of the block
	float tc = ???
	// for this entire block of pixels, we are only going to sample the texture at its center (sc,tc):
	st.s = sc;
	st.t = tc;
```
- Use st to lookup a color in the image texture. Assign it to gl_FragColor.
```
	vec3 rgb = texture( uImageUnit, st ).rgb;
	gl_FragColor = vec4( rgb, 1. );
}
```

## The Turn-In Process:
Use Canvas to turn in your:
1. Your source files: .cpp, .glib, .vert, .frag, .geom
2. A short PDF report containing:
    - Your name
    - Your email address
    - Project number and title
    - A description of what you did to get the display you got
    - A cool-looking screen shot from your program
    - The link to the Kaltura video demonstrating that your project does what the requirements ask for. If you can, we'd appreciate it if you'd narrate your video so that you can tell us what it is doing.
3. To see how to turn these files in to Canvas, go to our Project Notes noteset, and go the the slide labeled How to Turn In a Project on Canvas.
4. Be sure that your video's permissions are set to unlisted.. The best place to set this is on the OSU Media Server.
5. A good way to test your video's permissions is to ask a friend to try to open the same video link that you are giving us.
6. The video doesn't have to be made with Kaltura. Any similar tool will do.
			
### Original
![image](https://github.com/user-attachments/assets/c4ab55ff-256b-48d2-bc57-01a231e9f404)

### Magnify
![image](https://github.com/user-attachments/assets/5c75b2cd-cde1-430f-bcde-14c5a75873e2)

### Whirl
![image](https://github.com/user-attachments/assets/d3d586a7-c55b-4b4c-97b8-840d440ed162)

### Mosaic
![image](https://github.com/user-attachments/assets/993bbd72-f568-4347-84d1-904ffd4ba249)

## Grading:
Feature | Points
-|-
Something different happens inside the circle | 20
The circle can be resized and moved | 20
Magnification works | 20
Whirling works | 20
Mosaic'ing works | 20
Potential Total | 100
