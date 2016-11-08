/**
 * Created by Administrator on 2016/2/28.
 */
var mongoose  = require('mongoose'),
	validator = require('validator');

VisitorSchema = new mongoose.Schema({
	email: {
		type: String, required: true, unique: true, validate: {
			validator: validator.isEmail
		}
	},
	ip   : { type: String, required: true },
	name : { type: String, required: true, max: 10 },
	url  : { type: String, required: false },
	image: { type: String, required: false }
}, {
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

module.exports = VisitorSchema;
