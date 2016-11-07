/**
 * Created by zeev on 2016/11/6 0006.
 */

var Post = global.dbHelper.getModel("Post"),
    Promise = require('bluebird'),
    validate = require("../utils/validate"),
    errors = require("../errors"),
    moment = require("moment");

exports.create = function() {

}

exports.getList = function(options) {
    return Post.getList(options)
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

exports.findOneAndReview = function(_id) {
    if (!validate.isObjectId(_id)) {
        return Promise.reject(new errors.ValidationError("非法ID..."))
    }
    return Post.findOneAndUpdateById({ _id: _id }, {
            $inc: { review: 1 }
        })
        .then(function(post) {
            if (!post) {
                return Promise.reject(new errors.ValidationError("POST 不存在..."))
            }
            return post;
        })
}
