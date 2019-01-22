var AudioManager = function () {
  var self = this;
  this.listener = new THREE.AudioListener();
  this.soundOnSelect = new THREE.Audio( this.listener );
  this.soundOnShow = new THREE.Audio( this.listener );
  this.soundOnClick = new THREE.Audio( this.listener );
  this.soundOnNext = new THREE.Audio( this.listener ); //variables on UI sounds
  this.Music = new THREE.Audio( this.listener );
  this.audioLoader = new THREE.AudioLoader();
  this.muted = true;

  this.initAudio = function() {
    //g_expectedActions += 1;
    // this.audioLoader.load( 'sound/BackgroundMusic.mp3', function( buffer ) {
    //   self.Music.setBuffer( buffer );
    //   self.Music.setLoop( true );
    //   self.Music.setVolume( 0.3 );
    //   //self.Music.play();//backgroundmusic
    //   //g_actionCounter += 1;
    // });
    //g_expectedActions += 1;
    this.audioLoader.load( 'sound/OnShow.mp3', function( buffer ) {
      self.soundOnShow.setBuffer( buffer );
      self.soundOnShow.setLoop( false );
      self.soundOnShow.setVolume( 0.1 );
      //g_actionCounter += 1;
    });
    //g_expectedActions += 1;
    this.audioLoader.load( 'sound/OnSelect.wav', function( buffer ) {
      self.soundOnClick.setBuffer( buffer );
      self.soundOnClick.setLoop( false );
      self.soundOnClick.setVolume( 0.3 );
      //g_actionCounter += 1;
    });
    //g_expectedActions += 1;
    this.audioLoader.load( 'sound/OnSelect.mp3', function( buffer ) {
      self.soundOnSelect.setBuffer( buffer );
      self.soundOnSelect.setLoop( false );
      self.soundOnSelect.setVolume( 0.3 );
      //g_actionCounter += 1;
    });
    //g_expectedActions += 1;
    this.audioLoader.load( 'sound/OnNext.wav', function( buffer ) {
      self.soundOnNext.setBuffer( buffer );
      self.soundOnNext.setLoop( false );
      self.soundOnNext.setVolume( 0.3 );
      //g_actionCounter += 1;
  	});//sound for next page
  }
  this.playSound = function(object) {
    if (this.muted) {
      return;
    }
    object.play();
  }
}
