/**
 * Created by zeev on 2016/11/4 0004.
 */

var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	connect : ""
}, {
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

module.exports = CommentSchema;