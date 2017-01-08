/**
 * Created by zeev on 2016/10/12 0012.
 */
var express     = require('express');
var router      = express.Router(),
	debug       = require('debug')("zeev:admin"),
	postCtrl    = require('../controller/post'),
	commentCtrl = require("../controller/comment");

/* GET users listing. */
router.get('/', function (req, res, next) {
	if (process.env.NODE_ENV === "development") {
		res.render('admin/index', { title: 'zeev后台管理', layout: false });
	} else {
		res.render('admin/index_', { title: 'zeev后台管理', layout: false });
	}
});

router.put('/comment/:id', commentCtrl.auditingComment);

router.delete("/comment/:id", commentCtrl.removeComment);

router.get('/comment', commentCtrl.getNotViewedComment);


module.exports = router;
