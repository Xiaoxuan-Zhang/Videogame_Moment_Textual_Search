 function Skybox()
 {
  this.uniforms = {
          iResolution: { type: "v2", value: new THREE.Vector2(WIDTH, HEIGHT)},
          time: {type: "float", value: 0.0},
          color1: {type: "v3", value: new THREE.Vector3(1.0,0.9,0.9)}, //(0.8,1.0,1.0)
          color2: {type: "v3", value: new THREE.Vector3(0.9,0.95,1.0)}, //(1.0,1.0,0.9)
  };
  this.material = new THREE.RawShaderMaterial( {
      uniforms: this.uniforms,
      vertexShader: skybox_vertexShader,
      fragmentShader: skybox_fragmentShader
  } );

  this.material.depthWrite = false;
  this.material.side = THREE.BackSide;

  this.geometry = new THREE.SphereBufferGeometry(SPACE_SCALE );
  this.mesh = new THREE.Mesh( this.geometry, this.material );

  this.addToScene = function(scene) {
    scene.add(this.mesh);
  }
}
