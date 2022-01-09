var skybox_vertexShader = `
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform vec3 color1;
uniform vec3 color2;

attribute vec3 position;
attribute vec3 normal;
varying vec3 vColor;
precision mediump float;
void main() {
  gl_Position = projectionMatrix  * viewMatrix * modelMatrix  * vec4( position, 1.0 );
  vColor = mix(color1, color2, abs(sin(time + position.y)));
}
`;
