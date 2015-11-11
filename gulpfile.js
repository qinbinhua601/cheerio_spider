var gulp = require('gulp'),
    sass = require('gulp-ruby-sass')

gulp.task('sass', function() {
    return sass('css/_sass/**/*.sass')
        .on('error', sass.logError)
        .pipe(gulp.dest('css'))
})


gulp.task('watch', function() {
    gulp.watch('css/_sass/**/*.sass', ['sass']);
})

gulp.task('default', function() {
    gulp.start('sass', 'watch')
})