/**
 * Created by zeev on 2016/11/11 0011.
 */

var _        = require("lodash"),
	moment   = require("moment"),
	userList = [];
moment.locale('zh-cn');


/**
 *    socket 当前用户
 *    socket.broadcast 除了当前用户的其他用户
 *    chat 广播所有用户
 */

module.exports = function (chat) {
	chat.on('connection', function (socket) {
		socket.on("message", function (data) {
			_.extend(data, { date: moment(data.date || new Date()).format("LT") });
			chat.emit('chat', data);
		})
		socket.on("system", function (data) {
			_.extend(data, { date: moment(data.date || new Date()).format("LT") });
			chat.emit('system', 'system');
		})
		socket.on("signin", function (data) {
			_.extend(data, { date: moment(data.date || new Date()).format("LT") });
			socket.name = data.name;
			socket.emit('signinSuccess');
			chat.emit('system', {
				type   : "join",
				alert  : "success",
				message: "<strong>" + socket.name + "</strong>&nbsp;加入了聊天系统，大家快和TA打招呼吧！"
			});
		})
		socket.on("disconnect", function () {
			if (socket.name) {
				socket.broadcast.emit('system', {
					type   : "leave",
					alert  : "warning",
					message: socket.name + "离开了聊天系统。"
				});
			}
		})
	});
	return chat;
}

/* 广播事件 */
module.exports.emit = function () {
	stream.write(arguments[0] + JSON.stringify(arguments) + '\n');
	return io.sockets.emit.apply(io.sockets, arguments);
}
