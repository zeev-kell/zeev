/**
 * Created by Administrator on 2016/2/28.
 */
var mongoose = require('mongoose');

var VisitorSchema = new mongoose.Schema({
    ip        : {type: String, required: true},
    created_at: {type: Date, default: Date.now()},
    updated_at: {type: Date, default: Date.now()}
})

module.exports = VisitorSchema;