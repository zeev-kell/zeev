/**
 * Created by Administrator on 2016/11/4 0004.
 */

var Comment = global.dbHelper.getModel("Comment");
var Post    = global.dbHelper.getModel("Post");
var Visitor = global.dbHelper.getModel("Visitor"),
	api     = require("../api"),
	errors  = require("../errors");
var essay   = require("./essay");


exports.addComment = function (req, res, next) {
	var _id      = req.params.id;
	var comment  = new Comment({
		content : req.body.content,
		visitor : { _id: req.cookies._v },
		relation: _id
	});
	var validate = comment.validateSync();
	if (validate && validate.errors) {
		return errors.handleAPIError(new errors.ValidationError(), req, res, next);
	}
	comment.save();
	Post.findOneAndUpdate({ _id: _id }, {
		$push: {
			comments: comment
		}
	}).then(function (post) {
		if (post) {
			req.params.id = post.id;
			return essay.renderPostInfo(req, res, next);
		} else {
			return res.render("404", { msg: "不存在" });
		}
	}).catch(errors.handleError(next))
}

exports.getComments = function (req, res, next) {
	Comment.find()
		.then(function () {

		})
}

exports.addCommentAndRender = function (req, res, next) {
	var _id = req.params.id;
	api.comment.create({
		content: req.body.content,
		visitor: req.body._v
	}).then(function (comment) {
		Post.findOneAndUpdate({ _id: _id }, {
			$push: {
				comments: comment
			}
		}).then(function (post) {
			if (post) {
				req.params.id = post.id;
				return essay.renderPostInfo(req, res, next);
			} else {
				return res.render("404", { msg: "不存在" });
			}
		}).catch(errors.handleError(next))
	})
}