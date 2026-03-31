import { ContentContainerComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';

/** Harness for interacting with a standard MatBottomSheet in tests. */
class MatBottomSheetHarness extends ContentContainerComponentHarness {
    // Developers can provide a custom component or template for the
    // bottom sheet. The canonical parent is the ".mat-bottom-sheet-container".
    static hostSelector = '.mat-bottom-sheet-container:not([mat-exit])';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a bottom sheet with
     * specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatBottomSheetHarness, options);
    }
    /** Gets the value of the bottom sheet's "aria-label" attribute. */
    async getAriaLabel() {
        return (await this.host()).getAttribute('aria-label');
    }
    /**
     * Dismisses the bottom sheet by pressing escape. Note that this method cannot
     * be used if "disableClose" has been set to true via the config.
     */
    async dismiss() {
        await (await this.host()).sendKeys(TestKey.ESCAPE);
    }
}

export { MatBottomSheetHarness };
//# sourceMappingURL=testing.mjs.map
