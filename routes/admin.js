/**
 * Created by zeev on 2016/10/12 0012.
 */
var express = require('express');
var router = express.Router();
var debug = require('debug')("zeev:admin");
var postCtrl = require('../controller/post');

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.render('admin', { title: 'zeev admin' });
});

router.get('/post', postCtrl.getPosts);

module.exports = router;