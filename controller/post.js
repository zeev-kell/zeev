/**
 * Created by zeev on 2016/10/12 0012.
 */

var Post      = global.dbHelper.getModel("Post");
var Tag       = global.dbHelper.getModel("Tag");
var User      = global.dbHelper.getModel("User");
var moment    = require("moment");
var errors    = require("../errors");
var utils     = require("../utils");
var showdown  = require('showdown'),
	admin     = require('../socket').admin,
	converter = new showdown.Converter();


var api  = require("../api"),
	post = require("../api").post,
	tag  = require("../api").tag;

exports.getPosts    = function (req, res, next) {
	post.getList({}, { status: { $gte: 0 } })
		.then(function (posts) {
			return res.status(200).send(posts);
		}).catch(errors.handleError(next))
}
;
exports.getPostInfo = function (req, res, next) {
	var id = req.params.id;
	post.findById(id)
		.then(function (post) {
			return res.status(200).send(post);
		}).catch(errors.handleError(next))
};

exports.updatePost = function (req, res, next) {
	var _id  = req.params.id;
	var tags = req.body.tags || [];
	tags     = tags.map(function (tag) {
		if (!tag._id) {
			var _tag = new Tag(tag);
			_tag.save();
			return _tag;
		}
		return tag;
	})
	Post.findOneAndUpdate({ _id: _id }, {
		$set: {
			title           : req.body.title,
			markdown        : req.body.markdown,
			html            : converter.makeHtml(req.body.markdown || ""),
			image           : req.body.image,
			tags            : tags,
			author          : req.session.user,
			published_at    : new Date(),
			updated_at      : new Date(),
			meta_title      : req.body.meta_title,
			meta_description: req.body.meta_description
		}
	}, { new: true })
		.populate({ path: 'author', select: 'name' })
		.populate({ path: 'tags', select: '_id name' })
		.then(function (post) {
			if (post) {
				//				post.tags = tags;
				return res.status(200).send(post);
			} else {
				return next(new errors.NotFoundError({ msg: 'post不存在' }))
			}
		}).catch(errors.handleError(next))
}

exports.addPost = function (req, res, next) {
	return Post.create({
		title           : req.body.title,
		markdown        : req.body.markdown,
		html            : converter.makeHtml(req.body.markdown || ""),
		image           : req.body.image,
		author          : req.session.user,
		meta_title      : req.body.meta_title,
		meta_description: req.body.meta_description
	}).then(function (post) {
		return res.status(200).send(post);
	}).catch(errors.handleError(next))
}

exports.removePost = function (req, res, next) {
	var _id = req.params.id;
	Post.findByIdAndRemove(_id)
		.then(function (post) {
			return res.status(200).send({ msg: '删除成功' })
		}).catch(errors.handleError(next))
}
