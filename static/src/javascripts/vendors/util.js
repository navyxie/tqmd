define(function(require, exports, module){
    // var $ = require('jquery');
    var $ = require('zepto');
    var _ = require('underscore');
    function isType(object,type){
        type = type || 'string';
        if(typeof(type) !== 'string'){
            throw new Error('type must be string');
        }
        return Object.prototype.toString.call(object).slice(8,-1).toLowerCase() === type.toLowerCase();
    }
    var UTIL = {};
    UTIL.TPL = {
        templates:{},
        loadTemplates:function(names,cbf){
            if(isType(names,'string')){
                names = [names];
            }
            if(!isType(names,'array')){
                throw new Error('templateName must be array or string');
            }
            var self = this;
            var tplLength = names.length;
            var loadTemplate = function(index){
                var name = names[index];
                if(self.templates[name] === undefined){
                    $.get('./static/src/javascripts/tpls/'+name+'.html',function(data){
                        self.templates[name] = data;
                        if(++index < tplLength){
                            loadTemplate(index);
                        }else{
                            cbf();
                        }
                    });
                }else{
                    if(++index < tplLength){
                        loadTemplate(index);
                    }else{
                        cbf();
                    }            
                }
            };
            loadTemplate(0);
        },
        get:function(name){
            return this.templates[name];
        }
    };
    UTIL.LOAD = {
        show:function(){
            $('#gloabLoading').show();
        },
        hide:function(){
            $('#gloabLoading').hide();
        }
    };
    UTIL.LOG = (window.console || {} ).log || function(){};
    UTIL.isType = isType;
    UTIL.getHash = function(){
        var hashVal = window.location.hash;
        if(hashVal){
            hashVal = hashVal.slice(1);
        }
        return hashVal;
    }
    UTIL.noop = function(){};
    UTIL.WINDOW = {
        getWidth:function(){
            return $(window).width();
        },
        getHeight:function(){
            return $(window).height();
        }
    }
    UTIL.IMAGE = {
        //http://www.cnblogs.com/xiaochaohuashengmi/archive/2010/06/01/1749571.html
        autoResizeImage:function(maxWidth,maxHeight,orignWidth,orignHeight){
            var hRatio;
            var wRatio;
            var Ratio = 1;
            wRatio = maxWidth / orignWidth;
            hRatio = maxHeight / orignHeight;
            if (maxWidth === 0 && maxHeight === 0){
                Ratio = 1;
            }else if (maxWidth === 0){
                if (hRatio < 1){
                    Ratio = hRatio;
                }
            }else if (maxHeight === 0){
                if (wRatio <1 ){
                    Ratio = wRatio;
                }
            }else if (wRatio < 1 || hRatio < 1){
                Ratio = ( wRatio <= hRatio ? wRatio : hRatio);
            }
            if (Ratio<1){
                orignWidth = orignWidth * Ratio;
                orignHeight = orignHeight * Ratio;
            }else{
                Ratio = ( wRatio <= hRatio ? hRatio : wRatio);
                orignWidth = orignWidth * Ratio;
                orignHeight = orignHeight * Ratio;
            }
            return {width:orignWidth,height:orignHeight}
        }
    }
    module.exports = UTIL;
});