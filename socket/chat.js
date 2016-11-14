/**
 * Created by zeev on 2016/11/11 0011.
 */

module.exports = function(chat) {
    chat.on('connection', function(socket) {
        socket.emit('new', { message: 'hello world !', date: new Date() });
        setInterval(function() {
            socket.emit('chat', { message: 'chat -- hello world !', date: new Date() });
        }, 1000);
        socket.emit('chat', { message: 'chat -- hello world !', date: new Date() });
    });
    return chat
}

/* ¹ã²¥ÊÂ¼þ */
module.exports.emit = function() {
    stream.write(arguments[0] + JSON.stringify(arguments) + '\n');
    return io.sockets.emit.apply(io.sockets, arguments);
}
