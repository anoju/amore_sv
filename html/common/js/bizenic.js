
//TRIM 
String.prototype.trim = function() { return this.replace(/^\s+/g,'').replace(/\s+$/g,'');};
//REMOVE DASH
String.prototype.removeDash = function(){return this.replace(/-/g,"");};
//NORMALIZE
String.prototype.normalize = String.prototype.normalise = function(){ return this.trim().replace(/\s+/g,' '); };
//startsWith
String.prototype.startsWith = function(str,i){ i=(i)?'i':'';var re=new RegExp('^'+str,i);return (this.normalize().match(re)) ? true : false ; };
//endsWith
String.prototype.endsWith = function(str,i){ i=(i)?'gi':'g';var re=new RegExp(str+'$',i);return (this.normalize().match(re)) ? true : false ; };
//isNum
String.prototype.isNum = function(){ return (!/\D/.test(this));};

Array.prototype.swap = function(from, to){
	if ( from > -1 && from <= this.length && to > -1 && to <= this.length) {
		var tmp = this[from];
		this[from] = this[to];
		this[to] = tmp ;
	}
	return false;
};

Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

Array.prototype.insertAt = function(o, index){
	if ( index > -1 && index <= this.length ) {
		this.splice(index, 0, o);
		return true;
	}
	return false;
};
Array.prototype.insertBefore = function(o, toInsert){
	var inserted = false;
	var index = this.indexOf(o);
	if(index == -1)
		return false;
	else {
		if(index == 0){
			this.unshift(toInsert)
			return true;
		}
		else
			return this.insertAt(toInsert, index - 1);
	}
};
Array.prototype.insertAfter = function(o, toInsert){
	var inserted = false;
	var index = this.indexOf(o);
	if(index == -1)
		return false;
	else {
		if(index == this.length - 1){
			this.push(toInsert);
			return true;
		}
		else
			return this.insertAt(toInsert, index + 1);
	}
};

// EUC-KR Bytes
String.prototype.euckrBytes = function() {
	var len = 0 ;
	for(var i = 0; i< this.length; i++){ len += (this.charAt(i).charCodeAt() > 128) ? 2 : 1 ; }
	return len;
};
// EUC-KR CutBytes
String.prototype.euckrCutBytes = function(size) {
	var len = 0 ;
	for(var i = 0; i< this.length; i++){ 
		len += (this.charAt(i).charCodeAt() > 128) ? 2 : 1 ; 
		if(len > size){
			return this.substring(0,i);
		}
	}
	return this;
};
// UTF-8 Bytes
String.prototype.bytes = function() {
	var len = 0 ;
	for(var i = 0; i< this.length; i++){
		len += (this.charAt(i).charCodeAt() <= 0x00007F) ? 1 : (this.charAt(i).charCodeAt() <= 0x0007FF) ? 2 :  (this.charAt(i).charCodeAt() <= 0x00FFFF) ?  3 : 4 ; 
	}
	return len;
};
// UTF-8 CutBytes
String.prototype.cutBytes = function(size) {
	var len = 0 ;
	for(var i = 0; i< this.length; i++){
		len += (this.charAt(i).charCodeAt() <= 0x00007F) ? 1 : (this.charAt(i).charCodeAt() <= 0x0007FF) ? 2 :  (this.charAt(i).charCodeAt() <= 0x00FFFF) ?  3 : 4 ; 
		if(len > size) {
			return this.substring(0,i);
		}
	}
	return this;
};
//한글단어에 받침여부를 확인한다.josa = "은는" "이가" "을를"
String.prototype.josa = function(josa) {
	var isJosa = false ;
	var strTemp = this.substr(this.length-1);
	if(strTemp.charCodeAt(0)>128){
		isJosa = ((strTemp.charCodeAt(0)-16)%28!=0);
	}else{
		if("mnrMNRlL136780#~".indexOf(strTemp.charAt(0)) > -1) isJosa = true ;
	}
	return (isJosa) ? josa.substring(0,1) : josa.substring(1,2);
};

String.prototype.base64Encode = function(){
  var base64_encodetable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var result = "";
  var len = this.length;
  var x, y;
  var ptr = 0;

  while( len-- > 0 )
  {
        x = this.charCodeAt( ptr++ );
        result += base64_encodetable.charAt( ( x >> 2 ) & 63 );

        if( len-- <= 0 )
        {
              result += base64_encodetable.charAt( ( x << 4 ) & 63 );
              result += "==";
              break;
        }

        y = this.charCodeAt( ptr++ );
        result += base64_encodetable.charAt( ( ( x << 4 ) | ( ( y >> 4 ) & 15 ) ) & 63 );

        if ( len-- <= 0 )
        {
              result += base64_encodetable.charAt( ( y << 2 ) & 63 );
              result += "=";
              break;
        }

        x = this.charCodeAt( ptr++ );
        result += base64_encodetable.charAt( ( ( y << 2 ) | ( ( x >> 6 ) & 3 ) ) & 63 );
        result += base64_encodetable.charAt( x & 63 );

  }
  return result;
}

//Ex : BIZenic.alert(ANSWER_MAX , {ques_no: "A", size : "100"});
if (BIZenic == null){
	var BIZenic = {
		onloads : Array(),
		isStart : false,
		message : function (message, value){ 
			if(value == null) return message ;
			var pattern = /{([a-zA-Z0-9_]+)\+?([가-힝]{2})?}/;
			while(pattern.exec(message)){
				var tail = (RegExp.$2 && value[RegExp.$1]) ? value[RegExp.$1].josa(RegExp.$2) : "";
				message = message.replace(pattern,value[RegExp.$1] + tail);
			}
			return message ;
		},
		alert : function (message, value) {
			alert(this.message(message, value));
		},
		onLoad : function(){
			for(var i = 0 ; i < BIZenic.onloads.length ; i++){
				BIZenic.onloads[i]();
			}
		},
		addOnLoad : function( fnc ){
			if(!this.isStart){
			if (window.attachEvent){
					window.attachEvent("onload", this.onLoad);
			}else if (document.addEventListener){ 
					document.addEventListener("DOMContentLoaded", this.onLoad, false); // Call init function in Firefox
				}
				this.isStart = true;
			} 
			this.onloads[this.onloads.length] = fnc;
		},
		addOnUnLoad : function( fnc ){
			if (window.attachEvent){
				window.attachEvent("onunload", fnc);
			}else if (document.addEventListener){ 
				document.addEventListener("unload", fnc, false); // Call init function in Firefox 
			} 
		},
		addEvent : function (obj , name, fnc ){
			if (window.attachEvent){
				obj.attachEvent("on" + name , fnc);
			}else if (document.addEventListener){ 
				if(name == "load"){
					obj.addEventListener("DOMContentLoaded", fnc, false);
				}else{
					obj.addEventListener(name, fnc, false); 
				}
			} 
		},
		isNum : function(strnum){
			return (strnum.toString() && !/\D/.test(strnum));
		},
		isArray : function (o) {
			if (o==null || typeof(o)!="object" || typeof(o.length)!="number") {
				return false;
			}
			if (typeof(Array)!="undefined" && typeof(o.constructor)!="undefined" && o.constructor==Array) {
				return true;
			}
			if (typeof(o.join)=="function" && typeof(o.sort)=="function" &&	typeof(o.reverse)=="function") {
				return true;
			}
			return (o.length==0 || typeof(o[0])!="undefined");
		},
		isSafariArray : function(o){
			if (o==null || typeof(o)!="function" || typeof(o.length)!="number") {
				return false;
			}
			if (typeof(Array)!="undefined" && typeof(o.constructor)!="undefined" && o.constructor==Array) {
				return true;
			}
			if (typeof(o.join)=="function" && typeof(o.sort)=="function" &&	typeof(o.reverse)=="function") {
				return true;
			}
			return (o.length==0 || typeof(o[0])!="undefined");
		},
		checkedLength : function (src){
			if(src ==null) return 0;
			var rtn = 0 ;
			if(BIZenic.isArray(src)){
				for ( var i=0 ; i < src.length ; i++ ) {
					 if ( src[i].checked == true ) rtn ++ ;
				}
			}else{
				 if ( src.checked == true )rtn = 1 ;
			}
			return rtn ;
		}
	};
}

//HTML 엘리먼트 복사, 삭제 , 전체 삭제
BIZenic.Node = {
	getParent : function (tagName , childNode){
		var parentNode ;
		while((childNode = childNode.parentNode) != null ){
			if(childNode.tagName == tagName && childNode.id != ""){
				parentNode = childNode ;
				break ;
			}
		}
		return parentNode ;
	},
	getTableParent : function (childNode){
		return this.getParent("TABLE" , childNode);
	},
	getTbodyParent : function (childNode){
		return this.getParent("TBODY" , childNode);
	},
	getTrParent : function (childNode){
		return this.getParent("TR" , childNode);
	},
	rowAdd : function (elementName , initElement){
		var srcNode = document.getElementById("pattern_"+ elementName);
		var trgNode = document.getElementById("body_"+ elementName);
		var cloneNode = null ;
		cloneNode =srcNode.cloneNode(true);
		cloneNode.style.display = "" ;
		cloneNode.id = "row_"+ elementName ;
	 	trgNode.appendChild(cloneNode);
	 	if(initElement != null){
		 	for(var i = 0 ; i < initElement.length ; i++){
		 		var element = this.nodeSearch(cloneNode , initElement[i]);
		 		if(element != null){
					element.initialize = BIZenic.Validate.Element.initialize;
					element.initialize(element.form);
					element.validinit();
			    }
	 	    }
 	    }
	},
	rowRemove : function ( elementName , node){
		var parentNode = this.getTrParent(node);
		var trgNode = document.getElementById("body_"+ elementName);
		trgNode.removeChild(parentNode);
	},
	rowRemoveAll : function (elementName){
		var node = document.getElementById("body_"+ elementName);
		while (node.hasChildNodes()){
			node.removeChild(node.firstChild);
		}
	},
	rowUp : function(obj){
		var parentNode = this.getTrParent(obj);
		if(parentNode.previousSibling != null ){
			parentNode.parentNode.insertBefore(parentNode,parentNode.previousSibling);
		}
	},
	rowDown : function(obj){
		var parentNode = this.getTrParent(obj);
		if(parentNode.nextSibling != null){
			parentNode.parentNode.insertBefore(parentNode.nextSibling,parentNode);
		}
	},
	rowChange : function (row1 , row2){
		var parentNode = row1.parentNode;
		var clone1=row1.cloneNode(true);
		var clone2=row2.cloneNode(true);
		var replaced1=parentNode.replaceChild(clone2, row1);
		var replaced2=parentNode.replaceChild(clone1, row2);
	},
	//노드찾기
	nodeSearch : function (node , name){
		if(node.name == name) return node ;
		var length = node.childNodes.length;
		if (length > 0) {
			for (var index =0; index < length; index++) {
				var rtn = this.nodeSearch(node.childNodes.item(index) , name) ;
				if(rtn != null) return rtn ;
			}
		}
		return null;
	},
	nodeChangeValue : function (sel , condition){
		var node = this.getTrParent(sel);
		this.nodeSearch(node , condition ).value = sel.options[sel.selectedIndex].text ;
	},
	removeAllRows : function(eleName) {
		var node = document.getElementById(eleName);
		if (node == null) return;
		while (node.hasChildNodes()){
			node.removeChild(node.firstChild);
		}
	},

	loadRows : function(url , param , eleName, creator, cellFuncs, paging, total, initElement){
		var nodeAjax = new Ajax.Request( url,
			{
				method: 'post',
				parameters:  param ,
				onComplete: (function(response){this.loadEnd(response, eleName, creator, cellFuncs, paging, total, initElement );}).bind(this)
	}
		);
	},
	loadEnd : function(response , eleName, creator, cellFuncs, paging, total, initElement){
		var entity = response.responseText.evalJSON();
		var list = entity.list;
		this.removeAllRows(eleName);

		this.addRows( eleName, list, creator, cellFuncs, initElement);
		// 리스트가 없을경우 "목록이 존재하지 않습니다."라는 문구를 출력한다.
		if(list == '' && entity.rmsg != null) {
			var rmsg = [{rmsg:entity.rmsg}];
			var fnc = [function(option){return option.rawData.rmsg;}];
			var creator2= {
	    		rowCreator:function(options) {
	    			var row = document.createElement("tr");
					row.className = "tr_white_center";
	    		  	return row;
				},
	    		cellCreator:function(options) {
					var td = document.createElement("td");
					td.colSpan = cellFuncs.length;
					return td;
				}
};
			this.addRows(eleName, rmsg, creator2, fnc);
		}
		if(paging)document.all.paging.innerHTML = entity.spaging;
		if(total) document.all.ipaging.innerHTML = "총 : <font color=orange><b>"+entity.paging.totalRow+"</b></font> 건 | 페이지수 : <font color=orange><b>"+entity.paging.cpage+"/"+entity.paging.lastPage+"</b></font>";
		if(list.length==0) return ;
	},
	addRows : function(ele, data, creator, cellFuncs, initElement) {
		var node = document.getElementById(ele);
		if (node == null) return false;
		if((",table,tbody,thead,tfoot,").indexOf("," + node.nodeName.toLowerCase() + ",") < 0) return false;
		for (var rowNum = 0; rowNum < data.length; rowNum++) {
			var option = {
					rawData : data[rowNum],
					rowNum : rowNum,
					data : null ,
					cellNum : null
			} ;
			var tr = creator.rowCreator(option);
			for (var cellNum = 0; cellNum < cellFuncs.length; cellNum++) {
				option.cellNum = cellNum;
				var func = cellFuncs[cellNum];
				option.data = func(option);
				var td = creator.cellCreator(option);
				if (td != null) {
					if((option.data == null || typeof option.data != "object" || option.data.nodeName == null) ){
						td.innerHTML = option.data;
					}else{
						td.appendChild(option.data);
					}
				}
			    tr.appendChild(td);
			}
			if (tr != null){
				node.appendChild(tr);
			 	if(initElement != null){
				 	for(var i = 0 ; i < initElement.length ; i++){
				 		var element = this.nodeSearch(tr , initElement[i]);
				 		if(element != null){
							element.initialize = BIZenic.Validate.Element.initialize;
							element.initialize(element.form);
							element.validinit();
	}
			 	    }
		 	    }
			}
		}
		return true;
	},
	
  
	getButton : function(kind, title, script){
		var str = "" ;
		if(kind == "common"){
			str = "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tr><td>&nbsp;</td><td><img src=\"../../../common/image/but_l.gif\" width=\"10\" height=\"23\"></td><td><input name=\"Input01\" type=\"button\" value=\"" + title + "\" class=\"btn\" onClick=\"" + script + "\" onFocus=\"blur();\"></td><td><img src=\"../../../common/image/but_r.gif\" width=\"10\" height=\"23\"></td></tr></table>";
		}else if(kind == "popup"){
			str = "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" name=\"command_btn\" id=\"command_btn\"><tr><td>&nbsp;</td><td><img src=\"../../../common/image/but2_l.gif\" width=\"10\" height=\"23\"></td><td><input name=\"Input01\" type=\"button\" value=\"" + title + "\" class=\"btn2\" onClick=\"" + script + "\" onFocus=\"blur();\"></td><td><img src=\"../../../common/image/but2_r.gif\" width=\"10\" height=\"23\"></td></tr></table>";
		}else if(kind == "disable"){
			str = "\"<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" name=\"command_btn\" id=\"command_btn\"><tr><td>&nbsp;</td><td><img src=\"../../../common/image/but3_l.gif\" width=\"10\" height=\"23\"></td><td><input name=\"Input01\" type=\"button\" value=\"" + title + "\" class=\"btn3\" disabled></td><td><img src=\"../../../common/image/but3_r.gif\" width=\"10\" height=\"23\"></td></tr></table>";
		}
		return str;
	}
};

BIZenic.ProgressBar = {
	message : null ,
	width : 0 ,
	height : 0 ,
	speed : 0 ,
	blocks : 0 ,
	count : 0 ,
	action : 0 ,
	ctr : 0 ,
	tid : 0 ,
	create : function(message, width, height, backgroundColor, borderwidth, borderColor, blockBackgroundColor, speed, blocks, count, action){
		if(this.exist) return ;
		this.message = message ? message : ECM_PROGRESS_SEARCH ;
		this.width = width ? width : 500 ;
		this.height = height ? height : 25 ;
		this.speed = speed ? speed : 100;
		this.blocks = blocks ? blocks : 7;
		this.count = count ? count : 3;
		this.action = action ? action : "";
		backgroundColor = backgroundColor ? backgroundColor : 'white' ;
		borderwidth = borderwidth ? borderwidth : 1 ;
		borderColor = borderColor ? borderColor :'black' ;
		blockBackgroundColor = blockBackgroundColor ? blockBackgroundColor : 'green' ;
		var N=-1;
		var str = '<div id="message" style="position:absolute; left:300px; top:280px; width:502px; height:58px; z-index:1; visibility:hidden;">';
		str += '<iframe  style="position:absolute;z-index:-1;width:502px;height:58px;top:0;scrolling:no;" frameborder="3"></iframe>';
		str += '<table width=500 border=0 cellpadding=0 cellspacing=1 class=main bgcolor=#848284 align="center">';
		str += '  <tr height=28>';
		str += '    <td align=center bgcolor=#B6CAD9>';
		str += '      <table width=100% border=0 cellpadding=0 cellspacing=0 bgcolor=#848284 align="center">';
		str += '        <tr>';
		str += '          <td align=center bgcolor=#B6CAD9 style="line-height: 120%; font-size: 14px;"><b>' + this.message + '</b></td>';
		str += '          <td align=center bgcolor=#B6CAD9 width="15"><img onClick="javascript:BIZenic.ProgressBar.hideDelay()" src="../../../common/image/icon_delete.gif" border="0"></td>';
		str += '        </tr>';
		str += '      </table>';
		str += '    </td>';
		str += '  </tr>';
		str += '  <tr height=' + (this.height) + '>';
		str += '    <td>';
		str +='<div id="progressBar" style="visibility:hidden; position:relative; overflow:hidden; width:'+ this.width+'px; height:'+ this.height+'px; background-color:'+backgroundColor+'; border-color:'+borderColor+'; border-width:'+borderwidth+'px; border-style:solid; font-size:1px;">';
		str +='<span id="progressBlocks" style="left:-'+(this.height*2+1)+'px; position:absolute; font-size:1px">';
		var ie = !!(window.attachEvent && !window.opera);
		for(i=0;i< this.blocks;i++){
			str+='<span style="background-color:'+blockBackgroundColor+'; left:-'+((this.height*i)+i)+'px; font-size:1px; position:absolute; width:'+this.height+'px; height:'+this.height+'px; '
			str+='filter:alpha(opacity='+(100-i*(100/this.blocks))+');-Moz-opacity:'+((100-i*(100/this.blocks))/100) + ';opacity:'+((100-i*(100/this.blocks))/100);
			//str+=(ie)?'filter:alpha(opacity='+(100-i*(100/this.blocks))+')':'-Moz-opacity:'+((100-i*(100/this.blocks))/100);
			str+='"></span>';
		}
		str+='</span></div>';
		str += '    </td>';
		str += '  </tr>';
		str += '</table>';
		str += '</div>';
		var parentElement = document.createElement("span");
		parentElement.innerHTML = str ;
	    var element = parentElement.firstChild || null;
	    document.body.appendChild(element);
	},
	start : function(){
		var blocks = document.getElementById('progressBlocks');
		if(parseInt(blocks.style.left)+this.height+1-(this.blocks * this.height+ this.blocks)> this.width){
			blocks.style.left=-(this.height*2+1)+'px';
			this.ctr++;
			if(this.ctr>=this.count){
				eval(this.action);
				this.ctr=0;
			}
		}else{
			blocks.style.left=(parseInt(blocks.style.left)+this.height+1)+'px';
		}
	},
	show : function (fnc){
		document.getElementById('message').style.visibility = "visible";  
		document.getElementById('progressBar').style.visibility = "visible";
		this.tid = setInterval(function(){BIZenic.ProgressBar.start(BIZenic.ProgressBar)},this.speed);
		if(fnc){
			setTimeout( function(){BIZenic.ProgressBar.hideDelay(fnc)}, 60000);
		}
	},
    hideDelay : function (fnc){
    	if(document.getElementById('message').style.visibility == "visible"){
    		this.hide();
    		if(fnc) fnc();
    	}
	},
	hide : function (){
		document.getElementById('message').style.visibility = "hidden";
		document.getElementById('progressBar').style.visibility = "hidden";
		clearInterval(this.tid);
	}
};

BIZenic.IFrameViewer = {
	width : 0,
	height : 0 ,
	IFrameViewer : null,
	ifm_IFrameViewer : null,
	create : function (width, height){
		this.width = width ;
		this.height = height;
		if(document.getElementById("IFrameViewer") == null){
			var str = '<div id="IFrameViewer" style="position: absolute; top: 200px; left: 100px; display:none">';
			str += '<IFRAME id="ifm_IFrameViewer" name="ifm_IFrameViewer" width="' + width + '" height="' + height + '" src="" scrolling="yes" frameborder="no" border="0"></IFRAME>' ;
			str += '</div>';
			var parentElement = document.createElement("span");
			parentElement.innerHTML = str ;
		    var element = parentElement.firstChild || null;
		    document.body.appendChild(element);
			this.IFrameViewer = document.getElementById("IFrameViewer");
			this.ifm_IFrameViewer = document.getElementById("ifm_IFrameViewer");
		}
	},
	onclick : function (evt){
		var evt = (window.event) ? window.event : evt;
		var element = evt.srcElement ? evt.srcElement : evt.target;
		if(this.input != element) this.hide();
		this.input = element;
		if(this.IFrameViewer.style.display == 'none'){
			this.view.apply(this, arguments);
		}else{
			this.hide();
		}
	},
	view :function (){
		if(arguments.length < 2) return ;
	    var top = document.body.clientTop + this.ObjectTop(this.input);
	    var left = document.body.clientLeft + this.ObjectLeft(this.input);
		// 스크린의 1/2 아래쪽일 경우 달력을 위쪽에 나타나도록 하기 위하여(지우지 말아 주이소)
		if(window.screen.height / 2 < top) top = top - 290;
	    if(this.IFrameViewer.style.pixelTop){
		    this.IFrameViewer.style.pixelTop = top + this.input.offsetHeight;
		}else{
			this.IFrameViewer.style.top = top + this.input.offsetHeight;
		}
		if(this.IFrameViewer.style.pixelLeft){
		    this.IFrameViewer.style.pixelLeft = left;
		}else{
			this.IFrameViewer.style.left = left
		}
		if(this.width == 0)this.ifm_IFrameViewer.style.width = this.input.offsetWidth;
		var frm = arguments[1] ;
	    for(var i = 2 ; i < arguments.length ; ){
	    	frm.elements[arguments[i]].value = arguments[i+1];
	    	i += 2 ;
	    }
		frm.target = "ifm_IFrameViewer";
	    frm.submit();
	    this.IFrameViewer.style.display = '';
	},
	hide :function (){
	    this.input = null;
	    this.IFrameViewer.style.pixelTop = 0;
	    this.IFrameViewer.style.pixelLeft = 0;
	    this.IFrameViewer.style.display = 'none';
	},
	ObjectTop : function (obj){
	    if (obj.offsetParent == document.body)
	        return obj.offsetTop;
	    else
	        return obj.offsetTop + this.ObjectTop(obj.offsetParent);
	},
	ObjectLeft : function (obj){
	    if (obj.offsetParent == document.body)
	        return obj.offsetLeft;
	    else
	        return obj.offsetLeft + this.ObjectLeft(obj.offsetParent);
	}
}
BIZenic.SelectCheckbox = {
	elename : null ,
	imageup : "/common/image/selectcheckbox_top.gif" ,
	imagedown : "/common/image/selectcheckbox_bottom.gif" ,
	height : 500 ,
	create: function(){
		function selectCheckbox(){}
		for (var property in BIZenic.SelectCheckbox){
			selectCheckbox.prototype[property] = BIZenic.SelectCheckbox[property];
		}
		selectCheckbox.prototype.constructor = selectCheckbox;
		selectCheckbox = new selectCheckbox();
		selectCheckbox.initialize.apply(selectCheckbox, arguments);
		return selectCheckbox;
	},
	toArray : function (iterable) {
		if (!iterable) return [];
		if (iterable.toArray) return iterable.toArray();
		var length = iterable.length || 0, results = new Array(length);
		while (length--) results[length] = iterable[length];
		return results;
	},
	bindAsEventListener: function(method) {
		var object = this, __method = method, args = this.toArray(arguments);
		return function(event) { return __method.apply(object, [event || window.event].concat(args));};
	},
	initialize : function(elename, elevalues, elemaps, width, height, path){
		this.elename = elename ;
		width = (width == null || width == 0 ? 100 : width );
		if(height != null || height != 0) this.height =  height ;
		if(path != null){
			this.imageup = path + this.imageup;
			this.imagedown = path + this.imagedown;
		}
		var str="" ;
		str +="<table border=0 style='margin:0px;padding:0px;'><tr><td>";
		str +="<input type='text' id='SELECTED_ALL_" + elename + "' name='SELECTED_ALL_" + elename + "' value='' class='textfield' style='width:" + (width - 15) + "px;' >";
		str +="<a href='#'>";
		str +="<img id='SELECTED_IMG_DOWN_" + elename + "' align='absmiddle' border=0 src='" + this.imagedown + "' style='display:inline'></a>"
		str +="<img id='SELECTED_IMG_UP_" + elename + "' align='absmiddle' border=0 src='" + this.imageup + "' style='display:none'></a>"
		str +="<br>";
		str +="<div id='SELECTED_DIV_" + elename + "' class='SELECTED_DIV' style='z-index:1;display:none'>";
		str +="<iframe id='SELECTED_IFRAME_" + elename + "' style='z-index:2;width:" + width + "px;height:" + height + "px;' frameborder='1'></iframe>";
		str +="<ul id='SELECTED_UL_" + elename + "' style='z-index:3;width:" + width + "px;height:" + height + "px;'>";
		str +="</ul>";
		str +="</div>";
		str +="</td></tr></table>";
		document.write(str);
		BIZenic.addEvent(document.getElementById("SELECTED_ALL_" + elename), "click" , this.bindAsEventListener(this.showhide) );
		BIZenic.addEvent(document.getElementById("SELECTED_IMG_DOWN_" + elename), "click" , this.bindAsEventListener(this.showhide) );
		BIZenic.addEvent(document.getElementById("SELECTED_IMG_UP_" + elename), "click" , this.bindAsEventListener(this.showhide) );
		BIZenic.addEvent(document.body, "click" , this.bindAsEventListener(this.hide) );
		this.resetElement(elename, elemaps , elevalues);
	},
	resetElement : function(elename, elemaps , elevalues){
		if(elevalues == null ) elevalues = "" ;
		document.getElementById("SELECTED_ALL_" + elename).value = elevalues ;
		var str="" ;
		str +="<li>";
		str +="<label id='SELECTED_LABEL_" + elename + "' for='SELECTED_CHECK_" + elename + "' class='USE' overname='USE'>";
		str +="<input id='SELECTED_CHECK_" + elename + "' name='SELECTED_CHECK_" + elename + "' value='' text='전체 선택' type=checkbox>전체 선택";
		str +="</label>"
		var elevaluesList = "," + elevalues + ",";
		for(var i = 0 ; i < elemaps.length ; i++){
			var className = elemaps[i][2] == "Y"  ? "USE" : "UNUSE" ;
			var checked = (elevaluesList.indexOf(elemaps[i][1]) > -1  ? "checked" : "") ;
			str +="<li>";
			str +="<label id='SELECTED_LABEL_" + elename + "' for='" + elename + elemaps[i][0] + "' class='" + className + "' overname='" + className + "'>";
			str +="<input id='" + elename + elemaps[i][0] + "' name='" + elename + "' value='" + elemaps[i][0] + "' text='" + elemaps[i][1] + "' type=checkbox " + checked + ">" + elemaps[i][1] + "";
			str +="</label>"
		}
		document.getElementById("SELECTED_UL_" + elename).innerHTML = str ;
		var checkAll = document.getElementById("SELECTED_CHECK_" + elename);
		BIZenic.addEvent(checkAll, "click" , this.bindAsEventListener(this.allClick,checkAll) );
		BIZenic.addEvent(checkAll.parentNode, "mouseover" , this.bindAsEventListener(this.mouseover,checkAll.parentNode));
		BIZenic.addEvent(checkAll.parentNode, "mouseout" , this.bindAsEventListener(this.mouseout,checkAll.parentNode));
		for(var i = 0 ; i < elemaps.length ; i++){
			var obj = document.getElementById(elename + elemaps[i][0]);
			BIZenic.addEvent(obj, "click" , this.bindAsEventListener(this.click,obj) );
			BIZenic.addEvent(obj.parentNode, "mouseover" , this.bindAsEventListener(this.mouseover,obj.parentNode));
			BIZenic.addEvent(obj.parentNode, "mouseout" , this.bindAsEventListener(this.mouseout,obj.parentNode));
		}
		var iframe = document.getElementById("SELECTED_IFRAME_" + elename);
		var ul = document.getElementById("SELECTED_UL_" + elename);
		if(((elemaps.length + 1) * 20 + 2) < this.height){
			iframe.style.height =  ((elemaps.length + 1) * 20 + 2) + "px";
			ul.style.height =  ((elemaps.length + 1) * 20 + 2) + "px";
		}else{
			iframe.style.height =  this.height + "px";
			ul.style.height =  this.height + "px";
		}
	},
	showhide : function(){
		var obj = document.getElementById("SELECTED_DIV_" + this.elename);
		if(obj.style.display == "block"){
			obj.style.display = "none";
			document.getElementById("SELECTED_IMG_UP_" + this.elename).style.display = "none";
			document.getElementById("SELECTED_IMG_DOWN_" + this.elename).style.display = "inline";
		}else{
			obj.style.display = "block";
			document.getElementById("SELECTED_IMG_UP_" + this.elename).style.display = "inline";
			document.getElementById("SELECTED_IMG_DOWN_" + this.elename).style.display = "none";
		}
	},
	mouseover : function(event, fnc, obj){
		obj.className = "HOVER";
	},
	mouseout : function(event, fnc, obj){
		obj.className = obj.getAttribute("overname");
	},
	hide : function(event){
		var evt = (window.event) ? window.event : event;
		var element = evt.srcElement ? evt.srcElement : evt.target ;
		if(element.name == this.elename 
		|| element.id == "SELECTED_ALL_" + this.elename 
		|| element.id == "SELECTED_IMG_UP_" + this.elename
		|| element.id == "SELECTED_IMG_DOWN_" + this.elename
		|| element.id == "SELECTED_LABEL_" + this.elename
		|| element.id == "SELECTED_CHECK_" + this.elename
		){
		}else{
			document.getElementById("SELECTED_DIV_" + this.elename).style.display = "none";
			document.getElementById("SELECTED_IMG_UP_" + this.elename).style.display = "none";
			document.getElementById("SELECTED_IMG_DOWN_" + this.elename).style.display = "inline";
		}
	},
	click : function(obj, fnc, ele){
		try{
			var selectedAll = document.getElementById("SELECTED_ALL_" + ele.name);
			var eles = ele.form.elements[ele.name];
			if(BIZenic.isArray(eles)){
				selectedAll.value = "" ;
				for(var i = 0 ; i < eles.length ; i++){
					selectedAll.value += eles[i].checked ? (selectedAll.value == "" ? "" : ",") + eles[i].getAttribute("text") : "";
				}
			}else{
				selectedAll.value = ele.checked ? eles.getAttribute("text") : "" ;
			}
		}catch(e){
			alert(e);
		}
	},
	allClick : function(obj, fnc, ele){
		try{
			var elename = ele.name.substring("SELECTED_CHECK_".length);
			var selectedAll = document.getElementById("SELECTED_ALL_" + elename);
			var eles = ele.form.elements[elename];
			if(BIZenic.isArray(eles)){
				for(var i = 0 ; i < eles.length ; i++){
					eles[i].checked = ele.checked ;
				}
			}else{
				eles.checked = ele.checked;
			}
			selectedAll.value = (ele.checked ? ele.getAttribute("text") : "") ;
		}catch(e){
			alert(e);
		}
	}
};

	/*
	ex)
		<script language="javascript">
			var elename = "ABC";
			var elevalues = "가,나,라" ; 
			var elemaps = [["1","가","Y"],["2","나","Y"],["3","다","N"],["4","라","N"],["5","마","N"],["6","바","N"],["7","사","N"]];
			BIZenic.SelectCheckbox.create(elename, elevalues , elemaps , 200, 100);
		</script>
	*/

	/*
	ex)
		var DEFAULT_ALLTARGET = "v_form" ;
		var DEFAULT_TARGET = "loc_move" ;
		var DEFAULT_RECORD = "<%=store.getMsg("ecm.common.title.announce")%>" ;
		var DEFAULT_SEQ = "announce_seq" ;
		var PAGE_LIST = "./announceList.jsp" ;
		var PAGE_VIEW = "./announceView.jsp" ;
		var PAGE_WRITE = "./announceWrite.jsp" ;
		var PAGE_WRITECTRL = "./announceWriteCtl.jsp" ;
		var PAGE_COPY = "./announceCopy.jsp" ;
		var PAGE_COPYCTRL = "./announceCopyCtl.jsp" ;
		var PAGE_MODIFY = "./announceModify.jsp" ;
		var PAGE_MODIFYCTRL = "./announceModifyCtl.jsp" ;
		var PAGE_DELETE = "./announceDelete.jsp" ;
		var DUPLICATE_NAME = ["server_nm","<%= entity.getString("server_nm") %>"];
	*/
	function checkedLength(frm, name){
		if(name ==null) return 0;
		var rtn = 0 ;
		for (var idx =0; idx <frm.elements.length ; idx++) {
			var element = frm.elements[idx] ;
			if(",radio,checkbox,".indexOf(","+element.type+",") > -1 && element.name == name && element.checked ){
				rtn++;
			}
		}
		return rtn ;
	}
	//조회페이지의 조회 초기화를 수행한다.
	function jsInit(){
		var frm = document.form ;
		if(arguments != null){
			for(var i  = 0 ; i < arguments.length ; i++){
				frm.elements[arguments[i]].value = "" ;
			}
		}
	};
	//조회페이지의 조회 초기화를 수행한다.
	function jsInit2(){
		if(arguments != null){
			for(var i  = 0 ; i < arguments.length ; i++){
				arguments[i].value = "" ;
			}
		}
	};
	//초기화
	function jsSearchInit(){
		var frm = document.form ;
		var target = document.forms[DEFAULT_TARGET];
		if(target != null && target.name != frm.name){
			for(var i = 0 ; i < target.elements.length ; i++ ){
				if(target.elements[i].name != DEFAULT_SEQ && frm.elements[target.elements[i].name] != null ){
					frm.elements[target.elements[i].name].value = target.elements[i].value;
				}
			}
		}
	};
	//검색
	function jsSearch(validateFnc, supports){
		var frm = document.form ;
		var value = "" ;
		for(var i = 0 ; i < frm.elements.length ; i++ ){
			var support = (supports == null ? ",text,radio,select-one,checkbox," : supports );
			if(support.indexOf(","+frm.elements[i].type+",") < 0 ) continue ;
			if(frm.elements[i].type == "text" ){
				value += frm.elements[i].value;
			}else if(frm.elements[i].type == "radio"){
				if(frm.elements[i].checked) value += frm.elements[i].value;
			}else if(frm.elements[i].type == "select-one"){
				if(frm.elements[i].selectedIndex != -1) 
					value += frm.elements[i].options[frm.elements[i].selectedIndex].value;
			}
			if(value != "") break;
		}
		if(value == ""){
			alert(ECM_COMMON_SELECT_NO_INPUT);
			return;
		}
		if(frm.validate()){
			if(BIZenic.isArray(validateFnc)){
				for (var i = 0 ; i < validateFnc.length ; i++){
					if(!validateFnc[i]()) return ;
				}
			}else if(validateFnc != null){
				if(!validateFnc()) return ;
			}
			frm.cp.value = "1";
			frm.pg.value = "1";
			frm.target = "";
			frm.method = "post";
			frm.action = PAGE_LIST ;
			frm.submit();
		}
	};
	function jsSubSearch(validateFnc, supports){
		var frm = document.form ;
		var value = "" ;
		for(var i = 0 ; i < frm.elements.length ; i++ ){
			var support = (supports == null ? ",text,radio,select-one,checkbox," : supports );
			if(support.indexOf(","+frm.elements[i].type+",") < 0 ) continue ;
			if(frm.elements[i].type == "text" ){
				value += frm.elements[i].value;
			}else if(frm.elements[i].type == "radio"){
				if(frm.elements[i].checked) value += frm.elements[i].value;
			}else if(frm.elements[i].type == "select-one"){
				if(frm.elements[i].selectedIndex != -1) 
					value += frm.elements[i].options[frm.elements[i].selectedIndex].value;
			}
			if(value != "") break;
		}
		if(value == ""){
			alert(ECM_COMMON_SELECT_NO_INPUT);
			return;
		}
		if(frm.validate()){
			if(BIZenic.isArray(validateFnc)){
				for (var i = 0 ; i < validateFnc.length ; i++){
					if(!validateFnc[i]()) return ;
				}
			}else if(validateFnc != null){
				if(!validateFnc()) return ;
			}
			frm.cp_sub.value = "1";
			frm.pg_sub.value = "1";
			frm.target = "";
			frm.method = "post";
			frm.action = PAGE_LIST ;
			frm.submit();
		}
	};
	//전체 조회
	function jsAllList(){
	  var trg = document.forms[DEFAULT_ALLTARGET] ;
	  trg.target = "";
	  trg.method = "post";
	  trg.action = PAGE_LIST ;
	  trg.submit();
	};
	//페이지를 이동한다.
	function jsPage(cp, pg, npp) {
		var frm = document.form ;
		jsSearchInit();
		frm.cp.value = cp;
		frm.pg.value = pg;
		frm.npp.value = npp;
		frm.method = "post";
		frm.target = "";
		frm.action = PAGE_LIST ;
		frm.submit();
	};
	function jsSubPage(cp, pg, npp) {
		var frm = document.form ;
		jsSearchInit();
		frm.cp_sub.value = cp;
		frm.pg_sub.value = pg;
		frm.npp_sub.value = npp;
		frm.method = "post";
		frm.target = "";
		frm.action = PAGE_LIST ;
		frm.submit();
	};
	//글쓰기 페이지로 이동한다.
	function jsWrite(){
		var frm = document.form ;
		jsSearchInit();
		frm.method = "post";
		frm.target = "";
		frm.action= PAGE_WRITE ;
		frm.submit();
	};

	//여러건중 한개선택 복사
	function jsChoiceCopy(validateFnc){
		var frm = document.form ;
		var seqs = checkedLength(frm, DEFAULT_SEQ) ;
		if(seqs == 1){
			if(BIZenic.isArray(validateFnc)){
				for (var i = 0 ; i < validateFnc.length ; i++){
					if(!validateFnc[i]()) return ;
				}
			}else if(validateFnc != null){
				if(!validateFnc()) return ;
			}
			frm.method = "post";
			frm.target = "";
			frm.action=PAGE_COPY ;
			jsSearchInit();
			frm.submit();
		} else if ( seqs >= 2 ) {
			BIZenic.alert(ECM_COMMON_SELECT_ONLY_ONE,{info_type : DEFAULT_RECORD })
		}else{
			BIZenic.alert(ECM_COMMON_NO_SELECT,{info_type : DEFAULT_RECORD });
		}
	};
	//여러건중 한개 선택 수정
	function jsChoiceModify(validateFnc){
		var frm = document.form ;
		var seqs = checkedLength(frm, DEFAULT_SEQ) ;
		if(seqs == 1){
			if(BIZenic.isArray(validateFnc)){
				for (var i = 0 ; i < validateFnc.length ; i++){
					if(!validateFnc[i]()) return ;
				}
			}else if(validateFnc != null){
				if(!validateFnc()) return ;
			}
			jsSearchInit();
			frm.method = "post";
			frm.target = "";
			frm.action=PAGE_MODIFY ;
			frm.submit();
		} else if ( seqs >= 2 ) {
			BIZenic.alert(ECM_COMMON_SELECT_ONLY_ONE,{info_type : DEFAULT_RECORD })
		}else{
			BIZenic.alert(ECM_COMMON_NO_SELECT,{info_type : DEFAULT_RECORD });
		}
	};
	//여러건 삭제
	function jsAllDelete(validateFnc){
		var frm = document.form ;
		if(checkedLength(frm, DEFAULT_SEQ)> 0){
			if(BIZenic.isArray(validateFnc)){
				for (var i = 0 ; i < validateFnc.length ; i++){
					if(!validateFnc[i]()) return ;
				}
			}else if(validateFnc != null){
				if(!validateFnc()) return ;
			}
			if (confirm(BIZenic.message(ECM_COMMON_DEL_CONFIRM,{info_type : DEFAULT_RECORD }))) {
				jsSearchInit();
				frm.method = "post";
				frm.target = "";
				frm.action=PAGE_DELETE ;
				frm.submit();
			}
		}else{
			BIZenic.alert(ECM_COMMON_NO_SELECT,{info_type : DEFAULT_RECORD });
		}
	};
	//체크박스 전체 선택
	function jsAllSelect(){
		var frm = document.form ;
		for ( var i=0 ; i < frm.elements.length ; i++ ) {
			var ckbox = frm.elements[i];
			if ( frm.elements[i].name == DEFAULT_SEQ )
				frm.elements[i].checked = !frm.elements[i].checked;
		}
		return;
	};
	//글쓰기 완료페이지로 이동한다.
	function jsWriteCtrl(validateFnc){
		var frm = document.form ;
		if(BIZenic.isArray(validateFnc)){
			for (var i = 0 ; i < validateFnc.length ; i++){
				if(!validateFnc[i]()) return ;
			}
		}else if(validateFnc != null){
			if(!validateFnc()) return ;
		}
		if(frm.validate()) {
			frm.method = "post";
			frm.target = "";
			frm.action=PAGE_WRITECTRL;
			frm.submit();
		}
	};
	//단건 삭제
	function jsDelete(){
		if(confirm(BIZenic.message(ECM_COMMON_DEL_CONFIRM_ONE,{info_type : DEFAULT_RECORD }))){
			var frm = document.forms[DEFAULT_TARGET] && document.forms[DEFAULT_TARGET].elements[DEFAULT_SEQ] ? document.forms[DEFAULT_TARGET] : document.form ;
			frm.method = "post";
			frm.target = "";
			frm.action = PAGE_DELETE ;
			frm.submit();
		}
	};
	//복사화면으로 이동
	function jsCopy(){
		var frm = document.forms[DEFAULT_TARGET] && document.forms[DEFAULT_TARGET].elements[DEFAULT_SEQ] ? document.forms[DEFAULT_TARGET] : document.form ;
		frm.method = "post";
		frm.target = "";
		frm.action = PAGE_COPY;
		frm.submit();
	};
	//수정화면으로 이동
	function jsModify(){
		var frm = document.forms[DEFAULT_TARGET] && document.forms[DEFAULT_TARGET].elements[DEFAULT_SEQ] ? document.forms[DEFAULT_TARGET] : document.form ;
		frm.method = "post";
		frm.target = "";
		frm.action=PAGE_MODIFY ;
		frm.submit();
	};
	//수정
	function jsModifyCtrl(validateFnc){
		var frm = document.form ;
		if(BIZenic.isArray(validateFnc)){
			for (var i = 0 ; i < validateFnc.length ; i++){
				if(!validateFnc[i]()) return ;
			}
		}else if(validateFnc != null){
			if(!validateFnc()) return ;
		}
		if(frm.validate()) {
			if(window.DUPLICATE_NAME){
				if(document.getElementsByName("nm_change_yn")){
					frm.nm_change_yn.value = "N";
					for(var i = 0 ; i < DUPLICATE_NAME.length /2 ; i++){
						if(frm.elements[DUPLICATE_NAME[2*i]].value != DUPLICATE_NAME[2*i + 1]){
							frm.nm_change_yn.value = "Y";
						}
					}
				}else{
					for(var i = 0 ; i < DUPLICATE_NAME.length /2 ; i++){
						if(frm.elements[DUPLICATE_NAME[2*i]].value == DUPLICATE_NAME[2*i + 1]){
							frm.elements[DUPLICATE_NAME[2*i]].value = "" ;
						}
					}
				}
			}
			frm.method = "post";
			frm.target = "";
			frm.action = PAGE_MODIFYCTRL;
			frm.submit();
		}
	};
	//수정
	function jsCopyCtrl(validateFnc){
		var frm = document.form ;
		if(BIZenic.isArray(validateFnc)){
			for (var i = 0 ; i < validateFnc.length ; i++){
				if(!validateFnc[i]()) return ;
			}
		}else if(validateFnc != null){
			if(!validateFnc()) return ;
		}
		if(frm.validate()) {
			frm.method = "post";
			frm.target = "";
			frm.action = PAGE_COPYCTRL;
			frm.submit();
		}
	};
	//조회화면으로 이동
	function jsList(){
		var frm = document.forms[DEFAULT_TARGET] && document.forms[DEFAULT_TARGET].elements[DEFAULT_SEQ] ? document.forms[DEFAULT_TARGET] : document.form ;
		frm.method = "post";
		frm.target = "";
		frm.action = PAGE_LIST ;
		frm.submit();
	};
	//보기 화면으로 이동 value, key, value, key 형식으로 전달
	function jsView(seqValue , seqName ){
		var frm = document.forms[DEFAULT_TARGET];
		if(arguments.length > 1 ){
			for(var i = 0 ; i < (arguments.length)/2 ; i++){
				frm.elements[arguments[2* i + 1]].value = arguments[2* i] ;
			}
		}else if(arguments.length > 0){
			frm.elements[DEFAULT_SEQ].value = seqValue;
		}
		frm.method="post";
		frm.target = "";
		frm.action=PAGE_VIEW ;
		frm.submit();
	};

	
	// 사용자 선택
	function jsAdminSearch2(obj){
		var w = screen.availWidth;
		var h = screen.availHeight;
		var popW = 550, popH = 500;
		var leftPos = (w-popW)/2, topPos = (h-popH)/2-50;
		
		obj.method = "post";
		obj.target = "";
		obj.target = "adminGrpSearch";
		obj.action = "../../system/admin/adminGrpSearch2.jsp";
		window.open('','adminGrpSearch','width=550,height=500,scrollbars=yes,resizable=no,top='+(window.screenY+topPos)+',left='+(window.screenX+leftPos));
		obj.submit();
	}

	function jsAdminSearch(obj){
		var w = screen.availWidth;
		var h = screen.availHeight;
		var popW = 550, popH = 500;
		var leftPos = (w-popW)/2, topPos = (h-popH)/2-50;
		
		obj.method = "post";
		obj.target = "";
    	obj.target = "adminGrpSearch";
    	obj.action = "../../system/admin/adminGrpSearch.jsp";
    	window.open('','adminGrpSearch','width=550,height=500,scrollbars=yes,resizable=no,top='+(window.screenY+topPos)+',left='+(window.screenX+leftPos));
        obj.submit();
	}
	

	// 기사 유형 트리를 팝업으로 보여준다.
	function jsTreeSearch(){
		var obj = document.loc_move;
		var w = screen.availWidth;
		var h = screen.availHeight;
		var popW = 370, popH = 350;
		var leftPos = (w-popW)/2, topPos = (h-popH)/2-50;
		
		obj.method = "post";
    	obj.target = "treeSearch";
    	obj.action = "../../system/tree/treeTreePop.jsp";
    	window.open('','treeSearch','width=370,height=350,scrollbars=yes,resizable=yes,top='+(window.screenY+topPos)+',left='+(window.screenX+leftPos));
        obj.submit();
	}

	//스크립트 변환 2013-05-01 yongjun
	function jsTransScript(text){
		var convert = text;
		var nPos = 0;
		while((nPos = convert.toLowerCase().indexOf("<script")) >= 0){
			convert = convert.substring(0,nPos) + "&lt;"+convert.substring(nPos+1);
			nPos = convert.toLowerCase().indexOf(">", nPos);
			convert = convert.substring(0,nPos) + "&gt;"+convert.substring(nPos+1);
			nPos = convert.toLowerCase().indexOf("<\/script>");
			if(nPos >= 0) convert = convert.substring(0,nPos) + "&lt;/script&gt;"+convert.substring(nPos+9);
	    }
	    while((nPos = convert.toLowerCase().indexOf("<iframe",nPos)) >= 0){
			convert = convert.substring(0,nPos) + "&lt;iframe"+convert.substring(nPos+1);
			nPos = convert.toLowerCase().indexOf(">", nPos);
			convert = convert.substring(0,nPos) + "&gt;"+convert.substring(nPos+1);
			nPos = convert.toLowerCase().indexOf("<\/iframe>");
			if(nPos >= 0) convert = convert.substring(0,nPos) + "&lt;/iframe&gt;"+convert.substring(nPos+9);
	    }
	    while((nPos = convert.toLowerCase().indexOf("<javascript")) >= 0){
			convert = convert.substring(0,nPos) + "&lt;javascript"+convert.substring(nPos+1);
			nPos = convert.toLowerCase().indexOf(">", nPos);
			convert = convert.substring(0,nPos) + "&gt;"+convert.substring(nPos+1);
			nPos = convert.toLowerCase().indexOf("<\/javascript>");
			if(nPos >= 0) convert = convert.substring(0,nPos) + "&lt;/javascript&gt;"+convert.substring(nPos+13);
	    }
	    while((nPos = convert.toLowerCase().indexOf("<object")) >= 0){
			convert = convert.substring(0,nPos) + "&lt;object"+convert.substring(nPos+1);
			nPos = convert.toLowerCase().indexOf(">", nPos);
			convert = convert.substring(0,nPos) + "&gt;"+convert.substring(nPos+1);
			nPos = convert.toLowerCase().indexOf("<\/object>");
			if(nPos >= 0) convert = convert.substring(0,nPos) + "&lt;/object&gt;"+convert.substring(nPos+9);
	    }
	    while((nPos = convert.toLowerCase().indexOf("<embed")) >= 0){
			convert = convert.substring(0,nPos) + "&lt;embed"+convert.substring(nPos+1);
			nPos = convert.toLowerCase().indexOf(">", nPos);
			convert = convert.substring(0,nPos) + "&gt;"+convert.substring(nPos+1);
			nPos = convert.toLowerCase().indexOf("<\/embed>");
			if(nPos >= 0) convert = convert.substring(0,nPos) + "&lt;/embed&gt;"+convert.substring(nPos+8);
	    }
	   	while((nPos = convert.toLowerCase().indexOf("<applet")) >= 0){
			convert = convert.substring(0,nPos) + "&lt;applet"+convert.substring(nPos+1);
			nPos = convert.toLowerCase().indexOf(">", nPos);
			convert = convert.substring(0,nPos) + "&gt;"+convert.substring(nPos+1);
			nPos = convert.toLowerCase().indexOf("<\/applet>");
			if(nPos >= 0) convert = convert.substring(0,nPos) + "&lt;/applet&gt;"+convert.substring(nPos+9);
	    }
	   	return convert;
	}
	
	function replaceHtml(str){
        if(str == null) {
        	str = "";
        } else if(typeof str == 'string'){
        	str = str.replace(/&/gi, "&amp;")
        			 .replace(/</gi, "&lt;")           
        			 .replace(/>/gi, "&gt;")
        			 .replace(/\"/gi, "&quot;");
        }
        return str;
	}
