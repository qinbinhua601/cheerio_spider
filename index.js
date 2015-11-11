"use strict"
var cheerio = require('cheerio'),
	http 	= require("http"),
	request = require('superagent'),
	http = require('http'),
	rf = require("fs")

function log(){
	var args = Array.prototype.slice.call(arguments)
	args.unshift('[qlog] : ')
	console.log.apply(console , args)
}

var cachedData;
function getData(cb) {
	if (cachedData) {
		log('from cached')
		cb && cb(cachedData)
	} else {
		log('no cached')
		request
			.get('http://www.zhibo8.cc/nba/luxiang.htm')
			.set('Accept' , 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
			.set('Accept-Encoding' , 'gzip,deflate')
			.set('Accept-Language' , 'zh-CN')
			.set('Cache-Control' , 'max-age=0')
			.set('Connection' , 'keep-alive')
			.set('Cookie' , 'bdshare_firstime=1446263591987; CNZZDATA5642869=cnzz_eid%3D376350549-1446268239-http%253A%252F%252Fwww.zhibo8.cc%252F%26ntime%3D1446268239; BAIDU_DUP_lcr=https://www.baidu.com/link?url=JST7uYIeblh_GvnOVMZUyh8Dxlrf_s8_zwV7LlkWv3W&wd=&eqid=db3350b9000023b700000003564223b1; CNZZDATA709406=cnzz_eid%3D1278675408-1446262447-null%26ntime%3D1447172836; CNZZDATA5642867=cnzz_eid%3D2032041784-1446262524-http%253A%252F%252Fwww.zhibo8.cc%252F%26ntime%3D1447173981')
			.set('Host' , 'www.zhibo8.cc')
			.set('User-Agent' , 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Maxthon/4.4.6.2000 Chrome/30.0.1599.101 Safari/537.36')
			.end(function(err, res){
				var data = res.text
				var result = ''
				var $ = cheerio.load(data)
				var nodes = $('#left > .box').slice(0,3)
				for (var i = 0; i < nodes.length; i++) {
					var node = nodes.eq(i)
					var base = 'http://www.zhibo8.cc/'
					result = result + '<div class="box">' + node.html().replace(/href="\//g,'href="' + base).replace(/\|/g,'') + '</div>'
				};
				cachedData = result
				cb && cb(cachedData)
			})
	}
}

function onRequest (req,res) {
	console.log(req.url)
	if(req.url === '/css/style.css'){
		console.log('css request received');
		res.writeHead(200,{"Content-Type":"text/css"})
		rf.readFile("css/style.css",'utf-8',function(err, data) {
			res.write(data)
			res.end()
		})
	}
	else{
		getData(function(result){
		    console.log('Request received');
		    res.writeHead(200,{"Content-Type":"text/html"});
		    res.write('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>直播吧比赛录像</title><link rel="stylesheet" href="css/style.css" /></head><body>')
		    res.write(result);
		    res.write('</body></html>')
		    res.end()
		})
	}
}

http.createServer(onRequest).listen(8888);
log('server started on port : 8888')