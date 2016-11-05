/**
 * Created by keziyuan on 2016/2/17.
 */
var mongoose = require('mongoose');
var debug = require('debug')('zeev:schema');
//var bcrypt = require('bcrypt');
//var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
	ip      : String,
	name    : { type: String, required: true },
	password: { type: String, required: true },
	gender  : { type: Boolean, default: true },
	//--用户权限--
	//  = 0: nomal user
	//  =10: test
	//  =50: super admin
	role    : { type: Number, default: 0 },
	cover   : String,
	image   : String
}, {
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

UserSchema.pre('save', function (next) {
	debug("save:user");
	next();
})
//--实例方法--
UserSchema.methods = {
	compare: function (_user) {
		return _user.password == this.password
	}
}
//--静态方法，在模型调用--
UserSchema.statics = {
	fetch   : function (cb) {
		return this
			.find({})
			.sort({ 'meta.updateAt': -1 })
			.exec(cb)
	}
}

module.exports = UserSchema;
