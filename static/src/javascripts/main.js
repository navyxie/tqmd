define(function(require,exports,module){
    // var $ = require('jqmobile');
    var $ = require('zepto');
    // $.mobile.linkBindingEnabled = false;
    // $.mobile.hashListeningEnabled = false;
    $(document).on("ready",function(){
        var UTIL = require('./vendors/util');
        var ROUTERS = require('./routers/app');
        var TPL = UTIL.TPL;
        TPL.loadTemplates(['weateritem','curweateritem','sets','index'],function(){        
            var BB = require('backbone');
            var appView = require('./views/app'); 
            var appViewInit = new appView(); 
            new ROUTERS();
            if(navigator.geolocation){
                getWeaterInfo({city:"广州"});
            }
            function getWeaterInfo(data){
                data = data || {};
                appViewInit.weaterViewInit.fetchData(
                    data,
                    function(err,data){
                        if(err){
                            console.log(err);
                        }else{
                            console.log('成功获取天气信息');
                        }
                    }
                );          
            } 
            function getGeoLocation(onSuccess,onError){
                 navigator.geolocation.getCurrentPosition(onSuccess,onError);
            }     
            function getGeoSuccess(position){
                var coords = position.coords;
                getWeaterInfo({lat:coords.latitude,lng:coords.longitude});
            }   
            function getGeoError(){
                getWeaterInfo();
            }              
            if(!window.appConfig.debug){
                //require.async 实际上调用的是seajs.use 方法
                seajs.use(['cordova','toast','kalengo'],function(cordova,toast,kalengo){
                    var exitFlag = 0;
                    document.addEventListener("deviceready", onDeviceReady, false);
                    function onDeviceReady() {
                    // 注册回退按钮事件监听器
                        document.addEventListener("backbutton", onBackKeyDown, false); //返回键                    
                        hideSplash();
                    } 
                    function onBackKeyDown(){
                        if(UTIL.getHash() === 'index' || UTIL.getHash() === ''){
                            if(exitFlag < 1){
                                toast.plugins.ToastPlugin.ShowToast('再按一次退出程序',3000);
                                exitFlag++;
                            }else if(exitFlag === 1){
                                onConfirm();
                            }                    
                        }else{
                            exitFlag = 0;
                            if (typeof (navigator.app) !== "undefined") {
                                navigator.app.backHistory();
                            } else {
                                window.history.back();
                            }
                        } 
                    }
                    function onConfirm(){
                        navigator.app.exitApp(); //退出app
                    }  
                    function hideSplash(){
                        navigator.splashscreen.hide();
                    } 
            
                });
            }          
        });
    });
});