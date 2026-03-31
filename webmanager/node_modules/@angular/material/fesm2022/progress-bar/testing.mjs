import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/** Harness for interacting with a `mat-progress-bar` in tests. */
class MatProgressBarHarness extends ComponentHarness {
    static hostSelector = '.mat-mdc-progress-bar';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a progress bar with specific
     * attributes.
     * @param options Options for filtering which progress bar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
    /** Gets a promise for the progress bar's value. */
    async getValue() {
        const host = await this.host();
        const ariaValue = await host.getAttribute('aria-valuenow');
        return ariaValue ? coerceNumberProperty(ariaValue) : null;
    }
    /** Gets a promise for the progress bar's mode. */
    async getMode() {
        return (await this.host()).getAttribute('mode');
    }
}

export { MatProgressBarHarness };
//# sourceMappingURL=testing.mjs.map
