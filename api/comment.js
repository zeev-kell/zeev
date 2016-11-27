/**
 * Created by zeev on 2016/11/6 0006.
 */
var Promise  = require('bluebird'),
	_        = require('lodash'),
	errors   = require("../errors"),
	validate = require("../utils/validate"),
	debug    = require('debug')('zeev:comment'),
	Post     = global.dbHelper.getModel("Post"),
	Comment  = global.dbHelper.getModel('Comment'),
	pipeline = require('../utils/pipeline');

/**
 * 创建一个comment并且更新post
 * @param object
 * @param options
 * @returns {*}
 */
exports.addPostComment = function (object, options) {
	var tasks;

	//	var comment  = new Comment({
	//		content : req.body.content,
	//		visitor : { _id: req.cookies._v },
	//		relation: _id
	//	});
	//	var validate = comment.validateSync();
	//	if (validate && validate.errors) {
	//		return errors.handleAPIError(new errors.ValidationError(), req, res, next);
	//	}
	//	comment.save();

	function createComment(_object) {
		return Comment.create({
			content: _object.content,
			visitor: _object._v
		})
	}

	function updatePost(comment) {
		return Post.findOneAndUpdate({ _id: options.id }, {
			$push: {
				comments: comment
			}
		}).then(function (post) {
			if (post) {
				return post;
			}
			return Promise.reject(new errors.NotFoundError("POST 不存在！"));
		})
	}

	tasks = [
		createComment,
		updatePost
	];

	// Pipeline calls each task passing the result of one to be the arguments for the next
	return pipeline(tasks, object, options)
		.then(function formatResponse(result) {
			return result;
		});
}

exports.updateComment = function (object, options) {
	return Comment.findOneAndUpdate(object, { $set: options }, { new: true })
		.then(function (comment) {
			if (comment) {
				return comment;
			}
			return Promise.reject(new errors.NotFoundError("Comment 不存在！"));
		})
}

exports.getList = function (object, options) {
	if(options.limit){
		options.limit = parseInt(options.limit);
	}
	return Comment.find(object)
		.limit(options.limit)
		.then(function (comments) {
			if (comments) {
				return comments
			}
			return Promise.reject(new errors.NotFoundError("Not Found ... "));
		})
}

exports.removeComment = function (object, options) {
	if (!validate.isObjectId(object._id)) {
		return Promise.reject(new errors.ValidationError("非法ID..."))
	}
	return Comment.findOneAndRemove(object)
		.then(function (comment) {
			if (comment) {
				return comment;
			}
			return Promise.reject(new errors.NotFoundError("Not Found ... "));
		})
}