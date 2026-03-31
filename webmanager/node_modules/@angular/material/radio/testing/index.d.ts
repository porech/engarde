import * as _angular_cdk_testing from '@angular/cdk/testing';
import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';

/** A set of criteria that can be used to filter a list of `MatRadioGroupHarness` instances. */
interface RadioGroupHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose name attribute is the given value. */
    name?: string;
}
/** A set of criteria that can be used to filter a list of `MatRadioButtonHarness` instances. */
interface RadioButtonHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose label matches the given value. */
    label?: string | RegExp;
    /** Only find instances whose name attribute is the given value. */
    name?: string;
    /** Only find instances with the given checked value. */
    checked?: boolean;
}

/** Harness for interacting with a mat-radio-group in tests. */
declare class MatRadioGroupHarness extends ComponentHarness {
    /** The selector for the host element of a `MatRadioGroup` instance. */
    static hostSelector: string;
    private _buttonClass;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a radio group with specific
     * attributes.
     * @param options Options for filtering which radio group instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatRadioGroupHarness>(this: ComponentHarnessConstructor<T>, options?: RadioGroupHarnessFilters): HarnessPredicate<T>;
    /** Gets the name of the radio-group. */
    getName(): Promise<string | null>;
    /** Gets the id of the radio-group. */
    getId(): Promise<string | null>;
    /** Gets the checked radio-button in a radio-group. */
    getCheckedRadioButton(): Promise<MatRadioButtonHarness | null>;
    /** Gets the checked value of the radio-group. */
    getCheckedValue(): Promise<string | null>;
    /**
     * Gets a list of radio buttons which are part of the radio-group.
     * @param filter Optionally filters which radio buttons are included.
     */
    getRadioButtons(filter?: RadioButtonHarnessFilters): Promise<MatRadioButtonHarness[]>;
    /**
     * Checks a radio button in this group.
     * @param filter An optional filter to apply to the child radio buttons. The first tab matching
     *     the filter will be selected.
     */
    checkRadioButton(filter?: RadioButtonHarnessFilters): Promise<void>;
    /** Gets the name attribute of the host element. */
    private _getGroupNameFromHost;
    /** Gets a list of the name attributes of all child radio buttons. */
    private _getNamesFromRadioButtons;
    /** Checks if the specified radio names are all equal. */
    private _checkRadioNamesInGroupEqual;
    /**
     * Checks if a radio-group harness has the given name. Throws if a radio-group with
     * matching name could be found but has mismatching radio-button names.
     */
    protected static _checkRadioGroupName(harness: MatRadioGroupHarness, name: string): Promise<boolean>;
}
/** Harness for interacting with a mat-radio-button in tests. */
declare class MatRadioButtonHarness extends ComponentHarness {
    /** The selector for the host element of a `MatRadioButton` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a radio button with specific
     * attributes.
     * @param options Options for filtering which radio button instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatRadioButtonHarness>(this: ComponentHarnessConstructor<T>, options?: RadioButtonHarnessFilters): HarnessPredicate<T>;
    protected _textLabel: () => Promise<_angular_cdk_testing.TestElement>;
    protected _clickLabel: () => Promise<_angular_cdk_testing.TestElement>;
    private _input;
    /** Whether the radio-button is checked. */
    isChecked(): Promise<boolean>;
    /** Whether the radio-button is disabled. */
    isDisabled(): Promise<boolean>;
    /** Whether the radio-button is required. */
    isRequired(): Promise<boolean>;
    /** Gets the radio-button's name. */
    getName(): Promise<string | null>;
    /** Gets the radio-button's id. */
    getId(): Promise<string | null>;
    /**
     * Gets the value of the radio-button. The radio-button value will be converted to a string.
     *
     * Note: This means that for radio-button's with an object as a value `[object Object]` is
     * intentionally returned.
     */
    getValue(): Promise<string | null>;
    /** Gets the radio-button's label text. */
    getLabelText(): Promise<string>;
    /** Focuses the radio-button. */
    focus(): Promise<void>;
    /** Blurs the radio-button. */
    blur(): Promise<void>;
    /** Whether the radio-button is focused. */
    isFocused(): Promise<boolean>;
    /**
     * Puts the radio-button in a checked state by clicking it if it is currently unchecked,
     * or doing nothing if it is already checked.
     */
    check(): Promise<void>;
}

export { MatRadioButtonHarness, MatRadioGroupHarness };
export type { RadioButtonHarnessFilters, RadioGroupHarnessFilters };
