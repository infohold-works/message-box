
var webpack = require('webpack')
var webpackConfig = require('../webpack.config.js')

var gulp = require('gulp')
var gutil = require('gulp-util')
var concat = require('gulp-concat')
var source = require('vinyl-source-stream')
var path = require('path')
var jetpack = require('fs-jetpack')


var utils = require('./utils')

var src = './app'
var dest = './build'

var projectDir = jetpack
var srcDir = projectDir.cwd(src)
var destDir = projectDir.cwd(dest)

var filesToCopyAll = [
    './app/app.html',
    './app/assets/**/*',
    './app/main.js',
    './app/vendor/**/*',
    './app/node_modules/**/*',
]

var filesToCopy = [
    './app/app.html',
    './app/assets/**/*',
    './app/main.js',
    '!./app/vendor/**/*',
    '!./app/node_modules/**/*',
]

// Make a dev copy of the config w/ source maps and debug enabled
var devConfig = Object.create(webpackConfig)
devConfig.devtool = 'source-map'
devConfig.debug = true

// Determine the node_modules dir is exists or not
var moduleExists = jetpack.exists(dest + '/node_modules') || jetpack.exists(dest + '/vendor')

gulp.task('clean', function() {
    if (!moduleExists) {
        return jetpack.cwd(dest).dir('.', { empty: true })
    } else {
        return jetpack.find(dest, {
            matching: ['*.json','*.html','*.css','*.js','*.map','!vendor/**/*','!node_modules/**/*']
        }).forEach(jetpack.remove)
    }
})

gulp.task('css', function () {
    var stylesheets = [
        './app/assets/plugins/bootstrap/css/bootstrap.min.css',
        './app/node_modules/font-awesome/css/font-awesome.min.css',
        './app/assets/plugins/flat-ui/css/flat-ui.min.css'
    ];
    return gulp.src(stylesheets)
        .pipe(concat('plugins.min.css'))
        .pipe(gulp.dest(dest + '/assets/css'))
})

gulp.task('js', function () {
    var stylesheets = [
        './app/assets/plugins/plugins.js',
        './app/assets/plugins/bootstrap/js/bootstrap.min.js',
        './app/assets/plugins/flat-ui/js/flat-ui.min.js'
    ];
    return gulp.src(stylesheets)
        .pipe(concat('plugins.min.js'))
        .pipe(gulp.dest(dest + '/assets/js'))
})

gulp.task('fonts', function() {
    var fonts = [
        './app/assets/plugins/bootstrap/fonts/*',
        './app/node_modules/font-awesome/fonts/*',
        './app/assets/plugins/flat-ui/fonts/**/*'
    ];
    return gulp.src(fonts)
        .pipe(gulp.dest(dest + '/assets/fonts'))
})

gulp.task('copy', function() {
    if (!moduleExists) {
        return gulp.src(filesToCopyAll, { base: 'app' })
            .pipe(gulp.dest(dest))
    } else {
        return gulp.src(filesToCopy, { base: 'app' })
            .pipe(gulp.dest(dest))
    }
})

gulp.task('webpack:build-dev', function(callback) {
    return webpack(devConfig, function(err, stats) {
        gutil.log('[webpack:build-dev]', stats.toString({ colors: true }))
        callback()
    })
})

gulp.task('finalize', ['clean'], function () {
  var manifest = srcDir.read('package.json', 'json')
  switch (utils.getEnvName()) {
      case 'development':
          // Add 'dev' suffix to name, so Electron will write all
          // data like cookies and localStorage into separate place.
          manifest.name += '-dev'
          manifest.productName += ' Dev'
          break
      case 'test':
          // Add 'test' suffix to name, so Electron will write all
          // data like cookies and localStorage into separate place.
          manifest.name += '-test'
          manifest.productName += ' Test'
          // Change the main entry to spec runner.
          manifest.main = 'spec.js'
          break
  }
  destDir.write('package.json', manifest)

  var configFilePath = projectDir.path('config/env_' + utils.getEnvName() + '.json')
  destDir.copy(configFilePath, 'env_config.json')
})

// Dev builds of assets with source maps and debug enabled
gulp.task('compile', ['css', 'js', 'fonts', 'copy'])
gulp.task('build-dev', ['clean', 'compile', 'webpack:build-dev'])
gulp.task('build', ['build-dev', 'finalize'])

var filesToWatch = [
  './**/*.js',
  './**/*.css',
  './**/*.vue',
  '!./vendor/**',
  '!./node_modules/**',
]

gulp.task('watch', function() {
  gulp.watch(filesToCopy, ['compile'])
  gulp.watch(filesToWatch, { cwd: 'app' }, ['webpack:build-dev'])  // This is watchign too many files and making things very angry.
})
