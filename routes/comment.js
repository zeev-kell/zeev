/**
 * Created by Administrator on 2016/11/4 0004.
 */

var api            = require('../api'),
	essayCtrl      = require("../controller/essay"),
	messageCtrl    = require("../controller/message"),
	visitorConfirm = require("../middleware/visitor-confirm");

module.exports = function (router) {
	router.post('/api/comment/:id', visitorConfirm.confirm, api.http(api.comment.addPostComment));
	router.post('/comment/:id', visitorConfirm.confirm, api._http(api.comment.addPostComment), essayCtrl.redirectPostInfo);

	router.post("/message", messageCtrl.addMessage);
	router.get("/message", messageCtrl.getMessages);
}
