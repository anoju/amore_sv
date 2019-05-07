$(document).ready(function(){
	scrollItem();
	if($('.ui-roll-number').length > 0)rollingNumberInit();
	if($('.ui-split-text').length > 0)splitText('.ui-split-text');

	$(window).load(function(){
		$(window).resize();
	});
});

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
				$elCenter = $elTop + ($elHeight/2),
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
				$el.addClass('animated paused '+$animationClass);
			}
			//if($animationIn){
				if(($elTop >= ($scrollTop - ($wHeight/2))) && ($elBottom <= ($winBottom + ($wHeight/2)))){
					if($el.hasClass('animated')){
						$el.addClass('paused '+$animationClass);
					}
				}else{
					if($el.hasClass('animated')){
						$el.removeClass($animationClass);
					}else{
						$el.removeClass($animationClass);
					}
				}
			//}
			if(($elCenter >= $scrollTop) && ($elCenter <= $winBottom)){
				if($el.hasClass('animated')){
					$el.removeClass('paused');
				}else{
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

		if($delay == null)$delay = 50;

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
						var $posX = randomNumber(-$distance,$distance,0),
							$posY = randomNumber(-$distance,$distance,0),
							$posZ = randomNumber(-$distance,$distance,0),
							$scale = randomNumber(0.3,0.8,1);

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

var randomNumber = function(min,max,point){
	return ((Math.random() * (max-min)) + min).toFixed(point);
};