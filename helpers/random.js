/**
 * Created by zeev on 2016/11/4 0004.
 */

var hbs = require('express-hbs'),
	debug = require('debug')('zeev:helper'),
	random;

random = function (min, max, options) {
	var random = Math.floor(Math.random() * ( max - min)) + min;
	return random;
};

module.exports = random;
