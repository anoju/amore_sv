$(document).ready(function(){
	qaNaviUI();
	favoriteViewUI();
	filterUI();
	tabmenuUI();
	icoWinPopUI();
});

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