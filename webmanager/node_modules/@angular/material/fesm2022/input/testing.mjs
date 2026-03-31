export { MatInputHarness } from '../input-harness.mjs';
import { ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { MatFormFieldControlHarnessBase } from '../form-field/testing/control.mjs';
import '@angular/material/form-field/testing/control';
import '@angular/cdk/coercion';

/** Harness for interacting with a native `option` in tests. */
class MatNativeOptionHarness extends ComponentHarness {
    /** Selector used to locate option instances. */
    static hostSelector = 'select[matNativeControl] option';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatNativeOptionHarness` that meets
     * certain criteria.
     * @param options Options for filtering which option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatNativeOptionHarness, options)
            .addOption('text', options.text, async (harness, title) => HarnessPredicate.stringMatches(await harness.getText(), title))
            .addOption('index', options.index, async (harness, index) => (await harness.getIndex()) === index)
            .addOption('isSelected', options.isSelected, async (harness, isSelected) => (await harness.isSelected()) === isSelected);
    }
    /** Gets the option's label text. */
    async getText() {
        return (await this.host()).getProperty('label');
    }
    /** Index of the option within the native `select` element. */
    async getIndex() {
        return (await this.host()).getProperty('index');
    }
    /** Gets whether the option is disabled. */
    async isDisabled() {
        return (await this.host()).getProperty('disabled');
    }
    /** Gets whether the option is selected. */
    async isSelected() {
        return (await this.host()).getProperty('selected');
    }
}

/** Harness for interacting with a native `select` in tests. */
class MatNativeSelectHarness extends MatFormFieldControlHarnessBase {
    static hostSelector = 'select[matNativeControl]';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatNativeSelectHarness` that meets
     * certain criteria.
     * @param options Options for filtering which select instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatNativeSelectHarness, options).addOption('label', options.label, (harness, label) => {
            return HarnessPredicate.stringMatches(harness.getLabel(), label);
        });
    }
    /** Gets a boolean promise indicating if the select is disabled. */
    async isDisabled() {
        return (await this.host()).getProperty('disabled');
    }
    /** Gets a boolean promise indicating if the select is required. */
    async isRequired() {
        return (await this.host()).getProperty('required');
    }
    /** Gets a boolean promise indicating if the select is in multi-selection mode. */
    async isMultiple() {
        return (await this.host()).getProperty('multiple');
    }
    /** Gets the name of the select. */
    async getName() {
        // The "name" property of the native select is never undefined.
        return await (await this.host()).getProperty('name');
    }
    /** Gets the id of the select. */
    async getId() {
        // We're guaranteed to have an id, because the `matNativeControl` always assigns one.
        return await (await this.host()).getProperty('id');
    }
    /** Focuses the select and returns a void promise that indicates when the action is complete. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the select and returns a void promise that indicates when the action is complete. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the select is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Gets the options inside the select panel. */
    async getOptions(filter = {}) {
        return this.locatorForAll(MatNativeOptionHarness.with(filter))();
    }
    /**
     * Selects the options that match the passed-in filter. If the select is in multi-selection
     * mode all options will be clicked, otherwise the harness will pick the first matching option.
     */
    async selectOptions(filter = {}) {
        const [isMultiple, options] = await parallel(() => {
            return [this.isMultiple(), this.getOptions(filter)];
        });
        if (options.length === 0) {
            throw Error('Select does not have options matching the specified filter');
        }
        const [host, optionIndexes] = await parallel(() => [
            this.host(),
            parallel(() => options.slice(0, isMultiple ? undefined : 1).map(option => option.getIndex())),
        ]);
        await host.selectOptions(...optionIndexes);
    }
}

export { MatNativeOptionHarness, MatNativeSelectHarness };
//# sourceMappingURL=testing.mjs.map
