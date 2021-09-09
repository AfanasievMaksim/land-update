"use strict";

import gulp from "gulp";

const requireDir = require("require-dir"),
  paths = {
    views: {
      src: ["./src/views/**/*.html", "./src/views/pages/*.html"],
      dist: "./dist/",
      watch: ["./src/blocks/**/*.html", "./src/views/**/*.html"],
    },
    styles: {
      src: "./src/styles/*.{scss,sass}",
      dist: "./dist/styles/",
      watch: ["./src/blocks/**/*.{scss,sass}", "./src/styles/**/*.{scss,sass}"],
    },
    scripts: {
      src: "./src/js/index.js",
      dist: "./dist/js/",
      watch: ["./src/blocks/**/*.js", "./src/js/**/*.js"],
    },
    pdf: {
      src: ["./src/img/**/*.pdf"],
      dist: "./dist/img/",
    },
    roistatPhp: {
      src: "./src/roistat.php",
      dist: "./dist/",
    },
    roistatJs: {
      src: "./src/roistat.js",
      dist: "./dist/js/",
    },
    images: {
      src: [
        "./src/img/**/*.{jpg,jpeg,png,gif,tiff,svg,pdf}",
        "!./src/img/favicon/*.{jpg,jpeg,png,gif,tiff}",
      ],
      dist: "./dist/img/",
      watch: "./src/img/**/*.{jpg,jpeg,png,gif,svg,tiff}",
    },
    webp: {
      src: [
        "./src/img/**/*.{jpg,jpeg,png,tiff}",
        "!./src/img/favicon/*.{jpg,jpeg,png,gif,tiff}",
      ],
      dist: "./dist/img/",
      watch: [
        "./src/img/**/*.{jpg,jpeg,png,tiff}",
        "!./src/img/favicon/*.{jpg,jpeg,png,gif,tiff}",
      ],
    },
    sprites: {
      src: "./src/img/svg/*.svg",
      dist: "./dist/img/sprites/",
      watch: "./src/img/svg/*.svg",
    },
    fonts: {
      src: "./src/fonts/**/*.{woff,woff2}",
      dist: "./dist/fonts/",
      watch: "./src/fonts/**/*.{woff,woff2}",
    },
    favicons: {
      src: "./src/img/favicon/*.{jpg,jpeg,png,gif}",
      dist: "./dist/img/favicons/",
    },
    gzip: {
      src: "./src/.htaccess",
      dist: "./dist/",
    },
    folder: {
      src: ["./src/sendgrid-php-7.5.2/**/*.*"],
      dist: "./dist/sendgrid-php-7.5.2/",
    },
  };

requireDir("./gulp-tasks/");

export { paths };

export const development = gulp.series(
  "clean",
  gulp.parallel([
    "views",
    "styles",
    "scripts",
    "images",
    "fonts",
    "favicons",
    "pdf",
    "roistat-php",
    "roistat-js",
  ]),
  gulp.parallel("serve")
);

export const prod = gulp.series(
  "clean",
  gulp.series([
    "views",
    "styles",
    "scripts",
    "images",
    "fonts",
    "favicons",
    "pdf",
    "roistat-php",
    "roistat-js",
    "moveFolder",
  ])
);

export default development;
