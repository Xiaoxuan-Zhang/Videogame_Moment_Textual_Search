function SpriteManager() {
  var self = this;
  this.anchor = new THREE.Vector2(0.5,0.4);
  this.scene = null;
  this.spriteDictionary = {};
  this.spriteGroups = {}; //Sprites are grouped as corpus
  this.interactionObjects = {};


  var addSpritesToScene = function(corpusName, startingBase, dataObj) {
    var game = dataObj.game;
    var screenshotsFolder = dataObj.screenshots_folder;
    var embeddingsFolder = dataObj.embeddings_folder;
    var basePath = dataObj["corpus"][corpusName];
    var jsonObj = dataObj[corpusName];
    var dimensions = jsonObj.positions.dimensions;
    var spriteSheetPath = jsonObj.spriteSheetPath;

    var number = jsonObj.totalCount;
    var positionFile = jsonObj.positions.bin;
    g_expectedActions += 1;
    var totalMap = textureLoader.load(spriteSheetPath, function() {
      g_actionCounter += 1;
    });

    g_expectedActions += 1;
    fileLoader.setResponseType( 'arraybuffer' );
    fileLoader.load(positionFile, function(binary) {
      var spriteGroup = new THREE.Group();
      var positionArray = [];
      var float32View = new Float32Array(binary);
      for (var i = 0; i < float32View.length; i = i + dimensions) {
        var temp = []
        for (var j = 0; j < dimensions; j++) {
          temp[j] = float32View[i+j] * SCALE_MULTIPLIER;
        }
        positionArray.push(temp);
      }
      for (var i = 0; i < number; i++){
        var totalIndex = i + startingBase; //numberBase.val;
        //Made some modification in Three.js, adding additional params in Sprite
        var params = {
          uvOffset: {
            u: jsonObj.spritesheet[i].uvOffset_u,
            v: jsonObj.spritesheet[i].uvOffset_v
          },
          uvRepeat: {
            u: jsonObj.spritesheet[i].uvRepeat_u,
            v: jsonObj.spritesheet[i].uvRepeat_v
          }
        };
        var spriteMaterial = new THREE.SpriteMaterial( { map: totalMap, color: 0xffffff} );
        var sprite = new THREE.Sprite( spriteMaterial, params);

        if (positionArray[i].length <= 2)
        {
          sprite.position.set(positionArray[i][0], 0.0, positionArray[i][1]); //2D
        } else {
          sprite.position.set(positionArray[i][0], positionArray[i][1], positionArray[i][2]); //3D
        }
        sprite.name = totalIndex.toString();
        sprite.center = self.anchor;
        sprite.material.transparent = true;
        sprite.material.opacity = 1;
        sprite.scale.set( jsonObj.spriteWidth/jsonObj.spriteHeight, 1.0, 1.0 );
        spriteGroup.add( sprite );

        //indexing every sprite
        self.spriteDictionary[totalIndex] = {
          object: sprite,
          image:  basePath + '/' + screenshotsFolder + '/' + jsonObj.spritesheet[i].filename,
          //label: 'Moment Index: ' + i.toString() + ' / ' + (number-1).toString(),
          game: game,
          corpus: corpusName,
          momentIndex: i, //moment Id in this corpus, different from globalId (totalIndex)
        };
      } // for i in position
      //Add groups for raycasting
      self.interactionObjects[corpusName] = spriteGroup;
      //indexing each corpus as a group
      self.spriteGroups[corpusName] = spriteGroup;
      //numberBase.val += number; //Counter for globalID
      self.scene.add(spriteGroup);
      g_actionCounter += 1;
    });  //end of fileLoader.load
  };

  var callbackLoadSprite = function(data) {
    var jsonData = JSON.parse(data);
    dataManager.updateJSONData(jsonData);
    //var numberBase = {val: 0};
    var startId = 0;
    //corpora iteration
    var corporaNames = Object.keys(jsonData.corpus).sort();
    for (var i =0; i < corporaNames.length; i++) {
      //addSpritesToScene(corporaNames[i], numberBase, jsonData);
      addSpritesToScene(corporaNames[i], startId, jsonData);
      startId += Number(jsonData[corporaNames[i]].totalCount);
    }; // end of for each corpusName
    g_actionCounter += 1;
  };

  this.addSprites = function(scene, spriteJSONPath){
    this.scene = scene;
    g_expectedActions += 1;
    //Read JSON file
    fileLoader.load(spriteJSONPath, callbackLoadSprite);
  };

  this.enableSpritesInteractions = function(){
    while (this.interactionObjects.length > 0) {this.interactionObjects.pop();}
    for (var corpus in this.spriteGroups)
    {
      if (document.getElementById(corpus + "_check").checked)
      {
        this.interactionObjects.push(this.spriteGroups[corpus]);
      }
    }
  }
  this.toggleGroupRaycasting = function(corpus,enabled){
    if (enabled){
      this.interactionObjects[corpus] = this.spriteGroups[corpus];
    } else {
      delete this.interactionObjects[corpus];
    }
  }
  this.toggleSpriteGroup = function(corpus, enabled) {
    if (enabled) {
      opacity = 1.0;
    } else {
      opacity = OPACITY_FOR_HIDING;
    }
    for (var i = 0; i < this.spriteGroups[corpus].children.length; i++)
    {
      this.spriteGroups[corpus].children[i].material.opacity = opacity;
    }
  }
  this.getGlobalId = function(corpus, moment_id) {
    return this.spriteGroups[corpus].children[moment_id].name;
  }
}
