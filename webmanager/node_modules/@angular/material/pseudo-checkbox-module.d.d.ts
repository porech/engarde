import * as i0 from '@angular/core';
import { MatCommonModule } from './common-module.d.js';

/**
 * Possible states for a pseudo checkbox.
 * @docs-private
 */
type MatPseudoCheckboxState = 'unchecked' | 'checked' | 'indeterminate';
/**
 * Component that shows a simplified checkbox without including any kind of "real" checkbox.
 * Meant to be used when the checkbox is purely decorative and a large number of them will be
 * included, such as for the options in a multi-select. Uses no SVGs or complex animations.
 * Note that theming is meant to be handled by the parent element, e.g.
 * `mat-primary .mat-pseudo-checkbox`.
 *
 * Note that this component will be completely invisible to screen-reader users. This is *not*
 * interchangeable with `<mat-checkbox>` and should *not* be used if the user would directly
 * interact with the checkbox. The pseudo-checkbox should only be used as an implementation detail
 * of more complex components that appropriately handle selected / checked state.
 * @docs-private
 */
declare class MatPseudoCheckbox {
    _animationsDisabled: boolean;
    /** Display state of the checkbox. */
    state: MatPseudoCheckboxState;
    /** Whether the checkbox is disabled. */
    disabled: boolean;
    /**
     * Appearance of the pseudo checkbox. Default appearance of 'full' renders a checkmark/mixedmark
     * indicator inside a square box. 'minimal' appearance only renders the checkmark/mixedmark.
     */
    appearance: 'minimal' | 'full';
    constructor(...args: unknown[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatPseudoCheckbox, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatPseudoCheckbox, "mat-pseudo-checkbox", never, { "state": { "alias": "state"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "appearance": { "alias": "appearance"; "required": false; }; }, {}, never, never, true, never>;
}

declare class MatPseudoCheckboxModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatPseudoCheckboxModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatPseudoCheckboxModule, never, [typeof MatCommonModule, typeof MatPseudoCheckbox], [typeof MatPseudoCheckbox]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatPseudoCheckboxModule>;
}

export { MatPseudoCheckbox, MatPseudoCheckboxModule };
export type { MatPseudoCheckboxState };
