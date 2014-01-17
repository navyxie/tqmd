define(function(require, exports, module){
    // var $ = require('jqmobile');
    var $ = require('zepto');
    var BB = require('backbone');
    var UI = require('../vendors/ui');
    var PAGE = UI.PAGE;   
    var navObjs = null,isReady = false;
    var pageList = {};
    var workSpace = BB.Router.extend({
        routes:{
            '':'index',
            'index':'index',
            'trend':'trend',
            'dynamic':'dynamic',
            'clock':'clock',
            'myself':'myself'
        },
        index:function(){
            PAGE.showPage('index');
            updateNav('index');
        },
        trend:function(){
            PAGE.showPage('trend');
            updateNav('trend');
        },
        dynamic:function(){
            PAGE.showPage('dynamic');
            updateNav('dynamic');
        },
        clock:function(){
            PAGE.showPage('clock');
            updateNav('clock');
        },
        myself:function(){
            PAGE.showPage('myself');
            updateNav('myself');
        }
    });
    var updateNav = function(pageId){
        if(!navObjs.length){
            return;
        }
        if(!isReady){
            isReady = true;
            pageList = {
                index:navObjs.eq(0),
                trend:navObjs.eq(1),
                dynamic:navObjs.eq(2),
                clock:navObjs.eq(3),
                myself:navObjs.eq(4)
            }
        }       
        navObjs.removeClass('selected');
        pageList[pageId].addClass('selected');
    }
    var getNavObj = function(){
        navObjs = $('#indexNav');
        if(!navObjs.length){
            var setIntervalFlag = setInterval(function(){
                if($('#indexNav').length){
                    navObjs = $('#indexNav').find('.linkItem');
                    clearInterval(setIntervalFlag);
                }
            },200);
        }else{
            navObjs = navObjs.find('.linkItem');
        }
    }
    var initialize = function(){
        new workSpace;
        getNavObj();
        BB.history.start();
    }
    module.exports = initialize;
})  