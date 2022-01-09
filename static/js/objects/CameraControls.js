function CameraControls() {
  this.moveFoward = false;
  this.moveBackward = false;
  this.turnLeft = false;
  this.turnRight = false;
  this.turnUp = false;
  this.turnDown = false; //variables for moving and turning
  this.prevTime = performance.now();
  this.velocity = new THREE.Vector3();
  this.direction = new THREE.Vector3();
  this.rotationVector = new THREE.Vector3( 0, 0, 0 );
  this.tmpQuaternion = new THREE.Quaternion();
  this.clock = new THREE.Clock();//variables for turning direction and moving speed
  this.enabled = true;
}
Object.assign( CameraControls.prototype, {
  init: function() {
    return;
  },
  update: function() {
    //////////////////////////Chris's code: Navigation////////////////////////////
    // var delta = (now - prevTime)/1000;
    // velocity.z -= velocity.z * 10.0 * delta;
    // direction.z = Number( moveFoward ) - Number (moveBackward);
    // direction.normalize();
    // if(moveFoward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    // camera.translateZ( velocity.z * delta );//for moving forward and backward
    // turning();
    // prevTime = now;
    // //set target
    // camera.updateProjectionMatrix();
    //////////////////////////////////////////////////////////////////////////////
    var now = performance.now();
    var delta = (now - this.prevTime)/1000;
    this.velocity.z -= this.velocity.z * 10.0 * delta;
    this.direction.z = Number( this.moveFoward ) - Number (this.moveBackward);
    this.direction.normalize();
    if(this.moveFoward || this.moveBackward) this.velocity.z -= this.direction.z * 400.0 * delta;
    camera.translateZ( this.velocity.z * delta );//for moving forward and backward
    this.turning();
    this.prevTime = now;
    //set target
    camera.updateProjectionMatrix();
  },
  turning: function() {
    //////////////////////////chris's new code
    // function turning(){
    //   var factor = clock.getDelta() * 0.25;
    //   tmpQuaternion.set( rotationVector.x * factor, rotationVector.y * factor, rotationVector.z * factor, 1).normalize();
    //   camera.quaternion.multiply( tmpQuaternion ); //for rotation vector
    // }
    //////////////////////////////////////////////////
    var factor = this.clock.getDelta() * 0.25;
    this.tmpQuaternion.set( this.rotationVector.x * factor, this.rotationVector.y * factor, this.rotationVector.z * factor, 1).normalize();
    camera.quaternion.multiply( this.tmpQuaternion ); //for rotation vector
  },
  updateRotation: function() {
    // function updateRotation(){
    // 	rotationVector.x = ( - turnDown + turnUp );
    // 	rotationVector.y = ( - turnRight + turnLeft );
    // 	//update the rotation's direction
    // };
    this.rotationVector.x = ( - this.turnDown + this.turnUp );
	  this.rotationVector.y = ( - this.turnRight + this.turnLeft );
  },
  onKeydown: function(event) {
    if (!this.enabled) {return;}
    switch(event.keyCode){
  		case 87:
  			this.moveFoward = true;
  			break;
  		case 83:
  			this.moveBackward = true;
  			break;
  		case 65:
  			this.turnLeft = 1;
  			break;
   		case 68:
  			this.turnRight = 1;
  			break;
  		case 82:
  			this.turnUp = 1;
  			break;
  		case 70:
  			this.turnDown = 1;
  			break;
  	}
  	this.updateRotation();
  },
  onKeyup: function(event) {
    if (!this.enabled) {return;}
    switch(event.keyCode){
  		case 87:
  			this.moveFoward = false;
  			break;
  		case 83:
  			this.moveBackward = false;
  			break;
  		case 65:
  			this.turnLeft = 0;
  			break;
   		case 68:
  			this.turnRight = 0;
  			break;
  		case 82:
  			this.turnUp = 0;
  			break;
  		case 70:
  			this.turnDown = 0;
  			break;
  	}
  	this.updateRotation();
  }
});
