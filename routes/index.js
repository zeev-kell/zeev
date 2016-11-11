var express    = require('express'),
	router     = express.Router(),
	essay      = require('./essay'),
	admin      = require('./admin'),
	post       = require('./post'),
	project    = require('./project'),
	middleware = require('../middleware'),
	userCtrl   = require('../controller/user'),
	tagCtrl    = require('../controller/tag'),
	utils      = require("../utils");

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('home/index', { title: '柯子源的个人网站' });
});

/* GET home page. */
router.get('/index/', function (req, res, next) {
	res.render('home/index', { title: '柯子源的个人网站' });
});

/* signin page. */
router.get('/signin/', function (req, res, next) {
	res.render('signin', { title: '登录 - 柯子源的个人网站', layout: utils.env_path('views/layout/angular.hbs') });
});
router.post('/signin/', userCtrl.signin);

/* about page. */
router.get('/about', function (req, res, next) {
	res.render('about', { title: '关于 - 柯子源', time: [1, 2, 3] });
});

/* project page. */
router.get('/project', function (req, res, next) {
	res.render('project', { title: '项目 - 柯子源的个人网站' });
});

/* product page. */
router.get('/product', function (req, res, next) {
	res.render('product', { title: '作品 - 柯子源的个人网站' });
});

router.get('/tag', tagCtrl.getTags);

router.delete('/tag/:id', tagCtrl.removeTag);

require("./comment")(router);

module.exports = function (app) {
	app.use(function (req, res, next) {
		//console.log(req.cookies);
		//res.locals.path = req.path;
		if (!req.cookies.image) {
			req.cookies.image = "/public/img/profile/" + Math.round(Math.random() * 6) + ".jpg";
		}
		res.locals.cookies = req.cookies;
		next();
	})
	app.use("/", router);
	app.use("/essay", essay);
	app.use("/project", project);
	app.use("/post", middleware.authenticateClient, post);
	app.use("/admin", middleware.authenticateClient, admin);
	app.use("/admin/", middleware.authenticateClient, admin);
};
