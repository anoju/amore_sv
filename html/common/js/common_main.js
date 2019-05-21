/**
 * @notice -> 매개변수로 Image element를 받아 on/off 주소를 찾고 src값을 설정함. on/off 구분키워드는 함수내에 정의되어있음
 * @param {object(Image Element)} img -> on/off이미지로 바꿀 원본 Image Element
 * @param {boolean} isOn -> 이미지의 on/off 여부 ( on : on이미지로 설정, off: off이미지로 설정 )
*/
function imgOnOffChange ( img, isOn ) {
	if ( typeof img === 'undefined' ) {
		return;
	}
	if ( typeof img.onSrc === 'undefined' ) {
		var result = imgOnOffCheck ( img.src, '_on', '_off' );
		img.onSrc = result.onSrc;
		img.offSrc = result.offSrc;
	}
	img.src = ( isOn ) ? img.onSrc : img.offSrc;
} /* imgOnOffChange */

/**
 *@notice -> 이미지의 주소값을 매개변수로 받아 내부루틴을 거쳐 on/off 이미지의 주소, on여부의 값을 리턴함
 *@return {object}    -> 이미지의 주소값 ( ex :: http://www.aaa.com/images/bbb.jpg )
 *@param {string} onKey -> 이미지파일명을 이용해서 on상태를 체크할 키값
 *@param {string} offKey -> 이미지파일명을 이용해서 off상태를 체크할 키값
*/
function imgOnOffCheck ( src, onKey, offKey ) {
	var onImgChk = new RegExp ( onKey + '.(?=gif$|jpg$|png$)', 'gi' ),
		offImgChk = new RegExp ( offKey + '.(?=gif$|jpg$|png$)', 'gi' );
	if ( onImgChk.test ( src ) ) {
		return { isOn: true, onSrc: src, offSrc: src.replace ( onImgChk, offKey + '.' ) };
	} else {
		return { isOn: false, onSrc: src.replace ( offImgChk, onKey + '.' ),  offSrc: src };
	}
}/* imgOnOffCheck */


//2014-09-17 yongjun
function jsObjClick(obj , depth_arr){	 
	for ( var i = 0, len = depth_arr.length; i < len; i++ ) {
				var d1 = depth_arr [ i ]
				if(obj == d1){
					obj.addClass('click');	 
				}else{ 
					d1.removeClass('click');		 
				}
				d1.removeClass('on');
	}

}

/********************************************************************************************************
 * notice : 기본적으로 쓰이는 Script모음 ( jQuery 사용 )
*********************************************************************************************************/
( function ( window, jQuery ) {

	var agent = navigator.userAgent.toLowerCase ()
		, isChrome = /\bchrome/i.test( agent ) /*크롬브라우저체크*/
		, isMobile = ( /shw-m380|ipad|iphone|mobile|up.browser|android|blackberry|windows ce|nokia|webos|opera mini|sonyericsson|windows phone|iemobile|polaris/i.test( agent ) )/*모바일(아이패드포함)체크*/
		, msie = agent.match ( /\bmsie [0-9][0-9]?/i )
		, isLowPerform;

	msie = ( msie ) ? parseInt ( msie [0].replace ( 'msie ', '' ) ) : null;
	isLowPerform = ( msie && msie < 9 ) ? true: false;

	var $ = jQuery
		, root_wndw = $ ( window )
		, root_doc = $ ( document )
		, code = ( typeof naviCode === 'undefined' ) ? '000000' : naviCode
		, naviCodeD1 = parseInt ( code.substr ( 0, 2 ) )
		, naviCodeD2 = parseInt ( code.substr ( 2, 2 ) )
		naviCodeD3 = parseInt ( code.substr ( 4, 2 ) );


	// documenut ready
	root_doc.ready ( function () {

		var gnb
			, container = $ ( '#container' );

		gnb = new Gnb ( root_wndw, root_doc, container, naviCodeD1 );

		/* border */
		$ ( '.tblist tr:last-child' ).addClass ( 'last' );
		$ ( '.tbview tr:last-child' ).addClass ( 'last' );
		$ ( '.tbwrite tr:last-child' ).addClass ( 'last' );

	} );


	/********************************************************************************************************
		class
	*********************************************************************************************************/
	//GNB
	noticeCheck = true;
	if(noticeCheck){
		contentPosition = 227;
	} else {
		contentPosition = 155;
	}
	var Gnb = function ( wndw, doc, container, d1Code ) {		
		
		var chkMobile = isMobile
			, wr
			, imgOnOffChangeFn = imgOnOffChange
			, util_facebook
			, topWrap
			, header
			, gnb
			, depth1Arr
			, headerHeightOnD1 = 112
			, headerHeightOnD2 = 155
			, headerHeightOnD3 = 203
			, contentPTonD1 = parseInt($('#container').css('padding-top').split('px')[0])
			, contentPTonD1 = contentPosition
			, contentPTonD2 = contentPTonD1 + 70
			, contentPTonD3 = contentPTonD2 + 50
			, isD2Open = false
			, isD3Open = false
			, curD1
			, clickedD1
			, clickedD2
			, defD1
			, curD2
			, defD2
			, gnbOutTimer;

		function init () {
			wr = $ ( '#headerWr' );
			ss = $ ( '#headerWr' );
			topWrap = wr.find ( '> .topWrap' );
			header = topWrap.find ( '> .header' );
			gnbWrap = header.find ( '> .gnb' );
			depth1Arr = toArray ( gnbWrap.find ( '> ul > li > a' ) );
			setDepth1 ();
		}
		function setDepth1 () {
			for ( var i = 0, len = depth1Arr.length; i < len; i++ ) {
				var d1 = depth1Arr [ i ]
					, d2Con = d1.next ( '.depth2' )
					, d2Arr = toArray ( d2Con.find ( '> ul > li > a' ) )
				setDepth2 ( d2Arr );
				d1.data ( { d2Con: d2Con, d2Arr: d2Arr, isClick: false, memWidth: 0 } );
			}
		}

		function setDepth2 ( arr ) {
			for ( var i = 0, len = arr.length; i < len; i++ ) {
				var d2 = arr [ i ]
					, d3Con = d2.next ( '.depth3' )
					, d3Arr = toArray ( d3Con.find ( '> ul > li > a' ) );
				setDepth3 ( d3Arr );
				d2.data ( { d3Con: d3Con, d3Arr: d3Arr, isClick: false } );
			}
			
		}

		function setDepth3 ( arr ) {
			for ( var i = 0, len = arr.length; i < len; i++ ) {
				var d3 = arr [ i ];
			}
		}

		function toArray ( collection ) {
			var arr = [];
			for ( var i = 0, len = collection.length; i < len; i++ ) {
				var obj = collection.eq ( i );
				arr.push ( obj );
			}
			return arr;
		}

		function addEventListeners () {
			if ( isMobile ) {
				wndw.on ( 'touchmove', scrollHn );
			} else {
				wndw.on ( 'scroll', scrollHn );
			}

			for ( var i = 0, len = depth1Arr.length; i < len; i++ ) {
				var d1 = depth1Arr [ i ]
					, d2Arr = d1.data ( 'd2Arr' );
				d1.on ( 'focusin mouseenter', { origin: d1 }, d1Hn );
				for ( var j = 0, jLen = d2Arr.length; j < jLen; j++ ) {
					var d2 = d2Arr [ j ]
						, d3Arr = d2.data ( 'd3Arr' );
					d2.on ( 'focusin mouseenter', { origin: d2 }, d2Hn );
					for ( var k = 0, kLen = d3Arr.length; k < kLen; k++ ) {
						var d3 = d3Arr [ k ];
					}
					if ( chkMobile && kLen > 0 ) {
						d2.on ( 'click', { origin: d2}, d2Hn );
					}
				}
				if ( chkMobile && jLen > 0 ) {
					d1.on ( 'click', { origin: d1 }, d1Hn );
				}
			}
			topWrap.on ( 'mouseenter mouseleave', gnbWrapHn );
			gnbWrap.on ( 'focusenter focusleave', gnbWrapHn );
		}

		function d1Hn ( e ) {
			if(noticeCheck){
				contentPosition = 227;
			} else {
				contentPosition = 155;
			}
			contentPTonD1 = contentPosition;
			contentPTonD2 = contentPTonD1 + 70;
			contentPTonD3 = contentPTonD2 + 50;
			var target = e.data.origin
				, img = target.data ( 'img' )
				, d2Con = target.data ( 'd2Con' )
				, duration = 300;
			switch ( e.type ) {
				case 'focusin':
					duration = 0; 
					jsObjClick(curD1 , depth1Arr); //2014-09-17
				case 'mouseenter':
					if ( gnbOutTimer ) {
						clearTimeout ( gnbOutTimer );
					}
					topWrap.addClass ( 'on' );
					//2014-09-17 yongjun
					if(target){
						 target.addClass ( 'on' );
					}	
					if ( curD1 ) {
						if ( curD1 != target ) {
							curD1.data ( 'd2Con' ).css ( { display: 'none' } );
							curD1.removeClass ( 'on' ); //2014-09-17 yongjun
							//return;
						}

						if ( curD2 ) {
							if ( curD2.data ( 'd3Con' ).length != 0 ) {
								curD2.data ( 'd3Con' ).css ( { display: 'none' } );
								curD2.data ( 'd3Con' ).find ( 'ul > li > a' ).css ( { backgroundPosition: '0 -17px' } );
							}
							curD2.removeClass ( 'on' );
							curD2 = null;
						}
					}

					imgOnOffChangeFn ( img, true );
					
					
					if ( d2Con.length != 0 ) {
						d2Con.css ( { display: 'block' } );
						
						//gnbWrap.css ( { height: headerHeightOnD2 - 71 } );
						//header.stop ().animate ( { height: headerHeightOnD2 }, duration, function () {
//							container.stop ().animate ( { paddingTop: contentPTonD2 }, duration );
						//} );
						var upperSize = wr.width();
						if(target.data('memWidth') != upperSize){
							target.data ( 'memWidth', upperSize );
							var arr = target.data ('d2Arr');
							var sumWidth = 0;
							for ( var i = 0, len = arr.length; i < len; i++ ) {
								sumWidth = sumWidth + arr [ i ].outerWidth(true); 
							}
							if(sumWidth > (upperSize)){
								sumWidth = 0;
								for ( var i = 0, len = arr.length; i < len; i++ ) {
									if(gnbWrap.width() < 810){
										arr [ i ].css({padding:'10px 7px'}).css({'font-size':'10.7px'});
									}else{
										arr [ i ].css({padding:'10px 7px 5px 7px'}).css({'font-size':'10.7px'});
									}
									sumWidth = sumWidth + arr [ i ].outerWidth(true);
								}	
							}
							d2Con.css ( { width:  (sumWidth + 5)+'px'} );
							
							var clickLeft = d2Con.offset().left;
							var displayWidth = sumWidth + clickLeft;

							/*
							var pos = displayWidth-upperSize;
							
							if(pos > 10 ){
								var calcLeft = Math.ceil((displayWidth-upperSize)) * -1;
								d2Con.css ( { left:  calcLeft+'px'} );
							}
							*/
							
							var pos = displayWidth-upperSize;
							
							if(pos > 10 ){
								var calcLeft = clickLeft - pos;
								d2Con.offset ( { left:  calcLeft} );
							}
						
						}

					} else {
						gnbWrap.css ( { height: headerHeightOnD1 - 71 } );
						//header.stop ().animate ( { height: headerHeightOnD1 }, duration, function () {
//							container.stop ().animate ( { paddingTop: contentPTonD1 }, duration );
						//} );

					}
					curD1 = target;
					break;
				case 'click':
					if ( clickedD1 && clickedD1 != target ) {
						clickedD1.data ( 'isClick', false );
					}
					var isClick = target.data ( 'isClick' );

					clickedD1 = target;
					if ( !isClick ) {
						e.preventDefault ();
						target.data ( 'isClick', true );
					} else {
						console.log ( '링크로' );
					}
			}
		}

		function d2Hn ( e ) {
			if(noticeCheck){
				contentPosition = 227;
			} else {
				contentPosition = 155;
			}
			contentPTonD1 = contentPosition;
			contentPTonD2 = contentPTonD1 + 70;
			contentPTonD3 = contentPTonD2 + 50;
			var target = e.data.origin
				, img = target.data ( 'img' )
				, d3Con = target.data ( 'd3Con' )
				, duration = 300;

			switch ( e.type ) {
				case 'focusin':
					duration = 0;			 
					jsObjClick(curD1 , depth1Arr); //2014-09-17
				case 'mouseenter':
					if ( gnbOutTimer ) {
						clearTimeout ( gnbOutTimer );
					}
					if ( curD2 ) {
						if ( curD2 == target ) {
							return;
						}
						if ( curD2.data ( 'd3Con' ).length != 0 ) {
							curD2.data ( 'd3Con' ).css ( { display: 'none' } );
							curD2.data ( 'd3Con' ).find ( 'ul > li > a' ).css ( { backgroundPosition: '0 -17px' } );
						}
						curD2.removeClass ( 'on' );
					}
					if ( d3Con.length != 0 ) {
						target.addClass ( 'on' );
						d3Con.find ( 'ul > li > a' ).css ( { backgroundPosition: '0 17px' } );
						d3Con.css ( { display: 'block' } );
						gnbWrap.css ( { height: headerHeightOnD3 - 71 } );
						//header.stop ().animate ( { height: headerHeightOnD3 }, duration, function () {
//							container.stop ().animate ( { paddingTop: contentPTonD3 }, duration );
						//} );
					} else {
						//gnbWrap.css ( { height: headerHeightOnD2 - 71 } );
						//header.stop ().animate ( { height: headerHeightOnD2 }, duration, function () {
//							container.stop ().animate ( { paddingTop: contentPTonD2 }, duration );
						//} );

					}
					curD2 = target;
					break;
				case 'click':

					if ( clickedD2 && clickedD2 != target ) {
						clickedD2.data ( 'isClick', false );
					}
					var isClick = target.data ( 'isClick' );
					clickedD2 = target;
					if ( !isClick ) {
						e.preventDefault ();
						target.data ( 'isClick', true );
					} else {

					}
					break;
			}
		}

		function gnbWrapHn ( e ) {
			var duration = 300;
			if ( gnbOutTimer ) {
				clearTimeout ( gnbOutTimer );
			}
			switch ( e.type ) {
				case 'mouseenter':
				case 'focusenter':
					//console.log ( 'focusenter' );
					break;
				case 'focusleave':
					duration = 0;
				case 'mouseleave':
					gnbOutTimer = setTimeout ( gnbOut, 700 );
					break;
			}
		}

		function gnbOut () {
			
			var duration = 300;
			if ( curD1 ) {
				curD1.removeClass('on'); // 2014-09-17 yongjun
				imgOnOffChangeFn ( curD1.data ( 'img' ), false );
				curD1.data ( 'd2Con' ).css ( { display: 'none' } );
				curD1 = null;
			 
			}
			
			if ( defD1 ) {
				imgOnOffChangeFn ( defD1.data ( 'img' ), true );
				curD1 = defD1;
			}
			if ( curD2 ) {
				if ( curD2.data ( 'd3Con' ).length != 0 ) {
					curD2.data ( 'd3Con' ).css ( { display: 'none' } );
					curD2.data ( 'd3Con' ).find ( 'ul > li > a' ).css ( { backgroundPosition: '0 -17px' } );
				}
				curD2.removeClass ( 'on' );
				curD2 = null;
			}
			
			if ( clickedD1 ) {
				clickedD1.data ( 'isClick', false );
			}
			if ( clickedD2 ) {
				clickedD2.data ( 'isClick', false );
			}
			/* 여기를 막지 않으면 IE에서 메뉴가 출력되지 않는다 
			gnbWrap.stop ().animate ( { height: headerHeightOnD1 - 71 }, duration );
//			container.stop ().animate ( { paddingTop: contentPTonD1 }, duration );
			if ( header.css ( 'height' ) == headerHeightOnD1 + 'px' ) {
				topWrap.removeClass ( 'on' );
				return;
			}
			//header.stop ().animate ( { height: headerHeightOnD1 }, duration, function () {
			//topWrap.removeClass ( 'on' );
			//} );
			*/
		}

		function scrollHn ( e ) {
			if ( doc.scrollTop () == 0 ) {
				wr.removeClass ( 'on' );
			} else {
				wr.addClass ( 'on' );
			}
		}

		init ();
		addEventListeners ();
	}; /* Gnb */


} ) ( window, jQuery );