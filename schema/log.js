/**
 * Created by Administrator on 2016/3/1.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var LogSchema = new mongoose.Schema({
    date: {type: Date, required: true},
    visitors: [{
        type: ObjectId, ref: 'visitor'
    }]
})

LogSchema.pre('save', function (next) {
    var log = this;
    if (log.isNew) {
        console.log(log.date);
    }
    next();
})

LogSchema.statics = {
    fetch: function (cb) {
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

module.exports = LogSchema;