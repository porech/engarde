import { BaseHarnessFilters, HarnessPredicate, ContentContainerComponentHarness } from '@angular/cdk/testing';

/** A set of criteria that can be used to filter a list of `MatDrawerHarness` instances. */
interface DrawerHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose side is the given value. */
    position?: 'start' | 'end';
}
/** A set of criteria that can be used to filter a list of `MatDrawerContainerHarness` instances. */
interface DrawerContainerHarnessFilters extends BaseHarnessFilters {
}
/** A set of criteria that can be used to filter a list of `MatDrawerContentHarness` instances. */
interface DrawerContentHarnessFilters extends BaseHarnessFilters {
}

/**
 * Base class for the drawer harness functionality.
 * @docs-private
 */
declare class MatDrawerHarnessBase extends ContentContainerComponentHarness<string> {
    /** Whether the drawer is open. */
    isOpen(): Promise<boolean>;
    /** Gets the position of the drawer inside its container. */
    getPosition(): Promise<'start' | 'end'>;
    /** Gets the mode that the drawer is in. */
    getMode(): Promise<'over' | 'push' | 'side'>;
}
/** Harness for interacting with a standard mat-drawer in tests. */
declare class MatDrawerHarness extends MatDrawerHarnessBase {
    /** The selector for the host element of a `MatDrawer` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDrawerHarness` that meets
     * certain criteria.
     * @param options Options for filtering which drawer instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DrawerHarnessFilters): HarnessPredicate<MatDrawerHarness>;
}

/** Harness for interacting with a standard mat-drawer-content in tests. */
declare class MatDrawerContentHarness extends ContentContainerComponentHarness<string> {
    /** The selector for the host element of a `MatDrawerContent` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDrawerContentHarness` that
     * meets certain criteria.
     * @param options Options for filtering which drawer content instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DrawerContentHarnessFilters): HarnessPredicate<MatDrawerContentHarness>;
}

/** Harness for interacting with a standard mat-drawer-container in tests. */
declare class MatDrawerContainerHarness extends ContentContainerComponentHarness<string> {
    /** The selector for the host element of a `MatDrawerContainer` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDrawerContainerHarness` that
     * meets certain criteria.
     * @param options Options for filtering which container instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DrawerContainerHarnessFilters): HarnessPredicate<MatDrawerContainerHarness>;
    /**
     * Gets drawers that match particular criteria within the container.
     * @param filter Optionally filters which chips are included.
     */
    getDrawers(filter?: DrawerHarnessFilters): Promise<MatDrawerHarness[]>;
    /** Gets the element that has the container's content. */
    getContent(): Promise<MatDrawerContentHarness>;
}

/** Harness for interacting with a standard mat-sidenav-content in tests. */
declare class MatSidenavContentHarness extends ContentContainerComponentHarness<string> {
    /** The selector for the host element of a `MatSidenavContent` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSidenavContentHarness` that
     * meets certain criteria.
     * @param options Options for filtering which sidenav content instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DrawerContentHarnessFilters): HarnessPredicate<MatSidenavContentHarness>;
}

/** Harness for interacting with a standard mat-sidenav in tests. */
declare class MatSidenavHarness extends MatDrawerHarnessBase {
    /** The selector for the host element of a `MatSidenav` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSidenavHarness` that meets
     * certain criteria.
     * @param options Options for filtering which sidenav instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DrawerHarnessFilters): HarnessPredicate<MatSidenavHarness>;
    /** Whether the sidenav is fixed in the viewport. */
    isFixedInViewport(): Promise<boolean>;
}

/** Harness for interacting with a standard mat-sidenav-container in tests. */
declare class MatSidenavContainerHarness extends ContentContainerComponentHarness<string> {
    /** The selector for the host element of a `MatSidenavContainer` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSidenavContainerHarness` that
     * meets certain criteria.
     * @param options Options for filtering which container instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DrawerContainerHarnessFilters): HarnessPredicate<MatSidenavContainerHarness>;
    /**
     * Gets sidenavs that match particular criteria within the container.
     * @param filter Optionally filters which chips are included.
     */
    getSidenavs(filter?: DrawerHarnessFilters): Promise<MatSidenavHarness[]>;
    /** Gets the element that has the container's content. */
    getContent(): Promise<MatSidenavContentHarness>;
}

export { MatDrawerContainerHarness, MatDrawerContentHarness, MatDrawerHarness, MatSidenavContainerHarness, MatSidenavContentHarness, MatSidenavHarness };
export type { DrawerContainerHarnessFilters, DrawerContentHarnessFilters, DrawerHarnessFilters };
