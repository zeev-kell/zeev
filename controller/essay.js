/**
 * Created by zeev on 2016/10/12 0012.
 */


var Post = global.dbHelper.getModel("Post");
var Tag = global.dbHelper.getModel("Tag");
var Promise = require('bluebird');
var errors = require("../errors");
var moment = require("moment");

var api = require("../api"),
    post = require("../api").post,
    tag = require("../api").tag;


exports.renderIndex = function(req, res, next) {
    Promise.all([
        post.getList(),
        tag.getList(),
        post.getAggregate()
    ]).spread(function(posts, tags, archives) {
        res.render('essay/index', { title: '首页 - 柯子源的个人网站', posts: posts, tags: tags, archives: archives });
    }).catch(errors.handleError(next))
};

exports.renderPostInfo = function(req, res, next) {
    var _id = req.params.id;
    post.findOneAndReview(_id)
        .then(function(_post) {
            return Promise.all([
                Post.findOne({ "created_at": { "$gt": _post.created_at } }, "_id title"),
                Post.findOne({ "created_at": { "$lt": _post.created_at } }, "_id title"),
                tag.getList(),
                post.getAggregate()
            ]).spread(function(prePost, nextPost, tags, archives) {
                return res.render("essay/post", {
                    title: _post.title + " - 柯子源的个人网站",
                    post: _post,
                    prePost: prePost,
                    nextPost: nextPost,
                    tags: tags,
                    archives: archives,
                    comments: _post.comments
                });
            })
        }).catch(errors.handleError(next))
};

exports.redirectPostInfo = function(req, res, next) {
    res.redirect("/essay/post/" + req.params.id)
}


exports.renderArchive = function(req, res, next) {
    post.getAggregate()
        .then(function(archives) {
            res.render('essay/archive', { title: '归档 - 柯子源的个人网站', archives: archives });
        }).catch(errors.handleError(next))
}

exports.renderTags = function(req, res, next) {
    var _id = req.params.id;
    Promise.all([
        Tag.findOne({ _id: _id }, "name"),
        post.getList({ tags: _id }),
        tag.getList(),
        post.getAggregate()
    ]).spread(function(tag, posts, tags, archives) {
        res.render('essay/index', {
            title: "标签：" + tag.name + " - 柯子源的个人网站",
            _header: "标签：" + tag.name,
            posts: posts,
            tags: tags,
            archives: archives
        });
    }).catch(errors.handleError(next))
}

exports.renderArchiveByTime = function(req, res, next) {
    var date = req.params.date;
    date = moment(date, "YYYY-MM");
    if (!date.isValid()) {
        return next(new errors.BadRequestError("date is invalid ..."));
    }
    var _date = date.set('date', 1).format();
    var date_ = date.set('date', date.daysInMonth()).format();
    Promise.all([
        post.getList({ created_at: { $gte: _date, $lt: date_ } }),
        tag.getList(),
        post.getAggregate()
    ]).spread(function(posts, tags, archives) {
        return res.render('essay/index', {
            title: '归档 - ' + date.format("YYYY-MM") + " - 柯子源的个人网站",
            posts: posts,
            tags: tags,
            archives: archives,
            _header: "月份：" + date.format("YYYY-MM")
        });
    }).catch(errors.handleError(next))
}
