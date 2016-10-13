/**
 * Created by keziyuan on 2016/1/5.
 */
var gulp = require('gulp');

var config = {
	less : ["./core/public", "./core/admin", "./core/essay", "./core/index"],
	views: "./core/views"
};

require("./tasks/dev")(gulp, config);
