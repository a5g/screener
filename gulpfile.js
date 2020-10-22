const gulp = require('gulp')
const run = require('gulp-run-command').default

gulp.task('clean', run(`jest __tests__/clean.test.ts`))
gulp.task('get', run(`jest __tests__/01.get_companies.test.ts`))
gulp.task('filter', run(`jest __tests__/02.filter_by_profit.test.ts`))
gulp.task('trim', run(`jest __tests__/03.trim_profit_data.test.ts`))
gulp.task('kummi', run(`jest __tests__/04.get_data_kummi.test.ts`))
gulp.task('anand', run(`jest __tests__/05.get_data_anand.test.ts`))

gulp.task(
  'profit',
  gulp.series(['clean', 'get', 'filter', 'trim', 'kummi', 'anand']),
)
gulp.task('all', gulp.series(['clean', 'get', 'kummi', 'anand']))
