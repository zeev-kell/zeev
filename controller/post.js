/**
 * Created by zeev on 2016/10/12 0012.
 */

var Post = global.dbHelper.getModel("Post");
var Tag = global.dbHelper.getModel("Tag");
var User = global.dbHelper.getModel("User");
var moment = require("moment");
var utils = require("../utils");
var showdown = require('showdown'),
    converter = new showdown.Converter();

exports.getPosts = function(req, res) {
    Post.getList()
        .then(function(posts) {
            posts = utils.filterPost(req, posts);
            return res.status(200).send(posts);
        })
};
exports.getPostInfo = function(req, res) {
    var id = req.params.id;
    Post.getOneById(id)
        .then(function(post) {
            return res.status(200).send(post);
        })
};

exports.updatePost = function(req, res) {
    var _id = req.params.id;
    var tags = req.body.tags || [];
    tags = tags.map(function(tag) {
        if (!tag._id) {
            var _tag = new Tag(tag);
            _tag.save();
            return _tag;
        }
        return tag;
    })
    Post.findOneAndUpdate({ _id: _id }, {
            $set: {
                title: req.body.title,
                markdown: req.body.markdown,
                html: converter.makeHtml(req.body.markdown || ""),
                image: req.body.image,
                tags: tags,
                author: { _id: "570a7073e1eb2b38104f06a0" },
                updated_at: new Date(),
                meta_title: req.body.meta_title,
                meta_description: req.body.meta_description
            }
        })
        .populate({ path: 'author', select: 'name' })
        .populate({ path: 'tags', select: '_id name' })
        .then(function(post) {
            if (post) {
                post.tags = tags;
                return res.status(200).send(post);
            } else {
                return res.status(400).send({ msg: 'post不存在' })
            }
        })
}

exports.addPost = function(req, res) {
    Post.create({
        title: req.body.title,
        markdown: req.body.markdown,
        html: converter.makeHtml(req.body.markdown || ""),
        image: req.body.image,
        author: { _id: "570a7073e1eb2b38104f06a0" },
        meta_title: req.body.meta_title,
        meta_description: req.body.meta_description
    }).then(function(post) {
        return res.status(200).send(post);
    })
}
