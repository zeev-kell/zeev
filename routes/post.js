/**
 * Created by Administrator on 2016/11/4 0004.
 */

var express = require('express'),
	router  = express.Router();

var postCtrl = require('../controller/post'),
	api      = require('../api');


router.get('/', postCtrl.getPosts);
router.post('/', postCtrl.addPost);
router.put('/:id', postCtrl.updatePost);
router.delete('/:id', postCtrl.removePost);
router.get('/:id', postCtrl.getPostInfo);


module.exports = router;