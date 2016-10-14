var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var hbs = require('hbs');
var ejs = require('ejs');

var mongodb = require("./mongodb");
mongodb();
var app = express();
// app.use(mongodb.session);

// view engine setup
app.set('views', path.join(__dirname, 'core', 'views'));
//ejs.delimiter = '%';
//ejs.open = '{{';
//ejs.close = '}}';
app.set('view engine', 'ejs');

require("./utils/ejs")(app);

//app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(path.join(__dirname, 'core', 'public', 'favicon.ico')));

/* 日志模块 */
require("./logs")(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/admin', express.static(path.join(__dirname, 'core', 'admin')));
app.use('/bower_components', express.static(path.join(__dirname, 'core', 'bower_components')));
app.use('/essay', express.static(path.join(__dirname, 'core', 'essay')));
app.use('/index', express.static(path.join(__dirname, 'core', 'index')));
app.use('/public', express.static(path.join(__dirname, 'core', 'public')));

/* 所有的路由 */
require('./routes')(app);

var errors = require("./errors");

// 404 Handler
app.use(errors.error404);

// 500 Handler
app.use(errors.error500);


module.exports = app;
