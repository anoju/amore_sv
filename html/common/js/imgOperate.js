<!--
function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function MM_reloadPage(init) {  //reloads the window if Nav4 resized
  if (init==true) with (navigator) {if ((appName=="Netscape")&&(parseInt(appVersion)==4)) {
    document.MM_pgW=innerWidth; document.MM_pgH=innerHeight; onresize=MM_reloadPage; }}
  else if (innerWidth!=document.MM_pgW || innerHeight!=document.MM_pgH) location.reload();
}
MM_reloadPage(true);

function MM_showHideLayers() { //v6.0
  var i,p,v,obj,args=MM_showHideLayers.arguments;
  for (i=0; i<(args.length-2); i+=3) 
	  if ((obj=MM_findObj(args[i]))!=null) { 
		v=args[i+2];
		if (obj.style) { 
			obj=obj.style; 
			v=(v=='show')?'visible':(v=='hide')?'hidden':v; 
		}
		obj.visibility=v; 
	}
}


//20081020(yhkim) - 다른 대메뉴 선택 시 현재 선택되어 있는 대메뉴와 서브메뉴 레이어를 hidden 시킨다
function MM_HideCurLayer() {
	var arr_div = document.getElementsByTagName("div");
	var arr_img = document.getElementsByTagName("img");

	for(var i=0; i<arr_div.length; i++) {
		if(arr_div[i].id.substring(0,3) == "ID_" && arr_div[i].style.visibility == "visible") {
			arr_div[i].style.visibility = "hidden";
		}
	}

	for(var i=0; i<arr_img.length; i++) {
		if(arr_img[i].src.indexOf("/common/image/topmenu_") > -1 && arr_img[i].src.indexOf("over.gif") > -1) {
			tmp_img = arr_img[i].src;
			arr_img[i].src = tmp_img.substring(0, arr_img[i].src.indexOf("_over.gif")) + ".gif";
		}
	}
}

//-->