var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var path = require('path');
var del  = require('del');
var exec = require('child_process').exec

var distPath    = path.resolve('./dist');
var version     = ''; // 版本号
var versionPath = ''; // 版本号路径
var env         = ''; // 运行环境

// 创建版本号(年月日时分)
(function () {
  var d = new Date();
  var yy = d.getFullYear().toString().slice(2);
  var MM = d.getMonth() + 1 >= 10 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);
  var DD = d.getDate() >= 10 ? d.getDate() : '0' + d.getDate();
  var h  = d.getHours() >= 10 ? d.getHours() : '0' + d.getHours();
  var mm = d.getMinutes() >= 10 ? d.getMinutes() : '0' + d.getMinutes();
  version = yy + MM + DD + h + mm;
  versionPath = distPath + '/' + version;
})();

env = process.env.npm_config_qa ? 'qa' : process.env.npm_config_uat ? 'uat' : 'prod'  

// 编译
gulp.task('build', function(done){  
  exec('node build/build.js', function(err, stdout, stderr) {
    console.log(stdout)
    console.log(stderr)    
    done(err)
  })
});


gulp.task('create:versionCatalog', function() {
  return gulp.src(`${distPath}/static/**/*`)
  .pipe(gulp.dest(`${versionPath}/static/`))   
})

// gulp.task('replace:cdnUrl', function() {
//   return gulp.src(`${versionPath}/static/js/manifest.js`)
//     .pipe($.replace(new RegExp(`"${require('./config').build.assetsPublicPath}"`, 'g'), 'window.SITE_CONFIG.cdnUrl + "/"'))
//     .pipe(gulp.dest(`${versionPath}/static/js/`))  
// })

gulp.task('replace:cdnUrl', function() {
  return gulp.src(`${distPath}/static/js/manifest.js`)
    .pipe($.replace(new RegExp(`"${require('./config').build.assetsPublicPath}"`, 'g'), 'window.SITE_CONFIG.cdnUrl + "/"'))
    .pipe(gulp.dest(`${distPath}/static/js/`))  
})

gulp.task('replace:version', function() {
  return gulp.src(`${distPath}/static/config/index-${env}.js`)
    .pipe($.replace(/window.SITE_CONFIG\['version'\] = '.*'/g, `window.SITE_CONFIG['version'] = '${version}'`))
    .pipe(gulp.dest(`${distPath}/static/config/`))  
})

gulp.task('replace:html', function () {
  return gulp.src(`${distPath}/index.html`)
    .pipe($.replace('./config/index.js', `${version}/config/index.js`))
    .pipe(gulp.dest(`${distPath}/`))
})

gulp.task('concat:config', function() {
  return gulp.src([`${distPath}/static/config/index-${env}.js`, `${distPath}/static/config/init.js`])
    .pipe($.concat('index.js'))
    .pipe(gulp.dest(`${distPath}/`))
})

gulp.task('clean', function (done) {  
  return del([`${distPath}/**`], {force: true}, done)  
});

gulp.task('default', gulp.series('clean', 'build', 'replace:cdnUrl', 'replace:version', 'concat:config', function (done) {    
  return del([`${versionPath}/static/config`], done)    
}))