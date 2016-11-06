/**
 * Created by Administrator on 2016/11/4 0004.
 */

var commentCtrl = require('../controller/comment'),
    middleware  = require('../middleware');
module.exports = function (router) {
    router.post('/comment/:id', middleware.http(), commentCtrl.checkVisitor, commentCtrl.addComment);
}