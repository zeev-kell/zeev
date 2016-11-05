/**
 * Created by zeev on 2016/11/4 0004.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new mongoose.Schema({
    content: {type: String, required: true},
    status : {default: 0, type: Number}
}, {
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
})

module.exports = CommentSchema;