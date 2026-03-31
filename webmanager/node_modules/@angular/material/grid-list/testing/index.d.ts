import { BaseHarnessFilters, ContentContainerComponentHarness, HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';

/** A set of criteria that can be used to filter a list of `MatGridListHarness` instances. */
interface GridListHarnessFilters extends BaseHarnessFilters {
}
/** A set of criteria that can be used to filter a list of `MatTileHarness` instances. */
interface GridTileHarnessFilters extends BaseHarnessFilters {
    /** Text the grid-tile header should match. */
    headerText?: string | RegExp;
    /** Text the grid-tile footer should match. */
    footerText?: string | RegExp;
}

/** Selectors for the various `mat-grid-tile` sections that may contain user content. */
declare enum MatGridTileSection {
    HEADER = ".mat-grid-tile-header",
    FOOTER = ".mat-grid-tile-footer"
}
/** Harness for interacting with a standard `MatGridTitle` in tests. */
declare class MatGridTileHarness extends ContentContainerComponentHarness<MatGridTileSection> {
    /** The selector for the host element of a `MatGridTile` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatGridTileHarness`
     * that meets certain criteria.
     * @param options Options for filtering which dialog instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: GridTileHarnessFilters): HarnessPredicate<MatGridTileHarness>;
    private _header;
    private _footer;
    private _avatar;
    /** Gets the amount of rows that the grid-tile takes up. */
    getRowspan(): Promise<number>;
    /** Gets the amount of columns that the grid-tile takes up. */
    getColspan(): Promise<number>;
    /** Whether the grid-tile has a header. */
    hasHeader(): Promise<boolean>;
    /** Whether the grid-tile has a footer. */
    hasFooter(): Promise<boolean>;
    /** Whether the grid-tile has an avatar. */
    hasAvatar(): Promise<boolean>;
    /** Gets the text of the header if present. */
    getHeaderText(): Promise<string | null>;
    /** Gets the text of the footer if present. */
    getFooterText(): Promise<string | null>;
}

/** Harness for interacting with a standard `MatGridList` in tests. */
declare class MatGridListHarness extends ComponentHarness {
    /** The selector for the host element of a `MatGridList` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatGridListHarness`
     * that meets certain criteria.
     * @param options Options for filtering which dialog instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: GridListHarnessFilters): HarnessPredicate<MatGridListHarness>;
    /**
     * Tile coordinator that is used by the "MatGridList" for computing
     * positions of tiles. We leverage the coordinator to provide an API
     * for retrieving tiles based on visual tile positions.
     */
    private _tileCoordinator;
    /** Gets all tiles of the grid-list. */
    getTiles(filters?: GridTileHarnessFilters): Promise<MatGridTileHarness[]>;
    /** Gets the amount of columns of the grid-list. */
    getColumns(): Promise<number>;
    /**
     * Gets a tile of the grid-list that is located at the given location.
     * @param row Zero-based row index.
     * @param column Zero-based column index.
     */
    getTileAtPosition({ row, column, }: {
        row: number;
        column: number;
    }): Promise<MatGridTileHarness>;
}

export { MatGridListHarness, MatGridTileHarness, MatGridTileSection };
export type { GridListHarnessFilters, GridTileHarnessFilters };
