
if (BIZenic == null) var BIZenic = {};

BIZenic.Validate = {
	VALID_SHOW_STYLE : "inline",
	VALID_ERASE_VALUE_DISABLE : true,
	VALID_DEFAULT_REQUIRED_SKIN : "valid_required",
	VALID_REQUIRED_IGNORE_WHITESPACE : true,
	validators : new Array(),
	isInit : false,
	init : function(){
		if(this.isInit) return;
		
		for(var valid in BIZenic.Validate){
			if(BIZenic.Validate[valid]["key"] != "undefined"){
				this.validators[this.validators.length] = BIZenic.Validate[valid] ;
			}
		}
		//초기화
		var objSess = null;
		var loop = document.forms.length;
		for ( var idx = 0 ; idx < loop ; idx++)  {
			document.forms[idx].initialize = BIZenic.Validate.Form.initialize;
			document.forms[idx].initialize((arguments.length > 0 ? arguments[0] : null));
		}
		var element = document.createElement("div");
		element.id = "div_balloon" ;
		element.className = "valid_dek" ;
		element.style.zIndex = 200 ;
		element.style.visibility = "hidden";
		element.style.overflow = "hidden";
		element.style.position = "absolute";
		document.body.appendChild(element);
		//document.body.insertBefore(element, document.body.firstChild);

		BIZenic.addOnUnLoad( function(){BIZenic.Validate.unload();});
		this.isInit = true ;
	},
	unload : function (){
		if(document.forms == null) return;
		var loopend = document.forms.length;
		for ( var idx = 0 ; idx < loopend ; idx++) {
			if(typeof(document.forms[idx].unload ) == "undefined") continue;
			document.forms[idx].unload();
		}
	}
};
BIZenic.Validate.Form = {
	initialize : function(){
	    this.setAttribute("VALID_ACTIVATE",true);
	    this.setAttribute("VALID_MAGIC_QUOTE",true);
	    this.setAttribute("VALID_ESCAPE",false);
   	    this.setAttribute("VALID_ADD_VALUE",true);
   	    this.setAttribute("VALID_DISABLSUBMIT",true);

		if (this.onsubmit) this.oldSubmit = this.onsubmit;
		this.submitObject = new Object();

		this.oldReset = this.reset;
		
		for (var property in BIZenic.Validate.Form){
			this[property] = BIZenic.Validate.Form[property];
		}
		
		var loopend = this.elements.length;
		for(var idx=0; idx < loopend ; idx++){
			this.elements[idx].initialize = BIZenic.Validate.Element.initialize;
			this.elements[idx].initialize(this);
		}
		//validinit
		for(var idx=0; idx < loopend ; idx++){
			if(this.elements[idx].validinit)this.elements[idx].validinit();
		}
		this.masking();
		this.magicQuoteErase();
		//this.unEscape();
		if(arguments != null && arguments[0] != null){
			var ss = arguments[0].split("&");
			for(var j = 0 ; j < ss.length ; j++ )  {
				if ( ss[j] == "" ) continue;
				var tt = ss[j].split("=");
				this.createHiddenInputType(tt[0],tt[1]);
			}
		}
		this.createHiddenInputType("sessID",TAGSESID);

	},
	onsubmit : function (e) {
		if (!this.validate()) {
			if (event) event.returnValue = false;
			return false;
		}
		if ( this.getAttribute("confirm") && !confirm(this.getAttribute("confirm")) ) {
			if (event) event.returnValue = false;
			return false;
		}
		this.unMasking();
		if (this.oldSubmit && this.oldSubmit() == false)  {
			if (event) event.returnValue = false;
			return false;
		}
		if (this.getAttribute("VALID_MAGIC_QUOTE")) this.magicQuoteAdd();
		if (this.getAttribute("VALID_ESCAPE")) this.escape();
		if (this.getAttribute("VALID_ADD_VALUE") && event && event.type=="button") this.addSendValue();
		if (this.getAttribute("VALID_DISABLSUBMIT")) this.disableSubmit();
		if (!event || event.type != 'button') this.submit();
		return true;
	},
	disableSubmit : function(){
		for(var idx=0; idx < this.elements.length ; idx++)
			if (this.elements[idx].type == "submit" || this.elements[idx].type == "image") this.elements[idx].disable();
	},
	validate : function (){
		if (!this.getAttribute("VALID_ACTIVATE")) return true;
		for(var idx=0; idx < this.elements.length ; idx++)
			if (this.elements[idx].validate && this.elements[idx].validate() == false ) return false;
		return true;
	},
	survey_validate : function (){
		if (!this.getAttribute("VALID_ACTIVATE")) return true;
		var s_flag = true;
		var focus_flag = true;
		var delay_flag = true;
		
		var first_valid_item_no = null;
		var first_focus_item_order = null;	// 2012.10.04 by kevin Ticket #1053
		
		var item_not_open = true;
		var item_order = null;
		var item_display = null;
		var valid_item = null;
		
		var item_open_list = "";
		
		var loopend = this.elements.length;
		// message init
		for(var idx=0; idx < loopend ; idx++) {
			item_order = this.elements[idx].getAttribute("itemorder");
			if(item_order != null) {
				valid_item = document.getElementById("valid_item_" + item_order);
				valid_item.innerHTML = "";
			}
		}
		
		for(var idx=0; idx < loopend ; idx++) {

			item_order = this.elements[idx].getAttribute("itemorder");
			
			if(item_order != null) {
				item_display = document.getElementById("item_" + item_order);
				
				// 2012.10.09 by kevin if submit, text box modify white error;
				if(this.elements[idx].getAttribute("disabled")) continue;
				
				if(!item_display || item_display.style.display == "none") {	// not open
					if (item_not_open && !this.elements[idx].getAttribute("disabled")) item_open_list += item_order + ",";
					
					if (this.elements[idx].validate && this.elements[idx].validate() == false ) {
						if(focus_flag) {
							first_valid_item_no = this.elements[idx];
							first_focus_item_order = item_order;
						}
						item_not_open = false;
						focus_flag = false;
					}
							
					valid_item = document.getElementById("valid_item_" + item_order);
					valid_item.innerHTML = "";
					
					
				} else {	// open
					if (item_not_open && this.elements[idx].validate && this.elements[idx].validate() == false ) {
						if(focus_flag) {
							first_valid_item_no = this.elements[idx];
							first_focus_item_order = item_order;
						}
						focus_flag = false;
						s_flag = false;
					}
				}
			} else {
				if (item_not_open && this.elements[idx].validate && this.elements[idx].validate() == false ) {
					s_flag = false;
					delay_flag = false;
				}
			}	
		}
		
		if(s_flag&&!item_not_open) {
			var ss = item_open_list.split(",");
			for(var j = 0 ; j < ss.length ; j++ )  {
				if ( ss[j] == "" ) continue;
				
				item_display = document.getElementById("item_" + ss[j]);
				valid_item = document.getElementById("valid_item_" + ss[j]);
				item_display.style.display = BIZenic.Validate.VALID_SHOW_STYLE;
			}
			
			valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_NO_INPUT) + '</b></font>';
		}
		
		if(!focus_flag) {
			self.location.hash = "focus_item_" + first_focus_item_order;		// name
			if(delay_flag) {
				var item_name = first_valid_item_no.getAttribute("itemname");
				if(item_name != null) alert(BIZenic.message(ANSWER_WRONG_ALERT , {ques_no: item_name}));
			}
			first_valid_item_no.focus();
		}
		
		return s_flag&item_not_open;
			
	},
	// 2012.09.25 by keven delete function
	survey_validate_1 : function (){
		if (!this.getAttribute("VALID_ACTIVATE")) return true;
		var s_flag = true;
		
		var item_not_open = true;
		var item_order = null;
		var item_display = null;
		var valid_item = null;
		
		var loopend = this.elements.length;

		for(var idx=0; idx < loopend ; idx++) {

			item_order = this.elements[idx].getAttribute("itemorder");
			if(item_order != null) {
				item_display = document.getElementById("item_" + item_order);
				if(!item_display || item_display.style.display == "none") {	// not open
					if (this.elements[idx].validate && this.elements[idx].validate() == false ) item_not_open = false;
							
					valid_item = document.getElementById("valid_item_" + item_order);
					valid_item.innerHTML = "";
				} else {	// open
					if (item_not_open && this.elements[idx].validate && this.elements[idx].validate() == false ) {
						s_flag = false;
					}
				}
			} else {
				if (item_not_open && this.elements[idx].validate && this.elements[idx].validate() == false ) {
					s_flag = false;
				}
			}			
		}
		
		if(s_flag&&!item_not_open) {
			alert("열리지 않은 문항에 필수 응답 문항이 존재합니다.");
		}
		return s_flag&item_not_open;
			
	},
	masking : function (){
		var loopend = this.elements.length;
		for(var idx=0; idx < loopend ; idx++)
			if (this.elements[idx].masking) this.elements[idx].masking();
	},
	unMasking : function (){
		var loopend = this.elements.length;
		for(var idx=0; idx < loopend ; idx++){
			if (this.elements[idx].stripMasking) this.elements[idx].stripMasking();
			else if (this.elements[idx].unMasking) this.elements[idx].unMasking();
		}
	},
	enable : function (fields){ this.controlFunc(fields, "enable");},
	disable : function (fields){ this.controlFunc(fields, "disbale");},
	show : function (fields){ this.controlFunc(fields, "show");},
	hide : function (fields){this.controlFunc(fields, "hide");},
	reset : function (){
		this.oldReset();
		var loopend = this.elements.length;
		for(var idx=0; idx < loopend ; idx++)
			if (this.elements[idx].name == "sessID") this.elements[idx].value=TAGSESID;
	},
	controlFunc : function(fields, fnc){
		var node = null;
		var ss = fields.split(",");
		for(var j in  ss )  {
			if ( ss[j] == "" || !this.elements[ss[j]]) continue;
			node = this.elements[ss[j]];
			if (typeof(node.name) == "undefined") {
				for (idx = 0 ; idx<node.length ; idx++){
					if (fnc == "enable" && node[idx].enable) node[idx].enable();
					if (fnc == "disbale" && node[idx].disable) node[idx].disable();
					if (fnc == "show" && node[idx].show) node[idx].show();
					if (fnc == "hide" && node[idx].hide) node[idx].hide();
				}
			}else{
				if (fnc == "enable" &&  node.enable) node.enable();
				if (fnc == "disbale" && node.disable) node.disable();
				if (fnc == "show" && node.show) node.show();
				if (fnc == "hide" && node.hide) node.hide();
			}
		}
	},
	checking : function (objName){
		var loopend = this.elements.length;
		for(var idx=0; idx < loopend ; idx++)
			if ( this.elements[idx].name == objName && this.elements[idx].type == "checkbox" || this.elements[idx].type == "radio" ) this.elements[idx].checking();
	},
	unChecking : function (objName){
		var loopend = this.elements.length;
		for(var idx=0; idx < loopend ; idx++)
			if ( this.elements[idx].name == objName &&  this.elements[idx].type == "checkbox" || this.elements[idx].type == "radio" ) this.elements[idx].unChecking();
	},
	findAttributeElement : function(attribute){
		var loopend = this.elements.length;
		for(var idx=0; idx < loopend ; idx++){
			if(this.elements[idx].getAttribute(attribute) != null){
				return this.elements[idx];
			}
		}
		return null;
	},
	findOrders : function(name){
		var result = new Array();
		var loopend = this.elements.length;
		for(var idx=0; idx < loopend ; idx++){
			if(this.elements[idx].getAttribute("itemorder") == name){
				result[result.length] = this.elements[idx];
			}
		}
		return result;
	},
	findGroups : function(name){
		var result = new Array();
		var loop = this.elements.length;
		for(var idx=0; idx < loop ; idx++){
			if(this.elements[idx].getAttribute("group") == name){
				result[result.length] = this.elements[idx];
			}
		}
		return result;
	},
	searchElements : function (prefix, surffix){
		var result = new Array();
		var loopend = this.elements.length;
		for(var idx=0; idx < loopend ; idx++){
			if(this.elements[idx].name.startsWith(prefix) && this.elements[idx].name.endsWith(surffix)){
				result[result.length] = this.elements[idx];
			}
		}
		return result;
	},
	findElements : function (name){
		if(this.elements[name] == null){
			return new Array();
		}else if(typeof( this.elements[name].name) == "undefined"){
			return this.elements[name];
		}else{
			return new Array(this.elements[name]);
		}
	},
	findElement : function (foword,objName){
		var loopend = this.elements.length;
		if (foword == null ){
			//return (typeof( this.elements[objName].name) == "undefined" ? this.elements[objName][0] : this.elements[objName]);
			for(var idx=0; idx < loopend ; idx++){
				if ( this.elements[idx].name == objName ) return this.elements[idx];
			}
			//다답형인경우에는 이름이 같지 않다. 따라서 한번 더 돌아서 체크한다.
			for(var idx=0; idx < loopend ; idx++){
				if(this.elements[idx].name.length > objName.length){
					if ( this.elements[idx].name.substring(0,objName.length) == objName ) return this.elements[idx];
				}
			}
			return null;

		}
		var selfEleIndex = this.elements.length;
		var loopend = this.elements.length;
		for(var idx=0; idx < loopend ; idx++){
			if ( this.elements[idx].name == objName ) {
				selfEleIndex = idx;
				holdIndex = idx;
				break;
			}
		}
		do{
			if(foword == "next") selfEleIndex ++;
			else selfEleIndex--;
			var focusObj = this.elements[selfEleIndex];
			if (selfEleIndex >= this.elements.length ) selfEleIndex = 0;
			if ( selfEleIndex == holdIndex ) break;
		} while ( typeof(focusObj) == 'undefined' || focusObj.readonly || focusObj.isAttribute("lable" ) || focusObj.style.display == "none" || (focusObj.type && focusObj.type=='hidden'));
		if (selfEleIndex >= this.elements.length) selfEleIndex = 0;
		return this.elements[selfEleIndex];
	},
	nextElement : function (name){this.findElement("next", name)},
	prevElement : function (name){this.findElement("prev", name)},
	escape : function (){
		var loopend = this.elements.length;
		for(var idx=0; idx < loopend ; idx++){
			var node = this.elements[idx];
			if ((node.type != "button" && node.type != "submit" && node.type != "reset" ) && node.value) node.value = escape(node.value);
		}
	},
	unEscape : function (){
		var loopend = this.elements.length;
		for(var idx=0; idx < loopend ; idx++)
			if (this.elements[idx].value) this.elements[idx].value = unescape(this.elements[idx].value);
	},
	magicQuoteAdd : function (){
		var loopend = this.elements.length;
		for(var idx=0; idx < loopend ; idx++){
			if (this.elements[idx].value && this.elements[idx].magicQuoteAdd)
				this.elements[idx].value = this.elements[idx].magicQuoteAdd();
		}
	},
	magicQuoteErase : function (){
		var loopend = this.elements.length;
		for(var idx=0; idx < loopend ; idx++){
			if (this.elements[idx].value && this.elements[idx].magicQuoteErase)
				this.elements[idx].value = this.elements[idx].magicQuoteErase();
		}
	},
	setSubmitInputTypeObj : function (obj){
		this.submitObject = obj;
	},
	createHiddenInputType : function (inputName, inputValue){
		var oElement = null;
		if (this.elements[inputName]== null) { //input ojbect is not exist
			var oHid=document.createElement("input");
			oHid.type = "hidden";
			oHid.id = inputName;
			oHid.name = inputName;
			this.appendChild (oHid);
			oElement = oHid;
		} else {
			oElement = this.elements[inputName];
		}
		oElement.value = inputValue;
	},
	addSendValue : function (){
		var type = this.submitObject.type;
		if (!( type == "submit" || type == "image" )) return;
		var pStr = this.submitObject.getAttribute("send_value");
		if (pStr == null || pStr =="" ) return;
		var ss = pStr.split("&");
		for(var j in  ss )  {
			if ( ss[j] == "" ) continue;
			var tt = ss[j].split("=");
			this.createHiddenInputType(tt[0],tt[1]);
		}
	},
	unload : function(){
		var loopend = this.elements.length;
		for(var idx=0; idx < loopend ; idx++){
			if ( this.elements[idx].validators != null && this.elements[idx].validators.length > 0 ) {
				var endcnt = this.elements[idx].validators.length;
				for (var jdx =0; jdx < endcnt ; jdx++) {
					delete this.elements[idx].validators[jdx];
				}
			}
			if ( this.elements[idx].strippers != null &&this.elements[idx].strippers.length > 0 ) {
				var endcnt = this.elements[idx].strippers.length;
				for (var kdx =0; kdx <endcnt ; kdx++) {
					delete this.elements[idx].strippers[kdx];
				}
			}
			if ( this.elements[idx].assistants != null &&this.elements[idx].assistants.length > 0 ) {
				var endcnt = this.elements[idx].assistants.length;
				for (var kdx =0; kdx <endcnt ; kdx++) {
					delete this.elements[idx].assistants[kdx];
				}
			}
			if ( this.elements[idx].events != null &&this.elements[idx].events.length > 0 ) {
				var endcnt = this.elements[idx].events.length;
				for (var kdx =0; kdx <endcnt ; kdx++) {
					delete this.elements[idx].events[kdx];
				}
			}
		}
	}
};

BIZenic.Validate.Element = {
	VALID_CSS_PLAINED : true ,
	initialize : function (parent){
		if(this.id != null && (this.id.startsWith("FontsEditor") || this.id.startsWith("SizesEditor"))){
			return ;
		}
		this.parent = parent;
		this.hideValue = "";
		this.impotence = false;

		if (this.onblur) this.old_onblur = this.onblur;
		if (this.onchange) this.old_onchange = this.onchange;
		if (this.onkeypress) this.old_onkeypress = this.onkeypress;
		if (this.onmouseover) this.old_onmouseover = this.onmouseover;
		if (this.onmouseout) this.old_onmouseout = this.onmouseout;
		if (this.onfocus) this.old_onfocus = this.onfocus;
		if (this.onclick) this.old_onclick = this.onclick;

		this.validators = new Array;
		this.strippers = new Array;
		this.assistants = new Array;
		
		if (!this.events) this.events = new Array;

		for (var property in BIZenic.Validate.Element){
			this[property] = BIZenic.Validate.Element[property];
		}
		if(",dp,dp_start,dp_end,".indexOf(","+this.id+",") > -1 || this.isAttribute("date")){
			BIZenic.DatePicker.create();
		}
		
	},
	validinit : function(){
		for(var valid in BIZenic.Validate.validators){
			if(this.isAttribute(BIZenic.Validate.validators[valid]["key"])){
				
				var validator = BIZenic.Validate.Base.create(BIZenic.Validate.validators[valid]  , this);
				if(validator == null) continue ;
				//survey_dest를 처음으로 이동함
				if(validator.key == "survey_dest"){
					this.validators.unshift(validator);
				}else{
				this.validators[this.validators.length] = validator;
				}
			}
		}
		var endcnt = this.validators.length;
		for(var i = 0 ; i < endcnt ; i++){
			this.validators[i].uiChange();
		}
	},
	isAttribute : function (attr){  return ( this.getAttribute(attr) != null ) ? true : false;},
	isAttrValue : function (attr){return ( this.getAttribute(attr)) ? true : false;},
	storeValue : function (){
		if (!BIZenic.Validate.VALID_ERASE_VALUE_DISABLE) return;
		if (this.value == "" || this.value == null ) return;
		this.hideValue = this.value;
		this.value = "";
	},
	restoreValue : function (){
		if (!BIZenic.Validate.VALID_ERASE_VALUE_DISABLE) return;
		if (this.hideValue == "" || this.hideValue == null ) return;
		this.value = this.hideValue;
		this.hideValue = "";
	},
	enable : function (){
		if (!this.isAttribute("disabled")) return;
		var support1 = ",tel,number,text,password,textarea,select-one,select-multiple,image,file," ;
		var support2 = ",radio,checkbox," ;
		var support3 = ",button,submit,reset," ;
		if(support1.indexOf(","+this.type+",") > -1){
			this.restoreValue();
			this.removeAttribute("disabled");
			this.style.backgroundColor = "#ffffff";
		}else if(support2.indexOf(","+this.type+",") > -1){
			this.restoreValue();
			this.removeAttribute("disabled");
			// 2012.10.09 by kevin samsung phone errer!! 2 line add, radio is diff.. line
			if(this.type == "checkbox") {
				this.checked = !this.checked;
				this.checked = !this.checked;
			}
			
			//document.getElementById(this.id).removeAttribute("disabled");
		}else if(support3.indexOf(","+this.type+",") > -1){
			this.removeAttribute("disabled");
			this.style.backgroundColor = "#dfdfde";
		}
		this.impotence = false;
	},
	disable : function (){
		if (this.getAttribute("disabled")) return;
		var support1 = ",tel,number,text,password,textarea,select-one,select-multiple,image,file," ;
		var support2 = ",radio,checkbox," ;
		var support3 = ",button,submit,reset," ;
		if(support1.indexOf(","+this.type+",") > -1){
			this.storeValue();
			this.setAttribute("disabled",true);
			this.style.backgroundColor = "#cccccc";
		}else if(support2.indexOf(","+this.type+",") > -1){
			this.storeValue();
			// 2012.10.09 by kevin samsung phone errer!! 2 line add, radio is diff.. line
			if(this.type == "checkbox") {
				this.checked = !this.checked;
				this.checked = !this.checked;
			} 
			this.setAttribute("disabled",true);
			//this.setAttribute("disabled","disabled");
			//document.getElementById(this.id).setAttribute("disabled",true);
		}else if(support3.indexOf(","+this.type+",") > -1){
			this.setAttribute("disabled",true);
			this.style.backgroundColor = "#cccccc";
		}
		this.impotence = true;
	},
	show : function (){
		if (this.style.display == BIZenic.Validate.VALID_SHOW_STYLE ) return;
		var support = ",tel,number,text,password,textarea,button,submit,reset,radio,checkbox,select-one,select-multiple,image,file," ;
		if(support.indexOf(","+this.type+",") > -1){
			this.restoreValue();
			this.style.display = BIZenic.Validate.VALID_SHOW_STYLE;
		}
		this.impotence = false;
	},
	hide : function (){
		if (this.style.display == "none" ) return;
		var support = ",tel,number,text,password,textarea,button,submit,reset,radio,checkbox,select-one,select-multiple,image,file," ;
		if(support.indexOf(","+this.type+",") > -1){
			this.storeValue();
			this.style.display = "none";
		}
		this.impotence = true;
	},
	checking : function (){
		var support = ",checkbox,radio,";
		if(support.indexOf(","+this.parent.type+",") > -1 ) return ;
		this.checked  = true;
	},
	unChecking : function (){
		var support = ",checkbox,radio,";
		if(support.indexOf(","+this.parent.type+",") > -1 ) return ;
		this.checked  = false;
	},
	magicQuoteAdd : function (){
		if (!this.value) return ""; //입력값 없는 경우는 Pass
		return this.value.replace(/\\/ig ,"\\\\").replace(/\'/ig ,"\\'").replace(/\"/ig ,"\\\"");
	},
	magicQuoteErase : function (){
		if (!this.value) return ""; //입력값 없는 경우는 Pass
		return this.value.replace(/\\\"/ig ,"\"").replace(/\\'/ig ,"\'").replace(/\\\\/ig ,"\\");
	},
	addCss : function (attr){ if(this.className.indexOf(attr) == -1) this.className += " " + attr ;},
	masking : function () {
		if (!this.isAttribute("mask")) return;
		var sStr = this.value.replace( /(\/|\$|\^|\*|\(|\)|\+|\.|\?|\\|\{|\}|\||\[|\]|-|:)/g,"");
		var tStr="";
		var idx;
		var jdx=0;
		var tLen = sStr.length +1 ;
		var endcnt = sStr.length;
		for(var idx=0; idx< endcnt; idx++){
			tStr += sStr.charAt(idx);
			jdx++;
			if (jdx < this.getAttribute("mask").length && this.getAttribute("mask").charAt(jdx)!="9" ) tStr += this.getAttribute("mask").charAt((jdx++));
		}
		this.value = tStr;
	},
	unMasking : function () {
		if (!this.isAttribute("mask")) return;
		if (this.vaue =="") return;
		this.value = this.value.replace(/(\,|\.|\-|\/)/g,"");
	},
	makeReadOnly : function (flag){
		if (flag) {
			if (this.readOnly || this.getAttribute("disabled")) return;
		} else {
			if (!this.readOnly || !this.isAttribute("disabled")) return;
		}
		var support = ",tel,number,text,password,textarea,";
		if(support.indexOf(","+this.parent.type+",") > -1 ) return ;
		if (flag) {
			this.readOnly = true;
			this.style.backgroundColor = "white";
		} else {
			this.readOnly = false;
			this.style.backgroundColor = "#ffffff";
		}
	},
	getByte : function (){
		if (typeof(this.value) == "undefined" || typeof(this.value.length) == "undefined" ) return 0;
		return this.value.bytes();
	},
	addStripper : function (stripper){ this.strippers[this.strippers.length] = stripper;},
	stripping : function (){
		if ( !this.strippers.length ) return true;
		var endcnt = this.strippers.length;
		for(var idx=0; idx < endcnt ; idx++){
			if (this.strippers[idx].stripping) this.strippers[idx].stripping();
		}
		return true;
	},
	addAssistant : function (assistant){ this.assistants[this.assistants.length] = assistant;},
	assistantShow : function (key){
		if ( !this.assistants.length ) return true;
		var endcnt = this.assistants.length;
		for(var idx=0; idx < endcnt ; idx++)
			if (this.assistants[idx].show && this.assistants[idx].key == key ) this.assistants[idx].show();
		return true;
	},
	assistantKill : function (key){
		if ( !this.assistants.length ) return true;
		var endcnt = this.assistants.length;
		for(var idx=0; idx < endcnt ; idx++)
			if (this.assistants[idx].kill && this.assistants[idx].key == key ) this.assistants[idx].kill();
		return true;
	},
	addEvent : function (event){this.events[this.events.length] = event;},
	onEvent : function (){
		if ( !this.events.length ) return;
		var endcnt = this.events.length;
		for(var idx=0; idx < endcnt ; idx++){
			if (this.events[idx].onEvent) this.events[idx].onEvent();
		}
	},
	validate : function (){
		if ( this.validators && !this.validators.length ) return true;
		var endcnt = this.validators.length;
		for(var idx=0; idx < endcnt ; idx++)
			if (!this.impotence && this.validators[idx].validate && this.validators[idx].validate() == false ) return false;
		if (this.type != "radio" && this.type != "checkbox" ) this.style.backgroundColor = "white";
		else this.style.backgroundColor = "";
		return true;
	},
	onkeypress : function(e){
		if (this.getAttribute("filter")) {
			var re = new RegExp(this.getAttribute("filter"));
			var sKey;
			if(navigator.appName == 'Netscape') {
				sKey = String.fromCharCode(e.which);
				if((e.which!=8 && e.which != 46)  && !re.test(sKey)) e.preventDefault();
			}else if(navigator.appName == 'Opera') {
				sKey = String.fromCharCode(event.which);
				if((event.which!=8 && event.which != 46) && !re.test(sKey)) event.returnValue=false;  //8:backspace, 46:del
			}else {
				sKey = String.fromCharCode(event.keyCode);
				if((sKey!="\r") && !re.test(sKey)) event.returnValue=false;
			}
		}
		/*survey*/
		if(",tel,number,text,textarea,".indexOf(","+this.type+",") > -1 && this.onEvent){
			var endcnt = this.events.length;
			for(var idx=0; idx < endcnt ; idx++)
				if (this.events[idx].onEvent && (this.events[idx].key == "survey_progress" || this.events[idx].key == "matrix_progress")) this.events[idx].onEvent();
		}
		if (this.old_onkeypress) this.old_onkeypress();
	},
	onblur : function (){
		if ( this.assistants.length && this.assistantKill ) this.assistantKill("status_bar");
		var support = ",tel,number,text,password,textarea,file,";
		if(",tel,number,text,password,textarea,file,".indexOf(","+this.type+",") > -1 && this.onEvent) this.onEvent();
		if ( this.value ) {
			if ( ",tel,number,text,password,".indexOf(","+this.type+",") > -1 && this.masking) this.masking();
			if ( ",tel,number,text,password,textarea,file,".indexOf(","+this.type+",") > -1 && this.stripping) this.stripping();
		}
		if ( this.assistants.length && this.assistantKill ) this.assistantKill("balloon");			// 2012.10.04 by kevin ticket 
		if(this.old_onblur ) this.old_onblur();
	},
	onchange : function (){
		if ( ",select-one,checkbox,select-multiple,".indexOf(","+this.type+",") > -1 && this.onEvent) this.onEvent();
		if(this.old_onchange ) this.old_onchange();
	},
	onmouseover : function(){
		//if ( this.assistants.length && this.assistantShow ) this.assistantShow("balloon");		// 2012.10.04 by kevin ticket 1050 	
		if(this.old_onmouseover ) this.old_onmouseover();
	},
	onmouseout : function (){
		//if ( this.assistants.length && this.assistantKill ) this.assistantKill("balloon");		// 2012.10.04 by kevin ticket 
		if(this.old_onmouseout ) this.old_onmouseout();
	},
	onfocus : function (){
		if ( this.assistants.length && this.assistantShow ) this.assistantShow("status_bar");
		if ( this.assistants.length && this.assistantShow ) this.assistantShow("balloon");			// 2012.10.04 by kevin ticket 

		if (this.readOnly || this.isAttribute("lable" ) || this.style.display == "none" ) {
			this.blur();
			//this.parent.nextElement(this.name).focus();
         }
		if ( this.value && !this.readOnly) {
			if ( ",tel,number,text,password,".indexOf(","+this.type+",") > -1 && this.unMasking) this.unMasking();
			if ( ",tel,number,text,password,".indexOf(","+this.type+",") > -1 && this.select) this.select();
		}
		if(this.old_onfocus) this.old_onfocus();
	},
	onclick : function (){
		if ( ",tel,number,text,password,textarea,radio,button,".indexOf(","+this.type+",") > -1 && this.onEvent) this.onEvent();
		if ( this.type == "submit" ) this.parent.setSubmitInputTypeObj(this);
		if(this.old_onclick ) this.old_onclick();
	}
};

BIZenic.Validate.Base = {
	create : function(valid, parent){
		if(valid == null ) return null ;
		validate = new Object();
		validate.parent = parent;
		validate.alert = BIZenic.Validate.Base.alert;
		validate.uiChange = function(){return true;}
		validate.validate = function(){return true;}
		validate.key = valid.key ;
		if(typeof(valid.uiChange) != "undefined") validate.uiChange = valid.uiChange ;
		if(typeof(valid.validate) != "undefined") validate.validate = valid.validate ;
		return validate;
	},
	alert : function (msg){
		var comp_name = null ;
		try{
			comp_name = eval(this.parent.getAttribute(this.key)) ? eval(this.parent.getAttribute(this.key)).name : "" ;
		}catch(e){
		};
		BIZenic.alert(ECM_VALIDATOR_MSG,
			{
				itemname: (this.parent.isAttribute("itemname")? this.parent.getAttribute("itemname") : this.parent.isAttrValue("name") ? this.parent.getAttribute("name") : "")  ,
				msg : BIZenic.message (
					msg ,
					{option_value : this.parent.getAttribute(this.key),
					input_value : this.parent.value ,
					comp_name : comp_name ,
					this_name : (this.parent.isAttribute("itemname")? this.parent.getAttribute("itemname") : this.parent.isAttrValue("name") ? this.parent.getAttribute("name") : "")
					}
				)
			}
		);
		this.parent.style.backgroundColor = "efefef";
		try{
			this.parent.focus();
		}catch(e){
		}
		return ;
	}
};

BIZenic.Validate.valid_plain_box = {
	key : "plain-box" ,
	uiChange : function (){
		var support = [[",tel,number,text,password,", "valid_edit_box"],[",button,reset,submit,", "valid_button"],[",file,textarea,", "valid_plain"]];
		for(var i = 0 ; i < support.length ; i++){
			if(support[i][0].indexOf(","+this.parent.type+",") > -1){
				this.parent.addCss(support[i][1]);
			}
		}
		return true;
	}
};

BIZenic.Validate.valid_required = {
	key : "required" ,
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,password,textarea,select-one,select-multiple,checkbox,file,";
		if( support.indexOf(","+this.parent.type+",") < 0) return true ;
		var regExp_whiteSpace = /^[\s]*$/;
		if (!this.parent.value)  flag = false;
		if(BIZenic.Validate.VALID_REQUIRED_IGNORE_WHITESPACE && regExp_whiteSpace.test(this.parent.value)) flag = false;
		if (this.parent.type == "checkbox" && !this.parent.checked )  flag = false;
		if (!flag) {
			this.alert(ECM_VALIDATOR_REQUIRED);
			if(BIZenic.Validate.VALID_REQUIRED_IGNORE_WHITESPACE)
				this.parent.value = this.parent.value.replace( /(\s)/g,"");
		}
		return flag;
	},
	uiChange : function (){
		var support = ",tel,number,text,password,textarea,checkbox,file,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var values = [[",skin01,", "valid_required01"],[",skin02,", "valid_required02"],[",skin03,", "valid_required03"],[",skin04,", "valid_required04"],[",skin05,", "valid_required05"]];
		var flag = false ;
		for(var i = 0 ; i < values.length ; i++){
			if(values[i][0].indexOf(","+this.parent.getAttribute("required")+",") > -1){
				this.parent.addCss(values[i][1]);
				flag = true ;
			}
		}
		if(!flag )this.parent.addCss(BIZenic.Validate.VALID_DEFAULT_REQUIRED_SKIN);
		return true;
	}
};

BIZenic.Validate.valid_right = {
	key : "right" ,
	uiChange : function (){
		var support = ",tel,number,text,password,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		this.parent.addCss("valid_right");
		return true;
	}
};

BIZenic.Validate.valid_filter = {
	key : "filter"
};

BIZenic.Validate.valid_integer = {
	key : "integer",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,password," ;
		if( support.indexOf(","+this.parent.type+",") < 0) return flag ;
		if (this.parent.value == "") return flag;
		var tsTarget = this.parent.value;
		var regExp_Integer = /^(\+|\-|\d*)\d+$/;
		if(!regExp_Integer.test(tsTarget)) {
			flag = false;
			this.alert(ECM_VALIDATOR_INTEGER);
		}
		this.parent.value = parseInt(tsTarget);
		return flag;
	},
	uiChange : function (){
		var support = ",tel,number,text,password,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		if ( !this.parent.isAttrValue("filter")){
			this.parent.setAttribute("filter","[0-9\\-\\+]");
		}
		return true;
	}
};

BIZenic.Validate.valid_float = {
	key : "float",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,password," ;
		if( support.indexOf(","+this.parent.type+",") < 0) return flag ;
		if (this.parent.value == "") return flag;
		var tsTarget = this.parent.value;
		var regExp_Float1 = /^(\+|\-|\d*)\d+$/;
		var regExp_Float2 = /^(\-|\+|\d*)\d+(\.|\d)\d*$/;
		if(!regExp_Float1.test(tsTarget) && !regExp_Float2.test(tsTarget)) {
			flag = false;
			this.alert(ECM_VALIDATOR_FLOAT);
		}
		this.parent.value = parseFloat(tsTarget);
		return flag;
	},
	uiChange : function (){
		var support = ",tel,number,text,password,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		if ( !this.parent.isAttrValue("filter")){
			this.parent.setAttribute("filter","[0-9\\.\\-\\+]");
		}
		return true;
	}
};

BIZenic.Validate.valid_hexa = {
	key : "hexa",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,password," ;
		if( support.indexOf(","+this.parent.type+",") < 0) return flag ;
		if (this.parent.value == "") return flag;
		var tsTarget = this.parent.value;
		var regExp_hexa = /^[a-fA-F0-9]+$/;
		if(!regExp_hexa.test(tsTarget)) {
			flag = false;
			this.alert(ECM_VALIDATOR_HEXA);
		}
		this.parent.value = parseInt(tsTarget, 16).toString(16);
		return flag;
	},
	uiChange : function (){
		var support = ",tel,number,text,password,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		if ( !this.parent.isAttrValue("filter")){
			this.parent.setAttribute("filter","[a-fA-F0-9]");
		}
		return true;
	}
};
BIZenic.Validate.valid_credit_card = {
	key : "credit_card",
	support : ",tel,number,text,password,",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,password," ;
		if( support.indexOf(","+this.parent.type+",") < 0) return flag ;
		if (this.parent.value == "") return flag;
		var tsTarget = this.parent.value;
		var sum = 0;
		var mul = 1;
		var len = tsTarget.length;
		if (len.length > 19) flag = false;
		for (var idx = 0; idx < len; idx++) {
			var digit = tsTarget.substring(len-idx-1,len-idx);
			var tproduct = parseInt(digit ,10)*mul;
			if (tproduct >= 10)	sum += (tproduct % 10) + 1;
			else sum += tproduct;
			if (mul == 1) mul++;
			else mul--;
		}
		if ((sum % 10) != 0) flag = false;
		if(!flag) {
			this.alert(ECM_VALIDATOR_CREDIT_CARD);
		}
		return flag;
	},
	uiChange : function (){
		var support = ",tel,number,text,password,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		if ( !this.parent.isAttrValue("filter")){
			this.parent.setAttribute("filter","[0-9]");
		}
		return true;
	}
};

BIZenic.Validate.valid_alphabetic = {
	key : "alphabetic",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,password," ;
		if( support.indexOf(","+this.parent.type+",") < 0) return flag ;
		if (this.parent.value == "") return flag;
		var tsTarget = this.parent.value;
		var regExp_alphabetic = /^[a-zA-Z]+$/;
		if(!regExp_alphabetic.test(tsTarget)) {
			flag = false;
			this.alert(ECM_VALIDATOR_ALPHABETIC);
		}
		return flag;
	},
	uiChange : function (){
		var support = ",tel,number,text,password,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		if ( !this.parent.isAttrValue("filter")){
			this.parent.setAttribute("filter","[A-Za-z_]");
		}
		return true;
	}
};

BIZenic.Validate.valid_numeric = {
	key : "numeric",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,password," ;
		if( support.indexOf(","+this.parent.type+",") < 0) return flag ;
		if (this.parent.value == "") return flag;
		var tsTarget = this.parent.value;
		var regExp_numeric = /^[0-9]+$/;
		if(!regExp_numeric.test(tsTarget)) {
			flag = false;
			this.alert(ECM_VALIDATOR_NUMERIC);
		}
		return flag;
	},
	uiChange : function (){
		var support = ",tel,number,text,password,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		if ( !this.parent.isAttrValue("filter")){
			this.parent.setAttribute("filter","[0-9]");
		}
		return true;
	}
};

BIZenic.Validate.valid_alpha_numeric = {
	key : "alpha_numeric",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,password," ;
		if( support.indexOf(","+this.parent.type+",") < 0) return flag ;
		if (this.parent.value == "") return flag;
		var tsTarget = this.parent.value;
		var regExp_alpha_numeric = /^[a-zA-Z0-9]+$/;
		if(!regExp_alpha_numeric.test(tsTarget)) {
			flag = false;
			this.alert(ECM_VALIDATOR_ALPHA_NUMERIC);
		}
		return flag;
	},
	uiChange : function (){
		var support = ",tel,number,text,password,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		if ( !this.parent.isAttrValue("filter")){
			this.parent.setAttribute("filter","[A-Za-z0-9_]");
		}
		return true;
	}
};

BIZenic.Validate.valid_alpha_numeric_underbar = {
	key : "alpha_numeric_underbar",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,password," ;
		if( support.indexOf(","+this.parent.type+",") < 0) return flag ;
		if (this.parent.value == "") return flag;
		var tsTarget = this.parent.value;
		var regExp_alpha_numeric = /^[a-zA-Z0-9_]+$/;
		if(!regExp_alpha_numeric.test(tsTarget)) {
			flag = false;
			this.alert(ECM_VALIDATOR_ALPHA_NUMERIC);
		}
		return flag;
	},
	uiChange : function (){
		var support = ",tel,number,text,password,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		if ( !this.parent.isAttrValue("filter")){
			this.parent.setAttribute("filter","[A-Za-z0-9_]");
		}
		return true;
	}
};

BIZenic.Validate.valid_mask = {
	key :  "mask",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text," ;
		if( support.indexOf(","+this.parent.type+",") < 0) return flag ;
		if (this.parent.value == "") return flag;
		if (!this.parent.isAttrValue("mask")) return flag;
		if (this.parent.unMasking) this.parent.unMasking();  //Validate를 위해서 Remasking한다.
		if (this.parent.masking) this.parent.masking();
		var sPattern=this.parent.getAttribute("mask").replace(/(\$|\^|\*|\(|\)|\+|\.|\?|\\|\{|\}|\||\[|\])/g,"\\$1");
		sPattern=sPattern.replace(/9/g ,"\\d").replace(/x/ig,".").replace(/z/ig,"\\d?").replace(/a/ig,"[A-Za-z]");
		var re=new RegExp("^"+sPattern+"$");
		if(!re.test(this.parent.value))  {
			flag = false;
			this.alert(ECM_VALIDATOR_MASK);
		}
		return flag;
	}
};

BIZenic.Validate.valid_money = {
	key :  "money",
	uiChange : function (){
		var support = ",tel,number,text,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		if(!this.parent.isAttrValue("mask")){
			this.parent.masking = function(){
				var sMoney = this.value.replace(/,/g,"");
				var tMoney = "";
				var i;
				var j=0;
				var tLen =sMoney.length;
				if (tLen <= 3 ) return ;
				for(i=0;i<tLen;i++){
					if (i!=0 && ( i % 3 == tLen % 3) ) tMoney += ",";
					if(i < tLen ) tMoney += sMoney.charAt(i);
				}
				this.value = tMoney;
			};
		}
		if ( !this.parent.isAttrValue("filter")){
			this.parent.setAttribute("filter","[0-9]");
		}
		return true;
	}
};

BIZenic.Validate.valid_dollar = {
	key :  "dollar",
	uiChange : function (){
		var support = ",tel,number,text,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		if(!this.parent.isAttrValue("mask")){
			this.parent.masking = function () {
				var sMoney = this.value.replace(/(\,|\.)/g,"");
				if ( sMoney.length <= 2 ) return sMoney;
				var fir_sMoney = sMoney.substr(0, sMoney.length - 2);
				var sec_sMoney = sMoney.substr(sMoney.length - 2, 2);
				var tMoney="";
				var i;
				var j=0;
				var tLen =fir_sMoney.length;
				if (fir_sMoney.length <= 3 ) return fir_sMoney + "." + sec_sMoney;
				for(i=0;i<tLen;i++){
					if (i!=0 && ( i % 3 == tLen % 3) )     tMoney += ",";
					if(i < fir_sMoney.length ) tMoney += fir_sMoney.charAt(i);
				}
				this.value = tMoney + "." + sec_sMoney;
			};
		}
		if ( !this.parent.isAttrValue("filter")){
			this.parent.setAttribute("filter","[0-9]");
		}
		return true;
	}
};

BIZenic.Validate.valid_date = {
	key : "date",
	support : ",tel,number,text,",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return flag ;
		if (this.parent.value == "") return flag;
		var iYear = null;
		var iMonth = null;
		var iDay = null;
		var iDaysInMonth = null;
		var sDate=this.parent.value.replace(/(\,|\.|\-|\/)/g,"");
		var sFormat="YYYYMMDD";
		var aDaysInMonth=new Array(31,28,31,30,31,30,31,31,30,31,30,31);
		if ( sDate.length != 8 ) flag = false ;
		if (flag) {
			iYear  = eval(sDate.substr(0,4));
			iMonth = eval(sDate.substr(4,2));
			iDay   = eval(sDate.substr(6,2));
			if (!BIZenic.isNum(iYear) || !BIZenic.isNum(iMonth) || !BIZenic.isNum(iDay) )  flag = false ;
		}
		if (flag) {
			iDaysInMonth = (iMonth != 2) ? aDaysInMonth[iMonth-1] : (( iYear%4 == 0 && iYear%100 != 0 || iYear % 400==0 ) ? 29 : 28 );
			if( iDay==null || iMonth==null || iYear==null  || iMonth > 12 || iMonth < 1 || iDay < 1 || iDay > iDaysInMonth ) flag = false ;
		}
		if (!flag) {
			this.alert(ECM_VALIDATOR_DATE);
		}
		return flag;
	},
	uiChange : function (){
		var support = ",tel,number,text,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		if(!this.parent.isAttrValue("mask")){
			this.parent.setAttribute("mask","9999-99-99");
		}
		if ( !this.parent.isAttrValue("filter")){
			this.parent.setAttribute("filter","[0-9]");
		}
		return true;
	}
};

BIZenic.Validate.valid_psn = {
	key : "psn",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,password,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return flag ;
		var sum = 0;
		if (this.parent.value == "") return flag;
		var psNumber = this.parent.value.replace(/(\,|\.|\-|\/)/g,"");
		for (idx = 0, jdx=2; jdx < 10; idx++, jdx++) {
			sum = sum + ( psNumber.charAt(idx) * jdx );
		}
		for (idx = 8, jdx=2; jdx < 6; idx++, jdx++) {
			sum = sum + ( psNumber.charAt(idx) * jdx );
		}
		var nam = sum % 11;
		var checkDigit = 11 - nam ;
		checkDigit = (checkDigit >= 10 ) ? checkDigit-10:checkDigit;
		if ( !BIZenic.isNum(psNumber) || psNumber.charAt(12) != checkDigit)  {
			flag = false;
			this.alert(ECM_VALIDATOR_PSN);
		}
		return flag;
	},
	uiChange : function (){
		var support = ",tel,number,text,password,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		if(!this.parent.isAttrValue("mask")){
			this.parent.setAttribute("mask","999999-9999999");
		}
		if ( !this.parent.isAttrValue("filter")){
			this.parent.setAttribute("filter","[0-9]");
		}
		return true;
	}
};

BIZenic.Validate.valid_csn = {
	key :  "csn",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,password,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return flag ;
		var sum = 0;
		if (this.parent.value == "") return flag;
		var csNumber = this.parent.value.replace(/(\,|\.|\-|\/)/g,"");
		var checkArray = new Array(1,3,7,1,3,7,1,3,5);
		for(idx=0 ; idx < 9 ; idx++)
			sum += csNumber.charAt(idx) * checkArray[idx];
		sum = sum + ((csNumber.charAt(8) * 5 ) / 10);
		var nam = Math.floor(sum) % 10;
		var checkDigit = ( nam == 0 ) ? 0 : 10 - nam;
		if ( !BIZenic.isNum(csNumber) || csNumber.charAt(9) != checkDigit)  {
			flag = false;
			this.alert(ECM_VALIDATOR_CSN);
		}
		return flag;
	},
	uiChange : function (){
		var support = ",tel,number,text,password,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		if(!this.parent.isAttrValue("mask")){
			this.parent.setAttribute("mask","999-99-99999");
		}
		if ( !this.parent.isAttrValue("filter")){
			this.parent.setAttribute("filter","[0-9]");
		}
		return true;
	}
};

BIZenic.Validate.valid_disable_this = {
	key :  "disable_this",
	uiChange : function (){
		var support = ",tel,number,text,password,textarea,radio,checkbox,select-one,select-multiple,file,submit,button,reset,image,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
	
		this.parent.disable();
		return true;
	}
};

BIZenic.Validate.valid_hide_this = {
	key :  "hide_this",
	uiChange : function (){
		var support = ",tel,number,text,password,textarea,radio,checkbox,select-one,select-multiple,file,submit,button,reset,image,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		this.parent.hide();
		return true;
	}
};

BIZenic.Validate.valid_show_this = {
	key :  "show_this",
	uiChange : function (){
		var support = ",tel,number,text,password,textarea,radio,checkbox,select-one,select-multiple,file,submit,button,reset,image,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		this.parent.show();
		return true;
	}
};

BIZenic.Validate.valid_focus_this = {
	key :  "focus_this",
	uiChange : function (){
		var support = ",tel,number,text,password,textarea,radio,checkbox,select-one,select-multiple,file,submit,button,reset,image,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		if (this.parent.focus) this.parent.focus();
		return true;
	}
};

BIZenic.Validate.valid_readonly_this = {
	key :  "readonly_this",
	uiChange : function (){
		var support = ",tel,number,text,password,textarea,radio,checkbox,select-one,select-multiple,file,submit,button,reset,image,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		this.parent.makeReadOnly(true);
		return true;
	}
};

BIZenic.Validate.valid_ime = {
	key :  "ime",
	uiChange : function (){
		var support = ",tel,number,text,password,textarea,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var values = [[",kor,", "valid_imeKor"],[",eng,", "valid_imeEng"],[",engOnly,", "valid_imeDis"]];
		var flag = false ;
		for(var i = 0 ; i < values.length ; i++){
			if(values[i][0].indexOf(","+this.parent.getAttribute("ime")+",") > -1){
				this.parent.addCss(values[i][1]);
				flag = true ;
			}
		}
		return true;
	}
};

BIZenic.Validate.valid_lable = {
	key :  "lable",
	uiChange : function (){
		var support = ",tel,number,text,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		this.parent.addCss("valid_lable");
		return true;
	}
};

BIZenic.Validate.valid_minlength = {
	key : "minlength" ,
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,password,textarea,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return flag ;
		if (this.parent.value == "") return flag;
		var tsTarget = this.parent.value.length ;
		if (tsTarget <  this.parent.getAttribute("minlength")) {
			flag = false;
			this.alert(ECM_VALIDATOR_MINLENGTH);
		}
		return flag;
	}
};

BIZenic.Validate.valid_minbyte = {
	key : "minbyte" ,
	validate : function(){
		var flag = true;
		var support = ",tel,number,text,password,textarea," ;
		if(support.indexOf(","+this.parent.type+",") < 0 ) return flag ;
		if (this.parent.value == "") return flag;
		var tsTarget = this.parent.getByte();
		if (tsTarget <  this.parent.getAttribute("minbyte")) {
			flag = false;
			this.alert(ECM_VALIDATOR_MINBYTE);
		}
		return flag;
	}
};

BIZenic.Validate.valid_maxbyte = {
	key : "maxbyte",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,password,textarea," ;
		if(support.indexOf(","+this.parent.type+",") < 0 ) return flag ;
		if (this.parent.value == "") return flag;
		var tsTarget = this.parent.getByte();
		if (tsTarget >  this.parent.getAttribute("maxbyte") ) {
			flag = false;
			this.alert(ECM_VALIDATOR_MAXBYTE);
		}
		return flag;
	}
};

BIZenic.Validate.valid_minvalue = {
	key : "minvalue",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,password," ;
		if(support.indexOf(","+this.parent.type+",") < 0 ) return flag ;
		if (this.parent.value == "") return flag;
		var tsTarget = parseFloat(this.parent.value);
		if (tsTarget <  this.parent.getAttribute("minvalue") ) {
			flag = false;
			this.alert(ECM_VALIDATOR_MINVALUE);
		}
		return flag;
	}
};

BIZenic.Validate.valid_maxvalue = {
	key : "maxvalue",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,password," ;
		if(support.indexOf(","+this.parent.type+",") < 0 ) return flag ;
		if (this.parent.value == "") return flag;
		var tsTarget = parseFloat(this.parent.value);
		if (tsTarget >  this.parent.getAttribute("maxvalue") ) {
			flag = false;
			this.alert(ECM_VALIDATOR_MAXVALUE);
		}
		return flag;
	}
};

BIZenic.Validate.valid_advanced_email = {
	key : "advanced_email",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text," ;
		if(support.indexOf(","+this.parent.type+",") < 0 ) return flag ;
		if (this.parent.value == "") return flag;
		var checkTLD=1;
		var knownDomsPat=/^(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum)$/;
		var emailPat=/^(.+)@(.+)$/;
		var specialChars="\\(\\)><@,;:\\\\\\\"\\.\\[\\]";
		var validChars="\[^\\s" + specialChars + "\]";
		var quotedUser="(\"[^\"]*\")";
		var ipDomainPat=/^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/;
		var atom=validChars + '+';
		var word="(" + atom + "|" + quotedUser + ")";
		var userPat=new RegExp("^" + word + "(\\." + word + ")*$");
		var domainPat=new RegExp("^" + atom + "(\\." + atom +")*$");
		var tsTarget = this.parent.value;
		var matchArray = tsTarget.match(emailPat);
		if (!matchArray) {
			this.alert(ECM_VALIDATOR_EMAIL_NO_EMAIL);
			return false;
		}
		var user=matchArray[1];
		var domain=matchArray[2];
		for (i=0; i<user.length; i++)
			if (user.charCodeAt(i)>127) {
				this.alert(ECM_VALIDATOR_EMAIL_NO_NAME);
				return false;
			}
		for (i=0; i<domain.length; i++)
			if (domain.charCodeAt(i)>127) {
				this.alert(ECM_VALIDATOR_EMAIL_NO_DOMAIN);
				return false;
			}
		if (!user.match(userPat)) {
			this.alert(ECM_VALIDATOR_EMAIL_NO_NAME2);
			return false;
		}
		var IPArray=domain.match(ipDomainPat);
		if (IPArray) {
			for (var i=1;i<=4;i++)
				if (IPArray[i]>255) {
					this.alert(ECM_VALIDATOR_EMAIL_NO_ADDRESS);
					return false;
				}
			return true;
		}
		var atomPat=new RegExp("^" + atom + "$");
		var domArr=domain.split(".");
		var len=domArr.length;
		for (i=0;i<len;i++)
			if (domArr[i].search(atomPat)==-1) {
				this.alert(ECM_VALIDATOR_EMAIL_NO_DOMAINNAME);
				return false;
			}
		if (checkTLD && domArr[domArr.length-1].length!=2 && domArr[domArr.length-1].search(knownDomsPat)==-1) {
			this.alert(ECM_VALIDATOR_EMAIL_NO_UNKNOWNDOMAIN);
			return false;
		}
		if (len<2) {
			this.alert(ECM_VALIDATOR_EMAIL_NO_HOSTNAME);
			return false;
		}
		return true;
	}
};

BIZenic.Validate.valid_email = {
	key : "email",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text," ;
		if(support.indexOf(","+this.parent.type+",") < 0 ) return flag ;
		if (this.parent.value == "") return flag;
		var tsTarget = this.parent.value;
		var regExpEmail = /^\w+((-|\.)\w+)*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]{2,4}$/;
		if(!regExpEmail.test(tsTarget)) {
			flag = false;
			this.alert(ECM_VALIDATOR_EMAIL_NO_EMAIL);
		}
		return flag;
	}
};

BIZenic.Validate.valid_domain = {
	key : "domain",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text," ;
		if(support.indexOf(","+this.parent.type+",") < 0 ) return flag ;
		if (this.parent.value == "") return flag;
		var tsTarget = this.parent.value;
		var regExpDomain = /^[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]{2,4}$/;
		if(!regExpDomain.test(tsTarget)) {
		  flag = false;
		  this.alert(ECM_VALIDATOR_DOMAIN);
		}
		return flag;
	}
};

BIZenic.Validate.valid_surveydomain = {
		key : "survey_domain",
		validate : function (){
			var flag = true;
			var support = ",tel,number,text," ;
			
			var valid_item = document.getElementById("valid_item_" + this.parent.getAttribute("itemorder"));
			
			
			if(support.indexOf(","+this.parent.type+",") < 0 ) return flag ;
			var sum = this.parent.getAttribute("survey_domain");
			if (this.parent.value == "") return flag;
			var tsTarget = this.parent.value;
			var regExpDomain = /^[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]{2,4}$/;
			if(!regExpDomain.test(tsTarget)) {
			  flag = false;
			  //this.alert(ECM_VALIDATOR_DOMAIN);
			  valid_item.innerHTML = '<font color=red><b>' + ECM_VALIDATOR_DOMAIN + '</b></font>';
			}
			return flag;
		}
	};

BIZenic.Validate.valid_q_check = {
	key : "q_check",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,textarea," ;
		if(support.indexOf(","+this.parent.type+",") < 0 ) return flag ;
		if (this.parent.value == "") return flag;
		var tsTarget = this.parent.value;
		var quotation = /[\'\"]/;
		if(quotation.test(tsTarget)) {
			flag = false;
			this.alert(ECM_VALIDATOR_QCHECK);
		}
		return flag;
	}
};

BIZenic.Validate.valid_reg_exp = {
	key : "reg_exp",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,password," ;
		if(support.indexOf(","+this.parent.type+",") < 0 ) return flag ;
		if (this.parent.value == "") return flag;
		var tsTarget = this.parent.value;
		var regularExpression =new RegExp(this.parent.getAttribute("reg_exp"));
		if(!regularExpression.test(tsTarget)) {
			flag = false;
			this.alert(ECM_VALIDATOR_REG_EXP);
		}
		return flag;
	}
};

BIZenic.Validate.valid_is_value = {
	key : "is_value",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,password," ;
		if(support.indexOf(","+this.parent.type+",") < 0 ) return flag ;
		var compateItem = null ;
		try{
			compateItem = eval(this.parent.getAttribute("is_value"));
		}catch(e){
		}
		if (compateItem == null) {
			this.alert(ECM_VALIDATOR_IS_VALUE_WRONG);
			return false;
		}
		if (this.parent.value != compateItem.value ) flag = false;
		if (!flag) {
			this.alert(ECM_VALIDATOR_IS_VALUE);
		}
		return flag;
	}
};

BIZenic.Validate.valid_trim = {
	key : "trim",
	uiChange : function (){
		var support = ",tel,number,text,password,textarea,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var stripper = new Object();
		stripper.parent = this.parent;
		stripper.stripping = function(){
			if (this.parent.value == "") return ;
			var option = this.parent.getAttribute("trim");
			var value = this.parent.value ;
			if(option == "left"){
				value = value.replace(/^\s*/,"");
			}else if(option == "right"){
				value = value.replace(/\s*$/,"");
			}else{
				value = value.replace(/^\s*/ ,"").replace(/\s*$/ ,"");
			}
			this.parent.value = value;
		};
		this.parent.addStripper(stripper);
		return true;
	}
};

BIZenic.Validate.valid_strip_special_char = {
	key : "strip_special_char",
	uiChange : function (){
		var support = ",tel,number,text,password,textarea,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var stripper = new Object();
		stripper.parent = this.parent;
		stripper.stripping = function(){
			if (this.parent.value == "") return ;
			var specialRegExp = /(\(|\)|\[|\]|\{|\}|\<|\>|\"|\'|\`|\~|\$|\!|\#|\%|\^|\&|\@|\,|\.|\;|\:|\\|\/|\||\*|\=|\-|\?)*/g ;
			var value = this.parent.value.replace(specialRegExp,"");
			this.parent.value = value;
		};
		this.parent.addStripper(stripper);
		return true;
	}
};

BIZenic.Validate.valid_strip_white_space = {
	key : "strip_white_space",
	uiChange : function (){
		var support = ",tel,number,text,password,textarea,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var stripper = new Object();
		stripper.parent = this.parent;
		stripper.stripping = function(){
			if (this.parent.value == "") return;
			var whiteSpaceRegExp = /\s/g;
			var value = this.parent.value.replace(whiteSpaceRegExp, "");
			this.parent.value = value;
		};
		this.parent.addStripper(stripper);
		return true;
	}
};

BIZenic.Validate.valid_balloon = {
	key : "balloon",
	uiChange : function (){
		var support = ",tel,number,text,password,textarea,radio,checkbox,select-one,select-multiple,file,submit,button,reset,image,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var assistant = new Object();
		assistant.parent = this.parent;
		/*
		BIZenic.addEvent(this.parent ,"mousemove", function(e) {
			var skn = document.getElementById("div_balloon").style;
			var evt = (window.event) ? window.event : e;
			var x = (evt.pageX) ? evt.pageX : evt.x+document.body.scrollLeft;
			var y = (evt.pageY) ? evt.pageY : evt.y+document.body.scrollTop;
			skn.left = x - 10;
			skn.top  = y+30;
		});
		*/
		assistant.ObjectTop = function (obj){
			//if (obj.offsetParent == document.body)
			//if(obj.offsetParent.tagName == "DIV") alert(obj.offsetParent.offsetTop);
		    if (obj.offsetParent.tagName == "BODY" || obj.offsetParent.tagName == "HTML")
		        return obj.offsetTop;
		    else
		        return obj.offsetTop + this.ObjectTop(obj.offsetParent);
		};
		assistant.ObjectLeft = function (obj){
		    //if (obj.offsetParent == document.body)
		    if (obj.offsetParent.tagName == "BODY" || obj.offsetParent.tagName == "HTML")
		        return obj.offsetLeft;
		    else
		        return obj.offsetLeft + this.ObjectLeft(obj.offsetParent);
		};
		assistant.parent = this.parent ;
		assistant.key = "balloon";
		assistant.show = function () {
			var div_balloon = document.getElementById("div_balloon");
		    var top = document.body.clientTop + this.ObjectTop(this.parent);
		    var left = document.body.clientLeft + this.ObjectLeft(this.parent);
			// 스크린의 1/2 아래쪽일 경우 달력을 위쪽에 나타나도록 하기 위하여(지우지 말아 주이소)
			//if(window.screen.height / 2 < top) top = top - 290;
		    if(div_balloon.style.pixelTop){
		    	div_balloon.style.pixelTop = top + this.parent.offsetHeight;
			}else{
				div_balloon.style.top = top + this.parent.offsetHeight + "px";
			}
			if(div_balloon.style.pixelLeft){
				div_balloon.style.pixelLeft = left;
			}else{
				div_balloon.style.left = left + "px";
			}
			var balloon = this.parent.getAttribute("balloon").split("|");
			var content ="<TABLE WIDTH=200 border=0 cellpadding=0 cellspacing=1 class=main  bgcolor=848284>";
			content += "<TR><TD BGCOLOR=#B6CAD9>";
			if(balloon.length > 1) content += "<TABLE WIDTH=100% BORDER=0 CELLPADDING=0 CELLSPACING=0><TR><TD align=center><B>" + balloon[0] + "</B></TD></TR></TABLE>";
			content += "<TABLE WIDTH=100% BORDER=0 CELLPADDING=1 CELLSPACING=4 BGCOLOR='FFFFFF' class=main><TR><TD align=left>" + (balloon.length > 1 ? balloon[1] : balloon[0]) + "</TD></TR></TABLE>";
			content += "</TD></TR></TABLE>";
			div_balloon.innerHTML = content;
			div_balloon.style.visibility = "visible";
		};
		assistant.kill = function (){
			var skn = document.getElementById("div_balloon").style;
			document.getElementById("div_balloon").innerHTML = "";
			skn.visibility = "hidden";
		};
		this.parent.addAssistant(assistant);
		return true;
	}
};

BIZenic.Validate.valid_status_bar = {
	key : "status_bar",
	uiChange : function (){
		var support = ",tel,number,text,password,textarea,radio,checkbox,select-one,select-multiple,file,submit,button,reset,image,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var assistant = new Object();
		assistant.parent = this.parent;
		assistant.key = "status_bar";
		assistant.show = function (){ window.status = this.parent.getAttribute("status_bar") ;};
		assistant.kill = function (){  window.status = "" ; };
		this.parent.addAssistant(assistant);
		return true;
	}
};

BIZenic.Validate.valid_auto_focus = {
	key : "auto_focus",
	uiChange : function (){
		var support = ",tel,number,text,password,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		if(this.parent.onkeyup) this.old_onkeyup = this.parent.onkeyup ;
		this.parent.onkeyup = function (evt){
			if(window.attachEvent && !window.opera) {
				sKey = String.fromCharCode(event.keyCode);
			}else {
				sKey = evt.which;
			}
			if ( sKey !=9 && sKey !=16  && this.isAttribute("auto_focus") && this.value.length >= this.getAttribute("maxlength")){
				//this.parent.parent.nextElement(this.parent.name).focus();
			}
			if (this.old_onkeyup) this.old_onkeyup();
		};
		return true;
	}
};

BIZenic.Validate.valid_enable_fields = {
	key : "enable_fields",
	uiChange : function (){
		var support = ",tel,number,text,password,textarea,radio,checkbox,select-one,select-multiple,file,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var eventListener = new Object();
		eventListener.parent = this.parent;
		eventListener.onEvent = function(){
			if ( ",checkbox,radio,".indexOf(","+this.parent.type+",") > -1 ) {
				if ( this.parent.checked) flag = true;
			}else{
				if (this.parent.getAttribute("enable_values")){
					var ss = this.parent.getAttribute("enable_values").split(",");
					for(var j in  ss )
						if (this.parent.value == ss[j]) flag = true;
				} else {
					if ( this.parent.value.length > 0 ) flag = true;
				}
			}
			if (flag){
				this.parent.parent.enable(this.parent.getAttribute("enable_fields"));
			} else {
				this.parent.parent.disable(this.parent.getAttribute("enable_fields"));
			}
		};
		this.parent.addEvent(eventListener);
		return true;
	}
};

BIZenic.Validate.valid_show_fields = {
	key : "show_fields",
	uiChange : function (){
		var support = ",tel,number,text,password,textarea,radio,checkbox,select-one,select-multiple,file,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var eventListener = new Object();
		eventListener.parent = this.parent;
		eventListener.onEvent = function(){
			if ( ",checkbox,radio,".indexOf(","+this.parent.type+",") > -1 ) {
				if ( this.parent.checked) flag = true;
			}else{
				if (this.parent.getAttribute("show_values")){
					var ss = this.parent.getAttribute("enable_values").split(",");
					for(var j in  ss )
						if (this.parent.value == ss[j]) flag = true;
				} else {
					if ( this.parent.value.length > 0 ) flag = true;
				}
			}
			if (flag){
				this.parent.parent.show(this.parent.getAttribute("show_fields"));
			} else {
				this.parent.parent.hide(this.parent.getAttribute("show_fields"));
			}
		};
		this.parent.addEvent(eventListener);
		return true;
	}
};

BIZenic.Validate.valid_disable_fields = {
	key : "disable_fields",
	uiChange : function (){
		var support = ",tel,number,text,password,textarea,radio,checkbox,select-one,select-multiple,file,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var eventListener = new Object();
		eventListener.parent = this.parent;
		eventListener.onEvent = function(){
			if ( ",checkbox,radio,".indexOf(","+this.parent.type+",") > -1 ) {
				if ( this.parent.checked) flag = true;
			}else{
				if (this.parent.getAttribute("disable_values")){
					var ss = this.parent.getAttribute("enable_values").split(",");
					for(var j in  ss )
						if (this.parent.value == ss[j]) flag = true;
				} else {
					if ( this.parent.value.length > 0 ) flag = true;
				}
			}
			if (flag){
				this.parent.parent.disable(this.parent.getAttribute("disable_fields"));
			} else {
				this.parent.parent.enable(this.parent.getAttribute("disable_fields"));
			}
		};
		this.parent.addEvent(eventListener);
		return true;
	}
};

BIZenic.Validate.valid_hide_fields = {
	key : "hide_fields",
	uiChange : function (){
		var support = ",tel,number,text,password,textarea,radio,checkbox,select-one,select-multiple,file,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var eventListener = new Object();
		eventListener.parent = this.parent;
		eventListener.onEvent = function(){
			if ( ",checkbox,radio,".indexOf(","+this.parent.type+",") > -1 ) {
				if ( this.parent.checked) flag = true;
			}else{
				if (this.parent.getAttribute("hide_values")){
					var ss = this.parent.getAttribute("enable_values").split(",");
					for(var j in  ss )
						if (this.parent.value == ss[j]) flag = true;
				} else {
					if ( this.parent.value.length > 0 ) flag = true;
				}
			}
			if (flag){
				this.parent.parent.hide(this.parent.getAttribute("hide_fields"));
			} else {
				this.parent.parent.show(this.parent.getAttribute("hide_fields"));
			}
		};
		this.parent.addEvent(eventListener);
		return true;
	}
};

BIZenic.Validate.valid_allow_fields = {
	key : "allow_file",
	validate : function (){
		var flag = true;
		var support = ",file," ;
		if(support.indexOf(","+this.parent.type+",") < 0 ) return flag ;
		if (this.parent.value == "") return flag;
		var filename = this.parent.value ;
		filename = filename.toLowerCase().substring(filename.lastIndexOf("\\")+1);
		var fileext = "." + filename.substring(filename.lastIndexOf(".")+1);
		var exeExt = [".exe",".asp",".aspx",".jsp",".php",".cs",".js",".bat",".css.",".cab",".cat",".dll",".inf"];
		if((","+exeExt.join(",")+",").indexOf(","+fileext+",") > -1 ){
			this.alert(ECM_FILEUPLOAD_EXE_FILE);
			return false;
		}
		var imgExt = [".gif",".jpg",".png"]; //이미지확장자
		var htmExt = [".htm",".html"]; //html확장자
		var txtExt = [".txt",".csv",".xls"]; // 텍스트확장자
		var multiExt = [".wma",".wmv",".asf",".avi",".mpeg",".wav"]; // 멀티미디어 확장자
		var zipExt = [".zip"]; // 압축
		var iniExt = [".ini"]; // 압축
		var ext = {image : imgExt, html : htmExt, text : txtExt , multi : multiExt , zip : zipExt, ini : iniExt};
		var extention = ext[this.parent.getAttribute("allow_file")];
		if(extention != null){
			if((","+extention.join(",")+",").indexOf(","+fileext+",") < 0 ){
				this.alert(BIZenic.message(ECM_FILEUPLOAD_DIFF_FILE, {file_ext: extention.join(", ")}));
				return false;
			}
		}
		return true ;
	}
};

BIZenic.Validate.valid_date_check = {
	key : "date_check",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text," ;
		if(support.indexOf(","+this.parent.type+",") < 0 ) return flag ;
		if(document.getElementById("dp_start").value == "" && document.getElementById("dp_end").value == "") {
			return true ;
		} else if ( document.getElementById("dp_start").value == "" || document.getElementById("dp_end").value == "" ||
			( document.getElementById("dp_start").value.removeDash() > document.getElementById("dp_end").value.removeDash())  ) {
	        this.alert(ECM_COMMON_SEARCH_DT);
	        return false;
		}
		return true ;
	}
};

BIZenic.Validate.valid_ip = {
	key : "ip",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text," ;
		if(support.indexOf(","+this.parent.type+",") < 0 ) return flag ;
		var ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
		var ipArray = this.parent.value.match(ipPattern);
		var result = "";
		if (this.parent.value == "0.0.0.0" || this.parent.value == "255.255.255.255") {
			this.alert(BIZenic.message(ECM_SYSTEM_SERVER_IP, { server_ip : this.parent.value }));
			flag = false;
		}else if (ipArray == null) {
			this.alert(ECM_COMMON_IP_FAIL);
			flag = false;
		} else {
			for (i = 1; i < 5; i++) {
				if (ipArray[i] > 255) {
					this.alert(ECM_COMMON_IP_FAIL);
					flag = false;
				}
			}
		}
		if(!flag) this.parent.focus();
		return flag;
	}
};

BIZenic.Validate.valid_passwd = {
		key : "password",
		validate : function (){
			var flag = true;
			var support = ",tel,number,text,password," ;
			if(support.indexOf(","+this.parent.type+",") < 0 ) return flag ;
			if (!this.parent.value) return flag;
			var tsTarget = this.parent.value;
			
			var alpha="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
			var number="1234567890";
			var sChar="-_=+\|()*&^%$#@!~`?></;:,.";
			var sCharCheck = false;
			var bACheck = false;
			var bNumberCheck = false;
			
			var alphaCheck= true;
			
			for(var i = 0; i < tsTarget.length; i++){
				if(sChar.indexOf(tsTarget.charAt(i)) >= 0) sCharCheck = true;
				else if(alpha.indexOf(tsTarget.charAt(i)) >= 0) bACheck = true;
				else if(number.indexOf(tsTarget.charAt(i)) >= 0) bNumberCheck = true;
				else{
					alphaCheck = false;
					break;
				}	
			}
			if(!sCharCheck){
				flag = false;
				this.alert(ECM_VALIDATOR_PASSWORD_SPACIAL);
			}else if(!bACheck){
				flag = false;
				this.alert(ECM_VALIDATOR_PASSWORD_ALPHABETIC);
			}else if(!bNumberCheck){
				flag = false;
				this.alert(ECM_VALIDATOR_PASSWORD_NUMERIC);
			}else if(!alphaCheck){
				flag = false;
				this.alert(ECM_VALIDATOR_PASSWORD_SYNTAX);
			}
			if(!flag) this.parent.focus();
			return flag;
		}
	};

// skip_list
BIZenic.Validate.valid_survey_history = {
	key : "survey_history",
	uiChange : function (){
		var support = ",tel,number,text,hidden,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		if(this.parent.parent.page_no == null || this.parent.parent.page_no == undefined) return true;
		if(this.parent.value == "") return true;
		this.parent.skip_check = {
			parent : this.parent,
			elementsList : new Array(),
			enableList: new Array(),
			skipinfos: new Array(),
			init : function(){
				var frm = this.parent.parent ;
				var endcnt = frm.elements.length;
				for (var i = 0; i < endcnt; i++){
					var itemOrder = frm.elements[i].getAttribute("itemorder");
					if(!frm.elements[i].name.startsWith("Q") || itemOrder == null )continue ;
					var elementInfo = this.elementsList["O_"+ itemOrder];
					if(elementInfo == null){
						elementInfo = {itemOrder : itemOrder, item : [frm.elements[i]], skip : 0, enable : 0, skipdisable : 0, enableInfos : null};
						this.elementsList["O_"+ itemOrder] = elementInfo ;
						this.elementsList[this.elementsList.length] = elementInfo;
					}else{
						elementInfo.item[elementInfo.item.length] = frm.elements[i];
					}
				}
				var skip_infos = this.parent.value.split(",");
				endcnt = skip_infos.length;
				var skip_info_page = new Array();
				for(var i = 0; i < endcnt; i++) {
					if(skip_infos[i] == "" || skip_infos[i].split("|").length < 5 ) continue;
					var skip_info = skip_infos[i].split("|");
					var from_itemOrder = skip_info[1], end_itemOrder = skip_info[2];
					
					var skipinfo = {itemorder: skip_info[3], from: skip_info[1], end: skip_info[2], enableflag:true};
					this.skipinfos["O_"+ skip_info[3]] = skipinfo;
					skip_info_page[skip_info[4]] = skipinfo;
					if(from_itemOrder != "" && end_itemOrder != ""){
						var loopend = this.elementsList.length;
						for(var j = 0; j < loopend; j++){
							if( Number(from_itemOrder) <=  Number(this.elementsList[j].itemOrder) &&  Number(end_itemOrder) >=  Number(this.elementsList[j].itemOrder)){
								this.elementsList[j].skip--;
							}
						}
					}
				}
				var enable_infos = frm.elements["enable_history"].value.replace(/-/g,",").split(",");
				var enableList = new Array();
				endcnt = enable_infos.length;
				var endcnt2;
				for(var i = 0; i < endcnt; i++) {
					if(enable_infos[i] == "" || enable_infos[i].split("|").length < 5) continue;
					var enable_info = enable_infos[i].split("|");
					var from_itemOrder = enable_info[2], end_itemOrder = enable_info[3];
					
					if(this.elementsList["O_"+ enable_info[0]] == null){
						
						if(from_itemOrder != "" && end_itemOrder != ""){
							endcnt2 = this.elementsList.length;
							for(var j = 0; j < endcnt2; j++){
								if( Number(from_itemOrder) <=  Number(this.elementsList[j].itemOrder) &&  Number(end_itemOrder) >=  Number(this.elementsList[j].itemOrder)){
									this.elementsList[j].skip++;
								}
							}
						}
						enableList[enableList.length] = {page_no : enable_info[1], line : enable_infos[i]};
					}else{
						if(this.elementsList["O_"+ enable_info[0]].enableInfos == null) this.parent.skip_check.enableAdd( enable_infos[i],0);
						else this.parent.skip_check.enableAdd( enable_infos[i],1);
					}
				}
				var makeStr = "" ;
				var page_info = frm.page_no_history.value.split(",");
				endcnt = page_info.length -1;
				endcnt2 = enableList.length;
				for(var i = 0; i < endcnt; i++){
					bChk = false;
					if(i > 0) makeStr +=",";
					for(var j = 0; j < endcnt2; j++){
						if(enableList[j].page_no == (page_info[i]-1)){
							if(bChk) makeStr += "-";
							makeStr += enableList[j].line;
							bChk = true;
						}
					}
				}
				frm.elements["enable_history"].setAttribute("old_value", makeStr);
				
				//스킵된 페이지에 skip 문항이 존재하는지 확인한다.
				var nDiff = 0;
				for(var i = 0; i < endcnt; i++){
					if(Number(page_info[i+1]) == 9999){
						nDiff = (Number(frm.elements["cur_page_no"].value)+1) - Number(page_info[i]);
					}else{
						nDiff = Number(page_info[i+1]) - Number(page_info[i]);
					}
					if(nDiff <= 1)continue;
					//page_no_hsitory에 남는 페이지수치 첫페이지가 안내페이지이고 
					//스킵에서 처리되는 페이지는 1페이지가 문항이 나오는 페이지라 수치가 1 차이가 난다.					
					for(var k = 0; k < (nDiff-1); k++){
						var skipinfo = skip_info_page[Number(page_info[i])+k];
						if(skipinfo != null){
							var loopend = this.elementsList.length;
							for(var j = 0; j < loopend; j++){
								if( Number(skipinfo.from) <=  Number(this.elementsList[j].itemOrder) &&  Number(skipinfo.end) >=  Number(this.elementsList[j].itemOrder)){
									this.elementsList[j].skip++;
								}
							}
						}
					}
				}
			},
			enableAdd:function(infoData,value){
				var info = infoData.split("|");
				if(info.length < 5) return ;
				var frm = this.parent.parent ;
				var enableInfo  = {
					itemOrder : info[0], page_no : info[1] ,from_itemOrder : info[2], end_itemOrder : info[3], finish_yn : info[4],
					line :  infoData ,
					skipCheck : function(elementsList){
						//alert(elementsList["O_"+ this.itemOrder].skip + elementsList["O_"+ this.itemOrder].enable + elementsList["O_"+ this.itemOrder].skipdisable);
						//if(elementsList["O_"+ this.itemOrder].skip + elementsList["O_"+ this.itemOrder].enable + elementsList["O_"+ this.itemOrder].skipdisable < 0) return ;
						var endcnt = elementsList.length;
						for(var i = 0; i < endcnt; i++){
							if(this.finish_yn == "Y" && this.itemOrder < Number(elementsList[i].itemOrder)){
								elementsList[i].enable = -9999;
							}else{
								if(this.from_itemOrder != "" && this.end_itemOrder != ""){
									if( Number(this.from_itemOrder) <=  Number(elementsList[i].itemOrder) &&  Number(this.end_itemOrder) >=  Number(elementsList[i].itemOrder)){
										elementsList[i].enable++;
									}
								}
							}
						}
					}
				};
				if(value == 0){
					this.elementsList["O_"+ info[0]].enableInfos =[enableInfo];
				}else{
					this.elementsList["O_"+ info[0]].enableInfos[this.elementsList["O_"+ info[0]].enableInfos.length] = enableInfo;
				}
				//변경된 enable정보 안에 skip 이 있다면 skip enable 정보를 clear시킨다.
				var skipinfo = this.skipinfos["O_"+ info[0]];
				if(skipinfo != null){
					for(var ch = Number(skipinfo.from); ch <= Number(skipinfo.end); ch++){
						if(this.elementsList["O_" + ch] != null){
							this.elementsList["O_" + ch].enableInfos = null;
						}
					}
				}
						

			},
			enableRemove : function(infoData){
				var info = infoData.split("|");
				this.elementsList["O_" + info[0]].enableInfos = null;
			},
			enableChange : function(infoData){
				this.enableAdd(infoData,0);
				this.formRefresh();
			},
			enableChange2 : function(group, infoData){
				var items = this.parent.parent.findGroups(group);
				var loopend = items.length;
				var loop = 0;
				for(var i = 0; i < loopend; i++){
					if(items[i].checked){
						this.enableAdd(items[i].getAttribute("survey_dest"),loop++);
					}
				}
				 if(loop==0){ 
					this.enableRemove(infoData); 
				 }  
				this.formRefresh();
			},
			formRefresh:function(){
				var frm = this.parent.parent ;
				var endcnt = this.elementsList.length;
				for(var i = 0; i < endcnt; i++){
					this.elementsList[i].enable = 0;
					this.elementsList[i].skipdisable = 0;
				}
				for(var i = 0; i < endcnt; i++){
					if(this.elementsList[i].enableInfos != null){
						for(var j = 0; j < this.elementsList[i].enableInfos.length; j++){
							this.elementsList[i].enableInfos[j].skipCheck(this.elementsList);
						}
					}
					if(this.skipinfos["O_"+ this.elementsList[i].itemOrder] != null) this.skipinfos["O_"+ this.elementsList[i].itemOrder].enableflag = true;
				}
				
				var endcnt2;
				for(var i = 0; i < endcnt; i++){
					//alert(this.elementsList[i].itemOrder +":"+this.elementsList[i].skip + ":"+this.elementsList[i].enable + ":"+this.elementsList[i].skipdisable);
					if ((this.elementsList[i].skip + this.elementsList[i].enable + this.elementsList[i].skipdisable )< 0){	// disable
						//skip이 disable 되어 있으면
						
						var skipinfo = this.skipinfos["O_"+ this.elementsList[i].itemOrder];
						if(skipinfo != null){
							skipinfo.enableflag = false;
							for(var ch = Number(skipinfo.from); ch <= Number(skipinfo.end); ch++){
								
								if(this.elementsList["O_" + ch] != null){
									this.elementsList["O_" + ch].skipdisable++;
									//alert( ch +":"+ this.elementsList["O_" + ch].skipdisable);
								}
							}
						}
						
						endcnt2 = this.elementsList[i].item.length;
						for(var j = 0 ; j < endcnt2 ;j++){
							if(this.elementsList[i].item[j].type == "checkbox"){
								this.elementsList[i].item[j].checked = false ;
								this.elementsList[i].item[j].disable();
								this.elementsList[i].item[j].onEvent();
							}else if(this.elementsList[i].item[j].type == "radio"){
								this.elementsList[i].item[j].checked = !this.elementsList[i].item[j].checked;	// 2012.10.09 by kevin samsung mobile error! add line
								this.elementsList[i].item[j].disable();
								this.elementsList[i].item[j].checked = false ;
								this.elementsList[i].item[j].onEvent();
							}else{
								this.elementsList[i].item[j].disable();
							}
						}
					}else{	// enable
						endcnt2 = this.elementsList[i].item.length;
						for(var j = 0 ; j < endcnt2 ;j++){
							if(this.elementsList[i].item[j].isAttribute("survey_relate_child")) continue;
						 
							if(this.elementsList[i].item[j].type == "radio"){
								var targetItems = this.parent.parent.findGroups(this.elementsList[i].item[j].name);
						 
								// 2012.10.10 by kevin samsung phone error! checked item value
								// init
								var checked_item = -1;
								
								for(var k = 0 ; k < targetItems.length ; k++){
									if(targetItems[k].checked && checked_item == -1) {
										checked_item = k;
										break;
									}
								}
								
								for(var k = 0 ; k < targetItems.length ; k++){
									if(!targetItems[k].getAttribute("always_disable") && targetItems[k].getAttribute("survey_relate_child")==null ){
										targetItems[k].enable();
										// 2012.10.09 by kevin xxxx_desc error! add source
										if(targetItems[k].getAttribute("survey_desc") == "Y") {
											if(targetItems[k].checked) {
												j++;
												targetItems[k].enable();
											} else {
												j++;
											}
												
										} 
									}
									
									targetItems[k].checked = !targetItems[k].checked;
									targetItems[k].checked = !targetItems[k].checked;
									
									j++;
								}
								//2013-05-30 yongjun 매트릭스 일 경우
								if(this.elementsList[i].item.length != targetItems.length) j--;
								if(checked_item != -1) targetItems[checked_item].checked = true ;
							} else {
								var targetItems = this.parent.parent.findGroups(this.elementsList[i].item[j].name);
								if(this.elementsList[i].item[j].getAttribute("instance_disable")=="Y" && this.elementsList[i].item[j].checked){
									for(var k = 0 ; k < targetItems.length ; k++){
										if(targetItems[k].getAttribute("instance_disable")){
											targetItems[k].enable();
										}else{
											targetItems[k].disable();
										}
										
										// 2012.10.09 by kevin xxxx_desc error! add source
										if(targetItems[k].getAttribute("survey_desc") == "Y") {
												if(targetItems[k].checked) {
													j++;
													targetItems[k].enable();
												} else {
													j++;
												}
													
										} 
									}
										
								}else{
									if(!this.elementsList[i].item[j].getAttribute("always_disable")){
										this.elementsList[i].item[j].enable();
										
										// 2012.10.09 by kevin xxxx_desc error! add source
										if(this.elementsList[i].item[j].getAttribute("survey_desc") == "Y") {
											if(this.elementsList[i].item[j].checked) {
												j++;
												this.elementsList[i].item[j].enable();
											} else {
												j++;
											}
												
										} 
										}
								}
							}
						}
						
					}
				}
				
				var makeStr = frm.elements["enable_history"].getAttribute("old_value");
				
				var bChk = false;
				if(makeStr != "") makeStr +=",";
				endcnt = this.elementsList.length;
				for(var j = 0; j < endcnt; j++){
					//disable된 skip정보를 처리한다.
					var skipinfo = this.skipinfos["O_"+ this.elementsList[j].itemOrder];
					if(skipinfo != null && !skipinfo.enableflag){
						if(bChk) makeStr += "-";
						makeStr += (this.elementsList[j].itemOrder + "|"+(this.parent.parent.page_no.value-1) + "|"+ skipinfo.from + "|" + skipinfo.end + "|N");
						bChk = true;
					}
						
					var enableInfos = this.elementsList[j].enableInfos;
					if(enableInfos == null ) continue;
					if((this.elementsList[j].skip + this.elementsList[j].enable + this.elementsList[j].skipdisable) < 0) continue;
					for(var k = 0; k < enableInfos.length; k++){
						if(bChk) makeStr += "-";
						makeStr += enableInfos[k].line;
						bChk = true;
					}
				}
				frm.elements["enable_history"].value = makeStr;
			}
		};
		this.parent.skip_check.init();
		this.parent.skip_check.formRefresh();
		return true;
	}
};

BIZenic.Validate.valid_survey_dest = {
	key : "survey_dest",
	uiChange : function (){
		var support = ",radio,checkbox,select-one,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var element = this.parent.parent.findAttributeElement("survey_history");
		if(element == null)return false ;
		var eventListener = new Object();
		eventListener.parent = this.parent;
		eventListener.history = element;
		eventListener.onEvent = function(){
			if(this.parent.disabled){
				this.history.skip_check.enableRemove(this.parent.getAttribute("survey_dest"));
			}else if(this.parent.type == "radio"){
				this.history.skip_check.enableChange(this.parent.getAttribute("survey_dest"));
			}else if(this.parent.type == "select-one"){
				this.history.skip_check.enableChange(this.parent.options[this.parent.selectedIndex].getAttribute("survey_dest"));
			}else{
				this.history.skip_check.enableChange2(this.parent.getAttribute("group"), this.parent.getAttribute("survey_dest"));
				}
		};
		this.parent.addEvent(eventListener);
		return true;
	}
};

BIZenic.Validate.valid_survey_required = {
	key : "survey_required" ,
	validate : function (){
		var support = ",tel,number,text,radio,checkbox,textarea,select-one,select-multiple,";
		
		var valid_item = document.getElementById("valid_item_" + this.parent.getAttribute("itemorder"));
		// var item_display = document.getElementById(item_" + this.parent.getAttribute("itemorder"));
		// valid_item.innerHTML = "";
		
		if( support.indexOf(","+this.parent.type+",") < 0) {
			return true ;
		}
		if(this.parent.disabled) {
			return true ;
		}
		
		var regExp_whiteSpace = /^[\s]*$/;
		var groups = this.parent.parent.findGroups(this.parent.getAttribute("group"));
		var endcnt;
		if(this.parent.type == "radio" || this.parent.type == "checkbox"){ //GROUP TEST
			endcnt = groups.length;
			for (var i = 0 ; i < endcnt; i++){
				if(groups[i].checked == true) {
					return true;
				}
		    }
			valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_NO_INPUT , {ques_no: this.parent.getAttribute("itemname")}) + '</b></font>';
			//alert(BIZenic.message(ANSWER_NO_INPUT , {ques_no: this.parent.getAttribute("itemname")}));	// 2012.09.24 by kevin alert remove
			// if(item_display && !item_display.style.display == "none") groups[0].focus();
			return false;
		}else if(this.parent.type == "select-one"){ //GROUP TEST
			endcnt = groups.length;
			for(var i = 0 ; i < endcnt; i++){
				if (groups[i].value != '-1'){
					var valueSplit = groups[i].value.split("_");
					if( valueSplit.length == 2 && valueSplit[1] == "1"){
						return true;
					}else if(valueSplit.length == 1){						
						return true;
					}
				}
			}
			valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_NO_INPUT , {ques_no: this.parent.getAttribute("itemname")}) + '</b></font>';
			//alert(BIZenic.message(ANSWER_NO_INPUT , {ques_no: this.parent.getAttribute("itemname")}));	// 2012.09.24 by kevin alert remove
			// if(item_display && !item_display.style.display == "none") groups[0].focus();
			return false;
		}else if(this.parent.type == "text"){ //SELF TEST
			if(regExp_whiteSpace.test(this.parent.value) || this.parent.value == "0:00"){
				if(this.parent.name.endsWith("_desc")){ //etc
					valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_NO_ETC , {ques_no: this.parent.getAttribute("itemname")}) + '</b></font>';
					//alert(BIZenic.message(ANSWER_NO_ETC , {ques_no: this.parent.getAttribute("itemname")}));	// 2012.09.24 by kevin alert remove
				}else if(this.parent.name.indexOf("_07_")> -1){ //person
					valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_PERSON) + '</b></font>';
					//alert(BIZenic.message(ANSWER_PERSON));	// 2012.09.24 by kevin alert remove
				} else {
					valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_NO_INPUT , {ques_no: this.parent.getAttribute("itemname")}) + '</b></font>';
					//alert(BIZenic.message(ANSWER_NO_INPUT , {ques_no: this.parent.getAttribute("itemname")}));	// 2012.09.24 by kevin alert remove
				}
				
				this.parent.value = "" ;
				// if(item_display && !item_display.style.display == "none") this.parent.focus();
				return false;
			}
		}else if(this.parent.type == "textarea"){ //SELF TEST
			if (regExp_whiteSpace.test(this.parent.value)){
				valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_NO_INPUT , {ques_no: this.parent.getAttribute("itemname")}) + '</b></font>';
				//alert(BIZenic.message(ANSWER_NO_INPUT , {ques_no: this.parent.getAttribute("itemname")}));	// 2012.09.24 by kevin alert remove
				this.parent.value = "" ;
				// if(item_display && !item_display.style.display == "none") this.parent.focus();
				return false;
			}
		} else {
			if(regExp_whiteSpace.test(this.parent.value)) {
				valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_NO_INPUT , {ques_no: this.parent.getAttribute("itemname")}) + '</b></font>';
				// if(item_display && !item_display.style.display == "none") this.parent.focus();
				return false;
			}
		}
		
		return true;
	}
};

BIZenic.Validate.valid_survey_desc = {
	key : "survey_desc",
	validate : function (){
		var support = ",radio,checkbox,";
		
		var valid_item = document.getElementById("valid_item_" + this.parent.getAttribute("itemorder"));
		// var item_display = document.getElementById("item_" + this.parent.getAttribute("itemorder"));
		// valid_item.innerHTML = "";
		
		if( support.indexOf(","+this.parent.type+",") < 0) return true ;
		
		if(this.parent.disabled) { return true ; }
		if(!this.parent.checked) { return true ; }
		
		if(this.parent.getAttribute("survey_desc") != "Y") return true;
		var regExp_whiteSpace = /^[\s]*$/;
		var element = this.parent.parent.elements[this.parent.id + "_desc"];
		
		if(regExp_whiteSpace.test(element.value)){
			valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_NO_ETC , {ques_no: this.parent.getAttribute("itemname")}) + '</b></font>';
			// alert(BIZenic.message(ANSWER_NO_ETC , {ques_no: this.parent.getAttribute("itemname")}));
			element.value = "" ;
			// if(item_display && !item_display.style.display == "none") element.focus();
			return false;
		}

		return true;
	},
	uiChange : function (){
		var support = ",checkbox,radio,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var eventListener = new Object();
		eventListener.parent = this.parent;
		eventListener.onEvent = function(){
			if(this.parent.disabled){
				if(this.parent.getAttribute("survey_desc") != "Y") return true;
				this.parent.parent.disable(this.parent.id);
			}
			if(this.parent.type == "radio"){
				var groups = this.parent.parent.findGroups(this.parent.getAttribute("group"));
				for (var i=0; i< groups.length; i++){
					if(groups[i].getAttribute("survey_desc") != "Y") continue;
					if(groups[i].checked){
						// alert("checked > enable" + groups[i].id);
						this.parent.parent.enable(groups[i].id + "_desc");
						if(document.getElementById("desc_"+ groups[i].id +"_label") != null)
							document.getElementById("desc_"+ groups[i].id +"_label").style.display = "block";
					}else{
						// alert("!checked > disable" + groups[i].id);
						this.parent.parent.disable(groups[i].id + "_desc");
						if(document.getElementById("desc_"+ groups[i].id + "_label") != null)
							document.getElementById("desc_"+ groups[i].id +"_label").style.display = "none";
					}
				}
			}else if(this.parent.type == "checkbox"){
				if(this.parent.getAttribute("survey_desc") != "Y") return true;
				if (this.parent.checked){
					this.parent.parent.enable(this.parent.id + "_desc");
					if(document.getElementById("desc_"+ this.parent.id +"_label") != null)
						document.getElementById("desc_"+ this.parent.id +"_label").style.display = "block";
				} else {
					this.parent.parent.disable(this.parent.id + "_desc");
					if(document.getElementById("desc_"+ this.parent.id +"_label") != null)
						document.getElementById("desc_"+ this.parent.id +"_label").style.display = "none";
				}
			}
		};
		eventListener.onEvent();
		this.parent.addEvent(eventListener);
		return true;
	}
};

BIZenic.Validate.valid_survey_order = {
	key : "survey_order",
	validate : function (){
		var flag = true;
		var support = ",select-one," ;
		
		var valid_item = document.getElementById("valid_item_" + this.parent.getAttribute("itemorder"));
		// var item_display = document.getElementById("item_" + this.parent.getAttribute("itemorder"));
		// valid_item.innerHTML = "";
		
		if( support.indexOf(","+this.parent.type+",") < 0) return flag ;
		if(this.parent.disabled) return true ;
		var max_check = this.parent.getAttribute("survey_order");
		var minCount = max_check.split("|")[1];
		if(parseInt(minCount) < 1 ) return flag ;
		var selectedCount = 0;
		var groups = this.parent.parent.findGroups(this.parent.getAttribute("group"));
		var endcnt = groups.length;
		for (var i = 0 ; i < endcnt; i++){
			if(groups[i].checked == true) {
				selectedCount++ ;
	        }
	    }
		if (minCount > selectedCount) {
			valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_ORDER_MIN_UNDER , {ques_no: this.parent.getAttribute("itemname") , max_number: maxCount}) + '</b></font>';
			//alert(BIZenic.message(ANSWER_ORDER_MIN_UNDER , {ques_no: this.parent.getAttribute("itemname") , max_number: maxCount}));
			// if(item_display && !item_display.style.display == "none") elements[0].focus();
			return false;
		}
		return flag;
	},
	uiChange : function (){
		var support = ",select-one,";
		
		var valid_item = document.getElementById("valid_item_" + this.parent.getAttribute("itemorder"));
		// var item_display = document.getElementById("item_" + this.parent.getAttribute("itemorder"));
		// valid_item.innerHTML = "";
		
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var eventListener = new Object();
		eventListener.parent = this.parent;
		eventListener.onEvent = function(){
			if(this.parent.disabled) return true ;
			if(this.parent.value == -1) return true ;
			var this_value = this.parent.value.split("_")[1];
			var max_check = this.parent.getAttribute("survey_order");
			var maxCount = max_check.split("|")[0];
			var selectedCount = 0;
			var groups = this.parent.parent.findGroups(this.parent.getAttribute("group"));
			var endcnt = groups.length
			for (var i=0; i< endcnt; i++){
				if (this.parent != groups[i]){
				    var elevalues = groups[i].value.split("_");
					if (groups[i].value != '-1'){
							selectedCount ++;
					}
					
					if (this_value == elevalues[1] ){
						valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_ORDER_SELECTED , {item_order_value: elevalues[1]}) + '</b></font>';
						// alert(BIZenic.message(ANSWER_ORDER_SELECTED , {item_order_value: elevalues[1]}));
						this.parent.selectedIndex = 0;
						// if(item_display && !item_display.style.display == "none") this.parent.focus();
						return false;
					}
				}
			}
			if(parseInt(maxCount) > 0 && selectedCount > parseInt(maxCount)) {
				valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_ORDER_MAX_OVER , {max_number: maxCount}) + '</b></font>';
				//alert(BIZenic.message(ANSWER_ORDER_MAX_OVER , {max_number: maxCount}));
				this.parent.selectedIndex = 0;
				// if(item_display && !item_display.style.display == "none") this.parent.focus();
				return false;
			}
		};
		this.parent.addEvent(eventListener);
		return true;
	}
};

BIZenic.Validate.valid_survey_priority = {
	key : "survey_priority",
	validate : function (){
		var flag = true;
		var support = ",checkbox," ;
		
		var valid_item = document.getElementById("valid_item_" + this.parent.getAttribute("itemorder"));
		// var item_display = document.getElementById("item_" + this.parent.getAttribute("itemorder"));
		// valid_item.innerHTML = "";
		
		if( support.indexOf(","+this.parent.type+",") < 0) return flag ;
		if(this.parent.disabled) return true ;
		if (this.parent.value == "") return flag;
		var max_check = this.parent.getAttribute("survey_priority");
		var minCount = max_check.split("|")[1];
		if(parseInt(minCount) < 1 ) return flag;
		var chkCnt = 0 ;
		var groups = this.parent.parent.findGroups(this.parent.getAttribute("group"));
		var endcnt = groups.length;
		for(var i = 0 ; i < endcnt ; i++){
			if(groups[i].checked) chkCnt++ ;
		}
		if(chkCnt < parseInt(minCount)){
			valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_ORDER_MIN_UNDER , {ques_no: this.parent.getAttribute("itemname") , max_number: minCount}) + '</b></font>';
			// alert(BIZenic.message(ANSWER_ORDER_MIN_UNDER , {ques_no: this.parent.getAttribute("itemname") , max_number: minCount}));
			// if(item_display && !item_display.style.display == "none") this.parent.focus();
			return false;
		}
		return flag;
	},
	uiChange : function(){
		var support = ",checkbox,";
		
		var valid_item = document.getElementById("valid_item_" + this.parent.getAttribute("itemorder"));
		// var item_display = document.getElementById("item_" + this.parent.getAttribute("itemorder"));
		// valid_item.innerHTML = "";
		
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		if(this.parent.value != ""){
			this.parent.checking();
			var groupName = this.parent.getAttribute("group");
			var elements = this.parent.parent.findElements("rank_" + groupName);
			elements[this.parent.value -1].value = document.getElementById("label_" + this.parent.name).innerText ;
		}
		var eventListener = new Object();
		eventListener.parent = this.parent;
		eventListener.onEvent = function(){
			var groupName = this.parent.getAttribute("group");
			var elements = this.parent.parent.findElements("rank_" + groupName);
			var endcnt = elements.length;
			var label = document.getElementById("label_" + this.parent.name);
			
			if(this.parent.disabled){
				for(var i = 0 ; i < endcnt ; i++){
					elements[i].value = "";
				}
				this.parent.value = "" ;
			}else if(this.parent.checked){
				var order = false ;
				for (var i=0; i< endcnt; i++){
					if (elements[i].value == ""){
						if(label.innerText){
							elements[i].value = label.innerText ;
						}else{
							elements[i].value = label.textContent ;
						}
						this.parent.value = i + 1 ;
						order = true ;
						break;
					}
				}
				if(!order){
					var max_check = this.parent.getAttribute("survey_priority");
					var maxCount = max_check.split("|")[0];
					valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_ORDER_MAX_OVER , {max_number: maxCount}) + '</b></font>';
					// alert(BIZenic.message(ANSWER_ORDER_MAX_OVER , {max_number: maxCount}));
					this.parent.checked = false;
				    if(this.parent.getAttribute("survey_desc") == "Y"){
				     this.parent.parent.disable(this.parent.id + "_desc");
				    }
				    // if(item_display && !item_display.style.display == "none") this.parent.focus();
				}
			}else{
				for(var i = this.parent.value -1 ; i < endcnt -1 ; i++){
					elements[i].value = elements[i+1].value;
				}
				elements[endcnt -1].value = "" ;
				var groups = this.parent.parent.findGroups(groupName);
				var endcnt2 = groups.length ;
				for(var i = 0 ; i < endcnt2 ; i++){
					if( groups[i].value > this.parent.value ) groups[i].value -= 1;
				}
				this.parent.value = "" ;
			}
		};
		this.parent.addEvent(eventListener);
		eventListener = new Object();
		eventListener.parent = this.parent;
		eventListener.onEvent = function(){
			if(this.parent.disabled) return true ;
			var groupName = this.parent.getAttribute("group");
			var elements = this.parent.parent.findElements("rank_" + groupName);
			if(this.parent.value != ""){
				elements[this.parent.value -1].value = "" ;
				this.parent.value = "" ;
				this.parent.unChecking();
				if( this.parent.getAttribute("survey_desc") == "Y"){
					this.parent.parent.disable(this.parent.id + "_desc");
				}
			}
		};
		var groupName = this.parent.getAttribute("group");
		var element = document.getElementById("clean_" + groupName);
		element.addEvent(eventListener);
		return true;
	}
};

BIZenic.Validate.valid_survey_max_check = {
	key : "survey_max_check",
	validate : function (){
		var flag = true;
		var support = ",checkbox," ;
		
		var valid_item = document.getElementById("valid_item_" + this.parent.getAttribute("itemorder"));
		// var item_display = document.getElementById("item_" + this.parent.getAttribute("itemorder"));
		// valid_item.innerHTML = "";
		
		if( support.indexOf(","+this.parent.type+",") < 0) return flag ;
		
		if(this.parent.getAttribute("instance_disable") == "Y" && document.getElementById(this.parent.getAttribute("id")).checked  == true){
			return true;
		}
		
		if (this.parent.value == "") return flag;
		var max_check = this.parent.getAttribute("survey_max_check");
		var minCount = max_check.split("|")[1];
		var maxCount = max_check.split("|")[0];
		if(parseInt(minCount) < 1 && parseInt(maxCount) < 1) return flag;
		var chkCnt = 0 ;
		var groups = this.parent.parent.findGroups(this.parent.getAttribute("group"));
		var endcnt = groups.length;
		for (var i=0; i< endcnt; i++){
			if(groups[i].checked) chkCnt ++ ;
		}
		if(chkCnt < parseInt(minCount)){
			valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_CHECK_MIN_UNDER , {ques_no: this.parent.getAttribute("itemname") , max_number: minCount}) + '</b></font>';
			// alert(BIZenic.message(ANSWER_CHECK_MIN_UNDER , {ques_no: this.parent.getAttribute("itemname") , max_number: minCount}));
			// if(item_display && !item_display.style.display == "none") this.parent.focus();
			return false;
		}
		if(chkCnt > parseInt(maxCount)){
			valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_CHECK_MAX_OVER , {ques_no: this.parent.getAttribute("itemname") , max_number: maxCount}) + '</b></font>';
			return false;
		}
		return flag;
	},
	uiChange : function (){
		var support = ",checkbox,";
		
		var valid_item = document.getElementById("valid_item_" + this.parent.getAttribute("itemorder"));
		// var item_display = document.getElementById("item_" + this.parent.getAttribute("itemorder"));
		// valid_item.innerHTML = "";
		
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var eventListener = new Object();
		eventListener.parent = this.parent;
		eventListener.onEvent = function(){
			if(this.parent.disabled) return true ;
			var max_check = this.parent.getAttribute("survey_max_check");
			var maxCount = max_check.split("|")[0];
			if(parseInt(maxCount) < 1 ) return true;
			var chkCnt = 0;
			var groups = this.parent.parent.findGroups(this.parent.getAttribute("group"));
			var endcnt = groups.length;
			for (var i=0; i< endcnt; i++){
				if(groups[i].checked) chkCnt ++ ;
			}
			if(chkCnt > parseInt(maxCount)){
				valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_CHECK_MAX_OVER , {ques_no: this.parent.getAttribute("itemname") , max_number: maxCount}) + '</b></font>';
				//alert(BIZenic.message(ANSWER_CHECK_MAX_OVER , {ques_no: this.parent.getAttribute("itemname") , max_number: maxCount}));
				//this.parent.checked = false;
				//if( this.parent.getAttribute("survey_desc") == "Y"){
				//	this.parent.parent.disable(this.parent.id + "_desc");
				//}
				// if(item_display && !item_display.style.display == "none") this.parent.focus();
				return false;
			}
		};
		this.parent.addEvent(eventListener);
		return true;
	}
};

BIZenic.Validate.valid_survey_integer = {
	key : "survey_integer",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,password," ;
		
		var valid_item = document.getElementById("valid_item_" + this.parent.getAttribute("itemorder"));
		// var item_display = document.getElementById("item_" + this.parent.getAttribute("itemorder"));

		// valid_item.innerHTML = "";
		
		if( support.indexOf(","+this.parent.type+",") < 0) return flag ;
		if(this.parent.disabled) return flag ;
		
		var groups = this.parent.parent.findGroups(this.parent.getAttribute("group"));	

		var regExp_Integer = /^(\+|\-|\d*)\d+$/;
		var tsTarget = "";
		var endcnt = groups.length;
		for (var i = 0 ; i < endcnt; i++) {
			tsTarget = groups[i].value;
			if(tsTarget == "") continue;

			if(!regExp_Integer.test(tsTarget)) {
				valid_item.innerHTML = '<font color=red><b>' + ECM_VALIDATOR_INTEGER + '</b></font>';
				// if(item_display && !item_display.style.display == "none")  this.parent.focus();
				return false;
			}
	    }
		
		return flag;
	},
	uiChange : function (){
		var support = ",tel,number,text,password,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		if ( !this.parent.isAttrValue("filter")){
			this.parent.setAttribute("filter","[0-9\\-\\+]");
		}
		return true;
	}
};

BIZenic.Validate.valid_survey_multiple = {
	key : "survey_multiple",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,password," ;
		
		var valid_item = document.getElementById("valid_item_" + this.parent.getAttribute("itemorder"));
		// var item_display = document.getElementById("item_" + this.parent.getAttribute("itemorder"));
		// valid_item.innerHTML = "";
		
		if( support.indexOf(","+this.parent.type+",") < 0) return flag ;
		if (this.parent.value == "") return flag;
		if(this.parent.disabled) return true ;
		var checks = this.parent.getAttribute("survey_multiple").split("|");

		if(checks[0] == '2'){
			var tsTarget = this.parent.value;
			if(tsTarget != ''){
				//var regExp_numeric = /^[0-9]+$/;
				var regExp_numeric = /^(\+|\-|\d*)\d+$/;
				if(!regExp_numeric.test(tsTarget)) {
					valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_NUMBER , {ques_no: this.parent.getAttribute("itemname") }) + '</b></font>';
					// alert(BIZenic.message(ANSWER_NUMBER , {ques_no: this.parent.getAttribute("itemname") }));
					// if(item_display && !item_display.style.display == "none") this.parent.focus();
					return false;
				}
				if(checks[1] != '' && tsTarget < parseInt(checks[1])) {
					valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_NUMBER_MIN_UNDER , {ques_no: this.parent.getAttribute("itemname"), min_number : checks[1]}) + '</b></font>';
					// alert(BIZenic.message(ANSWER_NUMBER_MIN_UNDER , {ques_no: this.parent.getAttribute("itemname"), min_number : checks[1]}));
					// if(item_display && !item_display.style.display == "none") this.parent.focus();
					return false;
				}else if(checks[2] != '' && tsTarget > parseInt(checks[2])){
					valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_CHECK_MAX_OVER , {ques_no: this.parent.getAttribute("itemname") , max_number: checks[2]}) + '</b></font>';
					// alert(BIZenic.message(ANSWER_CHECK_MAX_OVER , {ques_no: this.parent.getAttribute("itemname") , max_number: checks[2]}));
					// if(item_display && !item_display.style.display == "none") this.parent.focus();
					return false;
				}
			}
		} else if(checks[0] == '3'){
			var value = this.parent.value;
			var sTime = value.substring(value.length - 2);
			if(sTime > 60){
				valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_NUMBER_MAX_OVER , {ques_no: this.parent.getAttribute("itemname"), max_number : "59" }) + '</b></font>';
				// alert(BIZenic.message(ANSWER_NUMBER_MAX_OVER , {ques_no: this.parent.getAttribute("itemname"), max_number : "59" }));
				// if(item_display && !item_display.style.display == "none") this.parent.focus();
				return false;
			}
		}
		return flag;
	},
	uiChange : function (){
		var support = ",tel,number,text,password,";
		
		var valid_item = document.getElementById("valid_item_" + this.parent.getAttribute("itemorder"));
		// valid_item.innerHTML = "";
		
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var checks = this.parent.getAttribute("survey_multiple").split("|");
		if(checks[0] == '2' && checks.length == 3){
			this.parent.setAttribute("size", "8");
			this.parent.setAttribute("balloon", ANSWER_SURVEY_RANGE + "|" + checks[1] + "~" + checks[2]);
			var validator = BIZenic.Validate.Base.create(BIZenic.Validate["valid_balloon"]  , this.parent);
			if(validator != null){
				this.parent.validators[this.parent.validators.length] = validator;
				validator.uiChange();
			}
			validator = BIZenic.Validate.Base.create(BIZenic.Validate["valid_integer"]  , this.parent);
			if(validator != null){
				this.parent.validators[this.parent.validators.length] = validator;
				validator.uiChange();
			}
			var eventListener = new Object();
			eventListener.parent = this.parent;
			eventListener.onEvent = function(){
				if(this.parent.disabled) return true ;
				var checks = this.parent.getAttribute("survey_multiple").split("|");
				var tsTarget = this.parent.value;
				if(tsTarget != ''){
					//var regExp_numeric = /^[0-9]+$/;
					var regExp_numeric = /^(\+|\-|\d*)\d+$/;
					
					if(!regExp_numeric.test(tsTarget)) {
						// alert(BIZenic.message(ANSWER_NUMBER , {ques_no: this.parent.getAttribute("itemname") }));
						valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_NUMBER , {ques_no: this.parent.getAttribute("itemname") }) + '</b></font>';
						//this.parent.focus();		// 2012.09.20 by kevin 스마트 폰에서 오류 발생하여 제거함
						return false;
					}
					if(checks[1] != '' && tsTarget < parseInt(checks[1])) {
						//alert(BIZenic.message(ANSWER_NUMBER_MIN_UNDER , {ques_no: this.parent.getAttribute("itemname"), min_number : checks[1]}));
						valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_NUMBER_MIN_UNDER , {ques_no: this.parent.getAttribute("itemname"), min_number : checks[1]}) + '</b></font>';
						//this.parent.focus();		// 2012.09.20 by kevin 스마트 폰에서 오류 발생하여 제거함
						return false;
					}else if(checks[2] != '' && tsTarget > parseInt(checks[2])){
						//alert(BIZenic.message(ANSWER_CHECK_MAX_OVER , {ques_no: this.parent.getAttribute("itemname") , max_number: checks[2]}));
						valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ANSWER_CHECK_MAX_OVER , {ques_no: this.parent.getAttribute("itemname") , max_number: checks[2]}) + '</b></font>';
						//this.parent.focus();		// 2012.09.20 by kevin 스마트 폰에서 오류 발생하여 제거함
						return false;
					}
				}
			};
			this.parent.addEvent(eventListener);
		}else if(checks[0] == '3'){
			this.parent.setAttribute("size", "8");
			if(!this.parent.isAttrValue("mask")){
				this.parent.masking = function(){
					var sTime = this.value.replace(/:/g,"").replace(/^[0]+/g,"");
					var tLen =sTime.length;
					if (tLen < 3 ){
						var format = "0:00" ;
						sTime = format.substring(0, format.length - tLen) + sTime ;
					}else{
						sTime = sTime.substring(0, tLen - 2) + ":" + sTime.substring(tLen - 2);
					}
					this.value = sTime;
				};
			}
			if ( !this.parent.isAttrValue("filter")){
				this.parent.setAttribute("filter","[0-9]");
			}
		}else if(checks[0] == '4'){
			this.parent.setAttribute("size", "10");
			this.parent.makeReadOnly(true);
		}
		return true;
	}
};

BIZenic.Validate.valid_survey_subject = {
	key : "survey_subject",
	validate : function (){
		var flag = true;
		var support = ",textarea," ;
		if( support.indexOf(","+this.parent.type+",") < 0) return flag ;
		if (this.parent.value == "") return flag;
		if(this.parent.disabled) return true ;
		var size = this.parent.getAttribute("survey_subject");
		if (this.parent.value != '' && this.parent.value.bytes() > size){
			alert(BIZenic.message(ANSWER_MAX , {ques_no: this.parent.getAttribute("itemname"), size : size}));
			this.parent.value = this.parent.value.cutBytes(size);
			flag = false ;
		}
		return flag;
	},
	uiChange : function (){
		var support = ",textarea,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var eventListener = new Object();
		eventListener.parent = this.parent;
		eventListener.onEvent = function(){
			if(this.parent.disabled) return true ;
			var size = this.parent.getAttribute("survey_subject");
			var msglen = this.parent.value.bytes();
			if(msglen > size) {
				alert(BIZenic.message(ANSWER_MAX , {ques_no: this.parent.getAttribute("itemname"), size : size}));
				this.parent.value = this.parent.value.cutBytes(size);
			}
			msglen = this.parent.value.bytes();
			//document.getElementById("label_" + this.parent.name).innerHTML = "( &nbsp;" + msglen + " / " + size + " byte )";
		};
		this.parent.addEvent(eventListener);
		return true;
	}
};

BIZenic.Validate.valid_survey_delay = {
	key : "survey_delay",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text,hidden," ;
		if( support.indexOf(","+this.parent.type+",") < 0) return flag ;
		var time = this.parent.value; 
		if (this.parent.value != '' && this.parent.value > 0 ){
			alert(BIZenic.message(ECM_SURVEY_DELAY, {delay_time: time}));
			flag = false ;
		}
		return flag;
	},
	uiChange : function (){
		var support = ",tel,number,text,hidden,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		this.parent.makeReadOnly(true);
		var self = this;
		if(self.parent.value > 0 ){
			this.timer = window.setInterval(function(){
				self.parent.value = self.parent.value - 1 ;
				if(self.parent.value <= 0 ){
					window.clearInterval(self.timer);
				}
			}, 1000);
		}
		return true;
	}
};

BIZenic.Validate.valid_survey_sum = {
	key : "survey_sum",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text," ;
		
		var valid_item = document.getElementById("valid_item_" + this.parent.getAttribute("itemorder"));
		// valid_item.innerHTML = "";
		
		if( support.indexOf(","+this.parent.type+",") < 0) return flag ;
		var sum = this.parent.getAttribute("survey_sum");
		var element = this.parent.parent.elements["sum_" + this.parent.getAttribute("group")];
		if(element.value != "" && element.value != sum){
			valid_item.innerHTML = '<font color=red><b>' + ECM_SURVEY_TOTAL_SUM_VALID + '</b></font>';
			// alert(BIZenic.message(ECM_SURVEY_TOTAL_SUM_VALID));
			flag = false ;
		}
		return flag;
	},
	uiChange : function (){
		var support = ",tel,number,text,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var validator = BIZenic.Validate.Base.create(BIZenic.Validate["valid_numeric"]  , this.parent);
		if(validator != null){
			this.parent.validators[this.parent.validators.length] = validator;
			validator.uiChange();
		}
		var eventListener = new Object();
		eventListener.parent = this.parent;
		eventListener.onEvent = function(){
			var group = this.parent.getAttribute("group");
			var sum = this.parent.parent.elements["sum_" + group];
			var groups = this.parent.parent.findGroups(group);
			if(this.parent.disabled){
				for (i=0; i< groups.length; i++){
					groups[i].value = "";
				}
				sum.value = "" ;
			}else{
				sum.value = "0" ;
				var value = 0 ;
				for (i=0; i< groups.length; i++){
					value += Number(groups[i].value);
				}
				sum.value = value != 0 ? value : "" ;
			}
		};
		this.parent.addEvent(eventListener);
		return true;
	}
};

BIZenic.Validate.valid_survey_agree = {
	key : "survey_agree" ,
	validate : function (){
		var selectedCount = 0 ;
		var chkmax = 0 ;
		var support = ",radio,checkbox,";
		
		var valid_item = document.getElementById("valid_item_" + this.parent.getAttribute("itemorder"));
		// var item_display = document.getElementById("item_" + this.parent.getAttribute("itemorder"));
		// valid_item.innerHTML = "";
		
		if( support.indexOf(","+this.parent.type+",") < 0) return true ;
		var elements = this.parent.parent.findElements(this.parent.name);
		var length = elements.length;
		if(length == undefined){
			if(!elements.checked){
				valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ECM_SURVEY_AGREE , {agree_name: this.parent.getAttribute("survey_agree")}) + '</b></font>';
				// alert(BIZenic.message(ECM_SURVEY_AGREE , {agree_name: this.parent.getAttribute("survey_agree")}));
				// if(item_display && !item_display.style.display == "none") elements.focus();
				return false;
			}
		}else{
			var value = "" ;
			for(var i = 0; i < length; i++) {
				if(elements[i].checked)  value = elements[i].value;
			}
			if(value != "Y"){
				valid_item.innerHTML = '<font color=red><b>' + BIZenic.message(ECM_SURVEY_AGREE , {agree_name: this.parent.getAttribute("survey_agree")}) + '</b></font>';
				// alert(BIZenic.message(ECM_SURVEY_AGREE , {agree_name: this.parent.getAttribute("survey_agree")}));
				// if(item_display && !item_display.style.display == "none") elements[0].focus();
				return false;
			}
		}
		return true;
	}
};

BIZenic.Validate.valid_survey_answer = {
	key : "survey_answer",
	answerList : Array,
	uiChange : function (){
		var support = ",tel,number,text,hidden,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var result = this.parent.value;
		var item_list = result.split("|");
		this.answerList = new Array();
		var labelList = document.getElementsByTagName("label");
		var endcnt = item_list.length;
		for(var i = 0 ; i < endcnt ; i++){
			var items = item_list[i].split(":");
			var item = {name : items[0] , value : items[1], labels : null};
			this.answerList[i] = item;
			item.labels = new Array();
			for(var j = 0 ; j < labelList.length ; j++){
				if(labelList[j].id == "label_" + items[0].split("_")[0]){
					item.labels[item.labels.length] = labelList[j];
				}
			}
		}
		endcnt = this.answerList.length ;
		for(var i = 0 ; i < endcnt ; i++){
			var endcnt2 = this.answerList[i].labels.length;
			for (var j=0; j< endcnt2; j++){
				this.answerList[i].labels[j].innerHTML = this.answerList[i].value;
			}
			var elements = this.parent.parent.findGroups(this.answerList[i].name);
			endcnt2 = elements.length ;
			for(var j = 0 ; j < endcnt2 ; j++){
				var eventListener = new Object();
				eventListener.parent = elements[j];
				eventListener.answerParent = this.parent;
				eventListener.answerList = this.answerList;
				eventListener.item = this.answerList[i];
				eventListener.onEvent = function(){
					if(this.parent.disabled){
						this.item.value = this.parent.getAttribute("itemname") ;
						var endcnt3 = this.item.labels.length;
						for (var k=0; k< endcnt3; k++){
							this.item.labels[k].innerHTML = this.item.value;
						}
					}else if(this.parent.type == 'radio'){
						var labelValue = "label_" + this.parent.id;
						var label = document.getElementById(labelValue);
						if(label.innerText){
							this.item.value = label.innerText ;
						}else{
							this.item.value = label.textContent ;
						}
						var endcnt3 = this.item.labels.length;
						for (var k=0; k< endcnt3; k++){
							this.item.labels[k].innerHTML = this.item.value;
						}
					}else{
						var groupName = this.parent.getAttribute("group");
						var elements = this.parent.parent.findElements("rank_" + groupName);
						if(this.parent.checked && elements[0].value == ""){
							var labelValue = "label_" + this.parent.name;
							var label = document.getElementById(labelValue);
							if(label.innerText){
								this.item.value = label.innerText ;
							}else{
								this.item.value = label.textContent ;
							}
							var endcnt3 = this.item.labels.length;
							for (var k=0; k< endcnt3; k++){
								this.item.labels[k].innerHTML = this.item.value;
							}
						}else if(!this.parent.checked && this.parent.value == "1"){
							this.item.value = this.parent.getAttribute("itemname") ;
							for(var k = 1 ; k < endcnt2 ; k++){
								if(elements[k].value != ""){
									this.item.value = elements[k].value ;
									break;
								}
							}
							var endcnt3 = this.item.labels.length;
							for (var k=0; k< endcnt3; k++){
								this.item.labels[k].innerHTML = this.item.value;
							}
						}
					}
					this.answerParent.value = "" ;
					endcnt =  this.answerList.length;
					for(var i = 0 ; i < endcnt ; i++){
						this.answerParent.value += (i == 0 ? "" : "|") + this.answerList[i].name + ":" + this.answerList[i].value;
					}
				};
				elements[j].addEvent(eventListener);
				if(j == "0" && elements[j].type == 'checkbox'){
					eventListener = new Object();
					eventListener.answerParent = this.parent;
					eventListener.answerList = this.answerList;
					eventListener.item = this.answerList[i];
					eventListener.itemname = elements[j].getAttribute("itemname");
					eventListener.onEvent = function(){
						this.item.value = this.itemname;
						endcnt2 = this.item.labels.length;
						for (var k=0; k< endcnt2; k++){
							this.item.labels[k].innerHTML = this.item.value;
						}
						this.answerParent.value = "" ;
						endcnt2 = this.answerList.length ;
						for(var i = 0 ; i < this.answerList.length ; i++){
							this.answerParent.value += (i == 0 ? "" : "|") + this.answerList[i].name + ":" + this.answerList[i].value;
						}
					};
					var element = document.getElementById("clean_" + elements[j].getAttribute("group"));
					element.addEvent(eventListener);
				}
			}
		}
		return true;
	}
};

BIZenic.Validate.valid_survey_relate = {
	key : "survey_relate",
	relateList : Array,
	uiChange : function (){
		var support = ",tel,number,text,hidden,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		this.relateList = new Array();
		var result = this.parent.value;
		if(result == "") return ;
		var item_list = result.split("|");
		//alert("item_list = " + item_list);
		var endcnt = item_list.length;
		for(var i = 0 ; i < endcnt ; i++){
			var items = item_list[i].split(":");
			
			
			var relateItems = this.parent.parent.findGroups(items[0]);
			var endcnt2 = relateItems.length;
			//문항선택후 이전페이지로 넘어갔다가 돌아왔을대 데이타가 남아 있어서 enable 체크가 잘못되어 다시 세팅한다.
			if(endcnt2 > 0){
				var relate_tmp = ",";
				for(var j = 0 ; j < endcnt2 ; j++){
					if(relateItems[j].disabled){
						relate_tmp = ",";
					}else{
						relate_tmp = relate_tmp.replace(","+ relateItems[j].value + "," , ",");
						if(relateItems[j].checked) relate_tmp += relateItems[j].value + ",";
					}

				}
				items[2] = relate_tmp;
			}

			var relate = {name : items[0], target : items[1] , value : items[2]};
			this.relateList[this.relateList.length] = relate;

			for(var j = 0 ; j < endcnt2 ; j++){
				relateItems[j].setAttribute("survey_relate_parent", items[0] + "|" | items[1]);
				relateItems[j].setAttribute("relate_child_id", items[1] + "_" + relateItems[j].value);
				eventListener = new Object();
				eventListener.parent = relateItems[j];
				eventListener.relate = relate;
				eventListener.relateList = this.relateList ;
				eventListener.relateParent = this.parent;
				eventListener.onEvent = function(){
					var targetItems = this.parent.parent.findGroups(this.relate.target);
					if(this.parent.disabled){
						this.relate.value = ",";
					}else{
						this.relate.value = this.relate.value.replace(","+ this.parent.value + "," , ",");
						if(this.parent.checked) this.relate.value += this.parent.value + ",";
					}
					
					// 2012.10.10 by kevin samsung phone error! checked item value
					// init
					var checked_item = -1; 
					var endcnt3 = targetItems.length ;
					for(var k = 0 ; k < endcnt3 ; k++){
						if(targetItems[k].checked && this.relate.value.indexOf("," + targetItems[k].value + ",") > -1 && checked_item == -1) {
							checked_item = k;
							break;
						}
					}
					endcnt3 = targetItems.length ;
					for(var k = 0 ; k < endcnt3 ; k++){
						targetItems[k].enable();
						
						targetItems[k].checked = !targetItems[k].checked;
						targetItems[k].checked = !targetItems[k].checked;

						if(this.relate.value.indexOf("," + targetItems[k].value + ",") < 0){
							
							if(targetItems[k].checked){
								targetItems[k].checked = false;
								targetItems[k].onEvent();
							}else{
								if(targetItems[k].isAttribute("relate_child_id")){
									BIZenic.Validate.valid_survey_relate.setDisable(targetItems[k].getAttribute("relate_child_id"));
								}
							}
							targetItems[k].disable();
						}
					}

					if(checked_item != -1) targetItems[checked_item].checked = true ;
					
					var str = "" ;
					endcnt3 = this.relateList.length;
					for(var k = 0 ; k < endcnt3; k++){
						str += (str.length == 0 ? "" : "|") + this.relateList[k].name +":"+ this.relateList[k].target +":"+ this.relateList[k].value;
					}
					this.relateParent.value = str ;
				};
				relateItems[j].addEvent(eventListener);
			}
		}

		for(var i = 0 ; i < this.relateList.length ; i++){

			var targetItems = this.parent.parent.findGroups(this.relateList[i].target);
			endcnt4 = targetItems.length;
			for(var j = 0 ; j < endcnt4 ; j++){
				targetItems[j].setAttribute("survey_relate_child", this.relateList[i].name + "|" | this.relateList[i].target);
				if(this.relateList[i].value.indexOf("," + targetItems[j].value + ",") < 0){
					targetItems[j].disable();
				}
			}
		}

		
		return true;
	},
	setDisable : function (id){
		var obj = document.getElementById(id);
		if(obj == null) return;
		
		if(obj.checked){
			obj.checked = false;
			obj.onEvent();
		}else{
			if(obj.isAttribute("relate_child_id")){
				BIZenic.Validate.valid_survey_relate.setDisable(obj.getAttribute("relate_child_id"));
			}
		}
		obj.disable();
	}
};

BIZenic.Validate.valid_survey_weight = {
	key : "survey_weight",
	uiChange : function (){
		var support = ",tel,number,text,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var validator = BIZenic.Validate.Base.create(BIZenic.Validate["valid_integer"]  , this.parent);
		if(validator != null){
			this.parent.validators[this.parent.validators.length] = validator;
			validator.uiChange();
		}
		var eventListener = new Object();
		eventListener.parent = this.parent;
		eventListener.onEvent = function(){
			var sum = this.parent.parent.elements[this.parent.name + "_weight"];
			var cnt = this.parent.getAttribute("survey_weight");
			if(Number(cnt) == 0 || Number(this.parent.value) ==0){
				sum.value = 1;
			}else{
				sum.value = Number(this.parent.value) / Number(cnt);
			}
		};
		this.parent.addEvent(eventListener);
		return true;
	}
};

BIZenic.Validate.valid_survey_minmax = {
	key : "survey_minmax",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text," ;
		
		var valid_item = document.getElementById("valid_item_" + this.parent.getAttribute("itemorder"));
		// var item_display = document.getElementById("item_" + this.parent.getAttribute("itemorder"));
		// valid_item.innerHTML = "";
		
		if( support.indexOf(","+this.parent.type+",") < 0) return flag ;
		var strMinMax = this.parent.getAttribute("survey_minmax");
		var minMax = strMinMax.split("|");
		var min = this.parent.parent.elements[minMax[0]];
		var max = this.parent.parent.elements[minMax[1]];
		if(min.value == "" && max.value == ""){
			valid_item.innerHTML = '<font color=red><b>' + ECM_SURVEY_MIN + '</b></font>';
			//alert(ECM_SURVEY_MIN);
			min.focus();
			return false;
		}
		if(min.value == "" || max.value == "") return flag;
		if(Number(min.value) > Number(max.value)){
			valid_item.innerHTML = '<font color=red><b>' + ECM_SURVEY_MAX_MIN_UNDER + '</b></font>';
			//alert(ECM_SURVEY_MAX_MIN_UNDER);
			// if(item_display && !item_display.style.display == "none") max.focus();
			return false;
		}
		return flag;
	},
	uiChange : function (){
		var support = ",tel,number,text,";
		if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
		var validator = BIZenic.Validate.Base.create(BIZenic.Validate["valid_integer"]  , this.parent);
		if(validator != null){
			this.parent.validators[this.parent.validators.length] = validator;
			validator.uiChange();
		}
		return true;
	}
};

BIZenic.Validate.valid_survey_progress = {
	key : "survey_progress",
	uiChange : function (){
		var eventListener = new Object();
		eventListener.key = this.key ;
		eventListener.parent = this.parent;
		eventListener.onEvent = function(){
			if(this.parent.disabled) return true ;
			var itemOrder = new Number(this.parent.getAttribute("itemorder"));
			var frm = this.parent.parent ;
			var nextOrders = frm.findOrders(++itemOrder);
			while(nextOrders.length != 0){
				var enable = false ;
				for(var i = 0 ; i < nextOrders.length ; i++){
					if(!nextOrders[i].disabled){
						enable = true;
						break;
					}
				}
				if(enable){
					var item = document.getElementById("item_" + itemOrder);
					if(item != null) item.style.display = "" ;
					break;
				}else{
					var item = document.getElementById("item_" + itemOrder);
					if(item != null) item.style.display = "none" ;
				}
				nextOrders = frm.findOrders(++itemOrder);
			}
		};
		this.parent.addEvent(eventListener);
		return true;
	}
};

BIZenic.Validate.valid_matrix_progress = {
	key : "matrix_progress",
	uiChange : function (){
		var eventListener = new Object();
		eventListener.key = this.key ;
		eventListener.parent = this.parent;
		eventListener.onEvent = function(){
			if(this.parent.disabled) return true ;
			var groupName = this.parent.getAttribute("group");
			var groupNames = groupName.split("_");
			var next = "matrix_" + groupNames[0] + "_" + (Number(groupNames[1]) + 1) + "_" + groupNames[2];
			var matrix = document.getElementById(next);
			if(matrix != null) matrix.style.display = "" ;
		};
		this.parent.addEvent(eventListener);
		return true;
	}
};

BIZenic.Validate.valid_survey_allow = {
	key : "survey_allow",
	validate : function (){
		var flag = true;
		var support = ",tel,number,text," ;
		
		var valid_item = document.getElementById("valid_item_" + this.parent.getAttribute("itemorder"));
		// var item_display = document.getElementById("item_" + this.parent.getAttribute("itemorder"));
		// valid_item.innerHTML = "";

		if( support.indexOf(","+this.parent.type+",") < 0) return flag ;
		var allows = this.parent.getAttribute("survey_allow");
		if(allows.indexOf(","+this.parent.value+",") < 0 ){
			valid_item.innerHTML = '<font color=red><b>' + ECM_SURVEY_MAX_MIN_UNDER + '</b></font>';
			// alert(ECM_COMMON_NO_ALLOW);
			// if(item_display && !item_display.style.display == "none") this.parent.focus();
			return false ;
		}
		return flag;
	}
};

/*2013-07-02 sunmu 다중응답 보기 비활성화기능 추가*/
BIZenic.Validate.valid_instance_disable = {
		key : "instance_disable",
		uiChange : function (){
			var element = this.parent.parent.findAttributeElement("survey_history");
			var support = ",checkbox,";
			if(support.indexOf(","+this.parent.type+",") < 0 ) return false ;
			
			var eventListener = new Object();
			eventListener.elementsList = new Array(),
			eventListener.enableList = new Array(),
			eventListener.parent = this.parent;
			eventListener.history = element;
			eventListener.onEvent = function(){
				if(this.parent.disabled) return true ;
			
				var frm = this.parent.parent ;
				var endcnt = frm.elements.length;
				for (var i = 0; i < endcnt; i++){
					var itemOrder = frm.elements[i].getAttribute("itemorder");
					if(!frm.elements[i].name.startsWith("Q") || itemOrder == null )continue ;
					var elementInfo = this.elementsList["O_"+ itemOrder];
					if(elementInfo == null){
						//elementInfo = {itemOrder : itemOrder, item : [frm.elements[i]], skip : 0, enable : 0, enableInfo : null};
						elementInfo = {itemOrder : itemOrder, item : [frm.elements[i]]};
						this.elementsList["O_"+ itemOrder] = elementInfo ;
						this.elementsList[this.elementsList.length] = elementInfo;
					}else{
						elementInfo.item[elementInfo.item.length] = frm.elements[i];
					}
				}
				
				
				var instance_disable = this.parent.getAttribute("instance_disable");
				if("Y" != instance_disable) return true;

				//var itemorder = this.parent.parent.getAttribute(this.parent.getAttribute("itemorder"));
				var itemorder = this.parent.getAttribute("itemorder");				
				var id = this.parent.getAttribute("id");
				endcnt = this.elementsList.length;
				for(var i = 0; i < endcnt; i++){
					if(this.elementsList[i].itemOrder == itemorder){
						var endcnt2 = this.elementsList[i].item.length;
						for(var j = 0 ; j < endcnt2 ;j++){
					/*		alert("id1 = " + this.elementsList[i].item[j].id + " > " + this.elementsList[i].item[j].type);*/
							if(this.elementsList[i].item[j].id != id){
								if(document.getElementById(id).checked == true && this.elementsList[i].item[j].type == "checkbox"){
									this.elementsList[i].item[j].checked = false;
									this.elementsList[i].item[j].disable();
									this.elementsList[i].item[j].onEvent();
								}else if(document.getElementById(id).checked == false && this.elementsList[i].item[j].type == "checkbox"){
									this.elementsList[i].item[j].enable();
								}
							}
						}
					}
				}
				
				//스킵이 설정된 보기일 경우에 스킵정보를 다시 세팅하도록 함
				if(this.parent.getAttribute("survey_dest")!=null){
					this.history.skip_check.enableChange2(this.parent.getAttribute("group"), this.parent.getAttribute("survey_dest"));
				}
			};
			this.parent.addEvent(eventListener);
			if(this.parent.checked){
				eventListener.onEvent();
			}
			return true;
		}
};

/*
엘리먼트 추가 속성 설명
plain-box : input 박스 스타일 시트 적용
required : 필수 입력 , 화면에 별표시
right : 입력내용을 오른쪽에 표시
filter : 입력 내용을 필터링함
integer : 숫자만 입력 되도록 함
float : 실수만 입력되도록 함
hexa : hexa 만 입력되도록 함
credit_card : 카드 값만 입력 되도록 함
alphabetic : 영문 입력
numeric : 숫자만 입력
alpha_numeric : 영문 숫자 입력
alpha_numeric_underbar : 영문 숫자 언더바 입력
mask : 마스크 작용
money : 통화 입력
dollar : 센트 단위 입력
date : 달력 입력 (date_picker 아님)
psn : 주민번호 입력
csn : 사업자번호 입력
disable_this : 사용 불가 되도록 함
hide_this : 숨김 기능 되도록 함
show_this : 보임 기능 설정
focus_this : 로드시 포커스 기능
readonly_this : 읽기모드로 변경
ime : kor => 한글입력모드, eng => 영문입력모드, engOnly => ime 기능 사용 불가
lable : 라벨형식 보기 기능
minlength : 최소 입력 문자수 체크
minbyte : 최소 바이트 문자수 체크
maxbyte : 최대 바이트 문자수 체크
minvalue : 최소입력 값 체크
maxvalue : 최대입력 값 체크
advanced_email : 확장이메일 체크
email : 이메일 체크
domain : 도메인 체크
q_check : 따옴표, 쌍따옴표 입력 체크
reg_exp : 정규식 체크
is_value : document.form.title => document.form.title 엘리먼트의 값과 비교 체크
trim : 옵션이 없을 경우 입력값을 trim 함, left => 좌측 trim, right => 우측 trim
strip_special_char : 특수문자 제거
strip_white_space : 화이트 스페이스(space, tab)를 전부 제거함
balloon : 풍선 도움말 표시
status_bar : 상태 표시줄 표시
auto_focus : 입력길이 체크 후 다음으로 포커싱 : 미기능
enable_fields : enable_values의 값 또는 체크 될경우 enable_fields가 enable 됨 ex) enable_fields="e_1,e_2,e_3" enable_values="a,b,c" 값이 a, b 또는 c일 경우 부모 form의 e_1,e_2,e_3가 enable 됨
show_fields : enable_fields 와  사용 형식은 같고 엘리먼트들이 show 됨
disable_fields : enable_fields 와  사용 형식은 같고 엘리먼트들이 disable 됨
hide_fields : enable_fields 와  사용 형식은 같고 엘리먼트들이 hide 됨
allow_file : 허용 파일 인지 체크(실행파일은 기본체크), image => gif,jpg,png 허용 , html => htm,html 허용 , text => txt,csv,xls 허용 , multi=> wma,wmv,asf,avi,mpeg 허용, zip=> zip 허용 , ini=> ini 허용
date_check : start_dt , end_dt 입력 값이 있고 end_dt 가 start_dt 보다 빠를 경우 에러 출력
ip : ip 체크

survey_required : 설문 문항 필수 여부 체크
survey_desc : 상세입력을 enable, disable
survey_order : select box 순위 입력
survey_priority : 신규 순위
survey_max_check : check box 최대 최소 갯수
survey_multiple : 다중입력
survey_subject  : 서술입력
survey_delay : 페이지 이동 시간 지연
survey_sum : 합계형
survey_agree : 동의 여부 체크
survey_answer : 앞선응답 표시
survey_weight : 설문 클리닝 가중치
survey_minmax : 최소 최대값 체크
survey_allow : 입력 허용 범위 체크
*/