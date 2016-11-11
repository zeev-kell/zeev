/**
 * Created by zeev on 2016/10/10 0010.
 */
var logger            = require('morgan');
var fs                = require('fs');
var FileStreamRotator = require('file-stream-rotator');
var logDirectory      = __dirname + '/socket';

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var stream = FileStreamRotator.getStream({
	date_format: 'YYYYMMDD',
	filename   : logDirectory + '/%DATE%.log',
	frequency  : 'daily',
	verbose    : false
})
//var errorLog = fs.createWriteStream(__dirname + '/logs/error.log', { flags: 'a' });

module.exports = function (req, res, next) {
	return logger('short', { stream: stream });
}

module.exports.stream = stream;

module.exports.createStream = function (directory) {
	var stream = FileStreamRotator.getStream({
		date_format: 'YYYYMMDD',
		filename   : __dirname + "/" + directory + '/%DATE%.log',
		frequency  : 'daily',
		verbose    : false
	})
	return function (type, option) {
		stream.write(type);
	}
};