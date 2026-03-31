import { ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

/** Harness for interacting with a standard mat-button-toggle in tests. */
class MatButtonToggleHarness extends ComponentHarness {
    /** The selector for the host element of a `MatButton` instance. */
    static hostSelector = '.mat-button-toggle';
    _label = this.locatorFor('.mat-button-toggle-label-content');
    _button = this.locatorFor('.mat-button-toggle-button');
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatButtonToggleHarness` that meets
     * certain criteria.
     * @param options Options for filtering which button toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatButtonToggleHarness, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('name', options.name, (harness, name) => HarnessPredicate.stringMatches(harness.getName(), name))
            .addOption('checked', options.checked, async (harness, checked) => (await harness.isChecked()) === checked)
            .addOption('disabled', options.disabled, async (harness, disabled) => {
            return (await harness.isDisabled()) === disabled;
        });
    }
    /** Gets a boolean promise indicating if the button toggle is checked. */
    async isChecked() {
        const button = await this._button();
        const [checked, pressed] = await parallel(() => [
            button.getAttribute('aria-checked'),
            button.getAttribute('aria-pressed'),
        ]);
        return coerceBooleanProperty(checked) || coerceBooleanProperty(pressed);
    }
    /** Gets a boolean promise indicating if the button toggle is disabled. */
    async isDisabled() {
        const host = await this.host();
        return host.hasClass('mat-button-toggle-disabled');
    }
    /** Gets a promise for the button toggle's name. */
    async getName() {
        return (await this._button()).getAttribute('name');
    }
    /** Gets a promise for the button toggle's aria-label. */
    async getAriaLabel() {
        return (await this._button()).getAttribute('aria-label');
    }
    /** Gets a promise for the button toggles's aria-labelledby. */
    async getAriaLabelledby() {
        return (await this._button()).getAttribute('aria-labelledby');
    }
    /** Gets a promise for the button toggle's text. */
    async getText() {
        return (await this._label()).text();
    }
    /** Gets the appearance that the button toggle is using. */
    async getAppearance() {
        const host = await this.host();
        const className = 'mat-button-toggle-appearance-standard';
        return (await host.hasClass(className)) ? 'standard' : 'legacy';
    }
    /** Focuses the toggle. */
    async focus() {
        return (await this._button()).focus();
    }
    /** Blurs the toggle. */
    async blur() {
        return (await this._button()).blur();
    }
    /** Whether the toggle is focused. */
    async isFocused() {
        return (await this._button()).isFocused();
    }
    /** Toggle the checked state of the buttons toggle. */
    async toggle() {
        return (await this._button()).click();
    }
    /**
     * Puts the button toggle in a checked state by toggling it if it's
     * currently unchecked, or doing nothing if it is already checked.
     */
    async check() {
        if (!(await this.isChecked())) {
            await this.toggle();
        }
    }
    /**
     * Puts the button toggle in an unchecked state by toggling it if it's
     * currently checked, or doing nothing if it's already unchecked.
     */
    async uncheck() {
        if (await this.isChecked()) {
            await this.toggle();
        }
    }
}

/** Harness for interacting with a standard mat-button-toggle in tests. */
class MatButtonToggleGroupHarness extends ComponentHarness {
    /** The selector for the host element of a `MatButton` instance. */
    static hostSelector = '.mat-button-toggle-group';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatButtonToggleGroupHarness`
     * that meets certain criteria.
     * @param options Options for filtering which button toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatButtonToggleGroupHarness, options).addOption('disabled', options.disabled, async (harness, disabled) => {
            return (await harness.isDisabled()) === disabled;
        });
    }
    /**
     * Gets the button toggles that are inside the group.
     * @param filter Optionally filters which toggles are included.
     */
    async getToggles(filter = {}) {
        return this.locatorForAll(MatButtonToggleHarness.with(filter))();
    }
    /** Gets whether the button toggle group is disabled. */
    async isDisabled() {
        return (await (await this.host()).getAttribute('aria-disabled')) === 'true';
    }
    /** Gets whether the button toggle group is laid out vertically. */
    async isVertical() {
        return (await this.host()).hasClass('mat-button-toggle-vertical');
    }
    /** Gets the appearance that the group is using. */
    async getAppearance() {
        const host = await this.host();
        const className = 'mat-button-toggle-group-appearance-standard';
        return (await host.hasClass(className)) ? 'standard' : 'legacy';
    }
}

export { MatButtonToggleGroupHarness, MatButtonToggleHarness };
//# sourceMappingURL=testing.mjs.map
