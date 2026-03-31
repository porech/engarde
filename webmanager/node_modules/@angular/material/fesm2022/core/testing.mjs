import { MatOptionHarness } from '../option-harness.mjs';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/** Harness for interacting with a `mat-optgroup` in tests. */
class MatOptgroupHarness extends ComponentHarness {
    /** Selector used to locate option group instances. */
    static hostSelector = '.mat-mdc-optgroup';
    _label = this.locatorFor('.mat-mdc-optgroup-label');
    /**
     * Gets a `HarnessPredicate` that can be used to search for a option group with specific
     * attributes.
     * @param options Options for filtering which option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options).addOption('labelText', options.labelText, async (harness, title) => HarnessPredicate.stringMatches(await harness.getLabelText(), title));
    }
    /** Gets the option group's label text. */
    async getLabelText() {
        return (await this._label()).text();
    }
    /** Gets whether the option group is disabled. */
    async isDisabled() {
        return (await (await this.host()).getAttribute('aria-disabled')) === 'true';
    }
    /**
     * Gets the options that are inside the group.
     * @param filter Optionally filters which options are included.
     */
    async getOptions(filter = {}) {
        return this.locatorForAll(MatOptionHarness.with(filter))();
    }
}

export { MatOptgroupHarness, MatOptionHarness };
//# sourceMappingURL=testing.mjs.map
