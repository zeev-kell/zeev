/**
 * Created by zeev on 2016/10/10 0010.
 */
var logger = require('morgan');
var fs = require('fs');
var FileStreamRotator = require('file-stream-rotator');
var logDirectory = __dirname + '/access';

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
	date_format: 'YYYYMMDD',
	filename : logDirectory + '/%DATE%.log',
	frequency: 'daily',
	verbose  : false
})
//var errorLog = fs.createWriteStream(__dirname + '/logs/error.log', { flags: 'a' });

module.exports = function (app) {
	//app.use(logger('This is a customer format. :method :url :status :response-time ms'));
	if (process.env.NODE_ENV !== "development") {
		app.use(logger('short', { stream: accessLogStream }));
	}else{
		// app.use(logger('short'));
	}
}