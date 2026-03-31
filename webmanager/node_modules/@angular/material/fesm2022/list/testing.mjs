import { ComponentHarness, HarnessPredicate, ContentContainerComponentHarness, parallel } from '@angular/cdk/testing';
import { MatDividerHarness } from '../divider/testing.mjs';

const iconSelector = '.mat-mdc-list-item-icon';
const avatarSelector = '.mat-mdc-list-item-avatar';
/**
 * Gets a `HarnessPredicate` that applies the given `BaseListItemHarnessFilters` to the given
 * list item harness.
 * @template H The type of list item harness to create a predicate for.
 * @param harnessType A constructor for a list item harness.
 * @param options An instance of `BaseListItemHarnessFilters` to apply.
 * @return A `HarnessPredicate` for the given harness type with the given options applied.
 */
function getListItemPredicate(harnessType, options) {
    return new HarnessPredicate(harnessType, options)
        .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
        .addOption('fullText', options.fullText, (harness, fullText) => HarnessPredicate.stringMatches(harness.getFullText(), fullText))
        .addOption('title', options.title, (harness, title) => HarnessPredicate.stringMatches(harness.getTitle(), title))
        .addOption('secondaryText', options.secondaryText, (harness, secondaryText) => HarnessPredicate.stringMatches(harness.getSecondaryText(), secondaryText))
        .addOption('tertiaryText', options.tertiaryText, (harness, tertiaryText) => HarnessPredicate.stringMatches(harness.getTertiaryText(), tertiaryText));
}
/** Harness for interacting with a list subheader. */
class MatSubheaderHarness extends ComponentHarness {
    static hostSelector = '.mat-mdc-subheader';
    static with(options = {}) {
        return new HarnessPredicate(MatSubheaderHarness, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
    }
    /** Gets the full text content of the list item (including text from any font icons). */
    async getText() {
        return (await this.host()).text();
    }
}
/** Selectors for the various list item sections that may contain user content. */
var MatListItemSection;
(function (MatListItemSection) {
    MatListItemSection["CONTENT"] = ".mdc-list-item__content";
})(MatListItemSection || (MatListItemSection = {}));
/** Enum describing the possible variants of a list item. */
var MatListItemType;
(function (MatListItemType) {
    MatListItemType[MatListItemType["ONE_LINE_ITEM"] = 0] = "ONE_LINE_ITEM";
    MatListItemType[MatListItemType["TWO_LINE_ITEM"] = 1] = "TWO_LINE_ITEM";
    MatListItemType[MatListItemType["THREE_LINE_ITEM"] = 2] = "THREE_LINE_ITEM";
})(MatListItemType || (MatListItemType = {}));
/**
 * Shared behavior among the harnesses for the various `MatListItem` flavors.
 * @docs-private
 */
class MatListItemHarnessBase extends ContentContainerComponentHarness {
    _lines = this.locatorForAll('.mat-mdc-list-item-line');
    _primaryText = this.locatorFor('.mdc-list-item__primary-text');
    _avatar = this.locatorForOptional('.mat-mdc-list-item-avatar');
    _icon = this.locatorForOptional('.mat-mdc-list-item-icon');
    _unscopedTextContent = this.locatorFor('.mat-mdc-list-item-unscoped-content');
    /** Gets the type of the list item, currently describing how many lines there are. */
    async getType() {
        const host = await this.host();
        const [isOneLine, isTwoLine] = await parallel(() => [
            host.hasClass('mdc-list-item--with-one-line'),
            host.hasClass('mdc-list-item--with-two-lines'),
        ]);
        if (isOneLine) {
            return MatListItemType.ONE_LINE_ITEM;
        }
        else if (isTwoLine) {
            return MatListItemType.TWO_LINE_ITEM;
        }
        else {
            return MatListItemType.THREE_LINE_ITEM;
        }
    }
    /**
     * Gets the full text content of the list item, excluding text
     * from icons and avatars.
     *
     * @deprecated Use the `getFullText` method instead.
     * @breaking-change 16.0.0
     */
    async getText() {
        return this.getFullText();
    }
    /**
     * Gets the full text content of the list item, excluding text
     * from icons and avatars.
     */
    async getFullText() {
        return (await this.host()).text({ exclude: `${iconSelector}, ${avatarSelector}` });
    }
    /** Gets the title of the list item. */
    async getTitle() {
        return (await this._primaryText()).text();
    }
    /** Whether the list item is disabled. */
    async isDisabled() {
        return (await this.host()).hasClass('mdc-list-item--disabled');
    }
    /**
     * Gets the secondary line text of the list item. Null if the list item
     * does not have a secondary line.
     */
    async getSecondaryText() {
        const type = await this.getType();
        if (type === MatListItemType.ONE_LINE_ITEM) {
            return null;
        }
        const [lines, unscopedTextContent] = await parallel(() => [
            this._lines(),
            this._unscopedTextContent(),
        ]);
        // If there is no explicit line for the secondary text, the unscoped text content
        // is rendered as the secondary text (with potential text wrapping enabled).
        if (lines.length >= 1) {
            return lines[0].text();
        }
        else {
            return unscopedTextContent.text();
        }
    }
    /**
     * Gets the tertiary line text of the list item. Null if the list item
     * does not have a tertiary line.
     */
    async getTertiaryText() {
        const type = await this.getType();
        if (type !== MatListItemType.THREE_LINE_ITEM) {
            return null;
        }
        const [lines, unscopedTextContent] = await parallel(() => [
            this._lines(),
            this._unscopedTextContent(),
        ]);
        // First we check if there is an explicit line for the tertiary text. If so, we return it.
        // If there is at least an explicit secondary line though, then we know that the unscoped
        // text content corresponds to the tertiary line. If there are no explicit lines at all,
        // we know that the unscoped text content from the secondary text just wraps into the third
        // line, but there *no* actual dedicated tertiary text.
        if (lines.length === 2) {
            return lines[1].text();
        }
        else if (lines.length === 1) {
            return unscopedTextContent.text();
        }
        return null;
    }
    /** Whether this list item has an avatar. */
    async hasAvatar() {
        return !!(await this._avatar());
    }
    /** Whether this list item has an icon. */
    async hasIcon() {
        return !!(await this._icon());
    }
}

/**
 * Shared behavior among the harnesses for the various `MatList` flavors.
 * @template T A constructor type for a list item harness type used by this list harness.
 * @template C The list item harness type that `T` constructs.
 * @template F The filter type used filter list item harness of type `C`.
 * @docs-private
 */
class MatListHarnessBase extends ComponentHarness {
    _itemHarness;
    /**
     * Gets a list of harnesses representing the items in this list.
     * @param filters Optional filters used to narrow which harnesses are included
     * @return The list of items matching the given filters.
     */
    async getItems(filters) {
        return this.locatorForAll(this._itemHarness.with(filters))();
    }
    /**
     * Gets a list of `ListSection` representing the list items grouped by subheaders. If the list has
     * no subheaders it is represented as a single `ListSection` with an undefined `heading` property.
     * @param filters Optional filters used to narrow which list item harnesses are included
     * @return The list of items matching the given filters, grouped into sections by subheader.
     */
    async getItemsGroupedBySubheader(filters) {
        const listSections = [];
        let currentSection = { items: [] };
        const itemsAndSubheaders = await this.getItemsWithSubheadersAndDividers({
            item: filters,
            divider: false,
        });
        for (const itemOrSubheader of itemsAndSubheaders) {
            if (itemOrSubheader instanceof MatSubheaderHarness) {
                if (currentSection.heading !== undefined || currentSection.items.length) {
                    listSections.push(currentSection);
                }
                currentSection = { heading: itemOrSubheader.getText(), items: [] };
            }
            else {
                currentSection.items.push(itemOrSubheader);
            }
        }
        if (currentSection.heading !== undefined ||
            currentSection.items.length ||
            !listSections.length) {
            listSections.push(currentSection);
        }
        // Concurrently wait for all sections to resolve their heading if present.
        return parallel(() => listSections.map(async (s) => ({ items: s.items, heading: await s.heading })));
    }
    /**
     * Gets a list of sub-lists representing the list items grouped by dividers. If the list has no
     * dividers it is represented as a list with a single sub-list.
     * @param filters Optional filters used to narrow which list item harnesses are included
     * @return The list of items matching the given filters, grouped into sub-lists by divider.
     */
    async getItemsGroupedByDividers(filters) {
        const listSections = [[]];
        const itemsAndDividers = await this.getItemsWithSubheadersAndDividers({
            item: filters,
            subheader: false,
        });
        for (const itemOrDivider of itemsAndDividers) {
            if (itemOrDivider instanceof MatDividerHarness) {
                listSections.push([]);
            }
            else {
                listSections[listSections.length - 1].push(itemOrDivider);
            }
        }
        return listSections;
    }
    async getItemsWithSubheadersAndDividers(filters = {}) {
        const query = [];
        if (filters.item !== false) {
            query.push(this._itemHarness.with(filters.item || {}));
        }
        if (filters.subheader !== false) {
            query.push(MatSubheaderHarness.with(filters.subheader));
        }
        if (filters.divider !== false) {
            query.push(MatDividerHarness.with(filters.divider));
        }
        return this.locatorForAll(...query)();
    }
}

/** Harness for interacting with a action-list in tests. */
class MatActionListHarness extends MatListHarnessBase {
    /** The selector for the host element of a `MatActionList` instance. */
    static hostSelector = '.mat-mdc-action-list';
    /**
     * Gets a `HarnessPredicate` that can be used to search for an action list with specific
     * attributes.
     * @param options Options for filtering which action list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
    _itemHarness = MatActionListItemHarness;
}
/** Harness for interacting with an action list item. */
class MatActionListItemHarness extends MatListItemHarnessBase {
    /** The selector for the host element of a `MatListItem` instance. */
    static hostSelector = `${MatActionListHarness.hostSelector} .mat-mdc-list-item`;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a list item with specific
     * attributes.
     * @param options Options for filtering which action list item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getListItemPredicate(this, options);
    }
    /** Clicks on the action list item. */
    async click() {
        return (await this.host()).click();
    }
    /** Focuses the action list item. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the action list item. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the action list item is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
}

/** Harness for interacting with a list in tests. */
class MatListHarness extends MatListHarnessBase {
    /** The selector for the host element of a `MatList` instance. */
    static hostSelector = '.mat-mdc-list';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a list with specific attributes.
     * @param options Options for filtering which list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
    _itemHarness = MatListItemHarness;
}
/** Harness for interacting with a list item. */
class MatListItemHarness extends MatListItemHarnessBase {
    /** The selector for the host element of a `MatListItem` instance. */
    static hostSelector = `${MatListHarness.hostSelector} .mat-mdc-list-item`;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a list item with specific attributes.
     * @param options Options for filtering which list item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getListItemPredicate(this, options);
    }
}

/** Harness for interacting with a mat-nav-list in tests. */
class MatNavListHarness extends MatListHarnessBase {
    /** The selector for the host element of a `MatNavList` instance. */
    static hostSelector = '.mat-mdc-nav-list';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a nav list with specific
     * attributes.
     * @param options Options for filtering which nav list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
    _itemHarness = MatNavListItemHarness;
}
/** Harness for interacting with a nav-list item. */
class MatNavListItemHarness extends MatListItemHarnessBase {
    /** The selector for the host element of a `MatListItem` instance. */
    static hostSelector = `${MatNavListHarness.hostSelector} .mat-mdc-list-item`;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a nav list item with specific
     * attributes.
     * @param options Options for filtering which nav list item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getListItemPredicate(this, options)
            .addOption('href', options.href, async (harness, href) => HarnessPredicate.stringMatches(harness.getHref(), href))
            .addOption('activated', options.activated, async (harness, activated) => (await harness.isActivated()) === activated);
    }
    /** Gets the href for this nav list item. */
    async getHref() {
        return (await this.host()).getAttribute('href');
    }
    /** Clicks on the nav list item. */
    async click() {
        return (await this.host()).click();
    }
    /** Focuses the nav list item. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the nav list item. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the nav list item is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Whether the list item is activated. Should only be used for nav list items. */
    async isActivated() {
        return (await this.host()).hasClass('mdc-list-item--activated');
    }
}

/** Harness for interacting with a selection-list in tests. */
class MatSelectionListHarness extends MatListHarnessBase {
    /** The selector for the host element of a `MatSelectionList` instance. */
    static hostSelector = '.mat-mdc-selection-list';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a selection list with specific
     * attributes.
     * @param options Options for filtering which selection list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
    _itemHarness = MatListOptionHarness;
    /** Whether the selection list is disabled. */
    async isDisabled() {
        return (await (await this.host()).getAttribute('aria-disabled')) === 'true';
    }
    /**
     * Selects all items matching any of the given filters.
     * @param filters Filters that specify which items should be selected.
     */
    async selectItems(...filters) {
        const items = await this._getItems(filters);
        await parallel(() => items.map(item => item.select()));
    }
    /**
     * Deselects all items matching any of the given filters.
     * @param filters Filters that specify which items should be deselected.
     */
    async deselectItems(...filters) {
        const items = await this._getItems(filters);
        await parallel(() => items.map(item => item.deselect()));
    }
    /** Gets all items matching the given list of filters. */
    async _getItems(filters) {
        if (!filters.length) {
            return this.getItems();
        }
        const matches = await parallel(() => filters.map(filter => this.locatorForAll(MatListOptionHarness.with(filter))()));
        return matches.reduce((result, current) => [...result, ...current], []);
    }
}
/** Harness for interacting with a list option. */
class MatListOptionHarness extends MatListItemHarnessBase {
    /** The selector for the host element of a `MatListOption` instance. */
    static hostSelector = '.mat-mdc-list-option';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a list option with specific
     * attributes.
     * @param options Options for filtering which list option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getListItemPredicate(this, options).addOption('is selected', options.selected, async (harness, selected) => (await harness.isSelected()) === selected);
    }
    _beforeCheckbox = this.locatorForOptional('.mdc-list-item__start .mdc-checkbox');
    _beforeRadio = this.locatorForOptional('.mdc-list-item__start .mdc-radio');
    /** Gets the position of the checkbox relative to the list option content. */
    async getCheckboxPosition() {
        return (await this._beforeCheckbox()) !== null ? 'before' : 'after';
    }
    /** Gets the position of the radio relative to the list option content. */
    async getRadioPosition() {
        return (await this._beforeRadio()) !== null ? 'before' : 'after';
    }
    /** Whether the list option is selected. */
    async isSelected() {
        return (await (await this.host()).getAttribute('aria-selected')) === 'true';
    }
    /** Focuses the list option. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the list option. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the list option is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Toggles the checked state of the checkbox. */
    async toggle() {
        return (await this.host()).click();
    }
    /**
     * Puts the list option in a checked state by toggling it if it is currently
     * unchecked, or doing nothing if it is already checked.
     */
    async select() {
        if (!(await this.isSelected())) {
            return this.toggle();
        }
    }
    /**
     * Puts the list option in an unchecked state by toggling it if it is currently
     * checked, or doing nothing if it is already unchecked.
     */
    async deselect() {
        if (await this.isSelected()) {
            return this.toggle();
        }
    }
}

export { MatActionListHarness, MatActionListItemHarness, MatListHarness, MatListItemHarness, MatListItemSection, MatListItemType, MatListOptionHarness, MatNavListHarness, MatNavListItemHarness, MatSelectionListHarness, MatSubheaderHarness };
//# sourceMappingURL=testing.mjs.map
