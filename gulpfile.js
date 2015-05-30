/* file: gulpfile.js */

var
    gulp = require('gulp'),
    util = require('gulp-util'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    minify = require('gulp-minify-css'),
    minMap = require('gulp-min-map'),
    es = require('event-stream'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin');

var
    renameOpts = {suffix: '.min'},
    minFiles = {};

var vendorFiles = {
    bootstrap: {
        src: 'bower_components/bootstrap/dist/**/*.{css,js,map}',
        dest: 'dist/vendor'
    },
    jquery: {
        src: 'bower_components/jquery/dist/*.{js,map}',
        dest: 'dist/vendor/js'
    },
    knockout: {
        src: 'bower_components/knockout/dist/*.js',
        dest: 'dist/vendor/js'
    },
};

gulp.task('vendor:bootstrap', function() {
    return gulp.src(vendorFiles.bootstrap.src)
        .pipe(gulp.dest(vendorFiles.bootstrap.dest));
});

gulp.task('vendor:jquery', function() {
    return gulp.src(vendorFiles.jquery.src)
        .pipe(gulp.dest(vendorFiles.jquery.dest));
});

gulp.task('vendor:knockout', function() {
    return gulp.src(vendorFiles.knockout.src)
        .pipe(gulp.dest(vendorFiles.knockout.dest));
});

gulp.task('deploy:css', function() {
    return gulp.src('src/css/*.css')
        .pipe(minify())
        .pipe(rename(renameOpts))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('deploy:js', function() {
    return gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(rename(renameOpts))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('deploy:html', function() {
    return gulp.src('src/*.html')
        .pipe(minMap(['js', 'css'], minFiles))
        .pipe(gulp.dest('dist'));
});

gulp.task('deploy:img', function() {
    return gulp.src('src/img/*.{gif,png,jpg,jpeg,svg}')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img'));
})

gulp.task('dev:lint', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('dev:watch', function() {
    gulp.watch('src/js/*.js', ['dev:lint', 'deploy:js']);
    gulp.watch('src/css/*.css', ['deploy:css']);
    gulp.watch('src/*.html', ['deploy:html']);
});

gulp.task('deploy', ['deploy:html', 'deploy:css', 'deploy:js']);
gulp.task('vendor', ['vendor:bootstrap', 'vendor:jquery', 'vendor:knockout']);

gulp.task('default', ['deploy']);