import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

/** Harness for interacting with a mat-menu in tests. */
class MatMenuHarness extends ContentContainerComponentHarness {
    _documentRootLocator = this.documentRootLocatorFactory();
    /** The selector for the host element of a `MatMenu` instance. */
    static hostSelector = '.mat-mdc-menu-trigger';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a menu with specific attributes.
     * @param options Options for filtering which menu instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options).addOption('triggerText', options.triggerText, (harness, text) => HarnessPredicate.stringMatches(harness.getTriggerText(), text));
    }
    /** Whether the menu is disabled. */
    async isDisabled() {
        const disabled = (await this.host()).getAttribute('disabled');
        return coerceBooleanProperty(await disabled);
    }
    /** Whether the menu is open. */
    async isOpen() {
        return !!(await this._getMenuPanel());
    }
    /** Gets the text of the menu's trigger element. */
    async getTriggerText() {
        return (await this.host()).text();
    }
    /** Focuses the menu. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the menu. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the menu is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Opens the menu. */
    async open() {
        if (!(await this.isOpen())) {
            return (await this.host()).click();
        }
    }
    /** Closes the menu. */
    async close() {
        const panel = await this._getMenuPanel();
        if (panel) {
            return panel.click();
        }
    }
    /**
     * Gets a list of `MatMenuItemHarness` representing the items in the menu.
     * @param filters Optionally filters which menu items are included.
     */
    async getItems(filters) {
        const panelId = await this._getPanelId();
        if (panelId) {
            return this._documentRootLocator.locatorForAll(MatMenuItemHarness.with({
                ...(filters || {}),
                ancestor: `#${panelId}`,
            }))();
        }
        return [];
    }
    /**
     * Clicks an item in the menu, and optionally continues clicking items in subsequent sub-menus.
     * @param itemFilter A filter used to represent which item in the menu should be clicked. The
     *     first matching menu item will be clicked.
     * @param subItemFilters A list of filters representing the items to click in any subsequent
     *     sub-menus. The first item in the sub-menu matching the corresponding filter in
     *     `subItemFilters` will be clicked.
     */
    async clickItem(itemFilter, ...subItemFilters) {
        await this.open();
        return clickItemImplementation(await this.getItems(itemFilter), itemFilter, subItemFilters);
    }
    async getRootHarnessLoader() {
        const panelId = await this._getPanelId();
        return this.documentRootLocatorFactory().harnessLoaderFor(`#${panelId}`);
    }
    /** Gets the menu panel associated with this menu. */
    async _getMenuPanel() {
        const panelId = await this._getPanelId();
        return panelId ? this._documentRootLocator.locatorForOptional(`#${panelId}`)() : null;
    }
    /** Gets the id of the menu panel associated with this menu. */
    async _getPanelId() {
        const panelId = await (await this.host()).getAttribute('aria-controls');
        return panelId || null;
    }
}
class MatMenuItemHarness extends ContentContainerComponentHarness {
    /** The selector for the host element of a `MatMenuItem` instance. */
    static hostSelector = '.mat-mdc-menu-item';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a menu item with specific attributes.
     * @param options Options for filtering which menu item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('hasSubmenu', options.hasSubmenu, async (harness, hasSubmenu) => (await harness.hasSubmenu()) === hasSubmenu);
    }
    /** Whether the menu is disabled. */
    async isDisabled() {
        const disabled = (await this.host()).getAttribute('disabled');
        return coerceBooleanProperty(await disabled);
    }
    /** Gets the text of the menu item. */
    async getText() {
        return (await this.host()).text();
    }
    /** Focuses the menu item. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the menu item. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the menu item is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Clicks the menu item. */
    async click() {
        return (await this.host()).click();
    }
    /** Whether this item has a submenu. */
    async hasSubmenu() {
        return (await this.host()).matchesSelector(MatMenuHarness.hostSelector);
    }
    /** Gets the submenu associated with this menu item, or null if none. */
    async getSubmenu() {
        if (await this.hasSubmenu()) {
            return new MatMenuHarness(this.locatorFactory);
        }
        return null;
    }
}
async function clickItemImplementation(items, itemFilter, subItemFilters) {
    if (!items.length) {
        throw Error(`Could not find item matching ${JSON.stringify(itemFilter)}`);
    }
    if (!subItemFilters.length) {
        return await items[0].click();
    }
    const menu = await items[0].getSubmenu();
    if (!menu) {
        throw Error(`Item matching ${JSON.stringify(itemFilter)} does not have a submenu`);
    }
    return menu.clickItem(...subItemFilters);
}

/** Harness for interacting with context menus in tests. */
class MatContextMenuHarness extends ContentContainerComponentHarness {
    _documentRootLocator = this.documentRootLocatorFactory();
    /** The selector for the host element of a `MatContextMenu` instance. */
    static hostSelector = '.mat-context-menu-trigger';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a context menu with specific
     * attributes.
     * @param options Options for filtering which menu instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
    /** Whether the menu is open. */
    async isOpen() {
        return !!(await this._getMenuPanel());
    }
    /**
     * Opens the menu.
     * @param relativeX X coordinate, relative to the element, to dispatch the opening click at.
     * @param relativeY Y coordinate, relative to the element, to dispatch the opening click at.
     */
    async open(relativeX = 0, relativeY = 0) {
        if (!(await this.isOpen())) {
            return (await this.host()).rightClick(relativeX, relativeY);
        }
    }
    /** Closes the menu. */
    async close() {
        const panel = await this._getMenuPanel();
        if (panel) {
            return panel.click();
        }
    }
    /** Gets whether the context menu trigger is disabled. */
    async isDisabled() {
        const host = await this.host();
        return host.hasClass('mat-context-menu-trigger-disabled');
    }
    /**
     * Gets a list of `MatMenuItemHarness` representing the items in the menu.
     * @param filters Optionally filters which menu items are included.
     */
    async getItems(filters) {
        const panelId = await this._getPanelId();
        if (panelId) {
            return this._documentRootLocator.locatorForAll(MatMenuItemHarness.with({
                ...(filters || {}),
                ancestor: `#${panelId}`,
            }))();
        }
        return [];
    }
    /**
     * Clicks an item in the menu, and optionally continues clicking items in subsequent sub-menus.
     * @param itemFilter A filter used to represent which item in the menu should be clicked. The
     *     first matching menu item will be clicked.
     * @param subItemFilters A list of filters representing the items to click in any subsequent
     *     sub-menus. The first item in the sub-menu matching the corresponding filter in
     *     `subItemFilters` will be clicked.
     */
    async clickItem(itemFilter, ...subItemFilters) {
        await this.open();
        return clickItemImplementation(await this.getItems(itemFilter), itemFilter, subItemFilters);
    }
    async getRootHarnessLoader() {
        const panelId = await this._getPanelId();
        return this.documentRootLocatorFactory().harnessLoaderFor(`#${panelId}`);
    }
    /** Gets the menu panel associated with this menu. */
    async _getMenuPanel() {
        const panelId = await this._getPanelId();
        return panelId ? this._documentRootLocator.locatorForOptional(`#${panelId}`)() : null;
    }
    /** Gets the id of the menu panel associated with this menu. */
    async _getPanelId() {
        const panelId = await (await this.host()).getAttribute('aria-controls');
        return panelId || null;
    }
}

export { MatContextMenuHarness, MatMenuHarness, MatMenuItemHarness };
//# sourceMappingURL=testing.mjs.map
