const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
let rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const htmlmin = require("gulp-htmlmin");
const uglify = require('gulp-uglify-es').default;
const del = require("del");
const ghPages = require('gh-pages');
const path = require('path');

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
  .pipe(
    imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.mozjpeg({progressive: true}),
    imagemin.svgo({
      plugins: [{mergePaths: false}]
    })
  ]))
  .pipe(gulp.dest("build/img"));
};

const minHTML = () => {
  return gulp.src("source/*.html")
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest("build"));
};

const minifyJS = () => {
  return gulp.src("source/js/*.js")
  .pipe(uglify())
  .pipe(rename(function (path) {
    path.basename += ".min";
  }))
  .pipe(gulp.dest("build/js"));
};

const copy = () => {
  return gulp.src(["source/fonts/**/*.{woff,woff2}", "source/*.ico"], {
    base: "source"
  })
 .pipe(gulp.dest("build"));
};

const clean = () => {
  return del("build");
};

function deploy(cb) {
  ghPages.publish(path.join(process.cwd(), './build'), cb);
}

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series("minHTML"));
  gulp.watch("source/js/*.js", gulp.series("minifyJS"));
};

exports.styles = styles;
exports.images = images;
exports.minHTML = minHTML;
exports.minifyJS = minifyJS;
exports.copy = copy;
exports.clean = clean;
exports.deploy = deploy;
exports.server = server;

exports.build = gulp.series(clean, copy, styles, images, minHTML, minifyJS);
exports.default = gulp.series(clean, copy, styles, images, minHTML, minifyJS, server, watcher);
