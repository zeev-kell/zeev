/**
 * Created by zeev on 2016/10/12 0012.
 */
var express = require('express');
var router = express.Router();
var debug = require('debug')("zeev:essay");
var essayCtrl = require('../controller/essay');

/* GET users listing. */
router.get('/', essayCtrl.index);

router.get('/post/:id', essayCtrl.getPostInfo);

module.exports = router;