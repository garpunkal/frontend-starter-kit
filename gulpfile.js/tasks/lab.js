const gulp = require("gulp");
const gulpif = require("gulp-if");
const data = require("gulp-data");
const path = require("path");
const fs = require("fs");
const nunjucksRender = require("gulp-nunjucks-render");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const projectPath = require("../lib/projectPath");

gulp.task("lab:html", function() {
  paths = {
    src: [
      projectPath(PATH_CONFIG.lab, "**/*.html"),
      "!" +
        projectPath(
          PATH_CONFIG.lab,
          "**/{components,layouts,shared,macros,data}/**"
        )
    ],
    src_render: [
      projectPath(PATH_CONFIG.lab),
      `./node_modules/jaywing-frontend-component-library/lab`,
      `./node_modules/giza-lab/html`,
      projectPath(PATH_CONFIG.lab),
      projectPath(PATH_CONFIG.BASE, PATH_CONFIG.html.src)
    ],
    dest: projectPath(PATH_CONFIG.buildDest, PATH_CONFIG.buildLab)
  };

  const dataFunction = function() {
    var dataPath = path.resolve(`${PATH_CONFIG.BASE}/lab/data/global.json`);
    return JSON.parse(fs.readFileSync(dataPath, "utf8"));
  };

  return gulp
    .src(paths.src)
    .pipe(data(dataFunction))
    .pipe(
      nunjucksRender({
        path: paths.src_render
      })
    )
    .pipe(gulp.dest(paths.dest));
});

gulp.task("lab:stylesheets", function() {
  paths = {
    src: [
      `./node_modules/jaywing-frontend-component-library/dist/lab/stylesheets/lab.css`,
      ,
      projectPath(PATH_CONFIG.lab, PATH_CONFIG.stylesheets.src, "**/*.scss")
    ],
    dest: projectPath(
      PATH_CONFIG.buildDest,
      PATH_CONFIG.buildLab,
      PATH_CONFIG.stylesheets.dest
    )
  };

  return gulp
    .src(paths.src)
    .pipe(gulpif(!production, sourcemaps.init()))
    .pipe(plumber())
    .pipe(
      sass({
        includePaths: ["node_modules", "scss"]
      }).on("error", sass.logError)
    )
    .pipe(
      postcss([
        autoprefixer({
          browsers: ["> 1%"]
        })
      ])
    )
    .pipe(gulpif(production, sass({ outputStyle: "compressed" })))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dest));
});

gulp.task("lab:javascripts", function() {
  paths = {
    src: projectPath(
      "./node_modules/jaywing-frontend-component-library/dist/lab/javascripts/**/{*,*.*}.js"
    ),
    dest: projectPath(
      PATH_CONFIG.buildDest,
      PATH_CONFIG.buildLab,
      PATH_CONFIG.javascripts.dest
    )
  };
  return gulp.src(paths.src).pipe(gulp.dest(paths.dest));
});