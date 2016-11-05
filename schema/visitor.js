/**
 * Created by Administrator on 2016/2/28.
 */
var mongoose = require('mongoose');

var VisitorSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	ip   : { type: String, required: true },
	name : { type: String, required: true, max: 10 },
	url  : { type: String }
}, {
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

module.exports = VisitorSchema;
