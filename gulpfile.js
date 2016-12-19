
const path = require('path');
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const del = require('del');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');

const $ = gulpLoadPlugins({
    rename: {
        'gulp-angular-templatecache': 'templateCache'
    }
});

const config = {
    dist: '../U9MobileDev/apps/ExpAccount'
};

var dev = true;

gulp.task('csslint', function() {
    return gulp.src('app/css/**/*.css')
        .pipe($.csslint('.csslintrc'))
        .pipe($.csslint.formatter())
        .pipe($.if(dev, gulp.dest(path.join(config.dist, 'www/css'))));
});

gulp.task('eslint', function() {
    return gulp.src('app/js/**/*.js')
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.if(dev, gulp.dest(path.join(config.dist, 'www/js'))));
});


gulp.task('html', () => {
    var partialsInjectFile = gulp.src('.tmp/templates.js', { read: false });
    var partialsInjectOptions = {
        starttag: '<!-- inject:templates -->',
        ignorePath: '.tmp',
        addRootSlash: false
    };

    return gulp.src('app/*.html')
        .pipe($.inject(partialsInjectFile, partialsInjectOptions))
        .pipe($.useref())
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cssnano({ safe: true, autoprefixer: false })))
        .pipe($.if('*.html', $.htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest(path.join(config.dist, 'www')));
});

gulp.task('images', () => {
    return gulp.src('app/img/**/*')
        .pipe($.cache($.imagemin()))
        .pipe(gulp.dest(path.join(config.dist, 'www/img')));
});

gulp.task('tpls', () => {
    return gulp.src('app/tpls/**/*')
        .pipe(gulp.dest(path.join(config.dist, 'www/tpls')));
});

gulp.task('fonts', function() {
    return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function(err) {}))
        .pipe(gulp.dest(path.join(config.dist, 'www/fonts')));
});

gulp.task('templatecache', function() {
    return gulp.src('app/tpls/**/*.html')
        .pipe($.templateCache('templates.js', {
            root: 'tpls/',
            module: 'ExpAccount'
        }))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('logo', () => {
    return gulp.src('*.png')
        .pipe(gulp.dest(path.join(config.dist, 'www')));
});
gulp.task('extras', () => {
    return gulp.src('app.json').pipe(gulp.dest(config.dist));
});

gulp.task('clean', del.bind(null, ['.tmp', config.dist], { force: true }));

gulp.task('wiredep', () => {
    gulp.src('app/*.html')
        .pipe($.if(dev, wiredep({
            exclude: ['bootstrap.js']
        }), wiredep({
            exclude: ['bootstrap.js'],
            ignorePath: /^(\.\.\/)*\.\./
        })))
        .pipe($.if(dev, gulp.dest(path.join(config.dist, 'www')), gulp.dest('app')));
});

gulp.task('copydep', () => {
    gulp.src('bower_components/**/*')
        .pipe(gulp.dest(path.join(config.dist, 'bower_components')));
});

gulp.task('lint', function(done) {
    runSequence(['csslint', 'eslint'], done);
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'logo', 'extras'], () => {
    return gulp.src(path.join(config.dist, 'www/**/*')).pipe($.size({ title: 'build', gzip: true }));
});

gulp.task('default', () => {
    runSequence('clean', ['wiredep', 'copydep', 'lint', 'images', 'tpls', 'logo', 'extras'], () => {
        gulp.watch('app/css/**/*.css', ['csslint']);
        gulp.watch('app/js/**/*.js', ['eslint']);
        gulp.watch('app/img/**/*', ['images']);
        gulp.watch('app/tpls/**/*.html', ['tpls']);
    });
});

gulp.task('dist', () => {
    return new Promise(resolve => {
        dev = false;
        runSequence(['clean', 'wiredep', 'templatecache'], 'build', resolve);
    });
});
