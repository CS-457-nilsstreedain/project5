// will be interpolated into the fragment shader:
varying  vec2  vST;                 // texture coords
varying  vec3  vN;                  // normal vector
varying  vec3  vL;                  // vector from point to light
varying  vec3  vE;                  // vector from point to eye
varying  vec3  vMC;            // model coordinates

uniform float uA;
uniform float uP;
uniform float uLightX;
uniform float uLightY;
uniform float uLightZ;

//const vec3 LIGHTPOSITION = vec3( 5., 5., 0. );

void
main( )
{
    vST = gl_MultiTexCoord0.st;
    vec4 pos = gl_Vertex;  // original vertex position
    float Y0 = 1.0;        // top of the curtain
    pos.z = uA * (Y0 - pos.y) * sin(2.0 * 3.14159265 * pos.x / uP);
    
    float dzdx = uA * (Y0 - gl_Vertex.y) * (2.0 * 3.14159265 / uP) * cos(2.0 * 3.14159265 * gl_Vertex.x / uP);
    float dzdy = - uA * sin(2.0 * 3.14159265 * gl_Vertex.x / uP);
    
    vec3 Tx = vec3(1.0, 0.0, dzdx);  // tangent along x
    vec3 Ty = vec3(0.0, 1.0, dzdy);    // tangent along y
    vec3 normal = normalize(cross(Tx, Ty));

    vN = normalize(gl_NormalMatrix * normal); // normal vector
    vec4 ECposition = gl_ModelViewMatrix * pos;
    vec4 lightPos = gl_ModelViewMatrix * vec4(uLightX, uLightY, uLightZ, 1.0);
    vL = lightPos.xyz - ECposition.xyz;
    vE = -ECposition.xyz;
    
    gl_Position = gl_ModelViewProjectionMatrix * pos;
}
