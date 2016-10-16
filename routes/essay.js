/**
 * Created by zeev on 2016/10/12 0012.
 */
var express = require('express');
var router = express.Router();
var debug = require('debug')("zeev:essay");
var essayCtrl = require('../controller/essay');

/* GET users listing. */
router.get('/', essayCtrl.renderIndex);

router.get('/archive', essayCtrl.renderArchive);

router.get('/archive/:date', essayCtrl.renderArchiveByTime);

router.get('/tags/:id', essayCtrl.renderTags);

router.get('/post/:id', essayCtrl.renderPostInfo);

module.exports = router;
