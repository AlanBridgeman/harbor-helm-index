import gulp from "gulp";
import ts from "gulp-typescript";
import { deleteAsync } from 'del';

var tsProject = ts.createProject("tsconfig.json");

// Task which would delete the old dist directory if present
gulp.task("build-clean", function () {
    return deleteAsync(["./dist"]);
});

// Task which would transpile typescript to javascript
gulp.task("typescript", function () {
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
});

// Task which would just create a copy of the current views directory in dist directory
gulp.task("views", function () {
    return gulp.src("./src/pages/**/*.ejs").pipe(gulp.dest("./dist/pages"));
});

// Task which will copy the assets from the static JavaScript directory to the dist directory
gulp.task("assets-js", function () {
    return gulp.src(['./src/static/js/**/*.js']).pipe(gulp.dest("./dist/static/js"));
});

// Task which will copy the assets from the static image directory to the dist directory
gulp.task("assets-img", function () {
    return gulp.src("./src/static/img/**/*", { encoding: false }).pipe(gulp.dest("./dist/static/img"));
});

// Task which will copy the assets from the static CSS directory to the dist directory
gulp.task("assets-css", function () {
    return gulp.src("./src/static/css/**/*.css").pipe(gulp.dest("./dist/static/css"));
});

gulp.task("assets", gulp.parallel("assets-js", "assets-img", "assets-css"));

// The default task which runs at start of the gulpfile.js
gulp.task("default", gulp.series("build-clean", "typescript", "views", "assets"), () => {
    console.log("Done");
});