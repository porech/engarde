import * as i0 from '@angular/core';
import { Optional, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { MatCommonModule } from '../common-module.d.js';
import { MatSortable, MatSort, SortHeaderArrowPosition } from '../sort.d.js';
export { MAT_SORT_DEFAULT_OPTIONS, MatSortDefaultOptions, Sort } from '../sort.d.js';
import { SortDirection } from '../sort-direction.d.js';
import { Subject } from 'rxjs';
import '@angular/cdk/bidi';

/**
 * To modify the labels and text displayed, create a new instance of MatSortHeaderIntl and
 * include it in a custom provider.
 */
declare class MatSortHeaderIntl {
    /**
     * Stream that emits whenever the labels here are changed. Use this to notify
     * components if the labels have changed after initialization.
     */
    readonly changes: Subject<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSortHeaderIntl, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MatSortHeaderIntl>;
}
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
declare function MAT_SORT_HEADER_INTL_PROVIDER_FACTORY(parentIntl: MatSortHeaderIntl): MatSortHeaderIntl;
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
declare const MAT_SORT_HEADER_INTL_PROVIDER: {
    provide: typeof MatSortHeaderIntl;
    deps: Optional[][];
    useFactory: typeof MAT_SORT_HEADER_INTL_PROVIDER_FACTORY;
};

/**
 * Valid positions for the arrow to be in for its opacity and translation. If the state is a
 * sort direction, the position of the arrow will be above/below and opacity 0. If the state is
 * hint, the arrow will be in the center with a slight opacity. Active state means the arrow will
 * be fully opaque in the center.
 *
 * @docs-private
 * @deprecated No longer being used, to be removed.
 * @breaking-change 21.0.0
 */
type ArrowViewState = SortDirection | 'hint' | 'active';
/**
 * States describing the arrow's animated position (animating fromState to toState).
 * If the fromState is not defined, there will be no animated transition to the toState.
 * @docs-private
 * @deprecated No longer being used, to be removed.
 * @breaking-change 21.0.0
 */
interface ArrowViewStateTransition {
    fromState?: ArrowViewState;
    toState?: ArrowViewState;
}
/** Column definition associated with a `MatSortHeader`. */
interface MatSortHeaderColumnDef {
    name: string;
}
/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent MatSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
declare class MatSortHeader implements MatSortable, OnDestroy, OnInit, AfterViewInit {
    _intl: MatSortHeaderIntl;
    _sort: MatSort;
    _columnDef: MatSortHeaderColumnDef | null;
    private _changeDetectorRef;
    private _focusMonitor;
    private _elementRef;
    private _ariaDescriber;
    private _renderChanges;
    protected _animationsDisabled: boolean;
    /**
     * Indicates which state was just cleared from the sort header.
     * Will be reset on the next interaction. Used for coordinating animations.
     */
    protected _recentlyCleared: i0.WritableSignal<SortDirection | null>;
    /**
     * The element with role="button" inside this component's view. We need this
     * in order to apply a description with AriaDescriber.
     */
    private _sortButton;
    /**
     * ID of this sort header. If used within the context of a CdkColumnDef, this will default to
     * the column's name.
     */
    id: string;
    /** Sets the position of the arrow that displays when sorted. */
    arrowPosition: SortHeaderArrowPosition;
    /** Overrides the sort start value of the containing MatSort for this MatSortable. */
    start: SortDirection;
    /** whether the sort header is disabled. */
    disabled: boolean;
    /**
     * Description applied to MatSortHeader's button element with aria-describedby. This text should
     * describe the action that will occur when the user clicks the sort header.
     */
    get sortActionDescription(): string;
    set sortActionDescription(value: string);
    private _sortActionDescription;
    /** Overrides the disable clear value of the containing MatSort for this MatSortable. */
    disableClear: boolean;
    constructor(...args: unknown[]);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /** Triggers the sort on this sort header and removes the indicator hint. */
    _toggleOnInteraction(): void;
    _handleKeydown(event: KeyboardEvent): void;
    /** Whether this MatSortHeader is currently sorted in either ascending or descending order. */
    _isSorted(): boolean;
    _isDisabled(): boolean;
    /**
     * Gets the aria-sort attribute that should be applied to this sort header. If this header
     * is not sorted, returns null so that the attribute is removed from the host element. Aria spec
     * says that the aria-sort property should only be present on one header at a time, so removing
     * ensures this is true.
     */
    _getAriaSortAttribute(): "none" | "ascending" | "descending";
    /** Whether the arrow inside the sort header should be rendered. */
    _renderArrow(): boolean;
    private _updateSortActionDescription;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSortHeader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatSortHeader, "[mat-sort-header]", ["matSortHeader"], { "id": { "alias": "mat-sort-header"; "required": false; }; "arrowPosition": { "alias": "arrowPosition"; "required": false; }; "start": { "alias": "start"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "sortActionDescription": { "alias": "sortActionDescription"; "required": false; }; "disableClear": { "alias": "disableClear"; "required": false; }; }, {}, never, ["*"], true, never>;
    static ngAcceptInputType_disabled: unknown;
    static ngAcceptInputType_disableClear: unknown;
}

declare class MatSortModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSortModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatSortModule, never, [typeof MatCommonModule, typeof MatSort, typeof MatSortHeader], [typeof MatSort, typeof MatSortHeader]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatSortModule>;
}

/**
 * Animations used by MatSort.
 * @docs-private
 * @deprecated No longer being used, to be removed.
 * @breaking-change 21.0.0
 */
declare const matSortAnimations: {
    readonly indicator: any;
    readonly leftPointer: any;
    readonly rightPointer: any;
    readonly arrowOpacity: any;
    readonly arrowPosition: any;
    readonly allowChildren: any;
};

export { MAT_SORT_HEADER_INTL_PROVIDER, MAT_SORT_HEADER_INTL_PROVIDER_FACTORY, MatSort, MatSortHeader, MatSortHeaderIntl, MatSortModule, MatSortable, SortDirection, SortHeaderArrowPosition, matSortAnimations };
export type { ArrowViewState, ArrowViewStateTransition };
