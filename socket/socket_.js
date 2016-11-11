var app    = require('express')();
var server = require('http').createServer(app);
var io     = require('socket.io').listen(server);

io.sockets
	.on('connection', function (socket) {
		socket.emit('news', { hello: 'world' });
		//		console.log(socket.handshake.headers);
	});


/* 日志模块 */
var stream     = require("./logs/socket").stream;

module.exports = function connect(port) {
	server.listen(port)
};

module.exports.socket = io.sockets;


/* 广播事件 */
module.exports.emit = function () {
	stream.write(arguments[0] + JSON.stringify(arguments) + '\n');
	return io.sockets.emit.apply(io.sockets, arguments);
}