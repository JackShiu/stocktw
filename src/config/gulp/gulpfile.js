var gulp = require("gulp");
var inline = require("gulp-inline");
var rename = require("gulp-rename");
var plumber = require("gulp-plumber");

// var moment = require("moment");

gulp.task('inline',function(){
    var d = new Date();
    var ds = d.getFullYear() +"-"+ ('0' + (d.getMonth() + 1)).substring(-2) +"-"+ ('0' + d.getDate()).substring(-2);
    return gulp.src('../../../out/build/index.html')
        .pipe(plumber())
        .pipe(inline({
            base:'../../../out/build/'
        }))
        .pipe(rename({
            dirname: "./",
            basename: ds,
            extname: ".html"
        }))
        .pipe(gulp.dest('../../../out/'));
})
gulp.task('default', ['inline']);