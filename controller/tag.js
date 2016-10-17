/**
 * Created by Administrator on 2016/5/9 0009.
 */
var Tag = global.dbHelper.getModel("Tag");
var util = require('util');
var errors = require("../errors");
var utils = require("../utils");
var debug = require('debug')('zeev:tag');

exports.create = function (tags, cb) {
	if (!util.isArray(tags)) {
		tags = [].push(tags);
	}
	var isNewTags = tags.filter(function (tag) {
		return tag.isNew
	}).map(function (tag) {
		return { name: tag.name }
	})
	return Tag.create(isNewTags, function (err, createdTags) {
		if (err) {
			debug(err);
			cb(err, createdTags);
		}
		tags = tags.map(function (tag) {
			if (!tag.isNew) {
				return tag;
			} else {
				var createdTag = createdTags.filter(function (create) {
					return create.name == tag.name;
				})[0]
				return { _id: createdTag._id, name: createdTag.name }
			}
		})
		cb(err, tags);
	});
}

exports.getTags = function (req, res, next) {
	Tag.find({}, "_id name")
		.then(function (tags) {
			return res.status(200).send(tags);
		}).catch(errors.handleError(next))
}

function add(req, res) {
	debug(req.body);
	Tag.create({
		name: req.body.name
	}, function (err, tag) {
		if (err) {
			return res.sendStatus(500);
		}
		return res.status(200).send(tag);
	});
}

function get(req, res) {
	var _id = req.params._id || req.query._id;
	debug(_id);
	Tag.getOneById(_id, function (err, tag) {
		if (err) {
			debug(err);
			return res.sendStatus(500);
		}
		if (!post) {
			return res.status(404).send({ "msg": "post不存在" });
		}
		tag = extend({}, tag._doc);
		return res.status(200).send(tag);
	})
}

function remove(req, res) {
	var _id = req.params._id || req.body._id;
	debug(_id);
	Tag.findByIdAndRemove(_id, function (err, doc) {
		if (err) {
			debug(err);
			return res.sendStatus(500);
		}
		if (doc) {
			return res.status(200).send({ msg: '删除成功' })
		} else {
			return res.status(400).send({ msg: 'tag不存在' })
		}
	})
}

function update(req, res) {
	var _id = req.body._id;
	debug(_id);
	Tag.findOneAndUpdate({ _id: _id }, {
		$set: {
			title           : req.body.title,
			markdown        : req.body.markdown,
			html            : converter.makeHtml(req.body.markdown || ""),
			image           : req.body.image,
			meta_title      : req.body.meta_title,
			meta_description: req.body.meta_description
		}
	}, function (err, doc) {
		if (err) {
			debug(err);
			return res.sendStatus(500);
		}
		if (doc) {
			return res.status(200).send(doc);
		} else {
			return res.status(400).send({ msg: 'post不存在' })
		}
	})
}
