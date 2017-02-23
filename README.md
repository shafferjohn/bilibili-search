# bilibili-search
用于查询bilibili匿名弹幕发送者

Author: Shaffer John

Homepage: [shaffer.cn](http://www.shaffer.cn)

License: MIT

### Details
**0x00.** 请求视频url，解析html，获取cid
>以`http://www.bilibili.com/video/av120040/`为例，
>得到cid=201284

**0x01.** 根据cid，请求对应的弹幕信息xml
>xml uri格式：
>`http://comment.bilibili.com/{cid}.xml`

**0x02.** 解析xml，获取用户hash
```xml
<d p="58.94100189209,1,25,16777215,1467741402,0,821dc992,2042909821">什么都没发生</d>
<d p="27.27499961853,1,25,10066329,1467763756,0,f7f9b934,2043204641">弹幕测试</d>
<d p="8.6370000839233,1,25,16777215,1486832260,0,338f1b31,2993002030">test</d>
```
*reference for*
```xml
<d p="弹幕出现时间,模式,字体大小,颜色,发送时间戳,弹幕池,用户Hash,数据库ID">弹幕内容</d>
```

**0x03.** 生成哈希表，反查用户id

[BiliBili_crc2mid](https://github.com/esterTion/BiliBili_crc2mid)
