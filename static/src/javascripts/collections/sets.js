define(function(require,exports,module){
    var BB = require('backbone');
    var baseUrl = window.appConfig.appHost+'/app/index';
    var setsModel = require('../models/sets');
    var setsCollection = BB.Collection.extend({
        urlRoot:baseUrl,
        url:baseUrl,
        model:setsModel,
        parse:function(response){
            return response.result;
        }
    });
    module.exports = setsCollection;
});