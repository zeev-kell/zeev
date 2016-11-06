/**
 * Created by zeev on 2016/11/6 0006.
 */

var Visitor = global.dbHelper.getModel("Visitor"),
	Promise = require('bluebird'),
	errors  = require("../errors");

exports.create = function (object) {
	return Visitor
		.create(object)
}

exports.findByEmail = function (email) {
	return Visitor
		.findOne({ email: email })
}