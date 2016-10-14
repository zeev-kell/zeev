/**
 * Created by zeev on 2016/10/12 0012.
 */
var express = require('express');
var router = express.Router();
var debug = require('debug')("zeev:essay");
var postCtrl = require('../controller/post');

/* GET users listing. */
router.get('/', postCtrl.renderIndex);

router.get('/archive', postCtrl.renderArchive);

router.get('/archive/:id', postCtrl.renderArchive);

router.get('/tags/:id', postCtrl.renderTags);

router.get('/post/:id', postCtrl.renderPostInfo);

module.exports = router;