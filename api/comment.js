/**
 * Created by zeev on 2016/11/6 0006.
 */
var Promise = require('bluebird'),
    _ = require('lodash'),
    errors = require("../errors"),
    debug = require('debug')('zeev:comment'),
    Post = global.dbHelper.getModel("Post"),
    utils = require('../utils'),
    Comment = global.dbHelper.getModel('Comment'),
    pipeline = require('../utils/pipeline');

exports.addPostComment = function(object, options) {
    var tasks;

    function createComment(_object) {
        return Comment.create({
            content: _object.content,
            visitor: _object._v
        })
    }

    function updatePost(comment) {
        return Post.findOneAndUpdate({ _id: options.id }, {
            $push: {
                comments: comment
            }
        }).then(function(post) {
            if (post) {
                return post;
            }
            return Promise.reject(new errors.NotFoundError("POST 不存在！"));
        })
    }


    tasks = [
        createComment,
        updatePost
    ];

    // Pipeline calls each task passing the result of one to be the arguments for the next
    return pipeline(tasks, object, options)
        .then(function formatResponse(result) {
            return result;
        });
}
