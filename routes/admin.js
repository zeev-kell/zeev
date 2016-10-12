/**
 * Created by zeev on 2016/10/12 0012.
 */
var express = require('express');
var router = express.Router();
var debug = require('debug')("zeev:admin");
var essayCtrl = require('../controller/essay');

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.render('admin', { title: 'zeev admin' });
});

router.get('/post', essayCtrl.getPost);

module.exports = router;