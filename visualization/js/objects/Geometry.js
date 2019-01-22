var totalMap = textureLoader.load('./pic/spritesheet0.png');

var addMoment = function(momentObj,jsonObj){
  var geometry = new THREE.Geometry();
  var material = momentObj.material;
  var imageIdx = momentObj.index;
  geometry.vertices.push(
    //0
    new THREE.Vector3(
      momentObj.position.x,
      momentObj.position.y,
      momentObj.position.z
    ),
    //1
    new THREE.Vector3(
      momentObj.position.x + momentObj.width,
      momentObj.position.y,
      momentObj.position.z
    ),
    //2
    new THREE.Vector3(
      momentObj.position.x + momentObj.width,
      momentObj.position.y + momentObj.height,
      momentObj.position.z
    ),
    //3
    new THREE.Vector3(
      momentObj.position.x,
      momentObj.position.y + momentObj.height,
      momentObj.position.z
    )
  );
  var sizeofVertices = geometry.vertices.length;
  geometry.faces.push( new THREE.Face3( 0,1,2) );
  geometry.faces.push( new THREE.Face3( 0,2,3) );

  //Using texture atlas
  var xOffset = momentObj.uvOffset_u;
  var yOffset = momentObj.uvOffset_v;
  var uvWidth = momentObj.uvWidth;
  var uvHeight = momentObj.uvHeight;
  geometry.faceVertexUvs[0][0] = [
    new THREE.Vector2(xOffset, yOffset),
    new THREE.Vector2(xOffset+uvWidth, yOffset),
    new THREE.Vector2(xOffset+uvWidth, yOffset+uvHeight)
  ]
  geometry.faceVertexUvs[0][1] = [
    new THREE.Vector2(xOffset, yOffset),
    new THREE.Vector2(xOffset+uvWidth, yOffset+uvHeight),
    new THREE.Vector2(xOffset, yOffset+uvHeight)
  ]

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}

var updateMoments = function(){
  var position;
  var momentObj;
  var fileNameLength = 9;
  var material = new THREE.MeshBasicMaterial({
    map: totalMap
  });

  var jsonFile = new THREE.FileLoader().load('./pic/spritesheet0.png.json', function(data){
    var jsonObj = JSON.parse(data);
    number = jsonObj.totalCount;
    for (var i = 0; i < number; i++){
      position = {
        //THREE.Math.randFloatSpread( spaceScale ),
        x: parseFloat(jsonObj[i].position.x)*scaleMultiplier,
        y: parseFloat(jsonObj[i].position.y)*scaleMultiplier,
        z: parseFloat(jsonObj[i].position.z)*scaleMultiplier,
      }
      momentObj = {
        index: i,
        position: position,
        material: material,
        width: jsonObj.spriteWidth,
        height: jsonObj.spriteHeight,
        uvOffset_u: jsonObj[i].uvOffset_u,
        uvOffset_v: jsonObj[i].uvOffset_v,
        uvWidth: jsonObj[i].uvRepeat_u,
        uvHeight: jsonObj[i].uvRepeat_v
      }
      addMoment(momentObj);
    }
  });


}
