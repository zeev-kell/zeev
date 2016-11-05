/**
 * Created by zeev on 2016/10/12 0012.
 */


var Post = global.dbHelper.getModel("Post");
var Tag = global.dbHelper.getModel("Tag");
var User = global.dbHelper.getModel("User");
var Comment = global.dbHelper.getModel("Comment");
var Promise = require('bluebird');
var utils = require("../utils");
var errors = require("../errors");
var moment = require("moment");

function getPostList(options) {
    return Post.getList(options).then(function (posts) {
        return utils.filterPost({query: {}}, posts);
    })
}

function getTagsList() {
    return Tag.find({}, "_id name");
}

function getPostAggregate() {
    return Post.aggregate([{
        $group: {
            _id  : {
                M: {$month: "$created_at"},
                d: {$dayOfMonth: "$created_at"},
                y: {$year: "$created_at"}
            },
            posts: {$push: {title: "$title", _id: "$_id"}},
            count: {$sum: 1}
        }
    }, {
        $sort: {"_id": -1}
    }]).then(function (posts) {
        /**
         * 把聚合之后的id转换成日期格式
         */
        posts.map(function (post) {
            post._id.M = post._id.M - 1;
            post._id.d = 0;
            post._id = moment(post._id).format();
        })
        return posts;
    })
}

exports.renderPostInfo = function (req, res, next) {
    var _id = req.params.id;
    return Post
        .findOneAndUpdate({_id: _id}, {
            $inc: {review: 1}
        })
        .then(function (post) {
            if (!post) {
                return res.render("404", {msg: "不存在"});
            }
            return Promise.all([
                Post.findOne({"created_at": {"$gt": post.created_at}}, "_id title"),
                Post.findOne({"created_at": {"$lt": post.created_at}}, "_id title"),
                getTagsList(),
                getPostAggregate()
            ]).spread(function (prePost, nextPost, tags, archives) {
                res.render("essay/post", {
                    title   : post.title + " - 柯子源的个人网站",
                    post    : post,
                    prePost : prePost,
                    nextPost: nextPost,
                    tags    : tags,
                    archives: archives,
                    comments: post.comments
                });
            }).catch(errors.handleError(next))
        }).catch(errors.handleError(next))
};

exports.renderIndex = function (req, res, next) {
    Promise.all([
        getPostList(),
        getTagsList(),
        getPostAggregate()
    ]).spread(function (posts, tags, archives) {
        res.render('essay/index', {title: '首页 - 柯子源的个人网站', posts: posts, tags: tags, archives: archives});
    }).catch(errors.handleError(next))
};

exports.renderArchive = function (req, res, next) {
    getPostAggregate()
        .then(function (docs) {
            res.render('essay/archive', {title: '归档 - 柯子源的个人网站', archives: docs});
        }).catch(errors.handleError(next))
}

exports.renderTags = function (req, res, next) {
    var _id = req.params.id;
    Promise.all([
        Tag.findOne({_id: _id}, "name"),
        getPostList(),
        getTagsList(),
        getPostAggregate()
    ]).spread(function (tag, posts, tags, archives) {
            res.render('essay/index', {
                title   : "标签：" + tag.name + " - 柯子源的个人网站",
                _header : "标签：" + tag.name,
                posts   : posts,
                tags    : tags,
                archives: archives
            });
        }
    ).catch(errors.handleError(next))
}

exports.renderArchiveByTime = function (req, res, next) {
    var date = req.params.date;
    date = moment(date, "YYYY-MM");
    if (!date.isValid()) {
        return next(new errors.BadRequestError("date is invalid ..."));
    }
    var _date = date.set('date', 1).format();
    var date_ = date.set('date', date.daysInMonth()).format();
    Promise.all([
        getPostList({created_at: {$gte: _date, $lt: date_}}),
        getTagsList(),
        getPostAggregate()
    ]).spread(function (posts, tags, archives) {
        return res.render('essay/index', {
            title   : '归档 - ' + date.format("YYYY-MM") + " - 柯子源的个人网站",
            posts   : posts,
            tags    : tags,
            archives: archives,
            _header : "月份：" + date.format("YYYY-MM")
        });
    }).catch(errors.handleError(next))
}
