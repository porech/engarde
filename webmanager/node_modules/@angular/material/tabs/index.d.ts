import * as i0 from '@angular/core';
import { InjectionToken, TemplateRef, OnInit, OnChanges, OnDestroy, SimpleChanges, QueryList, ElementRef, AfterContentChecked, AfterContentInit, AfterViewInit, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { MatCommonModule } from '../common-module.d.js';
import { CdkPortal, TemplatePortal, CdkPortalOutlet } from '@angular/cdk/portal';
import { Subject, BehaviorSubject } from 'rxjs';
import { FocusKeyManager, FocusableOption, FocusOrigin } from '@angular/cdk/a11y';
import { Direction } from '@angular/cdk/bidi';
import { ThemePalette } from '../palette.d.js';
import { RippleTarget, RippleConfig, RippleGlobalOptions } from '../ripple.d.js';
import '@angular/cdk/platform';

/**
 * Injection token that can be used to reference instances of `MatTabContent`. It serves as
 * alternative token to the actual `MatTabContent` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
declare const MAT_TAB_CONTENT: InjectionToken<MatTabContent>;
/** Decorates the `ng-template` tags and reads out the template from it. */
declare class MatTabContent {
    template: TemplateRef<any>;
    constructor(...args: unknown[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTabContent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatTabContent, "[matTabContent]", never, {}, {}, never, never, true, never>;
}

/**
 * Injection token that can be used to reference instances of `MatTabLabel`. It serves as
 * alternative token to the actual `MatTabLabel` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
declare const MAT_TAB_LABEL: InjectionToken<MatTabLabel>;
/**
 * Used to provide a tab label to a tab without causing a circular dependency.
 * @docs-private
 */
declare const MAT_TAB: InjectionToken<any>;
/** Used to flag tab labels for use with the portal directive */
declare class MatTabLabel extends CdkPortal {
    _closestTab: any;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTabLabel, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatTabLabel, "[mat-tab-label], [matTabLabel]", never, {}, {}, never, never, true, never>;
}

/**
 * Used to provide a tab group to a tab without causing a circular dependency.
 * @docs-private
 */
declare const MAT_TAB_GROUP: InjectionToken<any>;
declare class MatTab implements OnInit, OnChanges, OnDestroy {
    private _viewContainerRef;
    _closestTabGroup: any;
    /** whether the tab is disabled. */
    disabled: boolean;
    /** Content for the tab label given by `<ng-template mat-tab-label>`. */
    get templateLabel(): MatTabLabel;
    set templateLabel(value: MatTabLabel);
    private _templateLabel;
    /**
     * Template provided in the tab content that will be used if present, used to enable lazy-loading
     */
    private _explicitContent;
    /** Template inside the MatTab view that contains an `<ng-content>`. */
    _implicitContent: TemplateRef<any>;
    /** Plain text label for the tab, used when there is no template label. */
    textLabel: string;
    /** Aria label for the tab. */
    ariaLabel: string;
    /**
     * Reference to the element that the tab is labelled by.
     * Will be cleared if `aria-label` is set at the same time.
     */
    ariaLabelledby: string;
    /** Classes to be passed to the tab label inside the mat-tab-header container. */
    labelClass: string | string[];
    /** Classes to be passed to the tab mat-tab-body container. */
    bodyClass: string | string[];
    /**
     * Custom ID for the tab, overriding the auto-generated one by Material.
     * Note that when using this input, it's your responsibility to ensure that the ID is unique.
     */
    id: string | null;
    /** Portal that will be the hosted content of the tab */
    private _contentPortal;
    /** @docs-private */
    get content(): TemplatePortal | null;
    /** Emits whenever the internal state of the tab changes. */
    readonly _stateChanges: Subject<void>;
    /**
     * The relatively indexed position where 0 represents the center, negative is left, and positive
     * represents the right.
     */
    position: number | null;
    /**
     * The initial relatively index origin of the tab if it was created and selected after there
     * was already a selected tab. Provides context of what position the tab should originate from.
     */
    origin: number | null;
    /**
     * Whether the tab is currently active.
     */
    isActive: boolean;
    constructor(...args: unknown[]);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    /**
     * This has been extracted to a util because of TS 4 and VE.
     * View Engine doesn't support property rename inheritance.
     * TS 4.0 doesn't allow properties to override accessors or vice-versa.
     * @docs-private
     */
    private _setTemplateLabelInput;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTab, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatTab, "mat-tab", ["matTab"], { "disabled": { "alias": "disabled"; "required": false; }; "textLabel": { "alias": "label"; "required": false; }; "ariaLabel": { "alias": "aria-label"; "required": false; }; "ariaLabelledby": { "alias": "aria-labelledby"; "required": false; }; "labelClass": { "alias": "labelClass"; "required": false; }; "bodyClass": { "alias": "bodyClass"; "required": false; }; "id": { "alias": "id"; "required": false; }; }, {}, ["templateLabel", "_explicitContent"], ["*"], true, never>;
    static ngAcceptInputType_disabled: unknown;
}

/**
 * Item inside a tab header relative to which the ink bar can be aligned.
 * @docs-private
 */
interface MatInkBarItem extends OnInit, OnDestroy {
    elementRef: ElementRef<HTMLElement>;
    activateInkBar(previousIndicatorClientRect?: DOMRect): void;
    deactivateInkBar(): void;
    fitInkBarToContent: boolean;
}
/**
 * Abstraction around the MDC tab indicator that acts as the tab header's ink bar.
 * @docs-private
 */
declare class MatInkBar {
    private _items;
    /** Item to which the ink bar is aligned currently. */
    private _currentItem;
    constructor(_items: QueryList<MatInkBarItem>);
    /** Hides the ink bar. */
    hide(): void;
    /** Aligns the ink bar to a DOM node. */
    alignToElement(element: HTMLElement): void;
}
declare abstract class InkBarItem implements OnInit, OnDestroy {
    private _elementRef;
    private _inkBarElement;
    private _inkBarContentElement;
    private _fitToContent;
    /** Whether the ink bar should fit to the entire tab or just its content. */
    get fitInkBarToContent(): boolean;
    set fitInkBarToContent(newValue: boolean);
    /** Aligns the ink bar to the current item. */
    activateInkBar(previousIndicatorClientRect?: DOMRect): void;
    /** Removes the ink bar from the current item. */
    deactivateInkBar(): void;
    /** Initializes the foundation. */
    ngOnInit(): void;
    /** Destroys the foundation. */
    ngOnDestroy(): void;
    /** Creates and appends the ink bar element. */
    private _createInkBarElement;
    /**
     * Appends the ink bar to the tab host element or content, depending on whether
     * the ink bar should fit to content.
     */
    private _appendInkBarElement;
    static ɵfac: i0.ɵɵFactoryDeclaration<InkBarItem, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<InkBarItem, never, never, { "fitInkBarToContent": { "alias": "fitInkBarToContent"; "required": false; }; }, {}, never, never, true, never>;
    static ngAcceptInputType_fitInkBarToContent: unknown;
}
/**
 * Interface for a MatInkBar positioner method, defining the positioning and width of the ink
 * bar in a set of tabs.
 */
interface _MatInkBarPositioner {
    (element: HTMLElement): {
        left: string;
        width: string;
    };
}
/**
 * The default positioner function for the MatInkBar.
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
declare function _MAT_INK_BAR_POSITIONER_FACTORY(): _MatInkBarPositioner;
/** Injection token for the MatInkBar's Positioner. */
declare const _MAT_INK_BAR_POSITIONER: InjectionToken<_MatInkBarPositioner>;

/**
 * Used in the `mat-tab-group` view to display tab labels.
 * @docs-private
 */
declare class MatTabLabelWrapper extends InkBarItem {
    elementRef: ElementRef<any>;
    /** Whether the tab is disabled. */
    disabled: boolean;
    /** Sets focus on the wrapper element */
    focus(): void;
    getOffsetLeft(): number;
    getOffsetWidth(): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTabLabelWrapper, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatTabLabelWrapper, "[matTabLabelWrapper]", never, { "disabled": { "alias": "disabled"; "required": false; }; }, {}, never, never, true, never>;
    static ngAcceptInputType_disabled: unknown;
}

/**
 * The directions that scrolling can go in when the header's tabs exceed the header width. 'After'
 * will scroll the header towards the end of the tabs list and 'before' will scroll towards the
 * beginning of the list.
 */
type ScrollDirection = 'after' | 'before';
/** Item inside a paginated tab header. */
type MatPaginatedTabHeaderItem = FocusableOption & {
    elementRef: ElementRef;
};
/**
 * Base class for a tab header that supported pagination.
 * @docs-private
 */
declare abstract class MatPaginatedTabHeader implements AfterContentChecked, AfterContentInit, AfterViewInit, OnDestroy {
    protected _elementRef: ElementRef<HTMLElement>;
    protected _changeDetectorRef: ChangeDetectorRef;
    private _viewportRuler;
    private _dir;
    private _ngZone;
    private _platform;
    private _sharedResizeObserver;
    private _injector;
    private _renderer;
    _animationsDisabled: boolean;
    private _eventCleanups;
    abstract _items: QueryList<MatPaginatedTabHeaderItem>;
    abstract _inkBar: {
        hide: () => void;
        alignToElement: (element: HTMLElement) => void;
    };
    abstract _tabListContainer: ElementRef<HTMLElement>;
    abstract _tabList: ElementRef<HTMLElement>;
    abstract _tabListInner: ElementRef<HTMLElement>;
    abstract _nextPaginator: ElementRef<HTMLElement>;
    abstract _previousPaginator: ElementRef<HTMLElement>;
    /** The distance in pixels that the tab labels should be translated to the left. */
    private _scrollDistance;
    /** Whether the header should scroll to the selected index after the view has been checked. */
    private _selectedIndexChanged;
    /** Emits when the component is destroyed. */
    protected readonly _destroyed: Subject<void>;
    /** Whether the controls for pagination should be displayed */
    _showPaginationControls: boolean;
    /** Whether the tab list can be scrolled more towards the end of the tab label list. */
    _disableScrollAfter: boolean;
    /** Whether the tab list can be scrolled more towards the beginning of the tab label list. */
    _disableScrollBefore: boolean;
    /**
     * The number of tab labels that are displayed on the header. When this changes, the header
     * should re-evaluate the scroll position.
     */
    private _tabLabelCount;
    /** Whether the scroll distance has changed and should be applied after the view is checked. */
    private _scrollDistanceChanged;
    /** Used to manage focus between the tabs. */
    protected _keyManager: FocusKeyManager<MatPaginatedTabHeaderItem> | undefined;
    /** Cached text content of the header. */
    private _currentTextContent;
    /** Stream that will stop the automated scrolling. */
    private _stopScrolling;
    /**
     * Whether pagination should be disabled. This can be used to avoid unnecessary
     * layout recalculations if it's known that pagination won't be required.
     */
    disablePagination: boolean;
    /** The index of the active tab. */
    get selectedIndex(): number;
    set selectedIndex(v: number);
    private _selectedIndex;
    /** Event emitted when the option is selected. */
    readonly selectFocusedIndex: EventEmitter<number>;
    /** Event emitted when a label is focused. */
    readonly indexFocused: EventEmitter<number>;
    constructor(...args: unknown[]);
    /** Called when the user has selected an item via the keyboard. */
    protected abstract _itemSelected(event: KeyboardEvent): void;
    ngAfterViewInit(): void;
    ngAfterContentInit(): void;
    /** Sends any changes that could affect the layout of the items. */
    private _itemsResized;
    ngAfterContentChecked(): void;
    ngOnDestroy(): void;
    /** Handles keyboard events on the header. */
    _handleKeydown(event: KeyboardEvent): void;
    /**
     * Callback for when the MutationObserver detects that the content has changed.
     */
    _onContentChanges(): void;
    /**
     * Updates the view whether pagination should be enabled or not.
     *
     * WARNING: Calling this method can be very costly in terms of performance. It should be called
     * as infrequently as possible from outside of the Tabs component as it causes a reflow of the
     * page.
     */
    updatePagination(): void;
    /** Tracks which element has focus; used for keyboard navigation */
    get focusIndex(): number;
    /** When the focus index is set, we must manually send focus to the correct label */
    set focusIndex(value: number);
    /**
     * Determines if an index is valid.  If the tabs are not ready yet, we assume that the user is
     * providing a valid index and return true.
     */
    _isValidIndex(index: number): boolean;
    /**
     * Sets focus on the HTML element for the label wrapper and scrolls it into the view if
     * scrolling is enabled.
     */
    _setTabFocus(tabIndex: number): void;
    /** The layout direction of the containing app. */
    _getLayoutDirection(): Direction;
    /** Performs the CSS transformation on the tab list that will cause the list to scroll. */
    _updateTabScrollPosition(): void;
    /** Sets the distance in pixels that the tab header should be transformed in the X-axis. */
    get scrollDistance(): number;
    set scrollDistance(value: number);
    /**
     * Moves the tab list in the 'before' or 'after' direction (towards the beginning of the list or
     * the end of the list, respectively). The distance to scroll is computed to be a third of the
     * length of the tab list view window.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _scrollHeader(direction: ScrollDirection): {
        maxScrollDistance: number;
        distance: number;
    };
    /** Handles click events on the pagination arrows. */
    _handlePaginatorClick(direction: ScrollDirection): void;
    /**
     * Moves the tab list such that the desired tab label (marked by index) is moved into view.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _scrollToLabel(labelIndex: number): void;
    /**
     * Evaluate whether the pagination controls should be displayed. If the scroll width of the
     * tab list is wider than the size of the header container, then the pagination controls should
     * be shown.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _checkPaginationEnabled(): void;
    /**
     * Evaluate whether the before and after controls should be enabled or disabled.
     * If the header is at the beginning of the list (scroll distance is equal to 0) then disable the
     * before button. If the header is at the end of the list (scroll distance is equal to the
     * maximum distance we can scroll), then disable the after button.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _checkScrollingControls(): void;
    /**
     * Determines what is the maximum length in pixels that can be set for the scroll distance. This
     * is equal to the difference in width between the tab list container and tab header container.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _getMaxScrollDistance(): number;
    /** Tells the ink-bar to align itself to the current label wrapper */
    _alignInkBarToSelectedTab(): void;
    /** Stops the currently-running paginator interval.  */
    _stopInterval(): void;
    /**
     * Handles the user pressing down on one of the paginators.
     * Starts scrolling the header after a certain amount of time.
     * @param direction In which direction the paginator should be scrolled.
     */
    _handlePaginatorPress(direction: ScrollDirection, mouseEvent?: MouseEvent): void;
    /**
     * Scrolls the header to a given position.
     * @param position Position to which to scroll.
     * @returns Information on the current scroll distance and the maximum.
     */
    private _scrollTo;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatPaginatedTabHeader, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatPaginatedTabHeader, never, never, { "disablePagination": { "alias": "disablePagination"; "required": false; }; "selectedIndex": { "alias": "selectedIndex"; "required": false; }; }, { "selectFocusedIndex": "selectFocusedIndex"; "indexFocused": "indexFocused"; }, never, never, true, never>;
    static ngAcceptInputType_disablePagination: unknown;
    static ngAcceptInputType_selectedIndex: unknown;
}

/**
 * The header of the tab group which displays a list of all the tabs in the tab group. Includes
 * an ink bar that follows the currently selected tab. When the tabs list's width exceeds the
 * width of the header container, then arrows will be displayed to allow the user to scroll
 * left and right across the header.
 * @docs-private
 */
declare class MatTabHeader extends MatPaginatedTabHeader implements AfterContentChecked, AfterContentInit, AfterViewInit, OnDestroy {
    _items: QueryList<MatTabLabelWrapper>;
    _tabListContainer: ElementRef;
    _tabList: ElementRef;
    _tabListInner: ElementRef;
    _nextPaginator: ElementRef<HTMLElement>;
    _previousPaginator: ElementRef<HTMLElement>;
    _inkBar: MatInkBar;
    /** Aria label of the header. */
    ariaLabel: string;
    /** Sets the `aria-labelledby` of the header. */
    ariaLabelledby: string;
    /** Whether the ripple effect is disabled or not. */
    disableRipple: boolean;
    ngAfterContentInit(): void;
    protected _itemSelected(event: KeyboardEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTabHeader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatTabHeader, "mat-tab-header", never, { "ariaLabel": { "alias": "aria-label"; "required": false; }; "ariaLabelledby": { "alias": "aria-labelledby"; "required": false; }; "disableRipple": { "alias": "disableRipple"; "required": false; }; }, {}, ["_items"], ["*"], true, never>;
    static ngAcceptInputType_disableRipple: unknown;
}

/**
 * The portal host directive for the contents of the tab.
 * @docs-private
 */
declare class MatTabBodyPortal extends CdkPortalOutlet implements OnInit, OnDestroy {
    private _host;
    private _ngZone;
    /** Subscription to events for when the tab body begins centering. */
    private _centeringSub;
    /** Subscription to events for when the tab body finishes leaving from center position. */
    private _leavingSub;
    constructor(...args: unknown[]);
    /** Set initial visibility or set up subscription for changing visibility. */
    ngOnInit(): void;
    /** Clean up centering subscription. */
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTabBodyPortal, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatTabBodyPortal, "[matTabBodyHost]", never, {}, {}, never, never, true, never>;
}
/**
 * These position states are used internally as animation states for the tab body. Setting the
 * position state to left, right, or center will transition the tab body from its current
 * position to its respective state. If there is not current position (void, in the case of a new
 * tab body), then there will be no transition animation to its state.
 *
 * In the case of a new tab body that should immediately be centered with an animating transition,
 * then left-origin-center or right-origin-center can be used, which will use left or right as its
 * pseudo-prior state.
 *
 * @deprecated Will stop being exported.
 * @breaking-change 21.0.0
 */
type MatTabBodyPositionState = 'left' | 'center' | 'right';
/**
 * The origin state is an internally used state that is set on a new tab body indicating if it
 * began to the left or right of the prior selected index. For example, if the selected index was
 * set to 1, and a new tab is created and selected at index 2, then the tab body would have an
 * origin of right because its index was greater than the prior selected index.
 *
 * @deprecated No longer being used. Will be removed.
 * @breaking-change 21.0.0
 */
type MatTabBodyOriginState = 'left' | 'right';
/**
 * Wrapper for the contents of a tab.
 * @docs-private
 */
declare class MatTabBody implements OnInit, OnDestroy {
    private _elementRef;
    private _dir;
    private _ngZone;
    private _injector;
    private _renderer;
    private _diAnimationsDisabled;
    private _eventCleanups?;
    private _initialized;
    private _fallbackTimer;
    /** Current position of the tab-body in the tab-group. Zero means that the tab is visible. */
    private _positionIndex;
    /** Subscription to the directionality change observable. */
    private _dirChangeSubscription;
    /** Current position of the body within the tab group. */
    _position: MatTabBodyPositionState;
    /** Previous position of the body. */
    protected _previousPosition: MatTabBodyPositionState | undefined;
    /** Event emitted when the tab begins to animate towards the center as the active tab. */
    readonly _onCentering: EventEmitter<number>;
    /** Event emitted before the centering of the tab begins. */
    readonly _beforeCentering: EventEmitter<boolean>;
    /** Event emitted before the centering of the tab begins. */
    readonly _afterLeavingCenter: EventEmitter<void>;
    /** Event emitted when the tab completes its animation towards the center. */
    readonly _onCentered: EventEmitter<void>;
    /** The portal host inside of this container into which the tab body content will be loaded. */
    _portalHost: MatTabBodyPortal;
    /** Element in which the content is rendered. */
    _contentElement: ElementRef<HTMLElement> | undefined;
    /** The tab body content to display. */
    _content: TemplatePortal;
    /** Duration for the tab's animation. */
    animationDuration: string;
    /** Whether the tab's content should be kept in the DOM while it's off-screen. */
    preserveContent: boolean;
    /** The shifted index position of the tab body, where zero represents the active center tab. */
    set position(position: number);
    constructor(...args: unknown[]);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /** Sets up the transition events. */
    private _bindTransitionEvents;
    /** Called when a transition has started. */
    private _transitionStarted;
    /** Called when a transition is done. */
    private _transitionDone;
    /** Sets the active styling on the tab body based on its current position. */
    _setActiveClass(isActive: boolean): void;
    /** The text direction of the containing app. */
    _getLayoutDirection(): Direction;
    /** Whether the provided position state is considered center, regardless of origin. */
    _isCenterPosition(): boolean;
    /** Computes the position state that will be used for the tab-body animation trigger. */
    private _computePositionAnimationState;
    /** Simulates the body's transition events in an environment where they might not fire. */
    private _simulateTransitionEvents;
    /** Whether animations are disabled for the tab group. */
    private _animationsDisabled;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTabBody, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatTabBody, "mat-tab-body", never, { "_content": { "alias": "content"; "required": false; }; "animationDuration": { "alias": "animationDuration"; "required": false; }; "preserveContent": { "alias": "preserveContent"; "required": false; }; "position": { "alias": "position"; "required": false; }; }, { "_onCentering": "_onCentering"; "_beforeCentering": "_beforeCentering"; "_onCentered": "_onCentered"; }, never, never, true, never>;
}

/** @docs-private */
interface MatTabGroupBaseHeader {
    _alignInkBarToSelectedTab(): void;
    updatePagination(): void;
    focusIndex: number;
}
/** Possible positions for the tab header. */
type MatTabHeaderPosition = 'above' | 'below';
/**
 * Material design tab-group component. Supports basic tab pairs (label + content) and includes
 * animated ink-bar, keyboard navigation, and screen reader.
 * See: https://material.io/design/components/tabs.html
 */
declare class MatTabGroup implements AfterViewInit, AfterContentInit, AfterContentChecked, OnDestroy {
    readonly _elementRef: ElementRef<any>;
    private _changeDetectorRef;
    private _ngZone;
    private _tabsSubscription;
    private _tabLabelSubscription;
    private _tabBodySubscription;
    private _diAnimationsDisabled;
    /**
     * All tabs inside the tab group. This includes tabs that belong to groups that are nested
     * inside the current one. We filter out only the tabs that belong to this group in `_tabs`.
     */
    _allTabs: QueryList<MatTab>;
    _tabBodies: QueryList<MatTabBody> | undefined;
    _tabBodyWrapper: ElementRef;
    _tabHeader: MatTabHeader;
    /** All of the tabs that belong to the group. */
    _tabs: QueryList<MatTab>;
    /** The tab index that should be selected after the content has been checked. */
    private _indexToSelect;
    /** Index of the tab that was focused last. */
    private _lastFocusedTabIndex;
    /** Snapshot of the height of the tab body wrapper before another tab is activated. */
    private _tabBodyWrapperHeight;
    /**
     * Theme color of the tab group. This API is supported in M2 themes only, it
     * has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/tabs/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color: ThemePalette;
    /** Whether the ink bar should fit its width to the size of the tab label content. */
    get fitInkBarToContent(): boolean;
    set fitInkBarToContent(value: boolean);
    private _fitInkBarToContent;
    /** Whether tabs should be stretched to fill the header. */
    stretchTabs: boolean;
    /** Alignment for tabs label. */
    alignTabs: string | null;
    /** Whether the tab group should grow to the size of the active tab. */
    dynamicHeight: boolean;
    /** The index of the active tab. */
    get selectedIndex(): number | null;
    set selectedIndex(value: number);
    private _selectedIndex;
    /** Position of the tab header. */
    headerPosition: MatTabHeaderPosition;
    /** Duration for the tab animation. Will be normalized to milliseconds if no units are set. */
    get animationDuration(): string;
    set animationDuration(value: string | number);
    private _animationDuration;
    /**
     * `tabindex` to be set on the inner element that wraps the tab content. Can be used for improved
     * accessibility when the tab does not have focusable elements or if it has scrollable content.
     * The `tabindex` will be removed automatically for inactive tabs.
     * Read more at https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-2/tabs.html
     */
    get contentTabIndex(): number | null;
    set contentTabIndex(value: number);
    private _contentTabIndex;
    /**
     * Whether pagination should be disabled. This can be used to avoid unnecessary
     * layout recalculations if it's known that pagination won't be required.
     */
    disablePagination: boolean;
    /** Whether ripples in the tab group are disabled. */
    disableRipple: boolean;
    /**
     * By default tabs remove their content from the DOM while it's off-screen.
     * Setting this to `true` will keep it in the DOM which will prevent elements
     * like iframes and videos from reloading next time it comes back into the view.
     */
    preserveContent: boolean;
    /**
     * Theme color of the background of the tab group. This API is supported in M2 themes only, it
     * has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/tabs/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     *
     * @deprecated The background color should be customized through Sass theming APIs.
     * @breaking-change 20.0.0 Remove this input
     */
    get backgroundColor(): ThemePalette;
    set backgroundColor(value: ThemePalette);
    private _backgroundColor;
    /** Aria label of the inner `tablist` of the group. */
    ariaLabel: string;
    /** Sets the `aria-labelledby` of the inner `tablist` of the group. */
    ariaLabelledby: string;
    /** Output to enable support for two-way binding on `[(selectedIndex)]` */
    readonly selectedIndexChange: EventEmitter<number>;
    /** Event emitted when focus has changed within a tab group. */
    readonly focusChange: EventEmitter<MatTabChangeEvent>;
    /** Event emitted when the body animation has completed */
    readonly animationDone: EventEmitter<void>;
    /** Event emitted when the tab selection has changed. */
    readonly selectedTabChange: EventEmitter<MatTabChangeEvent>;
    private _groupId;
    /** Whether the tab group is rendered on the server. */
    protected _isServer: boolean;
    constructor(...args: unknown[]);
    /**
     * After the content is checked, this component knows what tabs have been defined
     * and what the selected index should be. This is where we can know exactly what position
     * each tab should be in according to the new selected index, and additionally we know how
     * a new selected tab should transition in (from the left or right).
     */
    ngAfterContentChecked(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    /** Listens to changes in all of the tabs. */
    private _subscribeToAllTabChanges;
    ngOnDestroy(): void;
    /** Re-aligns the ink bar to the selected tab element. */
    realignInkBar(): void;
    /**
     * Recalculates the tab group's pagination dimensions.
     *
     * WARNING: Calling this method can be very costly in terms of performance. It should be called
     * as infrequently as possible from outside of the Tabs component as it causes a reflow of the
     * page.
     */
    updatePagination(): void;
    /**
     * Sets focus to a particular tab.
     * @param index Index of the tab to be focused.
     */
    focusTab(index: number): void;
    _focusChanged(index: number): void;
    private _createChangeEvent;
    /**
     * Subscribes to changes in the tab labels. This is needed, because the @Input for the label is
     * on the MatTab component, whereas the data binding is inside the MatTabGroup. In order for the
     * binding to be updated, we need to subscribe to changes in it and trigger change detection
     * manually.
     */
    private _subscribeToTabLabels;
    /** Clamps the given index to the bounds of 0 and the tabs length. */
    private _clampTabIndex;
    /** Returns a unique id for each tab label element */
    _getTabLabelId(tab: MatTab, index: number): string;
    /** Returns a unique id for each tab content element */
    _getTabContentId(index: number): string;
    /**
     * Sets the height of the body wrapper to the height of the activating tab if dynamic
     * height property is true.
     */
    _setTabBodyWrapperHeight(tabHeight: number): void;
    /** Removes the height of the tab body wrapper. */
    _removeTabBodyWrapperHeight(): void;
    /** Handle click events, setting new selected index if appropriate. */
    _handleClick(tab: MatTab, tabHeader: MatTabGroupBaseHeader, index: number): void;
    /** Retrieves the tabindex for the tab. */
    _getTabIndex(index: number): number;
    /** Callback for when the focused state of a tab has changed. */
    _tabFocusChanged(focusOrigin: FocusOrigin, index: number): void;
    /**
     * Callback invoked when the centered state of a tab body changes.
     * @param isCenter Whether the tab will be in the center.
     */
    protected _bodyCentered(isCenter: boolean): void;
    protected _animationsDisabled(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTabGroup, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatTabGroup, "mat-tab-group", ["matTabGroup"], { "color": { "alias": "color"; "required": false; }; "fitInkBarToContent": { "alias": "fitInkBarToContent"; "required": false; }; "stretchTabs": { "alias": "mat-stretch-tabs"; "required": false; }; "alignTabs": { "alias": "mat-align-tabs"; "required": false; }; "dynamicHeight": { "alias": "dynamicHeight"; "required": false; }; "selectedIndex": { "alias": "selectedIndex"; "required": false; }; "headerPosition": { "alias": "headerPosition"; "required": false; }; "animationDuration": { "alias": "animationDuration"; "required": false; }; "contentTabIndex": { "alias": "contentTabIndex"; "required": false; }; "disablePagination": { "alias": "disablePagination"; "required": false; }; "disableRipple": { "alias": "disableRipple"; "required": false; }; "preserveContent": { "alias": "preserveContent"; "required": false; }; "backgroundColor": { "alias": "backgroundColor"; "required": false; }; "ariaLabel": { "alias": "aria-label"; "required": false; }; "ariaLabelledby": { "alias": "aria-labelledby"; "required": false; }; }, { "selectedIndexChange": "selectedIndexChange"; "focusChange": "focusChange"; "animationDone": "animationDone"; "selectedTabChange": "selectedTabChange"; }, ["_allTabs"], ["*"], true, never>;
    static ngAcceptInputType_fitInkBarToContent: unknown;
    static ngAcceptInputType_stretchTabs: unknown;
    static ngAcceptInputType_dynamicHeight: unknown;
    static ngAcceptInputType_selectedIndex: unknown;
    static ngAcceptInputType_contentTabIndex: unknown;
    static ngAcceptInputType_disablePagination: unknown;
    static ngAcceptInputType_disableRipple: unknown;
    static ngAcceptInputType_preserveContent: unknown;
}
/** A simple change event emitted on focus or selection changes. */
declare class MatTabChangeEvent {
    /** Index of the currently-selected tab. */
    index: number;
    /** Reference to the currently-selected tab. */
    tab: MatTab;
}

/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
declare class MatTabNav extends MatPaginatedTabHeader implements AfterContentInit, AfterViewInit {
    _focusedItem: i0.WritableSignal<MatPaginatedTabHeaderItem | null>;
    /** Whether the ink bar should fit its width to the size of the tab label content. */
    get fitInkBarToContent(): boolean;
    set fitInkBarToContent(value: boolean);
    _fitInkBarToContent: BehaviorSubject<boolean>;
    /** Whether tabs should be stretched to fill the header. */
    stretchTabs: boolean;
    get animationDuration(): string;
    set animationDuration(value: string | number);
    private _animationDuration;
    /** Query list of all tab links of the tab navigation. */
    _items: QueryList<MatTabLink>;
    /**
     * Theme color of the background of the tab nav. This API is supported in M2 themes only, it
     * has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/tabs/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    get backgroundColor(): ThemePalette;
    set backgroundColor(value: ThemePalette);
    private _backgroundColor;
    /** Whether the ripple effect is disabled or not. */
    get disableRipple(): boolean;
    set disableRipple(value: boolean);
    private _disableRipple;
    /**
     * Theme color of the nav bar. This API is supported in M2 themes only, it has
     * no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/tabs/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color: ThemePalette;
    /**
     * Associated tab panel controlled by the nav bar. If not provided, then the nav bar
     * follows the ARIA link / navigation landmark pattern. If provided, it follows the
     * ARIA tabs design pattern.
     */
    tabPanel?: MatTabNavPanel;
    _tabListContainer: ElementRef;
    _tabList: ElementRef;
    _tabListInner: ElementRef;
    _nextPaginator: ElementRef<HTMLElement>;
    _previousPaginator: ElementRef<HTMLElement>;
    _inkBar: MatInkBar;
    constructor(...args: unknown[]);
    protected _itemSelected(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    /** Notifies the component that the active link has been changed. */
    updateActiveLink(): void;
    _getRole(): string | null;
    _hasFocus(link: MatTabLink): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTabNav, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatTabNav, "[mat-tab-nav-bar]", ["matTabNavBar", "matTabNav"], { "fitInkBarToContent": { "alias": "fitInkBarToContent"; "required": false; }; "stretchTabs": { "alias": "mat-stretch-tabs"; "required": false; }; "animationDuration": { "alias": "animationDuration"; "required": false; }; "backgroundColor": { "alias": "backgroundColor"; "required": false; }; "disableRipple": { "alias": "disableRipple"; "required": false; }; "color": { "alias": "color"; "required": false; }; "tabPanel": { "alias": "tabPanel"; "required": false; }; }, {}, ["_items"], ["*"], true, never>;
    static ngAcceptInputType_fitInkBarToContent: unknown;
    static ngAcceptInputType_stretchTabs: unknown;
    static ngAcceptInputType_disableRipple: unknown;
}
/**
 * Link inside a `mat-tab-nav-bar`.
 */
declare class MatTabLink extends InkBarItem implements AfterViewInit, OnDestroy, RippleTarget, FocusableOption {
    private _tabNavBar;
    elementRef: ElementRef<any>;
    private _focusMonitor;
    private readonly _destroyed;
    /** Whether the tab link is active or not. */
    protected _isActive: boolean;
    protected _tabIndex: i0.Signal<number>;
    /** Whether the link is active. */
    get active(): boolean;
    set active(value: boolean);
    /** Whether the tab link is disabled. */
    disabled: boolean;
    /** Whether ripples are disabled on the tab link. */
    get disableRipple(): boolean;
    set disableRipple(value: boolean);
    private _disableRipple;
    tabIndex: number;
    /**
     * Ripple configuration for ripples that are launched on pointer down. The ripple config
     * is set to the global ripple options since we don't have any configurable options for
     * the tab link ripples.
     * @docs-private
     */
    rippleConfig: RippleConfig & RippleGlobalOptions;
    /**
     * Whether ripples are disabled on interaction.
     * @docs-private
     */
    get rippleDisabled(): boolean;
    /** Unique id for the tab. */
    id: string;
    constructor(...args: unknown[]);
    /** Focuses the tab link. */
    focus(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    _handleFocus(): void;
    _handleKeydown(event: KeyboardEvent): void;
    _getAriaControls(): string | null;
    _getAriaSelected(): string | null;
    _getAriaCurrent(): string | null;
    _getRole(): string | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTabLink, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatTabLink, "[mat-tab-link], [matTabLink]", ["matTabLink"], { "active": { "alias": "active"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "disableRipple": { "alias": "disableRipple"; "required": false; }; "tabIndex": { "alias": "tabIndex"; "required": false; }; "id": { "alias": "id"; "required": false; }; }, {}, never, ["*"], true, never>;
    static ngAcceptInputType_active: unknown;
    static ngAcceptInputType_disabled: unknown;
    static ngAcceptInputType_disableRipple: unknown;
    static ngAcceptInputType_tabIndex: unknown;
}
/**
 * Tab panel component associated with MatTabNav.
 */
declare class MatTabNavPanel {
    /** Unique id for the tab panel. */
    id: string;
    /** Id of the active tab in the nav bar. */
    _activeTabId?: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTabNavPanel, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatTabNavPanel, "mat-tab-nav-panel", ["matTabNavPanel"], { "id": { "alias": "id"; "required": false; }; }, {}, never, ["*"], true, never>;
}

declare class MatTabsModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTabsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatTabsModule, never, [typeof MatCommonModule, typeof MatTabContent, typeof MatTabLabel, typeof MatTab, typeof MatTabGroup, typeof MatTabNav, typeof MatTabNavPanel, typeof MatTabLink], [typeof MatCommonModule, typeof MatTabContent, typeof MatTabLabel, typeof MatTab, typeof MatTabGroup, typeof MatTabNav, typeof MatTabNavPanel, typeof MatTabLink]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatTabsModule>;
}

/** Object that can be used to configure the default options for the tabs module. */
interface MatTabsConfig {
    /** Duration for the tab animation. Must be a valid CSS value (e.g. 600ms). */
    animationDuration?: string;
    /**
     * Whether pagination should be disabled. This can be used to avoid unnecessary
     * layout recalculations if it's known that pagination won't be required.
     */
    disablePagination?: boolean;
    /**
     * Whether the ink bar should fit its width to the size of the tab label content.
     * This only applies to the MDC-based tabs.
     */
    fitInkBarToContent?: boolean;
    /** Whether the tab group should grow to the size of the active tab. */
    dynamicHeight?: boolean;
    /** `tabindex` to be set on the inner element that wraps the tab content. */
    contentTabIndex?: number;
    /**
     * By default tabs remove their content from the DOM while it's off-screen.
     * Setting this to `true` will keep it in the DOM which will prevent elements
     * like iframes and videos from reloading next time it comes back into the view.
     */
    preserveContent?: boolean;
    /** Whether tabs should be stretched to fill the header. */
    stretchTabs?: boolean;
    /** Alignment for the tabs label. */
    alignTabs?: 'start' | 'center' | 'end';
}
/** Injection token that can be used to provide the default options the tabs module. */
declare const MAT_TABS_CONFIG: InjectionToken<MatTabsConfig>;

/**
 * Animations used by the Material tabs.
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0.
 */
declare const matTabsAnimations: {
    readonly translateTab: any;
};

export { MAT_TAB, MAT_TABS_CONFIG, MAT_TAB_CONTENT, MAT_TAB_GROUP, MAT_TAB_LABEL, MatInkBar, MatPaginatedTabHeader, MatTab, MatTabBody, MatTabBodyPortal, MatTabChangeEvent, MatTabContent, MatTabGroup, MatTabHeader, MatTabLabel, MatTabLabelWrapper, MatTabLink, MatTabNav, MatTabNavPanel, MatTabsModule, _MAT_INK_BAR_POSITIONER, _MAT_INK_BAR_POSITIONER_FACTORY, matTabsAnimations };
export type { MatTabBodyOriginState, MatTabBodyPositionState, MatTabGroupBaseHeader, MatTabHeaderPosition, MatTabsConfig, ScrollDirection, _MatInkBarPositioner };
