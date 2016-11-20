/**
 * Created by zeev on 2016/11/11 0011.
 */

var _      = require("lodash"),
	moment = require("moment");
moment.locale('zh-cn');

module.exports = function (chat) {
	chat.on('connection', function (socket) {
		socket.on("message", function (data) {
			_.extend(data, { date: moment(data.date || new Date()).format("LT") });
			chat.emit('chat', data);
			//socket.broadcast.emit('user connected'); 仅仅在emit和send方法前增加broadcast的标志。广播意味着消息将会发给任何人除了消息的发起者：
		})
		socket.on("system", function (data) {
			_.extend(data, { date: moment(data.date || new Date()).format("LT") });
			if(data.type == "join"){
				chat.emit('join', data);
			}
		})
	});
	chat.on('disconnect', function (data) {
		console.log(data);
		socket.emit('notice', { message: 'hello world !', date: new Date() });
	});
	return chat;
}

/* 广播事件 */
module.exports.emit = function () {
	stream.write(arguments[0] + JSON.stringify(arguments) + '\n');
	return io.sockets.emit.apply(io.sockets, arguments);
}
