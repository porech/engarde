import * as i0 from '@angular/core';
import { OnDestroy, Signal, ModelSignal, InputSignal, InputSignalWithTransform, ElementRef, InjectionToken, TemplateRef, OutputEmitterRef } from '@angular/core';
import { MatOption } from '../option.d.js';
import { MatOptionParentComponent } from '../option-parent.d.js';
import { ScrollStrategy } from '@angular/cdk/overlay';
import { ControlValueAccessor, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import * as i5 from '@angular/cdk/scrolling';
import '@angular/cdk/a11y';
import 'rxjs';

/**
 * Input that can be used to enter time and connect to a `mat-timepicker`.
 */
declare class MatTimepickerInput<D> implements ControlValueAccessor, Validator, OnDestroy {
    private _elementRef;
    private _dateAdapter;
    private _dateFormats;
    private _formField;
    private _onChange;
    private _onTouched;
    private _validatorOnChange;
    private _cleanupClick;
    private _accessorDisabled;
    private _localeSubscription;
    private _timepickerSubscription;
    private _validator;
    private _lastValueValid;
    private _lastValidDate;
    /** Value of the `aria-activedescendant` attribute. */
    protected readonly _ariaActiveDescendant: Signal<string | null>;
    /** Value of the `aria-expanded` attribute. */
    protected readonly _ariaExpanded: Signal<string>;
    /** Value of the `aria-controls` attribute. */
    protected readonly _ariaControls: Signal<string | null>;
    /** Current value of the input. */
    readonly value: ModelSignal<D | null>;
    /** Timepicker that the input is associated with. */
    readonly timepicker: InputSignal<MatTimepicker<D>>;
    /**
     * Minimum time that can be selected or typed in. Can be either
     * a date object (only time will be used) or a valid time string.
     */
    readonly min: InputSignalWithTransform<D | null, unknown>;
    /**
     * Maximum time that can be selected or typed in. Can be either
     * a date object (only time will be used) or a valid time string.
     */
    readonly max: InputSignalWithTransform<D | null, unknown>;
    /**
     * Whether to open the timepicker overlay when clicking on the input. Enabled by default.
     * Note that when disabling this option, you'll have to provide your own logic for opening
     * the overlay.
     */
    readonly openOnClick: InputSignalWithTransform<boolean, unknown>;
    /** Whether the input is disabled. */
    readonly disabled: Signal<boolean>;
    /**
     * Whether the input should be disabled through the template.
     * @docs-private
     */
    readonly disabledInput: InputSignalWithTransform<boolean, unknown>;
    constructor();
    /**
     * Implemented as a part of `ControlValueAccessor`.
     * @docs-private
     */
    writeValue(value: any): void;
    /**
     * Implemented as a part of `ControlValueAccessor`.
     * @docs-private
     */
    registerOnChange(fn: (value: any) => void): void;
    /**
     * Implemented as a part of `ControlValueAccessor`.
     * @docs-private
     */
    registerOnTouched(fn: () => void): void;
    /**
     * Implemented as a part of `ControlValueAccessor`.
     * @docs-private
     */
    setDisabledState(isDisabled: boolean): void;
    /**
     * Implemented as a part of `Validator`.
     * @docs-private
     */
    validate(control: AbstractControl): ValidationErrors | null;
    /**
     * Implemented as a part of `Validator`.
     * @docs-private
     */
    registerOnValidatorChange(fn: () => void): void;
    /** Gets the element to which the timepicker popup should be attached. */
    getOverlayOrigin(): ElementRef<HTMLElement>;
    /** Focuses the input. */
    focus(): void;
    ngOnDestroy(): void;
    /** Gets the ID of the input's label. */
    _getLabelId(): string | null;
    /** Handles clicks on the input or the containing form field. */
    private _handleClick;
    /** Handles the `input` event. */
    protected _handleInput(event: Event): void;
    /** Handles the `blur` event. */
    protected _handleBlur(): void;
    /** Handles the `keydown` event. */
    protected _handleKeydown(event: KeyboardEvent): void;
    /** Called by the timepicker to sync up the user-selected value. */
    _timepickerValueAssigned(value: D | null): void;
    /** Sets up the code that watches for changes in the value and adjusts the input. */
    private _respondToValueChanges;
    /** Sets up the logic that registers the input with the timepicker. */
    private _registerTimepicker;
    /** Sets up the logic that adjusts the input if the min/max changes. */
    private _respondToMinMaxChanges;
    /**
     * Assigns a value set by the user to the input's model.
     * @param selection Time selected by the user that should be assigned.
     * @param propagateToAccessor Whether the value should be propagated to the ControlValueAccessor.
     */
    private _assignUserSelection;
    /** Formats the current value and assigns it to the input. */
    private _formatValue;
    /** Checks whether a value is valid. */
    private _isValid;
    /** Transforms an arbitrary value into a value that can be assigned to a date-based input. */
    private _transformDateInput;
    /** Whether the input is currently focused. */
    private _hasFocus;
    /** Gets a function that can be used to validate the input. */
    private _getValidator;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTimepickerInput<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatTimepickerInput<any>, "input[matTimepicker]", ["matTimepickerInput"], { "value": { "alias": "value"; "required": false; "isSignal": true; }; "timepicker": { "alias": "matTimepicker"; "required": true; "isSignal": true; }; "min": { "alias": "matTimepickerMin"; "required": false; "isSignal": true; }; "max": { "alias": "matTimepickerMax"; "required": false; "isSignal": true; }; "openOnClick": { "alias": "matTimepickerOpenOnClick"; "required": false; "isSignal": true; }; "disabledInput": { "alias": "disabled"; "required": false; "isSignal": true; }; }, { "value": "valueChange"; }, never, never, true, never>;
}

/**
 * Object that can be used to configure the default options for the timepicker component.
 */
interface MatTimepickerConfig {
    /** Default interval for all time pickers. */
    interval?: string | number;
    /** Whether ripples inside the timepicker should be disabled by default. */
    disableRipple?: boolean;
}
/**
 * Injection token that can be used to configure the default options for the timepicker component.
 */
declare const MAT_TIMEPICKER_CONFIG: InjectionToken<MatTimepickerConfig>;
/**
 * Time selection option that can be displayed within a `mat-timepicker`.
 */
interface MatTimepickerOption<D = unknown> {
    /** Date value of the option. */
    value: D;
    /** Label to show to the user. */
    label: string;
}

/** Event emitted when a value is selected in the timepicker. */
interface MatTimepickerSelected<D> {
    value: D;
    source: MatTimepicker<D>;
}
/** Injection token used to configure the behavior of the timepicker dropdown while scrolling. */
declare const MAT_TIMEPICKER_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
/**
 * Renders out a listbox that can be used to select a time of day.
 * Intended to be used together with `MatTimepickerInput`.
 */
declare class MatTimepicker<D> implements OnDestroy, MatOptionParentComponent {
    private _dir;
    private _viewContainerRef;
    private _injector;
    private _defaultConfig;
    private _dateAdapter;
    private _dateFormats;
    private _scrollStrategyFactory;
    protected _animationsDisabled: boolean;
    private _isOpen;
    private _activeDescendant;
    private _input;
    private _overlayRef;
    private _portal;
    private _optionsCacheKey;
    private _localeChanges;
    private _onOpenRender;
    protected _panelTemplate: Signal<TemplateRef<unknown>>;
    protected _timeOptions: readonly MatTimepickerOption<D>[];
    protected _options: Signal<readonly MatOption<any>[]>;
    private _keyManager;
    /**
     * Interval between each option in the timepicker. The value can either be an amount of
     * seconds (e.g. 90) or a number with a unit (e.g. 45m). Supported units are `s` for seconds,
     * `m` for minutes or `h` for hours.
     */
    readonly interval: InputSignalWithTransform<number | null, number | string | null>;
    /**
     * Array of pre-defined options that the user can select from, as an alternative to using the
     * `interval` input. An error will be thrown if both `options` and `interval` are specified.
     */
    readonly options: InputSignal<readonly MatTimepickerOption<D>[] | null>;
    /** Whether the timepicker is open. */
    readonly isOpen: Signal<boolean>;
    /** Emits when the user selects a time. */
    readonly selected: OutputEmitterRef<MatTimepickerSelected<D>>;
    /** Emits when the timepicker is opened. */
    readonly opened: OutputEmitterRef<void>;
    /** Emits when the timepicker is closed. */
    readonly closed: OutputEmitterRef<void>;
    /** ID of the active descendant option. */
    readonly activeDescendant: Signal<string | null>;
    /** Unique ID of the timepicker's panel */
    readonly panelId: string;
    /** Whether ripples within the timepicker should be disabled. */
    readonly disableRipple: InputSignalWithTransform<boolean, unknown>;
    /** ARIA label for the timepicker panel. */
    readonly ariaLabel: InputSignal<string | null>;
    /** ID of the label element for the timepicker panel. */
    readonly ariaLabelledby: InputSignal<string | null>;
    /** Whether the timepicker is currently disabled. */
    readonly disabled: Signal<boolean>;
    constructor();
    /** Opens the timepicker. */
    open(): void;
    /** Closes the timepicker. */
    close(): void;
    /** Registers an input with the timepicker. */
    registerInput(input: MatTimepickerInput<D>): void;
    ngOnDestroy(): void;
    /** Selects a specific time value. */
    protected _selectValue(option: MatOption<D>): void;
    /** Gets the value of the `aria-labelledby` attribute. */
    protected _getAriaLabelledby(): string | null;
    /** Handles animation events coming from the panel. */
    protected _handleAnimationEnd(event: AnimationEvent): void;
    /** Creates an overlay reference for the timepicker panel. */
    private _getOverlayRef;
    /** Generates the list of options from which the user can select.. */
    private _generateOptions;
    /**
     * Synchronizes the internal state of the component based on a specific selected date.
     * @param value Currently selected date.
     * @param options Options rendered out in the timepicker.
     * @param fallback Option to set as active if no option is selected.
     */
    private _syncSelectedState;
    /** Handles keyboard events while the overlay is open. */
    private _handleKeydown;
    /** Sets up the logic that updates the timepicker when the locale changes. */
    private _handleLocaleChanges;
    /**
     * Sets up the logic that updates the timepicker when the state of the connected input changes.
     */
    private _handleInputStateChanges;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTimepicker<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatTimepicker<any>, "mat-timepicker", ["matTimepicker"], { "interval": { "alias": "interval"; "required": false; "isSignal": true; }; "options": { "alias": "options"; "required": false; "isSignal": true; }; "disableRipple": { "alias": "disableRipple"; "required": false; "isSignal": true; }; "ariaLabel": { "alias": "aria-label"; "required": false; "isSignal": true; }; "ariaLabelledby": { "alias": "aria-labelledby"; "required": false; "isSignal": true; }; }, { "selected": "selected"; "opened": "opened"; "closed": "closed"; }, never, never, true, never>;
}

/** Button that can be used to open a `mat-timepicker`. */
declare class MatTimepickerToggle<D> {
    private _defaultConfig;
    private _defaultTabIndex;
    protected _isDisabled: i0.Signal<boolean>;
    /** Timepicker instance that the button will toggle. */
    readonly timepicker: InputSignal<MatTimepicker<D>>;
    /** Screen-reader label for the button. */
    readonly ariaLabel: InputSignal<string | undefined>;
    /** Screen-reader labelled by id for the button. */
    readonly ariaLabelledby: InputSignal<string | undefined>;
    /** Default aria-label for the toggle if none is provided. */
    private readonly _defaultAriaLabel;
    /** Whether the toggle button is disabled. */
    readonly disabled: InputSignalWithTransform<boolean, unknown>;
    /** Tabindex for the toggle. */
    readonly tabIndex: InputSignal<number | null>;
    /** Whether ripples on the toggle should be disabled. */
    readonly disableRipple: InputSignalWithTransform<boolean, unknown>;
    /** Opens the connected timepicker. */
    protected _open(event: Event): void;
    /**
     * Checks for ariaLabelledby and if empty uses custom
     * aria-label or defaultAriaLabel if neither is provided.
     */
    getAriaLabel(): string | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTimepickerToggle<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatTimepickerToggle<any>, "mat-timepicker-toggle", ["matTimepickerToggle"], { "timepicker": { "alias": "for"; "required": true; "isSignal": true; }; "ariaLabel": { "alias": "aria-label"; "required": false; "isSignal": true; }; "ariaLabelledby": { "alias": "aria-labelledby"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "tabIndex": { "alias": "tabIndex"; "required": false; "isSignal": true; }; "disableRipple": { "alias": "disableRipple"; "required": false; "isSignal": true; }; }, {}, never, ["[matTimepickerToggleIcon]"], true, never>;
}

declare class MatTimepickerModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTimepickerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatTimepickerModule, never, [typeof MatTimepicker, typeof MatTimepickerInput, typeof MatTimepickerToggle], [typeof i5.CdkScrollableModule, typeof MatTimepicker, typeof MatTimepickerInput, typeof MatTimepickerToggle]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatTimepickerModule>;
}

export { MAT_TIMEPICKER_CONFIG, MAT_TIMEPICKER_SCROLL_STRATEGY, MatTimepicker, MatTimepickerInput, MatTimepickerModule, MatTimepickerToggle };
export type { MatTimepickerConfig, MatTimepickerOption, MatTimepickerSelected };
