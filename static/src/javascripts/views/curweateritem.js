define(function(require,exports,module){
    var UTIL = require('../vendors/util');
    var TPL = UTIL.TPL;
    var getTpl = UTIL.TPL.get;
    var _ = require('underscore');
    var $ = require('jquery');
    var BB = require('backbone');
    var weaterItemView = BB.View.extend({
        className:'weaterViewContent',
        template:_.template(getTpl.call(UTIL.TPL,'curweateritem')),
        initialize:function(){
            var self = this; 
            self.el = $(self.el);               
        },
        events:{          
        },
        render:function(){
            return this;
        },
        getHtml:function(){
            return this.makeHtml();
            
        },
        makeHtml:function(){
            var data = this.model.toJSON();
            return this.template(data);
        }
    });
    module.exports = weaterItemView;
});