/**
 * Created by zeev on 2016/10/12 0012.
 */

var Post = global.dbHelper.getModel("Post");
var Tag = global.dbHelper.getModel("Tag");
var User = global.dbHelper.getModel("User");
var moment = require("moment");
var errors = require("../errors");
var utils = require("../utils");
var showdown = require('showdown'),
	converter = new showdown.Converter();

exports.getPosts = function (req, res, next) {
	Post.getList()
		.then(function (posts) {
			posts = utils.filterPost(req, posts);
			return res.status(200).send(posts);
		}).catch(errors.handleError(next))
};
exports.getPostInfo = function (req, res, next) {
	var id = req.params.id;
	Post.findById(id)
		.then(function (post) {
			return res.status(200).send(post);
		}).catch(errors.handleError(next))
};

exports.updatePost = function (req, res, next) {
	var _id = req.params.id;
	var tags = req.body.tags || [];
	tags = tags.map(function (tag) {
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
			updated_at      : new Date(),
			meta_title      : req.body.meta_title,
			meta_description: req.body.meta_description
		}
	}, {
		returnNewDocument: true
	})
		.populate({ path: 'author', select: 'name' })
		.populate({ path: 'tags', select: '_id name' })
		.then(function (post) {
			if (post) {
				post.tags = tags;
				return res.status(200).send(post);
			} else {
				return next(new errors.NotFoundError({ msg: 'post不存在' }))
			}
		}).catch(errors.handleError(next))
}

exports.addPost = function (req, res, next) {
	Post.create({
		title           : req.body.title,
		markdown        : req.body.markdown,
		html            : converter.makeHtml(req.body.markdown || ""),
		image           : req.body.image,
		author          : { _id: "570a7073e1eb2b38104f06a0" },
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
