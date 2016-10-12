/**
 * Created by zeev on 2016/10/12 0012.
 */
var express = require('express');
var router = express.Router();
var debug = require('debug')("zeev:essay");
var postCtrl = require('../controller/essay/post');

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.render('essay/index', { title: '随笔' });
});

router.get('/post/:id', postCtrl.getPostInfo);

module.exports = router;