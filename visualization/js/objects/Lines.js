var drawLine = function(points){
  var geometry = new THREE.Geometry();
  var material = new THREE.LineDashedMaterial( {
	color: 0x9900ff,
	linewidth: 10,
	dashSize: 1,
	gapSize: 1,
} );
  for (var i = 0; i < points.length; i++){
    geometry.vertices.push(points[i] );
  }
  var line = new THREE.Line( geometry, material );
  scene.add(line);
  return line;
}
