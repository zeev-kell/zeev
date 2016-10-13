/**
 * Created by zeev on 2016/10/12 0012.
 */
var express = require('express');
var router = express.Router();
var debug = require('debug')("zeev:essay");
var postCtrl = require('../controller/post');

/* GET users listing. */
router.get('/', postCtrl.renderIndex);

router.get('/post/:id', postCtrl.renderPostInfo);

module.exports = router;