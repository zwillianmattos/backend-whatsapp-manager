import buffer from "vinyl-buffer";
import del from "del";
import gulp, { dest, series } from "gulp";
import gzip from "gulp-gzip";
import uglify from "gulp-uglify";
import rename from "gulp-rename";
import ts from "gulp-typescript";

const tar = require("gulp-tar");

const convertToJSFiles = () => {
  console.info("Gerando arquivos compilados do Typescript");

  const project = ts.createProject("tsconfig.json");

  return project.src().pipe(project()).pipe(dest("build"));
};

const uglifyFiles = () => {
  console.info("Iniciando processo de minificação dos arquivos");

  return gulp
    .src("build/**/*.js")
    .pipe(buffer())
    .pipe(uglify({ mangle: true }))
    .pipe(dest("build"));
};

const copyAnotherFiles = () => {
  console.info("Gerando arquivo .env");

  gulp.src(".env").pipe(dest("build"));
  // gulp.src(".env.example").pipe(rename(".env")).pipe(dest("build"));
  
  gulp.src("package.json").pipe(dest("build"));

  console.info(
    "Copiando arquivos da pasta node_modules. Isso pode levar algum tempo..."
  );

  return gulp.src("node_modules/**/*").pipe(dest("build/node_modules"));
};

const generateTarGzip = () => {
  console.info("Criando arquivo compactado na pasta dist");

  return gulp
    .src(["build/**/*", "build/.env"])
    .pipe(tar("barbearia-santo-sete.tar"))
    .pipe(gzip())
    .pipe(dest("dist"));
};

const removeBuildFolder = () => {
  console.log("Limpando arquivos gerados durante o build");

  return del("build");
};

export default series(
  convertToJSFiles,
  uglifyFiles,
  copyAnotherFiles,
  generateTarGzip,
  removeBuildFolder
);
