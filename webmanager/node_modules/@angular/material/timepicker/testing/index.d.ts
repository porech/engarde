import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';
import { OptionHarnessFilters, MatOptionHarness } from '../../option-harness.d.js';

/** A set of criteria that can be used to filter a list of `MatTimepickerHarness` instances. */
interface TimepickerHarnessFilters extends BaseHarnessFilters {
}
/** A set of criteria that can be used to filter a list of timepicker input instances. */
interface TimepickerInputHarnessFilters extends BaseHarnessFilters {
    /** Filters based on the value of the input. */
    value?: string | RegExp;
    /** Filters based on the placeholder text of the input. */
    placeholder?: string | RegExp;
}
/** A set of criteria that can be used to filter a list of timepicker toggle instances. */
interface TimepickerToggleHarnessFilters extends BaseHarnessFilters {
}

declare class MatTimepickerHarness extends ComponentHarness {
    private _documentRootLocator;
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a timepicker with specific
     * attributes.
     * @param options Options for filtering which timepicker instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatTimepickerHarness>(this: ComponentHarnessConstructor<T>, options?: TimepickerHarnessFilters): HarnessPredicate<T>;
    /** Whether the timepicker is open. */
    isOpen(): Promise<boolean>;
    /** Gets the options inside the timepicker panel. */
    getOptions(filters?: Omit<OptionHarnessFilters, 'ancestor'>): Promise<MatOptionHarness[]>;
    /** Selects the first option matching the given filters. */
    selectOption(filters: OptionHarnessFilters): Promise<void>;
    /** Gets the selector that can be used to find the timepicker's panel. */
    protected _getPanelSelector(): Promise<string>;
}

/** Harness for interacting with a standard Material timepicker inputs in tests. */
declare class MatTimepickerInputHarness extends ComponentHarness {
    private _documentRootLocator;
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatTimepickerInputHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatTimepickerInputHarness>(this: ComponentHarnessConstructor<T>, options?: TimepickerInputHarnessFilters): HarnessPredicate<T>;
    /** Gets whether the timepicker associated with the input is open. */
    isTimepickerOpen(): Promise<boolean>;
    /** Opens the timepicker associated with the input and returns the timepicker instance. */
    openTimepicker(): Promise<MatTimepickerHarness>;
    /** Closes the timepicker associated with the input. */
    closeTimepicker(): Promise<void>;
    /**
     * Gets the `MatTimepickerHarness` that is associated with the input.
     * @param filter Optionally filters which timepicker is included.
     */
    getTimepicker(filter?: TimepickerHarnessFilters): Promise<MatTimepickerHarness>;
    /** Whether the input is disabled. */
    isDisabled(): Promise<boolean>;
    /** Whether the input is required. */
    isRequired(): Promise<boolean>;
    /** Gets the value of the input. */
    getValue(): Promise<string>;
    /**
     * Sets the value of the input. The value will be set by simulating
     * keypresses that correspond to the given value.
     */
    setValue(newValue: string): Promise<void>;
    /** Gets the placeholder of the input. */
    getPlaceholder(): Promise<string>;
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
}

/** Harness for interacting with a standard Material timepicker toggle in tests. */
declare class MatTimepickerToggleHarness extends ComponentHarness {
    static hostSelector: string;
    /** The clickable button inside the toggle. */
    private _button;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatTimepickerToggleHarness` that
     * meets certain criteria.
     * @param options Options for filtering which timepicker toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: TimepickerToggleHarnessFilters): HarnessPredicate<MatTimepickerToggleHarness>;
    /** Opens the timepicker associated with the toggle. */
    openTimepicker(): Promise<void>;
    /** Gets whether the timepicker associated with the toggle is open. */
    isTimepickerOpen(): Promise<boolean>;
    /** Whether the toggle is disabled. */
    isDisabled(): Promise<boolean>;
}

export { MatTimepickerHarness, MatTimepickerInputHarness, MatTimepickerToggleHarness };
export type { TimepickerHarnessFilters, TimepickerInputHarnessFilters, TimepickerToggleHarnessFilters };
