import * as gulp from 'gulp';

import { APP_DEST, APP_SRC } from '../../config';

export = () => {

    gulp.src([APP_SRC + '/../../sampledata/**/*'])
               .pipe(gulp.dest(APP_DEST + '/sampledata'));

    return gulp.src([APP_SRC + '/web.config'])
               .pipe(gulp.dest(APP_DEST + '/'));

};
