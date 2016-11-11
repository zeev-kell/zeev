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
app.use(mongodb.session);

// view engine setup
app.set('views', utils.env_path('views'));

var fp = require('path');

/**
 * Express 4.x template engine compliance.
 *
 * @param {Object} options = {
 *   handlebars: "override handlebars",
 *   defaultLayout: "path to default layout",
 *   partialsDir: "absolute path to partials (one path or an array of paths)",
 *   layoutsDir: "absolute path to the layouts",
 *   extname: "extension to use",
 *   contentHelperName: "contentFor",
 *   blockHelperName: "block",
 *   beautify: "{Boolean} whether to pretty print HTML"
 * }
 */
app.engine('hbs', hbs.express4({
    partialsDir: [utils.env_path('views/partials')],
    defaultLayout: utils.env_path('views/layout/default.hbs'),
    layoutsDir: utils.env_path('views/layout')
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
app.use('/bower_components', express.static(utils._path('bower_components')));
app.use('/node_modules', express.static(utils._path('node_modules')));
app.use('/admin', express.static(utils.env_path('admin')));
app.use('/essay', express.static(utils.env_path('essay')));
app.use('/index', express.static(utils.env_path('index')));
app.use('/public', express.static(utils.env_path('public')));
app.use('/signin', express.static(utils.env_path('signin')));
app.use('/about', express.static(utils.env_path('about')));
app.use('/product', express.static(utils.env_path('product')));

/* 所有的路由 */
require('./routes')(app);

var errors = require("./errors");

// 404 Handler
app.use(errors.error404);

// 500 Handler
app.use(errors.error500);

require("./socket");

module.exports = app;
