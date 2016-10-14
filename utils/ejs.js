/**
 * Created by zeev on 2016/10/13 0013.
 */

var moment = require("moment");
moment.locale('zh-cn');

module.exports = function (app) {
	app.locals.moment = function (date, format) {
		format = format || 'lll';
		return moment(date).format(format);
	};
	app.locals.getParse = function (_this, _keys) {
		var keys = _keys.split(/\./);
		var value = _this[keys[0]];
		for (var i = 1, len = keys.length; i < len; i++) {
			if (value == '' || typeof value == "undefined") {
				break;
			}
			value = value[keys[i]];
		}
		return value;
	}
}
