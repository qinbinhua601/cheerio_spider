"use strict"
var cheerio = require('cheerio'),
	http 	= require("http"),
	request = require('superagent'),
	http = require('http'),
	rf = require("fs")


var TARGET_URL = 'http://www.fixsub.com/portfolio/%E9%80%83%E8%B7%91%E5%8F%AF%E8%80%BB%E4%BD%86%E6%9C%89%E7%94%A8'

function log(){
	var args = Array.prototype.slice.call(arguments)
	args.unshift('[qlog] : ')
	console.log.apply(console , args)
}

var cachedData = {
	data: '',
	expire: null
}
function getData(cb) {
	var now = Date.now()
	log(now)
	if (cachedData.data && ( now < cachedData.expire )) {
		log('from cached')
		cb && cb(cachedData.data)
	} else {
		log('no cached')
		request
			.get(TARGET_URL)
			.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
			.set('Accept-Encoding', 'gzip, deflate, sdch')
			.set('Accept-Language', 'zh-CN,zh;q=0.8,en;q=0.6')
			.set('Cache-Control', 'max-age=0')
			.set('Connection', 'keep-alive')
			.set('Cookie', '__cfduid=da09fc79ccadfc4e11380c938917e6d9a1479908612; Hm_lvt_af75f52bfdd411d166c23dc7aa879aa5=1479908519;setHm_lpvt_af75f52bfdd411d166c23dc7aa879aa5=1479908519; wfvt_2976803517=58359d0618404')
			.set('Host', 'www.fixsub.com')
			.set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4')
			.end(function(err, res){
				var data = res.text
				var $ = cheerio.load(data)
				// console.log(data)
				var arr = [];
				var now = new Date()
				var y = now.getFullYear()
				var m = now.getMonth() + 1
				var d = now.getDate()
				var date = ''+ y +'-' + m + '-'+ d +''


				var title = $('#full-width .content-page-title').text()

				var download_source = '磁力下载'

				var result = '<div class="box"><div class="titlebar"><h2>'+ title +'</h2></div><div class="content"><span>'
				$('#full-width .content-box > div a').each(function(i,item){
					var text = $(item).text()
					if(text === download_source) {
						arr.push($(item).attr('href'))
					}
				});
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i]
					// console.log(item)
					result = result + '<b>' + '第' + (i + 1) +'集 ' + '<a href="'+ item +'" target="_blank">' + download_source + '</a></b>'
				}

				result = result + '</span></div></div>'

				cachedData.data = result;
				cachedData.expire = now + 60 * 1000 * 5;
				log('expire: ' + cachedData.expire)
				cb && cb(cachedData.data)
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
	else if(/\/js\/(\w+).js/.test(req.url)) {
		res.writeHead(200,{"Content-Type":"application/x-javascript"})
		rf.readFile(req.url.substr(1),'utf-8',function(err, data) {
			res.write(data)
			res.end()
		})
	}
	else{
		getData(function(result){
		    console.log('Request received');
		    res.writeHead(200,{"Content-Type":"text/html"});
		    res.write('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>电视剧下载</title><link rel="stylesheet" href="css/style.css" /></head><body><canvas id="canvas" style="height:200px">当前浏览器不支持Canvas，请更换浏览器后再试</canvas><div class="container">')
		    res.write(result);
		    res.write('</div><script src="js/digit.js"></script><script src="js/countdown.js"></script></body></html>')
		    res.end()
		})
	}
}

http.createServer(onRequest).listen(8888);
log('server started on port : 8888')