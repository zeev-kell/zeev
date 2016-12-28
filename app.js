'use strict';
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');

let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let hbs = require('express-hbs');
let utils = require("./utils");

let app = express(),
    mongodb = require("./mongodb");
mongodb.init();
app.use(mongodb.session());
global.dbHelper = require('./schema');

// view engine setup
app.set('views', utils.env_path('views'));

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
    partialsDir: [utils.env_path('views/partials'), utils.env_path('essay')],
    defaultLayout: utils.env_path('views/layout/default.hbs'),
    layoutsDir: utils.env_path('views/layout')
}));
app.set('view engine', 'hbs');
app.set('views', utils._dist);
require("./helpers").registerHelpers(hbs);

// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(utils.env_path('public/favicon.ico')));

/* 日志模块 */
require("./logs")(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.all('/bower_components/**/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.use('/bower_components', express.static(utils._path('bower_components')));
app.use('/node_modules', express.static(utils._path('node_modules')));
app.use('/admin', express.static(utils.env_path('admin')));
app.use('/essay', express.static(utils.env_path('essay')));
app.use('/home', express.static(utils.env_path('home')));
app.use('/public', express.static(utils.env_path('public')));
app.use('/signin', express.static(utils.env_path('signin')));
app.use('/about', express.static(utils.env_path('about')));
app.use('/product', express.static(utils.env_path('product')));
app.use('/project', express.static(utils.env_path('project')));
app.use('/', express.static(utils._dist));

/* 所有的路由 */
require('./routes')(app);

let errors = require("./errors");

// 404 Handler
app.use(errors.error404);

// 500 Handler
app.use(errors.error500);

module.exports = app;
