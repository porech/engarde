import { BaseHarnessFilters, ContentContainerComponentHarness, ComponentHarnessConstructor, HarnessPredicate, HarnessLoader } from '@angular/cdk/testing';

/** A set of criteria that can be used to filter a list of `MatMenuHarness` instances. */
interface MenuHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose trigger text matches the given value. */
    triggerText?: string | RegExp;
}
/** A set of criteria that can be used to filter a list of `MatMenuItemHarness` instances. */
interface MenuItemHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose text matches the given value. */
    text?: string | RegExp;
    /** Only find instances that have a sub-menu. */
    hasSubmenu?: boolean;
}
/** A set of criteria that can be used to filter a list of `MatContextMenuHarness` instances. */
interface ContextMenuHarnessFilters extends BaseHarnessFilters {
}

/** Harness for interacting with a mat-menu in tests. */
declare class MatMenuHarness extends ContentContainerComponentHarness<string> {
    private _documentRootLocator;
    /** The selector for the host element of a `MatMenu` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a menu with specific attributes.
     * @param options Options for filtering which menu instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatMenuHarness>(this: ComponentHarnessConstructor<T>, options?: MenuHarnessFilters): HarnessPredicate<T>;
    /** Whether the menu is disabled. */
    isDisabled(): Promise<boolean>;
    /** Whether the menu is open. */
    isOpen(): Promise<boolean>;
    /** Gets the text of the menu's trigger element. */
    getTriggerText(): Promise<string>;
    /** Focuses the menu. */
    focus(): Promise<void>;
    /** Blurs the menu. */
    blur(): Promise<void>;
    /** Whether the menu is focused. */
    isFocused(): Promise<boolean>;
    /** Opens the menu. */
    open(): Promise<void>;
    /** Closes the menu. */
    close(): Promise<void>;
    /**
     * Gets a list of `MatMenuItemHarness` representing the items in the menu.
     * @param filters Optionally filters which menu items are included.
     */
    getItems(filters?: Omit<MenuItemHarnessFilters, 'ancestor'>): Promise<MatMenuItemHarness[]>;
    /**
     * Clicks an item in the menu, and optionally continues clicking items in subsequent sub-menus.
     * @param itemFilter A filter used to represent which item in the menu should be clicked. The
     *     first matching menu item will be clicked.
     * @param subItemFilters A list of filters representing the items to click in any subsequent
     *     sub-menus. The first item in the sub-menu matching the corresponding filter in
     *     `subItemFilters` will be clicked.
     */
    clickItem(itemFilter: Omit<MenuItemHarnessFilters, 'ancestor'>, ...subItemFilters: Omit<MenuItemHarnessFilters, 'ancestor'>[]): Promise<void>;
    protected getRootHarnessLoader(): Promise<HarnessLoader>;
    /** Gets the menu panel associated with this menu. */
    private _getMenuPanel;
    /** Gets the id of the menu panel associated with this menu. */
    private _getPanelId;
}
declare class MatMenuItemHarness extends ContentContainerComponentHarness<string> {
    /** The selector for the host element of a `MatMenuItem` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a menu item with specific attributes.
     * @param options Options for filtering which menu item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatMenuItemHarness>(this: ComponentHarnessConstructor<T>, options?: MenuItemHarnessFilters): HarnessPredicate<T>;
    /** Whether the menu is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets the text of the menu item. */
    getText(): Promise<string>;
    /** Focuses the menu item. */
    focus(): Promise<void>;
    /** Blurs the menu item. */
    blur(): Promise<void>;
    /** Whether the menu item is focused. */
    isFocused(): Promise<boolean>;
    /** Clicks the menu item. */
    click(): Promise<void>;
    /** Whether this item has a submenu. */
    hasSubmenu(): Promise<boolean>;
    /** Gets the submenu associated with this menu item, or null if none. */
    getSubmenu(): Promise<MatMenuHarness | null>;
}

/** Harness for interacting with context menus in tests. */
declare class MatContextMenuHarness extends ContentContainerComponentHarness<string> {
    private _documentRootLocator;
    /** The selector for the host element of a `MatContextMenu` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a context menu with specific
     * attributes.
     * @param options Options for filtering which menu instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatContextMenuHarness>(this: ComponentHarnessConstructor<T>, options?: ContextMenuHarnessFilters): HarnessPredicate<T>;
    /** Whether the menu is open. */
    isOpen(): Promise<boolean>;
    /**
     * Opens the menu.
     * @param relativeX X coordinate, relative to the element, to dispatch the opening click at.
     * @param relativeY Y coordinate, relative to the element, to dispatch the opening click at.
     */
    open(relativeX?: number, relativeY?: number): Promise<void>;
    /** Closes the menu. */
    close(): Promise<void>;
    /** Gets whether the context menu trigger is disabled. */
    isDisabled(): Promise<boolean>;
    /**
     * Gets a list of `MatMenuItemHarness` representing the items in the menu.
     * @param filters Optionally filters which menu items are included.
     */
    getItems(filters?: Omit<MenuItemHarnessFilters, 'ancestor'>): Promise<MatMenuItemHarness[]>;
    /**
     * Clicks an item in the menu, and optionally continues clicking items in subsequent sub-menus.
     * @param itemFilter A filter used to represent which item in the menu should be clicked. The
     *     first matching menu item will be clicked.
     * @param subItemFilters A list of filters representing the items to click in any subsequent
     *     sub-menus. The first item in the sub-menu matching the corresponding filter in
     *     `subItemFilters` will be clicked.
     */
    clickItem(itemFilter: Omit<MenuItemHarnessFilters, 'ancestor'>, ...subItemFilters: Omit<MenuItemHarnessFilters, 'ancestor'>[]): Promise<void>;
    protected getRootHarnessLoader(): Promise<HarnessLoader>;
    /** Gets the menu panel associated with this menu. */
    private _getMenuPanel;
    /** Gets the id of the menu panel associated with this menu. */
    private _getPanelId;
}

export { MatContextMenuHarness, MatMenuHarness, MatMenuItemHarness };
export type { ContextMenuHarnessFilters, MenuHarnessFilters, MenuItemHarnessFilters };
