define(function(require, exports, module){
    var $ = require('zepto');
    function noop (){
        // body...
    }
    // css3 translate
    function translate(styleObj,dist,speed){
        dist = dist || {x:0,y:0,z:0};
        speed = speed || 0;
        styleObj.transitionDuration = speed + 'ms';
        styleObj.webkitTransform = 'translate(' + dist.x + 'px,'+dist.y+'px)' + 'translateZ('+dist.z+'px)';
    }
    // touch move direction
    function moveDirection(x1, x2, y1, y2) {
        var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
        return xDelta >= yDelta ? (x1 - x2 > 0 ? 'left' : 'right') : (y1 - y2 > 0 ? 'up' : 'down')
    }
    // css3 animatecore
    /**
     * [AnimateCore description]
     * @param {[type]} obj [$对象]
     * @param {[type]} opt [opt]
     */
    function AnimateCore(obj,opt){
        opt = opt || {};
        opt.space = opt.space|| 1;// trigger touch move event move value
        opt.startcbf = opt.startcbf || noop;// touch start callback
        opt.hcbf = opt.hcbf || noop;//touch move Horizontal callback
        opt.vcbf = opt.vcbf || noop;//touch move Vertical callback
        opt.endcbf = opt.endcbf || noop;// touch move end callback
        opt.cancelcbf = opt.cancelcbf || noop; //touch move cancel callback
        opt.context = opt.context || undefined; //all touch event callback(like startcbf,hcbf.) context
        this.opt = opt;
        this.obj = $(obj);
        this.touch = {};
        this.deltaX = 0;//Horizontal move value
        this.deltaY = 0;//Vertical move value
        this.moveDirection = null;//move direction,left,right,up,down
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
                e = e.touches[0];//touch event
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
                        //Vertical move
                        if(self.isScrolling !== -1){
                            self.isScrolling = 1;
                            opt.vcbf.call(opt.context,self.deltaY,self.moveDirection);
                        }                      
                    }else if((self.moveDirection === 'left' || self.moveDirection === 'right')){
                        //Horizontal move
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
    /**
     * [AnimateAuto description]
     * @param {[type]} obj [$对象]
     * @param {[type]} opt [opt]
     */
    function AnimateAuto (obj,opt) {
        opt = opt || {};
        opt.hmax = opt.hmax || 0;//Horizontal move max value
        opt.hmin = opt.hmin || 0;//Horizontal move min value
        opt.vmax = opt.vmax || 0;//Vertical move max value
        opt.vmin = opt.vmin || 0;//Vertical move min value
        opt.space = opt.space|| 1;//trigger touch move event move value
        opt.endCbf = opt.endCbf || noop;// touch end callback
        opt.direction = opt.direction || undefined;//touch move direction,Horizontal,Vertical,or all.
        this.opt = opt;
        this.obj = $(obj);  
        this.moveHVal = opt.moveHVal || 0;//Horizontal moved value
        this.moveVVal = opt.moveVVal || 0;//Vertical moved value
        this.preHMoveVal = opt.preHMoveVal || 0;// pre Horizontal moved value
        this.preVMoveVal = opt.preVMoveVal || 0;// pre Vertical moved value
        this.style = this.obj[0].style;// dom style obj
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
    function AnimateAlbum (obj,opt) {
        opt = opt || {};
        opt.max = opt.max || 50;
        opt.min = opt.min || 0;
        opt.space = opt.space|| 1;
        opt.endCbf = opt.endCbf || noop;
        opt.direction = opt.direction || 'h';
        opt.marginR = opt.marginR || 0;
        opt.subElem = opt.subElem || 'li';
        opt.index = opt.index || 0;
        this.opt = opt;
        this.obj = $(obj); 
        this.index = opt.index;
        this.subObjs = this.obj.find(opt.subElem);
        this.itemLen = this.subObjs.length;
        this.moveVal = opt.moveVal || 0;
        this.preMoveVal = opt.preMoveVal || 0;
        this.style = this.obj[0].style;
        this.init();
    }
    AnimateAlbum.prototype = {
        constructor:AnimateAlbum,
        init:function(){
            var opt = this.opt;
            this.obj.wrapAll('<div class="animateWrap" style="width:100%;height:100%;overflow: hidden;"></div>');
            this.wrapObj = this.obj.parent();
            this.itemWidth = this.wrapObj.width() ? this.wrapObj.width() : $(window).width();
            this.itemHeight = this.wrapObj.height() ? this.wrapObj.height() : $(window).height();
            var maxVal = 0;
            if(opt.direction === 'h'){
                maxVal = (this.itemLen)*(this.itemWidth+opt.marginR)-opt.marginR;
                this.obj.css({width:maxVal+'px',height:'100%','overflow-y':'hidden'});
            }else{
                maxVal = (this.itemLen)*(this.itemHeight+opt.marginR)-opt.marginR;
                this.obj.css({height:maxVal+'px',width:'100%','overflow-x':'hidden'});
            }
            opt.min = -(maxVal-(opt.direction === 'h' ? this.itemWidth : this.itemHeight)+50);
            this.initItem();
            this.show(opt.index);  
            var tempOpt = {
                space : opt.space,
                endcbf:this.endCbf,
                context:this
            };
            if(opt.direction === 'h'){
                tempOpt.hcbf = this.moveCbf;
            }else if(opt.direction === 'v'){
                tempOpt.vcbf = this.moveCbf;
            }
            new AnimateCore(this.obj,tempOpt);          
        },
        initItem:function(){
            var opt = this.opt;
            var parentWidth = this.itemWidth;
            var parentHeight = this.itemHeight;
            this.subObjs.each(function(index){
                var _this = $(this);
                if(opt.direction === 'h'){
                    _this.css({'float':'left','width':parentWidth+'px','height':'100%'});
                }else{
                    _this.css({'height':parentHeight+'px','width':'100%'});
                }
            });
        },
        moveCbf:function(delta,direction){
            var self = this;
            var opt = self.opt;
            if(self.moveVal <= opt.max && self.moveVal >= opt.min){
                if(opt.direction === 'h'){
                    self.anim({x:Math.min(opt.max,Math.max(opt.min,self.preMoveVal+delta)),y:0,z:0}); 
                }else{
                    self.anim({x:0,y:Math.min(opt.max,Math.max(opt.min,self.preMoveVal+delta)),z:0}); 
                }                
            }   
        },
        endCbf:function(deltaX,deltaY,scrollVal){
            //scrollVal -1为水平方向，1为垂直方向
            var self = this;
            var opt = self.opt;
            var speed = 200;
            var delta = deltaX;
            if(opt.direction === 'v'){
                delta = deltaY;
            }
            if(delta < 0){
                //move left or up
                if(Math.abs(delta) >= 20){
                    self.next(speed);
                }else{
                    self.current(speed);
                }
            }else{
                // move right or down
                if(Math.abs(delta) >= 20){
                    self.pre(speed);                   
                }else{
                    self.current(speed);
                }               
            }
            opt.endCbf.call(self,self.moveVal,scrollVal,self.index);
        },
        anim:function(dist,speed) {
            speed = speed || 0;
            translate(this.style,dist,speed);
        },
        show:function(index,speed){
            speed = speed || 0;
            index = Math.min(this.itemLen-1,Math.max(index,0));
            var opt = this.opt;
            var moveVal = -index*(this.itemWidth+opt.marginR);
            if(opt.direction === 'v'){
                moveVal = -index*(this.itemHeight+opt.marginR);
                this.anim({x:0,y:moveVal,z:0},speed);
            }else{
                this.anim({x:moveVal,y:0,z:0},speed);              
            }
            this.index = index;
            this.setVal(moveVal);
        },
        pre:function(speed){
            speed = speed || 0;
            this.show(--(this.index),speed);
        },
        next:function(speed){
            speed = speed || 0;
            this.show(++(this.index),speed);
        },
        first:function(speed){
            speed = speed || 0;
            this.show(0,speed);
        },
        last:function(speed){
            speed = speed || 0;
            this.show(this.itemLen-1,speed);
        },
        current:function(speed){
            speed = speed || 0;
            this.show(this.index,speed);
        },
        setVal:function(val){
            this.moveVal = this.preMoveVal = val;
        }
    }
    module.exports = {
        AnimateCore:AnimateCore,
        AnimateAuto:AnimateAuto,
        AnimateAlbum:AnimateAlbum
    }
});