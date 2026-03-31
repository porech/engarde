import { ComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';
import { MatOptionHarness } from '../option-harness.mjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

class MatTimepickerHarness extends ComponentHarness {
    _documentRootLocator = this.documentRootLocatorFactory();
    static hostSelector = 'mat-timepicker';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a timepicker with specific
     * attributes.
     * @param options Options for filtering which timepicker instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
    /** Whether the timepicker is open. */
    async isOpen() {
        const selector = await this._getPanelSelector();
        const panel = await this._documentRootLocator.locatorForOptional(selector)();
        return panel !== null;
    }
    /** Gets the options inside the timepicker panel. */
    async getOptions(filters) {
        if (!(await this.isOpen())) {
            throw new Error('Unable to retrieve options for timepicker. Timepicker panel is closed.');
        }
        return this._documentRootLocator.locatorForAll(MatOptionHarness.with({
            ...(filters || {}),
            ancestor: await this._getPanelSelector(),
        }))();
    }
    /** Selects the first option matching the given filters. */
    async selectOption(filters) {
        const options = await this.getOptions(filters);
        if (!options.length) {
            throw Error(`Could not find a mat-option matching ${JSON.stringify(filters)}`);
        }
        await options[0].click();
    }
    /** Gets the selector that can be used to find the timepicker's panel. */
    async _getPanelSelector() {
        return `#${await (await this.host()).getAttribute('mat-timepicker-panel-id')}`;
    }
}

/** Harness for interacting with a standard Material timepicker inputs in tests. */
class MatTimepickerInputHarness extends ComponentHarness {
    _documentRootLocator = this.documentRootLocatorFactory();
    static hostSelector = '.mat-timepicker-input';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatTimepickerInputHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options)
            .addOption('value', options.value, (harness, value) => {
            return HarnessPredicate.stringMatches(harness.getValue(), value);
        })
            .addOption('placeholder', options.placeholder, (harness, placeholder) => {
            return HarnessPredicate.stringMatches(harness.getPlaceholder(), placeholder);
        });
    }
    /** Gets whether the timepicker associated with the input is open. */
    async isTimepickerOpen() {
        const host = await this.host();
        return (await host.getAttribute('aria-expanded')) === 'true';
    }
    /** Opens the timepicker associated with the input and returns the timepicker instance. */
    async openTimepicker() {
        if (!(await this.isDisabled())) {
            const host = await this.host();
            await host.sendKeys(TestKey.DOWN_ARROW);
        }
        return this.getTimepicker();
    }
    /** Closes the timepicker associated with the input. */
    async closeTimepicker() {
        await this._documentRootLocator.rootElement.click();
        // This is necessary so that we wait for the closing animation.
        await this.forceStabilize();
    }
    /**
     * Gets the `MatTimepickerHarness` that is associated with the input.
     * @param filter Optionally filters which timepicker is included.
     */
    async getTimepicker(filter = {}) {
        const host = await this.host();
        const timepickerId = await host.getAttribute('mat-timepicker-id');
        if (!timepickerId) {
            throw Error('Element is not associated with a timepicker');
        }
        return this._documentRootLocator.locatorFor(MatTimepickerHarness.with({
            ...filter,
            selector: `[mat-timepicker-panel-id="${timepickerId}"]`,
        }))();
    }
    /** Whether the input is disabled. */
    async isDisabled() {
        return (await this.host()).getProperty('disabled');
    }
    /** Whether the input is required. */
    async isRequired() {
        return (await this.host()).getProperty('required');
    }
    /** Gets the value of the input. */
    async getValue() {
        // The "value" property of the native input is always defined.
        return await (await this.host()).getProperty('value');
    }
    /**
     * Sets the value of the input. The value will be set by simulating
     * keypresses that correspond to the given value.
     */
    async setValue(newValue) {
        const inputEl = await this.host();
        await inputEl.clear();
        // We don't want to send keys for the value if the value is an empty
        // string in order to clear the value. Sending keys with an empty string
        // still results in unnecessary focus events.
        if (newValue) {
            await inputEl.sendKeys(newValue);
        }
    }
    /** Gets the placeholder of the input. */
    async getPlaceholder() {
        return await (await this.host()).getProperty('placeholder');
    }
    /**
     * Focuses the input and returns a promise that indicates when the
     * action is complete.
     */
    async focus() {
        return (await this.host()).focus();
    }
    /**
     * Blurs the input and returns a promise that indicates when the
     * action is complete.
     */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the input is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
}

/** Harness for interacting with a standard Material timepicker toggle in tests. */
class MatTimepickerToggleHarness extends ComponentHarness {
    static hostSelector = '.mat-timepicker-toggle';
    /** The clickable button inside the toggle. */
    _button = this.locatorFor('button');
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatTimepickerToggleHarness` that
     * meets certain criteria.
     * @param options Options for filtering which timepicker toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatTimepickerToggleHarness, options);
    }
    /** Opens the timepicker associated with the toggle. */
    async openTimepicker() {
        const isOpen = await this.isTimepickerOpen();
        if (!isOpen) {
            const button = await this._button();
            await button.click();
        }
    }
    /** Gets whether the timepicker associated with the toggle is open. */
    async isTimepickerOpen() {
        const button = await this._button();
        const ariaExpanded = await button.getAttribute('aria-expanded');
        return ariaExpanded === 'true';
    }
    /** Whether the toggle is disabled. */
    async isDisabled() {
        const button = await this._button();
        return coerceBooleanProperty(await button.getAttribute('disabled'));
    }
}

export { MatTimepickerHarness, MatTimepickerInputHarness, MatTimepickerToggleHarness };
//# sourceMappingURL=testing.mjs.map
