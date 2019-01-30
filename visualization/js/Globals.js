var SPACE_SCALE = 1000.0;
var SCALE_MULTIPLIER = 3.0;
var FLYING_DURATION = 2000;
var FLY_STOP_DISTANCE = 2.0;
var ADJACENT_MOMENTS = 10;
var AUTO_ROTATE_SPEED = 0.00001;
var OPACITY_FOR_HIDING = 0.05;
var DISTANCE_FOR_DETAILED_VIEW = SPACE_SCALE * 0.01;
var manager = new THREE.LoadingManager();
var fileLoader = new THREE.FileLoader(manager);
var textureLoader = new THREE.TextureLoader(manager);
var imageLoader = new THREE.ImageLoader(manager);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
