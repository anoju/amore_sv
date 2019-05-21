
if (BIZenic == null) var BIZenic = {};
BIZenic.DatePicker = {
	input : null ,
	inputYear : null ,
	inputMonth : null ,
	inputDate : null ,
	year : null ,
	month : null ,
	date : null ,
	monthFullDate : null ,
	monthFirstDate : null ,
	DPContainer : null ,
	create : function (){
		if(document.getElementById("DPContainer") == null){
			var str = '<div id="DPContainer" style="position: absolute; top: 200px; left: 100px; display:none;z-index:1001">';
			str += ('<IFRAME id="DP_IFRAME" name="DP_IFRAME" width="286" height="303" src="../../common/inc/date_picker.jsp?sessID='+TAGSESID+'" scrolling="no" frameborder="no" border="0"></IFRAME>') ;
			str += '</div>';
			var parentElement = document.createElement("span");
			parentElement.innerHTML = str ;
		    var element = parentElement.firstChild || null;
		    document.body.appendChild(element);
			if (document.attachEvent){
				document.attachEvent("onclick" , this.onclick);
			}else if (document.addEventListener){ 
				document.addEventListener("click", this.onclick, false); 
			}
			this.DPContainer = document.getElementById("DPContainer");
			

		}
	},
	onclick : function (evt){
		var evt = (window.event) ? window.event : evt;
		var element = evt.srcElement ? evt.srcElement : evt.target
		if (element.tagName == "INPUT" && (element.id == "dp" || element.id == "dp_start" || element.id == "dp_end" || element.isAttribute("date"))) {
		    BIZenic.DatePicker.openPicker(element);
		} else {
			BIZenic.DatePicker.disablePicker();
		}
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
	},
	openPicker :function (input)	{
		//���� ��
		var yearOptions = DP_IFRAME.document.getElementById("calendar_year");
		yearOptions.options.length = 0;
		var selDate = new Date();
   		var calyear = selDate.getYear()+ (selDate.getYear() < 1900 ? 1900 : 0 ) ;
   		for(var i = 0; i <= 5; i++){
   			yearOptions.options[i] = new Option(calyear - (5-i), calyear - (5-i));
   		}
   		for(var i = 1 ; i <= 10; i++){
   			yearOptions.options[i+5] = new Option(calyear  + i, calyear + i);
   		}
	    var top = document.body.clientTop + this.ObjectTop(input);
	    var left = document.body.clientLeft + this.ObjectLeft(input);
		// �ㅽ겕由곗쓽 1/2 �꾨?�履?�씪 寃쎌??�щ젰���꾩?����?���섎룄濡��?�린 �꾪�?���吏�슦吏�留먯�?二쇱?���?
		if(window.screen.height / 2 < top) top = top - 290;
	    this.input = input;
	    if(this.DPContainer.style.pixelTop){
		    this.DPContainer.style.pixelTop = top + input.offsetHeight;
		}else{
			this.DPContainer.style.top = top + input.offsetHeight + "px";;
		}
		if(this.DPContainer.style.pixelLeft){
		    this.DPContainer.style.pixelLeft = left;		
		}else{
			this.DPContainer.style.left = left + "px";
		}
	    this.DPContainer.style.display = '';
	    var inputValue = new Date();
	    if (this.input.value.match(/(\d{4})-(\d{2})-(\d{2})/)){
	        inputValue = new Date(Number(RegExp.$1), Number(RegExp.$2) - 1, Number(RegExp.$3));
	    }
	    this.setDate(inputValue);
	},
	disablePicker :function (){
	    this.input = null;
	    this.DPContainer.style.pixelTop = 0;
	    this.DPContainer.style.pixelLeft = 0;
	    this.DPContainer.style.display = 'none';
	},
	setDate : function (selDate){
		if(selDate == null) selDate = new Date();
   		this.inputYear = selDate.getYear()+ (selDate.getYear() < 1900 ? 1900 : 0 ) ;
		this.inputMonth = selDate.getMonth() + 1;
		this.inputDate = selDate.getDate();
		
		this.year = selDate.getYear()+ (selDate.getYear() < 1900 ? 1900 : 0 ) ;
		this.month = selDate.getMonth() + 1;
		this.date = selDate.getDate();
		this.refresh();
	},
	refresh : function (){
		var AllDates = Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
		this.monthFullDate = AllDates[this.month - 1];
		if ((this.month == 2) && ((this.year % 4) == 0)){
			if ((this.year % 100) != 0){
				this.monthFullDate = 29;
			}else if((this.year % 400) == 0){
				this.monthFullDate = 29;
			}
		}
		var FirstDate = new Date(this.year, (this.month -1), 1);
		this.monthFirstDate = FirstDate.getDay();

		var scalendar_ym = String(this.year) + " / " + String((this.month < 10 ? "0" : "" ) + this.month);
		
		var sCalendar_Dates = "";
		sCalendar_Dates += '<table border="0" align="center" cellpadding=0 cellspacing="0">';
		sCalendar_Dates += '<tr class="calendar_week"> ';
		sCalendar_Dates += '  <td align=center style="color:#e9292a;">SUN</td> ';
		sCalendar_Dates += '  <td align=center>MON</td> ';
		sCalendar_Dates += '  <td align=center>THE</td> ';
		sCalendar_Dates += '  <td align=center>THR</td> ';
		sCalendar_Dates += '  <td align=center>THU</td> ';
		sCalendar_Dates += '  <td align=center>FRI</td> ';
		sCalendar_Dates += '  <td align=center style="color:#006fbb;">SAT</td> ';
		
		nCalendar_Key = 1;

		sCalendar_Dates += "<tr>\n";
		for (var i=0;i < this.monthFirstDate;i++){
			sCalendar_Dates += "<td class=calendar_day></td>\n";
			if ((nCalendar_Key % 7) == 0){
				sCalendar_Dates += "</tr>\n";
				sCalendar_Dates += "<tr>\n";
			}
			nCalendar_Key += 1;
		}

		for (var i=1;i < (this.monthFullDate + 1); i++){
			var sDate = (i< 10 ? "0" : "" ) + String(i);

			sCalendar_Dates += "<td class=";
			        // ��???�꾩?����??�� �섏?��?�씠��
			if ((this.inputYear == this.year) && (this.inputMonth == this.month) && (this.inputDate == i)){
				sCalendar_Dates += "calendar_day_selected";
			}else{
				sCalendar_Dates += "calendar_day_button";
			}
			sCalendar_Dates += " onclick=";
			sCalendar_Dates += "\"parent.BIZenic.DatePicker.selectDate(\'";
			sCalendar_Dates += i;
			sCalendar_Dates += "\')\"";
			
			sCalendar_Dates += ">";
			sCalendar_Dates += sDate;
			sCalendar_Dates += "</td>\n"

			if ((nCalendar_Key % 7) == 0){
				sCalendar_Dates += "</tr>\n";
				sCalendar_Dates += "<tr>\n";
			}
			nCalendar_Key += 1;
		}
		for (var i=0;i < (42 - this.monthFirstDate  - this.monthFullDate);i++){
			sCalendar_Dates += "<td class=calendar_day></td>\n";

			if ((nCalendar_Key % 7) == 0){
				sCalendar_Dates += "</tr>\n";
			}
			nCalendar_Key += 1;
		}

		sCalendar_Dates += "</tr>";
		sCalendar_Dates += "	</table></td>";

		DP_IFRAME.document.getElementById('calendar_year').value = String(this.year);
		DP_IFRAME.document.getElementById('calendar_month').value = String((this.month < 10 ? "0" : "" ) + this.month);
		
		//DP_IFRAME.document.getElementById('calendar_ym').innerHTML = scalendar_ym;
		DP_IFRAME.document.getElementById('calendar_date').innerHTML = sCalendar_Dates;

	},
	setCalender : function (nSelectYearORMonth, nIncrease){
		switch (nSelectYearORMonth){
			case 0 :
				this.settingYear(nIncrease);     // �꾩??利앷�?�몄??
				break;
			case 1 :
				this.settingMonth(nIncrease);    // �붿??利앷�?�몄??
				break;
			case 9 :
				break;
			default :
				alert("?");
				break;
		}
		this.refresh();
	},
	settingYear : function (nIncrease){
		if ((nIncrease < 0) && (this.year <= 1980)){
			this.year = 2099;
		}else if((nIncrease > 0) && (this.year >= 2099)){
			this.year = 1980;
		}else{
			this.year += nIncrease;
			return true;
		}
	},
	settingMonth : function (nIncrease){
		var bYearStatus;
		if ((this.month == 12) && (nIncrease > 0)){
			bYearStatus = this.settingYear(1);
			if(bYearStatus == true)
				this.month = 1;
		}else if ((this.month == 1) && (nIncrease < 0)){
			bYearStatus = this.settingYear(-1);
			if(bYearStatus == true)
				this.month = 12;
		}else{
			this.month += nIncrease;
		}
	},
	setMonth : function (value){
		this.month = Number(value);
		this.refresh();
	},
	setYear : function (value){
		this.year = Number(value);
		this.refresh();
	},
	remove_Dash : function (dashVal){
		var tmp = dashVal;
		return tmp.replace(/-/g,""); 
	},
	selectDate :function(date){
		this.date = (date == null ? 1 : date)
		var seldate = String(this.year)+"-"+ (this.month < 10 ? "0" : "") + this.month +"-"+ (this.date < 10 ? "0" : "") + this.date;
	    if (this.input != null){
	    	if(this.input.id == "dp_start" || this.input.id == "dp_end"){
	    		var start_dt ;
	    		var end_dt ;
				if (this.input.id == "dp_start"){
					start_dt = seldate;
					end_dt = document.getElementById("dp_end").value;
					if ( end_dt != "" && (this.remove_Dash(start_dt) > this.remove_Dash(end_dt))  ) {
						alert(ECM_CALENDAR_AFTER_END_DT); 
						return ;
					}
				}else if (this.input.id == "dp_end"){
					start_dt = document.getElementById("dp_start").value;
					end_dt = seldate;
					if ( start_dt != "" && (this.remove_Dash(start_dt) > this.remove_Dash(end_dt))  ) {
						alert(ECM_CALENDAR_BEFORE_START_DT); 
						return ;
					}
				}
				this.input.value = seldate;
				this.disablePicker();
			}else if(this.input.id == "dp" || this.input.isAttribute("date")){
				this.input.value = seldate;
				this.disablePicker();
			}
		}
	}
};
