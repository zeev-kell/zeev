/**
 * Created by keziyuan on 2016/2/17.
 */
var mongoose = require('mongoose');
//var bcrypt = require('bcrypt');
//var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
    ip        : String,
    name      : {type: String, required: true},
    password  : {type: String, required: true},
    gender    : {type: Boolean, default: true},
    //--用户权限--
    //  = 0: nomal user
    //  =10: test
    //  =50: super admin
    role      : {type: Number, default: 0},
    cover     : String,
    image     : String,
    created_at: {type: Date, default: Date.now()},
    updated_at: {type: Date, default: Date.now()}
})

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next();
})
//--实例方法--
UserSchema.methods = {
    compare: function (_user, cb) {
        if (_user.password == this.password) {
            cb(null, true);
        } else {
            cb(null, false)
        }
    }
}
//--静态方法，在模型调用--
UserSchema.statics = {
    fetch   : function (cb) {
        return this
            .find({})
            .sort({'meta.updateAt': -1})
            .exec(cb)
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
}

module.exports = UserSchema;