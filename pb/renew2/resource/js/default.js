var uagent = navigator.userAgent.toLocaleLowerCase();
var Default = {
    filterAccordion : function() {
        var _$filterWrap = $( '.filter_accordion' );
        var _$filterDepth1 = $( '.filter_accordion .title_contents .title' );
        var _$filterArrow = $( '.filter_accordion .title_contents .btn_open' );
        var _$filterDepth2 = $( '.filter_accordion .filter_contents .depth2' );
        var _$filterConts = $( '.filter_accordion .filter_contents' );
        var _$amoreSelect = $( '.filter_amore' );
        var _$writeDate = $( '.write_date' );
        var _$col1Btn = $( '.filter_popup .one_btn' );
        var _$choiceBtn = $( '.filter_popup .one_btn .btn_choice' );
        var _$col2Btn = $( '.filter_popup .two_btn' );
        var _$applyBtn = $( '.filter_popup .two_btn .btn_apply' );

        _$col1Btn.hide();

		_$filterWrap.each(function (index){

			var _$this = $(this);

			var _$filterDepth1 = _$this.find( '.title_contents .title' );
			var _$filterArrow = _$this.find( '.title_contents .btn_open' );

			_$filterDepth1.add( _$filterArrow ).on( 'click', function(e){
				e.stopPropagation();
				if ( _$this.hasClass( 'on' ) ) {
					_$filterDepth1.removeClass( 'active' );
					_$filterArrow.removeClass( 'active' ).text( '열기' );
					_$filterConts.slideUp();
					_$filterWrap.show().removeClass( 'on' )
					_$amoreSelect.show();
                    _$writeDate.show();
					_$col1Btn.hide();
					_$col2Btn.show();

				try {
					Filter.filterChange();
				} catch (e) {
				}

				} else {
					_$this.addClass( 'on' )
					_$filterDepth1.addClass( 'active' );
					_$filterArrow.addClass( 'active' ).text( '닫기' );
					_$this.find( _$filterConts ).slideDown();
					_$this.siblings().hide();
					_$col1Btn.show();
					_$col2Btn.hide();
				}
			});
		});

        _$filterDepth2.click(function(){
            if( $(this).next().hasClass( 'on' ) ){
                _$filterDepth2.removeClass( 'active' );
                _$filterDepth2.next().slideUp().removeClass( 'on' );
            } else {
                _$filterDepth2.removeClass( 'active' );
                _$filterDepth2.next().slideUp().removeClass( 'on' );
                $(this).next().slideDown().addClass( 'on' );
                $(this).addClass( 'active' );
            }
        });

        // 선택 버튼 클릭시 아코디언 닫힘
        _$choiceBtn.click(function(){
        	_$filterWrap.scrollTop(0).show().removeClass( 'on' );
        	_$filterArrow.removeClass( 'active' ).text( '열기' );
            _$filterDepth1.removeClass( 'active' );
            _$filterConts.slideUp();
            _$amoreSelect.show();
            _$writeDate.show();
            _$col1Btn.hide();
            _$col2Btn.show();
        });

        // 적용 버튼 클릭시 팝업 닫힘
        _$applyBtn.click(function(){
            Default.popupHide($('.layer_popup'));
        });
    },

    getCategory : function() {
        var _$depth2Title = $( '.depth2' );
        var _$cateListWrap = $( '.cate_list' );
        var _$cateList = $( '.cate_wrap li' );
        var _$choiceCate = $( '.choice_cate .choice_wrap' );
        var _$choiceCateTxt = $( '.choice_cate .choice_wrap .txt' );

        _$choiceCateTxt.addClass( 'on' );

        _$cateList.each(function (index){
            var _maxNum = 2;

            $(this).click(function() {
                var _choiceItem = $(this).text();
                var _choiceIndex = $('.cate_wrap li').index(this);

                // console.log(_choiceItem, _choiceIndex);

                if ( $(this).hasClass( 'on' ) ) {
                    $(this).removeClass( 'on' );

                    $( '.choice_cate .choice_value[data-index= '+_choiceIndex+' ]' ).remove();

                } else {
                    if( _maxNum >= $( '.cate_list li.on' ).length ){
                        $(this).addClass( 'on' );

                        var getInfo = [];

                        getInfo.push( '<span class="choice_value" data-index="'+ _choiceIndex +'">' );
                        getInfo.push( '<span>'+ _choiceItem +'</span>' );
                        getInfo.push( '</span>' );

                        _$choiceCate.append( getInfo.join('') );
                    }
                }

                _$depth2Title.each(function (index){
                    if ( $(this).next( _$cateListWrap ).find( 'li.on' ).length > 0 ){
                        $(this).addClass( 'on' );
                    } else {
                        $(this).removeClass( 'on' );
                    }
                });

                if ( $('.choice_cate .choice_value').length > 0 ) {
                    _$choiceCateTxt.removeClass( 'on' )
                } else {
                    _$choiceCateTxt.addClass( 'on' );
                }
            });
        });
    },

    getBrand : function(maxSelect) {
        var _$brandList = $( '.brand_list li' );
        var _$choiceBrand = $( '.choice_brand .choice_wrap' );
        var _$choiceTxt = $( '.choice_brand .choice_wrap .txt' );

        _$choiceTxt.addClass( 'on' );

        _$brandList.each(function (index){
            var _maxNum = maxSelect || 3;

            $(this).click(function() {
                var _choiceItem = $(this).text();
                var _choiceIndex = $(this).index();

                // console.log(_choiceItem, _choiceIndex);

                if ( $(this).hasClass( 'on' ) ) {
                    $(this).removeClass( 'on' );

                    $( '.choice_brand .choice_value[data-index= '+_choiceIndex+' ]' ).remove();
                } else {
                    if( (_maxNum - 1) >= $( '.brand_list li.on' ).length ){
                        $(this).addClass( 'on' );

                        var getInfo = [];

                        getInfo.push( '<span class="choice_value" data-index="'+ _choiceIndex +'">' );
                        getInfo.push( '<span>'+ _choiceItem +'</span>' );
                        getInfo.push( '</span>' );

                        _$choiceBrand.append( getInfo.join('') );
                    }
                }

                if ( $('.choice_brand .choice_value').length > 0 ) {
                    _$choiceTxt.removeClass( 'on' )
                } else {
                    _$choiceTxt.addClass( 'on' );
                }
            });
        });
    },

    getKeyword : function() {
        var _$KeywordList = $( '.keyword_list li' );
        var _$choiceKeyword = $( '.choice_keyword .choice_wrap' );
        var _$choiceTxt = $( '.choice_keyword .choice_wrap .txt' );

        _$choiceTxt.addClass( 'on' );

        _$KeywordList.each(function (index){
            var _maxNum = 2;

            $(this).click(function() {
                var _choiceItem = $(this).text();
                var _choiceIndex = $(this).index();

                // console.log(_choiceItem, _choiceIndex);

                if ( $(this).hasClass( 'on' ) ) {
                    $(this).removeClass( 'on' );

                    $( '.choice_keyword .choice_value[data-index= '+_choiceIndex+' ]' ).remove();
                } else {
                    if( _maxNum >= $( '.keyword_list li.on' ).length ){
                        $(this).addClass( 'on' );

                        var getInfo = [];

                        getInfo.push( '<span class="choice_value" data-index="'+ _choiceIndex +'">' );
                        getInfo.push( '<span>'+ _choiceItem +'</span>' );
                        getInfo.push( '</span>' );

                        _$choiceKeyword.append( getInfo.join('') );
                    }
                }

                if ( $('.choice_keyword .choice_value').length > 0 ) {
                    _$choiceTxt.removeClass( 'on' )
                } else {
                    _$choiceTxt.addClass( 'on' );
                }
            });
        });
    },

    setPrice : function (min, max) {

        if(!Default.isEmpty(min)) min = parseInt(min) || 0;
        else min = 0;
        if(!Default.isEmpty(max)) max = parseInt(max) || 100000000;
        else max = 100000000;

        // Price Range
        var _$priceRange = $( '#priceRange' );
        var _$minPrice = $( '#minPrice' );
        var _$maxPrice = $( '#maxPrice' );
        var _$priceValue = $( '.price_value' );
        var _$minValue = $( '.min_value' );
        var _$maxValue = $( '.max_value' );

        var options = {
            range: true,
            min: min,
            max: max,
            step: 500,
            values: [min, max],
            create: function () {
                _$minPrice.text( Default.commaSeparateNumber( min + '원' ) );
                _$maxPrice.text( Default.commaSeparateNumber( max + '원' ) );
            },
            slide: function (event, ui) {
                var mi = Default.commaSeparateNumber( ui.values[ 0 ] + '원' );
                var mx = Default.commaSeparateNumber( ui.values[ 1 ] + '원' );

                _$minPrice.text(mi);
                _$maxPrice.text(mx);

                setTimeout(function() {
                    _$minValue.text(mi).show();
                    _$maxValue.text(mx).show();
                }, 500);
            }
        };

        if ( _$priceRange.length > 0 ) {
            _$priceRange.slider( options );
        }

        _$priceValue.click(function(){
            _$priceRange.slider( 'values', 0, options.values[0] );
            _$priceRange.slider( 'values', 1, options.values[1] );

            var mi = Default.commaSeparateNumber( options.values[ 0 ] + '원' );
            var mx = Default.commaSeparateNumber( options.values[ 1 ] + '원' );

            _$minPrice.text(mi);
            _$maxPrice.text(mx);
            _$minValue.text('').hide();
            _$maxValue.text('').hide();

            try {
                Filter.filterChange();
            } catch (e) {
            }
        });
    },

    getBeautyProfile : function( _type ) {
        var _$limitedWrap = $( '.beauty_profile' );
        var _$limitedList = $( '.no_limit_list ul li', _$limitedWrap );
        var _$choiceBeautyProfile = $( '.choice_wrap', _$limitedWrap );
        var _$type = _type;

        _$limitedList.each(function (index){
            var _$this = $(this);

            //_$this.attr( 'data-index', index );

            var _parent = _$this.parents( 'ul' );
            var _checkType = _parent.attr( 'class' );
            var _checkTitle = _parent.prev( 'h3' ).text();
            var _choiceItem = _$this.text();
            var _choiceIndex = _$this.attr( 'data-index' );
            var _allCheck = $( '[data-select=checkAll]', _parent );
            var _allCheckName = _allCheck.attr( 'data-select' );
            var _allCheckChoice = _allCheck.text();
            var _allCheckIndex = _allCheck.attr( 'data-index' );
            var _oneCheckName = _$this.attr( 'data-select' );
            var _oneCheck = $( '[data-select=checkOne]', _parent );


            _$this.on( 'click', function () {

                if ( _$this.data('select') == 'checkAll' ) {
                    if( $(this).hasClass( 'on' ) ) {
                        //$(this).removeClass( 'on' );

                        //$( '.beauty_profile .choice_value[data-index= '+_choiceIndex+' ]' ).remove();
                    } else {
                        $(this).addClass( 'on' );
                        $(this).parents( 'ul' ).find( '[data-select=checkOne]' ).removeClass( 'on' );

                        $( '.beauty_profile .choice_value[data-type= '+ _checkType +']' ).remove();

                        var getInfo = [];

                        getInfo.push( '<span class="choice_value" data-select="'+ _allCheckName +'" data-index="'+ _choiceIndex +'">' );
                        getInfo.push( '<span>'+ _checkTitle +''+ _choiceItem +'</span>' );
                        getInfo.push( '</span>' );

                        _$choiceBeautyProfile.append( getInfo.join('') );
                    }

                } else if ( _$this.data('select') == 'checkOne' ) {

                    if ( _$type == 'revewMypage' ) {

                        if( $(this).hasClass( 'on' ) ){
                            //_allCheck.removeClass( 'on' );
                            $(this).removeClass( 'on' );

                            $( '.beauty_profile .choice_value[data-index= '+_choiceIndex+' ]' ).remove();
                        } else {
                            _allCheck.removeClass( 'on' );
                            _oneCheck.removeClass( 'on' );

                            $( '.beauty_profile .choice_value[data-type= '+ _checkType +']' ).remove();
                            $( '.beauty_profile .choice_value[data-index= '+ _allCheckIndex +' ]' ).remove();

                            $(this).addClass( 'on' );

                            var getInfo = [];

                            getInfo.push( '<span class="choice_value" data-type="'+ _checkType +'" data-index="'+ _choiceIndex +'">' );
                            getInfo.push( '<span>'+ _choiceItem +'</span>' );
                            getInfo.push( '</span>' );

                            _$choiceBeautyProfile.append( getInfo.join('') );
                        }

                    } else if ( _$type == 'searchProduct' ) {

                        if( $(this).hasClass( 'on' ) ){
                            //_allCheck.removeClass( 'on' );
                            $(this).removeClass( 'on' );

                            $( '.beauty_profile .choice_value[data-index= '+_choiceIndex+' ]' ).remove();
                        } else {
                            checkBoxLength = $(this).parents( 'ul' ).find( '[data-select='+ _oneCheckName +']' ).length;
                            checkedLength = $(this).parents( 'ul' ).find( '[data-select='+ _oneCheckName +'].on' ).length + 1;

                            if( checkBoxLength == checkedLength ) {
                                //_allCheck.addClass( 'on' );
                                _oneCheck.removeClass( 'on' );

                                $( '.beauty_profile .choice_value[data-type= '+ _checkType +']' ).remove();

                                //var getInfo = [];

                                //getInfo.push( '<span class="choice_value" data-select="'+ _allCheckName +'"  data-index="'+ _allCheckIndex +'">' );
                                //getInfo.push( '<span>'+ _checkTitle +''+ _allCheckChoice +'</span>' );
                                //getInfo.push( '</span>' );

                                //_$choiceBeautyProfile.append( getInfo.join('') );
                            
                            } else {

                                _allCheck.removeClass( 'on' );
                                $(this).addClass( 'on' );

                                $( '.beauty_profile .choice_value[data-index= '+ _allCheckIndex +' ]' ).remove();

                                var getInfo = [];

                                getInfo.push( '<span class="choice_value" data-type="'+ _checkType +'" data-index="'+ _choiceIndex +'">' );
                                getInfo.push( '<span>'+ _choiceItem +'</span>' );
                                getInfo.push( '</span>' );

                                _$choiceBeautyProfile.append( getInfo.join('') );
                            }
                        }

                    }
                }

                if ( $(this).parents( 'ul' ).find( '[data-select='+ _oneCheckName +'].on' ).length == 0 ) {
                    _allCheck.addClass( 'on' );

                    var getInfo = [];

                    getInfo.push( '<span class="choice_value" data-select="'+ _allCheckName +'"  data-index="'+ _allCheckIndex +'">' );
                    getInfo.push( '<span>'+ _checkTitle +''+ _allCheckChoice +'</span>' );
                    getInfo.push( '</span>' );

                    _$choiceBeautyProfile.append( getInfo.join('') );
                }

                try {
                    Filter.filterChangeBeautyProfile($(this).parents('ul').prop('id'), _$this.data('val'));
                } catch (e) {
                }
            });
        });
    },

    getReviewType : function() {
        var _$limitedList = $( '.review_type .no_limit_list ul li' );
        var _$choiceReviewType = $( '.review_type .choice_wrap' );

        _$limitedList.each(function (index){
            var _$this = $(this);

           // _$this.attr( 'data-index', index );

            var _parent = _$this.parents( 'ul' );
            var _choiceItem = _$this.text();
            var _choiceIndex = _$this.attr( 'data-index' );
            var _allCheck = $( '[data-select=checkAll]', _parent );
            var _allCheckName = _allCheck.attr( 'data-select' );
            var _allCheckChoice = _allCheck.text();
            var _allCheckIndex = _allCheck.attr( 'data-index' );
            var _oneCheck = $( '[data-select=checkOne]', _parent );
            var _oneCheckName = _oneCheck.attr( 'data-select' );

            _$this.on( 'click', function () {

                if ( _$this.data('select') == 'checkAll' ) {
                    if( $(this).hasClass( 'on' ) ) {
                        $(this).removeClass( 'on' );

                        $( '.review_type .choice_value[data-index= '+_choiceIndex+' ]' ).remove();
                    } else {
                        $(this).addClass( 'on' );
                        $( '[data-select=checkOne]', _parent ).removeClass( 'on' );

                        $( '.review_type .choice_value[data-select= '+ _oneCheckName +']' ).remove();

                        var getInfo = [];

                        getInfo.push( '<span class="choice_value" data-select="'+ _allCheckName +'" data-index="'+ _choiceIndex +'">' );
                        getInfo.push( '<span>'+ _choiceItem +'</span>' );
                        getInfo.push( '</span>' );

                        _$choiceReviewType.append( getInfo.join('') );
                    }

                } else if ( _$this.data('select') == 'checkOne' ) {

                    if( $(this).hasClass( 'on' ) ){
                        _allCheck.removeClass( 'on' );
                        $(this).removeClass( 'on' );

                        $( '.review_type .choice_value[data-index= '+_choiceIndex+' ]' ).remove();
                    } else {
                        checkBoxLength = $( '[data-select='+ _oneCheckName +']', _parent ).length;
                        checkedLength = $( '[data-select='+ _oneCheckName +'].on', _parent ).length + 1;

                        if( checkBoxLength == checkedLength ) {
                            _allCheck.addClass( 'on' );
                            _oneCheck.removeClass( 'on' );

                            $( '.review_type .choice_value[data-select= '+ _oneCheckName +']' ).remove();

                            var getInfo = [];

                            getInfo.push( '<span class="choice_value" data-select="'+ _allCheckName +'"  data-index="'+ _allCheckIndex +'">' );
                            getInfo.push( '<span>'+ _allCheckChoice +'</span>' );
                            getInfo.push( '</span>' );

                            _$choiceReviewType.append( getInfo.join('') );
                        } else {
                            _allCheck.removeClass( 'on' );
                            $(this).addClass( 'on' );

                            $( '.review_type .choice_value[data-index= '+ _allCheckIndex +' ]' ).remove();

                            var getInfo = [];

                            getInfo.push( '<span class="choice_value" data-select="'+ _oneCheckName +'" data-index="'+ _choiceIndex +'">' );
                            getInfo.push( '<span>'+ _choiceItem +'</span>' );
                            getInfo.push( '</span>' );

                            _$choiceReviewType.append( getInfo.join('') );
                        }
                    }
                }
            });
        });
    },

    getSeries : function() {
        var _$depth2Title = $( '.series .depth2' );
        var _$seriesListWrap = $( '.series_list' );
        var _$seriesList = $( '.series_wrap li' );
        var _$choiceSeries = $( '.series .choice_wrap' );
        var _$choiceSeriesTxt = $( '.series .choice_wrap .txt' );

        _$choiceSeriesTxt.addClass( 'on' );

        _$seriesList.each(function (index){
            var _maxNum = 2;

            $(this).click(function() {
                var _choiceItem = $(this).text();
                var _choiceIndex = $('.series_wrap li').index(this);

                // console.log(_choiceItem, _choiceIndex);

                if ( $(this).hasClass( 'on' ) ) {
                    $(this).removeClass( 'on' );

                    $( '.series .choice_value[data-index= '+_choiceIndex+' ]' ).remove();

                } else {
                    if( _maxNum >= $( '.series_list li.on' ).length ){
                        $(this).addClass( 'on' );

                        var getInfo = [];

                        getInfo.push( '<span class="choice_value" data-index="'+ _choiceIndex +'">' );
                        getInfo.push( '<span>'+ _choiceItem +'</span>' );
                        getInfo.push( '</span>' );

                        _$choiceSeries.append( getInfo.join('') );
                    }
                }

                _$depth2Title.each(function (index){
                    if ( $(this).next( _$seriesListWrap ).find( 'li.on' ).length > 0 ){
                        $(this).addClass( 'on' );
                    } else {
                        $(this).removeClass( 'on' );
                    }
                });

                if ( $('.series .choice_value').length > 0 ) {
                    _$choiceSeriesTxt.removeClass( 'on' )
                } else {
                    _$choiceSeriesTxt.addClass( 'on' );
                }
            });
        });
    },

    getRankingPeriod : function() {
        var _$limitedList = $( '.ranking_period .no_limit_list ul li' );
        var _$choiceRankingPeriod = $( '.ranking_period .choice_wrap' );

        _$limitedList.each(function (index){
            var _$this = $(this);

            //_$this.attr( 'data-index', index );

            var _parent = _$this.parents( 'ul' );
            var _choiceItem = _$this.text();
            var _choiceIndex = _$this.attr( 'data-index' );
            var _allCheck = $( '[data-select=checkAll]', _parent );
            var _allCheckName = _allCheck.attr( 'data-select' );
            var _allCheckChoice = _allCheck.text();
            var _allCheckIndex = _allCheck.attr( 'data-index' );
            var _oneCheck = $( '[data-select=checkOne]', _parent );
            var _oneCheckName = _oneCheck.attr( 'data-select' );

            _$this.on( 'click', function () {

                if ( _$this.data('select') == 'checkAll' ) {
                    if( $(this).hasClass( 'on' ) ) {
                        //$(this).removeClass( 'on' );

                        //$( '.ranking_period .choice_value[data-index= '+_choiceIndex+' ]' ).remove();
                    } else {
                        $(this).addClass( 'on' );
                        $( '[data-select=checkOne]', _parent ).removeClass( 'on' );

                        $( '.ranking_period .choice_value[data-select= '+ _oneCheckName +']' ).remove();

                        var getInfo = [];

                        getInfo.push( '<span class="choice_value" data-select="'+ _allCheckName +'" data-index="'+ _choiceIndex +'">' );
                        getInfo.push( '<span>'+ _choiceItem +'</span>' );
                        getInfo.push( '</span>' );

                        _$choiceRankingPeriod.append( getInfo.join('') );
                    }

                } else if ( _$this.data('select') == 'checkOne' ) {

                    _allCheck.removeClass( 'on' );
                    _oneCheck.removeClass( 'on' );
                    $(this).addClass( 'on' );

                    $( '.ranking_period .choice_value[data-select= '+ _oneCheckName +']' ).remove();
                    $( '.ranking_period .choice_value[data-index= '+ _allCheckIndex +' ]' ).remove();

                    var getInfo = [];

                    getInfo.push( '<span class="choice_value" data-select="'+ _oneCheckName +'" data-index="'+ _choiceIndex +'">' );
                    getInfo.push( '<span>'+ _choiceItem +'</span>' );
                    getInfo.push( '</span>' );

                    _$choiceRankingPeriod.append( getInfo.join('') );
                }
            });
        });
    },

    getWriteDate : function() {
        var _$dateInput = $( '.write_date' );

        _$dateInput.on( 'change', function() {
            Default.setWriteDate();
            try {
                Filter.filterChange();
            } catch (e) {
            }
        });
    },

    setWriteDate : function() {

        var _$choiceWriteDate = $( '.write_date .choice_wrap' );
        var _$dateInputVal = $( '#writeDate' ).val();

        if ( _$dateInputVal ) {
            var format = new Date( _$dateInputVal );

            var getFormat = [];

            getFormat.push( '<span class="choice_value"><span>'+ format.getFullYear(), addPrefix(format.getMonth() + 1), addPrefix(format.getDate()) +'</span></span>' );

            _$choiceWriteDate.html( getFormat.join('.') );

            _$choiceWriteDate.find(".choice_value").click(function(e) {
                e.preventDefault();

                $(this).remove();
                var _today = new Date();
                $( '#writeDate' ).val( _today );

                try {
                    Filter.filterChange();
                } catch (e) {
                }
            });
        }

        function addPrefix( str ) {
            return ( '0' + str ).slice( -2 );
        }
    },

    valueDelete : function ( _this, _type ) {

        var _$noLimitList = $( '.filter_accordion .no_limit_list ul li' );
        var _delIndex = _this.attr( 'data-index' );

        var _thisIndex = _$noLimitList.eq(' '+ _delIndex +' ');
        var _checkTitle = _thisIndex.parents( 'ul' ).prev( 'h3' );
        var _checkTitleText = _checkTitle.text();
        var _allCheck = _thisIndex.siblings( '[data-select=checkAll]' );
        var _allCheckName = _allCheck.attr( 'data-select' );
        var _allCheckChoice = _allCheck.text();
        var _allCheckIndex = _allCheck.attr( 'data-index' );

        var _$choiceValue = _thisIndex.parents( '.filter_contents' ).prev( '.title_contents' ).find( '.choice_wrap' );

        if ( _type ) {
            if ( _this.data('select') == 'checkAll' ) {
                return;
            } else {
                _this.remove();

                _thisIndex.removeClass( 'on' );
                
                if ( _thisIndex.siblings( '[data-select=checkOne].on' ).length == 0 ) {
                    _allCheck.addClass( 'on' );

                    var getInfo = [];

                    getInfo.push( '<span class="choice_value" data-select="'+ _allCheckName +'"  data-index="'+ _allCheckIndex +'">' );
                    getInfo.push( '<span>'+ _checkTitleText +''+ _allCheckChoice +'</span>' );
                    getInfo.push( '</span>' );

                    _$choiceValue.append( getInfo.join('') );
                }
            }
        } else {
            _this.remove();

            _thisIndex.removeClass( 'on' );
        }
    },

    limitedListIndex : function () {
        var _$limitedList = $( '.filter_accordion .no_limit_list ul li' );
        _$limitedList.each(function (index){
            var _$this = $(this);
            _$this.attr( 'data-index', index );
        });
    },

    limitedListDefault : function () {
        $( '.no_limit_list ul' ).each(function (index){
            var _this = $(this);
            var _parent = _this.parents( '.no_limit_list' );
            var _checkTitle = _this.prev( 'h3' );
            var _checkTitleText = _checkTitle.text();
            var _allCheck = $( '[data-select=checkAll]', _this );
            var _allCheckName = _allCheck.attr( 'data-select' );
            var _allCheckChoice = _allCheck.text();
            var _allCheckIndex = _allCheck.attr( 'data-index' );
            var _$choiceValue = _this.parents( '.filter_contents' ).prev( '.title_contents' ).find( '.choice_wrap' );

            _allCheck.addClass('on');

            var getInfo = [];

            getInfo.push( '<span class="choice_value" data-select="'+ _allCheckName +'" data-index="'+ _allCheckIndex +'">' );
            if ( _checkTitle.length > 0 ) {
                getInfo.push( '<span>'+ _checkTitleText +''+ _allCheckChoice +'</span>' );
            } else {
                getInfo.push( '<span>'+ _allCheckChoice +'</span>' );
            }

            getInfo.push( '</span>' );

            _$choiceValue.append( getInfo.join('') );
        });
    },

    filterReset : function() {
        $( '.choice_wrap .txt' ).addClass( 'on' );
        $( '.choice_value' ).remove();

        $( '.depth2' ).removeClass( 'on' );
        $( '.cate_wrap li' ).removeClass( 'on' );
        $( '.brand_list li' ).removeClass( 'on' );
        $( '.series_list li' ).removeClass( 'on' );
        $( '.keyword_list li' ).removeClass( 'on' );
        $( '.no_limit_list li' ).removeClass( 'on' );

        $( '#switch' ).prop( 'checked', false );
        $( '#beauty' ).prop( 'checked', false );
        Default.limitedListDefault();
        $("#writeDate").val('');
        if($( '.price_value' ).length > 0) {
            $( '.price_value' ).click();
        } else {
            try {
                Filter.filterChange();
            } catch (e) {
            }
        }
        $("#reportMore").removeClass("open");
    },

    getReply : function() {
        var _$replyWrap = $( '.comment_box' );
        var _$btnComment = $( '.comment_box .more_comment' );
        var _$btnReply = $( '.reply_write .btn_reply' );

        _$btnComment.each(function (index){
            $(this).click(function(){
            	if ( $(this).parents( _$replyWrap ).next( '.reply_box' ).is( ':visible' ) ) {
            		$(this).parents( _$replyWrap ).next( '.reply_box' ).hide();
            	} else {
	                $(this).parents( _$replyWrap ).next( '.reply_box' ).show();
                    $( 'html, body' ).animate( { scrollTop : ( $(this).offset().top - 50 +'px' ) }, 500 );
            	}
            });

            _$btnReply.click(function(){
                $(this).parent().addClass( 'on' );
                $(this).hide();
                $(this).next().show();
                $( 'html, body' ).animate( { scrollTop : ( $(this).next().offset().top - 100 +'px' ) }, 500 );
            });
        });
    },

	commentWrite : function() {
		var _$textareaWrap = $( '.comment_wrap' );
		var _$commentTextarea = $( '.textarea_wrap textarea', _$textareaWrap );
        var _$commentBtn = $( 'button', _$textareaWrap );

		_$commentTextarea.focus(function() {
			$(this).parents( '.comment_wrap' ).addClass( 'open' );

            _$commentBtn.click( function(e){
                e.preventDefault();
                $(this).parents( '.comment_wrap' ).removeClass( 'open' );
            })
        });

	},


	fixFixed : function() {
        var _$body = $( 'body' );
		var _$input = $( 'textarea, input[type=text], input[type=date], select, input[type=search]' );
        if( Device.iOS() ) {
    		_$input.each(function(){
    			var _$onFocus = $(this);

                _$onFocus.on( 'focus', function() {
                    //_$onFocus.scrollTop(0);
                    _$body.addClass( 'fixfixed' );
                });

    			_$onFocus.on( 'blur', function() {
    				$( 'html, body' ).removeClass( 'fixfixed' );
    			});
    		});
        };
	},

    tabSlide : function() {
        var _$scrollerWrap = $( '.contents_nav' ),
            _$scroller = $( '.scroll_wrap', _$scrollerWrap ),
            _$items = $( '.scroll_wrap li', _$scrollerWrap ),
            _$navAllWrap = $( '.nav_all' ),
            _$navAllItems = $( 'li', _$navAllWrap ),
            _$statusBar = $( '.scroll_wrap .bar', _$scrollerWrap ),
            _selectedIndex = 0,
            _navAllIndex = 0,
            _scrollerWidth = _$scroller.width(),
        	_$navAll = $( '.nav_all' ),
        	_$navMore = $( '.nav_more' ),
            _$btnNavMore = $( 'button', _$navMore ),
            _$navDim = $( '.nav_dim' );

        _$items.each(function(){
            selectItem();
        });

        if($('.channel_slide_wrap').length == 1){
            /* 채널 대메뉴 스와이프 추가 190213 */
            var contSlide = new Swiper('.channel_slide_wrap', {
                slidesPerView: 1,
                noSwiping : true,
                noSwipingClass : 'subscribe_to_magazine'
            });

            contSlide.on('slideChange', function () {

                var _slideIndex = contSlide.activeIndex;

                _$navAllItems.removeClass( 'on' );
                _$navAllItems.eq( _slideIndex ).addClass( 'on' );
                _$items.removeClass( 'selected' );
                _$items.eq( _slideIndex ).addClass( 'selected' );
                
                _$items.eq( _slideIndex ).find('a').trigger('change');
                
                var _navOnPosition = _$items.eq( _slideIndex ).find( 'a' ).position().left;
                var _navOnWidth = _$items.eq( _slideIndex ).width();

                focus( _navOnPosition );

                _$statusBar.css({ 'transform' : 'translate3d( '+ _navOnPosition +'px, 0px, 0px)', 'width' : _navOnWidth + 'px' });
            });
        }

        _$items.on('click', function(e) {
            e.preventDefault();
            _selectedIndex = _$items.index( $(this) );
            var _selected = _$items.eq( _selectedIndex );

            _$navAllItems.removeClass( 'on' );
            _$navAllItems.eq( _selectedIndex ).addClass( 'on' );
            _$items.removeClass( 'selected' );
            _selected.addClass( 'selected' );

            var _navOnPosition = _selected.find( 'a' ).position().left;
            var _navOnWidth = _selected.width();

            focus( _navOnPosition );

            _$statusBar.css({ 'transform' : 'translate3d( '+ _navOnPosition +'px, 0px, 0px)', 'width' : _navOnWidth + 'px' });

            if($('.channel_slide_wrap').length == 1){
                contSlide.slideTo(_selectedIndex);
            }
        });

        _$navAllItems.on('click', function(e) {
            e.preventDefault();
            _navAllIndex = _$navAllItems.index($(this));

            var _selectOn = _$navAllItems.eq( _navAllIndex );
            _$navAllItems.removeClass( 'on' );
            _selectOn.addClass( 'on' );
            _$items.removeClass( 'selected' );
            _$items.eq( _navAllIndex ).addClass( 'selected' );

            var _navOnPosition = _$items.eq( _navAllIndex ).find( 'a' ).position().left;
            var _navOnWidth = _$items.eq( _navAllIndex ).width();

            focus( _navOnPosition );

            _$statusBar.css({ 'transform' : 'translate3d( '+ _navOnPosition +'px, 0px, 0px)', 'width' : _navOnWidth + 'px' });

            _$navMore.removeClass( 'on' );
            _$navAll.slideUp().removeClass( 'open' );
            _$navDim.removeClass( 'on' );
            $( 'body' ).removeClass( 'scroll_lock' );

            if($('.channel_slide_wrap').length == 1){
                contSlide.slideTo(_navAllIndex);
            }

        });

        function selectItem() {
            var _selected = $( '.scroll_wrap li.selected' ),
                _selectedIndex = _selected.index();

            _$navAllItems.removeClass( 'on' );
            _$navAllItems.eq( _selectedIndex ).addClass( 'on' );

            var _navOnPosition = _selected.find( 'a' ).position().left;
            var _navOnWidth = _selected.width();

            focus( _navOnPosition );

            _$statusBar.css({ 'transform' : 'translate3d( '+ _navOnPosition +'px, 0px, 0px)', 'width' : _navOnWidth + 'px' });
        }

        function focus( originalLeft ) {
            _scroll = originalLeft - ( _scrollerWidth / 2 );
            _$scroller.stop().animate({
                scrollLeft: _scroll
            }, 800);
        }
        
        _$btnNavMore.off('click').on('click', function(){
        	
            if( $(this).parent().hasClass( 'on' ) ) {
                $(this).parent().removeClass( 'on' );
                _$navAll.slideUp( 300, function(){
                	_$navAll.removeClass( 'open' );
                });
                _$navDim.removeClass( 'on' );
                $( 'body' ).removeClass( 'scroll_lock' );
            } else {
            	
                $(this).parent().addClass( 'on' );
                _$navAll.slideDown( 300, function(){
                	_$navAll.addClass( 'open' );
                });
                _$navDim.addClass( 'on' );
                $( 'body' ).addClass( 'scroll_lock' );
            }
        });
	},

    contentsMore : function() {
        var _$txtImgArticle = $('.media_content .txt_img_article');
        var _$txtArticle = $('.media_content .txt_article');
        
        var _$txtArticleText = _$txtArticle.text();
        var _$txtArticleHtml = _$txtArticle.html();
        var _$txtArticleLength = _$txtArticleText.length;

        _$txtArticle.each( function(){
            $( document ).on( 'click', '.btn_view_all', function(e){
                e.preventDefault();
                _$txtArticle.addClass('open');
                //_$txtArticle.html( _$txtArticleHtml );
                $(this).removeClass( 'btn_view_all' ).addClass( 'btn_view_summary' ).text( '요약보기' );
            });

            $( document ).on( 'click', '.btn_view_summary', function(e){
                e.preventDefault();
                _$txtArticle.removeClass('open');
                //_$txtArticle.html( _$txtArticleText.substring(0, 90) + "......" + '<button type="button" class="btn_view_all">전체보기</button>' );
                $(this).removeClass( 'btn_view_summary' ).addClass( 'btn_view_all' ).text( '전체보기' );
            });
        });
        _$txtImgArticle.each( function(){
            $( document ).on( 'click', '.content_open .btn_view_all', function(e){
                e.preventDefault();
                _$txtImgArticle.addClass('open');
                $(this).removeClass( 'btn_view_all' ).addClass( 'btn_view_summary' ).text( '요약보기' );
            });
            $( document ).on( 'click', '.content_open .btn_view_summary', function(e){
                e.preventDefault();
                _$txtImgArticle.removeClass('open');
                $(this).removeClass( 'btn_view_summary' ).addClass( 'btn_view_all' ).text( '전체보기' );
            });
        });

	},

    focus : function(selector) {

        if(!selector.hasClass("selected")) {
            selector.addClass("selected");
        }

	    var _$scrollerWrap = $( '.contents_nav' ),
            scroller = $( '.scroll_wrap', _$scrollerWrap),
            _navOnWidth = selector.width(),
            _navOnPosition = selector.find( 'a' ).position().left;

        scroller.stop().animate({
            scrollLeft: _navOnPosition - ( scroller.width() / 2 )
        }, 800);

        $( '.scroll_wrap .bar', _$scrollerWrap ).css({ 'transform' : 'translate3d( '+ _navOnPosition +'px, 0px, 0px)', 'width' : _navOnWidth + 'px' });
    },

    commaSeparateNumber : function(val){
        while (/(\d+)(\d{3})/.test(val.toString())){
            val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        return val;
    },

    isEmpty : function (value){
        if(!value || value == "" || value == null || value == undefined || typeof value == 'undefined') {
            return true;
        }

        if(typeof value === 'string' && (value === "" || value.replace(/ /gi, "") === "")) {
            return true;

        } else if(typeof value === "object" && !Object.keys(value).length) {
            return true;

        } else {
            return false;
        }
    },

    popupShow : function($selector) {
        if($selector.length > 0) {
            $selector.addClass( 'open' ).attr( 'tabindex', '0' );
            $( 'body' ).addClass( 'scroll_lock' );
        }
    },

    popupHide : function($selector) {
        if($selector.length > 0) {
            $selector.removeClass( 'open' ).removeAttr( 'tabindex' );
            $( 'body' ).removeClass( 'scroll_lock' );
        }
    },

    // 커스텀 얼럿창 (0 : 아니요 GRAY COLOR / 1 : 예 BLUE COLOR)
    // apAlert : function(text, mode, href){
    //
    //     $("#reportMore .message p").html(text);
    //     Default.popupShow($('#reportMore'));
    //
    //     if(mode != null && href == null){ //TEXT와 MODE 만 입력된 경우
    //         $('#reportMore .pop_conts .btn_wrap a').eq(1).css("width", "50%");     //원래대로
    //         $('#reportMore .pop_conts .btn_wrap a').eq(0).css("display", ""); 	 //원래대로
    //         $('#reportMore .pop_conts .btn_wrap a').eq(1).attr("href", "javascript:;");
    //         $('#reportMore .pop_conts .btn_wrap a').eq(1).attr("onclick", mode);   //파란 버튼에 이벤트 추가
    //         $('#reportMore .pop_conts .btn_wrap a').eq(1).text("예");              //원래대로
    //
    //     }else if(mode != null && href != null){ // HREF 만 입력된 경우
    //         $('#reportMore .pop_conts .btn_wrap a').eq(1).css("width", "100%");    //파란 버튼
    //         $('#reportMore .pop_conts .btn_wrap a').eq(1).text("확인");
    //         $('#reportMore .pop_conts .btn_wrap a').eq(1).attr("href", href );
    //         $('#reportMore .pop_conts .btn_wrap a').eq(1).attr("onclick", mode);   //파란 버튼에 이벤트 추가
    //         $('#reportMore .pop_conts .btn_wrap a').eq(0).css("display", "none"); //회색 버튼 숨기기
    //
    //     }else{
    //         $('#reportMore .pop_conts .btn_wrap a').eq(1).css("width", "100%");   //파란 버튼
    //         $('#reportMore .pop_conts .btn_wrap a').eq(1).text("확인");
    //         $('#reportMore .pop_conts .btn_wrap a').eq(1).attr("href", "javascript:Default.popupHide($('#reportMore'));");
    //         $('#reportMore .pop_conts .btn_wrap a').eq(1).prop('onclick', null);
    //         $('#reportMore .pop_conts .btn_wrap a').eq(0).css("display", "none"); //회색 버튼 숨기기
    //     }
    //     $( 'body' ).removeClass( 'scroll_lock' );
    // },

    /*
    * 커스텀 얼럿창 (0 : 아니요 GRAY COLOR / 1 : 예 BLUE COLOR)
    * text : 얼럿창 문구
    * blueOnclickEvenet : 블루버튼 이벤트
    * href : 블루버튼 앵커태그의 href
    * greyOnclickEvent : 그레이버튼 이벤트
    * scrollYn : 화면이동 여부
    */
    apAlert : function(text, blueOnclickEvent, href, greyOnclickEvent, scrollYn){

        $("#reportMore .message p").html(text);
        Default.popupShow($('#reportMore'));
        var $alertSelector = $('#reportMore .pop_conts .btn_wrap a'),
            blueButton = $alertSelector.eq(1),
            greyButton = $alertSelector.eq(0);

        blueButton.attr("onclick", null);
        blueButton.attr("href", "javascript:void(0);");
        greyButton.attr("onclick", null);
        greyButton.attr("href","javascript:void(0);");

            // 블루버튼의 이벤트만 있고 그레이버튼은 노출되나 이벤트가 없음.
        if (!Default.isEmpty(blueOnclickEvent) && Default.isEmpty(href) && Default.isEmpty(greyOnclickEvent)){
            blueButton.css("width", "50%");     //원래대로
            greyButton.css("display", ""); 	 //원래대로
            if(!Default.isEmpty(scrollYn) && scrollYn == "N"){
            	blueButton.attr("onclick", blueOnclickEvent);
            	greyButton.attr("href","javascript:$('#reportMore').removeClass('open').removeAttr('tabindex');");
            }else{
            	blueButton.attr("onclick", blueOnclickEvent + " $( 'body' ).removeClass( 'scroll_lock' );");   //파란 버튼에 이벤트 추가
                greyButton.attr("href","javascript:Default.popupHide($('#reportMore'));");
            }
            
            blueButton.text("예");              //원래대로

            // 블루버튼의 이벤트와 앵커태그에 href 속성이 있는 경우
        } else if(!Default.isEmpty(blueOnclickEvent) && !Default.isEmpty(href)){
            blueButton.css("width", "100%");    //파란 버튼
            blueButton.text("확인");
            blueButton.attr("href", href);
            if(!Default.isEmpty(scrollYn) && scrollYn == "N"){
            	blueButton.attr("onclick", blueOnclickEvent);
            }else{
            	blueButton.attr("onclick", blueOnclickEvent + " $( 'body' ).removeClass( 'scroll_lock' );");   //파란 버튼에 이벤트 추가
            }
            greyButton.css("display", "none"); //회색 버튼 숨기기

            // 블루버튼과 그레이버튼 모두에 이벤트가 있는 경우
        } else if(!Default.isEmpty(blueOnclickEvent) && Default.isEmpty(href) && !Default.isEmpty(greyOnclickEvent)){
            blueButton.css("width", "50%");    // 파란 버튼
            if(!Default.isEmpty(scrollYn) && scrollYn == "N"){
            	blueButton.attr("onclick", blueOnclickEvent);
            }else{
            	blueButton.attr("onclick", blueOnclickEvent + " $( 'body' ).removeClass( 'scroll_lock' );");   // 파란 버튼에 이벤트 추가
            }
            blueButton.text("예");
            greyButton.css("display", ""); 	 // 회색버튼
            
            if(!Default.isEmpty(scrollYn) && scrollYn == "N"){
            	greyButton.attr("onclick", greyOnclickEvent);   // 회색버튼에 이벤트 추가
            }else{
            	greyButton.attr("onclick", greyOnclickEvent + " $( 'body' ).removeClass( 'scroll_lock' );");   // 회색버튼에 이벤트 추가
            }
            // 메세지만 있는 경우
        } else {
            blueButton.css("width", "100%");   //파란 버튼
            blueButton.text("확인");
            blueButton.attr("href", "javascript:Default.popupHide($('#reportMore')); $( 'body' ).removeClass( 'scroll_lock' );");
            greyButton.css("display", "none"); //회색 버튼 숨기기
        }
    },
     
    apAlertBack : function(text, blueOnclickEvenet, href, greyOnclickEvent, moveYn){
    	location.href= "toapp:::hideNavi";
        $("#reportMore .message p").html(text);
        Default.popupShow($('#reportMore'));
        var $alertSelector = $('#reportMore .pop_conts .btn_wrap a'),
            blueButton = $alertSelector.eq(1),
            greyButton = $alertSelector.eq(0);

            // 블루버튼의 이벤트만 있고 그레이버튼은 노출되나 이벤트가 없음.
        if (!Default.isEmpty(blueOnclickEvenet) && Default.isEmpty(href) && Default.isEmpty(greyOnclickEvent)){
            blueButton.css("width", "50%");     //원래대로
            greyButton.css("display", ""); 	 //원래대로
            blueButton.attr("href", "javascript:;");
            if(!Default.isEmpty(moveYn) || moveYn == "N"){
            	blueButton.attr("onclick", blueOnclickEvenet + " location.href = 'toapp:::showNavi';");   //파란 버튼에 이벤트 추가
            }else{
            	blueButton.attr("onclick", blueOnclickEvenet);
            }
            
            blueButton.text("예");              //원래대로

            // 블루버튼의 이벤트와 앵커태그에 href 속성이 있는 경우
        } else if(!Default.isEmpty(blueOnclickEvenet) && !Default.isEmpty(href)){
            blueButton.css("width", "100%");    //파란 버튼
            blueButton.text("확인");
            if(!Default.isEmpty(moveYn) || moveYn == "N"){
            	blueButton.attr("href", href  + " location.href = 'toapp:::showNavi'");
            	blueButton.attr("onclick", blueOnclickEvenet + " location.href = 'toapp:::showNavi'");   //파란 버튼에 이벤트 추가
            }else{
            	blueButton.attr("href", href);
            	blueButton.attr("onclick", blueOnclickEvenet);
            }
            greyButton.css("display", "none"); //회색 버튼 숨기기

            // 블루버튼과 그레이버튼 모두에 이벤트가 있는 경우
        } else if(!Default.isEmpty(blueOnclickEvenet) && Default.isEmpty(href) && !Default.isEmpty(greyOnclickEvent)){
            blueButton.css("width", "50%");    // 파란 버튼
            blueButton.attr("href", "javascript:;");
            if(!Default.isEmpty(moveYn) || moveYn == "N"){
            	blueButton.attr("onclick", blueOnclickEvenet + " location.href = 'toapp:::showNavi';");   // 파란 버튼에 이벤트 추가
            }else{
            	blueButton.attr("onclick", blueOnclickEvenet);
            }
            blueButton.text("예");
            greyButton.css("display", ""); 	 // 회색버튼
            greyButton.attr("onclick", greyOnclickEvent);   // 회색버튼에 이벤트 추가

            // 메세지만 있는 경우
        } else {
            blueButton.css("width", "100%");   //파란 버튼
            blueButton.text("확인");
            blueButton.attr("href", "javascript:Default.popupHide($('#reportMore')); location.href='toapp:::showNavi'");
            blueButton.prop('onclick', null);
            greyButton.css("display", "none"); //회색 버튼 숨기기
        }
        $( 'body' ).removeClass( 'scroll_lock' );
    },

    alert : function(text, callBack){

        if (!Default.isEmpty(callBack)) {
            if(confirm(text) && callBack && callBack instanceof Function) {
                callBack();
            }

        } else {
            alert(text);
        }
    },

    showLoading : function() {
        if($(".loading").length > 0) {
            $(".loading").show();
        }
    },

    hideLoading : function() {
        if($(".loading").length > 0) {
            $(".loading").hide();
        }
    },

    /*
    * 제품 수정 요청
    * requestCategory : 등록(I), 수정(U)
    * requestBrand : 브랜드
    * requestProduct: 상품
    */
    goRequest : function(requestCategory, requestBrand, requestProduct){
        if(!this.isEmpty(requestCategory)) {
            var url = "/renew/product/requestNew.do?requestCategory=" + requestCategory,
                title = "제품등록요청";

            if(requestCategory == "U" || requestCategory == "u") {
                title = "제품정보수정요청";
            }

            if(!this.isEmpty(requestCategory)) url += ("&requestBrand=" + requestBrand);
            if(!this.isEmpty(requestProduct)) url += ("&requestProduct=" + requestProduct);

            this.loginCheckNew(function() {
                Mobile.viewMove(url, 2, title);
            });
        }
    },

    loginCheck : function(loginYn, blueOnclick, href, greyOnclick, scrollYn) {
        if(loginYn == 'Y' ){
            return true;
        } else {
            this.apAlert("로그인 후 이용가능한 서비스입니다. 로그인 하시겠습니까?", blueOnclick || "Mobile.appLogin();Default.popupHide($('#reportMore'));", href || "", greyOnclick || "", scrollYn || "");
            return false;
        }
    },

    /*
   * 동의체크
   * requestCallback : 동의와 로그인 체크 이상 없을때 실해알 function
   * menuCd : 수정요청 화면으로 바로 호출 시 'update'라는 값을 사용
   * preCallback: 동의 또는 로그인을 하지 않았을 시 동의화면 또는 로그인창이 뜨기 전 실행 할 function
   */
    agreeCheck : function(requestCallback, menuCd, preCallback) {
        $.ajax({
            url : "/renew/mypage/agreePersonalSensitiveCheckAjax.do",
            dataType : "json",
            type : 'POST',
            data : {
            		menuCd : menuCd || '', 
            		"sessionKey" : $("#sessionKey").val()
            },
            beforeSend : function() {
                Default.showLoading();
            },
            success : function (data) {
                // 0이면 모두 동의 상태, 1이면 하나라도 비동의상태, 2이면 비로그인상태, 3이면 업데이트요청 진행가능상태
                if(data.successCode == 4 && !Default.isEmpty(data.blackPeriod) && !Default.isEmpty(data.blackDescription)) {
                    Mobile.blackUser(data.blackPeriod, data.blackDescription);

                } else if(data.successCode == 3 && !Default.isEmpty(menuCd)) {
                    if(preCallback && preCallback instanceof Function) {
                        preCallback();
                    }
                    Mobile.viewMove("/renew/mypage/agreePersonalSensitive.do?menuCd=" + menuCd, 0);
                } else if(data.successCode == 2) {
                    if(preCallback && preCallback instanceof Function) {
                        preCallback();

                    } else {
                        Default.loginCheck("N");
                    }
                    // 동의항목중 한개이상 비동의인 경우 동의를 유도하는 화면으로 보낸다.(업데이요청이 왔으나 동의내역이 없는 경우 포함)
                } else if(data.successCode == 1) {
                    if(preCallback && preCallback instanceof Function) {
                        preCallback();
                    }
                    Mobile.viewMove("/renew/mypage/agreePersonalSensitive.do" , 0);
                } else if(requestCallback && requestCallback instanceof Function) {
                    requestCallback();
                }
                
            },
            complete: function(e){
                Default.hideLoading();
            }
        });
    },

    loginCheckNew : function(callback) {
        $.ajax({
            url : "/renew/mypage/loginCheckAjax.do",
            dataType : "json",
            type : 'POST',
            data : {"sessionKey" : $("#sessionKey").val()},
            beforeSend : function() {
                Default.showLoading();
            },
            success : function (data) {
                // 0이면 비로그인 상태, 1이면 로그인상태
                if(data.successCode == 0) {
                    Default.loginCheck("N");
                    // 동의항목중 한개이상 비동의인 경우 동의를 유도하는 화면으로 보낸다.(업데이요청이 왔으나 동의내역이 없는 경우 포함)

                } else if(data.successCode == 1 && callback && callback instanceof Function) {
                    callback();
                }
            },
            complete: function(e){
                Default.hideLoading();
            }
        });
    },

   /*
   * apAlert 대신 alert 호출하는 동의체크
   */
    agreeCheckNative : function(callback1, menuCd) {
        $.ajax({
            url : "/renew/mypage/agreePersonalSensitiveCheckAjax.do",
            dataType : "json",
            type : 'POST',
            data : {
                menuCd : menuCd || '',
                "sessionKey" : $("#sessionKey").val()
            },
            beforeSend : function() {
                Default.showLoading();
            },
            success : function (data) {
                // 0이면 모두 동의 상태, 1이면 하나라도 비동의상태, 2이면 비로그인상태, 3이면 업데이트요청 진행가능상태
                if(data.successCode == 4 && !Default.isEmpty(data.blackPeriod) && !Default.isEmpty(data.blackDescription)) {
                    Mobile.blackUser(data.blackPeriod, data.blackDescription);

                } else if(data.successCode == 3 && !Default.isEmpty(menuCd)) {
                    Mobile.viewMove("/renew/mypage/agreePersonalSensitive.do?menuCd=" + menuCd, 0);

                } else if(data.successCode == 2) {
                    Default.alert("로그인 후 이용가능한 서비스입니다. 로그인 하시겠습니까?", function() {
                        Mobile.appLogin();
                        Default.popupHide($('#reportMore'));
                    });

                // 동의항목중 한개이상 비동의인 경우 동의를 유도하는 화면으로 보낸다.(업데이요청이 왔으나 동의내역이 없는 경우 포함)
                } else if(data.successCode == 1) {
                    Mobile.viewMove("/renew/mypage/agreePersonalSensitive.do" , 0);

                } else if(callback1 && callback1 instanceof Function) {
                    callback1();
                }

            },
            complete: function(e){
                Default.hideLoading();
            }
        });
    },

    /*
    * apAlert 대신 alert 호출하는 로그인체크
    */
    loginCheckNative : function(callback) {
        $.ajax({
            url : "/renew/mypage/loginCheckAjax.do",
            dataType : "json",
            type : 'POST',
            data : {"sessionKey" : $("#sessionKey").val()},
            beforeSend : function() {
                Default.showLoading();
            },
            success : function (data) {
                // 0이면 비로그인 상태, 1이면 로그인상태
                if(data.successCode == 0) {
                    Default.alert("로그인 후 이용가능한 서비스입니다. 로그인 하시겠습니까?", function() {
                        Mobile.appLogin();
                        Default.popupHide($('#reportMore'));
                    });

                } else if(data.successCode == 1 && callback && callback instanceof Function) {
                    callback();
                }
            },
            complete: function(e){
                Default.hideLoading();
            }
        });
    },

    profileImageAddClass : function() {
        $('.reviewer_img, .reviewer_img_middle, .review_pic, .writer-img, .beautyroom_list .img_box, .clip_thumb').find('img').each(function(){
            var $image = $(this);
            $image.on('load', function() {
                var _imageHeight = $image.height(),
                    _imageWidth = $image.width();

                if ( _imageWidth < _imageHeight  && !$image.hasClass('large_height')) {
                    $image.addClass( 'large_height' );
                }
            }).each(function(){
                if(this.complete) {
                    $image.trigger('load');
                }
            });
        });
    },
    fullImageAddClass : function() {
        $('.full_img_list .img_box,.review_thumb .thumb, .looks_detail_slide .swiper-slide').find('img').each(function(){
            var $image = $(this);
            $image.on('load', function() {
                var _imageHeight = $image.height(),
                    _imageWidth = $image.width();

                if ( _imageWidth < _imageHeight  && !$image.hasClass('large_height')) {
                    $image.addClass( 'large_height' );
                }
            }).each(function(){
                if(this.complete) {
                    $image.trigger('load');
                }
            });
        });
    }
};

var Mobile = {

    preFix : "toapp:::",

    /*
    * 웹뷰 호출
    * url : 웹뷰에 load될 url
    * actionBarCode :
    * 0 : hidden : GNB가 없는 형태
    * 1 : left : < 버튼있는 GNB
    * 2 : right : X 버튼 있는 GNB
    *
    * title : actionBar 제목
    */
    viewMove : function(url, actionBarCode, title, functionCode) {
        var moveUrl = this.preFix + (functionCode || "viewMove:::"),
            div = ":::",
            hidden = "hidden",
            left = "left",
            right = "right",
            home = "home";

        if(!Default.isEmpty(title)) moveUrl += encodeURIComponent(title);
        moveUrl += div;

        if (actionBarCode == "1" || actionBarCode == 1 || actionBarCode == left) {
        	moveUrl += left;
        } else if(actionBarCode == "0" || actionBarCode == 0 || actionBarCode == hidden) {
            moveUrl += hidden;
        } else if(actionBarCode == "2" || actionBarCode == 2 || actionBarCode == right) {
            moveUrl += right;
        } else if(actionBarCode == "3" || actionBarCode == 3 || actionBarCode == home) {
            moveUrl += home;
        }else{
        	moveUrl += left;
        }

        moveUrl += div;

        if(url) moveUrl += url;

        this.goUrl(moveUrl);
    },

    /*
    * 웹뷰 호출
    * url : 웹뷰에 load될 url
    * actionBarCode :
    * 0 : hidden : GNB가 없는 형태
    * 1 : left : < 버튼있는 GNB
    * 2 : right : X 버튼 있는 GNB
    *
    * title : actionBar 제목
    *
    * appVersion : 앱 버전
    * appOS       : OS 버전
    * appDevice   : 기기명
    *
    */
    viewMoveVersion : function(url, actionBarCode, title, functionCode) {
        var moveUrl = this.preFix + (functionCode || "viewMoveVersion:::"),
        div = ":::",
        hidden = "hidden",
        left = "left",
        right = "right",
        home = "home";
	    if(!Default.isEmpty(title)) moveUrl += encodeURIComponent(title);
	    moveUrl += div;
	    if (actionBarCode == "1" || actionBarCode == 1 || actionBarCode == left) {
	    	moveUrl += left;
	    } else if(actionBarCode == "0" || actionBarCode == 0 || actionBarCode == hidden) {
	        moveUrl += hidden;
	    } else if(actionBarCode == "2" || actionBarCode == 2 || actionBarCode == right) {
	        moveUrl += right;
	    } else if(actionBarCode == "3" || actionBarCode == 3 || actionBarCode == home) {
	        moveUrl += home;
	    }else{
	    	moveUrl += left;
	    }
	    moveUrl += div;
	    if(url) moveUrl += url;
	    this.goUrl(moveUrl);    	
    },

    /*
    * 외부 브라우저 호출
    * url : 외부 브라우저에 load될 url
    */
    urlMove : function(url) {
        var moveUrl = this.preFix + "urlMove:::";
        if(!Default.isEmpty(url)) moveUrl += url;
        this.goUrl(moveUrl);
    },

    /*
    * 외부 브라우저 탭으로 호출
    * url : 외부 브라우저 탭에 load될 url
    */
    urlTapMove : function(url) {
        var moveUrl = this.preFix + "urlTapMove:::";
        if(!Default.isEmpty(url)) moveUrl += url;
        this.goUrl(moveUrl);
    },

    // 웹뷰 닫기
    viewClose : function() {
        this.goUrl(this.preFix + "viewClose");
    },

    // 홈으로 이동
    goHome : function() {
        this.goUrl(this.preFix + "goHome");
    },

    // 리뷰 홈
    goReview : function() {
        this.goUrl(this.preFix + "goReview");
    },

    // 체널
    goChannel : function() {
        this.goUrl(this.preFix + "goChannel");
    },

    // 마이페이지
    goMypage : function() {
        this.goUrl(this.preFix + "goMypage");
    },
    // 뷰잉
    goLook : function() {
        this.goUrl(this.preFix + "goLook");
    },
    // 룸
    goRoom : function() {
        this.goUrl(this.preFix + "goRoom");
    },
    // 뷰티QNA
    goBeautyQna : function() {
        this.goUrl(this.preFix + "goBeautyQna");
    },

    // 뒤로가기
    goBack : function() {
        this.goUrl(this.preFix + "goBack");
    },
    
    // GNB 감추기
    hideNavi : function() {
    	if(!(uagent.search("iphone")>-1||uagent.search("ipod")>-1||uagent.search("ipad")>-1)){
    		try {
    			window.AndroidFunc.enableBack("N");
    	    } catch (e) {
    	    }
    	}
        this.goUrl(this.preFix + "hideNavi");
    },

    // GNB, 리뷰버튼 감추기
    hideNaviReview : function() {
    	if(!(uagent.search("iphone")>-1||uagent.search("ipod")>-1||uagent.search("ipad")>-1)){
    		try {
    			window.AndroidFunc.enableBack("N");
    	    } catch (e) {
    	    }
    	}
        this.goUrl(this.preFix + "hideNaviReview");
    },

    // GNB 노출
    showNavi : function() {
    	if(!(uagent.search("iphone")>-1||uagent.search("ipod")>-1||uagent.search("ipad")>-1)){
    		try {
    			window.AndroidFunc.enableBack("Y");
    	    } catch (e) {
    	    }
    	}
        this.goUrl(this.preFix + "showNavi");
    },

    // GNB, 리뷰버튼 노출
    showNaviReview : function() {
    	if(!(uagent.search("iphone")>-1||uagent.search("ipod")>-1||uagent.search("ipad")>-1)){
    		try {
    			window.AndroidFunc.enableBack("Y");
    	    } catch (e) {
    	    }
    	}
        this.goUrl(this.preFix + "showNaviReview");
    },

    /*
    * GNB 문구지정 (화면 로드될 시점)
    * title : 문구
    */
    setNaviTitle : function(title) {
        var titleUrl = this.preFix + "setTitle:::";
        if(!Default.isEmpty(title)) titleUrl += title;
        this.goUrl(titleUrl);
    },

    /*
    * 리뷰작성
    * productCd : 상품코드
    * productNm : 상품명
    * brandCd : 브랜드코드
    * colorStrength : 발색력|뭐|뭐|뭐
    * hashTags : 해쉬태그|뭐|뭐|뭐
    * code : L(제품 검색 리스트에서 선택시), V(제품 상세에서 리뷰 쓰기)
    */
    reviewWrite : function(productCd, productNm, brandNm, thumnailPath, colorStrength, hashTags, code) {
        var url = this.preFix + "reviewWrite",
            div = ":::";

        if(!Default.isEmpty(productCd)) {
            url += (div + productCd + div);

            if(!Default.isEmpty(productNm)) url += productNm;
            url += div;

            if(!Default.isEmpty(brandNm)) url += brandNm;
            url += div;

            if(!Default.isEmpty(thumnailPath)) url += thumnailPath;
            url += div;

            if(!Default.isEmpty(colorStrength)) url += colorStrength;
            url += div;

            if(!Default.isEmpty(hashTags)) url += hashTags;
            url += div;

            if(!Default.isEmpty(code)) url += code;
        }

        this.goUrl(url);
    },

    /*
    * 리뷰수정
    * reviewNo : 리뷰번호
    */
    reviewUpdate : function(reviewNo) {
        var url = this.preFix + "reviewUpdate:::";
        if(!Default.isEmpty(reviewNo)) url += reviewNo;
        this.goUrl(url);
    },

    /*
    * 뷰잉작성
    */
    lookWrite : function() {
        var url = this.preFix + "lookWrite";
        this.goUrl(url);
    },

    /*
    * 뷰잉수정
    * lookNo : 뷰잉번호
    */
    lookUpdate : function(lookNo) {
        var url = this.preFix + "lookUpdate:::";
        if(!Default.isEmpty(lookNo)) url += lookNo;
        this.goUrl(url);
    },

    /*
    * 웹뷰 태깅
    * contents : 태깅내용
    * UserAgent에 IOS는 'BP_iOS' 안드로이드는 'BP_Android'
    */
    gaTagging : function(contents) {
        var url = this.preFix + "gaTagging:::";
        if(!Default.isEmpty(contents)) url += contents;
        this.goUrl(url);
    },

    /*
    * 로그인
    * resultCode 리턴 값 으로 501일때 로그인이 안된 사용자
    */
    appLogin : function() {
        this.goUrl(this.preFix + "appLogin");
    },

    /*
    * 모바일 토스트메세지
    * message : 메세지
    */
    appToast : function(message) {
        var url = this.preFix + "appToast:::";
        if(!Default.isEmpty(message)) url += message;
        this.goUrl(url);
    },

    /*
    * SNS공유하기
    * type : 제품 = P , 리뷰 = R, 콘텐트 = C
    * sequence : 시퀀스
    * image : 이미지
    * title : 제목
    * description : 설명
    */
    share : function(type, sequence, image, title, description) {
        var url = this.preFix + "snsShare:::";

        if(!Default.isEmpty(type)) url += type;
        url += ":::";
        if(!Default.isEmpty(sequence)) url += sequence;
        url += ":::";
        if(!Default.isEmpty(image)) url += image;
        url += ":::";
        if(!Default.isEmpty(title)) url += title;
        url += ":::";
        if(!Default.isEmpty(description)) url += description;
        this.goUrl(url);
    },


    friendKakaoShare : function(nickName, link, image) {
        var url = this.preFix + "friendKakaoShare:::";
        if(!Default.isEmpty(nickName)) url += nickName;
        url += ":::";
        if(!Default.isEmpty(link)) url += link;
        url += ":::";
        if(!Default.isEmpty(image)) url += image;
        this.goUrl(url);
    },

    /*
     * 앱 내 이동
     * appMoveCode : 앱이동코드
     */
    appMove : function(appMoveCode) {
        var url = this.preFix + "appMove:::";
        if(!Default.isEmpty(appMoveCode)) url += appMoveCode;
        this.goUrl(url);
    },

    /*
     * 뷰티포인트 카드
     */
    barCode : function() {
        this.goUrl(this.preFix + "barCode");
    },

    /*
     * 등록요청 화면
     */
    requestView : function() {
        if(Device.iOS()) {
            this.goUrl(this.preFix + "AppFunction:::RequstView");
        }
    },

    /*
     * 안드로이드 키캣의 경우 파일 업로드 요청
     */
    fileUpload : function() {
        if(Device.anyMobile()) {
            this.goUrl(this.preFix + "AppFunction:::FileUpload");
        }
    },

    /*
     * 뷰티포인트 앱 리로드
     */
    appReload : function() {
        this.goUrl(this.preFix + "appReload");
    },

    /*
     *
     */
    appViewMove : function(obj) {
        var url = this.preFix + "AppViewMove:::WebViewOpen:::";

        if(!Default.isEmpty(obj)) url += obj;
        url += ":::session";
        this.goUrl(url);
    },

    /*
     * 영수증 이동
     */
    goReceipt : function() {
        this.goUrl(this.preFix + "goReceipt");
    },

    /*
     * 쿠폰등록 이동
     */
    goCoupon : function() {
        this.goUrl(this.preFix + "goCoupon");
    },

    /*
    * 활동정지회원
    * period : 기간
    * description : 사유
    */
    blackUser : function(period, description) {
        var url = this.preFix + "blackUser:::";

        if(!Default.isEmpty(period)) url += period;
        url += ":::";
        if(!Default.isEmpty(description)) url += description;
        this.goUrl(url);
    },

    /*
    * 뷰티룸게시글수정
    * postNo : 게시글번호
    * groupNo : 뷰티룸순번
    */
    roomPostUpdate : function(postNo, groupNo) {
        var url = this.preFix + "roomPostUpdate:::";
        if(!Default.isEmpty(postNo)) url += postNo;
        url += ":::";
        if(!Default.isEmpty(groupNo)) url += groupNo;
        this.goUrl(url);
    },

    /*
     * 뷰티룸 가입 후 화면 리로드
     */
    roomReload : function() {
        this.goUrl(this.preFix + "roomReload");
    },

    /*
     * 뷰티룸 화면으로 이동
     */
    goBeautyRoom : function(groupNo) {
        var url = this.preFix + "room:::";
        if(!Default.isEmpty(groupNo)) url += groupNo;
        this.goUrl(url);
    },

    goUserHome : function (nickname) {
        this.viewMove("/renew/mypage/userMainByNickname.do?nickname=" + nickname, 3, '프로필 홈')
    },

    /*
     * 뷰티룸 정렬변경
     */
    roomReOrder : function() {
        this.goUrl(this.preFix + "roomFilter");
    },

    /*
     * 뷰티룸 게시글 삭제
     */
    roomDelete : function() {
        this.goUrl(this.preFix + "roomDelete");
    },

    goUrl : function(url) {
        try {
            if(!Default.isEmpty(url)) {
                if(Device.anyMobile()) {
                    location.href = url;

                } else {
                    var urlArray = url.split(":::");
                    url = urlArray[urlArray.length - 1];
                    if(!url.match(/.do/gi)) {
                        return false;
                    }

                    var hostArray = window.location.href.split("/"), sessionKey;
                    try {
                        sessionKey = (hostArray[hostArray.length - 1].split("sessionKey=")[1]).split("&")[0];
                        if(!Default.isEmpty(sessionKey)) {
                            if(url.match(/[?]/gi)) {
                                url += ("&sessionKey=" + sessionKey)

                            } else {
                                url += ("?sessionKey=" + sessionKey)
                            }
                        }
                    } catch (e) {}
                    var hostNameArray = window.location.href.split("/");
                    $("<a>").attr("href", hostNameArray[0] + "//" + hostNameArray[2] + url).attr("target", "_blank")[0].click();
                }
            }
        } catch(e) {
        }
    }
};

var Device = {

    AOS : function() {
        return navigator.userAgent.match(/Android/i);
    },

    iOS : function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },

    kikat :function() {
        return navigator.userAgent.match(/Android 4.4/i);
    },

    anyMobile : function() {
        return (Device.AOS() || Device.iOS());
    }
};

// $(function() {
//     Default.getReply();
//     Default.tabSlide();
//     Default.contentsMore();
//     Default.fixFixed();
//     Default.getWriteDate();
// });

// Tabs
var _$tabContents = $( '.tab_contents' );

$( '.tab > li.on' ).each( function(){
    _$tabContents.hide();
    _$tabContents.first().show();

    var activeTab = $(this).attr( 'rel' );
    $( '#' + activeTab ).show();                  
});

$( 'ul.tab li' ).click(function(){
    var _activeTab = $(this).closest( '.tab' ).find( '.on' );
    var _activeTabRel = _activeTab.attr( 'rel' );
    var _currentTab = $(this).attr( 'rel' );

    $( '#' + _activeTabRel ).hide(); 
    _activeTab.removeClass( 'on' );
    $(this).addClass( 'on' );
    $( '#' + _currentTab ).show(); 
    return false;
});

// Accordion
var _$accordionTitle = $( '.accordion .title' );
$(document).on("click", '.accordion .title', function(){
    $( '.accordion .contents' ).slideUp();

    if( $(this).next().is( ':visible' ) ){
        _$accordionTitle.removeClass( 'active' );
    } else {
        _$accordionTitle.removeClass( 'active' );
        $(this).next().slideDown();
        $(this).addClass( 'active' );
        $( 'html, body' ).animate( { scrollTop : $(this).offset().top }, 500 );
    }
});

$(document).on("click", '.review_product .prod_thumb_slide .img_thumb img', function(){
    Default.popupShow($('.layer_popup.thumb_pop'));

    /* 팝업 이미지 사이즈 제어 가로가 크면 가로가 100% 세로가 크면 세로가 100% */
    $(".layer_popup .prod_thumb_bg img").load(function(){
        var w = $('.layer_popup .prod_thumb_bg img').get(0).naturalWidth;
        var h = $('.layer_popup .prod_thumb_bg img').get(0).naturalHeight;

        if(w < h){
            $(".layer_popup .prod_thumb_bg img").height("100%").width("auto");
        }else{
            $(".layer_popup .prod_thumb_bg img").width("100%").height("auto");
        }
    });
});

$(document).on("click", '.review_product .prod_thumb_slide .video_thumb a', function(){
    Default.popupShow($('.layer_popup.video_pop'));
});


$(document).on("click", '.go_edit', function(){
    Default.popupShow($('.layer_popup.edit'));
});

$(document).on('click', '.layer_popup .reviewAct', function() {
	Mobile.showNaviReview();
    Default.popupHide($('.layer_popup'));
});


$(document).on('click', '.layer_popup .nonAct', function() {
	Mobile.showNavi();
    Default.popupHide($('.layer_popup'));
});

$(document).on('click', '.layer_popup .ingAct', function() {
    Default.popupHide($('.layer_popup'));
});

$(document).on('click', '.btn_reset', function() {
    try {
        Default.apAlert("초기화 선택시 설정한 모든 필터 조건은 해제 됩니다.", "javascript:Default.filterReset();","","","N");
    } catch(e) {
        Default.filterReset();
    }
});

$(document).on( 'click', '.choice_cate .choice_value', function(e) {
    e.preventDefault();

    var _$depth2Title = $( '.depth2' );
    var _$cateListWrap = $( '.cate_list' );
    var _$cateList = $( '.cate_wrap li' );
    var _$choiceCateTxt = $( '.choice_cate .choice_wrap .txt' );
    var _delIndex = $(this).attr( 'data-index' );

    $(this).remove();

    _$cateList.eq(' '+ _delIndex +' ').removeClass( 'on' );

    _$depth2Title.each(function (index){
        if ( $(this).next( _$cateListWrap ).find( 'li.on' ).length > 0 ){
            $(this).addClass( 'on' );
        } else {
            $(this).removeClass( 'on' );
        }
    });

    if ( $('.choice_cate .choice_value').length > 0 ) {
        _$choiceCateTxt.removeClass( 'on' )
    } else {
        _$choiceCateTxt.addClass( 'on' )
    }

    try {
        Filter.filterChange();
    } catch (e) {
    }
});

$(document).on( 'click', '.choice_brand .choice_value', function(e) {
    e.preventDefault();

    var _$brandList = $( '.brand_list li' );
    var _$choiceTxt = $( '.choice_brand .choice_wrap .txt' );
    var _delIndex = $(this).attr( 'data-index' );

    $(this).remove();

    _$brandList.eq(' '+ _delIndex +' ').removeClass( 'on' );

    if ( $('.choice_brand .choice_value').length > 0 ) {
        _$choiceTxt.removeClass( 'on' )
    } else {
        _$choiceTxt.addClass( 'on' )
    }

    try {
        Filter.filterChange();
    } catch (e) {
    }
});

$(document).on( 'click', '.choice_keyword .choice_value', function(e) {
    e.preventDefault();

    var _$KeywordList = $( '.keyword_list li' );
    var _$choiceTxt = $( '.choice_keyword .choice_wrap .txt' );
    var _delIndex = $(this).attr( 'data-index' );

    $(this).remove();

    _$KeywordList.eq(' '+ _delIndex +' ').removeClass( 'on' );

    if ( $('.choice_keyword .choice_value').length > 0 ) {
        _$choiceTxt.removeClass( 'on' )
    } else {
        _$choiceTxt.addClass( 'on' )
    }

    try {
        Filter.filterChange();
    } catch (e) {
    }
});

$(document).on( 'click', '.beauty_profile .choice_value', function(e) {
    e.preventDefault();

    Default.valueDelete($(this), true);

    try {
        Filter.filterChange();
    } catch (e) {
    }
});

$(document).on( 'click', '.review_type .choice_value', function(e) {
    e.preventDefault();

    Default.valueDelete($(this), false);

    try {
        Filter.filterChange();
    } catch (e) {
    }
});

$(document).on( 'click', '.series .choice_value', function(e) {
    e.preventDefault();

    var _$depth2Title = $( '.series .depth2' );
    var _$seriesListWrap = $( '.series_list' );
    var _$seriesList = $( '.series_wrap li' );
    var _$choiceSeriesTxt = $( '.series .choice_wrap .txt' );
    var _delIndex = $(this).attr( 'data-index' );

    $(this).remove();

    _$seriesList.eq(' '+ _delIndex +' ').removeClass( 'on' );

    _$depth2Title.each(function (index){
        if ( $(this).next( _$seriesListWrap ).find( 'li.on' ).length > 0 ){
            $(this).addClass( 'on' );
        } else {
            $(this).removeClass( 'on' );
        }
    });

    if ( $('.series .choice_value').length > 0 ) {
        _$choiceSeriesTxt.removeClass( 'on' )
    } else {
        _$choiceSeriesTxt.addClass( 'on' )
    }

    try {
        Filter.filterChange();
    } catch (e) {
    }
});

//커스텀 얼럿창 (0 : 아니요 GRAY COLOR / 1 : 예 BLUE COLOR)
function apAlert(text, mode, href){
	$("#reportMore .message p").html(text);
	$("#reportMore").addClass( 'open' ).attr( 'tabindex', '0' );
	$( 'body' ).addClass( 'scroll_lock' );
	if(mode != null && href == null){ //TEXT와 MODE 만 입력된 경우
		$('#reportMore .pop_conts .btn_wrap a').eq(1).css("width", "50%");     //원래대로
		$('#reportMore .pop_conts .btn_wrap a').eq(0).css("display", ""); 	 //원래대로
		$('#reportMore .pop_conts .btn_wrap a').eq(1).attr("href", "javascript:;");
		$('#reportMore .pop_conts .btn_wrap a').eq(1).attr("onclick", mode);   //파란 버튼에 이벤트 추가
		$('#reportMore .pop_conts .btn_wrap a').eq(1).text("예");              //원래대로
	}else if(mode != null && href != null){ // HREF 만 입력된 경우
		$('#reportMore .pop_conts .btn_wrap a').eq(1).css("width", "100%");    //파란 버튼
		$('#reportMore .pop_conts .btn_wrap a').eq(1).text("확인");
		$('#reportMore .pop_conts .btn_wrap a').eq(1).attr("href", href );
		$('#reportMore .pop_conts .btn_wrap a').eq(1).attr("onclick", mode);   //파란 버튼에 이벤트 추가
		$('#reportMore .pop_conts .btn_wrap a').eq(0).css("display", "none"); //회색 버튼 숨기기
	}else{
		$('#reportMore .pop_conts .btn_wrap a').eq(1).css("width", "100%");   //파란 버튼
		$('#reportMore .pop_conts .btn_wrap a').eq(1).text("확인");
		$('#reportMore .pop_conts .btn_wrap a').eq(1).attr("href", "javascript:$(\"#reportMore\").removeClass(\"open\").removeAttr( \"tabindex\" );");
		$('#reportMore .pop_conts .btn_wrap a').eq(1).prop('onclick', null);
		$('#reportMore .pop_conts .btn_wrap a').eq(0).css("display", "none"); //회색 버튼 숨기기
	}
	$( 'body' ).removeClass( 'scroll_lock' );
}

/* 상단 App Download Banner가 있는 경우 Header Scroll  */
headerScroll();
function headerScroll() {
    var _$appDownBanner = $( '.banner_app_down' );
    var _$headr = $( '.wrapper .header' );

    if ( _$appDownBanner.length ) {

        $( window ).on( 'scroll', function(e) {
            if( $(this).scrollTop() >= 100 ) {
                _$headr.addClass( 'scroll' );
            } else { 
                _$headr.removeClass( 'scroll' );
            }
        });

        $( 'button', _$appDownBanner ).click(function(){
            _$appDownBanner.addClass( 'hide' );
        })
    }
};

function backClose(flag){
	$('#reportMore').removeClass('open').removeAttr('tabindex'); $( 'body' ).removeClass( 'scroll_lock' ); 
	Default.popupHide($('.layer_popup'));
	if(flag == "Y"){
		Mobile.showNavi();
	}
	
}
/* 181204 img placeholder 작업 */
function bgThumb() {
    $('.prod_info .prod_thumb').css("background", "#fff");
    $('.prod_box .prod_thumb').css("background", "#fff");
    $('.review_product .prod_thumb_slide .img_thumb,.review_product .prod_thumb_slide .video_thumb').css("background", "#fff");
};

$(document).ready(function(){
    setTimeout(function(){
        bgThumb();
    }, 20);
});

