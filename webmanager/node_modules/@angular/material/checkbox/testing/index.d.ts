import * as _angular_cdk_testing from '@angular/cdk/testing';
import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';

/** A set of criteria that can be used to filter a list of `MatCheckboxHarness` instances. */
interface CheckboxHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose label matches the given value. */
    label?: string | RegExp;
    /** Only find instances whose name attribute is the given value. */
    name?: string;
    /** Only find instances with the given checked value. */
    checked?: boolean;
    /** Only find instances which match the given disabled state. */
    disabled?: boolean;
}

/** Harness for interacting with a mat-checkbox in tests. */
declare class MatCheckboxHarness extends ComponentHarness {
    static hostSelector: string;
    _input: () => Promise<_angular_cdk_testing.TestElement>;
    private _label;
    private _inputContainer;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a checkbox with specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a checkbox whose host element matches the given selector.
     *   - `label` finds a checkbox with specific label text.
     *   - `name` finds a checkbox with specific name.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatCheckboxHarness>(this: ComponentHarnessConstructor<T>, options?: CheckboxHarnessFilters): HarnessPredicate<T>;
    /** Whether the checkbox is checked. */
    isChecked(): Promise<boolean>;
    /** Whether the checkbox is in an indeterminate state. */
    isIndeterminate(): Promise<boolean>;
    /** Whether the checkbox is disabled. */
    isDisabled(): Promise<boolean>;
    /** Whether the checkbox is required. */
    isRequired(): Promise<boolean>;
    /** Whether the checkbox is valid. */
    isValid(): Promise<boolean>;
    /** Gets the checkbox's name. */
    getName(): Promise<string | null>;
    /** Gets the checkbox's value. */
    getValue(): Promise<string | null>;
    /** Gets the checkbox's aria-label. */
    getAriaLabel(): Promise<string | null>;
    /** Gets the checkbox's aria-labelledby. */
    getAriaLabelledby(): Promise<string | null>;
    /** Gets the checkbox's label text. */
    getLabelText(): Promise<string>;
    /** Focuses the checkbox. */
    focus(): Promise<void>;
    /** Blurs the checkbox. */
    blur(): Promise<void>;
    /** Whether the checkbox is focused. */
    isFocused(): Promise<boolean>;
    /**
     * Toggles the checked state of the checkbox.
     *
     * Note: This attempts to toggle the checkbox as a user would, by clicking it. Therefore if you
     * are using `MAT_CHECKBOX_DEFAULT_OPTIONS` to change the behavior on click, calling this method
     * might not have the expected result.
     */
    toggle(): Promise<void>;
    /**
     * Puts the checkbox in a checked state by toggling it if it is currently unchecked, or doing
     * nothing if it is already checked.
     *
     * Note: This attempts to check the checkbox as a user would, by clicking it. Therefore if you
     * are using `MAT_CHECKBOX_DEFAULT_OPTIONS` to change the behavior on click, calling this method
     * might not have the expected result.
     */
    check(): Promise<void>;
    /**
     * Puts the checkbox in an unchecked state by toggling it if it is currently checked, or doing
     * nothing if it is already unchecked.
     *
     * Note: This attempts to uncheck the checkbox as a user would, by clicking it. Therefore if you
     * are using `MAT_CHECKBOX_DEFAULT_OPTIONS` to change the behavior on click, calling this method
     * might not have the expected result.
     */
    uncheck(): Promise<void>;
}

export { MatCheckboxHarness };
export type { CheckboxHarnessFilters };
