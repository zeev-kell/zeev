/**
 * Created by keziyuan on 2016/1/5.
 */
var gulp = require('gulp');

var config = {
	less  : ["./core/public", "./core/admin", "./core/essay", "./core/index"],
	views : "./core/views",
	output: "./dist",
	admin : "./core/admin",
	copy  : {
		font  : ["./bower_components/font-awesome/fonts*/**","./bower_components/bootstrap/dist/fonts*/**"],
		hbs   : [
			"./core/views*/essay/**/*",
			"./core/views*/partials/**/*",
			"./core/views*/error.hbs"
		],
		public: ["./core/public*/**/*", "!*.{less}"],
		admin : {
			js  : [
				"./core/admin*/**/*.js"
			],
			html: ["./core/admin*/views/**/*"],
			css : ["./core/admin*/css/**/*"]
		},
		essay : ["./core/essay*/**/*"]
	}
};

var banner = ['/**',
	' * <%= pkg.name %> - ' + new Date,
	' * @version v<%= pkg.version %>',
	' */',
	'\n'
].join('\n');

require("./tasks/dev")(gulp, config);
require("./tasks/build")(gulp, config, banner);
