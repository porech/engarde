import { MatProgressSpinner } from '../progress-spinner.d.js';
export { MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY, MatProgressSpinnerDefaultOptions, MatSpinner, ProgressSpinnerMode } from '../progress-spinner.d.js';
import * as i0 from '@angular/core';
import { MatCommonModule } from '../common-module.d.js';
import '../palette.d.js';
import '@angular/cdk/bidi';

declare class MatProgressSpinnerModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatProgressSpinnerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatProgressSpinnerModule, never, [typeof MatProgressSpinner, typeof MatProgressSpinner], [typeof MatProgressSpinner, typeof MatProgressSpinner, typeof MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatProgressSpinnerModule>;
}

export { MatProgressSpinner, MatProgressSpinnerModule };
