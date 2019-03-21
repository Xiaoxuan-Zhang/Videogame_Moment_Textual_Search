var Server = function () {
  var self = this;
  this.game = "";
  this.url = SERVER_URL;
  this.results = undefined;

  this.loadGame = function(game) {
    let url = this.url + 'game';
    var input_data = {
  		text: game
  	};
  	$.ajax({
  		url: url,
  		type: "POST",
  		data: input_data,
  		success: function(result){
  		  console.log(result);
        presetTextbox(result);
  		},
  		error: function(error) {
  		  console.log(error);
  		}
  	})
  }
  this.textualSearch = function(text) {
    let url = this.url + 'data';
    let input = {};
    input["text"] = text;
    input["top_n"] = 20;
    let input_str = JSON.stringify(input);
    var input_data = {
      text: input_str
    };
    $.ajax({
      url: url,
      type: "GET",
      data: input_data,
      beforeSend: function() {
        $('#loader-ajax').show();
      },
      complete: function() {
        $('#loader-ajax').hide();
      },
      success: function(result){
        console.log("Results received.");
        obj_rst = JSON.parse(result);
        self.results = obj_rst;
        showMomentSlider(obj_rst);
      },
      error: function(error) {
        console.log(error);
      }
    })

  }

}
