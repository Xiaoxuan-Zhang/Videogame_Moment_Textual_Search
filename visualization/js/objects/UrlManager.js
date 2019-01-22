URLKeys = {
  MOMENT: "moment_id",
  POSITION: "position",
  CORPORA: "corpora",
  GAME: "game",
  BOOKMARK: "bookmarks",
  DIMENSION: "dimension"
}

function UrlManager() {
  this.bookmarks = {};
  this.urlParams = {game: null, corpora: null, dimension: null, moment_id: null, position: null, bookmarks: null}; //latest url

  // tsnemap.html#game=metroid;corpora=algorithm,human;moment_id=555;position=5,6,2
  this._getUrlString = function(params) {
    var urlString = "#";
    var stringParams = {}
    // only process recognized keys
    if (URLKeys.GAME in params) { stringParams[URLKeys.GAME] = params[URLKeys.GAME]; };
    if (URLKeys.CORPORA in params && params[URLKeys.CORPORA] != null) {
      if (params[URLKeys.CORPORA].length > 1) {
        stringParams[URLKeys.CORPORA] = params[URLKeys.CORPORA].join(',');
      } else {
        stringParams[URLKeys.CORPORA] = params[URLKeys.CORPORA];
      }
    }
    else {
      stringParams[URLKeys.CORPORA] = null;
    };
    if (URLKeys.DIMENSION in params) {stringParams[URLKeys.DIMENSION] = params[URLKeys.DIMENSION]};
    if (URLKeys.MOMENT in params) {stringParams[URLKeys.MOMENT] = params[URLKeys.MOMENT]};
    if (URLKeys.POSITION in params) {
      stringParams[URLKeys.POSITION] = params[URLKeys.POSITION].join(',');
    };
    if (URLKeys.BOOKMARK in params) {
      stringParams[URLKeys.BOOKMARK] = params[URLKeys.BOOKMARK];
    };
    for (key in stringParams) {
      urlString += key + "=" + stringParams[key] + ';'
    }
    return urlString;
  }

  this.getRootURL = function() {
    return window.location.host + window.location.pathname ;
  }

  this.getCurrentURL = function() {
    return window.location.href;
  }

  this._updateUrlParams = function() {
    this.urlParams = this.parseURL(this.getCurrentURL());
  }

  this._writeURL = function(urlString) {
    history.replaceState({},"",urlString);
  }

  this.updateURL = function(key, value=null) {
    this._updateUrlParams();
    if (key == URLKeys.POSITION) {
      this.urlParams[URLKeys.POSITION] = value;
    } else {
      this.urlParams[URLKeys.POSITION] = camera.position.toArray();
    }
    if (key == URLKeys.CORPORA) {
      this.urlParams[URLKeys.CORPORA] = value;
    } else {
      this.urlParams[URLKeys.CORPORA] = Object.keys(spriteManager.spriteGroups);
    }
    if (key == URLKeys.MOMENT) {
      this.urlParams[URLKeys.MOMENT] = value;
    }
    if (key == URLKeys.BOOKMARK) {
      var str = JSON.stringify(value);
      this.urlParams[URLKeys.BOOKMARK] = encodeURI(str);
    }
    var urlString = this._getUrlString(this.urlParams);
    this._writeURL(urlString);
  }

  this.parseURL = function(url) {
    var paramsString = url.substr(url.indexOf('#'));
    var paramsArr = paramsString.replace('#', '').replace(/%20/g, ' ').split(';');
    var params = {};

    for (i in paramsArr) {
      itemArr = paramsArr[i].split('=');
      if (itemArr.length > 1) {
        if (itemArr[1].indexOf(',') != -1) {
          params[itemArr[0]] = itemArr[1].split(',');
        } else {
          params[itemArr[0]] = [itemArr[1]];
        }
      }
    }
    if (params[URLKeys.POSITION] != undefined || params[URLKeys.POSITION] != null ){
      var floatArray = [];
      for (var i = 0; i < params[URLKeys.POSITION].length; i++)
      {
        floatArray[i] = parseFloat(params[URLKeys.POSITION][i]); //convert string to float
      }
      params[URLKeys.POSITION] = floatArray;
    }
    return params;
  }

  this.getBookmarkUrl = function() {

  }
}
