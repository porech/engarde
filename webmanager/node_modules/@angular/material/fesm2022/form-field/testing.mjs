export { MatFormFieldControlHarness } from './testing/control.mjs';
import { ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { MatInputHarness } from '../input-harness.mjs';
import { MatSelectHarness } from '../select/testing.mjs';
import { MatDatepickerInputHarness, MatDateRangeInputHarness } from '../date-range-input-harness.mjs';
import '@angular/material/form-field/testing/control';
import '@angular/cdk/coercion';
import '@angular/material/core/testing';

/** Harness for interacting with a `mat-error` in tests. */
class MatErrorHarness extends ComponentHarness {
    static hostSelector = '.mat-mdc-form-field-error';
    /**
     * Gets a `HarnessPredicate` that can be used to search for an error with specific
     * attributes.
     * @param options Options for filtering which error instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return MatErrorHarness._getErrorPredicate(this, options);
    }
    static _getErrorPredicate(type, options) {
        return new HarnessPredicate(type, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
    }
    /** Gets a promise for the error's label text. */
    async getText() {
        return (await this.host()).text();
    }
}

class MatFormFieldHarness extends ComponentHarness {
    _prefixContainer = this.locatorForOptional('.mat-mdc-form-field-text-prefix');
    _suffixContainer = this.locatorForOptional('.mat-mdc-form-field-text-suffix');
    _label = this.locatorForOptional('.mdc-floating-label');
    _hints = this.locatorForAll('.mat-mdc-form-field-hint');
    _inputControl = this.locatorForOptional(MatInputHarness);
    _selectControl = this.locatorForOptional(MatSelectHarness);
    _datepickerInputControl = this.locatorForOptional(MatDatepickerInputHarness);
    _dateRangeInputControl = this.locatorForOptional(MatDateRangeInputHarness);
    _textField = this.locatorFor('.mat-mdc-text-field-wrapper');
    _errorHarness = MatErrorHarness;
    static hostSelector = '.mat-mdc-form-field';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a form field with specific
     * attributes.
     * @param options Options for filtering which form field instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options)
            .addOption('floatingLabelText', options.floatingLabelText, async (harness, text) => HarnessPredicate.stringMatches(await harness.getLabel(), text))
            .addOption('hasErrors', options.hasErrors, async (harness, hasErrors) => (await harness.hasErrors()) === hasErrors)
            .addOption('isValid', options.isValid, async (harness, isValid) => (await harness.isControlValid()) === isValid);
    }
    /** Gets the appearance of the form-field. */
    async getAppearance() {
        const textFieldEl = await this._textField();
        if (await textFieldEl.hasClass('mdc-text-field--outlined')) {
            return 'outline';
        }
        return 'fill';
    }
    /** Whether the form-field has a label. */
    async hasLabel() {
        return (await this._label()) !== null;
    }
    /** Whether the label is currently floating. */
    async isLabelFloating() {
        const labelEl = await this._label();
        return labelEl !== null ? await labelEl.hasClass('mdc-floating-label--float-above') : false;
    }
    /** Gets the label of the form-field. */
    async getLabel() {
        const labelEl = await this._label();
        return labelEl ? labelEl.text() : null;
    }
    /** Whether the form-field has errors. */
    async hasErrors() {
        return (await this.getTextErrors()).length > 0;
    }
    /** Whether the form-field is disabled. */
    async isDisabled() {
        return (await this.host()).hasClass('mat-form-field-disabled');
    }
    /** Whether the form-field is currently autofilled. */
    async isAutofilled() {
        return (await this.host()).hasClass('mat-form-field-autofilled');
    }
    // Implementation of the "getControl" method overload signatures.
    async getControl(type) {
        if (type) {
            return this.locatorForOptional(type)();
        }
        const [select, input, datepickerInput, dateRangeInput] = await parallel(() => [
            this._selectControl(),
            this._inputControl(),
            this._datepickerInputControl(),
            this._dateRangeInputControl(),
        ]);
        // Match the datepicker inputs first since they can also have a `MatInput`.
        return datepickerInput || dateRangeInput || select || input;
    }
    /** Gets the theme color of the form-field. */
    async getThemeColor() {
        const hostEl = await this.host();
        const [isAccent, isWarn] = await parallel(() => {
            return [hostEl.hasClass('mat-accent'), hostEl.hasClass('mat-warn')];
        });
        if (isAccent) {
            return 'accent';
        }
        else if (isWarn) {
            return 'warn';
        }
        return 'primary';
    }
    /** Gets error messages which are currently displayed in the form-field. */
    async getTextErrors() {
        const errors = await this.getErrors();
        return parallel(() => errors.map(e => e.getText()));
    }
    /** Gets all of the error harnesses in the form field. */
    async getErrors(filter = {}) {
        return this.locatorForAll(this._errorHarness.with(filter))();
    }
    /** Gets hint messages which are currently displayed in the form-field. */
    async getTextHints() {
        const hints = await this._hints();
        return parallel(() => hints.map(e => e.text()));
    }
    /** Gets the text inside the prefix element. */
    async getPrefixText() {
        const prefix = await this._prefixContainer();
        return prefix ? prefix.text() : '';
    }
    /** Gets the text inside the suffix element. */
    async getSuffixText() {
        const suffix = await this._suffixContainer();
        return suffix ? suffix.text() : '';
    }
    /**
     * Whether the form control has been touched. Returns "null"
     * if no form control is set up.
     */
    async isControlTouched() {
        if (!(await this._hasFormControl())) {
            return null;
        }
        return (await this.host()).hasClass('ng-touched');
    }
    /**
     * Whether the form control is dirty. Returns "null"
     * if no form control is set up.
     */
    async isControlDirty() {
        if (!(await this._hasFormControl())) {
            return null;
        }
        return (await this.host()).hasClass('ng-dirty');
    }
    /**
     * Whether the form control is valid. Returns "null"
     * if no form control is set up.
     */
    async isControlValid() {
        if (!(await this._hasFormControl())) {
            return null;
        }
        return (await this.host()).hasClass('ng-valid');
    }
    /**
     * Whether the form control is pending validation. Returns "null"
     * if no form control is set up.
     */
    async isControlPending() {
        if (!(await this._hasFormControl())) {
            return null;
        }
        return (await this.host()).hasClass('ng-pending');
    }
    /** Checks whether the form-field control has set up a form control. */
    async _hasFormControl() {
        const hostEl = await this.host();
        // If no form "NgControl" is bound to the form-field control, the form-field
        // is not able to forward any control status classes. Therefore if either the
        // "ng-touched" or "ng-untouched" class is set, we know that it has a form control
        const [isTouched, isUntouched] = await parallel(() => [
            hostEl.hasClass('ng-touched'),
            hostEl.hasClass('ng-untouched'),
        ]);
        return isTouched || isUntouched;
    }
}

export { MatErrorHarness, MatFormFieldHarness };
//# sourceMappingURL=testing.mjs.map
