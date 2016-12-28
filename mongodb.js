/**
 * Created by zeev on 2016/10/12 0012.
 */
'use strict';
let session = require('express-session'),
    Promise = require('bluebird'),
    MongoStore = require('connect-mongo')(session),
    mongoose = require('mongoose'),
    dbConfig = require('./config/db.js');

module.exports.init = function() {
    mongoose.Promise = require('bluebird');
    mongoose.connect(dbConfig.mongodb);
}

module.exports.onConnection = function() {
	let db = mongoose.connection;
    return new Promise(function(resolve, reject) {
        db.on('error', function(error) {
            console.log("连接错误！", error);
            reject(error)
        });
        db.once('open', function() {
            console.log("连接成功！");
            resolve();
        });
    });
}

/*
    path：表示 cookie 影响到的路径，匹配该路径才发送这个 cookie。
    expires 和 maxAge：告诉浏览器这个 cookie 什么时候过期，expires 是 UTC 格式时间，maxAge 是 cookie 多久后过期的相对时间。
                    当不设置这两个选项时，会产生 session cookie，session cookie 是 transient 的，当用户关闭浏览器时，就被清除。一般用来保存 session 的 session_id。
    secure：当 secure 值为 true 时，cookie 在 HTTP 中是无效，在 HTTPS 中才有效。
    httpOnly：浏览器不允许脚本操作 document.cookie 去更改 cookie。一般情况下都应该设置这个为 true，这样可以避免被 xss 攻击拿到 cookie。
*/

/*
    name: 设置 cookie 中，保存 session 的字段名称，默认为 connect.sid 。
    store: session 的存储方式，默认存放在内存中，也可以使用 redis，mongodb 等。express 生态中都有相应模块的支持。
    secret: 通过设置的 secret 字符串，来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改。
    cookie: 设置存放 session id 的 cookie 的相关选项，默认为
    (default: { path: '/', httpOnly: true, secure: false, maxAge: null })
    genid: 产生一个新的 session_id 时，所使用的函数， 默认使用 uid2 这个 npm 包。
    rolling: 每个请求都重新设置一个 cookie，默认为 false。
    resave: 即使 session 没有被修改，也保存 session 值，默认为 true。
 */
module.exports.session = function() {
    return session({
        secret: 'token',
        key: "token",
        store: new MongoStore({
            url: dbConfig.mongodb,
            collection: 'sessions'
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 6
        },
        resave: false,
        saveUninitialized: true
    })
}
