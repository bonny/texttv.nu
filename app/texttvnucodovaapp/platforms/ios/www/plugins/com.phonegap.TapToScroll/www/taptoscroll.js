cordova.define("com.phonegap.TapToScroll.TapToScroll", function(require, exports, module) { 

var exec = require('cordova/exec');

var TapToScroll = function() {
	exec(null, null, "TapToScroll", "initListener",[]);  
}

module.exports = new TapToScroll();

});
