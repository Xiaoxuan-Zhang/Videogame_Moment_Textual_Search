var lastClickedTime = null;
var highlighted = null; //current hightlighted object when mouseover

var input = document.getElementById("moment_id");
// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Cancel the default action, if needed
  //event.preventDefault();
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Trigger the button element with a click
    document.getElementById("moment_button").click();
  }
});

function onMouseDown(event) {
  if (g_dialogVisible) { return; }
  //event.preventDefault();
  lastClickedTime = performance.now();
  document.getElementById("moment_id").blur();
}
function onMouseUp(event) {
  if (g_dialogVisible) { return; }
  //event.preventDefault();
  if (!g_isFlying) {
    //if it's a drag, do nothing;
    if (performance.now() - lastClickedTime > 200)
    {
      return;
    }
    // update the mouse position
  	mouse.x = ( event.clientX / window.innerWidth ) * 2.0 - 1.0;
  	mouse.y = - ( event.clientY / window.innerHeight ) * 2.0 + 1.0;

    //var startingTime = performance.now();
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( Object.values(spriteManager.interactionObjects), true );
    //console.log('DEBUGGING: Ray Cast - ' + (performance.now() - startingTime)); startingTime = performance.now();
    resetVisibleLabels();
    resetSprites();
    // console.log('DEBUGGING: Resets   - ' + (performance.now() - startingTime));
    // if there is one (or more) intersections
  	if ( intersects.length > 0 )
  	{
      g_autoRotate = false;
      var intersectedObj = intersects[0].object;
	    ///////////////////////////////////////////////////Chris's Code
      audioManager.playSound(audioManager.soundOnClick); //Sound for Clicking
	    ////////////////////////////////////////////////
      labelManager.showNearbyLabels(Number(intersectedObj.name), ADJACENT_MOMENTS, true);
      urlManager.updateURL(URLKeys.MOMENT, g_currentTarget);
      g_lastSelected.object = spriteManager.spriteDictionary[g_currentTarget].object;
  	} else {
      //controls.g_autoRotate = true;
      g_currentTarget = null;
      g_lastSelected.object = null;
      g_autoRotate = true;
      urlManager.updateURL(URLKeys.MOMENT, null);
      hideFavoriteBtn();
      //console.log('Nothing got clicked');
    } //end of intersect.length > 0
  } // end of g_isFlying
}

function onMouseMove(event) {
  if (g_dialogVisible) { return; }
  //event.preventDefault();
  // update the mouse position
  mouse.x = ( event.clientX / window.innerWidth ) * 2.0 - 1.0;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2.0 + 1.0;
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( Object.values(spriteManager.interactionObjects), true );
  // if there is one (or more) intersections
  if ( intersects.length > 0 )
  {
    resetHightLight();
    highlighted = intersects[0].object;
    highlighted.material.color.setHex( 0x10ffff );
  } else {
    resetHightLight();
  }
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
function resetHightLight() {
  if (highlighted != null)
  {
    highlighted.material.color.setHex( 0xffffff );
  }
}
function resetSprites(){
  for (var corpusname in spriteManager.spriteGroups)
  {
    resetSpritesInCorpus(corpusname);
  }
}
function resetSpritesInCorpus(corpus){
  //if (document.getElementById(corpus + "_check").checked){
  if (corpus in spriteManager.interactionObjects){
    for (var i = 0; i < spriteManager.spriteGroups[corpus].children.length; i++)
    {
      spriteManager.spriteGroups[corpus].children[i].material.opacity = 1.0;
      spriteManager.spriteGroups[corpus].children[i].visible = true;
    }
  }
}
function resetVisibleLabels(){
  cameraManager.clearVisibleLabels();
}
function resetLines(){
  if (g_lastSelected.line != null)
  {
    scene.remove(g_lastSelected.line) ;
    g_lastSelected.line = null;
  }
}
function resetBookmakrs() {
  if (g_dialogVisible) { return; }

  for (bookmark in bookmarkList) {

  }
}

function onKeydown(event){
  if (g_dialogVisible) { return; }
  // should check if selected item is part of some object
  if (g_lastSelected.object != null && (event.key == '.' || event.key == '>')){
    onNextBtnClicked();
    // if (g_currentTarget >= Object.keys(spriteManager.spriteDictionary).length - 1)
    // {
    //   return;
    // }
    // g_autoRotate = false;
    // ////////////////////////////////////////////////////////////Chris's Code
    // audioManager.playSound(audioManager.soundOnNext); //sound for next page
  	// //////////////////////////////////////////////////////////////////////
    // g_currentTarget += 1;
    // labelManager.showNearbyLabels(g_currentTarget, 5, false);
    // urlManager.updateURL(URLKeys.MOMENT, g_currentTarget);
    // g_lastSelected.object = spriteManager.spriteDictionary[g_currentTarget].object;
  } else if (g_lastSelected.object!= null && (event.key == ',' || event.key == '<')){
    onPreviousBtnClicked();
    // if (g_currentTarget == 0)
    // {
    //   return;
    // }
    // g_autoRotate = false;
    // ////////////////////////////////////////////////////////////Chris's Code
    // audioManager.playSound(audioManager.soundOnNext); //sound for next page
	  // ////////////////////////////////////////////////////////////Chris's Code
    // g_currentTarget -= 1;
    // labelManager.showNearbyLabels(g_currentTarget, 5, false);
    // urlManager.updateURL(URLKeys.MOMENT, g_currentTarget);
    // g_lastSelected.object = spriteManager.spriteDictionary[g_currentTarget].object;
  }
}
function onKeyup(event){
  if (g_dialogVisible) { return; }
}

function onPageLoad(object) {
	var url = 'http://localhost:5000/game';
  var game = "";
  // sanity check
  if (Array.isArray(object))
  {
    game = object[0];
  } else {
    game = object;
  }
	var input_data = {
		text: game
	};
	$.ajax({
		url: url,
		type: "POST",
		data: input_data,
		success: function(result){
		  console.log(result);
		},
		error: function(error) {
		  console.log(error);
		}
	})
}
function onTextInput(input) {
  var url = 'http://localhost:5000/data';
  var input_data = {
    text: input
  };

  $.ajax({
    url: url,
    type: "GET",
    data: input_data,
    success: function(result){
      console.log(result);
    },
    error: function(error) {
      console.log(error);
    }
  })
}
function onSearchInput(event) {
  if (g_dialogVisible) { return; }
  var inputMomentId = document.getElementById("moment_id");
  inputMomentId.blur();
  var input = inputMomentId.value;
  if ($.isNumeric(input))
  {
    onMomentInput(input);
  } else {
    onTextInput(input);
  }
}
function onMomentInput(input) {
  //Equivalent to clicking on a moment sprite
  var momentId = Number(input);
  g_autoRotate = false;
  resetVisibleLabels();
  resetSprites();
  g_currentTarget = momentId;
  labelManager.showNearbyLabels(momentId, ADJACENT_MOMENTS, true);
  urlManager.updateURL(URLKeys.MOMENT, momentId);
  audioManager.playSound(audioManager.soundOnClick);//Sound for Clicking
  g_lastSelected.object = spriteManager.spriteDictionary[g_currentTarget].object;
}

//Save a new bookmark
function onBookmarking(event) {
  if (g_dialogVisible) { return; }

  if (g_lastSelected.object != null && (event.key == 'b' || event.key == 'B')){
    // // display dialog
    // g_dialogVisible = true;
    onAddBookmark();
  } else if (g_lastSelected.object != null && (event.key == 'Backspace')) {
    onRemoveBookmark();
  }
}

//Retrieve moment by bookmark
function onReadBookmark(event) {
  if (g_dialogVisible) { return; }

  if (event.key == '_' || event.key == '-' ){
    var momentId = bookmarkManager.getLastBookmark();
  }
  else if (event.key == '+' || event.key == '=' ){
    var momentId = bookmarkManager.getNextBookmark();
  }
  if (momentId != null){
    g_autoRotate = false;
    g_currentTarget = Number(momentId);
    labelManager.showNearbyLabels(g_currentTarget, ADJACENT_MOMENTS);
    urlManager.updateURL(URLKeys.MOMENT, g_currentTarget);
    audioManager.playSound(audioManager.soundOnNext); //sound for next page
    g_lastSelected.object = spriteManager.spriteDictionary[g_currentTarget].object;
  }
}

function myKeyDown(event){
  if (g_dialogVisible) { return; }

	event = event || window.event;
  cameraControls.onKeydown(event);
};

function myKeyUp (event){
  if (g_dialogVisible) { return; }

  event = event || window.event;
  cameraControls.onKeyup(event);
};

function resizeTimeline(){
  bookmarkManager.timeLine.resizeTimeline();
}
