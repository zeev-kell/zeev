var errors = require('../errors');
var moment = require("moment");
moment.locale('zh-cn');

var coreHelpers     = {};
coreHelpers.compare = require('./compare');
coreHelpers.asset   = require('./asset');
coreHelpers.debug   = require('./debug');
coreHelpers.env     = require('./env');
coreHelpers.random  = require('./random');
coreHelpers.socket  = require('./socket');

module.exports.registerHelpers = function (hbs) {

	hbs.registerHelper('moment', function (context, options) {
		options.hash = options.hash || {};
		var format   = options.hash && options.hash.format || 'lll';
		if (options.hash.fromNow) {
			return moment(context).fromNow();
		}
		return moment(context).format(format);
	});
	hbs.registerHelper('compare', coreHelpers.compare);
	hbs.registerHelper('asset', coreHelpers.asset);
	hbs.registerHelper('socket', coreHelpers.socket);
	hbs.registerHelper('debug', coreHelpers.debug);
	hbs.registerHelper('env', coreHelpers.env);
	hbs.registerHelper('random', coreHelpers.random);

}
