const {
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp');

const autoprefixer = require('gulp-autoprefixer');
const cleanDir = require('del');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-image');
const browserSync = require('browser-sync').create();
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const pug = require('gulp-pug');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');



function htmltask() {
    return src('src/pug/*.pug')
        .pipe(plumber())
        .pipe(pug({
            pretty: true,
        }))
        .pipe(dest('dist/'))
        .pipe(browserSync.stream())
}

function csstask() {
    return src('src/css/*.scss')
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(scss({
            outputStyle: 'expanded'
        }))
        .pipe(dest('dist/css'))
        .pipe(scss({
            outputStyle: 'compressed'
        }))
        .pipe(concat('style.min.css'))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream())
}

function jstask() {
    return src('src/js/*.js')
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream())
}

function images() {
    return src('src/img/**/*')
        .pipe(imagemin({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            jpegRecompress: false,
            mozjpeg: true,
            gifsicle: true,
            svgo: true,
            concurrent: 10,
            quiet: true // defaults to false
        }))
        .pipe(dest('dist/img'))
}

function fonts() {
    src('src/fonts/**/*')
        .pipe(ttf2woff())
        .pipe(dest('dist/fonts'))
    return src('src/fonts/**/*')
        .pipe(ttf2woff2())
        .pipe(dest('dist/fonts'))
}

function clean() {
    return cleanDir('dist/')
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    })
}

function watching() {
    watch(['src/pug/**/*.pug'], htmltask),
        watch(['src/css/**/*.scss'], csstask),
        watch(['src/js/**/*.js'], jstask)
}

exports.default = series(clean, parallel(htmltask, csstask, jstask, images, fonts), parallel(browsersync, watching));


exports.htmltask = htmltask;
exports.csstask = csstask;
exports.jstask = jstask;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.watching = watching;
exports.browsersync = browsersync;