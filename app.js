'use strict';
/*
	module.exports 初始值为一个空对象 {}
	exports 是指向的 module.exports 的引用
	require() 返回的是 module.exports 而不是 exports
*/
let express     = require('express'),
	path        = require('path'),
	favicon     = require('serve-favicon'),
	app         = express(),
	mongodb     = require("./mongodb")(app),
	utils       = require('./utils');
global.dbHelper = require('./schema');

// view engine setup
let hbs = require('express-hbs');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.express4({
	partialsDir  : 'views/partials',
	defaultLayout: 'views/layout/default.hbs',
	layoutsDir   : 'views/layout'
}));
/* 注册 hbs 的helpers */
require("./helpers").registerHelpers(hbs);

/* logo */
app.use(favicon(path.join(__dirname, 'favicon.ico')));

let logger       = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser   = require('body-parser');

/* 日志模块 */
//require("./logs")(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.all('/bower_components/**/*', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	next();
});

app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'public', utils.isDevelopment ? 'admin' : 'admin_')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/product', express.static(path.join(__dirname, 'public', 'product')));

/* 所有的路由 */
require('./routes')(app);

let errors = require("./errors");
app.use(errors.error404);
app.use(errors.error500);

module.exports = app;
