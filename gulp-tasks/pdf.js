"use strict";

import { paths } from "../gulpfile.babel";
import gulp from "gulp";

gulp.task("pdf", () => {
    return gulp.src(paths.pdf.src)
        .pipe(gulp.dest(paths.pdf.dist))
});