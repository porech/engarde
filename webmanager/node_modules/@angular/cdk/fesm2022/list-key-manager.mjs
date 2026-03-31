import { signal, QueryList, isSignal, effect } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Typeahead } from './typeahead.mjs';
import { hasModifierKey } from './keycodes.mjs';
import { PAGE_DOWN, PAGE_UP, END, HOME, LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW, TAB } from './keycodes2.mjs';

/**
 * This class manages keyboard events for selectable lists. If you pass it a query list
 * of items, it will set the active item correctly when arrow events occur.
 */
class ListKeyManager {
    _items;
    _activeItemIndex = signal(-1, ...(ngDevMode ? [{ debugName: "_activeItemIndex" }] : []));
    _activeItem = signal(null, ...(ngDevMode ? [{ debugName: "_activeItem" }] : []));
    _wrap = false;
    _typeaheadSubscription = Subscription.EMPTY;
    _itemChangesSubscription;
    _vertical = true;
    _horizontal;
    _allowedModifierKeys = [];
    _homeAndEnd = false;
    _pageUpAndDown = { enabled: false, delta: 10 };
    _effectRef;
    _typeahead;
    /**
     * Predicate function that can be used to check whether an item should be skipped
     * by the key manager. By default, disabled items are skipped.
     */
    _skipPredicateFn = (item) => item.disabled;
    constructor(_items, injector) {
        this._items = _items;
        // We allow for the items to be an array because, in some cases, the consumer may
        // not have access to a QueryList of the items they want to manage (e.g. when the
        // items aren't being collected via `ViewChildren` or `ContentChildren`).
        if (_items instanceof QueryList) {
            this._itemChangesSubscription = _items.changes.subscribe((newItems) => this._itemsChanged(newItems.toArray()));
        }
        else if (isSignal(_items)) {
            if (!injector && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw new Error('ListKeyManager constructed with a signal must receive an injector');
            }
            this._effectRef = effect(() => this._itemsChanged(_items()), ...(ngDevMode ? [{ debugName: "_effectRef", injector }] : [{ injector }]));
        }
    }
    /**
     * Stream that emits any time the TAB key is pressed, so components can react
     * when focus is shifted off of the list.
     */
    tabOut = new Subject();
    /** Stream that emits whenever the active item of the list manager changes. */
    change = new Subject();
    /**
     * Sets the predicate function that determines which items should be skipped by the
     * list key manager.
     * @param predicate Function that determines whether the given item should be skipped.
     */
    skipPredicate(predicate) {
        this._skipPredicateFn = predicate;
        return this;
    }
    /**
     * Configures wrapping mode, which determines whether the active item will wrap to
     * the other end of list when there are no more items in the given direction.
     * @param shouldWrap Whether the list should wrap when reaching the end.
     */
    withWrap(shouldWrap = true) {
        this._wrap = shouldWrap;
        return this;
    }
    /**
     * Configures whether the key manager should be able to move the selection vertically.
     * @param enabled Whether vertical selection should be enabled.
     */
    withVerticalOrientation(enabled = true) {
        this._vertical = enabled;
        return this;
    }
    /**
     * Configures the key manager to move the selection horizontally.
     * Passing in `null` will disable horizontal movement.
     * @param direction Direction in which the selection can be moved.
     */
    withHorizontalOrientation(direction) {
        this._horizontal = direction;
        return this;
    }
    /**
     * Modifier keys which are allowed to be held down and whose default actions will be prevented
     * as the user is pressing the arrow keys. Defaults to not allowing any modifier keys.
     */
    withAllowedModifierKeys(keys) {
        this._allowedModifierKeys = keys;
        return this;
    }
    /**
     * Turns on typeahead mode which allows users to set the active item by typing.
     * @param debounceInterval Time to wait after the last keystroke before setting the active item.
     */
    withTypeAhead(debounceInterval = 200) {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            const items = this._getItemsArray();
            if (items.length > 0 && items.some(item => typeof item.getLabel !== 'function')) {
                throw Error('ListKeyManager items in typeahead mode must implement the `getLabel` method.');
            }
        }
        this._typeaheadSubscription.unsubscribe();
        const items = this._getItemsArray();
        this._typeahead = new Typeahead(items, {
            debounceInterval: typeof debounceInterval === 'number' ? debounceInterval : undefined,
            skipPredicate: item => this._skipPredicateFn(item),
        });
        this._typeaheadSubscription = this._typeahead.selectedItem.subscribe(item => {
            this.setActiveItem(item);
        });
        return this;
    }
    /** Cancels the current typeahead sequence. */
    cancelTypeahead() {
        this._typeahead?.reset();
        return this;
    }
    /**
     * Configures the key manager to activate the first and last items
     * respectively when the Home or End key is pressed.
     * @param enabled Whether pressing the Home or End key activates the first/last item.
     */
    withHomeAndEnd(enabled = true) {
        this._homeAndEnd = enabled;
        return this;
    }
    /**
     * Configures the key manager to activate every 10th, configured or first/last element in up/down direction
     * respectively when the Page-Up or Page-Down key is pressed.
     * @param enabled Whether pressing the Page-Up or Page-Down key activates the first/last item.
     * @param delta Whether pressing the Home or End key activates the first/last item.
     */
    withPageUpDown(enabled = true, delta = 10) {
        this._pageUpAndDown = { enabled, delta };
        return this;
    }
    setActiveItem(item) {
        const previousActiveItem = this._activeItem();
        this.updateActiveItem(item);
        if (this._activeItem() !== previousActiveItem) {
            this.change.next(this._activeItemIndex());
        }
    }
    /**
     * Sets the active item depending on the key event passed in.
     * @param event Keyboard event to be used for determining which element should be active.
     */
    onKeydown(event) {
        const keyCode = event.keyCode;
        const modifiers = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'];
        const isModifierAllowed = modifiers.every(modifier => {
            return !event[modifier] || this._allowedModifierKeys.indexOf(modifier) > -1;
        });
        switch (keyCode) {
            case TAB:
                this.tabOut.next();
                return;
            case DOWN_ARROW:
                if (this._vertical && isModifierAllowed) {
                    this.setNextItemActive();
                    break;
                }
                else {
                    return;
                }
            case UP_ARROW:
                if (this._vertical && isModifierAllowed) {
                    this.setPreviousItemActive();
                    break;
                }
                else {
                    return;
                }
            case RIGHT_ARROW:
                if (this._horizontal && isModifierAllowed) {
                    this._horizontal === 'rtl' ? this.setPreviousItemActive() : this.setNextItemActive();
                    break;
                }
                else {
                    return;
                }
            case LEFT_ARROW:
                if (this._horizontal && isModifierAllowed) {
                    this._horizontal === 'rtl' ? this.setNextItemActive() : this.setPreviousItemActive();
                    break;
                }
                else {
                    return;
                }
            case HOME:
                if (this._homeAndEnd && isModifierAllowed) {
                    this.setFirstItemActive();
                    break;
                }
                else {
                    return;
                }
            case END:
                if (this._homeAndEnd && isModifierAllowed) {
                    this.setLastItemActive();
                    break;
                }
                else {
                    return;
                }
            case PAGE_UP:
                if (this._pageUpAndDown.enabled && isModifierAllowed) {
                    const targetIndex = this._activeItemIndex() - this._pageUpAndDown.delta;
                    this._setActiveItemByIndex(targetIndex > 0 ? targetIndex : 0, 1);
                    break;
                }
                else {
                    return;
                }
            case PAGE_DOWN:
                if (this._pageUpAndDown.enabled && isModifierAllowed) {
                    const targetIndex = this._activeItemIndex() + this._pageUpAndDown.delta;
                    const itemsLength = this._getItemsArray().length;
                    this._setActiveItemByIndex(targetIndex < itemsLength ? targetIndex : itemsLength - 1, -1);
                    break;
                }
                else {
                    return;
                }
            default:
                if (isModifierAllowed || hasModifierKey(event, 'shiftKey')) {
                    this._typeahead?.handleKey(event);
                }
                // Note that we return here, in order to avoid preventing
                // the default action of non-navigational keys.
                return;
        }
        this._typeahead?.reset();
        event.preventDefault();
    }
    /** Index of the currently active item. */
    get activeItemIndex() {
        return this._activeItemIndex();
    }
    /** The active item. */
    get activeItem() {
        return this._activeItem();
    }
    /** Gets whether the user is currently typing into the manager using the typeahead feature. */
    isTyping() {
        return !!this._typeahead && this._typeahead.isTyping();
    }
    /** Sets the active item to the first enabled item in the list. */
    setFirstItemActive() {
        this._setActiveItemByIndex(0, 1);
    }
    /** Sets the active item to the last enabled item in the list. */
    setLastItemActive() {
        this._setActiveItemByIndex(this._getItemsArray().length - 1, -1);
    }
    /** Sets the active item to the next enabled item in the list. */
    setNextItemActive() {
        this._activeItemIndex() < 0 ? this.setFirstItemActive() : this._setActiveItemByDelta(1);
    }
    /** Sets the active item to a previous enabled item in the list. */
    setPreviousItemActive() {
        this._activeItemIndex() < 0 && this._wrap
            ? this.setLastItemActive()
            : this._setActiveItemByDelta(-1);
    }
    updateActiveItem(item) {
        const itemArray = this._getItemsArray();
        const index = typeof item === 'number' ? item : itemArray.indexOf(item);
        const activeItem = itemArray[index];
        // Explicitly check for `null` and `undefined` because other falsy values are valid.
        this._activeItem.set(activeItem == null ? null : activeItem);
        this._activeItemIndex.set(index);
        this._typeahead?.setCurrentSelectedItemIndex(index);
    }
    /** Cleans up the key manager. */
    destroy() {
        this._typeaheadSubscription.unsubscribe();
        this._itemChangesSubscription?.unsubscribe();
        this._effectRef?.destroy();
        this._typeahead?.destroy();
        this.tabOut.complete();
        this.change.complete();
    }
    /**
     * This method sets the active item, given a list of items and the delta between the
     * currently active item and the new active item. It will calculate differently
     * depending on whether wrap mode is turned on.
     */
    _setActiveItemByDelta(delta) {
        this._wrap ? this._setActiveInWrapMode(delta) : this._setActiveInDefaultMode(delta);
    }
    /**
     * Sets the active item properly given "wrap" mode. In other words, it will continue to move
     * down the list until it finds an item that is not disabled, and it will wrap if it
     * encounters either end of the list.
     */
    _setActiveInWrapMode(delta) {
        const items = this._getItemsArray();
        for (let i = 1; i <= items.length; i++) {
            const index = (this._activeItemIndex() + delta * i + items.length) % items.length;
            const item = items[index];
            if (!this._skipPredicateFn(item)) {
                this.setActiveItem(index);
                return;
            }
        }
    }
    /**
     * Sets the active item properly given the default mode. In other words, it will
     * continue to move down the list until it finds an item that is not disabled. If
     * it encounters either end of the list, it will stop and not wrap.
     */
    _setActiveInDefaultMode(delta) {
        this._setActiveItemByIndex(this._activeItemIndex() + delta, delta);
    }
    /**
     * Sets the active item to the first enabled item starting at the index specified. If the
     * item is disabled, it will move in the fallbackDelta direction until it either
     * finds an enabled item or encounters the end of the list.
     */
    _setActiveItemByIndex(index, fallbackDelta) {
        const items = this._getItemsArray();
        if (!items[index]) {
            return;
        }
        while (this._skipPredicateFn(items[index])) {
            index += fallbackDelta;
            if (!items[index]) {
                return;
            }
        }
        this.setActiveItem(index);
    }
    /** Returns the items as an array. */
    _getItemsArray() {
        if (isSignal(this._items)) {
            return this._items();
        }
        return this._items instanceof QueryList ? this._items.toArray() : this._items;
    }
    /** Callback for when the items have changed. */
    _itemsChanged(newItems) {
        this._typeahead?.setItems(newItems);
        const activeItem = this._activeItem();
        if (activeItem) {
            const newIndex = newItems.indexOf(activeItem);
            if (newIndex > -1 && newIndex !== this._activeItemIndex()) {
                this._activeItemIndex.set(newIndex);
                this._typeahead?.setCurrentSelectedItemIndex(newIndex);
            }
        }
    }
}

export { ListKeyManager };
//# sourceMappingURL=list-key-manager.mjs.map
