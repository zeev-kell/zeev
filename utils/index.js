/**
 * Created by zeev on 2016/10/12 0012.
 */

var errors = require("../errors");

module.exports.handleError = function (res, fun) {
	return function (err, doc) {
		if (err) {
			res.sendStatus(500);
		} else {
			fun(doc);
		}
	}
}