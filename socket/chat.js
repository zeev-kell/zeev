/**
 * Created by zeev on 2016/11/11 0011.
 */

var _ = require("lodash"),
    moment = require("moment");
moment.locale('zh-cn');

module.exports = function(chat) {
    chat.on('connection', function(socket) {
        socket.on("message", function(data) {
            _.extend(data, { date: moment(data.date || new Date()).format("LT") });
            chat.emit('chat', data);
            /**
             *	socket 当前用户
             *	socket.broadcast 除了当前用户的其他用户
             *	chat 所有用户
             */
            //socket.broadcast.emit('user connected'); 仅仅在emit和send方法前增加broadcast的标志。广播意味着消息将会发给任何人除了消息的发起者：
        })
        socket.on("system", function(data) {
            _.extend(data, { date: moment(data.date || new Date()).format("LT") });
            if (data.type == "signin") {
                socket.emit('signinSuccess');
                chat.emit('system', {
                    type: "join",
                    data: data
                });
            }
        })
        socket.on("signin", function(data) {
            _.extend(data, { date: moment(data.date || new Date()).format("LT") });
            socket.name = data.name;
            socket.emit('signinSuccess');
            chat.emit('system', {
                type: "join",
                data: data
            });
        })
        socket.on("disconnect", function() {
            socket.broadcast.emit('system', {
                type: "leave",
                data: socket.name
            });
        })
    });
    return chat;
}

/* 广播事件 */
module.exports.emit = function() {
    stream.write(arguments[0] + JSON.stringify(arguments) + '\n');
    return io.sockets.emit.apply(io.sockets, arguments);
}
