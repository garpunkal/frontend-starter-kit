const gulp = require("gulp");
const gulpif = require("gulp-if");
const nunjucksRender = require("gulp-nunjucks-render");
const projectPath = require("../lib/projectPath");

gulp.task("html", function() {
  paths = {
    src: [
      projectPath(PATH_CONFIG.lab, "**/*.html"),
      projectPath(PATH_CONFIG.BASE, PATH_CONFIG.html.src, "**/*.html"),
      // `./node_modules/giza-framework/html/components`,
      // `./node_modules/jaywing-frontend-component-library/html/components`,
      "!" +
        projectPath(
          PATH_CONFIG.BASE,
          PATH_CONFIG.html.src,
          "**/{layouts,shared,macros,data}/**"
        )
    ],
    src_render: [
      projectPath(PATH_CONFIG.lab),
      `./node_modules/jaywing-frontend-component-library/lab`,
      `./node_modules/giza-framework/lab/html`,
      `./node_modules/jaywing-frontend-component-library/html/components`,
      `./node_modules/jaywing-frontend-component-library/html/macros`,
      `./node_modules/giza-framework/html/components`,
      `./node_modules/giza-framework/html/macros`,
      projectPath(PATH_CONFIG.BASE, PATH_CONFIG.html.src)
    ],
    dest: projectPath(PATH_CONFIG.buildDest, PATH_CONFIG.buildSite)
  };

  return gulp
    .src(paths.src)
    .pipe(
      nunjucksRender({
        path: paths.src_render
      })
    )
    .pipe(gulp.dest(paths.dest));
});
