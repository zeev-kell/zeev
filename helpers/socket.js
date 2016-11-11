/**
 * Created by zeev on 2016/11/11 0011.
 */

var port  = 4201,
	utils = require('../utils');

module.exports = function (context, options) {

	if (utils.isProduction) {
		context = "115.28.213.111:" + 4201 + context;
	}else{
		context = "http://localhost:" + 4201 + context;
	}

	return context;
};