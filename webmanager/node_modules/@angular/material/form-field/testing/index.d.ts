import { MatFormFieldControlHarness } from '../../form-field-control-harness.d.js';
import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';
import { MatInputHarness } from '../../input-harness.d.js';
import { MatSelectHarness } from '../../select/testing/index.js';
import { MatDatepickerInputHarness, MatDateRangeInputHarness } from '../../date-range-input-harness.d.js';
import '@angular/material/form-field/testing/control';
import '@angular/material/core/testing';

/** A set of criteria that can be used to filter a list of `MatFormFieldHarness` instances. */
interface FormFieldHarnessFilters extends BaseHarnessFilters {
    /** Filters based on the text of the form field's floating label. */
    floatingLabelText?: string | RegExp;
    /** Filters based on whether the form field has error messages. */
    hasErrors?: boolean;
    /** Filters based on whether the form field value is valid. */
    isValid?: boolean;
}

/** A set of criteria that can be used to filter a list of error harness instances. */
interface ErrorHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose text matches the given value. */
    text?: string | RegExp;
}
/** Harness for interacting with a `mat-error` in tests. */
declare class MatErrorHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for an error with specific
     * attributes.
     * @param options Options for filtering which error instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatErrorHarness>(this: ComponentHarnessConstructor<T>, options?: ErrorHarnessFilters): HarnessPredicate<T>;
    protected static _getErrorPredicate<T extends MatErrorHarness>(type: ComponentHarnessConstructor<T>, options: ErrorHarnessFilters): HarnessPredicate<T>;
    /** Gets a promise for the error's label text. */
    getText(): Promise<string>;
}

/** Possible harnesses of controls which can be bound to a form-field. */
type FormFieldControlHarness = MatInputHarness | MatSelectHarness | MatDatepickerInputHarness | MatDateRangeInputHarness;
declare class MatFormFieldHarness extends ComponentHarness {
    private _prefixContainer;
    private _suffixContainer;
    private _label;
    private _hints;
    private _inputControl;
    private _selectControl;
    private _datepickerInputControl;
    private _dateRangeInputControl;
    private _textField;
    private _errorHarness;
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a form field with specific
     * attributes.
     * @param options Options for filtering which form field instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatFormFieldHarness>(this: ComponentHarnessConstructor<T>, options?: FormFieldHarnessFilters): HarnessPredicate<T>;
    /** Gets the appearance of the form-field. */
    getAppearance(): Promise<'fill' | 'outline'>;
    /** Whether the form-field has a label. */
    hasLabel(): Promise<boolean>;
    /** Whether the label is currently floating. */
    isLabelFloating(): Promise<boolean>;
    /** Gets the label of the form-field. */
    getLabel(): Promise<string | null>;
    /** Whether the form-field has errors. */
    hasErrors(): Promise<boolean>;
    /** Whether the form-field is disabled. */
    isDisabled(): Promise<boolean>;
    /** Whether the form-field is currently autofilled. */
    isAutofilled(): Promise<boolean>;
    /**
     * Gets the harness of the control that is bound to the form-field. Only
     * default controls such as "MatInputHarness" and "MatSelectHarness" are
     * supported.
     */
    getControl(): Promise<FormFieldControlHarness | null>;
    /**
     * Gets the harness of the control that is bound to the form-field. Searches
     * for a control that matches the specified harness type.
     */
    getControl<X extends MatFormFieldControlHarness>(type: ComponentHarnessConstructor<X>): Promise<X | null>;
    /**
     * Gets the harness of the control that is bound to the form-field. Searches
     * for a control that matches the specified harness predicate.
     */
    getControl<X extends MatFormFieldControlHarness>(type: HarnessPredicate<X>): Promise<X | null>;
    /** Gets the theme color of the form-field. */
    getThemeColor(): Promise<'primary' | 'accent' | 'warn'>;
    /** Gets error messages which are currently displayed in the form-field. */
    getTextErrors(): Promise<string[]>;
    /** Gets all of the error harnesses in the form field. */
    getErrors(filter?: ErrorHarnessFilters): Promise<MatErrorHarness[]>;
    /** Gets hint messages which are currently displayed in the form-field. */
    getTextHints(): Promise<string[]>;
    /** Gets the text inside the prefix element. */
    getPrefixText(): Promise<string>;
    /** Gets the text inside the suffix element. */
    getSuffixText(): Promise<string>;
    /**
     * Whether the form control has been touched. Returns "null"
     * if no form control is set up.
     */
    isControlTouched(): Promise<boolean | null>;
    /**
     * Whether the form control is dirty. Returns "null"
     * if no form control is set up.
     */
    isControlDirty(): Promise<boolean | null>;
    /**
     * Whether the form control is valid. Returns "null"
     * if no form control is set up.
     */
    isControlValid(): Promise<boolean | null>;
    /**
     * Whether the form control is pending validation. Returns "null"
     * if no form control is set up.
     */
    isControlPending(): Promise<boolean | null>;
    /** Checks whether the form-field control has set up a form control. */
    private _hasFormControl;
}

export { MatErrorHarness, MatFormFieldControlHarness, MatFormFieldHarness };
export type { ErrorHarnessFilters, FormFieldControlHarness, FormFieldHarnessFilters };
