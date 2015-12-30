/**
 * @fileOverview: focusImg.js 轮播图效果
 * @author: tianxiaoyun 
 * @contact: email misstian2008@163.com || 358926040
 * @version: 1.0
 * @external: [jquery.js]
 */
;(function(){
  var focusImg = function(options){
		var oFocus = $('#'+options.id),
		btn = $('#'+options.btnId),	
		oUl = oFocus.find('.fimg'),
		len = oUl.find('li').length,
		temp = [],
		sig = 0,
		s = "<span></span>",
		t = 3000,
		timer = '',
		auto = false;
		if(options.auto){auto = true};
		if(options.time){t = options.time};
		
		(function(){
			btn.html('');
			for(var i=0;i<len;i++){
				temp+=s;
			};
			btn.append(temp);
			btn.find('span:eq(0)').addClass('now');	
		})();
		
		function picFade(num){
			btn.find('span:eq('+num+')').addClass('now').siblings().removeClass('now');
			oUl.find('li:eq('+num+')').stop(true,true).fadeIn().siblings().fadeOut();
			sig = num;
		};
		
		btn.find('span').live('click',function(index) {
			 $(this).addClass('now').siblings().removeClass('now');
			 oUl.find('li:eq('+$(this).index()+')').stop(true,true).fadeIn().siblings().fadeOut();
			 sig = $(this).index();
			 
		});
		oFocus.mouseenter(function(e) {
			clearInterval(timer);
			$(this).find('.btnpn').stop(true,true).fadeIn();
		}).mouseleave(function(e) {
			if(auto){
				if(timer)timer = ''; clearInterval(timer);
				timer = setInterval(function(){
					$('.next').trigger('click');
				},t);	
			}
			 
		   $(this).find('.btnpn').stop(true,true).fadeOut(); 
		});
		
		oFocus.find('.prev').click(function(e) {
			sig = btn.find('span.now').index();
			if(sig<=0){sig = len - 1}else{sig = sig - 1};
			picFade(sig);
			
		});
		oFocus.find('.next').click(function(e) {
			sig = btn.find('span.now').index();
			if(sig>=(len -1 )){sig = 0 }else{sig = sig + 1};
			picFade(sig);
			
		});
		
		if(auto){
			timer = setInterval(function(){
				$('.next').trigger('click');
			},t);
		};
				
  };
  new focusImg({id:'focusimg',btnId:'fspan',time:3000,auto:true});
})();
/*  |xGv00|f08e8f0ceb79bcb904603dab04818a26 */