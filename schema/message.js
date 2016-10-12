/**
 * Created by keziyuan on 2016/2/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var MessageSchema = new mongoose.Schema({
    name      : {type: String, required: true},
    email     : {type: String, required: true},
    content   : String,
    //--消息提醒--
    //  0: 未读
    //  1: 已读
    //  2: 已处理
    status    : {default: 0, type: Number},
    created_at: {type: Date, default: Date.now()},
    updated_at: {type: Date, default: Date.now()}
})

MessageSchema.pre('save', function (next) {
    var article = this;
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now()
    }
    next();
})

MessageSchema.statics = {
    fetch   : function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
}

module.exports = MessageSchema;