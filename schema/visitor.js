/**
 * Created by Administrator on 2016/2/28.
 */
var mongoose = require('mongoose');

var VisitorSchema = new mongoose.Schema({
    ip: { type: String, required: true }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

module.exports = VisitorSchema;
