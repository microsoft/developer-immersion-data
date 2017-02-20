import {  TMP_DIR, PROD_DEST } from '../../config';
import { clean } from '../../utils';

/**
 * Executes the build process, cleaning all files within the `/dist/dev` and `dist/tmp` directory.
 */
export = clean([PROD_DEST, TMP_DIR]);
