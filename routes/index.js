var express = require('express');
var router = express.Router();
var essay = require('./essay');
var admin = require('./admin');
var userCtrl = require('../controller/user');
var postCtrl = require('../controller/post');
var tagCtrl = require('../controller/tag');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'The web of zeev' });
});

/* GET home page. */
router.get('/index/', function(req, res, next) {
    res.render('index', { title: 'The web of zeev' });
});

/* signin page. */
router.get('/signin/', function(req, res, next) {
    res.render('signin', { title: 'Signin for zeev admin' });
});

/* about page. */
router.get('/about', function(req, res, next) {
    res.render('about', { title: 'about zeev', time: [1, 2, 3] });
});

/* project page. */
router.get('/project', function(req, res, next) {
    res.render('project', { title: 'project' });
});

/* product page. */
router.get('/product', function(req, res, next) {
    res.render('product', { title: 'product' });
});

router.post('/signin/', userCtrl.signin);

router.get('/post', postCtrl.getPosts);

router.get('/post/:id', postCtrl.getPostInfo);

router.put('/post/:id', postCtrl.updatePost);

router.delete('/post/:id', postCtrl.removePost);

router.post('/post', postCtrl.addPost);

router.get('/tag', tagCtrl.getTags);

router.delete('/tag/:id', tagCtrl.removeTag);


module.exports = function(app) {
    app.use(function(req, res, next) {
        res.locals.path = req.path;
        next();
    })
    app.use("/", router);
    app.use("/essay", essay);
    app.use("/admin", userCtrl.adminRequired, admin);
    app.use("/admin/", userCtrl.adminRequired, admin);
};
