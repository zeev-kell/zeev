/**
 * Created by zeev on 2016/11/11 0011.
 */

module.exports = function (chat) {
	chat.on('connection', function (socket) {
			socket.emit('news', { message: 'chat -- hello world !' });
		});
	return chat
}

/* �㲥�¼� */
module.exports.emit = function () {
	stream.write(arguments[0] + JSON.stringify(arguments) + '\n');
	return io.sockets.emit.apply(io.sockets, arguments);
}