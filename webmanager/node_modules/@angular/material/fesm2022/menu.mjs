import * as i0 from '@angular/core';
import { InjectionToken, inject, ElementRef, DOCUMENT, ChangeDetectorRef, booleanAttribute, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, TemplateRef, ApplicationRef, Injector, ViewContainerRef, Directive, QueryList, signal, EventEmitter, afterNextRender, ContentChildren, ViewChild, ContentChild, Output, NgZone, Renderer2, NgModule } from '@angular/core';
import { FocusMonitor, _IdGenerator, FocusKeyManager, isFakeTouchstartFromScreenReader, isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { UP_ARROW, DOWN_ARROW, RIGHT_ARROW, LEFT_ARROW, ESCAPE, hasModifierKey, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Subject, merge, Subscription, of } from 'rxjs';
import { startWith, switchMap, takeUntil, take, filter, skipWhile } from 'rxjs/operators';
import { _CdkPrivateStyleLoader } from '@angular/cdk/private';
import { _StructuralStylesLoader } from './structural-styles.mjs';
import { MatRipple } from './ripple.mjs';
import { TemplatePortal, DomPortalOutlet } from '@angular/cdk/portal';
import { _animationsDisabled } from './animation.mjs';
import { Directionality } from '@angular/cdk/bidi';
import { createRepositionScrollStrategy, createOverlayRef, OverlayConfig, createFlexibleConnectedPositionStrategy, ViewportRuler, ScrollDispatcher, OverlayModule } from '@angular/cdk/overlay';
import { _getEventTarget, _getShadowRoot } from '@angular/cdk/platform';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatRippleModule } from './ripple-module.mjs';
import { MatCommonModule } from './common-module.mjs';
import '@angular/cdk/coercion';
import '@angular/cdk/layout';

/**
 * Injection token used to provide the parent menu to menu-specific components.
 * @docs-private
 */
const MAT_MENU_PANEL = new InjectionToken('MAT_MENU_PANEL');

/**
 * Single item inside a `mat-menu`. Provides the menu item styling and accessibility treatment.
 */
class MatMenuItem {
    _elementRef = inject(ElementRef);
    _document = inject(DOCUMENT);
    _focusMonitor = inject(FocusMonitor);
    _parentMenu = inject(MAT_MENU_PANEL, { optional: true });
    _changeDetectorRef = inject(ChangeDetectorRef);
    /** ARIA role for the menu item. */
    role = 'menuitem';
    /** Whether the menu item is disabled. */
    disabled = false;
    /** Whether ripples are disabled on the menu item. */
    disableRipple = false;
    /** Stream that emits when the menu item is hovered. */
    _hovered = new Subject();
    /** Stream that emits when the menu item is focused. */
    _focused = new Subject();
    /** Whether the menu item is highlighted. */
    _highlighted = false;
    /** Whether the menu item acts as a trigger for a sub-menu. */
    _triggersSubmenu = false;
    constructor() {
        inject(_CdkPrivateStyleLoader).load(_StructuralStylesLoader);
        this._parentMenu?.addItem?.(this);
    }
    /** Focuses the menu item. */
    focus(origin, options) {
        if (this._focusMonitor && origin) {
            this._focusMonitor.focusVia(this._getHostElement(), origin, options);
        }
        else {
            this._getHostElement().focus(options);
        }
        this._focused.next(this);
    }
    ngAfterViewInit() {
        if (this._focusMonitor) {
            // Start monitoring the element, so it gets the appropriate focused classes. We want
            // to show the focus style for menu items only when the focus was not caused by a
            // mouse or touch interaction.
            this._focusMonitor.monitor(this._elementRef, false);
        }
    }
    ngOnDestroy() {
        if (this._focusMonitor) {
            this._focusMonitor.stopMonitoring(this._elementRef);
        }
        if (this._parentMenu && this._parentMenu.removeItem) {
            this._parentMenu.removeItem(this);
        }
        this._hovered.complete();
        this._focused.complete();
    }
    /** Used to set the `tabindex`. */
    _getTabIndex() {
        return this.disabled ? '-1' : '0';
    }
    /** Returns the host DOM element. */
    _getHostElement() {
        return this._elementRef.nativeElement;
    }
    /** Prevents the default element actions if it is disabled. */
    _checkDisabled(event) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
    /** Emits to the hover stream. */
    _handleMouseEnter() {
        this._hovered.next(this);
    }
    /** Gets the label to be used when determining whether the option should be focused. */
    getLabel() {
        const clone = this._elementRef.nativeElement.cloneNode(true);
        const icons = clone.querySelectorAll('mat-icon, .material-icons');
        // Strip away icons, so they don't show up in the text.
        for (let i = 0; i < icons.length; i++) {
            icons[i].remove();
        }
        return clone.textContent?.trim() || '';
    }
    _setHighlighted(isHighlighted) {
        // We need to mark this for check for the case where the content is coming from a
        // `matMenuContent` whose change detection tree is at the declaration position,
        // not the insertion position. See #23175.
        this._highlighted = isHighlighted;
        this._changeDetectorRef.markForCheck();
    }
    _setTriggersSubmenu(triggersSubmenu) {
        this._triggersSubmenu = triggersSubmenu;
        this._changeDetectorRef.markForCheck();
    }
    _hasFocus() {
        return this._document && this._document.activeElement === this._getHostElement();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatMenuItem, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.0-next.2", type: MatMenuItem, isStandalone: true, selector: "[mat-menu-item]", inputs: { role: "role", disabled: ["disabled", "disabled", booleanAttribute], disableRipple: ["disableRipple", "disableRipple", booleanAttribute] }, host: { listeners: { "click": "_checkDisabled($event)", "mouseenter": "_handleMouseEnter()" }, properties: { "attr.role": "role", "class.mat-mdc-menu-item-highlighted": "_highlighted", "class.mat-mdc-menu-item-submenu-trigger": "_triggersSubmenu", "attr.tabindex": "_getTabIndex()", "attr.aria-disabled": "disabled", "attr.disabled": "disabled || null" }, classAttribute: "mat-mdc-menu-item mat-focus-indicator" }, exportAs: ["matMenuItem"], ngImport: i0, template: "<ng-content select=\"mat-icon, [matMenuItemIcon]\"></ng-content>\n<span class=\"mat-mdc-menu-item-text\"><ng-content></ng-content></span>\n<div class=\"mat-mdc-menu-ripple\" matRipple\n     [matRippleDisabled]=\"disableRipple || disabled\"\n     [matRippleTrigger]=\"_getHostElement()\">\n</div>\n\n@if (_triggersSubmenu) {\n     <svg\n       class=\"mat-mdc-menu-submenu-icon\"\n       viewBox=\"0 0 5 10\"\n       focusable=\"false\"\n       aria-hidden=\"true\"><polygon points=\"0,0 5,5 0,10\"/></svg>\n}\n", dependencies: [{ kind: "directive", type: MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatMenuItem, decorators: [{
            type: Component,
            args: [{ selector: '[mat-menu-item]', exportAs: 'matMenuItem', host: {
                        '[attr.role]': 'role',
                        'class': 'mat-mdc-menu-item mat-focus-indicator',
                        '[class.mat-mdc-menu-item-highlighted]': '_highlighted',
                        '[class.mat-mdc-menu-item-submenu-trigger]': '_triggersSubmenu',
                        '[attr.tabindex]': '_getTabIndex()',
                        '[attr.aria-disabled]': 'disabled',
                        '[attr.disabled]': 'disabled || null',
                        '(click)': '_checkDisabled($event)',
                        '(mouseenter)': '_handleMouseEnter()',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [MatRipple], template: "<ng-content select=\"mat-icon, [matMenuItemIcon]\"></ng-content>\n<span class=\"mat-mdc-menu-item-text\"><ng-content></ng-content></span>\n<div class=\"mat-mdc-menu-ripple\" matRipple\n     [matRippleDisabled]=\"disableRipple || disabled\"\n     [matRippleTrigger]=\"_getHostElement()\">\n</div>\n\n@if (_triggersSubmenu) {\n     <svg\n       class=\"mat-mdc-menu-submenu-icon\"\n       viewBox=\"0 0 5 10\"\n       focusable=\"false\"\n       aria-hidden=\"true\"><polygon points=\"0,0 5,5 0,10\"/></svg>\n}\n" }]
        }], ctorParameters: () => [], propDecorators: { role: [{
                type: Input
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], disableRipple: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });

/**
 * Throws an exception for the case when menu's x-position value isn't valid.
 * In other words, it doesn't match 'before' or 'after'.
 * @docs-private
 */
function throwMatMenuInvalidPositionX() {
    throw Error(`xPosition value must be either 'before' or after'.
      Example: <mat-menu xPosition="before" #menu="matMenu"></mat-menu>`);
}
/**
 * Throws an exception for the case when menu's y-position value isn't valid.
 * In other words, it doesn't match 'above' or 'below'.
 * @docs-private
 */
function throwMatMenuInvalidPositionY() {
    throw Error(`yPosition value must be either 'above' or below'.
      Example: <mat-menu yPosition="above" #menu="matMenu"></mat-menu>`);
}
/**
 * Throws an exception for the case when a menu is assigned
 * to a trigger that is placed inside the same menu.
 * @docs-private
 */
function throwMatMenuRecursiveError() {
    throw Error(`matMenuTriggerFor: menu cannot contain its own trigger. Assign a menu that is ` +
        `not a parent of the trigger or move the trigger outside of the menu.`);
}

/**
 * Injection token that can be used to reference instances of `MatMenuContent`. It serves
 * as alternative token to the actual `MatMenuContent` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const MAT_MENU_CONTENT = new InjectionToken('MatMenuContent');
/** Menu content that will be rendered lazily once the menu is opened. */
class MatMenuContent {
    _template = inject(TemplateRef);
    _appRef = inject(ApplicationRef);
    _injector = inject(Injector);
    _viewContainerRef = inject(ViewContainerRef);
    _document = inject(DOCUMENT);
    _changeDetectorRef = inject(ChangeDetectorRef);
    _portal;
    _outlet;
    /** Emits when the menu content has been attached. */
    _attached = new Subject();
    constructor() { }
    /**
     * Attaches the content with a particular context.
     * @docs-private
     */
    attach(context = {}) {
        if (!this._portal) {
            this._portal = new TemplatePortal(this._template, this._viewContainerRef);
        }
        this.detach();
        if (!this._outlet) {
            this._outlet = new DomPortalOutlet(this._document.createElement('div'), this._appRef, this._injector);
        }
        const element = this._template.elementRef.nativeElement;
        // Because we support opening the same menu from different triggers (which in turn have their
        // own `OverlayRef` panel), we have to re-insert the host element every time, otherwise we
        // risk it staying attached to a pane that's no longer in the DOM.
        element.parentNode.insertBefore(this._outlet.outletElement, element);
        // When `MatMenuContent` is used in an `OnPush` component, the insertion of the menu
        // content via `createEmbeddedView` does not cause the content to be seen as "dirty"
        // by Angular. This causes the `@ContentChildren` for menu items within the menu to
        // not be updated by Angular. By explicitly marking for check here, we tell Angular that
        // it needs to check for new menu items and update the `@ContentChild` in `MatMenu`.
        this._changeDetectorRef.markForCheck();
        this._portal.attach(this._outlet, context);
        this._attached.next();
    }
    /**
     * Detaches the content.
     * @docs-private
     */
    detach() {
        if (this._portal?.isAttached) {
            this._portal.detach();
        }
    }
    ngOnDestroy() {
        this.detach();
        this._outlet?.dispose();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatMenuContent, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: MatMenuContent, isStandalone: true, selector: "ng-template[matMenuContent]", providers: [{ provide: MAT_MENU_CONTENT, useExisting: MatMenuContent }], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatMenuContent, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[matMenuContent]',
                    providers: [{ provide: MAT_MENU_CONTENT, useExisting: MatMenuContent }],
                }]
        }], ctorParameters: () => [] });

/** Injection token to be used to override the default options for `mat-menu`. */
const MAT_MENU_DEFAULT_OPTIONS = new InjectionToken('mat-menu-default-options', {
    providedIn: 'root',
    factory: MAT_MENU_DEFAULT_OPTIONS_FACTORY,
});
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
function MAT_MENU_DEFAULT_OPTIONS_FACTORY() {
    return {
        overlapTrigger: false,
        xPosition: 'after',
        yPosition: 'below',
        backdropClass: 'cdk-overlay-transparent-backdrop',
    };
}
/** Name of the enter animation `@keyframes`. */
const ENTER_ANIMATION = '_mat-menu-enter';
/** Name of the exit animation `@keyframes`. */
const EXIT_ANIMATION = '_mat-menu-exit';
class MatMenu {
    _elementRef = inject(ElementRef);
    _changeDetectorRef = inject(ChangeDetectorRef);
    _injector = inject(Injector);
    _keyManager;
    _xPosition;
    _yPosition;
    _firstItemFocusRef;
    _exitFallbackTimeout;
    /** Whether animations are currently disabled. */
    _animationsDisabled = _animationsDisabled();
    /** All items inside the menu. Includes items nested inside another menu. */
    _allItems;
    /** Only the direct descendant menu items. */
    _directDescendantItems = new QueryList();
    /** Classes to be applied to the menu panel. */
    _classList = {};
    /** Current state of the panel animation. */
    _panelAnimationState = 'void';
    /** Emits whenever an animation on the menu completes. */
    _animationDone = new Subject();
    /** Whether the menu is animating. */
    _isAnimating = signal(false, ...(ngDevMode ? [{ debugName: "_isAnimating" }] : []));
    /** Parent menu of the current menu panel. */
    parentMenu;
    /** Layout direction of the menu. */
    direction;
    /** Class or list of classes to be added to the overlay panel. */
    overlayPanelClass;
    /** Class to be added to the backdrop element. */
    backdropClass;
    /** aria-label for the menu panel. */
    ariaLabel;
    /** aria-labelledby for the menu panel. */
    ariaLabelledby;
    /** aria-describedby for the menu panel. */
    ariaDescribedby;
    /** Position of the menu in the X axis. */
    get xPosition() {
        return this._xPosition;
    }
    set xPosition(value) {
        if (value !== 'before' &&
            value !== 'after' &&
            (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throwMatMenuInvalidPositionX();
        }
        this._xPosition = value;
        this.setPositionClasses();
    }
    /** Position of the menu in the Y axis. */
    get yPosition() {
        return this._yPosition;
    }
    set yPosition(value) {
        if (value !== 'above' && value !== 'below' && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throwMatMenuInvalidPositionY();
        }
        this._yPosition = value;
        this.setPositionClasses();
    }
    /** @docs-private */
    templateRef;
    /**
     * List of the items inside of a menu.
     * @deprecated
     * @breaking-change 8.0.0
     */
    items;
    /**
     * Menu content that will be rendered lazily.
     * @docs-private
     */
    lazyContent;
    /** Whether the menu should overlap its trigger. */
    overlapTrigger;
    /** Whether the menu has a backdrop. */
    hasBackdrop;
    /**
     * This method takes classes set on the host mat-menu element and applies them on the
     * menu template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing menu from outside the component.
     * @param classes list of class names
     */
    set panelClass(classes) {
        const previousPanelClass = this._previousPanelClass;
        const newClassList = { ...this._classList };
        if (previousPanelClass && previousPanelClass.length) {
            previousPanelClass.split(' ').forEach((className) => {
                newClassList[className] = false;
            });
        }
        this._previousPanelClass = classes;
        if (classes && classes.length) {
            classes.split(' ').forEach((className) => {
                newClassList[className] = true;
            });
            this._elementRef.nativeElement.className = '';
        }
        this._classList = newClassList;
    }
    _previousPanelClass;
    /**
     * This method takes classes set on the host mat-menu element and applies them on the
     * menu template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing menu from outside the component.
     * @deprecated Use `panelClass` instead.
     * @breaking-change 8.0.0
     */
    get classList() {
        return this.panelClass;
    }
    set classList(classes) {
        this.panelClass = classes;
    }
    /** Event emitted when the menu is closed. */
    closed = new EventEmitter();
    /**
     * Event emitted when the menu is closed.
     * @deprecated Switch to `closed` instead
     * @breaking-change 8.0.0
     */
    close = this.closed;
    panelId = inject(_IdGenerator).getId('mat-menu-panel-');
    constructor() {
        const defaultOptions = inject(MAT_MENU_DEFAULT_OPTIONS);
        this.overlayPanelClass = defaultOptions.overlayPanelClass || '';
        this._xPosition = defaultOptions.xPosition;
        this._yPosition = defaultOptions.yPosition;
        this.backdropClass = defaultOptions.backdropClass;
        this.overlapTrigger = defaultOptions.overlapTrigger;
        this.hasBackdrop = defaultOptions.hasBackdrop;
    }
    ngOnInit() {
        this.setPositionClasses();
    }
    ngAfterContentInit() {
        this._updateDirectDescendants();
        this._keyManager = new FocusKeyManager(this._directDescendantItems)
            .withWrap()
            .withTypeAhead()
            .withHomeAndEnd();
        this._keyManager.tabOut.subscribe(() => this.closed.emit('tab'));
        // If a user manually (programmatically) focuses a menu item, we need to reflect that focus
        // change back to the key manager. Note that we don't need to unsubscribe here because _focused
        // is internal and we know that it gets completed on destroy.
        this._directDescendantItems.changes
            .pipe(startWith(this._directDescendantItems), switchMap(items => merge(...items.map((item) => item._focused))))
            .subscribe(focusedItem => this._keyManager.updateActiveItem(focusedItem));
        this._directDescendantItems.changes.subscribe((itemsList) => {
            // Move focus to another item, if the active item is removed from the list.
            // We need to debounce the callback, because multiple items might be removed
            // in quick succession.
            const manager = this._keyManager;
            if (this._panelAnimationState === 'enter' && manager.activeItem?._hasFocus()) {
                const items = itemsList.toArray();
                const index = Math.max(0, Math.min(items.length - 1, manager.activeItemIndex || 0));
                if (items[index] && !items[index].disabled) {
                    manager.setActiveItem(index);
                }
                else {
                    manager.setNextItemActive();
                }
            }
        });
    }
    ngOnDestroy() {
        this._keyManager?.destroy();
        this._directDescendantItems.destroy();
        this.closed.complete();
        this._firstItemFocusRef?.destroy();
        clearTimeout(this._exitFallbackTimeout);
    }
    /** Stream that emits whenever the hovered menu item changes. */
    _hovered() {
        // Coerce the `changes` property because Angular types it as `Observable<any>`
        const itemChanges = this._directDescendantItems.changes;
        return itemChanges.pipe(startWith(this._directDescendantItems), switchMap(items => merge(...items.map((item) => item._hovered))));
    }
    /*
     * Registers a menu item with the menu.
     * @docs-private
     * @deprecated No longer being used. To be removed.
     * @breaking-change 9.0.0
     */
    addItem(_item) { }
    /**
     * Removes an item from the menu.
     * @docs-private
     * @deprecated No longer being used. To be removed.
     * @breaking-change 9.0.0
     */
    removeItem(_item) { }
    /** Handle a keyboard event from the menu, delegating to the appropriate action. */
    _handleKeydown(event) {
        const keyCode = event.keyCode;
        const manager = this._keyManager;
        switch (keyCode) {
            case ESCAPE:
                if (!hasModifierKey(event)) {
                    event.preventDefault();
                    this.closed.emit('keydown');
                }
                break;
            case LEFT_ARROW:
                if (this.parentMenu && this.direction === 'ltr') {
                    this.closed.emit('keydown');
                }
                break;
            case RIGHT_ARROW:
                if (this.parentMenu && this.direction === 'rtl') {
                    this.closed.emit('keydown');
                }
                break;
            default:
                if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
                    manager.setFocusOrigin('keyboard');
                }
                manager.onKeydown(event);
                return;
        }
    }
    /**
     * Focus the first item in the menu.
     * @param origin Action from which the focus originated. Used to set the correct styling.
     */
    focusFirstItem(origin = 'program') {
        // Wait for `afterNextRender` to ensure iOS VoiceOver screen reader focuses the first item (#24735).
        this._firstItemFocusRef?.destroy();
        this._firstItemFocusRef = afterNextRender(() => {
            const menuPanel = this._resolvePanel();
            // If an item in the menuPanel is already focused, avoid overriding the focus.
            if (!menuPanel || !menuPanel.contains(document.activeElement)) {
                const manager = this._keyManager;
                manager.setFocusOrigin(origin).setFirstItemActive();
                // If there's no active item at this point, it means that all the items are disabled.
                // Move focus to the menuPanel panel so keyboard events like Escape still work. Also this will
                // give _some_ feedback to screen readers.
                if (!manager.activeItem && menuPanel) {
                    menuPanel.focus();
                }
            }
        }, { injector: this._injector });
    }
    /**
     * Resets the active item in the menu. This is used when the menu is opened, allowing
     * the user to start from the first option when pressing the down arrow.
     */
    resetActiveItem() {
        this._keyManager.setActiveItem(-1);
    }
    /**
     * @deprecated No longer used and will be removed.
     * @breaking-change 21.0.0
     */
    setElevation(_depth) { }
    /**
     * Adds classes to the menu panel based on its position. Can be used by
     * consumers to add specific styling based on the position.
     * @param posX Position of the menu along the x axis.
     * @param posY Position of the menu along the y axis.
     * @docs-private
     */
    setPositionClasses(posX = this.xPosition, posY = this.yPosition) {
        this._classList = {
            ...this._classList,
            ['mat-menu-before']: posX === 'before',
            ['mat-menu-after']: posX === 'after',
            ['mat-menu-above']: posY === 'above',
            ['mat-menu-below']: posY === 'below',
        };
        this._changeDetectorRef.markForCheck();
    }
    /** Callback that is invoked when the panel animation completes. */
    _onAnimationDone(state) {
        const isExit = state === EXIT_ANIMATION;
        if (isExit || state === ENTER_ANIMATION) {
            if (isExit) {
                clearTimeout(this._exitFallbackTimeout);
                this._exitFallbackTimeout = undefined;
            }
            this._animationDone.next(isExit ? 'void' : 'enter');
            this._isAnimating.set(false);
        }
    }
    _onAnimationStart(state) {
        if (state === ENTER_ANIMATION || state === EXIT_ANIMATION) {
            this._isAnimating.set(true);
        }
    }
    _setIsOpen(isOpen) {
        this._panelAnimationState = isOpen ? 'enter' : 'void';
        if (isOpen) {
            if (this._keyManager.activeItemIndex === 0) {
                // Scroll the content element to the top as soon as the animation starts. This is necessary,
                // because we move focus to the first item while it's still being animated, which can throw
                // the browser off when it determines the scroll position. Alternatively we can move focus
                // when the animation is done, however moving focus asynchronously will interrupt screen
                // readers which are in the process of reading out the menu already. We take the `element`
                // from the `event` since we can't use a `ViewChild` to access the pane.
                const menuPanel = this._resolvePanel();
                if (menuPanel) {
                    menuPanel.scrollTop = 0;
                }
            }
        }
        else if (!this._animationsDisabled) {
            // Some apps do `* { animation: none !important; }` in tests which will prevent the
            // `animationend` event from firing. Since the exit animation is loading-bearing for
            // removing the content from the DOM, add a fallback timer.
            this._exitFallbackTimeout = setTimeout(() => this._onAnimationDone(EXIT_ANIMATION), 200);
        }
        // Animation events won't fire when animations are disabled so we simulate them.
        if (this._animationsDisabled) {
            setTimeout(() => {
                this._onAnimationDone(isOpen ? ENTER_ANIMATION : EXIT_ANIMATION);
            });
        }
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Sets up a stream that will keep track of any newly-added menu items and will update the list
     * of direct descendants. We collect the descendants this way, because `_allItems` can include
     * items that are part of child menus, and using a custom way of registering items is unreliable
     * when it comes to maintaining the item order.
     */
    _updateDirectDescendants() {
        this._allItems.changes
            .pipe(startWith(this._allItems))
            .subscribe((items) => {
            this._directDescendantItems.reset(items.filter(item => item._parentMenu === this));
            this._directDescendantItems.notifyOnChanges();
        });
    }
    /** Gets the menu panel DOM node. */
    _resolvePanel() {
        let menuPanel = null;
        if (this._directDescendantItems.length) {
            // Because the `mat-menuPanel` is at the DOM insertion point, not inside the overlay, we don't
            // have a nice way of getting a hold of the menuPanel panel. We can't use a `ViewChild` either
            // because the panel is inside an `ng-template`. We work around it by starting from one of
            // the items and walking up the DOM.
            menuPanel = this._directDescendantItems.first._getHostElement().closest('[role="menu"]');
        }
        return menuPanel;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatMenu, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "20.2.0-next.2", type: MatMenu, isStandalone: true, selector: "mat-menu", inputs: { backdropClass: "backdropClass", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], ariaDescribedby: ["aria-describedby", "ariaDescribedby"], xPosition: "xPosition", yPosition: "yPosition", overlapTrigger: ["overlapTrigger", "overlapTrigger", booleanAttribute], hasBackdrop: ["hasBackdrop", "hasBackdrop", (value) => (value == null ? null : booleanAttribute(value))], panelClass: ["class", "panelClass"], classList: "classList" }, outputs: { closed: "closed", close: "close" }, host: { properties: { "attr.aria-label": "null", "attr.aria-labelledby": "null", "attr.aria-describedby": "null" } }, providers: [{ provide: MAT_MENU_PANEL, useExisting: MatMenu }], queries: [{ propertyName: "lazyContent", first: true, predicate: MAT_MENU_CONTENT, descendants: true }, { propertyName: "_allItems", predicate: MatMenuItem, descendants: true }, { propertyName: "items", predicate: MatMenuItem }], viewQueries: [{ propertyName: "templateRef", first: true, predicate: TemplateRef, descendants: true }], exportAs: ["matMenu"], ngImport: i0, template: "<ng-template>\n  <div\n    class=\"mat-mdc-menu-panel\"\n    [id]=\"panelId\"\n    [class]=\"_classList\"\n    [class.mat-menu-panel-animations-disabled]=\"_animationsDisabled\"\n    [class.mat-menu-panel-exit-animation]=\"_panelAnimationState === 'void'\"\n    [class.mat-menu-panel-animating]=\"_isAnimating()\"\n    (click)=\"closed.emit('click')\"\n    tabindex=\"-1\"\n    role=\"menu\"\n    (animationstart)=\"_onAnimationStart($event.animationName)\"\n    (animationend)=\"_onAnimationDone($event.animationName)\"\n    (animationcancel)=\"_onAnimationDone($event.animationName)\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"ariaLabelledby || null\"\n    [attr.aria-describedby]=\"ariaDescribedby || null\">\n    <div class=\"mat-mdc-menu-content\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n", styles: ["mat-menu{display:none}.mat-mdc-menu-content{margin:0;padding:8px 0;outline:0}.mat-mdc-menu-content,.mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;flex:1;white-space:normal;font-family:var(--mat-menu-item-label-text-font, var(--mat-sys-label-large-font));line-height:var(--mat-menu-item-label-text-line-height, var(--mat-sys-label-large-line-height));font-size:var(--mat-menu-item-label-text-size, var(--mat-sys-label-large-size));letter-spacing:var(--mat-menu-item-label-text-tracking, var(--mat-sys-label-large-tracking));font-weight:var(--mat-menu-item-label-text-weight, var(--mat-sys-label-large-weight))}@keyframes _mat-menu-enter{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:none}}@keyframes _mat-menu-exit{from{opacity:1}to{opacity:0}}.mat-mdc-menu-panel{min-width:112px;max-width:280px;overflow:auto;box-sizing:border-box;outline:0;animation:_mat-menu-enter 120ms cubic-bezier(0, 0, 0.2, 1);border-radius:var(--mat-menu-container-shape, var(--mat-sys-corner-extra-small));background-color:var(--mat-menu-container-color, var(--mat-sys-surface-container));box-shadow:var(--mat-menu-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));will-change:transform,opacity}.mat-mdc-menu-panel.mat-menu-panel-exit-animation{animation:_mat-menu-exit 100ms 25ms linear forwards}.mat-mdc-menu-panel.mat-menu-panel-animations-disabled{animation:none}.mat-mdc-menu-panel.mat-menu-panel-animating{pointer-events:none}.mat-mdc-menu-panel.mat-menu-panel-animating:has(.mat-mdc-menu-content:empty){display:none}@media(forced-colors: active){.mat-mdc-menu-panel{outline:solid 1px}}.mat-mdc-menu-panel .mat-divider{color:var(--mat-menu-divider-color, var(--mat-sys-surface-variant));margin-bottom:var(--mat-menu-divider-bottom-spacing, 8px);margin-top:var(--mat-menu-divider-top-spacing, 8px)}.mat-mdc-menu-item{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;cursor:pointer;width:100%;text-align:left;box-sizing:border-box;color:inherit;font-size:inherit;background:none;text-decoration:none;margin:0;min-height:48px;padding-left:var(--mat-menu-item-leading-spacing, 12px);padding-right:var(--mat-menu-item-trailing-spacing, 12px);-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-menu-item::-moz-focus-inner{border:0}[dir=rtl] .mat-mdc-menu-item{padding-left:var(--mat-menu-item-trailing-spacing, 12px);padding-right:var(--mat-menu-item-leading-spacing, 12px)}.mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon]){padding-left:var(--mat-menu-item-with-icon-leading-spacing, 12px);padding-right:var(--mat-menu-item-with-icon-trailing-spacing, 12px)}[dir=rtl] .mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon]){padding-left:var(--mat-menu-item-with-icon-trailing-spacing, 12px);padding-right:var(--mat-menu-item-with-icon-leading-spacing, 12px)}.mat-mdc-menu-item,.mat-mdc-menu-item:visited,.mat-mdc-menu-item:link{color:var(--mat-menu-item-label-text-color, var(--mat-sys-on-surface))}.mat-mdc-menu-item .mat-icon-no-color,.mat-mdc-menu-item .mat-mdc-menu-submenu-icon{color:var(--mat-menu-item-icon-color, var(--mat-sys-on-surface-variant))}.mat-mdc-menu-item[disabled]{cursor:default;opacity:.38}.mat-mdc-menu-item[disabled]::after{display:block;position:absolute;content:\"\";top:0;left:0;bottom:0;right:0}.mat-mdc-menu-item:focus{outline:0}.mat-mdc-menu-item .mat-icon{flex-shrink:0;margin-right:var(--mat-menu-item-spacing, 12px);height:var(--mat-menu-item-icon-size, 24px);width:var(--mat-menu-item-icon-size, 24px)}[dir=rtl] .mat-mdc-menu-item{text-align:right}[dir=rtl] .mat-mdc-menu-item .mat-icon{margin-right:0;margin-left:var(--mat-menu-item-spacing, 12px)}.mat-mdc-menu-item:not([disabled]):hover{background-color:var(--mat-menu-item-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent))}.mat-mdc-menu-item:not([disabled]).cdk-program-focused,.mat-mdc-menu-item:not([disabled]).cdk-keyboard-focused,.mat-mdc-menu-item:not([disabled]).mat-mdc-menu-item-highlighted{background-color:var(--mat-menu-item-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent))}@media(forced-colors: active){.mat-mdc-menu-item{margin-top:1px}}.mat-mdc-menu-submenu-icon{width:var(--mat-menu-item-icon-size, 24px);height:10px;fill:currentColor;padding-left:var(--mat-menu-item-spacing, 12px)}[dir=rtl] .mat-mdc-menu-submenu-icon{padding-right:var(--mat-menu-item-spacing, 12px);padding-left:0}[dir=rtl] .mat-mdc-menu-submenu-icon polygon{transform:scaleX(-1);transform-origin:center}@media(forced-colors: active){.mat-mdc-menu-submenu-icon{fill:CanvasText}}.mat-mdc-menu-item .mat-mdc-menu-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatMenu, decorators: [{
            type: Component,
            args: [{ selector: 'mat-menu', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, exportAs: 'matMenu', host: {
                        '[attr.aria-label]': 'null',
                        '[attr.aria-labelledby]': 'null',
                        '[attr.aria-describedby]': 'null',
                    }, providers: [{ provide: MAT_MENU_PANEL, useExisting: MatMenu }], template: "<ng-template>\n  <div\n    class=\"mat-mdc-menu-panel\"\n    [id]=\"panelId\"\n    [class]=\"_classList\"\n    [class.mat-menu-panel-animations-disabled]=\"_animationsDisabled\"\n    [class.mat-menu-panel-exit-animation]=\"_panelAnimationState === 'void'\"\n    [class.mat-menu-panel-animating]=\"_isAnimating()\"\n    (click)=\"closed.emit('click')\"\n    tabindex=\"-1\"\n    role=\"menu\"\n    (animationstart)=\"_onAnimationStart($event.animationName)\"\n    (animationend)=\"_onAnimationDone($event.animationName)\"\n    (animationcancel)=\"_onAnimationDone($event.animationName)\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"ariaLabelledby || null\"\n    [attr.aria-describedby]=\"ariaDescribedby || null\">\n    <div class=\"mat-mdc-menu-content\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n", styles: ["mat-menu{display:none}.mat-mdc-menu-content{margin:0;padding:8px 0;outline:0}.mat-mdc-menu-content,.mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;flex:1;white-space:normal;font-family:var(--mat-menu-item-label-text-font, var(--mat-sys-label-large-font));line-height:var(--mat-menu-item-label-text-line-height, var(--mat-sys-label-large-line-height));font-size:var(--mat-menu-item-label-text-size, var(--mat-sys-label-large-size));letter-spacing:var(--mat-menu-item-label-text-tracking, var(--mat-sys-label-large-tracking));font-weight:var(--mat-menu-item-label-text-weight, var(--mat-sys-label-large-weight))}@keyframes _mat-menu-enter{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:none}}@keyframes _mat-menu-exit{from{opacity:1}to{opacity:0}}.mat-mdc-menu-panel{min-width:112px;max-width:280px;overflow:auto;box-sizing:border-box;outline:0;animation:_mat-menu-enter 120ms cubic-bezier(0, 0, 0.2, 1);border-radius:var(--mat-menu-container-shape, var(--mat-sys-corner-extra-small));background-color:var(--mat-menu-container-color, var(--mat-sys-surface-container));box-shadow:var(--mat-menu-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));will-change:transform,opacity}.mat-mdc-menu-panel.mat-menu-panel-exit-animation{animation:_mat-menu-exit 100ms 25ms linear forwards}.mat-mdc-menu-panel.mat-menu-panel-animations-disabled{animation:none}.mat-mdc-menu-panel.mat-menu-panel-animating{pointer-events:none}.mat-mdc-menu-panel.mat-menu-panel-animating:has(.mat-mdc-menu-content:empty){display:none}@media(forced-colors: active){.mat-mdc-menu-panel{outline:solid 1px}}.mat-mdc-menu-panel .mat-divider{color:var(--mat-menu-divider-color, var(--mat-sys-surface-variant));margin-bottom:var(--mat-menu-divider-bottom-spacing, 8px);margin-top:var(--mat-menu-divider-top-spacing, 8px)}.mat-mdc-menu-item{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;cursor:pointer;width:100%;text-align:left;box-sizing:border-box;color:inherit;font-size:inherit;background:none;text-decoration:none;margin:0;min-height:48px;padding-left:var(--mat-menu-item-leading-spacing, 12px);padding-right:var(--mat-menu-item-trailing-spacing, 12px);-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-menu-item::-moz-focus-inner{border:0}[dir=rtl] .mat-mdc-menu-item{padding-left:var(--mat-menu-item-trailing-spacing, 12px);padding-right:var(--mat-menu-item-leading-spacing, 12px)}.mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon]){padding-left:var(--mat-menu-item-with-icon-leading-spacing, 12px);padding-right:var(--mat-menu-item-with-icon-trailing-spacing, 12px)}[dir=rtl] .mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon]){padding-left:var(--mat-menu-item-with-icon-trailing-spacing, 12px);padding-right:var(--mat-menu-item-with-icon-leading-spacing, 12px)}.mat-mdc-menu-item,.mat-mdc-menu-item:visited,.mat-mdc-menu-item:link{color:var(--mat-menu-item-label-text-color, var(--mat-sys-on-surface))}.mat-mdc-menu-item .mat-icon-no-color,.mat-mdc-menu-item .mat-mdc-menu-submenu-icon{color:var(--mat-menu-item-icon-color, var(--mat-sys-on-surface-variant))}.mat-mdc-menu-item[disabled]{cursor:default;opacity:.38}.mat-mdc-menu-item[disabled]::after{display:block;position:absolute;content:\"\";top:0;left:0;bottom:0;right:0}.mat-mdc-menu-item:focus{outline:0}.mat-mdc-menu-item .mat-icon{flex-shrink:0;margin-right:var(--mat-menu-item-spacing, 12px);height:var(--mat-menu-item-icon-size, 24px);width:var(--mat-menu-item-icon-size, 24px)}[dir=rtl] .mat-mdc-menu-item{text-align:right}[dir=rtl] .mat-mdc-menu-item .mat-icon{margin-right:0;margin-left:var(--mat-menu-item-spacing, 12px)}.mat-mdc-menu-item:not([disabled]):hover{background-color:var(--mat-menu-item-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent))}.mat-mdc-menu-item:not([disabled]).cdk-program-focused,.mat-mdc-menu-item:not([disabled]).cdk-keyboard-focused,.mat-mdc-menu-item:not([disabled]).mat-mdc-menu-item-highlighted{background-color:var(--mat-menu-item-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent))}@media(forced-colors: active){.mat-mdc-menu-item{margin-top:1px}}.mat-mdc-menu-submenu-icon{width:var(--mat-menu-item-icon-size, 24px);height:10px;fill:currentColor;padding-left:var(--mat-menu-item-spacing, 12px)}[dir=rtl] .mat-mdc-menu-submenu-icon{padding-right:var(--mat-menu-item-spacing, 12px);padding-left:0}[dir=rtl] .mat-mdc-menu-submenu-icon polygon{transform:scaleX(-1);transform-origin:center}@media(forced-colors: active){.mat-mdc-menu-submenu-icon{fill:CanvasText}}.mat-mdc-menu-item .mat-mdc-menu-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}\n"] }]
        }], ctorParameters: () => [], propDecorators: { _allItems: [{
                type: ContentChildren,
                args: [MatMenuItem, { descendants: true }]
            }], backdropClass: [{
                type: Input
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], ariaLabelledby: [{
                type: Input,
                args: ['aria-labelledby']
            }], ariaDescribedby: [{
                type: Input,
                args: ['aria-describedby']
            }], xPosition: [{
                type: Input
            }], yPosition: [{
                type: Input
            }], templateRef: [{
                type: ViewChild,
                args: [TemplateRef]
            }], items: [{
                type: ContentChildren,
                args: [MatMenuItem, { descendants: false }]
            }], lazyContent: [{
                type: ContentChild,
                args: [MAT_MENU_CONTENT]
            }], overlapTrigger: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], hasBackdrop: [{
                type: Input,
                args: [{ transform: (value) => (value == null ? null : booleanAttribute(value)) }]
            }], panelClass: [{
                type: Input,
                args: ['class']
            }], classList: [{
                type: Input
            }], closed: [{
                type: Output
            }], close: [{
                type: Output
            }] } });

/** Injection token that determines the scroll handling while the menu is open. */
const MAT_MENU_SCROLL_STRATEGY = new InjectionToken('mat-menu-scroll-strategy', {
    providedIn: 'root',
    factory: () => {
        const injector = inject(Injector);
        return () => createRepositionScrollStrategy(injector);
    },
});
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
function MAT_MENU_SCROLL_STRATEGY_FACTORY(_overlay) {
    const injector = inject(Injector);
    return () => createRepositionScrollStrategy(injector);
}
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
const MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MAT_MENU_SCROLL_STRATEGY,
    deps: [],
    useFactory: MAT_MENU_SCROLL_STRATEGY_FACTORY,
};
/**
 * Default top padding of the menu panel.
 * @deprecated No longer being used. Will be removed.
 * @breaking-change 15.0.0
 */
const MENU_PANEL_TOP_PADDING = 8;
/** Mapping between menu panels and the last trigger that opened them. */
const PANELS_TO_TRIGGERS = new WeakMap();
/** Directive applied to an element that should trigger a `mat-menu`. */
class MatMenuTriggerBase {
    _canHaveBackdrop;
    _element = inject(ElementRef);
    _viewContainerRef = inject(ViewContainerRef);
    _menuItemInstance = inject(MatMenuItem, { optional: true, self: true });
    _dir = inject(Directionality, { optional: true });
    _focusMonitor = inject(FocusMonitor);
    _ngZone = inject(NgZone);
    _injector = inject(Injector);
    _scrollStrategy = inject(MAT_MENU_SCROLL_STRATEGY);
    _changeDetectorRef = inject(ChangeDetectorRef);
    _animationsDisabled = _animationsDisabled();
    _portal;
    _overlayRef = null;
    _menuOpen = false;
    _closingActionsSubscription = Subscription.EMPTY;
    _menuCloseSubscription = Subscription.EMPTY;
    _pendingRemoval;
    /**
     * We're specifically looking for a `MatMenu` here since the generic `MatMenuPanel`
     * interface lacks some functionality around nested menus and animations.
     */
    _parentMaterialMenu;
    /**
     * Cached value of the padding of the parent menu panel.
     * Used to offset sub-menus to compensate for the padding.
     */
    _parentInnerPadding;
    // Tracking input type is necessary so it's possible to only auto-focus
    // the first item of the list when the menu is opened via the keyboard
    _openedBy = undefined;
    /** Menu currently assigned to the trigger. */
    get _menu() {
        return this._menuInternal;
    }
    set _menu(menu) {
        if (menu === this._menuInternal) {
            return;
        }
        this._menuInternal = menu;
        this._menuCloseSubscription.unsubscribe();
        if (menu) {
            if (menu === this._parentMaterialMenu && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throwMatMenuRecursiveError();
            }
            this._menuCloseSubscription = menu.close.subscribe((reason) => {
                this._destroyMenu(reason);
                // If a click closed the menu, we should close the entire chain of nested menus.
                if ((reason === 'click' || reason === 'tab') && this._parentMaterialMenu) {
                    this._parentMaterialMenu.closed.emit(reason);
                }
            });
        }
        this._menuItemInstance?._setTriggersSubmenu(this._triggersSubmenu());
    }
    _menuInternal;
    constructor(_canHaveBackdrop) {
        this._canHaveBackdrop = _canHaveBackdrop;
        const parentMenu = inject(MAT_MENU_PANEL, { optional: true });
        this._parentMaterialMenu = parentMenu instanceof MatMenu ? parentMenu : undefined;
    }
    ngOnDestroy() {
        if (this._menu && this._ownsMenu(this._menu)) {
            PANELS_TO_TRIGGERS.delete(this._menu);
        }
        this._pendingRemoval?.unsubscribe();
        this._menuCloseSubscription.unsubscribe();
        this._closingActionsSubscription.unsubscribe();
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
    }
    /** Whether the menu is open. */
    get menuOpen() {
        return this._menuOpen;
    }
    /** The text direction of the containing app. */
    get dir() {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    }
    /** Whether the menu triggers a sub-menu or a top-level one. */
    _triggersSubmenu() {
        return !!(this._menuItemInstance && this._parentMaterialMenu && this._menu);
    }
    _closeMenu() {
        this._menu?.close.emit();
    }
    /** Internal method to open menu providing option to auto focus on first item. */
    _openMenu(autoFocus) {
        const menu = this._menu;
        if (this._menuOpen || !menu) {
            return;
        }
        this._pendingRemoval?.unsubscribe();
        const previousTrigger = PANELS_TO_TRIGGERS.get(menu);
        PANELS_TO_TRIGGERS.set(menu, this);
        // If the same menu is currently attached to another trigger,
        // we need to close it so it doesn't end up in a broken state.
        if (previousTrigger && previousTrigger !== this) {
            previousTrigger._closeMenu();
        }
        const overlayRef = this._createOverlay(menu);
        const overlayConfig = overlayRef.getConfig();
        const positionStrategy = overlayConfig.positionStrategy;
        this._setPosition(menu, positionStrategy);
        if (this._canHaveBackdrop) {
            overlayConfig.hasBackdrop =
                menu.hasBackdrop == null ? !this._triggersSubmenu() : menu.hasBackdrop;
        }
        else {
            overlayConfig.hasBackdrop = false;
        }
        // We need the `hasAttached` check for the case where the user kicked off a removal animation,
        // but re-entered the menu. Re-attaching the same portal will trigger an error otherwise.
        if (!overlayRef.hasAttached()) {
            overlayRef.attach(this._getPortal(menu));
            menu.lazyContent?.attach(this.menuData);
        }
        this._closingActionsSubscription = this._menuClosingActions().subscribe(() => this._closeMenu());
        menu.parentMenu = this._triggersSubmenu() ? this._parentMaterialMenu : undefined;
        menu.direction = this.dir;
        if (autoFocus) {
            menu.focusFirstItem(this._openedBy || 'program');
        }
        this._setIsMenuOpen(true);
        if (menu instanceof MatMenu) {
            menu._setIsOpen(true);
            menu._directDescendantItems.changes.pipe(takeUntil(menu.close)).subscribe(() => {
                // Re-adjust the position without locking when the amount of items
                // changes so that the overlay is allowed to pick a new optimal position.
                positionStrategy.withLockedPosition(false).reapplyLastPosition();
                positionStrategy.withLockedPosition(true);
            });
        }
    }
    /**
     * Focuses the menu trigger.
     * @param origin Source of the menu trigger's focus.
     */
    focus(origin, options) {
        if (this._focusMonitor && origin) {
            this._focusMonitor.focusVia(this._element, origin, options);
        }
        else {
            this._element.nativeElement.focus(options);
        }
    }
    /** Closes the menu and does the necessary cleanup. */
    _destroyMenu(reason) {
        const overlayRef = this._overlayRef;
        const menu = this._menu;
        if (!overlayRef || !this.menuOpen) {
            return;
        }
        this._closingActionsSubscription.unsubscribe();
        this._pendingRemoval?.unsubscribe();
        // Note that we don't wait for the animation to finish if another trigger took
        // over the menu, because the panel will end up empty which looks glitchy.
        if (menu instanceof MatMenu && this._ownsMenu(menu)) {
            this._pendingRemoval = menu._animationDone.pipe(take(1)).subscribe(() => {
                overlayRef.detach();
                // Only detach the lazy content if no other trigger took over the menu, otherwise we may
                // detach something we no longer own. Note that we don't use `this._ownsMenu` here,
                // because the current trigger relinquishes ownership as soon as the closing sequence
                // is kicked off whereas the animation takes some time to play out.
                if (!PANELS_TO_TRIGGERS.has(menu)) {
                    menu.lazyContent?.detach();
                }
            });
            menu._setIsOpen(false);
        }
        else {
            overlayRef.detach();
            menu?.lazyContent?.detach();
        }
        if (menu && this._ownsMenu(menu)) {
            PANELS_TO_TRIGGERS.delete(menu);
        }
        // Always restore focus if the user is navigating using the keyboard or the menu was opened
        // programmatically. We don't restore for non-root triggers, because it can prevent focus
        // from making it back to the root trigger when closing a long chain of menus by clicking
        // on the backdrop.
        if (this.restoreFocus &&
            (reason === 'keydown' || !this._openedBy || !this._triggersSubmenu())) {
            this.focus(this._openedBy);
        }
        this._openedBy = undefined;
        this._setIsMenuOpen(false);
    }
    // set state rather than toggle to support triggers sharing a menu
    _setIsMenuOpen(isOpen) {
        if (isOpen !== this._menuOpen) {
            this._menuOpen = isOpen;
            this._menuOpen ? this.menuOpened.emit() : this.menuClosed.emit();
            if (this._triggersSubmenu()) {
                this._menuItemInstance._setHighlighted(isOpen);
            }
            this._changeDetectorRef.markForCheck();
        }
    }
    /**
     * This method creates the overlay from the provided menu's template and saves its
     * OverlayRef so that it can be attached to the DOM when openMenu is called.
     */
    _createOverlay(menu) {
        if (!this._overlayRef) {
            const config = this._getOverlayConfig(menu);
            this._subscribeToPositions(menu, config.positionStrategy);
            this._overlayRef = createOverlayRef(this._injector, config);
            this._overlayRef.keydownEvents().subscribe(event => {
                if (this._menu instanceof MatMenu) {
                    this._menu._handleKeydown(event);
                }
            });
        }
        return this._overlayRef;
    }
    /**
     * This method builds the configuration object needed to create the overlay, the OverlayState.
     * @returns OverlayConfig
     */
    _getOverlayConfig(menu) {
        return new OverlayConfig({
            positionStrategy: createFlexibleConnectedPositionStrategy(this._injector, this._getOverlayOrigin())
                .withLockedPosition()
                .withGrowAfterOpen()
                .withTransformOriginOn('.mat-menu-panel, .mat-mdc-menu-panel'),
            backdropClass: menu.backdropClass || 'cdk-overlay-transparent-backdrop',
            panelClass: menu.overlayPanelClass,
            scrollStrategy: this._scrollStrategy(),
            direction: this._dir || 'ltr',
            disableAnimations: this._animationsDisabled,
        });
    }
    /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the menu based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     */
    _subscribeToPositions(menu, position) {
        if (menu.setPositionClasses) {
            position.positionChanges.subscribe(change => {
                this._ngZone.run(() => {
                    const posX = change.connectionPair.overlayX === 'start' ? 'after' : 'before';
                    const posY = change.connectionPair.overlayY === 'top' ? 'below' : 'above';
                    menu.setPositionClasses(posX, posY);
                });
            });
        }
    }
    /**
     * Sets the appropriate positions on a position strategy
     * so the overlay connects with the trigger correctly.
     * @param positionStrategy Strategy whose position to update.
     */
    _setPosition(menu, positionStrategy) {
        let [originX, originFallbackX] = menu.xPosition === 'before' ? ['end', 'start'] : ['start', 'end'];
        let [overlayY, overlayFallbackY] = menu.yPosition === 'above' ? ['bottom', 'top'] : ['top', 'bottom'];
        let [originY, originFallbackY] = [overlayY, overlayFallbackY];
        let [overlayX, overlayFallbackX] = [originX, originFallbackX];
        let offsetY = 0;
        if (this._triggersSubmenu()) {
            // When the menu is a sub-menu, it should always align itself
            // to the edges of the trigger, instead of overlapping it.
            overlayFallbackX = originX = menu.xPosition === 'before' ? 'start' : 'end';
            originFallbackX = overlayX = originX === 'end' ? 'start' : 'end';
            if (this._parentMaterialMenu) {
                if (this._parentInnerPadding == null) {
                    const firstItem = this._parentMaterialMenu.items.first;
                    this._parentInnerPadding = firstItem ? firstItem._getHostElement().offsetTop : 0;
                }
                offsetY = overlayY === 'bottom' ? this._parentInnerPadding : -this._parentInnerPadding;
            }
        }
        else if (!menu.overlapTrigger) {
            originY = overlayY === 'top' ? 'bottom' : 'top';
            originFallbackY = overlayFallbackY === 'top' ? 'bottom' : 'top';
        }
        positionStrategy.withPositions([
            { originX, originY, overlayX, overlayY, offsetY },
            { originX: originFallbackX, originY, overlayX: overlayFallbackX, overlayY, offsetY },
            {
                originX,
                originY: originFallbackY,
                overlayX,
                overlayY: overlayFallbackY,
                offsetY: -offsetY,
            },
            {
                originX: originFallbackX,
                originY: originFallbackY,
                overlayX: overlayFallbackX,
                overlayY: overlayFallbackY,
                offsetY: -offsetY,
            },
        ]);
    }
    /** Returns a stream that emits whenever an action that should close the menu occurs. */
    _menuClosingActions() {
        const outsideClicks = this._getOutsideClickStream(this._overlayRef);
        const detachments = this._overlayRef.detachments();
        const parentClose = this._parentMaterialMenu ? this._parentMaterialMenu.closed : of();
        const hover = this._parentMaterialMenu
            ? this._parentMaterialMenu
                ._hovered()
                .pipe(filter(active => this._menuOpen && active !== this._menuItemInstance))
            : of();
        return merge(outsideClicks, parentClose, hover, detachments);
    }
    /** Gets the portal that should be attached to the overlay. */
    _getPortal(menu) {
        // Note that we can avoid this check by keeping the portal on the menu panel.
        // While it would be cleaner, we'd have to introduce another required method on
        // `MatMenuPanel`, making it harder to consume.
        if (!this._portal || this._portal.templateRef !== menu.templateRef) {
            this._portal = new TemplatePortal(menu.templateRef, this._viewContainerRef);
        }
        return this._portal;
    }
    /**
     * Determines whether the trigger owns a specific menu panel, at the current point in time.
     * This allows us to distinguish the case where the same panel is passed into multiple triggers
     * and multiple are open at a time.
     */
    _ownsMenu(menu) {
        return PANELS_TO_TRIGGERS.get(menu) === this;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatMenuTriggerBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: MatMenuTriggerBase, isStandalone: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatMenuTriggerBase, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: undefined }] });

/** Directive applied to an element that should trigger a `mat-menu`. */
class MatMenuTrigger extends MatMenuTriggerBase {
    _cleanupTouchstart;
    _hoverSubscription = Subscription.EMPTY;
    /**
     * @deprecated
     * @breaking-change 8.0.0
     */
    get _deprecatedMatMenuTriggerFor() {
        return this.menu;
    }
    set _deprecatedMatMenuTriggerFor(v) {
        this.menu = v;
    }
    /** References the menu instance that the trigger is associated with. */
    get menu() {
        return this._menu;
    }
    set menu(menu) {
        this._menu = menu;
    }
    /** Data to be passed along to any lazily-rendered content. */
    menuData;
    /**
     * Whether focus should be restored when the menu is closed.
     * Note that disabling this option can have accessibility implications
     * and it's up to you to manage focus, if you decide to turn it off.
     */
    restoreFocus = true;
    /** Event emitted when the associated menu is opened. */
    menuOpened = new EventEmitter();
    /**
     * Event emitted when the associated menu is opened.
     * @deprecated Switch to `menuOpened` instead
     * @breaking-change 8.0.0
     */
    // tslint:disable-next-line:no-output-on-prefix
    onMenuOpen = this.menuOpened;
    /** Event emitted when the associated menu is closed. */
    menuClosed = new EventEmitter();
    /**
     * Event emitted when the associated menu is closed.
     * @deprecated Switch to `menuClosed` instead
     * @breaking-change 8.0.0
     */
    // tslint:disable-next-line:no-output-on-prefix
    onMenuClose = this.menuClosed;
    constructor() {
        super(true);
        const renderer = inject(Renderer2);
        this._cleanupTouchstart = renderer.listen(this._element.nativeElement, 'touchstart', (event) => {
            if (!isFakeTouchstartFromScreenReader(event)) {
                this._openedBy = 'touch';
            }
        }, { passive: true });
    }
    /** Whether the menu triggers a sub-menu or a top-level one. */
    triggersSubmenu() {
        return super._triggersSubmenu();
    }
    /** Toggles the menu between the open and closed states. */
    toggleMenu() {
        return this.menuOpen ? this.closeMenu() : this.openMenu();
    }
    /** Opens the menu. */
    openMenu() {
        this._openMenu(true);
    }
    /** Closes the menu. */
    closeMenu() {
        this._closeMenu();
    }
    /**
     * Updates the position of the menu to ensure that it fits all options within the viewport.
     */
    updatePosition() {
        this._overlayRef?.updatePosition();
    }
    ngAfterContentInit() {
        this._handleHover();
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this._cleanupTouchstart();
        this._hoverSubscription.unsubscribe();
    }
    _getOverlayOrigin() {
        return this._element;
    }
    _getOutsideClickStream(overlayRef) {
        return overlayRef.backdropClick();
    }
    /** Handles mouse presses on the trigger. */
    _handleMousedown(event) {
        if (!isFakeMousedownFromScreenReader(event)) {
            // Since right or middle button clicks won't trigger the `click` event,
            // we shouldn't consider the menu as opened by mouse in those cases.
            this._openedBy = event.button === 0 ? 'mouse' : undefined;
            // Since clicking on the trigger won't close the menu if it opens a sub-menu,
            // we should prevent focus from moving onto it via click to avoid the
            // highlight from lingering on the menu item.
            if (this.triggersSubmenu()) {
                event.preventDefault();
            }
        }
    }
    /** Handles key presses on the trigger. */
    _handleKeydown(event) {
        const keyCode = event.keyCode;
        // Pressing enter on the trigger will trigger the click handler later.
        if (keyCode === ENTER || keyCode === SPACE) {
            this._openedBy = 'keyboard';
        }
        if (this.triggersSubmenu() &&
            ((keyCode === RIGHT_ARROW && this.dir === 'ltr') ||
                (keyCode === LEFT_ARROW && this.dir === 'rtl'))) {
            this._openedBy = 'keyboard';
            this.openMenu();
        }
    }
    /** Handles click events on the trigger. */
    _handleClick(event) {
        if (this.triggersSubmenu()) {
            // Stop event propagation to avoid closing the parent menu.
            event.stopPropagation();
            this.openMenu();
        }
        else {
            this.toggleMenu();
        }
    }
    /** Handles the cases where the user hovers over the trigger. */
    _handleHover() {
        // Subscribe to changes in the hovered item in order to toggle the panel.
        if (this.triggersSubmenu() && this._parentMaterialMenu) {
            this._hoverSubscription = this._parentMaterialMenu._hovered().subscribe(active => {
                if (active === this._menuItemInstance &&
                    !active.disabled &&
                    // Ignore hover events if the parent menu is in the process of being closed (see #31956).
                    this._parentMaterialMenu?._panelAnimationState !== 'void') {
                    this._openedBy = 'mouse';
                    // Open the menu, but do NOT auto-focus on first item when just hovering.
                    // When VoiceOver is enabled, this is particularly confusing as the focus will
                    // cause another hover event, and continue opening sub-menus without interaction.
                    this._openMenu(false);
                }
            });
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatMenuTrigger, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: MatMenuTrigger, isStandalone: true, selector: "[mat-menu-trigger-for], [matMenuTriggerFor]", inputs: { _deprecatedMatMenuTriggerFor: ["mat-menu-trigger-for", "_deprecatedMatMenuTriggerFor"], menu: ["matMenuTriggerFor", "menu"], menuData: ["matMenuTriggerData", "menuData"], restoreFocus: ["matMenuTriggerRestoreFocus", "restoreFocus"] }, outputs: { menuOpened: "menuOpened", onMenuOpen: "onMenuOpen", menuClosed: "menuClosed", onMenuClose: "onMenuClose" }, host: { listeners: { "click": "_handleClick($event)", "mousedown": "_handleMousedown($event)", "keydown": "_handleKeydown($event)" }, properties: { "attr.aria-haspopup": "menu ? \"menu\" : null", "attr.aria-expanded": "menuOpen", "attr.aria-controls": "menuOpen ? menu?.panelId : null" }, classAttribute: "mat-mdc-menu-trigger" }, exportAs: ["matMenuTrigger"], usesInheritance: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatMenuTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-menu-trigger-for], [matMenuTriggerFor]',
                    host: {
                        'class': 'mat-mdc-menu-trigger',
                        '[attr.aria-haspopup]': 'menu ? "menu" : null',
                        '[attr.aria-expanded]': 'menuOpen',
                        '[attr.aria-controls]': 'menuOpen ? menu?.panelId : null',
                        '(click)': '_handleClick($event)',
                        '(mousedown)': '_handleMousedown($event)',
                        '(keydown)': '_handleKeydown($event)',
                    },
                    exportAs: 'matMenuTrigger',
                }]
        }], ctorParameters: () => [], propDecorators: { _deprecatedMatMenuTriggerFor: [{
                type: Input,
                args: ['mat-menu-trigger-for']
            }], menu: [{
                type: Input,
                args: ['matMenuTriggerFor']
            }], menuData: [{
                type: Input,
                args: ['matMenuTriggerData']
            }], restoreFocus: [{
                type: Input,
                args: ['matMenuTriggerRestoreFocus']
            }], menuOpened: [{
                type: Output
            }], onMenuOpen: [{
                type: Output
            }], menuClosed: [{
                type: Output
            }], onMenuClose: [{
                type: Output
            }] } });

/**
 * Trigger that opens a menu whenever the user right-clicks within its host element.
 */
class MatContextMenuTrigger extends MatMenuTriggerBase {
    _point = { x: 0, y: 0, initialX: 0, initialY: 0, initialScrollX: 0, initialScrollY: 0 };
    _triggerPressedControl = false;
    _rootNode;
    _document = inject(DOCUMENT);
    _viewportRuler = inject(ViewportRuler);
    _scrollDispatcher = inject(ScrollDispatcher);
    _scrollSubscription;
    /** References the menu instance that the trigger is associated with. */
    get menu() {
        return this._menu;
    }
    set menu(menu) {
        this._menu = menu;
    }
    /** Data to be passed along to any lazily-rendered content. */
    menuData;
    /**
     * Whether focus should be restored when the menu is closed.
     * Note that disabling this option can have accessibility implications
     * and it's up to you to manage focus, if you decide to turn it off.
     */
    restoreFocus = true;
    /** Whether the context menu is disabled. */
    disabled = false;
    /** Event emitted when the associated menu is opened. */
    menuOpened = new EventEmitter();
    /** Event emitted when the associated menu is closed. */
    menuClosed = new EventEmitter();
    constructor() {
        super(false);
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this._scrollSubscription?.unsubscribe();
    }
    /** Handler for `contextmenu` events. */
    _handleContextMenuEvent(event) {
        if (!this.disabled) {
            event.preventDefault();
            // If the menu is already open, only update its position.
            if (this.menuOpen) {
                this._initializePoint(event.clientX, event.clientY);
                this._updatePosition();
            }
            else {
                this._openContextMenu(event);
            }
        }
    }
    _destroyMenu(reason) {
        super._destroyMenu(reason);
        this._scrollSubscription?.unsubscribe();
    }
    _getOverlayOrigin() {
        return this._point;
    }
    _getOutsideClickStream(overlayRef) {
        return overlayRef.outsidePointerEvents().pipe(skipWhile((event, index) => {
            if (event.type === 'contextmenu') {
                // Do not close when attempting to open a context menu within the trigger.
                return this._isWithinMenuOrTrigger(_getEventTarget(event));
            }
            else if (event.type === 'auxclick') {
                // Skip the first `auxclick` since it happens at
                // the same time as the event that opens the menu.
                if (index === 0) {
                    return true;
                }
                // Do not close on `auxclick` within the menu since we want to reposition the menu
                // instead. Note that we have to resolve the clicked element using its position,
                // rather than `event.target`, because the `target` is set to the `body`.
                this._rootNode ??= _getShadowRoot(this._element.nativeElement) || this._document;
                return this._isWithinMenuOrTrigger(this._rootNode.elementFromPoint(event.clientX, event.clientY));
            }
            // Using a mouse, the `contextmenu` event can fire either when pressing the right button
            // or left button + control. Most browsers won't dispatch a `click` event right after
            // a `contextmenu` event triggered by left button + control, but Safari will (see #27832).
            // This closes the menu immediately. To work around it, we check that both the triggering
            // event and the current outside click event both had the control key pressed, and that
            // that this is the first outside click event.
            return this._triggerPressedControl && index === 0 && event.ctrlKey;
        }));
    }
    /** Checks whether an element is within the trigger or the opened overlay. */
    _isWithinMenuOrTrigger(target) {
        if (!target) {
            return false;
        }
        const element = this._element.nativeElement;
        if (target === element || element.contains(target)) {
            return true;
        }
        const overlay = this._overlayRef?.hostElement;
        return overlay === target || !!overlay?.contains(target);
    }
    /** Opens the context menu. */
    _openContextMenu(event) {
        // A context menu can be triggered via a mouse right click or a keyboard shortcut.
        if (event.button === 2) {
            this._openedBy = 'mouse';
        }
        else {
            this._openedBy = event.button === 0 ? 'keyboard' : undefined;
        }
        this._initializePoint(event.clientX, event.clientY);
        this._triggerPressedControl = event.ctrlKey;
        super._openMenu(true);
        this._scrollSubscription?.unsubscribe();
        this._scrollSubscription = this._scrollDispatcher.scrolled(0).subscribe(() => {
            // When passing a point to the connected position strategy, the position
            // won't update as the user is scrolling so we have to do it manually.
            const position = this._viewportRuler.getViewportScrollPosition();
            const point = this._point;
            point.y = point.initialY + (point.initialScrollY - position.top);
            point.x = point.initialX + (point.initialScrollX - position.left);
            this._updatePosition();
        });
    }
    /** Initializes the point representing the origin relative to which the menu will be rendered. */
    _initializePoint(x, y) {
        const scrollPosition = this._viewportRuler.getViewportScrollPosition();
        const point = this._point;
        point.x = point.initialX = x;
        point.y = point.initialY = y;
        point.initialScrollX = scrollPosition.left;
        point.initialScrollY = scrollPosition.top;
    }
    /** Refreshes the position of the overlay. */
    _updatePosition() {
        const overlayRef = this._overlayRef;
        if (overlayRef) {
            const positionStrategy = overlayRef.getConfig()
                .positionStrategy;
            positionStrategy.setOrigin(this._point);
            overlayRef.updatePosition();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatContextMenuTrigger, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "20.2.0-next.2", type: MatContextMenuTrigger, isStandalone: true, selector: "[matContextMenuTriggerFor]", inputs: { menu: ["matContextMenuTriggerFor", "menu"], menuData: ["matContextMenuTriggerData", "menuData"], restoreFocus: ["matContextMenuTriggerRestoreFocus", "restoreFocus"], disabled: ["matContextMenuTriggerDisabled", "disabled", booleanAttribute] }, outputs: { menuOpened: "menuOpened", menuClosed: "menuClosed" }, host: { listeners: { "contextmenu": "_handleContextMenuEvent($event)" }, properties: { "class.mat-context-menu-trigger-disabled": "disabled", "attr.aria-controls": "menuOpen ? menu?.panelId : null" }, classAttribute: "mat-context-menu-trigger" }, exportAs: ["matContextMenuTrigger"], usesInheritance: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatContextMenuTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matContextMenuTriggerFor]',
                    host: {
                        'class': 'mat-context-menu-trigger',
                        '[class.mat-context-menu-trigger-disabled]': 'disabled',
                        '[attr.aria-controls]': 'menuOpen ? menu?.panelId : null',
                        '(contextmenu)': '_handleContextMenuEvent($event)',
                    },
                    exportAs: 'matContextMenuTrigger',
                }]
        }], ctorParameters: () => [], propDecorators: { menu: [{
                type: Input,
                args: [{ alias: 'matContextMenuTriggerFor', required: true }]
            }], menuData: [{
                type: Input,
                args: ['matContextMenuTriggerData']
            }], restoreFocus: [{
                type: Input,
                args: ['matContextMenuTriggerRestoreFocus']
            }], disabled: [{
                type: Input,
                args: [{ alias: 'matContextMenuTriggerDisabled', transform: booleanAttribute }]
            }], menuOpened: [{
                type: Output
            }], menuClosed: [{
                type: Output
            }] } });

class MatMenuModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatMenuModule, imports: [MatRippleModule,
            MatCommonModule,
            OverlayModule,
            MatMenu,
            MatMenuItem,
            MatMenuContent,
            MatMenuTrigger,
            MatContextMenuTrigger], exports: [CdkScrollableModule,
            MatMenu,
            MatCommonModule,
            MatMenuItem,
            MatMenuContent,
            MatMenuTrigger,
            MatContextMenuTrigger] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatMenuModule, providers: [MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [MatRippleModule,
            MatCommonModule,
            OverlayModule, CdkScrollableModule,
            MatCommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        MatRippleModule,
                        MatCommonModule,
                        OverlayModule,
                        MatMenu,
                        MatMenuItem,
                        MatMenuContent,
                        MatMenuTrigger,
                        MatContextMenuTrigger,
                    ],
                    exports: [
                        CdkScrollableModule,
                        MatMenu,
                        MatCommonModule,
                        MatMenuItem,
                        MatMenuContent,
                        MatMenuTrigger,
                        MatContextMenuTrigger,
                    ],
                    providers: [MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });

/**
 * Animations used by the mat-menu component.
 * Animation duration and timing values are based on:
 * https://material.io/guidelines/components/menus.html#menus-usage
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
const matMenuAnimations = {
    // Represents:
    // trigger('transformMenu', [
    //   state(
    //     'void',
    //     style({
    //       opacity: 0,
    //       transform: 'scale(0.8)',
    //     }),
    //   ),
    //   transition(
    //     'void => enter',
    //     animate(
    //       '120ms cubic-bezier(0, 0, 0.2, 1)',
    //       style({
    //         opacity: 1,
    //         transform: 'scale(1)',
    //       }),
    //     ),
    //   ),
    //   transition('* => void', animate('100ms 25ms linear', style({opacity: 0}))),
    // ])
    /**
     * This animation controls the menu panel's entry and exit from the page.
     *
     * When the menu panel is added to the DOM, it scales in and fades in its border.
     *
     * When the menu panel is removed from the DOM, it simply fades out after a brief
     * delay to display the ripple.
     */
    transformMenu: {
        type: 7,
        name: 'transformMenu',
        definitions: [
            {
                type: 0,
                name: 'void',
                styles: { type: 6, styles: { opacity: 0, transform: 'scale(0.8)' }, offset: null },
            },
            {
                type: 1,
                expr: 'void => enter',
                animation: {
                    type: 4,
                    styles: { type: 6, styles: { opacity: 1, transform: 'scale(1)' }, offset: null },
                    timings: '120ms cubic-bezier(0, 0, 0.2, 1)',
                },
                options: null,
            },
            {
                type: 1,
                expr: '* => void',
                animation: {
                    type: 4,
                    styles: { type: 6, styles: { opacity: 0 }, offset: null },
                    timings: '100ms 25ms linear',
                },
                options: null,
            },
        ],
        options: {},
    },
    // Represents:
    // trigger('fadeInItems', [
    //   // TODO(crisbeto): this is inside the `transformMenu`
    //   // now. Remove next time we do breaking changes.
    //   state('showing', style({opacity: 1})),
    //   transition('void => *', [
    //     style({opacity: 0}),
    //     animate('400ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
    //   ]),
    // ])
    /**
     * This animation fades in the background color and content of the menu panel
     * after its containing element is scaled in.
     */
    fadeInItems: {
        type: 7,
        name: 'fadeInItems',
        definitions: [
            {
                type: 0,
                name: 'showing',
                styles: { type: 6, styles: { opacity: 1 }, offset: null },
            },
            {
                type: 1,
                expr: 'void => *',
                animation: [
                    { type: 6, styles: { opacity: 0 }, offset: null },
                    { type: 4, styles: null, timings: '400ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)' },
                ],
                options: null,
            },
        ],
        options: {},
    },
};
/**
 * @deprecated
 * @breaking-change 8.0.0
 * @docs-private
 */
const fadeInItems = matMenuAnimations.fadeInItems;
/**
 * @deprecated
 * @breaking-change 8.0.0
 * @docs-private
 */
const transformMenu = matMenuAnimations.transformMenu;

export { MAT_MENU_CONTENT, MAT_MENU_DEFAULT_OPTIONS, MAT_MENU_PANEL, MAT_MENU_SCROLL_STRATEGY, MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER, MENU_PANEL_TOP_PADDING, MatContextMenuTrigger, MatMenu, MatMenuContent, MatMenuItem, MatMenuModule, MatMenuTrigger, fadeInItems, matMenuAnimations, transformMenu };
//# sourceMappingURL=menu.mjs.map
