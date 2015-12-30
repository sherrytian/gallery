/**
 * @fileOverview: gallery.js 轮播图效果
 * @author: tianxiaoyun 
 * @contact: email misstian2008@163.com || 358926040
 * @version: 1.0
 * @external: [jquery.js]
 */
;(function($, window, document,undefined) {
    //定义Cycle的构造函数
    var Gallery = function(eleId, opt) {
        // this.$elementId = $(eleId).attr("id"),
        this.element = $(eleId),
        this.timer = null,
        this.defaults = {
            'activePagerClass':'.list > li',
            'currentClass':'current',
            'model':'move',
            'direction': 'left',
            'pager':true,
            'pagerEvent':'click',
            'arrowBtn':true,
            'step': 350,
            'speed': 3000
        },
        this.options = $.extend({}, this.defaults, opt);
    }
    //定义Cycle的方法
    Gallery.prototype = {
        constructor:Gallery,
        init: function() {
            var _this = this;
            var i=0;
	            _this.modifiedStyle();
                if(_this.options.pager){
                    _this.pagersEvent();
                }
                if (_this.options.arrowBtn) {
                    _this.arrowBtnEvent();
                }

	            _this.on();
	            _this.element.on('mouseenter',function(event){
                    _this.prevBtn.fadeIn();
                    _this.nextBtn.fadeIn();
                    
                }).on('mouseleave',function(event){
                    _this.prevBtn.fadeOut();
                    _this.nextBtn.fadeOut();
                    
                });

            return _this;
        },
        /**
         * [修饰样式]
         */
        modifiedStyle:function(){
        	var _this = this;

        	// 添加分页标签
            if(_this.options.pager && _this.element.find('.gallery-pager').length < 1){
                var pagerHtml = '<div class="gallery-pager">';
                var len = $(_this.options.activePagerClass).length;
                for(var i=0;i<len;i++){
                    if(i===0){
                        pagerHtml += '<span class="current">'+(i+1)+'</span>';
                    }else{
                        pagerHtml += '<span>'+(i+1)+'</span>';   
                    }
                }
                pagerHtml += '</div>';
                _this.element.append(pagerHtml);

            }

            // 添加左右箭头
            if (_this.options.arrowBtn && _this.element.find('.prev-btn').length < 1 && _this.element.find('.next-btn').length < 1) {
                var arrowBtnHtml = '<div class="prev-btn" style="display:none;"></div><div class="next-btn" style="display:none;"></div>';
                _this.element.append(arrowBtnHtml);
                _this.prevBtn = _this.element.find('.prev-btn');
                _this.nextBtn = _this.element.find('.next-btn');
            }
        	
        },
        /**
         * [执行动作函数]
         * @param  {[number]} [cur]       [当前元素的索引]
         * @param  {number}   [nextCur]   [新的当前元素的索引]
         * @param  {[number]} [direction] [执行动作的方向 1||-1]
         * @param  {[number]} [step]      [每次滚动值]
         */
        marquee:function(cur,nextCur,step,description){
        	var _this = this;
            var $moveElements = $(_this.options.activePagerClass);

                if (!$(_this.options.activePagerClass).is(':animated')) {
                    $(_this.options.activePagerClass).eq(cur).animate({'left':-step*description+'px','display':'none','z-index':'1'},1000).removeClass('current');
                    $(_this.options.activePagerClass).eq(nextCur).css({'left':step*description+'px'}).animate({'left':'0px','display':'block','z-index':'2'},1000).addClass('current');
                }
                if(_this.options.pager){
                   _this.pagersCurrent(nextCur); 
                }
        },
        /**
         * [设置当前下标]
         * @param {number} [index] [执行完动作后当前的下标索引]
         */
        pagersCurrent:function(index){
            var _this = this;
            var pagers = _this.element.find('.gallery-pager span');
                // pagers.removeClass('current');
                pagers.eq(index).addClass('current').siblings().removeClass('current');
        },
        /**
         * [下标执行动作]
         * @param {number} [index] [执行完动作后当前的下标索引]
         */
        pagersEvent:function(){
            var _this = this;
            var pagers = _this.element.find('.gallery-pager span');
            if (_this.options.pagerEvent === 'mouseover') {
                pagers.delegate('mouseover',function(e){
                    var index = $(this).index();//当前元素的索引
                    var oldIndex = $(this).parent().find('.current').index();//原来当前状态下标的索引
                    var description = index > oldIndex ? 1 : -1; 

                    if($(this).is('.current')){return}
                    // clearInterval(_this.timer);
                    _this.off();
                    if (!$(_this.options.activePagerClass).is(':animated')) {
                        // _this.pagersCurrent(index);
                        _this.marquee(oldIndex,index,_this.options.step,description);
                    }
                });
                pagers.delegate('mouseout',function(e){
                    setTimeout(function(){
                        _this.on();
                    },3000);
                });
            }else if (_this.options.pagerEvent === 'click') {
                pagers.on('click',function(e){
                    var index = $(this).index();//当前元素的索引
                    var oldIndex = $(this).parent().find('.current').index();//原来当前状态下标的索引
                    var description = index > oldIndex ? 1 : -1; 

                    if($(this).is('.current')){return}
                    _this.off();
                    if (!$(_this.options.activePagerClass).is(':animated')) {
                        // _this.pagersCurrent(index);
                        _this.marquee(oldIndex,index,_this.options.step,description);
                    }
                    setTimeout(function(){
                        _this.on();
                    },3000);
                    _this.stopPropagation(e);
                });
            }else{
                alert('请设置事件类型');
            }
                
        },
        /**
         * [arrowBtnEvent 箭头点击事件]
         * @return {[type]} [description]
         */
        arrowBtnEvent:function(){
            var _this = this;
            var prevBtn = _this.element.find(_this.options.prevBtn);
            var nextBtn = _this.element.find(_this.options.nextBtn);
            var len = _this.element.find('.gallery-pager span').length;

            prevBtn.on('click',function(e){
                var oldIndex = _this.element.find('.gallery-pager span.current').index();//原来当前状态下标的索引
                var index = (oldIndex-1) < 0 ? len-1 : oldIndex-1;

                _this.off();
                if (!$(_this.options.activePagerClass).is(':animated')) {
                    // _this.pagersCurrent(index);
                    _this.marquee(oldIndex,index,_this.options.step,-1);
                }
                setTimeout(function(){
                    _this.on();
                },3000);
                _this.stopPropagation(e);
            });
            nextBtn.on('click',function(e){
                var oldIndex = _this.element.find('.gallery-pager span.current').index();//原来当前状态下标的索引
                var index = (oldIndex+1) >= len ? 0 : oldIndex+1;

                _this.off();
                if (!$(_this.options.activePagerClass).is(':animated')) {
                    // _this.pagersCurrent(index);
                    _this.marquee(oldIndex,index,_this.options.step,1);
                }
                setTimeout(function(){
                    _this.on();
                },3000);
                _this.stopPropagation(e);
            });
        },
        stopPropagation:function(e){
            var e = e || window.event;  
            if(e.stopPropagation) { //W3C阻止冒泡方法  
                e.stopPropagation();  
            } else {  
                e.cancelBubble = true; //IE阻止冒泡方法  
            }  
        },
        on:function(){
            var _this = this;
            // _this.timer =setInterval(function(){
            console.log(_this);
            var oldIndex = $(_this.options.activePagerClass+'.current').index();//默认从0开始
            var len = $(_this.options.activePagerClass).length;
            var index = (oldIndex+1) >= len ? 0 : oldIndex+1;

                // _this.pagersCurrent(index);
            _this.marquee(oldIndex,index,_this.options.step,1);
            _this.timer = setTimeout(_this.on,_this.options.speed);

            // },_this.options.speed);
        },
        off:function(){
            clearInterval(this.timer);
        }
        
    }
    //在插件中使用Cycle对象
    $.fn.gallery = function(options) {
        //创建Cycle的实体
        var gallery = new Gallery(this, options);
        //调用其方法
        return gallery.init();
    }
})(jQuery, window, document);