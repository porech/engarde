export { MatFormFieldControlHarness, MatFormFieldControlHarnessBase } from '../../../form-field-control-harness.d.js';
import { BaseHarnessFilters } from '@angular/cdk/testing';

/**
 * A set of criteria shared by any class derived from `MatFormFieldControlHarness`, that can be
 * used to filter a list of those components.
 */
interface MatFormFieldControlHarnessFilters extends BaseHarnessFilters {
    /** Filters based on the text of the form field's floating label. */
    label?: string | RegExp;
}

export type { MatFormFieldControlHarnessFilters };
