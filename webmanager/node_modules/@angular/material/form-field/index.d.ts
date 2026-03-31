export { MatFormFieldModule, MatLabel } from '../form-field-module.d.js';
export { FloatLabelType, MAT_ERROR, MAT_FORM_FIELD, MAT_FORM_FIELD_DEFAULT_OPTIONS, MAT_PREFIX, MAT_SUFFIX, MatError, MatFormField, MatFormFieldAppearance, MatFormFieldDefaultOptions, MatHint, MatPrefix, MatSuffix, SubscriptSizing } from '../form-field.d.js';
export { MatFormFieldControl } from '../form-field-control.d.js';
import '@angular/core';
import '../common-module.d.js';
import '@angular/cdk/bidi';
import '@angular/cdk/observers';
import '@angular/cdk/coercion';
import '@angular/forms';
import '../palette.d.js';
import 'rxjs';

/** @docs-private */
declare function getMatFormFieldPlaceholderConflictError(): Error;
/** @docs-private */
declare function getMatFormFieldDuplicatedHintError(align: string): Error;
/** @docs-private */
declare function getMatFormFieldMissingControlError(): Error;

/**
 * Animations used by the MatFormField.
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
declare const matFormFieldAnimations: {
    readonly transitionMessages: any;
};

export { getMatFormFieldDuplicatedHintError, getMatFormFieldMissingControlError, getMatFormFieldPlaceholderConflictError, matFormFieldAnimations };
