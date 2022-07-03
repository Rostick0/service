const {src, dest, series} = require('gulp');
const uglify = require('gulp-uglify');
const csso = require('gulp-csso')
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');

function html() {
    return src('app/**.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest('dist'))
}

function css() {
    return src('app/css/**.css')
        .pipe(csso())
        .pipe(dest('dist/css'))
}

function js() {
    return src('app/js/script.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(uglify())
        .pipe(dest('dist/js'))
}

function libsJs() {
    return src(['app/js/lazy**.js', '!app/js/script.js'])
        .pipe(dest('dist/js'))
}

function img() {
    return src('app/img/**')
        .pipe(dest('dist/img'))
}

function fonts() {
    return src('app/fonts/**')
        .pipe(dest('dist/fonts'))
}

function httpRequest() {
    return src('app/http/**')
        .pipe(dest('dist/http'))
}

exports.build = series(html, css, img, fonts, httpRequest, js)