import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { SortDirection } from '../../sort-direction.d.js';

interface SortHarnessFilters extends BaseHarnessFilters {
}
interface SortHeaderHarnessFilters extends BaseHarnessFilters {
    label?: string | RegExp;
    sortDirection?: SortDirection;
}

/** Harness for interacting with a standard Angular Material sort header in tests. */
declare class MatSortHeaderHarness extends ComponentHarness {
    static hostSelector: string;
    private _container;
    /**
     * Gets a `HarnessPredicate` that can be used to
     * search for a sort header with specific attributes.
     */
    static with(options?: SortHeaderHarnessFilters): HarnessPredicate<MatSortHeaderHarness>;
    /** Gets the label of the sort header. */
    getLabel(): Promise<string>;
    /** Gets the sorting direction of the header. */
    getSortDirection(): Promise<SortDirection>;
    /** Gets whether the sort header is currently being sorted by. */
    isActive(): Promise<boolean>;
    /** Whether the sort header is disabled. */
    isDisabled(): Promise<boolean>;
    /** Clicks the header to change its sorting direction. Only works if the header is enabled. */
    click(): Promise<void>;
}

/** Harness for interacting with a standard `mat-sort` in tests. */
declare class MatSortHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `mat-sort` with specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: SortHarnessFilters): HarnessPredicate<MatSortHarness>;
    /** Gets all of the sort headers in the `mat-sort`. */
    getSortHeaders(filter?: SortHeaderHarnessFilters): Promise<MatSortHeaderHarness[]>;
    /** Gets the selected header in the `mat-sort`. */
    getActiveHeader(): Promise<MatSortHeaderHarness | null>;
}

export { MatSortHarness, MatSortHeaderHarness };
export type { SortHarnessFilters, SortHeaderHarnessFilters };
