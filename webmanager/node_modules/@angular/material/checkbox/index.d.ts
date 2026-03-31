import { FocusableOption } from '@angular/cdk/a11y';
import * as i0 from '@angular/core';
import { AfterViewInit, OnChanges, ElementRef, EventEmitter, SimpleChanges, InjectionToken } from '@angular/core';
import { ControlValueAccessor, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { ThemePalette } from '../palette.d.js';
import { MatCommonModule } from '../common-module.d.js';
import '@angular/cdk/bidi';

/**
 * Represents the different states that require custom transitions between them.
 * @docs-private
 */
declare enum TransitionCheckState {
    /** The initial state of the component before any user interaction. */
    Init = 0,
    /** The state representing the component when it's becoming checked. */
    Checked = 1,
    /** The state representing the component when it's becoming unchecked. */
    Unchecked = 2,
    /** The state representing the component when it's becoming indeterminate. */
    Indeterminate = 3
}
/** Change event object emitted by checkbox. */
declare class MatCheckboxChange {
    /** The source checkbox of the event. */
    source: MatCheckbox;
    /** The new `checked` value of the checkbox. */
    checked: boolean;
}
declare class MatCheckbox implements AfterViewInit, OnChanges, ControlValueAccessor, Validator, FocusableOption {
    _elementRef: ElementRef<HTMLElement>;
    private _changeDetectorRef;
    private _ngZone;
    protected _animationsDisabled: boolean;
    private _options;
    /** Focuses the checkbox. */
    focus(): void;
    /** Creates the change event that will be emitted by the checkbox. */
    protected _createChangeEvent(isChecked: boolean): MatCheckboxChange;
    /** Gets the element on which to add the animation CSS classes. */
    protected _getAnimationTargetElement(): HTMLInputElement;
    /** CSS classes to add when transitioning between the different checkbox states. */
    protected _animationClasses: {
        uncheckedToChecked: string;
        uncheckedToIndeterminate: string;
        checkedToUnchecked: string;
        checkedToIndeterminate: string;
        indeterminateToChecked: string;
        indeterminateToUnchecked: string;
    };
    /**
     * Attached to the aria-label attribute of the host element. In most cases, aria-labelledby will
     * take precedence so this may be omitted.
     */
    ariaLabel: string;
    /**
     * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
     */
    ariaLabelledby: string | null;
    /** The 'aria-describedby' attribute is read after the element's label and field type. */
    ariaDescribedby: string;
    /**
     * Users can specify the `aria-expanded` attribute which will be forwarded to the input element
     */
    ariaExpanded: boolean;
    /**
     * Users can specify the `aria-controls` attribute which will be forwarded to the input element
     */
    ariaControls: string;
    /** Users can specify the `aria-owns` attribute which will be forwarded to the input element */
    ariaOwns: string;
    private _uniqueId;
    /** A unique id for the checkbox input. If none is supplied, it will be auto-generated. */
    id: string;
    /** Returns the unique id for the visual hidden input. */
    get inputId(): string;
    /** Whether the checkbox is required. */
    required: boolean;
    /** Whether the label should appear after or before the checkbox. Defaults to 'after' */
    labelPosition: 'before' | 'after';
    /** Name value will be applied to the input element if present */
    name: string | null;
    /** Event emitted when the checkbox's `checked` value changes. */
    readonly change: EventEmitter<MatCheckboxChange>;
    /** Event emitted when the checkbox's `indeterminate` value changes. */
    readonly indeterminateChange: EventEmitter<boolean>;
    /** The value attribute of the native input element */
    value: string;
    /** Whether the checkbox has a ripple. */
    disableRipple: boolean;
    /** The native `<input type="checkbox">` element */
    _inputElement: ElementRef<HTMLInputElement>;
    /** The native `<label>` element */
    _labelElement: ElementRef<HTMLInputElement>;
    /** Tabindex for the checkbox. */
    tabIndex: number;
    /**
     * Theme color of the checkbox. This API is supported in M2 themes only, it
     * has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/checkbox/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color: string | undefined;
    /** Whether the checkbox should remain interactive when it is disabled. */
    disabledInteractive: boolean;
    /**
     * Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor.
     * @docs-private
     */
    _onTouched: () => any;
    private _currentAnimationClass;
    private _currentCheckState;
    private _controlValueAccessorChangeFn;
    private _validatorChangeFn;
    constructor(...args: unknown[]);
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    /** Whether the checkbox is checked. */
    get checked(): boolean;
    set checked(value: boolean);
    private _checked;
    /** Whether the checkbox is disabled. */
    get disabled(): boolean;
    set disabled(value: boolean);
    private _disabled;
    /**
     * Whether the checkbox is indeterminate. This is also known as "mixed" mode and can be used to
     * represent a checkbox with three states, e.g. a checkbox that represents a nested list of
     * checkable items. Note that whenever checkbox is manually clicked, indeterminate is immediately
     * set to false.
     */
    get indeterminate(): boolean;
    set indeterminate(value: boolean);
    private _indeterminate;
    _isRippleDisabled(): boolean;
    /** Method being called whenever the label text changes. */
    _onLabelTextChange(): void;
    writeValue(value: any): void;
    registerOnChange(fn: (value: any) => void): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    validate(control: AbstractControl<boolean>): ValidationErrors | null;
    registerOnValidatorChange(fn: () => void): void;
    private _transitionCheckState;
    private _emitChangeEvent;
    /** Toggles the `checked` state of the checkbox. */
    toggle(): void;
    protected _handleInputClick(): void;
    _onInteractionEvent(event: Event): void;
    _onBlur(): void;
    private _getAnimationClassForCheckStateTransition;
    /**
     * Syncs the indeterminate value with the checkbox DOM node.
     *
     * We sync `indeterminate` directly on the DOM node, because in Ivy the check for whether a
     * property is supported on an element boils down to `if (propName in element)`. Domino's
     * HTMLInputElement doesn't have an `indeterminate` property so Ivy will warn during
     * server-side rendering.
     */
    private _syncIndeterminate;
    _onInputClick(): void;
    _onTouchTargetClick(): void;
    /**
     *  Prevent click events that come from the `<label/>` element from bubbling. This prevents the
     *  click handler on the host from triggering twice when clicking on the `<label/>` element. After
     *  the click event on the `<label/>` propagates, the browsers dispatches click on the associated
     *  `<input/>`. By preventing clicks on the label by bubbling, we ensure only one click event
     *  bubbles when the label is clicked.
     */
    _preventBubblingFromLabel(event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCheckbox, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatCheckbox, "mat-checkbox", ["matCheckbox"], { "ariaLabel": { "alias": "aria-label"; "required": false; }; "ariaLabelledby": { "alias": "aria-labelledby"; "required": false; }; "ariaDescribedby": { "alias": "aria-describedby"; "required": false; }; "ariaExpanded": { "alias": "aria-expanded"; "required": false; }; "ariaControls": { "alias": "aria-controls"; "required": false; }; "ariaOwns": { "alias": "aria-owns"; "required": false; }; "id": { "alias": "id"; "required": false; }; "required": { "alias": "required"; "required": false; }; "labelPosition": { "alias": "labelPosition"; "required": false; }; "name": { "alias": "name"; "required": false; }; "value": { "alias": "value"; "required": false; }; "disableRipple": { "alias": "disableRipple"; "required": false; }; "tabIndex": { "alias": "tabIndex"; "required": false; }; "color": { "alias": "color"; "required": false; }; "disabledInteractive": { "alias": "disabledInteractive"; "required": false; }; "checked": { "alias": "checked"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "indeterminate": { "alias": "indeterminate"; "required": false; }; }, { "change": "change"; "indeterminateChange": "indeterminateChange"; }, never, ["*"], true, never>;
    static ngAcceptInputType_ariaExpanded: unknown;
    static ngAcceptInputType_required: unknown;
    static ngAcceptInputType_disableRipple: unknown;
    static ngAcceptInputType_tabIndex: unknown;
    static ngAcceptInputType_disabledInteractive: unknown;
    static ngAcceptInputType_checked: unknown;
    static ngAcceptInputType_disabled: unknown;
    static ngAcceptInputType_indeterminate: unknown;
}

/** Default `mat-checkbox` options that can be overridden. */
interface MatCheckboxDefaultOptions {
    /**
     * Default theme color of the checkbox. This API is supported in M2 themes
     * only, it has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/checkbox/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color?: ThemePalette;
    /** Default checkbox click action for checkboxes. */
    clickAction?: MatCheckboxClickAction;
    /** Whether disabled checkboxes should be interactive. */
    disabledInteractive?: boolean;
}
/** Injection token to be used to override the default options for `mat-checkbox`. */
declare const MAT_CHECKBOX_DEFAULT_OPTIONS: InjectionToken<MatCheckboxDefaultOptions>;
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
declare function MAT_CHECKBOX_DEFAULT_OPTIONS_FACTORY(): MatCheckboxDefaultOptions;
/**
 * Checkbox click action when user click on input element.
 * noop: Do not toggle checked or indeterminate.
 * check: Only toggle checked status, ignore indeterminate.
 * check-indeterminate: Toggle checked status, set indeterminate to false. Default behavior.
 * undefined: Same as `check-indeterminate`.
 */
type MatCheckboxClickAction = 'noop' | 'check' | 'check-indeterminate' | undefined;

declare class MatCheckboxModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCheckboxModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatCheckboxModule, never, [typeof MatCheckbox, typeof MatCommonModule], [typeof MatCheckbox, typeof MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatCheckboxModule>;
}

export { MAT_CHECKBOX_DEFAULT_OPTIONS, MAT_CHECKBOX_DEFAULT_OPTIONS_FACTORY, MatCheckbox, MatCheckboxChange, MatCheckboxModule, TransitionCheckState };
export type { MatCheckboxClickAction, MatCheckboxDefaultOptions };
