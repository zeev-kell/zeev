/**
 * Created by Administrator on 2016/11/4 0004.
 */

var Comment = global.dbHelper.getModel("Comment");
var Post = global.dbHelper.getModel("Post");
var Visitor = global.dbHelper.getModel("Visitor");
var errors = require("../errors");
var essay = require("./essay");
exports.addComment = function (req, res, next) {
	var _id = req.params.id;
	var comment = new Comment({
		content : req.body.content,
		visitor : { _id: "57283e80a7f579281373870b" },
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