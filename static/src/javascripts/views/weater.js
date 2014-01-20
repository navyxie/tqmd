define(function(require,exports,module){
    // var $ = require('jquery');
    var $ = require('zepto');
    var Animate = require('../vendors/animate');
    var _ = require('underscore');
    var BB = require('backbone');
    var weaterModel = require('../models/weater');
    var UTIL = require('../vendors/util'),LOAD = UTIL.LOAD;
    var getTpl = UTIL.TPL.get;
    var WINDOW = UTIL.WINDOW;
    var IMAGE = UTIL.IMAGE;
    var weaterView = BB.View.extend({
        className:'weaterViewContainer',
        template:_.template(getTpl.call(UTIL.TPL,'index')),
        initialize:function(){
            var self = this; 
            self.el = $(self.el); 
            self.htmlArr = [];
            self.weaterModel = new weaterModel();
            self.weaterModel.bind('change',self.render,this);  
            self.handlerEvent();      
        },
        events:{    
        },
        handlerEvent:function(e){
            var self = this;
            self.el.on('click','.pageBg,.weaterValInfo,.recommentText',function(e){
                var _this = $(this);
                if(_this.hasClass('pageBg')){
                    self.showRecomment();
                }else if(_this.hasClass('weaterValInfo') || _this.hasClass('recommentText')){
                    self.hideRecomment();
                }
            });
        },
        showRecomment:function(){
            var self = this;
            self.animateAuto.anim({x:0,y:-self.minData,z:0},200);
            self.animateAuto.setVVal(-self.minData);
            // self.recommentContainer.css({top:self.recommentContainer.attr('data-top')+'px'});
            // self.recommentContainer.animate({
            //     top:$(this).attr('data-top')
            // });
        },
        hideRecomment:function(){
            var self = this;
            self.animateAuto.anim({x:0,y:0,z:0},200);
            self.animateAuto.setVVal(0);
            // self.recommentContainer.css({top:self.recommentContainer.attr('data-bottom')+'px'});
            // self.recommentContainer.animate({
            //     top:$(this).attr('data-bottom')
            // });
        },
        render:function(){
            var self = this;
            var modelData = self.weaterModel.toJSON();
            var winW = WINDOW.getWidth();
            var winH = WINDOW.getHeight()-70;//顶部导航是70高度
            modelData.set = _.map(modelData.set,function(oneSet){
                var tempObj = {};
                var imgW = oneSet.ms.w;
                var imgH = oneSet.ms.h;               
                if(imgW/imgH <= winW/winH){
                    tempObj = IMAGE.autoResizeImage(winW,0,imgW,imgH);
                }else{
                    tempObj = IMAGE.autoResizeImage(0,winH,imgW,imgH);
                }                   
                oneSet.modelInfo = tempObj;
                return oneSet;
            });  
            modelData.winH = winH;
            modelData.winW = winW;     
            self.el.append(self.template(modelData));
            self.recommentContainer = self.el.find('.recommentContainer');
            var dataBottom = self.recommentContainer.attr('data-bottom');
            self.minData = dataBottom - 50;
            var containerHeight = self.recommentContainer.height();
            if(containerHeight < dataBottom){
                dataBottom = containerHeight;
            }else{
                dataBottom = containerHeight-195;//195 recommentContainer 默认显示的高度->weaterTextInfo+weaterValInfo+recommentText
            }
            self.animateAuto = new Animate.AnimateAuto(self.recommentContainer,{vmax:0,vmin:-dataBottom,direction:'v',endCbf:function(hv,vv,direction){
                if(vv >= -100){
                    this.anim({x:0,y:0,z:0},200);
                    this.setVVal(0);                  
                }
            }}); 
            setTimeout(function(){
                self.el.find('.moveLine').addClass('moveLineActive').css({width:'100%'}).removeClass('moveLineActive');               
            },20);        
            return self;          
        },
        fetchData:function(data,cbf){
            var self = this;
            LOAD.show();
            self.weaterModel.fetch({
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
        }
    });
    module.exports = weaterView;
});