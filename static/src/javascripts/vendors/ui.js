define(function(require, exports, module){
    // var $ = require('jqmobile');
    var $ = require('zepto');
    var _ = require('underscore');
    var UTIL = require('./util');
    var UI = {};
    UI.LIST = {};
    var log = UTIL.LOG;
    var isType = UTIL.isType;
    var noop = UTIL.noop;
    /** List links */
    UI.LIST.LINKS = function(json){
        json = json || {};
        json.index = json.index || 0;
        json.callback = json.callback || noop;
        this.ContainerObj = (json.container && $(json.container)) || $('<div class="linksContainer"></div>').appendTo('body');
        if(json.links === undefined){
            log('must need param links');
            return;
        }else if(!(isType(json.links,'array'))){
            log('links must be array');
            return;
        }   
        this.json = json;
        this.init();
        this.initEvent();
    }
    UI.LIST.LINKS.prototype.init = function(){
        this.render();
        this.itemObjs = this.ContainerObj.find('.linkItem');
        this.setCurrent(this.json.index);
    }
    UI.LIST.LINKS.prototype.initEvent = function(){
        var self = this;
        self.ContainerObj.on('touchstart','.linkItem',function(e){
            var index = $(this).index();
            if(index === self.json.index){
                self.json.callback(index);
                e.isDefaultPrevented();
                e.isPropagationStopped();
            }else{
                if(!self.json.isNav){
                    self.setCurrent(index);
                }          
            }                   
            self.json.callback(index);
        })
    }
    UI.LIST.LINKS.prototype.render = function(){
        var links = this.json.links;
        var dClass = 'linkItem';
        var contentClass = 'linksContent ';
        contentClass += this.json.class || '';
        var htmlArr = ['<ul class="'+contentClass+'">'];
        _.each(links,function(link,index){
            link.class = link.class || "";
            link.link = link.link || "javascript:;";
            link.text = link.text || "";
            htmlArr.push('<li class="linkItem' + index + ' ' + dClass +' ' + link.class +'"><a href="'+ link.link +'">'+ link.text +'</a></li>');
        });
        htmlArr.push('</ul>');
        this.ContainerObj.append(htmlArr.join(''));
        return this;
    }
    UI.LIST.LINKS.prototype.show = function(){
        this.ContainerObj.show();
    }
    UI.LIST.LINKS.prototype.hide = function(){
        this.ContainerObj.hide();
    }
    UI.LIST.LINKS.prototype.setCurrent = function(index){
        index = index || 0;
        this.itemObjs.eq(this.json.index).removeClass('selected');
        this.itemObjs.eq(index).addClass('selected');
        this.json.index = index;
    }
    /** page */
    UI.PAGE = {
        pageCache:{'index':$('#index')},
        prePageId:'index',
        showPage:function(pageId){
            if(pageId === this.prePageId){
                return;
            }
            if(!(this.pageCache[pageId])){
                this.pageCache[pageId] = $('#'+pageId);
            }
            if(this.prePageId){
                this.pageCache[this.prePageId].hide();
            }
            this.prePageId = pageId;          
            this.pageCache[pageId].show();
        }
    };
    module.exports = UI;
})