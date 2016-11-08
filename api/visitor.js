/**
 * Created by zeev on 2016/11/6 0006.
 */

var Visitor = global.dbHelper.getModel("Visitor"),
	Promise = require('bluebird'),
	errors  = require("../errors");

/**
 * 创建一个visitor
 * @param object
 * @param options
 * @returns {Object}
 */
exports.create = function (object, options) {
	return Visitor
		.create(object)
}

/**
 * 根据Email查询一个visitor
 * @param email string
 * @returns {Query|*}
 */
exports.findByEmail = function (email) {
	return Visitor
		.findOne({ email: email })
}