const gulp = require('gulp');
      sass = require('gulp-sass');
      sass.compiler = require('node-sass');
      browserSync = require('browser-sync').create();
      concat = require('gulp-concat');
      cleanCSS = require("gulp-clean-css");
      uglify = require("gulp-uglify");
      rename = require("gulp-rename");
      babel = require('gulp-babel');

gulp.task('sass', function() {
  return gulp.src('src/sass/style.scss')
  .pipe(sass())
  .pipe(gulp.dest('src/css'))
  .pipe(browserSync.reload({
  stream: true
  }))
});

gulp.task('css', function(){
  return gulp.src('src/css/style.css')
  .pipe(cleanCSS())
  .pipe(gulp.dest('dist/css'))
})

gulp.task('jquery', function(){
  return gulp.src('node_modules/jquery/dist/jquery.js')
  .pipe(uglify())
  .pipe(rename('0_jquery.js'))
  .pipe(gulp.dest('src/js'))
})

gulp.task('uglify', function(){
  return gulp.src(['src/js/*.js'])
  .pipe(babel({
  presets: ['@babel/preset-env']
  }))
  .pipe(concat('all.js'))
  .pipe(gulp.dest('dist/js'))
  .pipe(rename('all.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'));
});

gulp.task('watch', function(){ 
  browserSync.init({
  server: {
  baseDir: "./",
  index: "/index.html"
  },
})
//gulp.watch('js/*.js', gulp.series('scripts'));
gulp.watch('src/js/*.js', gulp.series(['uglify']));
gulp.watch('*.html', gulp.series(browserSync.reload));
gulp.watch('dist/js/all.min.js', gulp.series(browserSync.reload));
gulp.watch('src/sass/*.scss', gulp.series(["sass","css"]));
})

gulp.task('default', gulp.series(["sass","css","uglify","watch"])); 