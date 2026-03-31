import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

/** Harness for interacting with a mat-slide-toggle in tests. */
class MatSlideToggleHarness extends ComponentHarness {
    _label = this.locatorFor('label');
    _nativeElement = this.locatorFor('button');
    static hostSelector = '.mat-mdc-slide-toggle';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a slide-toggle w/ specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a slide-toggle whose host element matches the given selector.
     *   - `label` finds a slide-toggle with specific label text.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return (new HarnessPredicate(this, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabelText(), label))
            // We want to provide a filter option for "name" because the name of the slide-toggle is
            // only set on the underlying input. This means that it's not possible for developers
            // to retrieve the harness of a specific checkbox with name through a CSS selector.
            .addOption('name', options.name, async (harness, name) => (await harness.getName()) === name)
            .addOption('checked', options.checked, async (harness, checked) => (await harness.isChecked()) == checked)
            .addOption('disabled', options.disabled, async (harness, disabled) => (await harness.isDisabled()) == disabled));
    }
    /** Toggle the checked state of the slide-toggle. */
    async toggle() {
        return (await this._nativeElement()).click();
    }
    /** Whether the slide-toggle is checked. */
    async isChecked() {
        const checked = (await this._nativeElement()).getAttribute('aria-checked');
        return coerceBooleanProperty(await checked);
    }
    /** Whether the slide-toggle is disabled. */
    async isDisabled() {
        const nativeElement = await this._nativeElement();
        const disabled = await nativeElement.getAttribute('disabled');
        if (disabled !== null) {
            return coerceBooleanProperty(disabled);
        }
        return (await nativeElement.getAttribute('aria-disabled')) === 'true';
    }
    /** Whether the slide-toggle is required. */
    async isRequired() {
        const ariaRequired = await (await this._nativeElement()).getAttribute('aria-required');
        return ariaRequired === 'true';
    }
    /** Whether the slide-toggle is valid. */
    async isValid() {
        const invalid = (await this.host()).hasClass('ng-invalid');
        return !(await invalid);
    }
    /** Gets the slide-toggle's name. */
    async getName() {
        return (await this._nativeElement()).getAttribute('name');
    }
    /** Gets the slide-toggle's aria-label. */
    async getAriaLabel() {
        return (await this._nativeElement()).getAttribute('aria-label');
    }
    /** Gets the slide-toggle's aria-labelledby. */
    async getAriaLabelledby() {
        return (await this._nativeElement()).getAttribute('aria-labelledby');
    }
    /** Gets the slide-toggle's label text. */
    async getLabelText() {
        return (await this._label()).text();
    }
    /** Focuses the slide-toggle. */
    async focus() {
        return (await this._nativeElement()).focus();
    }
    /** Blurs the slide-toggle. */
    async blur() {
        return (await this._nativeElement()).blur();
    }
    /** Whether the slide-toggle is focused. */
    async isFocused() {
        return (await this._nativeElement()).isFocused();
    }
    /**
     * Puts the slide-toggle in a checked state by toggling it if it is currently unchecked, or doing
     * nothing if it is already checked.
     */
    async check() {
        if (!(await this.isChecked())) {
            await this.toggle();
        }
    }
    /**
     * Puts the slide-toggle in an unchecked state by toggling it if it is currently checked, or doing
     * nothing if it is already unchecked.
     */
    async uncheck() {
        if (await this.isChecked()) {
            await this.toggle();
        }
    }
}

export { MatSlideToggleHarness };
//# sourceMappingURL=testing.mjs.map
