var MetalabelManager = function() {
  var self = this;
  this.textbox_height = 30;
  this.left_margin = 20;
  this.image_width = 980;
  this.image_height= 540;
  this.canvas_width = this.image_width + 2 * this.left_margin;
  this.canvas_height = this.image_height * 2.5;
  this.tmp_canvas = null;
  this.ctx = null;
  this.wrapper_margin = 1.3; // this will affect all margins
  this.frame_top = this.canvas_height * 0.275; // 0.073;   // this tunes y / top margin
  this.frame_bottom = this.canvas_height * 0.925;
  this.canvas_anchor = new THREE.Vector2(0.5,0.4);
  this.metalabelDictionary = {};
  this.resize = function(size) {
    var pos =  Math.ceil(Math.log2(nSize));  //(ceiling of log n with base 2)
    return Math.pow(2, pos);
  }
  this.showNearbyLabels = function(targetId, adjcentMomentNumber, animation = false) {
    //startingTime = performance.now();
    g_currentTarget = targetId;
    let totalNumber = Object.keys(spriteManager.spriteDictionary).length;
    var start = targetId - adjcentMomentNumber;
    var stop = targetId + adjcentMomentNumber;
    if (start < -1) {
      start = 0;
    }
    if (stop >  totalNumber - 1) {
      stop = totalNumber - 1
    }
    var momentList = [];
    for (var i = start; i <= stop; i++) {
        momentList.push(i);
    }
    this.showLabelsWithTarget(targetId, momentList, animation);
  }

  this.showLabelsWithTarget = function(targetId, momentList, animation = false) {
    //Step 1.  calculate distances from adjacent sprites to the camera position,
    //        put those images that might be blocking the target into invisible list
    //Step 2. load the rest of the images in parallel
    //step 3. show images, move camera to target.

    //targetLabel will be put at the same position as the low-res sprite
    cameraManager.setTargetCameraPosition(spriteManager.spriteDictionary[targetId].object);
    let totalNumber = Object.keys(spriteManager.spriteDictionary).length;
    for (let n = 0; n < totalNumber; n++)
    {
      let spriteId = Number(spriteManager.spriteDictionary[n].object.name);
      //if (spriteId < start || spriteId > stop)
      if (!momentList.includes(spriteId))
      {
        spriteManager.spriteDictionary[n].object.material.opacity = OPACITY_FOR_HIDING;
        this.removeLabelFromScene(spriteId);
      } else if (spriteId == targetId) {
        continue; // targetId is always processed last
      } else {
        if (cameraManager.checkBlockingView(spriteManager.spriteDictionary[targetId].object, spriteManager.spriteDictionary[spriteId].object)) {
          //current label will be in front of the target and will be made invisible anyway, no need to load it.
          spriteManager.spriteDictionary[n].object.material.opacity = OPACITY_FOR_HIDING;
          this.removeLabelFromScene(spriteId);
        } else {
          //add detailed view and hide low-res view
          this.addLabelToScene(spriteId, animation);
        }
      }
    } // end of for
    //Show the target label
    spriteManager.spriteDictionary[targetId].object.material.opacity = OPACITY_FOR_HIDING;
    this.addLabelToScene(targetId, animation);
  }

  this.addLabelToScene = function(spriteId, isAnimated = false) {
    if (!this.metalabelDictionary.hasOwnProperty(spriteId))
    {
      this.createLabel(spriteId, isAnimated);
    } else {
      cameraManager.makeVisible(this.metalabelDictionary[spriteId].labelSprite); //show metaLabel
      spriteManager.spriteDictionary[spriteId].object.visible = false;
      //cameraManager.makeInvisible(spriteManager.spriteDictionary[spriteId].object); //hide low-res sprite
      if (spriteId == g_currentTarget) {
        cameraManager.flyToTarget(this.metalabelDictionary[spriteId].labelSprite, isAnimated);
      }
    }
  }
  this.removeLabelFromScene = function(spriteId) {
    //Jump straight to target if metalabel for this sprite already exists:
    if (this.metalabelDictionary.hasOwnProperty(spriteId))
    {
      spriteManager.spriteDictionary[spriteId].object.visible = true;
      cameraManager.makeInvisible(this.metalabelDictionary[spriteId].labelSprite);
      //cameraManager.makeVisible(spriteManager.spriteDictionary[spriteId].object); //restore low-res sprite
      return;
    }
  }

  this.createLabel = function(spriteId, isAnimated = false) {
    if (!this.metalabelDictionary.hasOwnProperty(spriteId))
    {
      //taskId = eventQueue.startTask(WAIT_FOR_COMPLETE, null);
      var imageFile =  spriteManager.spriteDictionary[spriteId].image;
      imageLoader.load(imageFile, imageLoadCallback.bind(this, spriteId, isAnimated));
    }
    return;
  }

  var imageLoadCallback = function (spriteId, isAnimated, image) {
      var momentIndex = spriteManager.spriteDictionary[spriteId].momentIndex;
      var game = spriteManager.spriteDictionary[spriteId].game;
      var corpusName = spriteManager.spriteDictionary[spriteId].corpus;
      var numberPerCorpus = spriteManager.spriteGroups[corpusName].children.length;
      var label = 'Moment Index: ' + momentIndex.toString() + ' / ' + (numberPerCorpus-1).toString();
      self.metalabelDictionary[spriteId] = {};
      var targetSprite = spriteManager.spriteDictionary[spriteId].object;
      if (self.tmp_canvas == null) {
        self.tmp_canvas = document.createElement("canvas");
        self.tmp_canvas.width = self.canvas_width;
        self.tmp_canvas.height = self.canvas_height;
        self.ctx = self.tmp_canvas.getContext("2d");
        self.ctx.font = self.textbox_height + "px Arial";
        self.ctx.textAlign = "left"
      } else {
        self.ctx.clearRect(0.0, 0.0, self.canvas_width, self.canvas_height);
      }
      // redraw
      self.ctx.fillStyle = "white";
      self.ctx.fillRect(0.0, self.frame_top, self.canvas_width, self.frame_bottom - self.frame_top); //canvas_height
      //ctx.strokeRect(0.0, frame_top, canvas_width, frame_bottom - frame_top);
      self.ctx.fillStyle = "black";
      //ctx.fillText('top', left_margin, frame_top + textbox_height);
      var titlePos = self.canvas_height / 2.0 + self.frame_top - self.textbox_height/2;
      self.ctx.fillText("Game: " + game, self.left_margin, titlePos);
      titlePos += self.textbox_height * 1.5;
      self.ctx.fillText("Corpus: " + corpusName, self.left_margin, titlePos);
      titlePos +=self.textbox_height * 1.5;
      self.ctx.fillText(label, self.left_margin, titlePos);
      titlePos += self.textbox_height * 1.5;
      self.ctx.fillText("Global ID: " + spriteId, self.left_margin, titlePos);
      //ctx.fillText("bottom", left_margin, canvas_height / 2.0 + frame_top - textbox_height/2);

  		self.ctx.drawImage(image, self.left_margin, self.frame_top + self.textbox_height, self.image_width, self.image_height);
      //Adding a sprite with canvas as its texture
      var carry_over = document.createElement("canvas");
      carry_over.width = self.canvas_width;
      carry_over.height = self.canvas_height;
      var carry_context = carry_over.getContext("2d");
      carry_context.drawImage(self.tmp_canvas, 0, 0);

      var texture = new THREE.Texture(carry_over);
      texture.minFilter = texture.magFilter = THREE.NearestFilter;
      texture.needsUpdate = true;
      if (self.metalabelDictionary[spriteId].labelSprite != null || self.metalabelDictionary[spriteId].labelSprite != undefined)
      {
        delete self.metalabelDictionary[spriteId].labelSprite;
      }
      var spriteMaterial = new THREE.SpriteMaterial( { map: texture, color: 0xffffff} );
      var labelSprite = new THREE.Sprite(spriteMaterial);
      labelSprite.center = self.canvas_anchor;
      labelSprite.position.set(targetSprite.position.x, targetSprite.position.y, targetSprite.position.z);
      labelSprite.scale.set(self.wrapper_margin, self.canvas_height / self.canvas_width * self.wrapper_margin, 1.0);
      labelSprite.material.transparent = true;
      labelSprite.material.opacity = 1;
      labelSprite.name = "label_" + spriteId.toString();
      //indexing every metaLabel
      self.metalabelDictionary[spriteId] = {
        label: label,
        labelSprite: labelSprite //reserved for metalabel shown when this sprite is clicked
      };
      scene.add(labelSprite);
      cameraManager.makeVisible(labelSprite);
      cameraManager.makeInvisible(targetSprite);
      if (spriteId == g_currentTarget) {
        cameraManager.flyToTarget(labelSprite, isAnimated);
      }
      //eventQueue.finishTask(taskId);
  }
  this.showLabelsInRange = function(distance) {
    cameraManager.getFrustrum();
    for (var corpus in spriteManager.interactionObjects){
      for (var i=0; i < spriteManager.interactionObjects[corpus].children.length; i++){
        var spriteObj = spriteManager.interactionObjects[corpus].children[i];
        if (cameraManager.isInCameraView(spriteObj) ){
          if (cameraManager.distanceToCamera(spriteObj) <= distance) {
            this.addLabelToScene(Number(spriteObj.name));
          }
        }
      }
    }
  } // end of showLabelsInRange
}
