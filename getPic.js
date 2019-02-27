"use strict"
var cheerio = require('cheerio'),
    http    = require("http"),
    request = require('superagent'),
    http = require('http'),
    rf = require("fs"),
    URL = require('url'),
    path = require('path'),
    iconv = require('iconv-lite');

function log(){
    var args = Array.prototype.slice.call(arguments)
    args.unshift('[qlog] : ')
    console.log.apply(console , args)
}

function getUrls(url, cb) {
    var path = 'imgs/' + main_folder + url.split('/').pop().split('.')[0]
    if (rf.existsSync(path)) {
        console.log(`${path} existed`);
        return
    }
    rf.mkdir(path, { recursive: true },function(err){
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
            saveImg(imgUrl,imgPath,name, url)
            // result += '<li><img src="'+ imgPath +'" alt="" /></li>'
        })
        // result += '</ul>'
    })
}

function getOnePagePics(urls){
    console.log(urls)
    for (var i = 0; i < urls.length; i++) {
        var url = urls[i]
        request(url, function (err, res, body) {  
            if(err){log(err); return}
            var $ = cheerio.load(res.text, {decodeEntities: false})
            $('.list-left dd').filter(function(i, el) {
              return $(this).attr('class') !== 'page';
            }).find('> a').each(function(index, item){
                var url = item.attribs.href
                debugger
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

function saveImg(url, dir, name, referer) {
    var opt = URL.parse(url);
    var options = {
        hostname: opt.hostname,
        host: opt.hostname,
        path: opt.path,
        headers: {
            Referer: referer,
        }
    };
    http.get(options, function(res){
        res.setEncoding('binary');
        var data='';
        res.on('data', function(chunk){
            data+=chunk;
        });
        res.on('end', function(){
            rf.writeFile(path.resolve('.', dir, name), data, 'binary', function (err) {
                console.log(path.resolve('.', dir, name))
                if (err) throw err;
                console.log('file saved '+name);
            });
        });
    }).on('error', function(e) {
        console.log('error'+e)
    });
}
// entry point
// var base = 'http://www.mm131.com/chemo/'
// var base = 'http://www.mm131.com/mingxing/'
// var base = 'http://www.mm131.com/qipao/'
// var base = 'http://www.mm131.com/xiaohua/'```
// var base = 'http://www.mm131.com/qingchun/'
var base = 'http://www.mm131.com/xinggan/'
// var url = base + 'index.html'

var main_folder = base.split('http://www.mm131.com/')[1]
// startGetting(url)

// getOnePagePics([
//     'http://www.mm131.com/chemo/index.html',
//     'http://www.mm131.com/chemo/list_3_2.html',
//     'http://www.mm131.com/chemo/list_3_3.html',
//     'http://www.mm131.com/chemo/list_3_4.html',
//     'http://www.mm131.com/chemo/list_3_5.html',
// ])

// getOnePagePics([
//     'http://www.mm131.com/mingxing/index.html',
//     'http://www.mm131.com/mingxing/list_5_2.html',
//     'http://www.mm131.com/mingxing/list_5_3.html',
//     'http://www.mm131.com/mingxing/list_5_4.html',
//     'http://www.mm131.com/mingxing/list_5_5.html',
//     'http://www.mm131.com/mingxing/list_5_6.html',
//     'http://www.mm131.com/mingxing/list_5_7.html',
//     'http://www.mm131.com/mingxing/list_5_8.html',
// ])


getOnePagePics([
    // 'http://www.mm131.com/xinggan/',
    // 'http://www.mm131.com/xinggan/list_6_2.html',
    // 'http://www.mm131.com/xinggan/list_6_3.html',
    // 'http://www.mm131.com/xinggan/list_6_4.html',
    // 'http://www.mm131.com/xinggan/list_6_5.html',
    // 'http://www.mm131.com/xinggan/list_6_6.html',
    // 'http://www.mm131.com/xinggan/list_6_7.html',
    // 'http://www.mm131.com/xinggan/list_6_8.html',
    // 'http://www.mm131.com/xinggan/list_6_9.html',
    // 'http://www.mm131.com/xinggan/list_6_10.html',
    'http://www.mm131.com/xinggan/list_6_11.html',
])