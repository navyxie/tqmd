define(function(require, exports, module){
    var $ = require('zepto');
    function noop (){
        // body...
    }
    function translate(styleObj,dist,speed){
        dist = dist || {x:0,y:0,z:0};
        speed = speed || 0;
        styleObj.transitionDuration = speed + 'ms';
        styleObj.webkitTransform = 'translate(' + dist.x + 'px,'+dist.y+'px)' + 'translateZ('+dist.z+'px)';
    }
    function moveDirection(x1, x2, y1, y2) {
        var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
        return xDelta >= yDelta ? (x1 - x2 > 0 ? 'left' : 'right') : (y1 - y2 > 0 ? 'up' : 'down')
    }
    function AnimateCore(obj,opt){
        opt = opt || {};
        opt.space = opt.space|| 1;
        opt.startcbf = opt.startcbf || noop;
        opt.hcbf = opt.hcbf || noop;
        opt.vcbf = opt.vcbf || noop;
        opt.endcbf = opt.endcbf || noop;
        opt.cancelcbf = opt.cancelcbf || noop;
        opt.context = opt.context || undefined;
        this.opt = opt;
        this.obj = $(obj);
        this.touch = {};
        this.deltaX = 0;
        this.deltaY = 0;
        this.moveVal = 0;
        this.moveDirection = null;
        this.isScrolling = 0;//-1为水平方向，1为垂直方向
        this.init();
    }
    AnimateCore.prototype = {
        constructor:AnimateCore,
        init:function() {
            this.initEvent();
        },
        initEvent:function(){
            var self = this;
            var opt = self.opt;
            this.obj.on('touchstart',function(e){
                e = e.touches[0];
                self.touch.x1 = e.pageX,self.touch.y1 = e.pageY; 
                opt.startcbf.call(opt.context,self.touch.x1,self.touch.y1);       
            }).on('touchmove',function(e){
                e.preventDefault();
                e.stopPropagation();
                e = e.touches[0];
                self.touch.x2 = e.pageX,self.touch.y2 = e.pageY;
                self.deltaX = self.touch.x2 - self.touch.x1;
                self.deltaY = self.touch.y2 - self.touch.y1;
                if((self.deltaY % opt.space) === 0 || (self.deltaX % opt.space) === 0){
                    self.moveDirection = moveDirection(self.touch.x1,self.touch.x2,self.touch.y1,self.touch.y2);
                    if((self.moveDirection === 'up' || self.moveDirection === 'down')){
                        if(self.isScrolling !== -1){
                            self.isScrolling = 1;
                            opt.vcbf.call(opt.context,self.deltaY,self.moveDirection);
                        }
                        
                    }else if((self.moveDirection === 'left' || self.moveDirection === 'right')){
                        if(self.isScrolling !== 1){
                            self.isScrolling = -1;
                            opt.hcbf.call(opt.context,self.deltaX,self.moveDirection);
                        }                   
                    }
                }
                return false;
            }).on('touchend',function(e){
                opt.endcbf.call(opt.context,self.deltaX,self.deltaY,self.isScrolling);
                self.cancelAll();
            }).on('touchcancel',function(e){
                opt.cancelcbf.call(opt.context,self.deltaX,self.deltaY,self.isScrolling);
                self.cancelAll();
            });
        },
        cancelAll:function(){  
            var self = this;    
            self.touch = {};
            self.moveDirection = null; 
            self.deltaX = 0;
            self.deltaY = 0;
            this.isScrolling = 0;
        }
    }

    function AnimateAuto (obj,opt) {
        opt = opt || {};
        opt.hmax = opt.hmax || 0;
        opt.hmin = opt.hmin || 0;
        opt.vmax = opt.vmax || 0;
        opt.vmin = opt.vmin || 0;
        opt.space = opt.space|| 1;
        opt.endCbf = opt.endCbf || noop;
        opt.direction = opt.direction || undefined;
        this.opt = opt;
        this.obj = $(obj);  
        this.touch = {};
        this.deltaX = 0;
        this.deltaY = 0;
        this.moveHVal = opt.moveHVal || 0;
        this.moveVVal = opt.moveVVal || 0;
        this.preHMoveVal = opt.preHMoveVal || 0;
        this.preVMoveVal = opt.preVMoveVal || 0;
        this.style = this.obj[0].style;
        this.init();
    }
    AnimateAuto.prototype = {
        constructor:AnimateAuto,
        init:function(){
            var self = this;
            var opt = self.opt;
            var tempOpt = {
                space : opt.space,
                endcbf:self.endCbf,
                context:self
            };
            if(opt.direction === 'h'){
                tempOpt.hcbf = self.hCbf;
            }else if(opt.direction === 'v'){
                tempOpt.vcbf = self.vCbf;
            }else{
                tempOpt.hcbf = self.hCbf;
                tempOpt.vcbf = self.vCbf;
            }
            new AnimateCore(self.obj,tempOpt);      
            // self.animateCore = new AnimateCore(self.obj,tempOpt);
        },
        hCbf:function(delta,direction){
            var self = this;
            var opt = self.opt;
            if(self.moveHVal <= opt.hmax && self.moveHVal >= opt.hmin){
                self.anim({x:Math.min(opt.hmax,Math.max(opt.hmin,self.preHMoveVal+delta)),y:self.moveVVal,z:0}); 
            }      
        },
        vCbf:function(delta,direction){
            var self = this;
            var opt = self.opt;
            if(self.moveVVal <= opt.vmax && self.moveVVal >= opt.vmin){
                self.anim({x:self.moveHVal,y:Math.min(opt.vmax,Math.max(opt.vmin,self.preVMoveVal+delta)),z:0}); 
            }
        },
        endCbf:function(deltaX,deltaY,scrollVal){
            //scrollVal -1为水平方向，1为垂直方向
            var self = this;
            var opt = self.opt;
            if(scrollVal === -1){
                self.moveHVal += deltaX;
                self.moveHVal = Math.min(opt.hmax,Math.max(opt.hmin,self.moveHVal));           
                self.preHMoveVal = self.moveHVal;
            }else if(scrollVal === 1){
                self.moveVVal += deltaY;  
                self.moveVVal = Math.min(opt.vmax,Math.max(opt.vmin,self.moveVVal));
                self.preVMoveVal = self.moveVVal;      
            }
            opt.endCbf.call(self,self.moveHVal,self.moveVVal,scrollVal);
        },
        anim:function(dist,speed) {
            speed = speed || 0;
            translate(this.style,dist,speed);
        },
        setHVal:function(val){
            this.moveHVal = this.preHMoveVal = val;
        },
        setVVal:function(val){
            this.moveVVal = this.preVMoveVal = val;
        },
        stopAnim:function(){
            this.style.webkitAnimationPlayState = this.style.animationPlayState = 'paused';
        },
        startAnim:function(){
            this.style.webkitAnimationPlayState = this.style.animationPlayState = 'running';
        }
    }
    function AnimateAlbum (argument) {
        // body...
    }
    module.exports = {
        AnimateCore:AnimateCore,
        AnimateAuto:AnimateAuto,
        AnimateAlbum:AnimateAlbum
    }
});