
function MomentAnimator(texture, UVs)
{
  //texture is passed in by reference
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.offset.x = 0.0;
  texture.offset.y = 0.0;
  //get UVs of all sprites
  this.UVs = UVs;

  this.material = new THREE.MeshBasicMaterial( { map: texture, side:THREE.DoubleSide } );
	this.geometry = new THREE.PlaneGeometry(256.0, 224.0, 1, 1);
	this.mesh = new THREE.Mesh(this.geometry, this.material);
  scene.add(this.mesh);

  //start animation
  this.start = function(startId, stopId, tileDispDuration){
    this.startId = startId;
    this.stopId = stopId;
    this.currentDisplayTime = 0;
    this.currentTile = startId;
    // how long should each image be displayed?
  	this.tileDisplayDuration = tileDispDuration;
    texture.offset.x = this.UVs[startId].uvOffset.u;
    texture.offset.y = this.UVs[startId].uvOffset.v;
    texture.repeat.set(this.UVs[startId].uvRepeat.u, this.UVs[startId].uvRepeat.v);
  }
  //stop animation
  this.stop = function() {
    texture.offset.x = 0.0;
    texture.offset.y = 0.0;
    this.currentDisplayTime = 0;
    this.currentTile = 0;
  }
  //play animation
	this.update = function( milliSec )
	{
		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration)
		{
			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;
			texture.offset.x = this.UVs[this.currentTile].uvOffset.u;
			texture.offset.y = this.UVs[this.currentTile].uvOffset.v;
      texture.repeat.set(this.UVs[this.currentTile].uvRepeat.u, this.UVs[this.currentTile].uvRepeat.v);
      if (this.currentTile == this.stopId + 1)
				this.stop();
		}
	};
}
