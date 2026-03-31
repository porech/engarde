import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/** Harness for interacting with a `mat-divider`. */
class MatDividerHarness extends ComponentHarness {
    static hostSelector = '.mat-divider';
    static with(options = {}) {
        return new HarnessPredicate(MatDividerHarness, options);
    }
    async getOrientation() {
        return (await this.host()).getAttribute('aria-orientation');
    }
    async isInset() {
        return (await this.host()).hasClass('mat-divider-inset');
    }
}

export { MatDividerHarness };
//# sourceMappingURL=testing.mjs.map
