var gulp = require('gulp');
var sass = require('gulp-sass');
var gulpConf = require('./conf/gulp.json');

var CONFIG = {
    gulp : gulpConf
};

gulp.task('dev:compile:sass', function () {
    gulp.src([CONFIG.gulp.src, '/**/*.scss'].join(''))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(CONFIG.gulp.dest));
});

gulp.task('dev:watch:sass', function () {
    gulp.watch([CONFIG.gulp.src, '/**/*.scss'].join(''), ['dev:compile:sass']);
});