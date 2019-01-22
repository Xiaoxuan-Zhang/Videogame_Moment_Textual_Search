function CameraManager() {
  var self = this;
  this.frustum = new THREE.Frustum();
  this.cameraViewProjectionMatrix = new THREE.Matrix4();
  this.visibleLabels = {}; //Labels that are visible in camera view
  this.targetCameraPosition = null;
  this.targetDistance = null;

  this.setTargetCameraPosition = function(targetObj) {
    var cameraPos = targetObj.position.clone();
    var lookAtVector = new THREE.Vector3(0,0, -1);
    lookAtVector.applyQuaternion(camera.quaternion).normalize();
    lookAtVector.multiplyScalar(FLY_STOP_DISTANCE);
    cameraPos.sub(lookAtVector);
    this.targetCameraPosition = cameraPos;
    this.targetDistance = targetObj.position.distanceTo(this.targetCameraPosition);
  }
  this.checkBlockingView = function(targetObj, obj) {
    var delta = 1.0;
    var distance = obj.position.distanceTo(this.targetCameraPosition)
    if (distance <= this.targetDistance + delta ){
      return true;
    } else {
      return false;
    }
  }
  this.jumpToTarget = function(targetObj){
    // var cameraPos = targetObj.position.clone();
    // var lookAtVector = new THREE.Vector3(0,0, -1);
    // lookAtVector.applyQuaternion(camera.quaternion).normalize();
    // lookAtVector.multiplyScalar(FLY_STOP_DISTANCE);
    // cameraPos.sub(lookAtVector);
    camera.position.set(this.targetCameraPosition.x, this.targetCameraPosition.y, this.targetCameraPosition.z);
    controls.target = targetObj.position;
    camera.lookAt(targetObj.position);
    showFavoriteBtn();
  }

  //Show only the target sprite, hiding other sprites in camera view
  this.showTarget = function(target){
    self.getFrustrum();
    var isInCamera = false;
    var delta = 1.0;
    var targetDistance = self.distanceToCamera(target);
    var distance = 0;
    // frustum is now ready to check all the objects you need
    for (var key in self.visibleLabels)
    {
      if (this.visibleLabels[key] == target) {
        continue;
      }
      isInCamera = self.frustum.intersectsSprite( self.visibleLabels[key])
      distance = self.distanceToCamera(self.visibleLabels[key]);
      // console.log("key=" + key + ",distance=" + distance);
      //If an object is in front of the target, make it invisible
      if (isInCamera && (distance <= targetDistance + delta )){
        self.makeInvisible(self.visibleLabels[key]);
      } else {
        self.visibleLabels[key].visible = true;
      }
    }
    self.makeVisible(target, true);
  }
  this.makeVisible = function(obj){
    if (obj != null || obj != undefined){
        obj.visible = true;
      this.visibleLabels[obj.id] = obj;
    }
  }
  this.makeInvisible = function(obj){
    if (obj != null || obj != undefined){
      obj.visible = false;
      delete this.visibleLabels[obj.id];
    }
  }
  //Move the camera to target by flying over
  this.flyToTarget = function(targetObj, isAnimated = false){
    if (targetObj == null || targetObj == undefined)
    {
      return;
    }
    //If animation is false, skip animation and jump to the target;
    //Else fly to the target
    if (!isAnimated) {
      g_isFlying = false;
      self.jumpToTarget(targetObj);
      self.showTarget(targetObj);
      return;
    }
    var flyTo = null;
    var flyFrom = null;
    //startingTime = performance.now();
    //Moving forward to the target object
    // var direction = raycaster.ray.direction.clone().normalize();
    // direction.multiplyScalar(FLY_STOP_DISTANCE);
    // targetPos = targetObj.position.clone();
    // targetPos.sub(direction) ;
    // flyTo =  targetPos;
    flyTo = this.targetCameraPosition;
    //var controlRange = spaceScale - target.length();
    flyFrom = camera.position;
    g_isFlying = true;
    lookAtOrg = controls.target.clone();
    lookAtDest = targetObj.position;
    duration = FLYING_DURATION;
    // console.log('DEBUGGING: Flying Started - ' + (performance.now() - startingTime)); startingTime = performance.now();
    //reference to http://sole.github.io/tween.js/examples/03_graphs.html
    var tween_rotate = new TWEEN.Tween(lookAtOrg).to(lookAtDest,duration/2).easing(TWEEN.Easing.Linear.None)
      .onUpdate(function(){
        camera.lookAt(this.x, this.y, this.z);})
      .onComplete(function () {
        audioManager.playSound(audioManager.soundOnShow); //Sound for Clicking
        controls.target = lookAtDest;
        //controls.maxDistance = controlRange;
        g_isFlying = false;})
      .start();
    var tween_forward = new TWEEN.Tween(flyFrom)
      .to(flyTo, duration)
      .easing(TWEEN.Easing.Quintic.InOut)
      .onUpdate(function () {
        g_isFlying = true;
        camera.position.set(this.x, this.y, this.z);
        //IMPORTANT!
        camera.lookAt(targetObj.position);
      })
      .onComplete(function () {
        g_isFlying = false;
        // console.log('DEBUGGING: Flying Finished - ' + (performance.now() - startingTime)); startingTime = performance.now();
        self.jumpToTarget(targetObj);
        self.showTarget(targetObj);
        //showLabelsInRange(DISTANCE_FOR_DETAILED_VIEW);
      });
      tween_rotate.chain(tween_forward);
  }
  this.getFrustrum = function(){
    //every time the camera or objects change position (or every frame)
    camera.updateMatrixWorld(); // make sure the camera matrix is updated
    camera.matrixWorldInverse.getInverse( camera.matrixWorld );
    //matrixWorldInverse is the camera's orientation and position in world space V=M^-1
    this.cameraViewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
    this.frustum.setFromMatrix( this.cameraViewProjectionMatrix );
  }
  this.isInCameraView = function(object) {
    return this.frustum.intersectsSprite(object);
  }
  this.distanceToCamera = function(object) {
    return object.position.distanceTo(camera.position);
  }
  this.clearVisibleLabels = function() {
    for (var key in this.visibleLabels) {
      this.makeInvisible(this.visibleLabels[key]);
    }
  }
}
