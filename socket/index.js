/**
 * Created by zeev on 2016/11/11 0011.
 */
//var io = require('socket.io')
//	.listen(process.env.SOCKET || '4201');

var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server); //引入socket.io模块并绑定到服务器
server.listen(process.env.SOCKET || '4201')

var chat  = io.of('/chat');
var admin = io.of('/admin');

module.exports = function connect() {
	require('./chat')(chat);
	require('./admin')(admin);
};

module.exports.chat = chat;

module.exports.admin = admin;