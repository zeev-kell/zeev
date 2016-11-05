/**
 * Created by Administrator on 2016/11/4 0004.
 */

var postCtrl = require('../controller/post');

module.exports = function(router){
    router.get('/post', postCtrl.getPosts);
    router.get('/post/:id', postCtrl.getPostInfo);
    router.put('/post/:id', postCtrl.updatePost);
    router.delete('/post/:id', postCtrl.removePost);
    router.post('/post', postCtrl.addPost);
}