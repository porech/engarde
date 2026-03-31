import { BaseHarnessFilters, ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

interface BottomSheetHarnessFilters extends BaseHarnessFilters {
}

/** Harness for interacting with a standard MatBottomSheet in tests. */
declare class MatBottomSheetHarness extends ContentContainerComponentHarness<string> {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a bottom sheet with
     * specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: BottomSheetHarnessFilters): HarnessPredicate<MatBottomSheetHarness>;
    /** Gets the value of the bottom sheet's "aria-label" attribute. */
    getAriaLabel(): Promise<string | null>;
    /**
     * Dismisses the bottom sheet by pressing escape. Note that this method cannot
     * be used if "disableClose" has been set to true via the config.
     */
    dismiss(): Promise<void>;
}

export { MatBottomSheetHarness };
export type { BottomSheetHarnessFilters };
