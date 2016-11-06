/**
 * Created by Administrator on 2016/11/4 0004.
 */

var Comment = global.dbHelper.getModel("Comment");
var Post    = global.dbHelper.getModel("Post");
var Visitor = global.dbHelper.getModel("Visitor"),
	api     = require("../api"),
	errors  = require("../errors");
var essay   = require("./essay");

exports.checkVisitor = function (req, res, next) {
	if (1) {

	}
	if (!req.cookies._v) {
		Visitor
			.findOne({ email: req.body.email })
			.then(function (visitor) {
				console.log("visitor", visitor);
				if (visitor) {
					res.cookie('_v', visitor._id);
					res.cookie('email', visitor.email);
					next();
				} else {
					var _v       = new Visitor({
						email: req.body.email,
						name : req.body.name,
						url  : req.body.url,
						ip   : req.ip
					});
					var validate = _v.validateSync();
					if (validate && validate.errors) {
						errors.handleAPIError(new errors.ValidationError(), req, res, next);
					}
					_v.save()
						.then(function (_visitor) {
							console.log("_visitor", _visitor);
							if (_visitor) {
								res.cookie('_v', _visitor._id);
								res.cookie('email', _visitor.email);
								next();
							} else {
								errors.handleAPIError(new errors.ValidationError(), req, res, next);
							}
						})
				}
			})
	}
}


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