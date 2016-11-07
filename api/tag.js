/**
 * Created by zeev on 2016/11/6 0006.
 */

var Tag = global.dbHelper.getModel("Tag"),
    Promise = require('bluebird'),
    errors = require("../errors");

exports.getList = function(options) {
    return Tag.find({}, "_id name");
}