/**
 * Created by zeev on 2016/10/12 0012.
 */
var express = require('express');
var router = express.Router();
var debug = require('debug')("zeev:essay");

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.render('essay', { title: '随笔'});
});

module.exports = router;