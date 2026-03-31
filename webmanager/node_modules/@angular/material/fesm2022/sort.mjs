import * as i0 from '@angular/core';
import { InjectionToken, EventEmitter, booleanAttribute, Directive, Optional, Inject, Input, Output, Injectable, SkipSelf, inject, ChangeDetectorRef, ElementRef, signal, Component, ViewEncapsulation, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { FocusMonitor, AriaDescriber } from '@angular/cdk/a11y';
import { SPACE, ENTER } from '@angular/cdk/keycodes';
import { ReplaySubject, Subject, merge } from 'rxjs';
import { _CdkPrivateStyleLoader } from '@angular/cdk/private';
import { _animationsDisabled } from './animation.mjs';
import { _StructuralStylesLoader } from './structural-styles.mjs';
import { MatCommonModule } from './common-module.mjs';
import '@angular/cdk/layout';
import '@angular/cdk/bidi';

/** @docs-private */
function getSortDuplicateSortableIdError(id) {
    return Error(`Cannot have two MatSortables with the same id (${id}).`);
}
/** @docs-private */
function getSortHeaderNotContainedWithinSortError() {
    return Error(`MatSortHeader must be placed within a parent element with the MatSort directive.`);
}
/** @docs-private */
function getSortHeaderMissingIdError() {
    return Error(`MatSortHeader must be provided with a unique id.`);
}
/** @docs-private */
function getSortInvalidDirectionError(direction) {
    return Error(`${direction} is not a valid sort direction ('asc' or 'desc').`);
}

/** Injection token to be used to override the default options for `mat-sort`. */
const MAT_SORT_DEFAULT_OPTIONS = new InjectionToken('MAT_SORT_DEFAULT_OPTIONS');
/** Container for MatSortables to manage the sort state and provide default sort parameters. */
class MatSort {
    _defaultOptions;
    _initializedStream = new ReplaySubject(1);
    /** Collection of all registered sortables that this directive manages. */
    sortables = new Map();
    /** Used to notify any child components listening to state changes. */
    _stateChanges = new Subject();
    /** The id of the most recently sorted MatSortable. */
    active;
    /**
     * The direction to set when an MatSortable is initially sorted.
     * May be overridden by the MatSortable's sort start.
     */
    start = 'asc';
    /** The sort direction of the currently active MatSortable. */
    get direction() {
        return this._direction;
    }
    set direction(direction) {
        if (direction &&
            direction !== 'asc' &&
            direction !== 'desc' &&
            (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw getSortInvalidDirectionError(direction);
        }
        this._direction = direction;
    }
    _direction = '';
    /**
     * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
     * May be overridden by the MatSortable's disable clear input.
     */
    disableClear;
    /** Whether the sortable is disabled. */
    disabled = false;
    /** Event emitted when the user changes either the active sort or sort direction. */
    sortChange = new EventEmitter();
    /** Emits when the paginator is initialized. */
    initialized = this._initializedStream;
    constructor(_defaultOptions) {
        this._defaultOptions = _defaultOptions;
    }
    /**
     * Register function to be used by the contained MatSortables. Adds the MatSortable to the
     * collection of MatSortables.
     */
    register(sortable) {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!sortable.id) {
                throw getSortHeaderMissingIdError();
            }
            if (this.sortables.has(sortable.id)) {
                throw getSortDuplicateSortableIdError(sortable.id);
            }
        }
        this.sortables.set(sortable.id, sortable);
    }
    /**
     * Unregister function to be used by the contained MatSortables. Removes the MatSortable from the
     * collection of contained MatSortables.
     */
    deregister(sortable) {
        this.sortables.delete(sortable.id);
    }
    /** Sets the active sort id and determines the new sort direction. */
    sort(sortable) {
        if (this.active != sortable.id) {
            this.active = sortable.id;
            this.direction = sortable.start ? sortable.start : this.start;
        }
        else {
            this.direction = this.getNextSortDirection(sortable);
        }
        this.sortChange.emit({ active: this.active, direction: this.direction });
    }
    /** Returns the next sort direction of the active sortable, checking for potential overrides. */
    getNextSortDirection(sortable) {
        if (!sortable) {
            return '';
        }
        // Get the sort direction cycle with the potential sortable overrides.
        const disableClear = sortable?.disableClear ?? this.disableClear ?? !!this._defaultOptions?.disableClear;
        let sortDirectionCycle = getSortDirectionCycle(sortable.start || this.start, disableClear);
        // Get and return the next direction in the cycle
        let nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
        if (nextDirectionIndex >= sortDirectionCycle.length) {
            nextDirectionIndex = 0;
        }
        return sortDirectionCycle[nextDirectionIndex];
    }
    ngOnInit() {
        this._initializedStream.next();
    }
    ngOnChanges() {
        this._stateChanges.next();
    }
    ngOnDestroy() {
        this._stateChanges.complete();
        this._initializedStream.complete();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatSort, deps: [{ token: MAT_SORT_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "20.2.0-next.2", type: MatSort, isStandalone: true, selector: "[matSort]", inputs: { active: ["matSortActive", "active"], start: ["matSortStart", "start"], direction: ["matSortDirection", "direction"], disableClear: ["matSortDisableClear", "disableClear", booleanAttribute], disabled: ["matSortDisabled", "disabled", booleanAttribute] }, outputs: { sortChange: "matSortChange" }, host: { classAttribute: "mat-sort" }, exportAs: ["matSort"], usesOnChanges: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatSort, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matSort]',
                    exportAs: 'matSort',
                    host: {
                        'class': 'mat-sort',
                    },
                }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_SORT_DEFAULT_OPTIONS]
                }] }], propDecorators: { active: [{
                type: Input,
                args: ['matSortActive']
            }], start: [{
                type: Input,
                args: ['matSortStart']
            }], direction: [{
                type: Input,
                args: ['matSortDirection']
            }], disableClear: [{
                type: Input,
                args: [{ alias: 'matSortDisableClear', transform: booleanAttribute }]
            }], disabled: [{
                type: Input,
                args: [{ alias: 'matSortDisabled', transform: booleanAttribute }]
            }], sortChange: [{
                type: Output,
                args: ['matSortChange']
            }] } });
/** Returns the sort direction cycle to use given the provided parameters of order and clear. */
function getSortDirectionCycle(start, disableClear) {
    let sortOrder = ['asc', 'desc'];
    if (start == 'desc') {
        sortOrder.reverse();
    }
    if (!disableClear) {
        sortOrder.push('');
    }
    return sortOrder;
}

/**
 * To modify the labels and text displayed, create a new instance of MatSortHeaderIntl and
 * include it in a custom provider.
 */
class MatSortHeaderIntl {
    /**
     * Stream that emits whenever the labels here are changed. Use this to notify
     * components if the labels have changed after initialization.
     */
    changes = new Subject();
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatSortHeaderIntl, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatSortHeaderIntl, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatSortHeaderIntl, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
function MAT_SORT_HEADER_INTL_PROVIDER_FACTORY(parentIntl) {
    return parentIntl || new MatSortHeaderIntl();
}
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
const MAT_SORT_HEADER_INTL_PROVIDER = {
    // If there is already an MatSortHeaderIntl available, use that. Otherwise, provide a new one.
    provide: MatSortHeaderIntl,
    deps: [[new Optional(), new SkipSelf(), MatSortHeaderIntl]],
    useFactory: MAT_SORT_HEADER_INTL_PROVIDER_FACTORY,
};

/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent MatSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
class MatSortHeader {
    _intl = inject(MatSortHeaderIntl);
    _sort = inject(MatSort, { optional: true });
    _columnDef = inject('MAT_SORT_HEADER_COLUMN_DEF', {
        optional: true,
    });
    _changeDetectorRef = inject(ChangeDetectorRef);
    _focusMonitor = inject(FocusMonitor);
    _elementRef = inject(ElementRef);
    _ariaDescriber = inject(AriaDescriber, { optional: true });
    _renderChanges;
    _animationsDisabled = _animationsDisabled();
    /**
     * Indicates which state was just cleared from the sort header.
     * Will be reset on the next interaction. Used for coordinating animations.
     */
    _recentlyCleared = signal(null, ...(ngDevMode ? [{ debugName: "_recentlyCleared" }] : []));
    /**
     * The element with role="button" inside this component's view. We need this
     * in order to apply a description with AriaDescriber.
     */
    _sortButton;
    /**
     * ID of this sort header. If used within the context of a CdkColumnDef, this will default to
     * the column's name.
     */
    id;
    /** Sets the position of the arrow that displays when sorted. */
    arrowPosition = 'after';
    /** Overrides the sort start value of the containing MatSort for this MatSortable. */
    start;
    /** whether the sort header is disabled. */
    disabled = false;
    /**
     * Description applied to MatSortHeader's button element with aria-describedby. This text should
     * describe the action that will occur when the user clicks the sort header.
     */
    get sortActionDescription() {
        return this._sortActionDescription;
    }
    set sortActionDescription(value) {
        this._updateSortActionDescription(value);
    }
    // Default the action description to "Sort" because it's better than nothing.
    // Without a description, the button's label comes from the sort header text content,
    // which doesn't give any indication that it performs a sorting operation.
    _sortActionDescription = 'Sort';
    /** Overrides the disable clear value of the containing MatSort for this MatSortable. */
    disableClear;
    constructor() {
        inject(_CdkPrivateStyleLoader).load(_StructuralStylesLoader);
        const defaultOptions = inject(MAT_SORT_DEFAULT_OPTIONS, {
            optional: true,
        });
        // Note that we use a string token for the `_columnDef`, because the value is provided both by
        // `material/table` and `cdk/table` and we can't have the CDK depending on Material,
        // and we want to avoid having the sort header depending on the CDK table because
        // of this single reference.
        if (!this._sort && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw getSortHeaderNotContainedWithinSortError();
        }
        if (defaultOptions?.arrowPosition) {
            this.arrowPosition = defaultOptions?.arrowPosition;
        }
    }
    ngOnInit() {
        if (!this.id && this._columnDef) {
            this.id = this._columnDef.name;
        }
        this._sort.register(this);
        this._renderChanges = merge(this._sort._stateChanges, this._sort.sortChange).subscribe(() => this._changeDetectorRef.markForCheck());
        this._sortButton = this._elementRef.nativeElement.querySelector('.mat-sort-header-container');
        this._updateSortActionDescription(this._sortActionDescription);
    }
    ngAfterViewInit() {
        // We use the focus monitor because we also want to style
        // things differently based on the focus origin.
        this._focusMonitor.monitor(this._elementRef, true).subscribe(() => {
            // We need the delay here, because we can trigger a signal write error if the header
            // has a signal bound to `disabled` which causes it to be blurred (see #31723.)
            Promise.resolve().then(() => this._recentlyCleared.set(null));
        });
    }
    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef);
        this._sort.deregister(this);
        this._renderChanges?.unsubscribe();
        if (this._sortButton) {
            this._ariaDescriber?.removeDescription(this._sortButton, this._sortActionDescription);
        }
    }
    /** Triggers the sort on this sort header and removes the indicator hint. */
    _toggleOnInteraction() {
        if (!this._isDisabled()) {
            const wasSorted = this._isSorted();
            const prevDirection = this._sort.direction;
            this._sort.sort(this);
            this._recentlyCleared.set(wasSorted && !this._isSorted() ? prevDirection : null);
        }
    }
    _handleKeydown(event) {
        if (event.keyCode === SPACE || event.keyCode === ENTER) {
            event.preventDefault();
            this._toggleOnInteraction();
        }
    }
    /** Whether this MatSortHeader is currently sorted in either ascending or descending order. */
    _isSorted() {
        return (this._sort.active == this.id &&
            (this._sort.direction === 'asc' || this._sort.direction === 'desc'));
    }
    _isDisabled() {
        return this._sort.disabled || this.disabled;
    }
    /**
     * Gets the aria-sort attribute that should be applied to this sort header. If this header
     * is not sorted, returns null so that the attribute is removed from the host element. Aria spec
     * says that the aria-sort property should only be present on one header at a time, so removing
     * ensures this is true.
     */
    _getAriaSortAttribute() {
        if (!this._isSorted()) {
            return 'none';
        }
        return this._sort.direction == 'asc' ? 'ascending' : 'descending';
    }
    /** Whether the arrow inside the sort header should be rendered. */
    _renderArrow() {
        return !this._isDisabled() || this._isSorted();
    }
    _updateSortActionDescription(newDescription) {
        // We use AriaDescriber for the sort button instead of setting an `aria-label` because some
        // screen readers (notably VoiceOver) will read both the column header *and* the button's label
        // for every *cell* in the table, creating a lot of unnecessary noise.
        // If _sortButton is undefined, the component hasn't been initialized yet so there's
        // nothing to update in the DOM.
        if (this._sortButton) {
            // removeDescription will no-op if there is no existing message.
            // TODO(jelbourn): remove optional chaining when AriaDescriber is required.
            this._ariaDescriber?.removeDescription(this._sortButton, this._sortActionDescription);
            this._ariaDescriber?.describe(this._sortButton, newDescription);
        }
        this._sortActionDescription = newDescription;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatSortHeader, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.0-next.2", type: MatSortHeader, isStandalone: true, selector: "[mat-sort-header]", inputs: { id: ["mat-sort-header", "id"], arrowPosition: "arrowPosition", start: "start", disabled: ["disabled", "disabled", booleanAttribute], sortActionDescription: "sortActionDescription", disableClear: ["disableClear", "disableClear", booleanAttribute] }, host: { listeners: { "click": "_toggleOnInteraction()", "keydown": "_handleKeydown($event)", "mouseleave": "_recentlyCleared.set(null)" }, properties: { "attr.aria-sort": "_getAriaSortAttribute()", "class.mat-sort-header-disabled": "_isDisabled()" }, classAttribute: "mat-sort-header" }, exportAs: ["matSortHeader"], ngImport: i0, template: "<!--\n  We set the `tabindex` on an element inside the table header, rather than the header itself,\n  because of a bug in NVDA where having a `tabindex` on a `th` breaks keyboard navigation in the\n  table (see https://github.com/nvaccess/nvda/issues/7718). This allows for the header to both\n  be focusable, and have screen readers read out its `aria-sort` state. We prefer this approach\n  over having a button with an `aria-label` inside the header, because the button's `aria-label`\n  will be read out as the user is navigating the table's cell (see #13012).\n\n  The approach is based off of: https://dequeuniversity.com/library/aria/tables/sf-sortable-grid\n-->\n<div class=\"mat-sort-header-container mat-focus-indicator\"\n     [class.mat-sort-header-sorted]=\"_isSorted()\"\n     [class.mat-sort-header-position-before]=\"arrowPosition === 'before'\"\n     [class.mat-sort-header-descending]=\"_sort.direction === 'desc'\"\n     [class.mat-sort-header-ascending]=\"_sort.direction === 'asc'\"\n     [class.mat-sort-header-recently-cleared-ascending]=\"_recentlyCleared() === 'asc'\"\n     [class.mat-sort-header-recently-cleared-descending]=\"_recentlyCleared() === 'desc'\"\n     [class.mat-sort-header-animations-disabled]=\"_animationsDisabled\"\n     [attr.tabindex]=\"_isDisabled() ? null : 0\"\n     [attr.role]=\"_isDisabled() ? null : 'button'\">\n\n  <!--\n    TODO(crisbeto): this div isn't strictly necessary, but we have to keep it due to a large\n    number of screenshot diff failures. It should be removed eventually. Note that the difference\n    isn't visible with a shorter header, but once it breaks up into multiple lines, this element\n    causes it to be center-aligned, whereas removing it will keep the text to the left.\n  -->\n  <div class=\"mat-sort-header-content\">\n    <ng-content></ng-content>\n  </div>\n\n  <!-- Disable animations while a current animation is running -->\n  @if (_renderArrow()) {\n    <div class=\"mat-sort-header-arrow\">\n      <svg viewBox=\"0 -960 960 960\" focusable=\"false\" aria-hidden=\"true\">\n        <path d=\"M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z\"/>\n      </svg>\n    </div>\n  }\n</div>\n", styles: [".mat-sort-header{cursor:pointer}.mat-sort-header-disabled{cursor:default}.mat-sort-header-container{display:flex;align-items:center;letter-spacing:normal;outline:0}[mat-sort-header].cdk-keyboard-focused .mat-sort-header-container,[mat-sort-header].cdk-program-focused .mat-sort-header-container{border-bottom:solid 1px currentColor}.mat-sort-header-container::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-sort-header-content{display:flex;align-items:center}.mat-sort-header-position-before{flex-direction:row-reverse}@keyframes _mat-sort-header-recently-cleared-ascending{from{transform:translateY(0);opacity:1}to{transform:translateY(-25%);opacity:0}}@keyframes _mat-sort-header-recently-cleared-descending{from{transform:translateY(0) rotate(180deg);opacity:1}to{transform:translateY(25%) rotate(180deg);opacity:0}}.mat-sort-header-arrow{height:12px;width:12px;position:relative;transition:transform 225ms cubic-bezier(0.4, 0, 0.2, 1),opacity 225ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0;overflow:visible;color:var(--mat-sort-arrow-color, var(--mat-sys-on-surface))}.mat-sort-header.cdk-keyboard-focused .mat-sort-header-arrow,.mat-sort-header.cdk-program-focused .mat-sort-header-arrow,.mat-sort-header:hover .mat-sort-header-arrow{opacity:.54}.mat-sort-header .mat-sort-header-sorted .mat-sort-header-arrow{opacity:1}.mat-sort-header-descending .mat-sort-header-arrow{transform:rotate(180deg)}.mat-sort-header-recently-cleared-ascending .mat-sort-header-arrow{transform:translateY(-25%)}.mat-sort-header-recently-cleared-ascending .mat-sort-header-arrow{transition:none;animation:_mat-sort-header-recently-cleared-ascending 225ms cubic-bezier(0.4, 0, 0.2, 1) forwards}.mat-sort-header-recently-cleared-descending .mat-sort-header-arrow{transition:none;animation:_mat-sort-header-recently-cleared-descending 225ms cubic-bezier(0.4, 0, 0.2, 1) forwards}.mat-sort-header-animations-disabled .mat-sort-header-arrow{transition-duration:0ms;animation-duration:0ms}.mat-sort-header-arrow svg{width:24px;height:24px;fill:currentColor;position:absolute;top:50%;left:50%;margin:-12px 0 0 -12px;transform:translateZ(0)}.mat-sort-header-arrow,[dir=rtl] .mat-sort-header-position-before .mat-sort-header-arrow{margin:0 0 0 6px}.mat-sort-header-position-before .mat-sort-header-arrow,[dir=rtl] .mat-sort-header-arrow{margin:0 6px 0 0}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatSortHeader, decorators: [{
            type: Component,
            args: [{ selector: '[mat-sort-header]', exportAs: 'matSortHeader', host: {
                        'class': 'mat-sort-header',
                        '(click)': '_toggleOnInteraction()',
                        '(keydown)': '_handleKeydown($event)',
                        '(mouseleave)': '_recentlyCleared.set(null)',
                        '[attr.aria-sort]': '_getAriaSortAttribute()',
                        '[class.mat-sort-header-disabled]': '_isDisabled()',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<!--\n  We set the `tabindex` on an element inside the table header, rather than the header itself,\n  because of a bug in NVDA where having a `tabindex` on a `th` breaks keyboard navigation in the\n  table (see https://github.com/nvaccess/nvda/issues/7718). This allows for the header to both\n  be focusable, and have screen readers read out its `aria-sort` state. We prefer this approach\n  over having a button with an `aria-label` inside the header, because the button's `aria-label`\n  will be read out as the user is navigating the table's cell (see #13012).\n\n  The approach is based off of: https://dequeuniversity.com/library/aria/tables/sf-sortable-grid\n-->\n<div class=\"mat-sort-header-container mat-focus-indicator\"\n     [class.mat-sort-header-sorted]=\"_isSorted()\"\n     [class.mat-sort-header-position-before]=\"arrowPosition === 'before'\"\n     [class.mat-sort-header-descending]=\"_sort.direction === 'desc'\"\n     [class.mat-sort-header-ascending]=\"_sort.direction === 'asc'\"\n     [class.mat-sort-header-recently-cleared-ascending]=\"_recentlyCleared() === 'asc'\"\n     [class.mat-sort-header-recently-cleared-descending]=\"_recentlyCleared() === 'desc'\"\n     [class.mat-sort-header-animations-disabled]=\"_animationsDisabled\"\n     [attr.tabindex]=\"_isDisabled() ? null : 0\"\n     [attr.role]=\"_isDisabled() ? null : 'button'\">\n\n  <!--\n    TODO(crisbeto): this div isn't strictly necessary, but we have to keep it due to a large\n    number of screenshot diff failures. It should be removed eventually. Note that the difference\n    isn't visible with a shorter header, but once it breaks up into multiple lines, this element\n    causes it to be center-aligned, whereas removing it will keep the text to the left.\n  -->\n  <div class=\"mat-sort-header-content\">\n    <ng-content></ng-content>\n  </div>\n\n  <!-- Disable animations while a current animation is running -->\n  @if (_renderArrow()) {\n    <div class=\"mat-sort-header-arrow\">\n      <svg viewBox=\"0 -960 960 960\" focusable=\"false\" aria-hidden=\"true\">\n        <path d=\"M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z\"/>\n      </svg>\n    </div>\n  }\n</div>\n", styles: [".mat-sort-header{cursor:pointer}.mat-sort-header-disabled{cursor:default}.mat-sort-header-container{display:flex;align-items:center;letter-spacing:normal;outline:0}[mat-sort-header].cdk-keyboard-focused .mat-sort-header-container,[mat-sort-header].cdk-program-focused .mat-sort-header-container{border-bottom:solid 1px currentColor}.mat-sort-header-container::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-sort-header-content{display:flex;align-items:center}.mat-sort-header-position-before{flex-direction:row-reverse}@keyframes _mat-sort-header-recently-cleared-ascending{from{transform:translateY(0);opacity:1}to{transform:translateY(-25%);opacity:0}}@keyframes _mat-sort-header-recently-cleared-descending{from{transform:translateY(0) rotate(180deg);opacity:1}to{transform:translateY(25%) rotate(180deg);opacity:0}}.mat-sort-header-arrow{height:12px;width:12px;position:relative;transition:transform 225ms cubic-bezier(0.4, 0, 0.2, 1),opacity 225ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0;overflow:visible;color:var(--mat-sort-arrow-color, var(--mat-sys-on-surface))}.mat-sort-header.cdk-keyboard-focused .mat-sort-header-arrow,.mat-sort-header.cdk-program-focused .mat-sort-header-arrow,.mat-sort-header:hover .mat-sort-header-arrow{opacity:.54}.mat-sort-header .mat-sort-header-sorted .mat-sort-header-arrow{opacity:1}.mat-sort-header-descending .mat-sort-header-arrow{transform:rotate(180deg)}.mat-sort-header-recently-cleared-ascending .mat-sort-header-arrow{transform:translateY(-25%)}.mat-sort-header-recently-cleared-ascending .mat-sort-header-arrow{transition:none;animation:_mat-sort-header-recently-cleared-ascending 225ms cubic-bezier(0.4, 0, 0.2, 1) forwards}.mat-sort-header-recently-cleared-descending .mat-sort-header-arrow{transition:none;animation:_mat-sort-header-recently-cleared-descending 225ms cubic-bezier(0.4, 0, 0.2, 1) forwards}.mat-sort-header-animations-disabled .mat-sort-header-arrow{transition-duration:0ms;animation-duration:0ms}.mat-sort-header-arrow svg{width:24px;height:24px;fill:currentColor;position:absolute;top:50%;left:50%;margin:-12px 0 0 -12px;transform:translateZ(0)}.mat-sort-header-arrow,[dir=rtl] .mat-sort-header-position-before .mat-sort-header-arrow{margin:0 0 0 6px}.mat-sort-header-position-before .mat-sort-header-arrow,[dir=rtl] .mat-sort-header-arrow{margin:0 6px 0 0}\n"] }]
        }], ctorParameters: () => [], propDecorators: { id: [{
                type: Input,
                args: ['mat-sort-header']
            }], arrowPosition: [{
                type: Input
            }], start: [{
                type: Input
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], sortActionDescription: [{
                type: Input
            }], disableClear: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });

class MatSortModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatSortModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatSortModule, imports: [MatCommonModule, MatSort, MatSortHeader], exports: [MatSort, MatSortHeader] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatSortModule, providers: [MAT_SORT_HEADER_INTL_PROVIDER], imports: [MatCommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatSortModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule, MatSort, MatSortHeader],
                    exports: [MatSort, MatSortHeader],
                    providers: [MAT_SORT_HEADER_INTL_PROVIDER],
                }]
        }] });

/**
 * Animations used by MatSort.
 * @docs-private
 * @deprecated No longer being used, to be removed.
 * @breaking-change 21.0.0
 */
const matSortAnimations = {
    // Represents:
    // trigger('indicator', [
    //   state('active-asc, asc', style({transform: 'translateY(0px)'})),
    //   // 10px is the height of the sort indicator, minus the width of the pointers
    //   state('active-desc, desc', style({transform: 'translateY(10px)'})),
    //   transition('active-asc <=> active-desc', animate(SORT_ANIMATION_TRANSITION)),
    // ])
    /** Animation that moves the sort indicator. */
    indicator: {
        type: 7,
        name: 'indicator',
        definitions: [
            {
                type: 0,
                name: 'active-asc, asc',
                styles: { type: 6, styles: { transform: 'translateY(0px)' }, offset: null },
            },
            {
                type: 0,
                name: 'active-desc, desc',
                styles: { type: 6, styles: { transform: 'translateY(10px)' }, offset: null },
            },
            {
                type: 1,
                expr: 'active-asc <=> active-desc',
                animation: { type: 4, styles: null, timings: '225ms cubic-bezier(0.4,0.0,0.2,1)' },
                options: null,
            },
        ],
        options: {},
    },
    // Represents:
    // trigger('leftPointer', [
    //   state('active-asc, asc', style({transform: 'rotate(-45deg)'})),
    //   state('active-desc, desc', style({transform: 'rotate(45deg)'})),
    //   transition('active-asc <=> active-desc', animate(SORT_ANIMATION_TRANSITION)),
    // ])
    /** Animation that rotates the left pointer of the indicator based on the sorting direction. */
    leftPointer: {
        type: 7,
        name: 'leftPointer',
        definitions: [
            {
                type: 0,
                name: 'active-asc, asc',
                styles: { type: 6, styles: { transform: 'rotate(-45deg)' }, offset: null },
            },
            {
                type: 0,
                name: 'active-desc, desc',
                styles: { type: 6, styles: { transform: 'rotate(45deg)' }, offset: null },
            },
            {
                type: 1,
                expr: 'active-asc <=> active-desc',
                animation: { type: 4, styles: null, timings: '225ms cubic-bezier(0.4,0.0,0.2,1)' },
                options: null,
            },
        ],
        options: {},
    },
    // Represents:
    // trigger('rightPointer', [
    //   state('active-asc, asc', style({transform: 'rotate(45deg)'})),
    //   state('active-desc, desc', style({transform: 'rotate(-45deg)'})),
    //   transition('active-asc <=> active-desc', animate(SORT_ANIMATION_TRANSITION)),
    // ])
    /** Animation that rotates the right pointer of the indicator based on the sorting direction. */
    rightPointer: {
        type: 7,
        name: 'rightPointer',
        definitions: [
            {
                type: 0,
                name: 'active-asc, asc',
                styles: { type: 6, styles: { transform: 'rotate(45deg)' }, offset: null },
            },
            {
                type: 0,
                name: 'active-desc, desc',
                styles: { type: 6, styles: { transform: 'rotate(-45deg)' }, offset: null },
            },
            {
                type: 1,
                expr: 'active-asc <=> active-desc',
                animation: { type: 4, styles: null, timings: '225ms cubic-bezier(0.4,0.0,0.2,1)' },
                options: null,
            },
        ],
        options: {},
    },
    // Represents:
    // trigger('arrowOpacity', [
    //   state('desc-to-active, asc-to-active, active', style({opacity: 1})),
    //   state('desc-to-hint, asc-to-hint, hint', style({opacity: 0.54})),
    //   state(
    //     'hint-to-desc, active-to-desc, desc, hint-to-asc, active-to-asc, asc, void',
    //     style({opacity: 0}),
    //   ),
    //   // Transition between all states except for immediate transitions
    //   transition('* => asc, * => desc, * => active, * => hint, * => void', animate('0ms')),
    //   transition('* <=> *', animate(SORT_ANIMATION_TRANSITION)),
    // ])
    /** Animation that controls the arrow opacity. */
    arrowOpacity: {
        type: 7,
        name: 'arrowOpacity',
        definitions: [
            {
                type: 0,
                name: 'desc-to-active, asc-to-active, active',
                styles: { type: 6, styles: { 'opacity': 1 }, offset: null },
            },
            {
                type: 0,
                name: 'desc-to-hint, asc-to-hint, hint',
                styles: { type: 6, styles: { 'opacity': 0.54 }, offset: null },
            },
            {
                type: 0,
                name: 'hint-to-desc, active-to-desc, desc, hint-to-asc, active-to-asc, asc, void',
                styles: { type: 6, styles: { 'opacity': 0 }, offset: null },
            },
            {
                type: 1,
                expr: '* => asc, * => desc, * => active, * => hint, * => void',
                animation: { type: 4, styles: null, timings: '0ms' },
                options: null,
            },
            {
                type: 1,
                expr: '* <=> *',
                animation: { type: 4, styles: null, timings: '225ms cubic-bezier(0.4,0.0,0.2,1)' },
                options: null,
            },
        ],
        options: {},
    },
    // Represents:
    // trigger('arrowPosition', [
    //   // Hidden Above => Hint Center
    //   transition(
    //     '* => desc-to-hint, * => desc-to-active',
    //     animate(
    //       SORT_ANIMATION_TRANSITION,
    //       keyframes([style({transform: 'translateY(-25%)'}), style({transform: 'translateY(0)'})]),
    //     ),
    //   ),
    //   // Hint Center => Hidden Below
    //   transition(
    //     '* => hint-to-desc, * => active-to-desc',
    //     animate(
    //       SORT_ANIMATION_TRANSITION,
    //       keyframes([style({transform: 'translateY(0)'}), style({transform: 'translateY(25%)'})]),
    //     ),
    //   ),
    //   // Hidden Below => Hint Center
    //   transition(
    //     '* => asc-to-hint, * => asc-to-active',
    //     animate(
    //       SORT_ANIMATION_TRANSITION,
    //       keyframes([style({transform: 'translateY(25%)'}), style({transform: 'translateY(0)'})]),
    //     ),
    //   ),
    //   // Hint Center => Hidden Above
    //   transition(
    //     '* => hint-to-asc, * => active-to-asc',
    //     animate(
    //       SORT_ANIMATION_TRANSITION,
    //       keyframes([style({transform: 'translateY(0)'}), style({transform: 'translateY(-25%)'})]),
    //     ),
    //   ),
    //   state(
    //     'desc-to-hint, asc-to-hint, hint, desc-to-active, asc-to-active, active',
    //     style({transform: 'translateY(0)'}),
    //   ),
    //   state('hint-to-desc, active-to-desc, desc', style({transform: 'translateY(-25%)'})),
    //   state('hint-to-asc, active-to-asc, asc', style({transform: 'translateY(25%)'})),
    // ])
    /**
     * Animation for the translation of the arrow as a whole. States are separated into two
     * groups: ones with animations and others that are immediate. Immediate states are asc, desc,
     * peek, and active. The other states define a specific animation (source-to-destination)
     * and are determined as a function of their prev user-perceived state and what the next state
     * should be.
     */
    arrowPosition: {
        type: 7,
        name: 'arrowPosition',
        definitions: [
            {
                type: 1,
                expr: '* => desc-to-hint, * => desc-to-active',
                animation: {
                    type: 4,
                    styles: {
                        type: 5,
                        'steps': [
                            { type: 6, styles: { transform: 'translateY(-25%)' }, offset: null },
                            { type: 6, styles: { transform: 'translateY(0)' }, offset: null },
                        ],
                    },
                    timings: '225ms cubic-bezier(0.4,0.0,0.2,1)',
                },
                options: null,
            },
            {
                type: 1,
                expr: '* => hint-to-desc, * => active-to-desc',
                animation: {
                    type: 4,
                    styles: {
                        type: 5,
                        'steps': [
                            { type: 6, styles: { transform: 'translateY(0)' }, offset: null },
                            { type: 6, styles: { transform: 'translateY(25%)' }, offset: null },
                        ],
                    },
                    timings: '225ms cubic-bezier(0.4,0.0,0.2,1)',
                },
                options: null,
            },
            {
                type: 1,
                expr: '* => asc-to-hint, * => asc-to-active',
                animation: {
                    type: 4,
                    styles: {
                        type: 5,
                        'steps': [
                            { type: 6, styles: { transform: 'translateY(25%)' }, offset: null },
                            { type: 6, styles: { transform: 'translateY(0)' }, offset: null },
                        ],
                    },
                    timings: '225ms cubic-bezier(0.4,0.0,0.2,1)',
                },
                options: null,
            },
            {
                type: 1,
                expr: '* => hint-to-asc, * => active-to-asc',
                animation: {
                    type: 4,
                    styles: {
                        type: 5,
                        'steps': [
                            { type: 6, styles: { transform: 'translateY(0)' }, offset: null },
                            { type: 6, styles: { transform: 'translateY(-25%)' }, offset: null },
                        ],
                    },
                    timings: '225ms cubic-bezier(0.4,0.0,0.2,1)',
                },
                options: null,
            },
            {
                type: 0,
                name: 'desc-to-hint, asc-to-hint, hint, desc-to-active, asc-to-active, active',
                styles: { type: 6, styles: { transform: 'translateY(0)' }, offset: null },
            },
            {
                type: 0,
                name: 'hint-to-desc, active-to-desc, desc',
                styles: { type: 6, styles: { transform: 'translateY(-25%)' }, offset: null },
            },
            {
                type: 0,
                name: 'hint-to-asc, active-to-asc, asc',
                styles: { type: 6, styles: { transform: 'translateY(25%)' }, offset: null },
            },
        ],
        options: {},
    },
    // Represents:
    // trigger('allowChildren', [
    //   transition('* <=> *', [query('@*', animateChild(), {optional: true})]),
    // ])
    /** Necessary trigger that calls animate on children animations. */
    allowChildren: {
        type: 7,
        name: 'allowChildren',
        definitions: [
            {
                type: 1,
                expr: '* <=> *',
                animation: [
                    {
                        type: 11,
                        selector: '@*',
                        animation: { type: 9, options: null },
                        options: { optional: true },
                    },
                ],
                options: null,
            },
        ],
        options: {},
    },
};

export { MAT_SORT_DEFAULT_OPTIONS, MAT_SORT_HEADER_INTL_PROVIDER, MAT_SORT_HEADER_INTL_PROVIDER_FACTORY, MatSort, MatSortHeader, MatSortHeaderIntl, MatSortModule, matSortAnimations };
//# sourceMappingURL=sort.mjs.map
