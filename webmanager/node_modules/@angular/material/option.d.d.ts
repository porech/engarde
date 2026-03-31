import { FocusableOption, FocusOrigin } from '@angular/cdk/a11y';
import * as i0 from '@angular/core';
import { InjectionToken, AfterViewChecked, OnDestroy, ChangeDetectorRef, EventEmitter, ElementRef, QueryList } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Injection token that can be used to reference instances of `MatOptgroup`. It serves as
 * alternative token to the actual `MatOptgroup` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
declare const MAT_OPTGROUP: InjectionToken<MatOptgroup>;
/**
 * Component that is used to group instances of `mat-option`.
 */
declare class MatOptgroup {
    /** Label for the option group. */
    label: string;
    /** whether the option group is disabled. */
    disabled: boolean;
    /** Unique id for the underlying label. */
    _labelId: string;
    /** Whether the group is in inert a11y mode. */
    _inert: boolean;
    constructor(...args: unknown[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatOptgroup, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatOptgroup, "mat-optgroup", ["matOptgroup"], { "label": { "alias": "label"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; }, {}, never, ["*", "mat-option, ng-container"], true, never>;
    static ngAcceptInputType_disabled: unknown;
}

/** Event object emitted by MatOption when selected or deselected. */
declare class MatOptionSelectionChange<T = any> {
    /** Reference to the option that emitted the event. */
    source: MatOption<T>;
    /** Whether the change in the option's value was a result of a user action. */
    isUserInput: boolean;
    constructor(
    /** Reference to the option that emitted the event. */
    source: MatOption<T>, 
    /** Whether the change in the option's value was a result of a user action. */
    isUserInput?: boolean);
}
/**
 * Single option inside of a `<mat-select>` element.
 */
declare class MatOption<T = any> implements FocusableOption, AfterViewChecked, OnDestroy {
    private _element;
    _changeDetectorRef: ChangeDetectorRef;
    private _parent;
    group: MatOptgroup | null;
    private _signalDisableRipple;
    private _selected;
    private _active;
    private _mostRecentViewValue;
    /** Whether the wrapping component is in multiple selection mode. */
    get multiple(): boolean | null | undefined;
    /** Whether or not the option is currently selected. */
    get selected(): boolean;
    /** The form value of the option. */
    value: T;
    /** The unique ID of the option. */
    id: string;
    /** Whether the option is disabled. */
    get disabled(): boolean;
    set disabled(value: boolean);
    private _disabled;
    /** Whether ripples for the option are disabled. */
    get disableRipple(): boolean;
    /** Whether to display checkmark for single-selection. */
    get hideSingleSelectionIndicator(): boolean;
    /** Event emitted when the option is selected or deselected. */
    readonly onSelectionChange: EventEmitter<MatOptionSelectionChange<T>>;
    /** Element containing the option's text. */
    _text: ElementRef<HTMLElement> | undefined;
    /** Emits when the state of the option changes and any parents have to be notified. */
    readonly _stateChanges: Subject<void>;
    constructor(...args: unknown[]);
    /**
     * Whether or not the option is currently active and ready to be selected.
     * An active option displays styles as if it is focused, but the
     * focus is actually retained somewhere else. This comes in handy
     * for components like autocomplete where focus must remain on the input.
     */
    get active(): boolean;
    /**
     * The displayed value of the option. It is necessary to show the selected option in the
     * select's trigger.
     */
    get viewValue(): string;
    /** Selects the option. */
    select(emitEvent?: boolean): void;
    /** Deselects the option. */
    deselect(emitEvent?: boolean): void;
    /** Sets focus onto this option. */
    focus(_origin?: FocusOrigin, options?: FocusOptions): void;
    /**
     * This method sets display styles on the option to make it appear
     * active. This is used by the ActiveDescendantKeyManager so key
     * events will display the proper options as active on arrow key events.
     */
    setActiveStyles(): void;
    /**
     * This method removes display styles on the option that made it appear
     * active. This is used by the ActiveDescendantKeyManager so key
     * events will display the proper options as active on arrow key events.
     */
    setInactiveStyles(): void;
    /** Gets the label to be used when determining whether the option should be focused. */
    getLabel(): string;
    /** Ensures the option is selected when activated from the keyboard. */
    _handleKeydown(event: KeyboardEvent): void;
    /**
     * `Selects the option while indicating the selection came from the user. Used to
     * determine if the select's view -> model callback should be invoked.`
     */
    _selectViaInteraction(): void;
    /** Returns the correct tabindex for the option depending on disabled state. */
    _getTabIndex(): string;
    /** Gets the host DOM element. */
    _getHostElement(): HTMLElement;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    /** Emits the selection change event. */
    private _emitSelectionChangeEvent;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatOption<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatOption<any>, "mat-option", ["matOption"], { "value": { "alias": "value"; "required": false; }; "id": { "alias": "id"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; }, { "onSelectionChange": "onSelectionChange"; }, never, ["mat-icon", "*"], true, never>;
    static ngAcceptInputType_disabled: unknown;
}
/**
 * Counts the amount of option group labels that precede the specified option.
 * @param optionIndex Index of the option at which to start counting.
 * @param options Flat list of all of the options.
 * @param optionGroups Flat list of all of the option groups.
 * @docs-private
 */
declare function _countGroupLabelsBeforeOption(optionIndex: number, options: QueryList<MatOption>, optionGroups: QueryList<MatOptgroup>): number;
/**
 * Determines the position to which to scroll a panel in order for an option to be into view.
 * @param optionOffset Offset of the option from the top of the panel.
 * @param optionHeight Height of the options.
 * @param currentScrollPosition Current scroll position of the panel.
 * @param panelHeight Height of the panel.
 * @docs-private
 */
declare function _getOptionScrollPosition(optionOffset: number, optionHeight: number, currentScrollPosition: number, panelHeight: number): number;

export { MAT_OPTGROUP, MatOptgroup, MatOption, MatOptionSelectionChange, _countGroupLabelsBeforeOption, _getOptionScrollPosition };
