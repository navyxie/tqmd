define(function(require,exports,module){
    var BB = require('backbone');
    var baseUrl = window.appConfig.appHost+'/app/index';
    var weaterItemModel = require('../models/weateritem');
    var weaterCollection = BB.Collection.extend({
        urlRoot:baseUrl,
        url:baseUrl,
        model:weaterItemModel,
        parse:function(response){
            return response.result;
        }
    });
    module.exports = weaterCollection;
});