/**
 * Created by zeev on 2016/11/13 0013.
 */

var http        = require('http');
var querystring = require('querystring');

var ____  = 1455055398;
var time  = 1455374211;
var ___t  = Math.floor(new Date().getTime() / 1000);
var ___tt = ___t - time;

function time_() {

	//var td_time = Math.floor(new Date().getTime() / 1000) - 24070000;
	var td_time = Math.floor(new Date().getTime() / 1000) - ___tt;
//	var td_time = time;

	//var cookie = '54a167e059c01ac020aa8e384e1dacbd';
	var cookie = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);

	var cookie1 = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);

	var cookie2 = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);

	var cookie3 = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);

	var _Cookie = cookie1 + '=' + cookie + '; ' + cookie2 + '=0; ' + cookie3 + '=0; td_cookie=' + td_time;

	//var _Cookie = '9a924989d5fb693df1830024f765bb03=' + cookie + '; 98b024912aa8db5f0561d09ca6550c2f=0;
	// 92ee657742892b32ed5628f8ef8fda02=0; td_cookie=' + td_time;

	var contents = querystring.stringify({
		data  : [{
			selection_id: "sid_1458888834175",
			option_id   : "option_1478621926212"
		}],
		action: "save",
		a     : cookie,
		"hid" : "5821d04e5af0d62908000000"
	});

	var options = {
		host   : '121.9.213.26',
		port   : "80",
		path   : '/main/interactive/vote/index.php',
		method : 'POST',
		headers: {
			'Accept'          : 'application/json, text/javascript, */*; q=0.01',
			//'Accept-Encoding' : 'gzip, deflate',
			'Accept-Language' : 'zh-CN,zh;q=0.8',
			'Connection'      : 'keep-alive',
			'Content-Length'  : contents.length,
			'Content-Type'    : 'application/x-www-form-urlencoded; charset=UTF-8',
			'Cookie'          : _Cookie,
			'Host'            : 'huodong.myzaker.com',
			'Origin'          : 'http://huodong.myzaker.com',
			'Referer'         : 'http://huodong.myzaker.com/main/interactive/vote/?hid=5821d04e5af0d62908000000',
			'User-Agent'      : 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
			'X-Requested-With': 'XMLHttpRequest',
			'x-real-ip'       : Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
			'x-forwarded-for' : Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
			'X-Forwarded-For' : Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255)
		}
	};


	var req = http.request(options, function (res) {
		res.setEncoding('utf-8');
		res.on('data', function (data) {
			console.log(data, td_time, _Cookie);
		});
	});

	req.on('error', function (e) {
		console.log('problem with request: ' + e.message);
	});

	req.write(contents);


	//	res.write('x-forwarded-for: ' + req.headers['x-forwarded-for'] + '\n');
	//	res.write('x-real-ip: ' + req.headers['x-real-ip'] + '\n');

	req.end();


	next();
}

function next() {
	setTimeout(time_, Math.random() * 200);
}

next();