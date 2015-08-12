var cheerio = require('cheerio'),
	http 	= require("http"),
	request = require('superagent')
;

function log(){
	var args = Array.prototype.slice.call(arguments);
	args.unshift('[qlog] : ');
	console.log.apply(console , args);
}
request
	.get('https://www.baidu.com')
	.set('Accept' , 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
	.set('Accept-Encoding' , 'gzip, deflate, sdch')
	.set('Accept-Language' , 'zh-CN,zh;q=0.8,en;q=0.6')
	.set('Cache-Control' , 'max-age=0')
	.set('Connection' , 'keep-alive')
	.set('Cookie' , 'BDUSS=F5SlItLXQ5N05jOTJYdUFQNkFvelJqZ2t6ZGVSSUtVQU9zNkE2N21DeFRxbHhWQVFBQUFBJCQAAAAAAAAAAAEAAACfpz0OcWluYmluaHVhNjAxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFMdNVVTHTVVSG; BAIDUID=2D667C0E5F6998CE25E2D08A99793B41:FG=1; PSTM=1438883146; BIDUPSID=95A4443745A286A64C7DB5F377F70BF2; .setH_PS_645EC=e3c1MG%2FDtEbHlZYg6OavAnAJ49e6bx3DM2SgelI%2BqD12cC8ubNazfE2Uf9q7dD4lO0rThM4; BD_CK_SAM=1; BDRCVFR[ziPFLVEIFVC](=mk3SLVN4HKm; BD_HOME=1; H_PS_PSSID=14665_1458_16730_12868_16520_16800_16425_16515_15584_12101_13932_13618_16720; BD_UPN=123353')
	.set('Host' , 'www.baidu.com')
	.set('User-Agent' , 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36')
	.end(function(err, res){
		data = res.text
		$ = cheerio.load(data);
		log($('title').text())
	});