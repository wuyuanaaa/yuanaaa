/**
 * Created by Administrator on 2018/3/4.
 */
var gulp = require('gulp'),
    browserSync = require('browser-Sync').create(),
    less = require('gulp-less'),                    // less编译
    autoprefixer = require('gulp-autoprefixer'),    // c3兼容
    tinypng = require('gulp-tinypng-compress'),     // 压缩图片tinypng
    tinypng_nokey = require('gulp-tinypng-nokey'),  // 压缩图片tinypng-nokey
    rev = require('gulp-rev'),                      // 版本号
    revCollector = require('gulp-rev-collector'),
    sequence = require('gulp-sequence'),
    PATHS = {
        ROOT: './current/',
        HTML: './current/*.html',
        CSS: './current/css/*.css',
        JS: './current/js/*.js',
        LESS: './current/css/*.less'
    };

gulp.task('browser-Sync', function () {
    var files = [
        PATHS.HTML,
        PATHS.CSS,
        PATHS.JS
    ];
    browserSync.init(files, {
        server: {
            baseDir: PATHS.ROOT
        }
    });
});

// less编译
gulp.task('less', function () {
    // 找到less文件
    return gulp.src(PATHS.LESS)
    // 编译为css
        .pipe(less())
        // 另存css
        .pipe(gulp.dest('./current/css/'))
});

// 监听文件改动
gulp.task('auto', function () {
    return gulp.watch(PATHS.LESS, ['less'])
});

// 添加CSS3兼容
gulp.task('css3', function () {
    return gulp.src(PATHS.CSS)
        .pipe(autoprefixer({
            browsers: ['last 10 versions', 'Firefox >= 20', 'Opera >= 36', 'ie >= 9', 'Android >= 4.0', ],
            cascade: true,
            remove: true
        }))
        .pipe(gulp.dest('./current/css/'))
});

// 加版本号
gulp.task('css', function () {
    return gulp.src(PATHS.CSS)
        .pipe(rev())
        .pipe(gulp.dest('current/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('current/css'))
});

gulp.task('js', function () {
    return gulp.src(PATHS.JS)
        .pipe(rev())
        .pipe(gulp.dest("current/js"))
        .pipe(rev.manifest())
        .pipe(gulp.dest('current/js'))
});

gulp.task('rev', ['css', 'js'], function () {
    return gulp.src(['current/**/*.json', 'current/*.html'])
        .pipe(revCollector({
            replaceReved: true
        })).pipe(gulp.dest('current'))
});
// 压缩图片tinypng
gulp.task('tinypng', function () {
    return gulp.src('current/images/*.{png,jpg}')
        .pipe(tinypng({
            key: 'IgMedJATOemvh4lH7b6Wm708VONiGIk5',
            sigFile: 'current/images/.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest('current/images'));
});
// 压缩图片tinypng-nokey
gulp.task('tp', function () {
    return gulp.src('current/images/*.{png,jpg}')
        .pipe(tinypng_nokey())
        .pipe(gulp.dest('current/images'));
});

gulp.task('build',sequence('css3', 'rev'));     // 添加css3兼容后增加版本号

gulp.task('default', ['browser-Sync', 'auto']); // 定义默认任务 代码改动时自动更新

