//카카오톡 공유하기 자바스크립트 키값 세팅
//https://developers.kakao.com/ 에서 키값 발급 필요
Kakao.init("5ea7c35c641087250a63564a3d2842d1");

//공유하기
function shareSns($snsType,$title,$image,$description) {
	var $protocol = location.protocol,
		$href = location.href,
		$width = 500,
		$url = encodeURIComponent($href);

	if($title == null || $title == undefined)$title = $('meta[property="og:title"]').attr("content");
	if($image == null || $image == undefined)$image = $('meta[property="og:image"]').attr("content");
	if($description == null || $description == undefined)$description = $('meta[property="og:description"]').attr("content");
		
	switch ($snsType) {
		case "facebook":
			$href = "//www.facebook.com/sharer/sharer.php?u=" + $url;
			break;
		case "twitter":
			$href = "//twitter.com/intent/tweet?url=" + $url + " text=" + $title;
			break;
		case "naver_blog":
			$href = "//blog.naver.com/openapi/share?url=" + $url + " title=" + $title;
			break;
		case "google_plus":
			$href = "//plus.google.com/share?url=" + $url;
			$width = 400;
			break;
		case "pinterest":
			$href = "//pinterest.com/pin/create/button/?url=" + $url + " description=" + $title + " media=" + $image;
			break;
		case "kakao_story":
			$href = "//story.kakao.com/share?url=" + $url;
			break;
		case "kakao_talk":
			Kakao.Link.sendDefault({
				objectType: "feed",
				content: {
					title: $title,
					imageUrl: $image,
					link: {
						mobileWebUrl: $url,
						webUrl: $url
					}
				},
				buttons: [{
					title: "웹으로 보기",
					link: {
						mobileWebUrl: $url,
						webUrl: $url
					}
				}]
			});
			break;
	}
	"kakao_talk" !== $snsType && window.open($protocol + $href, $snsType + "sns_share", "scrollbars=1,width=" + $width + ",height=500,menubar=0,resizable=0");
}