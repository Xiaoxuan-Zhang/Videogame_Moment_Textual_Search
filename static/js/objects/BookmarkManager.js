function BookmarkManager() {
  this.bookmarkList=[];
  this.bookmarkDict={};
  this.numberOfPages=0;
  this.currentPage=0;
  this.comments = {};
  this.timeLine = new Timeline();

  this.init = function() {
    this.timeLine.createTimeline();
  }
  this.addBookmark = function(momentId, comments=null) {
    if (!this.bookmarkDict.hasOwnProperty(momentId) ||
        this.comments[momentId] != comments) {  // or if modifying comments
      this.numberOfPages += 1;
      this.currentPage = this.numberOfPages - 1;
      this.bookmarkDict[momentId] = this.numberOfPages-1;
      this.bookmarkList[this.numberOfPages-1] = momentId;
      this.comments[momentId] = comments;
    }
    this.timeLine.addTimeline(momentId,comments);
  }
  this.removeBookmark = function(momentId) {
    if (this.bookmarkDict.hasOwnProperty(momentId)) {
      this.numberOfPages -= 1;
      this.currentPage = 0;
      delete this.bookmarkDict[momentId];
      for (var i = 0; i< this.bookmarkList.length; i++) {
        if (this.bookmarkList[i] == momentId) {
          this.bookmarkList.splice(i,1);
        }
      }
    }
    this.timeLine.deleteTimeline(momentId);
  }
  this.getLastBookmark = function() {
    this.momentId = null;
    if (this.currentPage > 0){
      this.currentPage -= 1;
    }
    if (this.currentPage < 0) {
      this.currentPage = 0;
    } else {
      this.momentId = this.bookmarkList[this.currentPage];
    }
    return this.momentId;
  }
  this.getNextBookmark = function() {
    this.momentId = null;
    if (this.currentPage < this.numberOfPages-1)
    {
      this.currentPage += 1;
    }
    if (this.currentPage > this.numberOfPages-1) {
      this.currentPage = this.numberOfPages-1;
    } else {
      this.momentId = this.bookmarkList[this.currentPage];
    }
    return this.momentId;
  }
  this.showBookmark = function(momentId) {
    g_currentTarget = Number(momentId);
    g_autoRotate = false;
    labelManager.showNearbyLabels(g_currentTarget, 0, true);
    urlManager.updateURL(URLKeys.MOMENT, g_currentTarget);
    g_lastSelected.object = spriteManager.spriteDictionary[g_currentTarget].object;
  }
  this.showBookmarkLabels = function() {
    if (this.bookmarkList.length == 0){
      return;
    }
    g_currentTarget = this.bookmarkList[0];
    for (var i= this.bookmarkList.length-1; i>= 0; i--){
      labelManager.showNearbyLabels(this.bookmarkList[i], 0, true);
    }
  }
  this.hideBookmarkLabels = function() {
    for (var key in this.bookmarkDict){
      labelManager.removeLabelFromScene(key);
    }
  }
  this.getBookmarks = function() {
    var bookmark_json = {};
    for (var key in this.bookmarkDict) {
      bookmark_json[key] = this.comments[key];
    }
    return bookmark_json;
  }
}
