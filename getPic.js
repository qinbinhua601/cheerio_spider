"use strict"
var cheerio = require('cheerio'),
    http    = require("http"),
    request = require('superagent'),
    http = require('http'),
    rf = require("fs"),
    iconv = require('iconv-lite');

function log(){
    var args = Array.prototype.slice.call(arguments)
    args.unshift('[qlog] : ')
    console.log.apply(console , args)
}

function getUrls(url, cb) {
    var path = 'imgs/' + url.split('/').pop().split('.')[0]
    rf.mkdir(path,777,function(err){
        var isError = true
        if (err) {
            if(err.code === 'EEXIST'){
                isError = false
            }
        } else {
            isError = false
        }
        if(!isError){
            request(url, function(err, res, body) {
                if(err){log(err); return}
                var urls = []
                var $ = cheerio.load(res.text, {decodeEntities: false})
                $('.content-page > a').each(function(index, item){
                    var url = base + item.attribs.href;
                    urls.push(url)
                });
                log(urls)
                cb && cb(urls, path)
            })
        } else {
            log('error')
        }
    })
}

var data = []
function getData(url, path) {

    request(url, function (err, res, body) {  
        if(err){log(err); return}
        var $ = cheerio.load(res.text, {decodeEntities: false})
        // var result = '<ul>'
        $('.content-pic img').each(function(index, item){
            var imgUrl = item.attribs.src
            var name = imgUrl.split('/').pop()
            var imgPath = path + '/'
            log(imgUrl)
            log(imgPath)
            // request(imgUrl).pipe(rf.createWriteStream(imgPath))
            saveImg(imgUrl,imgPath,name)
            // result += '<li><img src="'+ imgPath +'" alt="" /></li>'
        })
        // result += '</ul>'
    })
}

function getOnePagePics(urls){
    for (var i = 0; i < urls.length; i++) {
        var url = urls[i]
        request(url, function (err, res, body) {  
            if(err){log(err); return}
            var $ = cheerio.load(res.text, {decodeEntities: false})
            $('.list-left dd').filter(function(i, el) {
              return $(this).attr('class') !== 'page';
            }).find('> a').each(function(index, item){
                var url = item.attribs.href
                log(url)
                getUrls(url, function(urls, path){
                    for (var i = 0; i < urls.length; i++) {
                        var item = urls[i]
                        getData(item, path)
                    };
                })
            })
        })
    };
}


function startGetting(url) {
    var b = url
    getUrls(url, function(urls, path){
        for (var i = 0; i < urls.length; i++) {
            var item = urls[i]
            getData(item, path)
        };
    })
    request(url, function (err, res, body) {  
        if(err){log(err); return}
        var $ = cheerio.load(res.text, {decodeEntities: false})
        $('.list-left dd.page > a').each(function(index, item){
            var url = b.split('/').slice(0,-1).join('/') + '/' + item.attribs.href
            getOnePagePics(url)
            log(url)
        })
    })
}

function saveImg(url, dir,name){
    http.get(url, function(res){
        res.setEncoding('binary');
        var data='';
        res.on('data', function(chunk){
            data+=chunk;
        });
        res.on('end', function(){
            rf.writeFile(dir + "/"+name, data, 'binary', function (err) {
                if (err) throw err;
                console.log('file saved '+name);
            });
        });
    }).on('error', function(e) {
        console.log('error'+e)
    });
}
// entry point
// var base = 'http://www.mm131.com/mingxing/'
// var base = 'http://www.mm131.com/qipao/'
var base = 'http://www.mm131.com/chemo/'
// var base = 'http://www.mm131.com/xiaohua/'
// var base = 'http://www.mm131.com/qingchun/'
// var base = 'http://www.mm131.com/xinggan/'
// var url = base + 'index.html'
// startGetting(url)
getOnePagePics(['http://www.mm131.com/mingxing/list_5_3.html'])
// getOnePagePics([
//     'http://www.mm131.com/chemo/index.html',
//     'http://www.mm131.com/chemo/list_3_2.html',
//     'http://www.mm131.com/chemo/list_3_3.html',
//     'http://www.mm131.com/chemo/list_3_4.html',
//     'http://www.mm131.com/chemo/list_3_5.html',
// ])
// function onRequest (req,res) {
//     console.log(req.url)
//     if(req.url === '/css/style2.css'){
//         console.log('css request received');
//         res.writeHead(200,{"Content-Type":"text/css"})
//         rf.readFile("css/style2.css",'utf-8',function(err, data) {
//             res.write(data)
//             res.end()
//         })
//     }
//     else{
//         getData(function(result){
//             console.log('Request received');
//             res.writeHead(200,{"Content-Type":"text/html"});
//             res.write('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>图片</title><link rel="stylesheet" href="css/style2.css" /></head><body>')
//             res.write(result);
//             res.write('</body></html>')
//             res.end()
//         })
//     }
// }

// http.createServer(onRequest).listen(8888);
// log('server started on port : 8888')