import { HarnessPredicate } from '@angular/cdk/testing';
import { MatFormFieldControlHarnessFilters, MatFormFieldControlHarnessBase } from '@angular/material/form-field/testing/control';

/** A set of criteria that can be used to filter a list of `MatInputHarness` instances. */
interface InputHarnessFilters extends MatFormFieldControlHarnessFilters {
    /** Filters based on the value of the input. */
    value?: string | RegExp;
    /** Filters based on the placeholder text of the input. */
    placeholder?: string | RegExp;
}

/** Harness for interacting with a standard Material inputs in tests. */
declare class MatInputHarness extends MatFormFieldControlHarnessBase {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatInputHarness` that meets
     * certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: InputHarnessFilters): HarnessPredicate<MatInputHarness>;
    /** Whether the input is disabled. */
    isDisabled(): Promise<boolean>;
    /** Whether the input is required. */
    isRequired(): Promise<boolean>;
    /** Whether the input is readonly. */
    isReadonly(): Promise<boolean>;
    /** Gets the value of the input. */
    getValue(): Promise<string>;
    /** Gets the name of the input. */
    getName(): Promise<string>;
    /**
     * Gets the type of the input. Returns "textarea" if the input is
     * a textarea.
     */
    getType(): Promise<string>;
    /** Gets the placeholder of the input. */
    getPlaceholder(): Promise<string>;
    /** Gets the id of the input. */
    getId(): Promise<string>;
    /**
     * Focuses the input and returns a promise that indicates when the
     * action is complete.
     */
    focus(): Promise<void>;
    /**
     * Blurs the input and returns a promise that indicates when the
     * action is complete.
     */
    blur(): Promise<void>;
    /** Whether the input is focused. */
    isFocused(): Promise<boolean>;
    /**
     * Sets the value of the input. The value will be set by simulating
     * keypresses that correspond to the given value.
     */
    setValue(newValue: string): Promise<void>;
}

export { MatInputHarness };
export type { InputHarnessFilters };
