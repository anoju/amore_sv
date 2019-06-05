$(document).ready(function(){
	inputFocusUI();
	scrollItem();
	winScrollUI();
	etcChkInput();
	if($('.ui-roll-number').length > 0)rollingNumberInit();
	if($('.ui-split-text').length > 0)splitText('.ui-split-text');

	$(window).load(function(){
		$(window).resize();
	});
	//var $endConfetti = $('.sv_end_visual').find('.confetti');
	//if($endConfetti.length > 0) complateEffect($endConfetti);	//인터렉션 함수;
});

//input:focus 시 키보드 위로 스크롤
var inputFocusUI = function(){
	var $elements = 'input[type=text], input[type=tel], input[type=number], textarea';
	$(document).on('focusin',$elements, function() {
		var $top = $(this).offset().top,
			$scrollTop = $(window).scrollTop(),
			$winCenter = $(window).height() / 2;
		if( $top > ($scrollTop+$winCenter)){
			$( 'html, body' ).animate( {'scrollTop': '+='+$winCenter}, 500);
		}
		$('body').addClass("inputFocus");
	});

	$(document).on('focusout',$elements, function() {
		$('body').removeClass("inputFocus");
	});
};

//기타항목 선택 시 입력영역 노출
var etcChkInput = function(){
	$(document).on('change','.sv_check_item > input',function(){
		var $type = $(this).attr('type'),
			$checked = $type == 'checkbox' ? $(this) : $(this).filter(':checked'),
			$checkedTxt = $checked.next().children('div').text(),
			$etcInput = $checked.closest('.sv_check_item').next('.sv_check_etc');
		//라디오
		if($type == 'radio'){
			if($checkedTxt == '기타' && $etcInput.length > 0){
				$etcInput.show().siblings('.sv_check_etc').hide();
				$etcInput.children('input').focus();
			}
		}
		//체크박스
		if($type == 'checkbox'){
			if($(this).prop('checked')){
				$etcInput.show();
				$etcInput.children('input').focus();
			}else{
				$etcInput.hide();
			}
		}
	});

	//기타항목 입력영역에 값이 있을경우 노출(미리보기 팝업에서 사용)
	$('.sv_check_etc').each(function(){
		var $val =  $(this).find('input').val(),
			$prevInput = $(this).prev().children('input');
		if($val != '' && $prevInput.prop('checked'))$(this).show();
	});
};

//설문항목 이미지, iframe 타입 체크
var svItemImgType = function(){
	var $items = $('.sv_check_item');
	if($items.length > 0){
		$items.each(function(){
			var $img = $(this).find('img'),
				$size = $img.size();
			if($size > 0){
				var $wrap = $(this).closest('.sv_check_item_wrap'),
					$html = '<div class="sv_view_util"><a href="#" class="btn_view_util list on">리스트형</a><a href="#" class="btn_view_util gal">갤러리형</a></div>';
				
				if($items.find('.txt').length == 0)$items.find('.lbl > div').wrapInner('<div class="txt"></div>');
				$img.insertBefore($img.parents('.txt'));
				if(!$img.parent().hasClass('sv_img'))$img.wrap('<div class="sv_img"></div>');
				if(!$wrap.hasClass('type3'))$wrap.addClass('type3');
				if($wrap.prev('.sv_view_util').length == 0)$wrap.before($html);
				/*$.get($img.attr('src')).fail(function(e){
					console.log($img.attr('src')+' 경로에 없는 이미지!');
					$img.css('opacity',0);
				});*/
			}

			//미리보기 시 기타항목 입력영역 노출
			/*var $input = $(this).children('input'),
				//$type = $input.attr('type'),
				$lblTxt = $(this).find('.lbl').children('div').text(),
				$etcInput = $(this).next('.sv_check_etc');
			
			if($input.prop('disabled') && $lblTxt == '기타'){
				if($input.prop('checked')){
					$etcInput.show();
				}
			}*/
		});
		var $imgViewType = localStorage.getItem('imgViewType');
		if($imgViewType == 'gallery' && $('.sv_check_item_wrap.type3').length == 1){
			$('.btn_view_util.gal').addClass('on').siblings().removeClass('on');
			$('.sv_check_item_wrap.type3').addClass('gallery');
		}

				
	}
	$('.sv_check_item_wrap.type3 .sv_check_item').each(function(){
		if($(this).find('.sv_img').length == 0){
			//console.log('none');
			$(this).find('.lbl > div').prepend('<div class="sv_img"></div>');
		}
	});

	$(document).on('click','.btn_view_util',function(e){
		e.preventDefault();
		var $wrap = $(this).parent().next('.sv_check_item_wrap');
		if($(this).hasClass('gal')){
			$wrap.addClass('gallery');
			if($('.sv_check_item_wrap').length == 1)localStorage.setItem('imgViewType','gallery');
		}else{
			$wrap.removeClass('gallery');
			localStorage.removeItem('imgViewType');
		}
		$(this).addClass('on').siblings().removeClass('on');
	});

	var $iframes = $('.sv_survey iframe');
	if($iframes.length > 0){
		$iframes.each(function(){
			if(!$(this).parent().hasClass('iframe_veideo')){
				if(!$(this).parent().hasClass('txt'))$(this).parent().wrapInner('<div class="txt"></div>');
				if($(this).parents('.lbl').length > 0){
					$(this).parents('.lbl').addClass('iframe');
					$(this).insertBefore($(this).parents('.txt'));
				}else{
					$(this).insertAfter($(this).parents('.txt'));
				}
				$(this).wrap('<div class="iframe_veideo"></div>');
			}
		});
	}

	if($('.sv_survey').length > 1){
		$('.sv_survey').addClass('line');
		$('.sv_survey').first().removeClass('line');
	}
};


//체크박스 넘버링
var svCheckboxNumbering = function(){
	var $numbering = $('.ui-check-numbering');
	$numbering.each(function(){
		var $this = $(this),
			$checkbox = $this.find('input[type=checkbox]'),
			$inpWrap = $this.prev('.ui-numbering-inp');
		//설문에서 선택 시 넘버링 출력
		$checkbox.change(function(){
			if($(this).prop('checked')){
				var $length = $checkbox.filter(":checked").length,
					$txt = $(this).siblings('.lbl').children('div').text(),
					$input = $inpWrap.find('input').eq($length-1);

				if($input.length > 0){
					$(this).siblings('.lbl').append('<span class="num">'+$length+'</span>');
					$input.val($txt);									//input:text 에 val 입력
				}
			}else{
				var $num = $(this).siblings('.lbl').find('.num'),
					$numTxt = $num.text();
				if($num.length > 0){
					$num.remove();																	//자신일때 넘버링 삭제
					$checkbox.each(function(){
						var $num2 = $(this).siblings('.lbl').find('.num'),
							$numTxt2 = $num2.text(),
							$txt2 = $(this).siblings('.lbl').children('div').text();
						if($numTxt < $numTxt2){
							$numTxt2 = $numTxt2-1;
							$num2.text($numTxt2);													//클때 넘버링 조정
						}
						if($numTxt2 >= 0)$inpWrap.find('input').eq($numTxt2-1).val($txt2);			//클때 input:text 에 val 조정
					});
				}
			}

			/* 체크 해제시 input:text의 val 삭제*/
			var $numLength = $this.find('.num').length;
			if($numLength == 0){
				$inpWrap.find('input').val('');
			}else{
				$inpWrap.find('input').eq($numLength-1).nextAll().val('');
			}
		});

		//대시보드 미리보기 시 넘버링 출력
		$checkbox.each(function(){
			var $chkThis = $(this);
			if($chkThis.prop('disabled')){
				var $txt3 = $chkThis.siblings('.lbl').children('div').text();
				var $inpTxt = $inpWrap.find('input[type=text]');
				$inpTxt.each(function(){
					var $inpVal = $(this).val();
					if($inpVal == $txt3){
						var $inpIdx = $inpTxt.index(this);
						$chkThis.siblings('.lbl').append('<span class="num">'+($inpIdx+1)+'</span>');
					}
				});
			}
		});
	});
};

//완료 팝업
var svPopOpen = function(tar){
	if($(tar).length < 1) return console.log('해당팝업없음');
	$('body').addClass('scroll_lock');	
	$(tar).addClass('open');
	var $confetti = $(tar).find('.confetti');
	if($confetti.length > 0) complateEffect($confetti);	//인터렉션 함수;
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
var complateEffect = function(wrap){
	var $wrap = $(wrap),
		$itemLength = 10,			//20 넘지 않게
		rdClass, rdLeft, rdTop, rdDelay,rdDirection, rdSpeed, 
		$html = '',
		rdLeftAry = [];

	if($wrap.hasClass('type1') || $wrap.hasClass('type3'))$itemLength = 15;

	for(var i = 0; i < $itemLength;i++){
		rdClass = randomNumber(1,3,0);
		rdSize = randomNumber(1,3,0);
		rdColor = (i%3) + 1;
		rdLeft = randomNumber(0,20,0) * 5;
		rdTop = randomNumber(2,14,0) * 5;
		rdDelay = randomNumber(0,10,0) * 200;
		//rdDelay = (i%10) * 200;
		rdDirection = randomNumber(1,2,0);
		rdSpeed = randomNumber(25,50,0) * 100;
		
		if(rdLeftAry.indexOf(rdLeft) >= 0){		//left 랜덤값 겹치지않게
			i--;
		}else{
			rdLeftAry.push(rdLeft);
			if($wrap.hasClass('type1')){
				//꽃가루(2가지 모션, 3가지 컬러, 3가지 사이즈, 6가지 모양)
				rdClass = randomNumber(1,6,0);
				$html = '<span class="item item'+rdClass+' color'+rdColor+' size'+rdSize+'" style="left:'+rdLeft+'%;';
					$html += '-webkit-animation:confettiSwing'+rdDirection+' '+(rdSpeed/2)+'ms infinite '+rdDelay+'ms, confettiDrop '+rdSpeed+'ms infinite ease-out '+rdDelay+'ms;';
					$html += 'animation:confettiSwing'+rdDirection+' '+(rdSpeed/2)+'ms infinite '+rdDelay+'ms, confettiDrop '+rdSpeed+'ms infinite ease-out '+rdDelay+'ms;';
				$html += '"><span></span></span>';
			}else if($wrap.hasClass('type2')){
				//코인(1가지 모양, 3가지 사이즈)
				rdSpeed = randomNumber(10,15,0) * 100;	//속도조절
				$html = '<span class="item size'+rdSize+'" style="left:'+rdLeft+'%;';
					$html += '-webkit-animation:confettiCoin '+rdSpeed+'ms linear '+rdDelay+'ms;';
					$html += 'animation:confettiCoin '+rdSpeed+'ms linear '+rdDelay+'ms;';
				$html += '"></span>';
			}else if($wrap.hasClass('type3')){
				//깜빡임(3가지 모양, 3가지 사이즈, 3가지 컬러)
				rdSpeed = randomNumber(10,15,0) * 100;	//속도조절
				rdDelay = randomNumber(0,5,0) * 200;	//딜레이조절
				$html = '<span class="item item'+rdClass+' color'+rdColor+'" style="left:'+rdLeft+'%;top:'+rdTop+'%;';
					$html += '-webkit-animation:confettiFlash '+rdSpeed+'ms infinite '+rdDelay+'ms;';
					$html += 'animation:confettiFlash '+rdSpeed+'ms infinite '+rdDelay+'ms;';
				$html += '"></span>';
			}else if($wrap.hasClass('type4')){
				//풍선(3가지 모양, 3가지 사이즈)
				$html = '<span class="item color'+rdColor+' size'+rdSize+'" style="left:'+rdLeft+'%;';
					$html += '-webkit-animation:confettiBalloon'+rdDirection+' '+(rdSpeed/2)+'ms infinite '+rdDelay+'ms, confettiUp '+rdSpeed+'ms infinite ease-out '+rdDelay+'ms;';
					$html += 'animation:confettiBalloon'+rdDirection+' '+(rdSpeed/2)+'ms infinite '+rdDelay+'ms, confettiUp '+rdSpeed+'ms infinite ease-out '+rdDelay+'ms;';
				$html += '"></span>';
			}else if($wrap.hasClass('type5')){
				//불꽃(3가지 모양)
				rdTop = randomNumber(0,8,0) * 5;		//top값 조정
				rdSpeed = randomNumber(15,25,0) * 100;	//속도조절
				$html = '<span class="item color'+rdColor+' size'+rdSize+'" style="left:'+rdLeft+'%;top:'+rdTop+'%;">';
					$html += '<span class="firework" style="';
						$html += '-webkit-animation:confettiFirework '+rdSpeed+'ms infinite '+rdDelay+'ms;';
						$html += 'animation:confettiFirework '+rdSpeed+'ms infinite '+rdDelay+'ms;';
					$html += '"></span>';
					$html += '<span class="fire_arr"><i style="';
						$html += '-webkit-animation:confettiFireArr '+rdSpeed+'ms infinite '+rdDelay+'ms;';
						$html += 'animation:confettiFireArr '+rdSpeed+'ms infinite '+rdDelay+'ms;';
					$html += '"></i></span>';
				$html += '</span>';
			}else if($wrap.hasClass('type6')){
				//하트(2가지 모양, 3가지 각도)
				rdColor = (i%2) + 1;  					//하트이미지 2종류
				rdSpeed = randomNumber(10,15,0) * 100;	//속도조절
				rdDelay = randomNumber(0,5,0) * 200;	//딜레이조절
				$html = '<span class="item item'+rdClass+' color'+rdColor+'" style="left:'+rdLeft+'%;top:'+rdTop+'%;';
					$html += '-webkit-animation:confettiFlash '+rdSpeed+'ms infinite '+rdDelay+'ms;';
					$html += 'animation:confettiFlash '+rdSpeed+'ms infinite '+rdDelay+'ms;';
				$html += '"></span>';
			}else if($wrap.hasClass('type7')){
				//별빛(1가지 모양, 4가지 크기)
				rdTop = randomNumber(0,10,0) * 5;		//top값 조정
				rdSize = (i%4) + 1;						//크기 4가지
				rdSpeed = randomNumber(10,15,0) * 100;	//속도조절
				rdDelay = randomNumber(0,5,0) * 200;	//딜레이조절
				$html = '<span class="item  size'+rdSize+'" style="left:'+rdLeft+'%;top:'+rdTop+'%;';
					$html += '-webkit-animation:confettiFlash '+rdSpeed+'ms infinite '+rdDelay+'ms;';
					$html += 'animation:confettiFlash '+rdSpeed+'ms infinite '+rdDelay+'ms;';
				$html += '"></span>';
			}else if($wrap.hasClass('type8')){
				//불꽃2(3가지 모양)
				rdTop = randomNumber(0,14,0) * 5;		//top값 조정
				rdSpeed = randomNumber(15,25,0) * 100;	//속도조절
				$html = '<span class="item color'+rdColor+' size'+rdSize+'" style="left:'+rdLeft+'%;top:'+rdTop+'%;">';
					$html += '<span class="dot" style="';
						$html += '-webkit-animation:confettiFireworkDot '+rdSpeed+'ms infinite '+rdDelay+'ms;';
						$html += 'animation:confettiFireworkDot '+rdSpeed+'ms infinite '+rdDelay+'ms;';
					$html += '"></span>';
					$html += '<span class="firework" style="';
						$html += '-webkit-animation:confettiFirework2 '+rdSpeed+'ms infinite '+rdDelay+'ms;';
						$html += 'animation:confettiFirework2 '+rdSpeed+'ms infinite '+rdDelay+'ms;';
					$html += '"></span>';
				$html += '</span>';
			}else{
				console.log('인터렉션 타입 클래스를 적용해주세요');
				break;
			}
			$wrap.prepend($html);
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
			if($animationIn){
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
			}
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
			$this.append('<span class="num-item" style="height:'+$height+'px;line-height:'+$height+'px;"><span class="rol" style="height:'+$height+'px;line-height:'+$height+'px;"></span></span>');
			for(var j=$repeatNum;j>=0;j--){
				var k = j%10;
				$this.find('.num-item').last().find('.rol').append('<span style="height:'+$height+'px;line-height:'+$height+'px;">'+k+'</span>');
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
		$this.find('.num-item, .num-item > .rol, .num-item > .rol > span').css({
			'height':'auto',
			'line-height':'inherit'
		});
		$height = $this.find('.num-item > .rol > span').height();
		$this.find('.num-item, .num-item > .rol, .num-item > .rol > span').css({
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

var winScrollUI = function(){
	var prevScrollTop = $(window).scrollTop(),
		nowScrollTop = $(window).scrollTop(),
		scrollTimeout = '',
		timer = 100,
		gap = 5;

	$(window).on('scroll touchmove', function (){
		//clearTimeout(scrollTimeout);
		//scrollTimeout = setTimeout(function(){
			nowScrollTop = $(window).scrollTop();
			if (nowScrollTop > (prevScrollTop + gap)) {
				//console.log('down');
				if($('.myranking').length > 0)$('.myranking').removeClass('on');
				
			} else if (nowScrollTop < (prevScrollTop - gap)){
				//console.log('up');
				if($('.myranking').length > 0)$('.myranking').addClass('on');
			}
			prevScrollTop = nowScrollTop;
		//},timer);
	});

	$(window).on('load', function (){
		nowScrollTop = $(window).scrollTop();
		if($('.myranking').length > 0 && nowScrollTop > gap)$('.myranking').addClass('on');
	});
};