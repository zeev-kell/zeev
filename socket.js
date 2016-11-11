var fs = require('fs'),
    http = require('http'),
    socketio = require('socket.io');

var server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end(fs.readFileSync(__dirname + '/app.js'));
}).listen(4201, function() {
    console.log('Listening at: http://localhost:4201');
});

socketio.listen(server).on('connection', function(socket) {
    socket.on('message', function(msg) {
        console.log('Message Received: ', msg);
        socket.broadcast.emit('message', msg);
    });
});

module.exports = server;
