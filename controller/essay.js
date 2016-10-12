/**
 * Created by zeev on 2016/10/12 0012.
 */

var Post = global.dbHelper.getModel("Post");
var Tag = global.dbHelper.getModel("Tag");

module.exports.getPostInfo = function (req, res) {
	var id = req.param("id");
	Post.getOneById(id)
		.then(function (post) {
			res.render("essay/post", { title: 'zeev - ' + post.title, post: post });
		})
};

module.exports.index = function (req, res, next) {
	Promise.all([
		Post.getList(res),
		Tag.find({}, "_id name")
	])
		.then(function (docs) {
			res.render('essay/index', { title: 'zeev - 随笔', posts: docs[0], tags: docs[1] });
		})
};