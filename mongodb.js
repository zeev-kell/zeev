/**
 * Created by zeev on 2016/10/12 0012.
 */

//var session = require('express-session');
//var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var dbConfig = require('./config/db.js');

module.exports = function () {
	mongoose.Promise = require('bluebird');
	mongoose.connect(dbConfig.mongodb);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, '连接错误:'));
	db.once('open', function () {
		console.log("连接成功！");
	});
	global.dbHelper = require('./schema');
}

//module.exports.session = session({
//	secret           : 'zeev',
//	key              : "zeev",
//	store            : new MongoStore({
//		url       : dbConfig.mongodb,
//		collection: 'sessions'
//	}),
//	cookie           : {
//		maxAge: 1000 * 60 * 60 * 6
//	},
//	resave           : false,
//	saveUninitialized: true
//})