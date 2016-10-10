/**
 * Created by keziyuan on 2016/1/5.
 */
var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    less = require('gulp-less'),
    clean = require('gulp-clean'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    argv = require('yargs').argv,
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

var config = {
    less: [
        "./public*/"
    ]
};
/**
 * 清理打包之后编译的css
 */
gulp.task('css:clean', function() {
    return gulp.src(config.less.map(function(less) {
            return less + "/css"
        }), { read: false })
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(clean({ force: true }))
});

/**
 * 编译less文件
 */
gulp.task('css:less', ['css:clean'], _less);

function _less() {
    return gulp.src(config.less.map(function(less) {
            return less + "/less/*.less"
        }))
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(less())
        .pipe(gulp.dest('./css/'))
}

gulp.task('css:watch', ['css:less'], function() {
    reload();
});

/**
 *  启动自动刷新浏览器
 */
gulp.task('browser-sync', function() {
    browserSync.init({
        browser: "firefox",
        proxy: "http://localhost:4200/",
        port: "80"
    });
});

/**
 *  启动node服务
 */
gulp.task('start', ['browser-sync'], function() {
    return nodemon({
        script: './bin/www',
        ext: 'js',
        verbose: true,
        ignore: ["bower_components/**/*", "*.json", "gulpfile.js"],
        env: {
            'NODE_ENV': argv.production || 'development',
            'DEBUG': argv.DEBUG || 'zeev:*',
            "PORT": argv.PORT || 4200
        }
    }).on('start', function() {
        reload();
    }).on('restart', function() {
        //console.log('restarted!')
    })
})

/**
 *  启动watch监听
 */
gulp.task('default', ['start', 'css:less'], function() {
    gulp.watch([
        "./public/js/*",
        "./views/**/*.*"
    ]).on('change', reload);
    gulp.watch([
        "./public/less/*"
    ], ['css:watch'])
});
