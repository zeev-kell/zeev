/**
 * Created by zeev on 2017/1/4 0004.
 */
'use strict';
const gulp        = require('gulp'),
	  nodemon     = require('gulp-nodemon'),
	  clean       = require('gulp-clean'),
	  useref      = require("gulp-useref"),
	  notify      = require('gulp-notify'),
	  uglify      = require('gulp-uglify'),
	  gulpif      = require('gulp-if'),
	  through2    = require('through2'),
	  plumber     = require('gulp-plumber'),
	  argv        = require('yargs').argv,
	  cleanCss    = require("gulp-clean-css"),
	  browserSync = require('browser-sync').create(),
	  scss        = require("gulp-sass"),
	  filter      = require('gulp-filter'),
	  output      = './dist/js',
	  devConfig   = {
		  PORT  : 4200,
		  SCSS  : ['./public*'],
		  SOCKET: 4201
	  };

/**
 * 刷新浏览器
 * @param time
 * @returns {NodeJS.Timer|any|number}
 */
function reload(time) {
	if (typeof time == "undefined") {
		time = 500;
	}
	return setTimeout(function () {
		browserSync.reload();
		console.log(`browserSync reload!time=` + time);
	}, time);
}

/**
 * 清理打包之后的文件
 */
gulp.task('clean', () => {
	return gulp.src(output, { read: false })
		.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
		.pipe(clean({ force: true }))
});

/**
 * 清理打包之后编译的css
 */
gulp.task('css:clean', () => {
	return gulp.src(devConfig.SCSS.map(function (scss) {
		return scss + "/css/**/*.css"
	}), { read: false })
		.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
		.pipe(clean())
});

/**
 * 编译scss文件
 */
gulp.task('css:scss', ['css:clean'], () => {
	return gulp.src(devConfig.SCSS.map(function (scss) {
		return scss + "/css/*.scss"
	}))
		.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
		.pipe(scss.sync().on('error', scss.logError))
		.pipe(cleanCss())
		.pipe(gulp.dest("./"))
});

gulp.task('css:watch', ['css:scss'], () => {
	reload(0);
});


/**
 *  启动自动刷新浏览器
 */
gulp.task('browser-sync', () => {
	browserSync.init({
		browser: "chrome",
		proxy  : "http://localhost:" + devConfig.PORT + "/",
		port   : "80"
	});
});


/**
 * 连接mongodb
 */
gulp.task('mongodb', () => {
	return require('./mongodb').connection();
});

gulp.task("reload", () => {
	return reload(500);
})

/**
 *  启动node服务
 */
gulp.task('start', ['browser-sync'], () => {
	let stream = nodemon({
		script : './bin/www',
		ext    : 'js hbs',
		verbose: true,
		ignore : [
			"bower_components/",
			"node_modules/",
			'dist/',
			"public/",
			"*.json",
			"gulpfile.js",
			"webpack.config.js"
		],
		/* 重新启动之前执行的tasks */
		//tasks  : ['reload'],
		//stdout : false,// important: this tells nodemon not to output to console
		env    : {
			'NODE_ENV': argv.production || 'development',
			'DEBUG'   : argv.DEBUG || 'zeev:*',
			"PORT"    : argv.PORT || devConfig.PORT,
			"SOCKET"  : argv.SOCKET || devConfig.SOCKET
		}
	}).on('start', () => {
		reload(500);
	}).on('restart', () => {
		//		console.log('restart!');
	}).on('crash', () => {
		console.error('Application has crashed!\n');
		stream.emit('restart', 2);  // restart the server in 10 seconds
	});
	return stream;
})


/**
 *  启动watch监听
 */
gulp.task('default', ['start', 'clean', 'css:scss'], () => {
	gulp.watch(['./public/css/**/*.scss'], ['css:watch']);
});


gulp.task('build:admin', ['admin:hbs','admin:copy']);

gulp.task('admin:hbs', () => {

	const hbs = filter('**/*.hbs', { restore: true });
	const js  = filter('**/*.js', { restore: true });

	return gulp.src([
		'./views/admin/index.hbs',
	])
		.pipe(useref({
			searchPath   : "./", //-- 寻找文件的目录 --
			base         : null, //--  输出文件的目录
			noAssets     : false, //-- 是否只是处理 html文件 --
			noconcat     : false, //-- 是否不合并 --
			newLine      : null, //-- 每次合并的时候，在合并的地方加上 string --
			transformPath: function (filePath) { //-- 可以在查找文件前修改路径 --
				return filePath.replace('/admin', '/public/admin');
			}
		}))
		.pipe(through2.obj((file, enc, cb) => {
			if (/index\.hbs$/.test(file.path)) {
				file.path = file.path.replace(/index\.hbs$/, "index_.hbs");
			}
			return cb(null, file);
		}))
		.pipe(hbs)
		.pipe(gulp.dest('./views/admin/'))
		.pipe(hbs.restore)
		.pipe(js)
		.pipe(uglify())
		.pipe(gulp.dest('./'))
});

gulp.task("admin:copy", () => {
	return gulp.src('./public/admin/**/*.*')
		.pipe(gulpif("*.js", uglify()))
		.pipe(gulp.dest('./public/admin_/'))
})