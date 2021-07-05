// Defining dependencies
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const browsersync = require("browser-sync").create();

// Define web root
const webroot = "./wwwroot/"

// Defining paths
const paths = {
    cshtml: "pages/**/*.cshtml",
    sass: "styles/**/*.s*ss",
    sassDest: webroot + "css",
    js: "scripts/**/*.js",
    jsDest: webroot + "js"
};

// Sass Task
function scssTask() {
    return src(paths.sass, { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([cssnano()]))
        .pipe(rename("style.css"))
        .pipe(dest(paths.sassDest, { sourcemaps: "." }));
}

// JavaScript Task
function jsTask() {
    return src(paths.js, { sourcemaps: true })
        .pipe(terser())
        .pipe(rename("script.js"))
        .pipe(dest(paths.jsDest, { sourcemaps: "." }));
}

// Browsersync Tasks
function browsersyncServe(cb) {
    browsersync.init({
        proxy: "http://localhost:5000/",
        files: [paths.cshtml, paths.sassDest, paths.jsDest],
        notify: false
    });
    cb();
}

function browsersyncReload(cb) {
    browsersync.reload();
    cb();
}

// Watch Task
function watchTask() {
    watch(paths.cshtml, browsersyncReload);
    watch([paths.sass, paths.js], series(scssTask, jsTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(
    scssTask,
    jsTask,
    browsersyncServe,
    watchTask
);
