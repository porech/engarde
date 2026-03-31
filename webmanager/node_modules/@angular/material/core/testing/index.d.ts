import { OptionHarnessFilters, MatOptionHarness } from '../../option-harness.d.js';
import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';

interface OptgroupHarnessFilters extends BaseHarnessFilters {
    labelText?: string | RegExp;
}

/** Harness for interacting with a `mat-optgroup` in tests. */
declare class MatOptgroupHarness extends ComponentHarness {
    /** Selector used to locate option group instances. */
    static hostSelector: string;
    private _label;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a option group with specific
     * attributes.
     * @param options Options for filtering which option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatOptgroupHarness>(this: ComponentHarnessConstructor<T>, options?: OptgroupHarnessFilters): HarnessPredicate<T>;
    /** Gets the option group's label text. */
    getLabelText(): Promise<string>;
    /** Gets whether the option group is disabled. */
    isDisabled(): Promise<boolean>;
    /**
     * Gets the options that are inside the group.
     * @param filter Optionally filters which options are included.
     */
    getOptions(filter?: OptionHarnessFilters): Promise<MatOptionHarness[]>;
}

export { MatOptgroupHarness, MatOptionHarness, OptionHarnessFilters };
export type { OptgroupHarnessFilters };
