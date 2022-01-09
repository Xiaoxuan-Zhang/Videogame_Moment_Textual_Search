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
  this.cameraSpeed = 0.1;
  this.cameraFront = new THREE.Vector3(0, 0, 1);
  this.cameraPos  = new THREE.Vector3(0);
  this.cameraGlobalUp = new THREE.Vector3(0.0, 1.0, 0.0);
  this.cameraUp = new THREE.Vector3();
  this.cameraTarget = new THREE.Vector3();
  this.cameraViewMatrix = new THREE.Matrix4();
  this.cameraRight = new THREE.Vector3();
  this.translateMatrix = new THREE.Matrix4();
  this.velocityConst = 20.0;
  this.cameraYaw = 0.0;
  this.cameraPitch = 0.0;
  this.tempDirection = new THREE.Vector3();
}
Object.assign( CameraControls.prototype, {
  init: function() {
    this.cameraPos = camera.position;
  },
  update: function() {
    var now = performance.now();
    deltaTime = (now - this.prevTime)/1000.0;
    this.cameraSpeed = this.velocityConst * deltaTime;
    if (this.moveFoward) {
      camera.translateZ(-this.cameraSpeed);
    }
    if (this.moveBackward) {
      camera.translateZ(this.cameraSpeed);
    }
    if (this.turnLeft) {
      this.cameraYaw -= this.velocityConst * 0.01; //xoffset
      this.updateCameraFront();
      this.updateCameraRight();
      this.cameraPos.sub(this.cameraRight.multiplyScalar(this.cameraSpeed));
    }
    if (this.turnRight) {
      this.cameraYaw += this.velocityConst * 0.01; //xoffset
      this.updateCameraFront();
      this.updateCameraRight();
      this.cameraPos.add(this.cameraRight.multiplyScalar(this.cameraSpeed));
    }
    if (this.turnUp) {
      this.cameraPitch -= this.velocityConst * 0.01; //yoffset
      this.updateCameraFront();
      this.updateCameraRight();
      this.cameraPos.sub(this.cameraRight.multiplyScalar(this.cameraSpeed));
    }
    if (this.turnDown) {
      this.cameraPitch -= this.velocityConst * 0.01; //yoffset
      this.updateCameraFront();
      this.updateCameraRight();
      this.cameraPos.add(this.cameraRight.multiplyScalar(this.cameraSpeed));
    }
    this.prevTime = now;
    //cameraControls.updateRotation();
    camera.updateProjectionMatrix();
  },
  updateCameraFront: function() {
    if(this.cameraPitch > 89.0)
      this.cameraPitch =  89.0;
    if(this.cameraPitch < -89.0)
      this.cameraPitch = -89.0;
    console.log("pitch:", this.cameraPitch);
    console.log("yaw:", this.cameraYaw);
    this.tempDirection.x = Math.cos(this.cameraYaw * 180/Math.PI) * Math.cos(this.cameraPitch * 180/Math.PI);
    this.tempDirection.y = Math.sin(this.cameraPitch * 180/Math.PI);
    this.tempDirection.z = Math.cos(this.cameraPitch * 180/Math.PI) * Math.sin(this.cameraYaw * 180/Math.PI);
    this.cameraFront = this.tempDirection.normalize();
  },
  updateCameraRight: function() {
    this.cameraRight.crossVectors(this.cameraFront, this.cameraGlobalUp);
    this.cameraRight.normalize();
  },
  onKeydown: function(event) {
    switch(event.keyCode){
  		case 87:
  			this.moveFoward = true;
  			break;
  		case 83:
  			this.moveBackward = true;
  			break;
  		case 65:
  			this.turnLeft = true;
  			break;
   		case 68:
  			this.turnRight = true;
  			break;
  		case 82:
  			this.turnUp = true;
  			break;
  		case 70:
  			this.turnDown = true;
  			break;
  	}
  },
  onKeyup: function(event) {
    switch(event.keyCode){
  		case 87:
  			this.moveFoward = false;
  			break;
  		case 83:
  			this.moveBackward = false;
  			break;
  		case 65:
  			this.turnLeft = false;
  			break;
   		case 68:
  			this.turnRight = false;
  			break;
  		case 82:
  			this.turnUp = false;
  			break;
  		case 70:
  			this.turnDown = false;
  			break;
  	}
  }
});
