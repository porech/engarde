import * as i0 from '@angular/core';
import { InjectionToken, OnChanges, OnDestroy, OnInit, EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SortDirection } from './sort-direction.d.js';

/** Position of the arrow that displays when sorted. */
type SortHeaderArrowPosition = 'before' | 'after';
/** Interface for a directive that holds sorting state consumed by `MatSortHeader`. */
interface MatSortable {
    /** The id of the column being sorted. */
    id: string;
    /** Starting sort direction. */
    start: SortDirection;
    /** Whether to disable clearing the sorting state. */
    disableClear: boolean;
}
/** The current sort state. */
interface Sort {
    /** The id of the column being sorted. */
    active: string;
    /** The sort direction. */
    direction: SortDirection;
}
/** Default options for `mat-sort`.  */
interface MatSortDefaultOptions {
    /** Whether to disable clearing the sorting state. */
    disableClear?: boolean;
    /** Position of the arrow that displays when sorted. */
    arrowPosition?: SortHeaderArrowPosition;
}
/** Injection token to be used to override the default options for `mat-sort`. */
declare const MAT_SORT_DEFAULT_OPTIONS: InjectionToken<MatSortDefaultOptions>;
/** Container for MatSortables to manage the sort state and provide default sort parameters. */
declare class MatSort implements OnChanges, OnDestroy, OnInit {
    private _defaultOptions?;
    private _initializedStream;
    /** Collection of all registered sortables that this directive manages. */
    sortables: Map<string, MatSortable>;
    /** Used to notify any child components listening to state changes. */
    readonly _stateChanges: Subject<void>;
    /** The id of the most recently sorted MatSortable. */
    active: string;
    /**
     * The direction to set when an MatSortable is initially sorted.
     * May be overridden by the MatSortable's sort start.
     */
    start: SortDirection;
    /** The sort direction of the currently active MatSortable. */
    get direction(): SortDirection;
    set direction(direction: SortDirection);
    private _direction;
    /**
     * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
     * May be overridden by the MatSortable's disable clear input.
     */
    disableClear: boolean;
    /** Whether the sortable is disabled. */
    disabled: boolean;
    /** Event emitted when the user changes either the active sort or sort direction. */
    readonly sortChange: EventEmitter<Sort>;
    /** Emits when the paginator is initialized. */
    initialized: Observable<void>;
    constructor(_defaultOptions?: MatSortDefaultOptions | undefined);
    /**
     * Register function to be used by the contained MatSortables. Adds the MatSortable to the
     * collection of MatSortables.
     */
    register(sortable: MatSortable): void;
    /**
     * Unregister function to be used by the contained MatSortables. Removes the MatSortable from the
     * collection of contained MatSortables.
     */
    deregister(sortable: MatSortable): void;
    /** Sets the active sort id and determines the new sort direction. */
    sort(sortable: MatSortable): void;
    /** Returns the next sort direction of the active sortable, checking for potential overrides. */
    getNextSortDirection(sortable: MatSortable): SortDirection;
    ngOnInit(): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSort, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatSort, "[matSort]", ["matSort"], { "active": { "alias": "matSortActive"; "required": false; }; "start": { "alias": "matSortStart"; "required": false; }; "direction": { "alias": "matSortDirection"; "required": false; }; "disableClear": { "alias": "matSortDisableClear"; "required": false; }; "disabled": { "alias": "matSortDisabled"; "required": false; }; }, { "sortChange": "matSortChange"; }, never, never, true, never>;
    static ngAcceptInputType_disableClear: unknown;
    static ngAcceptInputType_disabled: unknown;
}

export { MAT_SORT_DEFAULT_OPTIONS, MatSort };
export type { MatSortDefaultOptions, MatSortable, Sort, SortHeaderArrowPosition };
