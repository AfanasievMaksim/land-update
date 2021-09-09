"use strict";

import { paths } from "../gulpfile.babel";
import gulp from "gulp";
import browsersync from "browser-sync";

gulp.task("roistat-php", () => {
    return gulp.src(paths.roistatPhp.src)
        .pipe(gulp.dest(paths.roistatPhp.dist))
});

gulp.task("roistat-js", () => {
  return gulp.src(paths.roistatJs.src)
      .pipe(gulp.dest(paths.roistatJs.dist))
});