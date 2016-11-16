// # Asset helper
// Usage: `{{asset "css/screen.css"}}`
//

var hbs   = require('express-hbs'),
	utils = require('../utils'),
	debug = require('debug')('zeev:helper'),
	asset;

asset = function (context, options) {
	var minify = true;

	// replace ".foo" with ".min.foo" in production
	if (utils.isProduction && minify) {
		//        context = "http://www.zeevkell.com" + context.replace('.', '.min.');
		context = context.replace('.', '.min.');
	}

	return context;
};

module.exports = asset;
