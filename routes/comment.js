/**
 * Created by Administrator on 2016/11/4 0004.
 */

var api            = require('../api'),
	commentCtrl    = require("../controller/comment"),
	visitorConfirm = require("../middleware/visitor-confirm");

module.exports = function (router) {
	router.post('/api/comment/:id', visitorConfirm.confirm, api.http(api.comment.add));
	router.post('/comment/:id', visitorConfirm.confirm, commentCtrl.addCommentAndRender);
}