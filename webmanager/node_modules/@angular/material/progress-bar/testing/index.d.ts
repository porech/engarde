import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';

/** A set of criteria that can be used to filter a list of `MatProgressBarHarness` instances. */
interface ProgressBarHarnessFilters extends BaseHarnessFilters {
}

/** Harness for interacting with a `mat-progress-bar` in tests. */
declare class MatProgressBarHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a progress bar with specific
     * attributes.
     * @param options Options for filtering which progress bar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatProgressBarHarness>(this: ComponentHarnessConstructor<T>, options?: ProgressBarHarnessFilters): HarnessPredicate<T>;
    /** Gets a promise for the progress bar's value. */
    getValue(): Promise<number | null>;
    /** Gets a promise for the progress bar's mode. */
    getMode(): Promise<string | null>;
}

export { MatProgressBarHarness };
export type { ProgressBarHarnessFilters };
