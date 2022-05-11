const { src, dest, series, watch } = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync').create();

const clean = () => {
    return del(['dist'])
};

const resources = () => {
    return src('src/resources/**')
     .pipe(dest('dist'))
};

const styles = () => {
    return src('src/styles/**/*.css')
     .pipe(sourcemaps.init())
     .pipe(concat('main.css'))
     .pipe(autoprefixer({
         cascade:false
     }))
     .pipe(cleanCSS({
         level: 2
     }))
     .pipe(sourcemaps.write())
     .pipe(dest('dist'))
     .pipe(browserSync.stream())
};

const htmlMinify = () => {
    return src('src/**/*.html')
     .pipe(htmlMin({
         collapseWhitespace: true,
     }))
     .pipe(dest('dist'))
     .pipe(browserSync.stream())
};

const svgSprites = () => {
    return src('src/img/svg/**/*.svg')
     .pipe(svgSprite({
         mode: {
             stack: {
                 sprite: '../sprite.svg'
             }
         }
     }))
     .pipe(dest('dist/img'))
}

const images =()=> {
    return src([
        'src/img/**/*.jpg',
        'src/img/**/*.png',
        'src/img/**/*.jpeg',
        'src/img/**/*.webp',
    ])
    .pipe(dest('dist/img'))
}

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
};

watch('src/**/*.html', htmlMinify);
watch('src/styles/**/*.css', styles);
watch('src/img/svg/**/*.svg', svgSprites);
watch('src/resources/**', resources);

exports.default = series(clean, resources, images, htmlMinify, styles, svgSprites, watchFiles);