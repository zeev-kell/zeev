/**
 * Created by Administrator on 2016/11/4 0004.
 */

var api = require('../api'),
    commentCtrl = require("../controller/comment"),
    essayCtrl = require("../controller/essay"),
    visitorConfirm = require("../middleware/visitor-confirm");

module.exports = function(router) {
    router.post('/api/comment/:id', visitorConfirm.confirm, api.http(api.comment.addPostComment));
    router.post('/comment/:id', visitorConfirm.confirm, api._http(api.comment.addPostComment), essayCtrl.redirectPostInfo);
}
