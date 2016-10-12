/**
 * Created by keziyuan on 2016/2/17.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var TagSchema = new mongoose.Schema({
    name            : {type: String, required: true},
    slug            : {type: String, max: 150, unique: false},
    description     : {type: String, max: 200, required: false},
    image           : {type: String},
    hidden          : {type: Boolean, required: false, default: false},
    meta_title      : {type: String, max: 150, required: false},
    meta_description: {type: String, max: 200, required: false},
    created_at      : {type: Date, default: Date.now()},
    updated_at      : {type: Date, default: Date.now()},
    published_at    : {type: Date, default: Date.now()}
})

module.exports = TagSchema;