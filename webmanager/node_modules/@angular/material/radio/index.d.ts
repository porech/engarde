import { FocusOrigin } from '@angular/cdk/a11y';
import * as i0 from '@angular/core';
import { InjectionToken, AfterContentInit, OnDestroy, EventEmitter, QueryList, OnInit, AfterViewInit, DoCheck, ElementRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { ThemePalette } from '../palette.d.js';
import { MatCommonModule } from '../common-module.d.js';
import { MatRippleModule } from '../ripple-module.d.js';
import '@angular/cdk/bidi';
import '../ripple.d.js';
import '@angular/cdk/platform';

/** Change event object emitted by radio button and radio group. */
declare class MatRadioChange<T = any> {
    /** The radio button that emits the change event. */
    source: MatRadioButton;
    /** The value of the radio button. */
    value: T;
    constructor(
    /** The radio button that emits the change event. */
    source: MatRadioButton, 
    /** The value of the radio button. */
    value: T);
}
/**
 * Provider Expression that allows mat-radio-group to register as a ControlValueAccessor. This
 * allows it to support [(ngModel)] and ngControl.
 * @docs-private
 */
declare const MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR: any;
/**
 * Injection token that can be used to inject instances of `MatRadioGroup`. It serves as
 * alternative token to the actual `MatRadioGroup` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
declare const MAT_RADIO_GROUP: InjectionToken<MatRadioGroup>;
interface MatRadioDefaultOptions {
    /**
     * Theme color of the radio button. This API is supported in M2 themes only, it
     * has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/radio/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color: ThemePalette;
    /** Whether disabled radio buttons should be interactive. */
    disabledInteractive?: boolean;
}
declare const MAT_RADIO_DEFAULT_OPTIONS: InjectionToken<MatRadioDefaultOptions>;
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
declare function MAT_RADIO_DEFAULT_OPTIONS_FACTORY(): MatRadioDefaultOptions;
/**
 * A group of radio buttons. May contain one or more `<mat-radio-button>` elements.
 */
declare class MatRadioGroup implements AfterContentInit, OnDestroy, ControlValueAccessor {
    private _changeDetector;
    /** Selected value for the radio group. */
    private _value;
    /** The HTML name attribute applied to radio buttons in this group. */
    private _name;
    /** The currently selected radio button. Should match value. */
    private _selected;
    /** Whether the `value` has been set to its initial value. */
    private _isInitialized;
    /** Whether the labels should appear after or before the radio-buttons. Defaults to 'after' */
    private _labelPosition;
    /** Whether the radio group is disabled. */
    private _disabled;
    /** Whether the radio group is required. */
    private _required;
    /** Subscription to changes in amount of radio buttons. */
    private _buttonChanges;
    /** The method to be called in order to update ngModel */
    _controlValueAccessorChangeFn: (value: any) => void;
    /**
     * onTouch function registered via registerOnTouch (ControlValueAccessor).
     * @docs-private
     */
    onTouched: () => any;
    /**
     * Event emitted when the group value changes.
     * Change events are only emitted when the value changes due to user interaction with
     * a radio button (the same behavior as `<input type-"radio">`).
     */
    readonly change: EventEmitter<MatRadioChange>;
    /** Child radio buttons. */
    _radios: QueryList<MatRadioButton>;
    /**
     * Theme color of the radio buttons in the group. This API is supported in M2
     * themes only, it has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/radio/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color: ThemePalette;
    /** Name of the radio button group. All radio buttons inside this group will use this name. */
    get name(): string;
    set name(value: string);
    /** Whether the labels should appear after or before the radio-buttons. Defaults to 'after' */
    get labelPosition(): 'before' | 'after';
    set labelPosition(v: "before" | "after");
    /**
     * Value for the radio-group. Should equal the value of the selected radio button if there is
     * a corresponding radio button with a matching value. If there is not such a corresponding
     * radio button, this value persists to be applied in case a new radio button is added with a
     * matching value.
     */
    get value(): any;
    set value(newValue: any);
    _checkSelectedRadioButton(): void;
    /**
     * The currently selected radio button. If set to a new radio button, the radio group value
     * will be updated to match the new selected button.
     */
    get selected(): MatRadioButton | null;
    set selected(selected: MatRadioButton | null);
    /** Whether the radio group is disabled */
    get disabled(): boolean;
    set disabled(value: boolean);
    /** Whether the radio group is required */
    get required(): boolean;
    set required(value: boolean);
    /** Whether buttons in the group should be interactive while they're disabled. */
    get disabledInteractive(): boolean;
    set disabledInteractive(value: boolean);
    private _disabledInteractive;
    constructor(...args: unknown[]);
    /**
     * Initialize properties once content children are available.
     * This allows us to propagate relevant attributes to associated buttons.
     */
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /**
     * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
     * radio buttons upon their blur.
     */
    _touch(): void;
    private _updateRadioButtonNames;
    /** Updates the `selected` radio button from the internal _value state. */
    private _updateSelectedRadioFromValue;
    /** Dispatch change event with current selection and group value. */
    _emitChangeEvent(): void;
    _markRadiosForCheck(): void;
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value
     */
    writeValue(value: any): void;
    /**
     * Registers a callback to be triggered when the model value changes.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnChange(fn: (value: any) => void): void;
    /**
     * Registers a callback to be triggered when the control is touched.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnTouched(fn: any): void;
    /**
     * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
     * @param isDisabled Whether the control should be disabled.
     */
    setDisabledState(isDisabled: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatRadioGroup, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatRadioGroup, "mat-radio-group", ["matRadioGroup"], { "color": { "alias": "color"; "required": false; }; "name": { "alias": "name"; "required": false; }; "labelPosition": { "alias": "labelPosition"; "required": false; }; "value": { "alias": "value"; "required": false; }; "selected": { "alias": "selected"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "required": { "alias": "required"; "required": false; }; "disabledInteractive": { "alias": "disabledInteractive"; "required": false; }; }, { "change": "change"; }, ["_radios"], never, true, never>;
    static ngAcceptInputType_disabled: unknown;
    static ngAcceptInputType_required: unknown;
    static ngAcceptInputType_disabledInteractive: unknown;
}
declare class MatRadioButton implements OnInit, AfterViewInit, DoCheck, OnDestroy {
    protected _elementRef: ElementRef<any>;
    private _changeDetector;
    private _focusMonitor;
    private _radioDispatcher;
    private _defaultOptions;
    private _ngZone;
    private _renderer;
    private _uniqueId;
    private _cleanupClick;
    /** The unique ID for the radio button. */
    id: string;
    /** Analog to HTML 'name' attribute used to group radios for unique selection. */
    name: string;
    /** Used to set the 'aria-label' attribute on the underlying input element. */
    ariaLabel: string;
    /** The 'aria-labelledby' attribute takes precedence as the element's text alternative. */
    ariaLabelledby: string;
    /** The 'aria-describedby' attribute is read after the element's label and field type. */
    ariaDescribedby: string;
    /** Whether ripples are disabled inside the radio button */
    disableRipple: boolean;
    /** Tabindex of the radio button. */
    tabIndex: number;
    /** Whether this radio button is checked. */
    get checked(): boolean;
    set checked(value: boolean);
    /** The value of this radio button. */
    get value(): any;
    set value(value: any);
    /** Whether the label should appear after or before the radio button. Defaults to 'after' */
    get labelPosition(): 'before' | 'after';
    set labelPosition(value: "before" | "after");
    private _labelPosition;
    /** Whether the radio button is disabled. */
    get disabled(): boolean;
    set disabled(value: boolean);
    /** Whether the radio button is required. */
    get required(): boolean;
    set required(value: boolean);
    /**
     * Theme color of the radio button. This API is supported in M2 themes only, it
     * has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/radio/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    get color(): ThemePalette;
    set color(newValue: ThemePalette);
    private _color;
    /** Whether the radio button should remain interactive when it is disabled. */
    get disabledInteractive(): boolean;
    set disabledInteractive(value: boolean);
    private _disabledInteractive;
    /**
     * Event emitted when the checked state of this radio button changes.
     * Change events are only emitted when the value changes due to user interaction with
     * the radio button (the same behavior as `<input type-"radio">`).
     */
    readonly change: EventEmitter<MatRadioChange>;
    /** The parent radio group. May or may not be present. */
    radioGroup: MatRadioGroup;
    /** ID of the native input element inside `<mat-radio-button>` */
    get inputId(): string;
    /** Whether this radio is checked. */
    private _checked;
    /** Whether this radio is disabled. */
    private _disabled;
    /** Whether this radio is required. */
    private _required;
    /** Value assigned to this radio. */
    private _value;
    /** Unregister function for _radioDispatcher */
    private _removeUniqueSelectionListener;
    /** Previous value of the input's tabindex. */
    private _previousTabIndex;
    /** The native `<input type=radio>` element */
    _inputElement: ElementRef<HTMLInputElement>;
    /** Trigger elements for the ripple events. */
    _rippleTrigger: ElementRef<HTMLElement>;
    /** Whether animations are disabled. */
    _noopAnimations: boolean;
    private _injector;
    constructor(...args: unknown[]);
    /** Focuses the radio button. */
    focus(options?: FocusOptions, origin?: FocusOrigin): void;
    /**
     * Marks the radio button as needing checking for change detection.
     * This method is exposed because the parent radio group will directly
     * update bound properties of the radio button.
     */
    _markForCheck(): void;
    ngOnInit(): void;
    ngDoCheck(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /** Dispatch change event with current value. */
    private _emitChangeEvent;
    _isRippleDisabled(): boolean;
    /** Triggered when the radio button receives an interaction from the user. */
    _onInputInteraction(event: Event): void;
    /** Triggered when the user clicks on the touch target. */
    _onTouchTargetClick(event: Event): void;
    /** Sets the disabled state and marks for check if a change occurred. */
    protected _setDisabled(value: boolean): void;
    /** Called when the input is clicked. */
    private _onInputClick;
    /** Gets the tabindex for the underlying input element. */
    private _updateTabIndex;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatRadioButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatRadioButton, "mat-radio-button", ["matRadioButton"], { "id": { "alias": "id"; "required": false; }; "name": { "alias": "name"; "required": false; }; "ariaLabel": { "alias": "aria-label"; "required": false; }; "ariaLabelledby": { "alias": "aria-labelledby"; "required": false; }; "ariaDescribedby": { "alias": "aria-describedby"; "required": false; }; "disableRipple": { "alias": "disableRipple"; "required": false; }; "tabIndex": { "alias": "tabIndex"; "required": false; }; "checked": { "alias": "checked"; "required": false; }; "value": { "alias": "value"; "required": false; }; "labelPosition": { "alias": "labelPosition"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "required": { "alias": "required"; "required": false; }; "color": { "alias": "color"; "required": false; }; "disabledInteractive": { "alias": "disabledInteractive"; "required": false; }; }, { "change": "change"; }, never, ["*"], true, never>;
    static ngAcceptInputType_disableRipple: unknown;
    static ngAcceptInputType_tabIndex: unknown;
    static ngAcceptInputType_checked: unknown;
    static ngAcceptInputType_disabled: unknown;
    static ngAcceptInputType_required: unknown;
    static ngAcceptInputType_disabledInteractive: unknown;
}

declare class MatRadioModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatRadioModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatRadioModule, never, [typeof MatCommonModule, typeof MatRippleModule, typeof MatRadioGroup, typeof MatRadioButton], [typeof MatCommonModule, typeof MatRadioGroup, typeof MatRadioButton]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatRadioModule>;
}

export { MAT_RADIO_DEFAULT_OPTIONS, MAT_RADIO_DEFAULT_OPTIONS_FACTORY, MAT_RADIO_GROUP, MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR, MatRadioButton, MatRadioChange, MatRadioGroup, MatRadioModule };
export type { MatRadioDefaultOptions };
