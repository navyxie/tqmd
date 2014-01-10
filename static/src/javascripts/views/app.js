define(function(require,exports,module){
    var $ = require('zepto');
    var BB = require('backbone');
    var weaterView = require('./weater');
    var appView = BB.View.extend({
        className:'appViewContainer',
        initialize:function(){
            var self = this; 
            self.el = $(self.el);   
            self.weaterViewInit = new weaterView();     
            self.render();       
        },
        el:'body',
        events:{          
        },
        render:function(){
            var self = this;
            return self;
        }
    });
    module.exports = appView;
});