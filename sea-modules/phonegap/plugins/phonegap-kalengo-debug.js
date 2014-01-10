//http://blog.sina.com.cn/s/blog_c2918c770101bf1u.html
//window.plugins.ToastPlugin.ShowToast('通讯录',3000);
//第一个参数为显示的内容，第二个参数是显示的时间，单位ms
define('sea-modules/phonegap/plugins/phonegap-kalengo-debug',['sea-modules/phonegap/cordova/cordova-debug'],function(require,exports,module){
	var cordova = require('sea-modules/phonegap/cordova/cordova-debug');
	var kalengo = function(){};
	kalengo.prototype = {
	        showSetting:function(){
	        	length = length || 3000;
	            return cordova.exec(null, null,"KalengoPlugin","setting",[]);
	        }
	};
	cordova.addConstructor(function(){
		if (cordova.addPlugin) {
            cordova.addPlugin("KalengPlugin", new kalengo());
        }else{
    		if(!cordova.plugins){
    			cordova.plugins = {};        	
    		}
    		cordova.plugins.KalengPlugin = new kalengo();  
        }    
	});
	module.exports = cordova;
})