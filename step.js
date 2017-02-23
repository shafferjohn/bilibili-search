/**
 * bilibili 弹幕查询
 * @author  Shaffer John
 * @date    2016-2-23 11:40:36
 * @version 1.0.0
 */
/**
 * CSS3 答题卡翻页效果 jQuery Transit 
 * @authors Candice <286556658@qq.com>
 * @date    2016-9-27 15:30:18
 * @version 1.0.8
 */
$.fn.stepSheet = function (options) 
{
    var defaults = {
        mold : 'card', 
    };
    var opts = $.extend({}, defaults, options);
    return $(this).each(function () {
        var obj = $(this).find('.card_cont');
        var _length = obj.length, _b = _length - 1, _len = _length - 1, _cont = '.card_cont';
        for (var a = 1; a <= _length; a++) {
            obj.eq(_b).css({
                'z-index' : a
            });
            _b -= 1;
        }
        $(this).show();
        if (opts.mold == 'card')
        {

            $('#step1').click(function ()
            {
                var video_url = $("#search-keyword").val();
                var table = $("#table");

                var check=video_url.split("/");
                for (var i = check.length - 1; i >= 0; i--) {
                	if(check[i].indexOf('av') >= 0 && !isNaN(parseInt(check[i].replace('av','')))){
                		var av = check[i].replace('av','');
                		console.log('av',av);
                	}
                };

                $.ajax({  
                    type : "GET",  
                    url : 'api.php?av='+av,  
                    dataType : "json",
                    success : function(json) {
                    	var len = json.length;
                    	for (var i = 0; i < len; i++) {
                    		var data = json[i]['p'].split(',');
                    		var time = formatSeconds(data[0]).toString();
                    		var userHash = data[6].toString();
                    		var html = '<tr><td class="p50">'+json[i]['#text']+'</td><td class="p25">'+time+'</td><td class="p25"><a class="hash_'+userHash+'" href="javascript:;" target="_blank" onclick="getUser(\''+userHash+'\');return false;">查询</a></td></tr>'
                    		table.append(html);
                    	};
                    	
                        $("#tbody").show();
                        $("#message").hide();
                    },  
                    error : function(jqXHR) {  
                        $("#tbody").html('视频cid获取失败，可能视频被删了，也可能服务器出了点小差...请联系站长~')
                    }  
                });
            });

            obj.find('.search-submit').click(function ()
            {
                var _idx = $(this).parents(_cont).index(), _cards = obj, _cardcont = $(this).parents(_cont);
                if (_idx == _len) {
                    return;
                }
                else
                {
                    setTimeout(function ()
                    {
                        _cardcont.addClass('cardn');
                        setTimeout(function ()
                        {
                            _cards.eq(_idx + 3).addClass('card3');
                            _cards.eq(_idx + 2).removeClass('card3').addClass('card2');
                            _cards.eq(_idx + 1).removeClass('card2').addClass('card1');
                            _cardcont.removeClass('card1');
                        }, 200);
                    }, 100);
                }
            });

            $('.card_bottom').find('.prev').click(function ()
            {
                var _idx = $(this).parents(_cont).index(), _cardcont = $(this).parents(_cont);
                obj.eq(_idx + 2).removeClass('card3').removeClass('cardn');
                obj.eq(_idx + 1).removeClass('card2').removeClass('cardn').addClass('card3');
                obj.eq(_idx).removeClass('card1').removeClass('cardn').addClass('card2');
                setTimeout(function ()
                {
                    obj.eq(_idx - 1).addClass('card1').removeClass('cardn');
                }, 200);
            });

            $('.card_bottom').find('.next').click(function ()
            {
                var _idx = $(this).parents(_cont).index(), _cards = obj, _cardcont = $(this).parents(_cont);
                if (_idx == _len) {
                    return;
                }
                else
                {
                    setTimeout(function ()
                    {
                        _cardcont.addClass('cardn');
                        setTimeout(function ()
                        {
                            _cards.eq(_idx + 3).addClass('card3');
                            _cards.eq(_idx + 2).removeClass('card3').addClass('card2');
                            _cards.eq(_idx + 1).removeClass('card2').addClass('card1');
                            _cardcont.removeClass('card1');
                        }, 200);
                    }, 100);
                }
            });

        }
    });

	function formatSeconds(second) { 
		var sec = parseInt(second);
		var min = 0;
		var hour = 0;
		var result = "";
		if(sec >= 60) {
			min = parseInt(sec/60);
			sec = parseInt(sec%60);
			if(min > 60) {
				hour = parseInt(min/60);
				min = parseInt(min%60);
			}
		}
		if(hour) result = hour+":"+f(min)+":"+f(sec);
		else result = f(min)+":"+f(sec);
		return result;
	}
	function f(s) {
        return s < 10 ? '0' + s: s;
    }
};

function getUser(hash){
	var hash = hash.toString();
	var midcrc = new BiliBili_midcrc();
	var result = midcrc(hash);
	var obj = $(".hash_"+hash);
    if (result){
        obj.text('已查到');
        obj.removeAttr('onclick');
        obj.attr('href','http://space.bilibili.com/'+result);
    }else{
        obj.text('用户不存在');
    }
	
}