var drawArrow = function(dir, origin){

  var arrowHelper = new THREE.ArrowHelper( dir.normalize(), origin, 10.0, 0xffff00 );
  scene.add( arrowHelper );
}
