$(document).ready(function(){
	svPopupUI();
	scrollItem();
	if($('.ui-roll-number').length > 0)rollingNumberInit();
	if($('.ui-split-text').length > 0)splitText('.ui-split-text');

	$(window).load(function(){
		$(window).resize();
	});
});

//완료 팝업
var svPopupUI = function(){
	$(document).on('click','.sv-pop-open',function(e) {
		e.preventDefault();
		var $pop = $(this).attr('href');
		svPopOpen($pop);
	});
	$(document).on('click','.sv-pop-close',function(e) {
		e.preventDefault();
		var $pop = $(this).closest('.pop_wrap');
		svPopClose($pop);
	});
};
var svPopOpen = function(tar){
	if($(tar).length < 1) return console.log('해당팝업없음');
	$('body').addClass('scroll_lock');	
	$(tar).addClass('open');
};
var svPopClose = function(tar){
	$(tar).fadeOut(500,function(){
		$('body').removeClass('scroll_lock');
		$(this).removeClass('open').removeAttr('style');
	});
};

//랜덤값 추출
var randomNumber = function(min,max,point){
	return ((Math.random() * (max-min)) + min).toFixed(point);
};

//완료 인터렉션
var complateEffect = function(wrap,length){
	if(length > 20)length = 20;
	var $wrap = $(wrap),
		$itemLength = length,
		rdClass, rdClass2, rdLeft, rdTop, rdDelay,rdDirection, rdSpeed,
		rdLeftAry = [];
	for(var i = 0; i < $itemLength;i++){
		rdClass = randomNumber(1,3,0);
		//rdColor = randomNumber(1,3,0);
		rdColor = (i%3) + 1;
		rdLeft = randomNumber(0,20,0) * 5;
		rdTop = randomNumber(4,18,0) * 5;
		rdDelay = randomNumber(0,30,0) * 100;
		rdDirection = randomNumber(1,6,0);
		rdSpeed = randomNumber(30,70,0) * 100;
		
		if(rdLeftAry.indexOf(rdLeft) >= 0){		//left 랜덤값 겹치지않게
			i--;
		}else{
			rdLeftAry.push(rdLeft);
			if($wrap.hasClass('type2')){
				//코인
				rdSpeed = randomNumber(30,70,0) * 50;
				$wrap.prepend('<span class="item size'+rdClass+'" style="left:'+rdLeft+'%;animation:confettiDrop '+rdSpeed+'ms infinite ease-out '+rdDelay+'ms;"></span>');
			}else if($wrap.hasClass('type3')){
				//깜빡임
				rdSpeed = randomNumber(30,70,0) * 50;
				$wrap.prepend('<span class="item item'+rdClass+' color'+rdColor+'" style="left:'+rdLeft+'%;top:'+rdTop+'%;animation:confettiFlash '+rdSpeed+'ms infinite"></span>');
			}else{
				//꽃가루
				$wrap.prepend('<span class="item color'+rdColor+'" style="left:'+rdLeft+'%;animation:confettiSwing'+rdDirection+' '+(rdSpeed/2)+'ms infinite '+rdDelay+'ms, confettiDrop '+rdSpeed+'ms infinite ease-out '+rdDelay+'ms;"></span>');
			}
		}
	}
};


/* 스크롤 애니메이션 */
var scrollItem = function(){
	var $elements = $.find('*[data-animation]'),
		$window = $(window);

	$(window).on('scroll resize',function(){
		$elements = $.find('*[data-animation]');
		if($elements.length > 0){
			checkInView();
		}
	});

	function checkInView(){
		var $wHeight = $window.height(),
			$scrollTop = $window.scrollTop(),
			$winBottom = ($scrollTop + $wHeight - 50);

		$.each($elements, function(){
			var $el = $(this),
				$elHeight = $($el).outerHeight(),
				$elTop = $($el).offset().top,
				$elBottom = $elTop + $elHeight,
				$animationClass = $el.data('animation'),
				$delay = $el.data('delay'),
				$duration = $el.data('duration'),
				$animationIn = $el.data('animation-in');

			if(!$el.hasClass('animated') && $animationClass != 'on'){
				if($delay>0){
					$el.css({
						'-webkit-animation-delay':$delay+'ms',
						'animation-delay':$delay+'ms'
					});
				}
				if($duration>0){
					$el.css({
						'-webkit-animation-duration':$duration+'ms',
						'animation-duration':$duration+'ms'
					});
				}
				$el.addClass('animated');
			}
			if($animationIn){
				if(($elTop >= $scrollTop) && ($elBottom <= $winBottom)){
					$el.addClass($animationClass);
				}else{
					$el.removeClass($animationClass);
				}
			}else{
				if(($elBottom >= $scrollTop) && ($elTop <= $winBottom)){
					$el.addClass($animationClass);
				}
			}
		});
	}
};

/* 숫자 롤링 효과 */
var rollingNumberInit = function(){
	$('.ui-roll-number').data('once',true);
	$(window).on('scroll resize',function(){
		$('.ui-roll-number').each(function(){
			var $html = $(this).text(),
				$once = $(this).data('once');
			if($(this).hasClass('on') && $once == true){
				$(this).data('once',false);
				rollingNumber(this,$html);
			}
		});
	});
};
var rollingNumber = function(tar,num){
	var $this = $(tar),
		$split = num.split(''),
		$style = $this.attr('style'),
		$height = $this.height(),
		//$vwHeight = ($height/$(window).width()*100).toFixed(4),
		$numRepeat = 2,
		$repeatNum = $numRepeat*10-1;

	$this.css('height',$height).html('');
	for(var i in $split){
		if($split[i] == ','){
			$this.append('<span class="num-comma">'+$split[i]+'</span>');
		}else{
			$this.append('<span class="num-item" style="height:'+$height+'px;line-height:'+$height+'px;"><span class="rol"></span></span>');
			for(var j=$repeatNum;j>=0;j--){
				var k = j%10;
				$this.find('.num-item').last().find('.rol').append('<span>'+k+'</span>');
			}
		}
	}
	$this.data('number',num).removeAttr('style');
	if($style)$this.attr('style',$style);

	var $length = $this.children().length,
		isRolling = true;
	$this.children().each(function(e){
		var $idx = $(this).index(),
			$rol = $(this).find('.rol'),
			$num = $split[e];

		$rol.animate({'top':($num-$repeatNum)*$height},1000+($idx*200),function(){
			if(e == ($length-1))isRolling = false;
		});
	});

	$(window).resize(function(){
		if(isRolling == true) return;
		$height = $this.height();
		$this.find('.num-item').css({
			'height':$height+'px',
			'line-height':$height+'px'
		});
		$this.children().each(function(e){
			var $rol = $(this).find('.rol'),
				$num = $split[e];
	
			$rol.css({'top':($num-$repeatNum)*$height});
		});
	});
};

/* 텍스트 글자별 효과 */
var splitText = function(tar){
	var $tar = $(tar);
	$tar.each(function(){
		var $this = $(this),
			$split = $(this).html().split(''),
			$html = '',
			$tag = '',
			$isTag = false,
			$style = $(this).attr('style'),
			j = 0,
			$delay = $(this).data('sp-delay'),
			$distance = $(this).data('sp-distance');

		if($delay == null)$delay = 100;

		$this.css('height',$this.height()).html('');
		for(var i in $split){
			if($isTag){
				$tag += $split[i];
				if($split[i] == '>'){
					$isTag = false;
					$html += $tag;
				}
			}else{
				if($split[i] == '<'){
					$tag = $split[i];
					$isTag = true;
				}else if($split[i] == ' '){
					$html += '<span class="spt">&nbsp;</span>';
				}else{
					j++;
					$html += '<span class="spt" style="';
					$html += '-webkit-transition-delay:'+(j*$delay)+'ms;';
					$html += 'transition-delay:'+(j*$delay)+'ms;';
					if($distance != null){
						var $posX = random(-$distance,$distance),
							$posY = random(-$distance,$distance),
							$posZ = random(-$distance,$distance),
							$scale = random(0.3,0.8);

						$html += '-webkit-transform:translate3d('+$posX+'px,'+$posY+'px,'+$posZ+'px) scale('+$scale+');';
						$html += 'transform:translate3d('+$posX+'px,'+$posY+'px,'+$posZ+'px) scale('+$scale+');';
					}
					$html += '">';
					$html += $split[i];
					$html += '</span>';
				}
			}
		}
		$this.html($html).removeAttr('style');
		if($style)$this.attr('style',$style);
	});
};