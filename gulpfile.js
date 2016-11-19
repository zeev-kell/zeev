/**
 * Created by keziyuan on 2016/1/5.
 */
var gulp = require('gulp');

var config = {
	watch : ["./core/**/*.{js,html,hbs}"],
	less  : ["./core/about", "./core/admin", "./core/essay", "./core/home", "./core/product", "./core/public"],
	views : "./core/views",
	output: "./dist",
	admin : "./core/admin",
	copy  : {
		font  : ["./bower_components/font-awesome/fonts*/**", "./bower_components/bootstrap/dist/fonts*/**"],
		hbs   : [
			"./core/views*/{partials,layout}/**/*.hbs",
			"./core/product*/chat.hbs",
			"./core/views*/error.hbs",
			"./core/views*/404.hbs"
		],
		public: ["./core/public*/**/*", "!*.{less}", "./core/**/*.css"],
		admin : {
			js  : [
				"./core/admin*/**/*.js"
			],
			html: ["./core/admin*/views/**/*"],
			css : ["./core/admin*/css/**/*"]
		},
		essay : ["./core/essay*/**/*", "!*.{less}"]
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
