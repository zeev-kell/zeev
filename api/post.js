/**
 * Created by zeev on 2016/11/6 0006.
 */

var Post = global.dbHelper.getModel("Post"),
    _ = require('lodash'),
    Promise = require('bluebird'),
    validate = require("../utils/validate"),
    errors = require("../errors"),
    utils = require("../utils"),
    moment = require("moment");

exports.create = function() {

}

exports.getList = function(query, options) {
    query = query || {};
    options = options || { markdown: 0 };
    return Post.find(query, options)
        .populate({ path: 'author', select: '-_id name' })
        .populate({ path: 'tags', select: '_id name' })
        .populate({
            path: 'comments',
            match: { status: 11 }
        })
        .sort({ 'updated_at': -1 })
        .then(function(posts) {
            if (typeof options.full === "undefined") {
                posts = utils.postCondense(posts);
            }
            return posts;
        })
}

exports.getAggregate = function() {
    return Post.aggregate([{
        $group: {
            _id: {
                M: { $month: "$created_at" },
                d: { $dayOfMonth: "$created_at" },
                y: { $year: "$created_at" }
            },
            posts: { $push: { title: "$title", _id: "$_id" } },
            count: { $sum: 1 }
        }
    }, {
        $sort: { "_id": -1 }
    }]).then(function(posts) {
        /**
         * 把聚合之后的id转换成日期格式
         */
        posts.map(function(post) {
            post._id.M = post._id.M - 1;
            post._id.d = 0;
            post._id = moment(post._id).format();
        })
        return posts;
    })
}

exports.findOneAndReview = function(_id, _v) {
    if (!validate.isObjectId(_id)) {
        return Promise.reject(new errors.ValidationError("非法ID..."))
    }
    return Post
        .findOneAndUpdate({ _id: _id }, {
            $inc: { review: 1 }
        })
        .populate({ path: 'author', select: '-_id name' })
        .populate({ path: 'tags', select: '_id name' })
        .populate({
            path: 'comments',
            match: _v ? { "$or": [{ status: 11 }, { visitor: { _id: _v } }] } : { status: 11 },
            populate: {
                path: "visitor",
                select: '-_id url name'
            },
            options: { sort: { 'updated_at': -1 } }
        })

    .then(function(post) {
        if (!post) {
            return Promise.reject(new errors.ValidationError("POST 不存在..."))
        }
        return post;
    })
}

exports.findById = function(_id) {
    return Post
        .findOne({ _id: _id })
        .populate({ path: 'author', select: 'name' })
        .populate({ path: 'tags', select: '_id name' })
        .populate({
            path: 'comments',
            populate: {
                path: "visitor",
                select: '_id url name'
            },
            options: { sort: { 'updated_at': -1 } }
        })
        .then(function(post) {
            if (!post) {
                return Promise.reject(new errors.ValidationError("POST 不存在..."))
            }
            return post;
        })
}
