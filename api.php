<?php
// bilibili 弹幕查询
// author  Shaffer John
// date    2016-2-23 11:54:01
// version 1.0.0
error_reporting(0);

if(!isset($_GET['av']) || !$_GET['av'])
	exit(json_encode(array('status' => 401, 'msg' => 'parameter error')));
$av = (string) intval(urlencode($_GET['av']));

$video_url = 'http://www.bilibili.com/video/av'.$av.'/?tg';
$video_html = curl_request($video_url, true);

$pattern = '/cid=(.*?)&aid/is';
preg_match_all($pattern, $video_html, $matches);

$cid = $matches[1][0];

$tanmu_url = 'http://comment.bilibili.com/'.$cid.'.xml';
$tanmu_xml = curl_request($tanmu_url, true);

$dom = new DOMDocument();
$dom->loadXML($tanmu_xml);

print json_encode(getArray($dom->documentElement)['d']);

function getArray($node) {
  $array = false;

  if ($node->hasAttributes()) {
    foreach ($node->attributes as $attr) {
      $array[$attr->nodeName] = $attr->nodeValue;
    }
  }

  if ($node->hasChildNodes()) {
    if ($node->childNodes->length == 1) {
      $array[$node->firstChild->nodeName] = getArray($node->firstChild);
    } else {
      foreach ($node->childNodes as $childNode) {
      if ($childNode->nodeType != XML_TEXT_NODE) {
        $array[$childNode->nodeName][] = getArray($childNode);
      }
    }
  }
  } else {
    return $node->nodeValue;
  }
  return $array;
}


function curl_request($url, $gzip=false, $post = '', $cookie_file = '', $fetch_cookie = 0, $referer = '', $timeout = 10) {
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_HTTPHEADER, array("Expect:"));
	curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)');
	curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt($curl, CURLOPT_AUTOREFERER, 1);
	curl_setopt($curl, CURLOPT_REFERER, $referer);
	if($gzip) curl_setopt($curl, CURLOPT_ENCODING, "gzip"); // 开启gzip
	if ($post) {
		curl_setopt($curl, CURLOPT_POST, 1);
		curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($post));
	}
	if ($fetch_cookie) {
		curl_setopt($curl, CURLOPT_COOKIEJAR, $cookie_file);
	} else {
		curl_setopt($curl, CURLOPT_COOKIEFILE, $cookie_file);
	}
	curl_setopt($curl, CURLOPT_HEADER, 0);
	curl_setopt($curl, CURLOPT_TIMEOUT, $timeout);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	$data = curl_exec($curl);
	if (curl_errno($curl)) {
		return false;
	}
	return $data;
}
?>