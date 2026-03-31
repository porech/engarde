export { MAT_ERROR, MAT_FORM_FIELD, MAT_FORM_FIELD_DEFAULT_OPTIONS, MAT_PREFIX, MAT_SUFFIX, MatError, MatFormField, MatFormFieldControl, MatHint, MatLabel, MatPrefix, MatSuffix, getMatFormFieldDuplicatedHintError, getMatFormFieldMissingControlError, getMatFormFieldPlaceholderConflictError } from './form-field2.mjs';
export { MatFormFieldModule } from './form-field-module.mjs';
import '@angular/cdk/a11y';
import '@angular/cdk/bidi';
import '@angular/cdk/coercion';
import '@angular/cdk/platform';
import '@angular/common';
import '@angular/core';
import 'rxjs';
import 'rxjs/operators';
import '@angular/cdk/observers/private';
import './animation.mjs';
import '@angular/cdk/layout';
import '@angular/cdk/observers';
import './common-module.mjs';

/**
 * Animations used by the MatFormField.
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
const matFormFieldAnimations = {
    // Represents:
    // trigger('transitionMessages', [
    //   // TODO(mmalerba): Use angular animations for label animation as well.
    //   state('enter', style({opacity: 1, transform: 'translateY(0%)'})),
    //   transition('void => enter', [
    //     style({opacity: 0, transform: 'translateY(-5px)'}),
    //     animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
    //   ]),
    // ])
    /** Animation that transitions the form field's error and hint messages. */
    transitionMessages: {
        type: 7,
        name: 'transitionMessages',
        definitions: [
            {
                type: 0,
                name: 'enter',
                styles: {
                    type: 6,
                    styles: { opacity: 1, transform: 'translateY(0%)' },
                    offset: null,
                },
            },
            {
                type: 1,
                expr: 'void => enter',
                animation: [
                    { type: 6, styles: { opacity: 0, transform: 'translateY(-5px)' }, offset: null },
                    { type: 4, styles: null, timings: '300ms cubic-bezier(0.55, 0, 0.55, 0.2)' },
                ],
                options: null,
            },
        ],
        options: {},
    },
};

export { matFormFieldAnimations };
//# sourceMappingURL=form-field.mjs.map
