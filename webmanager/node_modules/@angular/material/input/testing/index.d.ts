export { InputHarnessFilters, MatInputHarness } from '../../input-harness.d.js';
import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatFormFieldControlHarnessBase } from '../../form-field-control-harness.d.js';
import { MatFormFieldControlHarnessFilters } from '@angular/material/form-field/testing/control';

/** A set of criteria that can be used to filter a list of `MatNativeSelectHarness` instances. */
interface NativeSelectHarnessFilters extends MatFormFieldControlHarnessFilters {
}
/** A set of criteria that can be used to filter a list of `MatNativeOptionHarness` instances. */
interface NativeOptionHarnessFilters extends BaseHarnessFilters {
    text?: string | RegExp;
    index?: number;
    isSelected?: boolean;
}

/** Harness for interacting with a native `option` in tests. */
declare class MatNativeOptionHarness extends ComponentHarness {
    /** Selector used to locate option instances. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatNativeOptionHarness` that meets
     * certain criteria.
     * @param options Options for filtering which option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: NativeOptionHarnessFilters): HarnessPredicate<MatNativeOptionHarness>;
    /** Gets the option's label text. */
    getText(): Promise<string>;
    /** Index of the option within the native `select` element. */
    getIndex(): Promise<number>;
    /** Gets whether the option is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets whether the option is selected. */
    isSelected(): Promise<boolean>;
}

/** Harness for interacting with a native `select` in tests. */
declare class MatNativeSelectHarness extends MatFormFieldControlHarnessBase {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatNativeSelectHarness` that meets
     * certain criteria.
     * @param options Options for filtering which select instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: NativeSelectHarnessFilters): HarnessPredicate<MatNativeSelectHarness>;
    /** Gets a boolean promise indicating if the select is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets a boolean promise indicating if the select is required. */
    isRequired(): Promise<boolean>;
    /** Gets a boolean promise indicating if the select is in multi-selection mode. */
    isMultiple(): Promise<boolean>;
    /** Gets the name of the select. */
    getName(): Promise<string>;
    /** Gets the id of the select. */
    getId(): Promise<string>;
    /** Focuses the select and returns a void promise that indicates when the action is complete. */
    focus(): Promise<void>;
    /** Blurs the select and returns a void promise that indicates when the action is complete. */
    blur(): Promise<void>;
    /** Whether the select is focused. */
    isFocused(): Promise<boolean>;
    /** Gets the options inside the select panel. */
    getOptions(filter?: NativeOptionHarnessFilters): Promise<MatNativeOptionHarness[]>;
    /**
     * Selects the options that match the passed-in filter. If the select is in multi-selection
     * mode all options will be clicked, otherwise the harness will pick the first matching option.
     */
    selectOptions(filter?: NativeOptionHarnessFilters): Promise<void>;
}

export { MatNativeOptionHarness, MatNativeSelectHarness };
export type { NativeOptionHarnessFilters, NativeSelectHarnessFilters };
