import { booleanAttribute } from '@angular/core';
import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/** Harness for interacting with a mat-button in tests. */
class MatButtonHarness extends ContentContainerComponentHarness {
    // Note: `.mat-mdc-button-base` should be enough for all buttons, however some apps are using
    // the harness without actually having an applied button. Keep the attributes for backwards
    // compatibility.
    /** Selector for the harness. */
    static hostSelector = `.mat-mdc-button-base, [matButton], [mat-button], [matIconButton],
    [matFab], [matMiniFab], [mat-raised-button], [mat-flat-button], [mat-icon-button],
    [mat-stroked-button], [mat-fab], [mat-mini-fab]`;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a button with specific attributes.
     * @param options Options for narrowing the search:
     *   - `selector` finds a button whose host element matches the given selector.
     *   - `text` finds a button with specific text content.
     *   - `variant` finds buttons matching a specific variant.
     *   - `appearance` finds buttons matching a specific appearance.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('variant', options.variant, (harness, variant) => HarnessPredicate.stringMatches(harness.getVariant(), variant))
            .addOption('appearance', options.appearance, (harness, appearance) => HarnessPredicate.stringMatches(harness.getAppearance(), appearance))
            .addOption('disabled', options.disabled, async (harness, disabled) => {
            return (await harness.isDisabled()) === disabled;
        })
            .addOption('buttonType', options.buttonType, (harness, buttonType) => HarnessPredicate.stringMatches(harness.getType(), buttonType));
    }
    async click(...args) {
        return (await this.host()).click(...args);
    }
    /** Gets a boolean promise indicating if the button is disabled. */
    async isDisabled() {
        const host = await this.host();
        return (booleanAttribute(await host.getAttribute('disabled')) ||
            (await host.hasClass('mat-mdc-button-disabled')));
    }
    /** Gets a promise for the button's label text. */
    async getText() {
        return (await this.host()).text();
    }
    /** Focuses the button and returns a void promise that indicates when the action is complete. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the button and returns a void promise that indicates when the action is complete. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the button is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Gets the variant of the button. */
    async getVariant() {
        const host = await this.host();
        // TODO(crisbeto): we're checking both classes and attributes for backwards compatibility
        // with some internal apps that were applying the attribute without importing the directive.
        // Really we should be only targeting the classes.
        if ((await host.hasClass('mat-mdc-icon-button')) ||
            (await host.getAttribute('mat-icon-button')) != null) {
            return 'icon';
        }
        if ((await host.hasClass('mat-mdc-mini-fab')) ||
            (await host.getAttribute('mat-mini-fab')) != null) {
            return 'mini-fab';
        }
        if ((await host.hasClass('mat-mdc-fab')) || (await host.getAttribute('mat-fab')) != null) {
            return 'fab';
        }
        return 'basic';
    }
    /** Gets the appearance of the button. */
    async getAppearance() {
        const host = await this.host();
        if (await host.hasClass('mat-mdc-outlined-button')) {
            return 'outlined';
        }
        if (await host.hasClass('mat-mdc-raised-button')) {
            return 'elevated';
        }
        if (await host.hasClass('mat-mdc-unelevated-button')) {
            return 'filled';
        }
        if (await host.hasClass('mat-mdc-button')) {
            return 'text';
        }
        if (await host.hasClass('mat-tonal-button')) {
            return 'tonal';
        }
        return null;
    }
    /**
     * Gets the type of the button. Supported values are 'button', 'submit', and 'reset'.
     */
    async getType() {
        const host = await this.host();
        const buttonType = await host.getAttribute('type');
        if (buttonType === 'button' || buttonType === 'submit' || buttonType === 'reset') {
            return buttonType;
        }
        return null;
    }
}

export { MatButtonHarness };
//# sourceMappingURL=testing.mjs.map
