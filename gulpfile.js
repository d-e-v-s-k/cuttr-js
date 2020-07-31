let gulp        = require('gulp');
let rename      = require('gulp-rename');
let sourcemaps  = require('gulp-sourcemaps');
let babel       = require('gulp-babel');
let uglify      = require('gulp-uglify');

gulp.task('js', function(done) {
    gulp.src('./src/cuttr.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: [ ['@babel/preset-env', {modules: false, loose: true}] ]
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(uglify({
            output: {
                comments: 'some'
            }
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist'));
    done();
});

gulp.task('default', gulp.parallel('js'));