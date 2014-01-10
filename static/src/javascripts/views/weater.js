define(function(require,exports,module){
    var $ = require('zepto');
    var _ = require('underscore');
    var BB = require('backbone');
    var weatherItemView = require('./weateritem');
    var weaterModel = new (require('../models/weater'));
    var weaterItemCollection = new (require('../collections/weateritem'));
    var initCurWeaterItemModel = new (require('../models/curweateritem'));
    var curWeatherItemView = require('./curweateritem');  
    var UTIL = require('../vendors/util'),LOAD = UTIL.LOAD;
    var weaterView = BB.View.extend({
        className:'weaterViewContainer',
        initialize:function(){
            var self = this; 
            self.el = $(self.el);   
            self.htmlArr = [];
            weaterModel.bind('change',self.render,this);        
        },
        el:'#weaterWrapper',
        events:{          
        },
        render:function(){
            var self = this;
            self.el.append(self.makeHtml(weaterModel.toJSON()));
            console.log(self.htmlArr.join(''));
            return self;          
        },
        fetchData:function(data,cbf){
            LOAD.show();
            weaterModel.fetch({
                data:data,
                success:function(){
                    LOAD.hide();
                    cbf(null,arguments);
                },
                error:function(){
                    LOAD.hide();
                    cbf({msg:'获取天气数据失败'},arguments);
                }
            });
        },
        makeHtml:function(data){
            var self = this;
            self.htmlArr.push('<div class="cityContainer"><span class="cityText">'+data.city+'</span></div>');
            initCurWeaterItemModel.set(data.weather.current);
            weaterItemCollection.add(data.weather.forecast);
            self.addCurWeaterItem(initCurWeaterItemModel);
            self.addForecastAll();
            return self.htmlArr.join('');
        },
        addForecastOne:function(model){
            var self = this;
            var initWeatherItemView = new weatherItemView({model:model});
            self.htmlArr.push(initWeatherItemView.getHtml());
        },
        addForecastAll:function(){
            var self = this;
            weaterItemCollection.each(function(){
                self.addForecastOne.apply(self,arguments);
            })
        },
        addCurWeaterItem:function(model){
            var self = this;
            var initCurWeatherItemView = new curWeatherItemView({model:model});
            self.htmlArr.push(initCurWeatherItemView.getHtml());
        }
    });
    module.exports = weaterView;
});