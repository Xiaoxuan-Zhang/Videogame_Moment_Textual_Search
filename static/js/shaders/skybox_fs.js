var skybox_fragmentShader = `
  precision mediump float;

  uniform vec2 iResolution;
  varying vec3 vPosition;
  varying vec3 vColor;

  void main(){
    gl_FragColor = vec4(vColor,1.0) ;
  }

`;
