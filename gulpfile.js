const gulp = require('gulp');
const pipe = require('gulp-pipe');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const addsrc = require('gulp-add-src');
const args = require('gulp-args');
const less = require('gulp-less');
const uglify = require('gulp-uglify-es').default;
const modules = require('.//modules')(args.corePath, args.coreModulesObjectPath);
const jsModules = modules.jsModules;
const lessModules = modules.lessModules;
const cssModules = modules.cssModules;

gulp.task('generate-all-combined-js', () => 
	pipe([
		gulp.src(jsModules)
		,babel({})
		,uglify()
		,addsrc.prepend(args.extPath)
		,concat('all-combined.js')
		,gulp.dest(args.combinedPath)
	])
);

gulp.task('generate-all-combined-css', () => 
	pipe([
		gulp.src(cssModules)
		,concat('all-combined.css')
		,gulp.dest(args.combinedPath)
	])
);

gulp.task('generate-all-combined-less', () => 
	pipe([
		gulp.src(lessModules)
		,concat('all-combined.less')
		,gulp.dest(args.combinedPath)
	])
);
