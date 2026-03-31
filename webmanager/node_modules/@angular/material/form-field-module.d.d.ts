import * as i0 from '@angular/core';
import { MatCommonModule } from './common-module.d.js';
import * as i2 from '@angular/cdk/observers';
import { MatFormField, MatError, MatHint, MatPrefix, MatSuffix } from './form-field.d.js';

/** The floating label for a `mat-form-field`. */
declare class MatLabel {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLabel, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatLabel, "mat-label", never, {}, {}, never, never, true, never>;
}

declare class MatFormFieldModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFormFieldModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatFormFieldModule, never, [typeof MatCommonModule, typeof i2.ObserversModule, typeof MatFormField, typeof MatLabel, typeof MatError, typeof MatHint, typeof MatPrefix, typeof MatSuffix], [typeof MatFormField, typeof MatLabel, typeof MatHint, typeof MatError, typeof MatPrefix, typeof MatSuffix, typeof MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatFormFieldModule>;
}

export { MatFormFieldModule, MatLabel };
