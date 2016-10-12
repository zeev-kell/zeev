/**
 * Created by keziyuan on 2016/2/17.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var debug = require('debug')('zeev:schema');

var PostSchema = new mongoose.Schema({
	title           : { type: String, required: true },
	slug            : { type: String, max: 150, unique: false },
	markdown        : { type: String, max: 16777215, required: false },
	html            : { type: String, max: 16777215, required: false },
	image           : { type: String },
	featured        : { type: Boolean, required: false, default: false },
	page            : { type: Boolean, required: false, default: false },
	status          : { type: String, max: 150, required: true, default: 'draft' },
	meta_title      : { type: String, max: 150, required: false },
	meta_description: { type: String, max: 200, required: false },
	author          : { type: ObjectId, ref: "User" },
	tags            : [{ type: ObjectId, ref: "Tag" }],
	created_at      : { type: Date, default: Date.now() },
	updated_at      : { type: Date, default: Date.now() },
	published_at    : { type: Date, default: Date.now() },
	review          : { type: Number, default: 0 }
})

PostSchema.pre('save', function (next) {
	debug("save:post");
	next();
})

PostSchema.pre('update', function (next) {
	debug("update:post");
	next();
});

PostSchema.statics = {
	getList   : function () {
		return this
			.find({})
			.populate({ path: 'author', select: 'name' })
			.populate({ path: 'tags', select: '_id name' })
			.sort({ 'updated_at': -1 })
	},
	getOneById: function (id) {
		return this
			.findOne({ _id: id })
			.populate({ path: 'author', select: 'name' })
			.populate({ path: 'tags', select: '_id name' })
	}
}

module.exports = PostSchema;