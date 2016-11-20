/**
 * Created by keziyuan on 2016/2/21.
 */

var Message = global.dbHelper.getModel("Message");
var errors = require("../errors");

exports.addMessage = function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var content = req.body.content;

    Message.create({
        name: name,
        email: email,
        content: content
    }).then(function(message) {
        if (message) {
            return res.render('views/success', { title: '首页 - 柯子源的个人网站', message: '消息发送成功！' });
        }
        return res.sendStatus(500);
    }).catch(errors.handleError(next))
}


exports.getMessages = function(req, res, next) {
    Message
        .find()
        .sort('createAt')
        .then(function(messages) {
            return res.status(200).send(messages);
        }).catch(errors.handleError(next))
}
