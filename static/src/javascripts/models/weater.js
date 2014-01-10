define(function(require,exports,module){
    var BB = require('backbone');
    var baseUrl = window.appConfig.appHost+'/api/weather';
    var weaterModel = BB.Model.extend({
        urlRoot:baseUrl,
        url:baseUrl,
        parse:function(response){
            return response.result;
        }
    });
    module.exports = weaterModel;
});