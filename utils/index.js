/**
 * Created by zeev on 2016/10/12 0012.
 */

var errors = require("../errors");
var path = require('path');
var _ = require('lodash');
var isProduction, _dist, isDevelopment;

if (process.env.NODE_ENV === "development") {
    _dist = "core";
    isDevelopment = true;
    isProduction = false;
} else {
    _dist = "dist";
    isDevelopment = false;
    isProduction = true;
}

//exports.ejs = require("./ejs");

exports.handleError = function (res, fun) {
    return function (err, doc) {
        if (err) {
            res.sendStatus(500);
        } else {
            fun(doc);
        }
    }
}

exports.filterPost = function (req, posts) {
    var reg = /(<[/]+(.*?)>)|(<(.*?)>)|(\n)/g;
    posts.map(function (post) {
        if (typeof req.query.full === "undefined") {
            var index; // 获取 200 长度 内的数据
            if (post.html.length > 100) {
                index = post.html.indexOf(' ', 100); // 100-200 内 如果找到 空格 就以空格为结束
                index = index == -1 ? 100 : index > 200 ? 100 : index;
            } else {
                index = post.html.length;
            }
            post.html = post.html.replace(reg, '').substring(0, index) + "..."; // 去掉所有的<*></*>
        }
        if (typeof req.query.markdown === "undefined") {
            post.markdown = "";
        }
    })
    return posts;
}

exports._dist = _dist;
exports.isProduction = isProduction;
exports.isDevelopment = isDevelopment;

exports.env_path = function (_path) {
    return path.join(__dirname, "../", _dist, _path);
}

exports._path = function (_path) {
    return path.join(__dirname, "../", _path);
}

exports.validate = function (docName, extras) {
    return function daValidate() {
        var object, option, permittedOptions;
        if (arguments.length === 2) {
            object = arguments[0];
            option = _.clone(arguments[1] || {});
        }
    }
}