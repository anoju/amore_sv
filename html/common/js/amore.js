$(document).ready(function(){
	qaNaviUI();
	//favoriteViewUI();
	filterUI();
	tabmenuUI();
	icoWinPopUI();
	//horisonScroll('.am_table_wrap');
});
var horisonScroll = function(tar){
	$(tar).on('mousewheel',function(event, delta){
		var $width = $(this).outerWidth(),
			$scrollW = $(this).get(0).scrollWidth,
			$scrollLeft = $(this).scrollLeft(),
			$gap = $scrollW - $width;

		if($gap != 0){
			if(($scrollLeft != $gap && delta < 0) || ($scrollLeft != 0 && delta > 0)){
				this.scrollLeft -= (delta * 30);
				event.preventDefault();
			}
		}
	});
};

var icoWinPopUI = function(){
	$(document).on('click','.btn_winpop',function(e){
		e.preventDefault();
		var $span = $(this).find('.in'),
			$width = $span.children().width(),
			$height = $span.children().height(),
			$html = $span.html();
			
		var OpenWindow = window.open('', '_blank', 'width='+$width+', height='+$height+', left=100, top=50, menubars=no, scrollbars=auto'); 
		OpenWindow.document.write('<!DOCTYPE html><html lang="ko"><head></head><body style="margin:0;padding:0;overflow:hidden;">'+$html+'</body></html>');
	});
};

var qaNaviUI = function(){
	$(document).on('click','.am_qa_navi > ul > li > a',function(e){
		if($(this).hasClass('in_sub')){
			e.preventDefault();
			var $closest = $(this).closest('li'),
				$closestIdx = $closest.index();		
			
			qaNaviActive($closest,$closestIdx);
		}else{
			qaNaviReset();
			$(this).closest('li').addClass('active');
		}
	});
	$(document).on('click','.am_qa_cont',function(e){
		qaNaviReset();
	});
	
	var qaNaviActive =  function(tar,idx){
		$('.am_qa_navi').addClass('open');
		tar.addClass('active').siblings().removeClass('active');
		$('.am_qa_navi .depth2 > ul').eq(idx-1).addClass('active').siblings().removeClass('active');
	};
	var qaNaviReset =  function(){
		$('.am_qa_navi').removeClass('open');
		$('.am_qa_navi > ul > li').removeClass('active');
		$('.am_qa_navi .depth2 > ul').removeClass('active');
	};	
};
/*
var favoriteViewUI = function(){
	$('.btn_my_favorite').click(function(e){
		if($('.am_my_favorite').length > 0){
			e.preventDefault();
			$('.am_my_favorite').show().siblings().not('.am_cont_top').hide();
		}
	});
	$('.btn_my_favorite_close').click(function(e){
		e.preventDefault();
		$('.am_my_favorite').hide().siblings().show();
	});
};
*/

var filterUI = function(){
	// var $utilWidth = $('.am_util').outerWidth();
	// if($('.am_view').length > 0)$('.am_view').find('h2.title').first().css('padding-right',$utilWidth+10);

	$('.am_filter > .btn_in_arr').click(function(e){
		e.preventDefault();
		$(this).toggleClass('on');
		$('.am_container').toggleClass('filter_open');
		$('.am_util .am_filter_cont').stop().slideToggle(300);
	});

	$('.am_filter_tab .am_btn').click(function(e){
		e.preventDefault();
		if($(this).hasClass('disabled')) return;
		var $href = $(this).attr('href');
		$(this).addClass('on').siblings().removeClass('on');
		$($href).addClass('on').siblings('.am_filter_box').removeClass('on');
	});
};

var tabmenuUI = function(){
	$('.ui-tabmenu a').click(function(e){
		e.preventDefault();
		var $href = $(this).attr('href');
		$(this).closest('li').addClass('on').siblings().removeClass('on');
		$($href).addClass('on').siblings('.tab_cont').removeClass('on');
	});
};


/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright 2015 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});