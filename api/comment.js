/**
 * Created by zeev on 2016/11/6 0006.
 */
var Promise  = require('bluebird'),
	_        = require('lodash'),
	utils    = require('../utils'),
	Comment  = global.dbHelper.getModel('Comment'),
	pipeline = require('../utils/pipeline');

exports.add = function (object, options) {
	var tasks;

	function modelQuery() {
		return Comment.create({
			content: object.content,
			visitor: object._v
		});
	}

	// Push all of our tasks into a `tasks` array in the correct order
	tasks = [
		modelQuery
	];

	// Pipeline calls each task passing the result of one to be the arguments for the next
	return pipeline(tasks, object, options)
		.then(function formatResponse(result) {
			return result;
		});
}