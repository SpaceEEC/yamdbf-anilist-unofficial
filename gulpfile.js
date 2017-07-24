const gulp = require('gulp');
const gulpTs = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');

const project = gulpTs.createProject('tsconfig.json');

gulp.task('default', () => {
	del.sync(['./bin/**/*.*']);

	const tsCompile = gulp.src('./src/**/*.ts')
		.pipe(sourcemaps.init())
		.pipe(project())

	tsCompile.pipe(gulp.dest('bin/'));

	tsCompile.js
		.pipe(sourcemaps.write({ sourceRoot: '../src/' }))
		.pipe(gulp.dest('bin/'));

	gulp.src('./src/**/*.lang')
		.pipe(gulp.dest('bin/'));

		gulp.src('./src/**/*.json')
		.pipe(gulp.dest('bin/'));
});
