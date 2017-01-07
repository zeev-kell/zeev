/**
 * Created by zeev on 2016/10/12 0012.
 */
'use strict';
const errors = require("../errors"),
	  path   = require('path'),
	  _      = require('lodash');
let isProduction,
	  _dist,
	  isDevelopment;

if (process.env.NODE_ENV === "development") {
	_dist         = "core";
	isDevelopment = true;
	isProduction  = false;
} else {
	_dist         = "dist";
	isDevelopment = false;
	isProduction  = true;
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

exports.postCondense = function (posts) {
	let reg = /(<[/]+(.*?)>)|(<(.*?)>)|(\n)/g;
	let l   = 250;// 获取的长度
	let e   = 350;
	posts.map(function (post) {
		var index;
		if (post.html.length > l) {
			index = post.html.indexOf(' ', e); // l - l+100 内 如果找到 空格 就以空格为结束
			index = index == -1 ? l : index > e ? l : index;
		} else {
			index = post.html.length;
		}
		post.html = post.html.replace(reg, '').substring(0, index) + "..."; // 去掉所有的<*></*>
	})
	return posts;
}

exports.filterPost = function (req, posts) {
	let reg = /(<[/]+(.*?)>)|(<(.*?)>)|(\n)/g;
	let l   = 250;// 获取的长度
	let e   = 350;
	posts.map(function (post) {
		if (typeof req.query.full === "undefined") {
			var index; // 获取 200 长度 内的数据
			if (post.html.length > l) {
				index = post.html.indexOf(' ', l); // 100-200 内 如果找到 空格 就以空格为结束
				index = index == -1 ? l : index > e ? l : index;
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

exports._dist         = _dist;
exports.isProduction  = isProduction;
exports.isDevelopment = isDevelopment;

exports.env_path = function (_path) {
	return path.join(__dirname, "../", _dist, _path);
}

exports._path = function (_path) {
	return path.join(__dirname, "../", _path);
}
