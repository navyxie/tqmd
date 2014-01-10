define(function(require, exports, module){
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
    module.exports = UTIL;
});