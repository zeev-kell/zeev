/**
 * Created by zeev on 2016/10/12 0012.
 */

var Post = global.dbHelper.getModel("Post");
var Tag = global.dbHelper.getModel("Tag");
var showdown = require('showdown'),
	converter = new showdown.Converter();

var filterPost = function (req, posts) {
	var reg = /(<[/]+(.*?)>)|(<(.*?)>)|(\n)/g;
	posts.map(function (post) {
		if (typeof req.query.full !== "string") {
			var index;// 获取 200 长度 内的数据
			if (post.html.length > 100) {
				index = post.html.indexOf(' ', 100);
				index = index > 200 ? 100 : index;
			} else {
				index = post.html.length;
			}
			post.html = post.html.replace(reg, '').substring(0, index) + "...";// 去掉所有的<*></*>
		}
		if (typeof req.query.markdown !== "string") {
			post.markdown = "";
		}
	})
	return posts;
}

exports.getPosts = function (req, res) {
	Post.getList()
		.then(function (posts) {
			posts = filterPost(req, posts);
			return res.status(200).send(posts);
		})
};
exports.getPostInfo = function (req, res) {
	var id = req.params.id;
	Post.getOneById(id)
		.then(function (post) {
			return res.status(200).send(post);
		})
};

exports.updatePost = function (req, res) {
	var _id = req.params.id;
	Post.findOneAndUpdate({ _id: _id }, {
		$set: {
			title           : req.body.title,
			markdown        : req.body.markdown,
			html            : converter.makeHtml(req.body.markdown || ""),
			image           : req.body.image,
			tags            : [],
			updated_at      : new Date(),
			meta_title      : req.body.meta_title,
			meta_description: req.body.meta_description
		}
	}).then(function (post) {
		if (post) {
			return res.status(200).send(post);
		} else {
			return res.status(400).send({ msg: 'post不存在' })
		}
	})
}

exports.renderPostInfo = function (req, res) {
	var id = req.param("id");
	Post.getOneById(id)
		.then(function (post) {
			res.render("essay/post", { title: 'zeev - ' + post.title, post: post });
		})
};

exports.renderIndex = function (req, res, next) {
	Promise.all([
		Post.getList(),
		Tag.find({}, "_id name")
	])
		.then(function (docs) {
			res.render('essay/index', { title: 'zeev - 随笔', posts: docs[0], tags: docs[1] });
		})
};
