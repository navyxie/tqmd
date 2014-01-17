define(function(require,exports,module){
    var $ = require('zepto');
    // var $ = require('jqmobile');
    var BB = require('backbone');
    var weaterView = require('./weater');
    var UI = require('../vendors/ui');
    var LINKS = UI.LIST.LINKS;
    var appView = BB.View.extend({
        className:'appViewContainer',
        initialize:function(){
            var self = this; 
            self.el = $(self.el);   
            self.weaterViewInit = new weaterView({el:'#currentWeaterContainer'});     
            self.render();       
        },
        el:'body',
        events:{          
            'click #sendCityBtn':'handerSearch',
            'click #searchCityWeaterContainer':'hide'          
        },
        render:function(){
            var self = this;
            new LINKS(
                {
                    container:'#indexNav',
                    isNav:true,
                    links:[
                        {'text':'今天','class':'nav1',link:'#index'},
                        {'text':'趋势','class':'nav2',link:'#trend'},
                        {'text':'动态','class':'nav3',link:'#dynamic'},
                        {'text':'闹钟','class':'nav4',link:'#clock'},
                        {'text':'我','class':'nav5',link:'#myself'}
                    ]
                }
            );
            return self;
        },
        handerSearch:function(){
            var self = this;
            if(self.searchWeaterViewInit){
                self.searchWeaterViewInit.$el.html('');
                self.searchWeaterViewInit.delegateEvents();
            }
            self.searchWeaterViewInit = new weaterView({el:'#searchCityWeaterContainer'});
            self.searchWeaterViewInit.fetchData(
                {city:$('#userCity').val()},
                function(err,data){
                    if(err){
                        console.log(err);
                    }else{
                        $('#userCity').val('');
                        console.log('获取数据成功');
                    }   
                }
            );
            $('#searchCityWeaterContainer').show();
        },
        hide:function(){
            $('#searchCityWeaterContainer').hide();
        }
    });
    module.exports = appView;
});