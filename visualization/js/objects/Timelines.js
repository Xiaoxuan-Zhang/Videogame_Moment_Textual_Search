function Timeline() {
  this.timelineData = {};
  this.timeline_width = $( '.timeline-wrapper' ).width()* 0.9;
  this.height = 30;
  this.createTimeline = function(){
    //Tricky calculation for svg height
    var corpusNum = Object.keys(spriteManager.spriteGroups).length;
    this.height = $( '.timeline-wrapper' ).height()/corpusNum;
    for (corpus in spriteManager.spriteGroups) {
      if (!this.timelineData.hasOwnProperty(corpus)){
        var id = "#timeline-" + corpus;
        var elem = $(id);
        elem.html('');
        start = 0;
        stop = spriteManager.spriteGroups[corpus].children.length-1;
        start_spriteId = Number(spriteManager.spriteGroups[corpus].children[start].name);
        stop_spriteId = Number(spriteManager.spriteGroups[corpus].children[stop].name);

        this.timelineData[corpus] = [{"value": start, "name": spriteManager.spriteDictionary[start_spriteId].game + " " + spriteManager.spriteDictionary[start_spriteId].corpus, img: spriteManager.spriteDictionary[start_spriteId].image, radius: "6", momentId: start_spriteId},
        {"value": stop, "name": spriteManager.spriteDictionary[stop_spriteId].game + " " + spriteManager.spriteDictionary[stop_spriteId].corpus, img: spriteManager.spriteDictionary[stop_spriteId].image, radius: "6", momentId: stop_spriteId}];
        TimeKnots.draw(id, this.timelineData[corpus], {dateDimension:false, color: "#5c5c8a", width:this.timeline_width, height: this.height, showLabels: true, labelFormat: "%Y",lineWidth:2});
      }
    }
  }

  this.addTimeline = function(momentId, comments=null){
    var corpus = spriteManager.spriteDictionary[momentId].corpus;
    var momentIndex = spriteManager.spriteDictionary[momentId].momentIndex;
    var description = spriteManager.spriteDictionary[momentId].game + " " + spriteManager.spriteDictionary[momentId].corpus;
    if (momentIndex == 0 || momentIndex == (spriteManager.spriteGroups[corpus].children.length-1)) {
      for (var i =0; i < this.timelineData[corpus].length; i++){
        if (this.timelineData[corpus][i]["value"] == momentIndex) {
          this.timelineData[corpus][i]["comments"] = comments; //Only change comments
        }
      }
    } else {
      this.timelineData[corpus].push({"value": momentIndex, "name": description, "comments": comments, img: spriteManager.spriteDictionary[momentId].image,radius: "3", momentId: momentId});
    }
    for (corpus in spriteManager.spriteGroups) {
      var id = "#timeline-" + corpus;
      var elem = $(id);
      elem.html('');
      TimeKnots.draw(id, this.timelineData[corpus], {dateDimension:false, color: "#5c5c8a", width:this.timeline_width, height: this.height, showLabels: true, labelFormat: "%Y",lineWidth:2});
    }
  }

  this.deleteTimeline = function(momentId){
    var corpus = spriteManager.spriteDictionary[momentId].corpus;
    var momentIndex = spriteManager.spriteDictionary[momentId].momentIndex;
    for (var i =0; i < this.timelineData[corpus].length; i++) {
      if (this.timelineData[corpus][i]["value"] == momentIndex) {
        if (momentIndex == 0 || momentIndex == (spriteManager.spriteGroups[corpus].children.length-1)) {
          this.timelineData[corpus][i]["comments"] = ""; //Only change comments
        } else {
          this.timelineData[corpus].splice(i,1);
        }
      }
    }
    for (corpus in spriteManager.spriteGroups) {
      var id = "#timeline-" + corpus;
      var elem = $(id);
      elem.html('');
      TimeKnots.draw(id, this.timelineData[corpus], {dateDimension:false, color: "#5c5c8a", width:this.timeline_width, height: this.height, showLabels: true, labelFormat: "%Y",lineWidth:2});
    }
  }
  this.resizeTimeline = function()
  {
    var corpusNum = Object.keys(spriteManager.spriteGroups).length;
    this.height = $( '.timeline-wrapper' ).height()/corpusNum;
    this.timeline_width = $( '.timeline-wrapper' ).width() * 0.9;
    for (tm in this.timelineData) {
      var id = "#timeline-" + tm;
      var elem = $(id);
      elem.html('');
      var timeline = TimeKnots.draw(id, this.timelineData[tm], {dateDimension:false, color: "#5c5c8a", width:this.timeline_width, height: this.height, showLabels: true, labelFormat: "%Y",lineWidth:2});
    }
  }
}
