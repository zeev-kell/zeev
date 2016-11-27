/**
 * Created by Administrator on 2016/11/4 0004.
 */

var Comment = global.dbHelper.getModel("Comment");
var Post = global.dbHelper.getModel("Post");
var Visitor = global.dbHelper.getModel("Visitor"),
    api = require("../api"),
    errors = require("../errors"),
    essay = require("./essay");

exports.auditingComment = function(req, res, next) {
    return api.comment
        .updateComment({ _id: req.params.id }, { status: req.body.status })
        .then(function(comment) {
            return res.status(200).send(comment);
        })
        .catch(errors.handleError(next))
}

exports.getNotViewedComment = function(req, res, next) {
    var options = {};
    if (req.query.limit) {
        options.limit = req.query.limit;
    }
    return api.comment
        .getList({ status: 0 },options)
        .then(function(comments) {
            return res.status(200).send(comments);
        })
        .catch(errors.handleError(next))
}

exports.removeComment = function(req, res, next) {
    var id = req.params.id;
    return api.comment
        .removeComment({ _id: id })
        .then(function(comments) {
            return res.status(200).send(comments);
        })
        .catch(errors.handleError(next))
}
