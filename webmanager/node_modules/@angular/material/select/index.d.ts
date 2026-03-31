export { MAT_SELECT_CONFIG, MAT_SELECT_SCROLL_STRATEGY, MAT_SELECT_SCROLL_STRATEGY_PROVIDER, MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY, MAT_SELECT_TRIGGER, MatSelect, MatSelectChange, MatSelectConfig, MatSelectModule, MatSelectTrigger } from '../select-module.d.js';
export { MatOptgroup, MatOption } from '../option.d.js';
export { MatLabel } from '../form-field-module.d.js';
export { MatError, MatFormField, MatHint, MatPrefix, MatSuffix } from '../form-field.d.js';
import '@angular/core';
import '@angular/cdk/overlay';
import '../option-module.d.js';
import '../ripple-module.d.js';
import '../common-module.d.js';
import '@angular/cdk/bidi';
import '../ripple.d.js';
import '@angular/cdk/platform';
import '../pseudo-checkbox-module.d.js';
import '@angular/cdk/a11y';
import '@angular/cdk/collections';
import '@angular/cdk/scrolling';
import '@angular/forms';
import 'rxjs';
import '../error-options.d.js';
import '../form-field-control.d.js';
import '@angular/cdk/observers';
import '@angular/cdk/coercion';
import '../palette.d.js';

/**
 * The following are all the animations for the mat-select component, with each
 * const containing the metadata for one animation.
 *
 * The values below match the implementation of the AngularJS Material mat-select animation.
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
declare const matSelectAnimations: {
    readonly transformPanel: any;
};

export { matSelectAnimations };
