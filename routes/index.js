var express = require('express');
var router = express.Router();
var essay = require('./essay');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'The web of zeev' });
});

/* GET home page. */
router.get('/index', function (req, res, next) {
	res.render('index', { title: 'The web of zeev' });
});

module.exports = function (app) {
	app.use("/", router);
	app.use("/essay", essay);
};
