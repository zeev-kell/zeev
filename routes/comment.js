/**
 * Created by Administrator on 2016/11/4 0004.
 */

var commentCtrl = require('../controller/comment');
module.exports = function(router){
    router.post('/comment/:id', commentCtrl.addComment);
}