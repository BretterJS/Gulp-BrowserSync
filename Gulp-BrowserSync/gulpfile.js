
let gulp = require('gulp');
let sass = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let babel = require('gulp-babel');
let uglify = require('gulp-uglify');
let sourcemaps = require('gulp-sourcemaps');
let concat = require('gulp-concat');
let imagemin = require('gulp-imagemin');
let eslint = require('gulp-eslint');
let browserSync = require('browser-sync').create();

gulp.task('lint', () => {
    return gulp.src(['./src/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

let sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

gulp.task('sass', () => {
  
    gulp.src('src/*scss')
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(gulp.dest('src'))
    .pipe(browserSync.stream());
});

gulp.task('es6', () => {
    gulp.src('src/*.js')
    .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('html', () => {
  gulp.src('src/*.html')
  .pipe(gulp.dest('dist/html'))
  .pipe(browserSync.stream());
});

gulp.task('serve', ['sass'], () => {
    
    browserSync.init({
        server: "./src"
    });

    gulp.watch("./src/*scss", ['sass']);
    gulp.watch("./src/*.html", ['html']).on('change', browserSync.reload);
    gulp.watch("./src/*.js", ['es6']).on('change', browserSync.reload);
});

gulp.task('images', () => {
    gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
});


  gulp.task('default', ['lint', 'sass', 'es6', 'html', 'images', 'serve']);
