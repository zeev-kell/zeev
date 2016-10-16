var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var hbs = require('express-hbs');
var utils = require("./utils");

var mongodb = require("./mongodb");
mongodb();
var app = express();
// app.use(mongodb.session);

// view engine setup
app.set('views', utils.env_path('views'));

var fp = require('path');

app.engine('hbs', hbs.express4({
	partialsDir: [utils.env_path('views/partials')],
	layoutsDir : utils._path('views/layout')
}));
app.set('view engine', 'hbs');
app.set('views', utils._dist + "/views");
require("./helpers").registerHelpers(hbs);

// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(utils.env_path('public/favicon.ico')));

/* 日志模块 */
require("./logs")(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/admin', express.static(utils.env_path('admin')));
app.use('/bower_components', express.static(utils._path('bower_components')));
app.use('/essay', express.static(utils.env_path('essay')));
app.use('/index', express.static(utils.env_path('index')));
app.use('/signin', express.static(utils.env_path('signin')));
app.use('/public', express.static(utils.env_path('public')));

/* 所有的路由 */
require('./routes')(app);

var errors = require("./errors");

// 404 Handler
app.use(errors.error404);

// 500 Handler
app.use(errors.error500);


module.exports = app;
