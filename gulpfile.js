/**
 * Created by keziyuan on 2016/1/5.
 */
const gulp = require('gulp');

const config = {
	watch : ["./core/**/*.{js,html}"],
	less  : ["./core/about", "./core/admin", "./core/essay", "./core/home", "./core/product", "./core/public"],
	views : "./core/views",
	output: "./dist",
	admin : "./core/admin",
	copy  : {
		font   : ["./bower_components/font-awesome/fonts*/**", "./bower_components/bootstrap/dist/fonts*/**"],
		hbs    : [
			"./core/views*/{partials,layout}/**/*.hbs",
			"./core/views*/error.hbs",
			"./core/views*/404.hbs",
			"./core/views*/success.hbs"
		],
		public : [
			"./core/public*/css/**/*",
			"./core/public*/img/**/*",
			"./core/public*/js/**/*",
			"./core/public*/svg/**/*",
			"./core/public*/favicon.ico"
		],
		product: [
			"./core/product*/css/**/*",
			"./core/product*/img/**/*",
			"./core/product*/js/**/*",
			"./core/product*/chat.hbs",
			"./core/product*/**/*.html"
		],
		admin  : {
			js  : ["./core/admin*/**/*.js"],
			html: ["./core/admin*/views/**/*"]
		},
		essay  : ["./core/essay*/**/*", "!*.{less}"],
		libs   : ["./core/public*/libs/**/*"]
	}
};

const banner = ['/**',
	' * <%= pkg.name %> - ' + new Date,
	' * @version v<%= pkg.version %>',
	' * https://github.com/zeev-kell',
	' */',
	'\n'
].join('\n');

require("./tasks/dev")(gulp, config);
require("./tasks/build")(gulp, config, banner);
