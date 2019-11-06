var gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps"),
    browserSync = require("browser-sync").create(),
    imagemin = require("gulp-imagemin");
    svgSymbols = require("gulp-svg-symbols");
    svgSymbols2js = require("gulp-svg-symbols2js");
    svgSprite = require("gulp-svg-sprites");
    htmlmin = require("gulp-html-minifier");
    uglify = require('gulp-uglify');
    

var paths = {
    styles: {
        src: "src/scss/**/*.scss",
        dest: "src/css"
    }
};

//root
var root = './src';

//style
function style() {
    return gulp
        .src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest));
        
}

// image min
function imgmin() {
        return gulp.src('src/images/**/*.+(png|gif|jpg|jpeg)')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 7 })
        ]))
            .pipe(gulp.dest('dist/images'))
}

//svg icon sympols
function svgmin() {
    return gulp.src('src/images/icons/**/*.svg')
    .pipe(svgSymbols())
    .pipe(svgSymbols2js())

    .pipe(gulp.dest("dist/images/icons"));
}

//svg  icon sprite
function svgsprite() {
    return gulp.src('src/images/icons/svg/**/*.svg')
    .pipe(svgSprite({mode: "symbols"}))

    .pipe(gulp.dest("dist/images/icons/sprite"));
}

//bootstrap copy
var vendorSrc = root + 'node_modules/bootstrap/**/*',
    vendorDist = root + 'src/vendor/';

//html minifier
function minify() {
    return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))

    .pipe(gulp.dest('./dist'))
}

//js minify

function jsminify() {
    return gulp.src('src/js/*.js')
    
        .pipe(gulp.dest('./dist/js'));
        
}

//vendor output
function vendor() {
    return gulp.src([vendorSrc])
        .pipe(gulp.dest(vendorDist));
        
}




function watch() {
    browserSync.init({
        server: {
            baseDir: "./src"
        }
    });
    gulp.watch(paths.styles.src, style);
    gulp.watch('src/images/**/*.+(png|gif|jpg|jpeg)', imgmin);
    gulp.watch('src/icons/**/*.svg)', svgmin);
    gulp.watch('src/images/icons/svg/**/*.svg)', svgsprite);
    gulp.watch('node_modules/bootstrap/**/*)', vendor);
    gulp.watch([paths.styles.dest, 'dist/*.html', 'dist/js']).on('change', browserSync.reload);
    gulp.watch('src/*.html', minify);
    gulp.watch('src/js/*.js', jsminify);
}

exports.watch = watch;
exports.style = style;
exports.imgmin = imgmin;
exports.imgmin = svgmin;
exports.imgmin = svgsprite;
exports.vendor = vendor;
exports.minify = minify;
exports.jsminify = jsminify;

var build = gulp.parallel(style, imgmin, svgmin, vendor, minify, svgsprite, jsminify, watch);
gulp.task('default', build);