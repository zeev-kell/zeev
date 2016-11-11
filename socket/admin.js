/**
 * Created by zeev on 2016/11/11 0011.
 */

module.exports = function (admin) {
	admin.on('connection', function (socket) {
		socket.emit('news', { message: 'admin -- hello world !' });
	});
	return admin;
}