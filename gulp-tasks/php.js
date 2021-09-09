"use strict";

import { paths } from "../gulpfile.babel";
import gulp from "gulp";
import browsersync from "browser-sync";

gulp.task("moveFolder", () => {
  return gulp.src(paths.folder.src).pipe(gulp.dest(paths.folder.dist));
});
