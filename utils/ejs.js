/**
 * Created by zeev on 2016/10/13 0013.
 */

var moment = require("moment");

module.exports = function (app) {
	app.locals.moment = function (date) {
		return moment(date, 'MM-DD-YYYY');
	};
}