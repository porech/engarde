import { MatButtonToggleGroup, MatButtonToggle } from '../button-toggle.d.js';
export { MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS, MAT_BUTTON_TOGGLE_GROUP, MAT_BUTTON_TOGGLE_GROUP_DEFAULT_OPTIONS_FACTORY, MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR, MatButtonToggleAppearance, MatButtonToggleChange, MatButtonToggleDefaultOptions, ToggleType } from '../button-toggle.d.js';
import * as i0 from '@angular/core';
import { MatCommonModule } from '../common-module.d.js';
import { MatRippleModule } from '../ripple-module.d.js';
import '@angular/cdk/bidi';
import '@angular/forms';
import '../ripple.d.js';
import '@angular/cdk/platform';

declare class MatButtonToggleModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatButtonToggleModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatButtonToggleModule, never, [typeof MatCommonModule, typeof MatRippleModule, typeof MatButtonToggleGroup, typeof MatButtonToggle], [typeof MatCommonModule, typeof MatButtonToggleGroup, typeof MatButtonToggle]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatButtonToggleModule>;
}

export { MatButtonToggle, MatButtonToggleGroup, MatButtonToggleModule };
