/**
 * Created by Administrator on 2018/3/4.
 */
var gulp = require('gulp');
var browserSync = require('browser-Sync').create();

// less编译
var less = require('gulp-less');

// c3兼容
var autoprefixer = require('gulp-autoprefixer');

// 压缩图片tinypng
var tinypng = require('gulp-tinypng-compress');

// 压缩图片tinypng-nokey
var tinypng_nokey = require('gulp-tinypng-nokey');

// 版本号
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');

gulp.task('browser-Sync',function () {
    var files = [
        './current/*.html',
        './current/css/*.css',
        './current/js/*.js'
    ];
    browserSync.init(files,{
        server: {
            baseDir:"./current/"
        }
    });
});

gulp.task('less',function () {
    // 找到less文件
    gulp.src('./current/css/*.less')
    // 编译为css
        .pipe(less())
    // 另存css
        .pipe(gulp.dest('./current/css/'))
});

// 自动添加CSS3兼容
gulp.task('css3',function () {
    gulp.src('./current/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 100 versions'],
            cascade: true,
            remove: true
        }))
        .pipe(gulp.dest('./current/css/'))
});


// 监听文件改动
gulp.task('auto',function () {
    gulp.watch('./current/css/*.less',['less'])
});

// 加版本号
gulp.task('css',function(){
    return gulp.src('current/css/*.css')
        .pipe(rev())
        .pipe(gulp.dest('current/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('current/css'))
});

gulp.task('js',function(){
    return gulp.src("current/js/*.js")
        .pipe(rev())
        .pipe(gulp.dest("current/js"))
        .pipe(rev.manifest())
        .pipe(gulp.dest('current/js'))
});

gulp.task('rev',['css','js'],function(){
    return gulp.src(['current/**/*.json','current/*.html'])
        .pipe(revCollector({
            replaceReved: true
        })).pipe(gulp.dest('current'))
});

gulp.task('tinypng', function () {
   gulp.src('current/images/*.{png,jpg}')
       .pipe(tinypng({
           key: '*******',
           sigFile: 'current/images/.tinypng-sigs',
           log: true
       }))
       .pipe(gulp.dest('current/images'));
});

gulp.task('tp', function () {
    gulp.src('current/images/*.{png,jpg}')
        .pipe(tinypng_nokey ())
        .pipe(gulp.dest('current/images'));
});



gulp.task('default',['browser-Sync','auto']); // 定义默认任务 代码改动时自动更新
