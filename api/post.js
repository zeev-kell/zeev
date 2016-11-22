/**
 * Created by zeev on 2016/11/6 0006.
 */

var Post     = global.dbHelper.getModel("Post"),
	_        = require('lodash'),
	Promise  = require('bluebird'),
	validate = require("../utils/validate"),
	errors   = require("../errors"),
	utils    = require("../utils"),
	moment   = require("moment");

exports.create = function () {

}

/**
 * 获取post的列表
 * @param object obj 查询条件，默认全部查询
 * @param options obj 查询前后的一些参数
 * @returns {*}
 */
exports.getList = function (object, options) {
	object  = object || {};
	/**
	 * 默认0 过滤掉 markdown
	 * status 3 查询审核通过的
	 * full false 完整的html
	 */
	options = _.extend({ markdown: 0, status: 3, full: false }, options || {});
	return Post.find(object, { markdown: options.markdown })
		.populate({ path: 'author', select: '-_id name' })
		.populate({ path: 'tags', select: '_id name' })
		.populate({
			path : 'comments',
			match: { status: options.status }
		})
		.sort({ 'updated_at': -1 })
		.then(function (posts) {
			if (options.full === false) {
				posts = utils.postCondense(posts);
			}
			return posts;
		})
}

exports.getAggregate = function () {
	return Post.aggregate([{
		$group: {
			_id  : {
				M: { $month: "$created_at" },
				d: { $dayOfMonth: "$created_at" },
				y: { $year: "$created_at" }
			},
			posts: { $push: { title: "$title", _id: "$_id" } },
			count: { $sum: 1 }
		}
	}, {
		$sort: { "_id": -1 }
	}]).then(function (posts) {
		/**
		 * 把聚合之后的id转换成日期格式
		 */
		posts.map(function (post) {
			post._id.M = post._id.M - 1;
			post._id.d = 0;
			post._id   = moment(post._id).format();
		})
		return posts;
	})
}

/**
 * 查询单个POST，并且把 review ++
 * @param object
 * @param options
 * @returns {*}
 */
exports.findOneAndReview = function (object, options) {
	if (!validate.isObjectId(object._id)) {
		return Promise.reject(new errors.ValidationError("非法ID..."))
	}
	return Post
		.findOneAndUpdate(object, {
			$inc: { review: 1 }
		})
		.populate({ path: 'author', select: '-_id name' })
		.populate({ path: 'tags', select: '_id name' })
		.populate({
			path    : 'comments',
			match   : options._v ? { "$or": [{ status: 3 }, { visitor: { _id: options._v } }] } : { status: 3 },
			//match   : { "$or": [{ status: 3 }, { visitor: { _id: options._v } }] },
			populate: {
				path  : "visitor",
				select: '-_id url name image'
			},
			options : { sort: { 'updated_at': -1 } }
		})

		.then(function (post) {
			if (!post) {
				return Promise.reject(new errors.NotFoundError("POST 不存在..."))
			}
			return post;
		})
}

/**
 * admin 调用  查询单个POST
 * @param _id
 * @returns {Promise}
 */
exports.findById = function (_id) {
	return Post
		.findOne({ _id: _id })
		.populate({ path: 'author', select: 'name' })
		.populate({ path: 'tags', select: '_id name' })
		.populate({
			path    : 'comments',
			populate: {
				path  : "visitor"
			},
			options : { sort: { 'updated_at': -1 } }
		})
		.then(function (post) {
			if (!post) {
				return Promise.reject(new errors.ValidationError("POST 不存在..."))
			}
			return post;
		})
}
