/**
 * Created by zeev on 2016/10/12 0012.
 */


var Post = global.dbHelper.getModel("Post");
var Tag = global.dbHelper.getModel("Tag");
var User = global.dbHelper.getModel("User");
var Promise = require('bluebird');
var utils = require("../utils");
var Promise = require('bluebird');
var errors = require("../errors");
var moment = require("moment");

exports.renderPostInfo = function(req, res, next) {
    var _id = req.params.id;
    Post.getOneById(_id)
        .then(function(post) {
            res.render("essay/post", { title: 'zeev - ' + post.title, post: post });
        }).catch(errors.handleError(next))
};

exports.renderIndex = function(req, res, next) {
    Promise.all([
        Post.getList().then(function(posts) {
            return utils.filterPost({ query: {} }, posts);
        }),
        Tag.find({}, "_id name"),
        Post.aggregate({
            $group: {
                _id: {
                    M: { $month: "$created_at" },
                    d: { $dayOfMonth: "$created_at" },
                    y: { $year: "$created_at" }
                },
                posts: { $push: { title: "$title", _id: "$_id" } },
                count: { $sum: 1 }
            }
        }).then(function(posts) {
            posts.map(function(post) {
                post._id.M = post._id.M - 1;
                post._id.d = 0;
                post._id = moment(post._id).format();
            })
            return posts;
        })
    ]).then(function(docs) {
        res.render('essay/index', { title: 'zeev - 随笔', posts: docs[0], tags: docs[1], archives: docs[2] });
    }).catch(errors.handleError(next))
};

exports.renderArchive = function(req, res, next) {
    Post.aggregate({
        $group: {
            _id: {
                M: { $month: "$created_at" },
                d: { $dayOfMonth: "$created_at" },
                y: { $year: "$created_at" }
            },
            posts: { $push: { title: "$title", _id: "$_id", created_at: "$created_at" } },
            count: { $sum: 1 }
        }
    }).then(function(docs) {
        res.render('essay/archive', { title: 'zeev - 归档', archives: docs });
    }).catch(errors.handleError(next))
}

exports.renderTags = function(req, res, next) {
    var _id = req.params.id;
    Promise.all([
        Post.getList({ tags: { _id: _id } }).then(function(posts) {
            if (posts.length > 0) {
                return utils.filterPost({ query: {} }, posts);
            } else {
                return [];
            }
        }),
        Tag.find({}, "_id name"),
        Post.aggregate([{
            $group: {
                _id: {
                    M: { $month: "$created_at" },
                    d: { $dayOfMonth: "$created_at" },
                    y: { $year: "$created_at" }
                },
                posts: { $push: { title: "$title", _id: "$_id" } },
                count: { $sum: 1 }
            }
        }]).then(function(posts) {
            posts.map(function(post) {
                post._id.M = post._id.M - 1;
                post._id.d = 0;
                post._id = moment(post._id).format();
            })
            return posts;
        }),
        Tag.findOne({ _id: _id }, "name").then(function(tag) {
            if (tag) {
                return tag;
            } else {
                return next(new errors.ValidationError("_id is unvilad !"))
            }
        })
    ]).then(function(docs) {
        res.render('essay/index', { title: 'zeev - 标签 ', posts: docs[0], tags: docs[1], archives: docs[2], _header: "标签：" + docs[3].name });
    }).catch(errors.handleError(next))
}

exports.renderArchiveByTime = function(req, res, next) {
    var date = req.params.date;
    date = moment(date,"YYYY-MM");
    if (!date.isValid()) {
        return next(new errors.BadRequestError("date is invalid ..."));
    }
    var _date = date.set('date', 1).format();
    var date_ = date.set('date', date.daysInMonth()).format()

    Promise.all([
        Post.getList({ created_at: { $gte: _date, $lt: date_ } })
        .then(function(posts) {
            return utils.filterPost({ query: {} }, posts);
        }),
        Tag.find({}, "_id name"),
        Post.aggregate([{
            $group: {
                _id: {
                    M: { $month: "$created_at" },
                    d: { $dayOfMonth: "$created_at" },
                    y: { $year: "$created_at" }
                },
                posts: { $push: { title: "$title", _id: "$_id" } },
                count: { $sum: 1 }
            }
        }]).then(function(posts) {
            posts.map(function(post) {
                post._id.M = post._id.M - 1;
                post._id.d = 0;
                post._id = moment(post._id).format();
            })
            return posts;
        })
    ]).then(function(docs) {
        return res.render('essay/index', { title: 'zeev - 归档 ' + date.format("YYYY-MM"), posts: docs[0], tags: docs[1], archives: docs[2], _header: "月份：" + date.format("YYYY-MM") });
    }).catch(errors.handleError(next))
}
