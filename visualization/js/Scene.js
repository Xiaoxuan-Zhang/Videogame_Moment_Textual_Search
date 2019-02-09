var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var renderer, scene, camera, controls;
var isPageShown = false;
var spriteJSONPath = null;
/////////////////////globals////////////////////////////////////////////////////
var g_lastSelected = {line: null, object: null}; //last clicked object
var g_isFlying = false;
var g_currentTarget = null; // ID of current focused object
var g_actionCounter = 0;
var g_expectedActions = 0;
var g_autoRotate = true;
var g_dialogVisible = false;
////////////////////Objects/////////////////////////////////////////////////////
var animator = null;
var bookmarkManager = new BookmarkManager();
var spriteManager = new SpriteManager();
var labelManager = new MetalabelManager();
var skybox = new Skybox();
var cameraManager = new CameraManager();
var urlManager = new UrlManager();
var audioManager = new AudioManager();
var eventQueue = new EventQueue();
var bookmarkDialog = new BookmarkInput();
var helpDialog = new HelpDialog();
var shareDialog = new ShareDialog();
var videoManager = new VideoManager();
var dataManager = new DataManager();
var cameraControls = new CameraControls();
var server = new Server();
///////////////////Chris's variables////////////////////////////////////////////
var moveFoward = false;
var moveBackward = false;
var turnLeft = false;
var turnRight = false;
var turnUp = false;
var turnDown = false; //variables for moving and turning
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var rotationVector = new THREE.Vector3( 0, 0, 0 );
var tmpQuaternion = new THREE.Quaternion();
var clock = new THREE.Clock();//variables for turning direction and moving speed
var urlParams = null;
///////////////////////////////////////////////////////////////////////////////

init();

function init() {
  audioManager.initAudio();
  g_expectedActions += 1;
  urlParams = urlManager.parseURL(window.location.href);

  $.getJSON("gameinfo.json", function(result){
    spriteJSONPath = result[urlParams.game][urlParams.dimension];
    addGameInfo(urlParams.game);
    onPageLoad(urlParams.game);
    initScene();
    animate();
    g_actionCounter += 1;
  });
}
function initScene() {
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( WIDTH , HEIGHT );

  var container = document.getElementById( 'container' );
  container.appendChild( renderer.domElement );

  scene = new THREE.Scene();
  // scene.fog = new THREE.FogExp2( 0x000000, 0.0009 );
  camera = new THREE.PerspectiveCamera( 75, WIDTH / HEIGHT, 0.1, SPACE_SCALE*2.0);
  camera.position.x = 0.0;
  camera.position.y = 0.0;
  camera.position.z = SPACE_SCALE * - 0.8;// SPACE_SCALE * - 0.2  ;

  if (urlParams.dimension == "2"){
    camera.position.y = 30.0;
  }

  controls = new THREE.OrbitControls( camera, renderer.domElement);
  controls.enableKeys = true;
  controls.maxDistance = SPACE_SCALE * 0.8;
  controls.update();

  cameraControls.init();

  skybox.addToScene(scene);
  spriteManager.addSprites(scene, spriteJSONPath);

  //Interactions
  window.addEventListener( 'resize', onWindowResize, false );
  document.getElementById("container").addEventListener( 'mousedown', onMouseDown, false );
  document.getElementById("container").addEventListener( 'mouseup', onMouseUp, false );
  document.getElementById("container").addEventListener( 'mousemove', onMouseMove, false );
  // window.addEventListener( 'mousedown', onMouseDown, false );
  // window.addEventListener( 'mouseup', onMouseUp, false );
  // window.addEventListener( 'mousemove', onMouseMove, false );
  window.addEventListener( 'keydown', onKeydown, false );
  window.addEventListener( 'keyup', onBookmarking, false ); //Keyboard 'B'
  window.addEventListener( 'keyup', onReadBookmark, false ); //Keyboard '+' and '-'
  window.addEventListener( 'keyup', onKeyup, false );
  //////////////////////////////////////////////////chris's code
  window.addEventListener( 'keyup', myKeyUp, false );
  window.addEventListener( 'keydown', myKeyDown, false );
  window.addEventListener('resize', resizeTimeline, false );
  window.addEventListener('resize', resizeVideoDiv, false );

  ///////////////////////////////////////////////////////
}

function animate() {
  loadingScene();
  requestAnimationFrame( animate );
  render();
  videoManager.update();  // check for stopping time
  TWEEN.update();
  // eventQueue.update();
  // var delta = clock.getDelta();
  // if (animator != null) {
  //   animator.update(1000 * delta);
  // }
  var now = performance.now();
  skybox.uniforms.time.value = now * 0.0005;
  //Autorotate camera
  if (g_autoRotate)
  {
    //controls.update();
    camera.rotation.x += AUTO_ROTATE_SPEED * 90 * Math.PI / 180;
    camera.rotation.z += AUTO_ROTATE_SPEED * 90 * Math.PI / 180;
  }
  cameraControls.update();
}
function render() {
  renderer.render( scene, camera );
}
function loadingScene() {
  // g_loadingFinished from LoadingProgress.js
  if (!isPageShown && g_loadingFinished) // && (g_actionCounter == g_expectedActions))
  {
    addCorporaButtons();
    addTimelineDivs();
    presetTextbox();
    //createTimeline();
    bookmarkManager.init();
    if (dataManager.jsonData.video != undefined)
    {
      videoManager.init(dataManager.jsonData.video.source, dataManager.jsonData.video.fps, dataManager.jsonData.video.total);
    }
    cameraReady();
    showPage();
    isPageShown = true;
  }
}
function cameraReady() {

  if (URLKeys.MOMENT in urlParams && urlParams[URLKeys.MOMENT] != "null") {
    var inputMomentId = Number(urlParams[URLKeys.MOMENT]);
    labelManager.showNearbyLabels(inputMomentId, 1, true);
    urlManager.updateURL(URLKeys.MOMENT, inputMomentId);
    g_lastSelected.object = spriteManager.spriteDictionary[inputMomentId].object;
    g_autoRotate = false;
  } else if (URLKeys.POSITION in urlParams) {
    var positions = urlParams[URLKeys.POSITION];
    if (positions.length == 3) {
      camera.position.x = positions[0];
      camera.position.y = positions[1];
      camera.position.z = positions[2];
    }
  }
  if (URLKeys.BOOKMARK in urlParams && urlParams[URLKeys.BOOKMARK] != "null") {
    //console.log(urlParams[URLKeys.BOOKMARK]);
    var bmjson = JSON.parse(decodeURI(urlParams[URLKeys.BOOKMARK]));
    for (var key in bmjson) {
      bookmarkManager.addBookmark(key, bmjson[key]);
    }
  }

  let initPosition = new THREE.Vector3(camera.position.x, camera.position.y, SPACE_SCALE * - 0.2); 
  cameraManager.flyToPosition(initPosition);
}
