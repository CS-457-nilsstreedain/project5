varying vec2    vST;

void
main( )
{
    vST = gl_MultiTexCoord0.xy;  // use the built-in texture coordinate
    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
