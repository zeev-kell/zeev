/**
 * Created by keziyuan on 2016/2/17.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var debug = require('debug')('zeev:schema');

var PostSchema = new Schema({
    title           : {type: String, required: true},
    slug            : {type: String, max: 150, unique: false},
    markdown        : {type: String, max: 16777215, required: false},
    html            : {type: String, max: 16777215, required: false},
    image           : {type: String},
    featured        : {type: Boolean, required: false, default: false},
    page            : {type: Boolean, required: false, default: false},
    status          : {type: String, max: 150, required: true, default: 'draft'},
    meta_title      : {type: String, max: 150, required: false},
    meta_description: {type: String, max: 200, required: false},
    author          : {type: ObjectId, ref: "User"},
    tags            : [{type: ObjectId, ref: "Tag"}],
    comments        : [{type: ObjectId, ref: "Comment"}],
    published_at    : {type: Date, default: Date.now()},
    review          : {type: Number, default: 0}
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

PostSchema.pre('save', function (next) {
    debug("save:post");
    next();
})
//
//PostSchema.pre('update', function (error, res, next) {
//	debug("update:post");
//	next();
//});
//
//PostSchema.post('init', function (doc) {
//	debug('%s has been initialized from the db', doc._id);
//});
//PostSchema.post('validate', function (doc) {
//	debug('%s has been validated (but not saved yet)', doc._id);
//});
//PostSchema.post('save', function (doc) {
//	debug('%s has been saved', doc._id);
//});
//PostSchema.post('remove', function (doc) {
//	debug('%s has been removed', doc._id);
//});

PostSchema.statics = {
    getList : function (options) {
        return this
            .find(options || {})
            .populate({path: 'author', select: 'name'})
            .populate({path: 'tags', select: '_id name'})
            .populate({path: 'comments', select: '_id name'})
            .sort({'updated_at': -1})
    },
    findById: function (id) {
        return this
            .findOne({_id: id})
            .populate({path: 'author', select: 'name'})
            .populate({path: 'tags', select: '_id name'})
            .populate({path: 'comments'})
    }
}

module.exports = PostSchema;