function VideoManager() {
  var self = this;
  this.startTime = 0.0;
  this.stopTime = 0.0;
  this.fps = null;
  this.totalCount = 0;
  this.loaded = false;
  this.videoElement = null;
  this.videoFile = null;
  this.currentTime = null;
  this.playing = false;

  this.init = function(video, fps, totalCount) {
    this.videoFile = video;
    this.fps = fps;
    this.totalCount = totalCount;
    this.videoElement = document.getElementById('moment-video');
    document.getElementById("moment-video-src").src = this.videoFile;
    this.videoElement.addEventListener('loadedmetadata', function() {
      self.loaded = true;
    }, false);
    this.videoElement.load();
  }

  this.play = function(start, stop) {
    if (!this.playing) {
      startIndex = Number(document.getElementById("video_startId").value);
      stopIndex = Number(document.getElementById("video_stopId").value);
      if (stopIndex < startIndex) {
        stopIndex = 0.0;
      }
      if (startIndex > this.totalCount) {
        startIndex = this.totalCount;
      }
      if (stopIndex > this.totalCount) {
        stopIndex = this.totalCount;
      }
      this.startTime = startIndex / this.fps;
      this.stopTime = stopIndex / this.fps;
      this.videoElement.currentTime = this.startTime;
      this.videoElement.play();
      this.playing = true;
    } else {
      this.videoElement.currentTime = this.currentTime;
      this.videoElement.play();
    }

  }

  this.pause = function() {
    this.currentTime = this.videoElement.currentTime;
    this.videoElement.pause();
  }

  this.update = function() {
    if (this.stopTime != 0.0 && this.videoElement.currentTime > this.stopTime) {
      this.videoElement.currentTime = this.startTime;
    }
  }
  this.forward = function() {
    this.videoElement.currentTime += 1.0 / this.fps;
    this.currentTime = this.videoElement.currentTime;

  }
  this.rewind = function() {
    this.videoElement.currentTime -= 1.0 / this.fps;
    this.currentTime = this.videoElement.currentTime;
  }
  this.replay = function() {
    this.videoElement.currentTime = this.startTime;
    this.currentTime = this.videoElement.currentTime;
  }
  this.reset = function() {
    videoManager.videoElement.currentTime = 0.0;
    document.getElementById("video_startId").value = "";
    document.getElementById("video_stopId").value = "";
    this.videoElement.pause();
    this.playing = false;
  }
  this.getCurrentMoment = function() {
    return Math.floor(this.currentTime*this.fps);
  }
}
