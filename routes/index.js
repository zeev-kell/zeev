var express = require('express');
var router = express.Router();
var essay = require('./essay');
var admin = require('./admin');
var userCtrl = require('../controller/user');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'The web of zeev' });
});

/* GET home page. */
router.get('/index/', function (req, res, next) {
	res.render('index', { title: 'The web of zeev' });
});

/* signin page. */
router.get('/signin/', function (req, res, next) {
	res.render('signin', { title: 'Signin for zeev admin' });
});

router.post('/signin/', userCtrl.signin);

module.exports = function (app) {
	app.use("/", router);
	app.use("/essay", essay);
	app.use("/admin", userCtrl.adminRequired, admin);
	app.use("/admin/", userCtrl.adminRequired, admin);
};
