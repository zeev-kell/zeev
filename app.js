var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'core', 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(path.join(__dirname, 'core', 'public', 'favicon.ico')));

/* 日志模块 */
if (process.env.NODE_ENV == "development") {
    require("./logs")(app);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/bower_components', express.static(path.join(__dirname, 'core', 'bower_components')));
app.use('/public', express.static(path.join(__dirname, 'core', 'public')));
app.use('/common', express.static(path.join(__dirname, 'core', 'common')));
app.use('/index', express.static(path.join(__dirname, 'core', 'index')));

/* 所有的路由 */
require('./routes')(app);

var errors = require("./errors");

// 404 Handler
app.use(errors.error404);

// 500 Handler
app.use(errors.error500);


module.exports = app;
