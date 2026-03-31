import * as i0 from '@angular/core';
import { InjectionToken, OnDestroy, AfterContentInit, OnChanges, ChangeDetectorRef, ElementRef, EventEmitter, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { ThemePalette } from '../palette.d.js';
import { MatCommonModule } from '../common-module.d.js';
import '@angular/cdk/bidi';

/** Default `mat-slide-toggle` options that can be overridden. */
interface MatSlideToggleDefaultOptions {
    /** Whether toggle action triggers value changes in slide toggle. */
    disableToggleValue?: boolean;
    /**
     * Default theme color of the slide toggle. This API is supported in M2 themes only,
     * it has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/slide-toggle/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color?: ThemePalette;
    /** Whether to hide the icon inside the slide toggle. */
    hideIcon?: boolean;
    /** Whether disabled slide toggles should remain interactive. */
    disabledInteractive?: boolean;
}
/** Injection token to be used to override the default options for `mat-slide-toggle`. */
declare const MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS: InjectionToken<MatSlideToggleDefaultOptions>;

/** Change event object emitted by a slide toggle. */
declare class MatSlideToggleChange {
    /** The source slide toggle of the event. */
    source: MatSlideToggle;
    /** The new `checked` value of the slide toggle. */
    checked: boolean;
    constructor(
    /** The source slide toggle of the event. */
    source: MatSlideToggle, 
    /** The new `checked` value of the slide toggle. */
    checked: boolean);
}
declare class MatSlideToggle implements OnDestroy, AfterContentInit, OnChanges, ControlValueAccessor, Validator {
    private _elementRef;
    protected _focusMonitor: FocusMonitor;
    protected _changeDetectorRef: ChangeDetectorRef;
    defaults: MatSlideToggleDefaultOptions;
    private _onChange;
    private _onTouched;
    private _validatorOnChange;
    private _uniqueId;
    private _checked;
    private _createChangeEvent;
    /** Unique ID for the label element. */
    _labelId: string;
    /** Returns the unique id for the visual hidden button. */
    get buttonId(): string;
    /** Reference to the MDC switch element. */
    _switchElement: ElementRef<HTMLElement>;
    /** Focuses the slide-toggle. */
    focus(): void;
    /** Whether noop animations are enabled. */
    _noopAnimations: boolean;
    /** Whether the slide toggle is currently focused. */
    _focused: boolean;
    /** Name value will be applied to the input element if present. */
    name: string | null;
    /** A unique id for the slide-toggle input. If none is supplied, it will be auto-generated. */
    id: string;
    /** Whether the label should appear after or before the slide-toggle. Defaults to 'after'. */
    labelPosition: 'before' | 'after';
    /** Used to set the aria-label attribute on the underlying input element. */
    ariaLabel: string | null;
    /** Used to set the aria-labelledby attribute on the underlying input element. */
    ariaLabelledby: string | null;
    /** Used to set the aria-describedby attribute on the underlying input element. */
    ariaDescribedby: string;
    /** Whether the slide-toggle is required. */
    required: boolean;
    /**
     * Theme color of the slide toggle. This API is supported in M2 themes only,
     * it has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/slide-toggle/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color: string | undefined;
    /** Whether the slide toggle is disabled. */
    disabled: boolean;
    /** Whether the slide toggle has a ripple. */
    disableRipple: boolean;
    /** Tabindex of slide toggle. */
    tabIndex: number;
    /** Whether the slide-toggle element is checked or not. */
    get checked(): boolean;
    set checked(value: boolean);
    /** Whether to hide the icon inside of the slide toggle. */
    hideIcon: boolean;
    /** Whether the slide toggle should remain interactive when it is disabled. */
    disabledInteractive: boolean;
    /** An event will be dispatched each time the slide-toggle changes its value. */
    readonly change: EventEmitter<MatSlideToggleChange>;
    /**
     * An event will be dispatched each time the slide-toggle input is toggled.
     * This event is always emitted when the user toggles the slide toggle, but this does not mean
     * the slide toggle's value has changed.
     */
    readonly toggleChange: EventEmitter<void>;
    /** Returns the unique id for the visual hidden input. */
    get inputId(): string;
    constructor(...args: unknown[]);
    ngAfterContentInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /** Implemented as part of ControlValueAccessor. */
    writeValue(value: any): void;
    /** Implemented as part of ControlValueAccessor. */
    registerOnChange(fn: any): void;
    /** Implemented as part of ControlValueAccessor. */
    registerOnTouched(fn: any): void;
    /** Implemented as a part of Validator. */
    validate(control: AbstractControl<boolean>): ValidationErrors | null;
    /** Implemented as a part of Validator. */
    registerOnValidatorChange(fn: () => void): void;
    /** Implemented as a part of ControlValueAccessor. */
    setDisabledState(isDisabled: boolean): void;
    /** Toggles the checked state of the slide-toggle. */
    toggle(): void;
    /**
     * Emits a change event on the `change` output. Also notifies the FormControl about the change.
     */
    protected _emitChangeEvent(): void;
    /** Method being called whenever the underlying button is clicked. */
    _handleClick(): void;
    _getAriaLabelledBy(): string | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSlideToggle, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatSlideToggle, "mat-slide-toggle", ["matSlideToggle"], { "name": { "alias": "name"; "required": false; }; "id": { "alias": "id"; "required": false; }; "labelPosition": { "alias": "labelPosition"; "required": false; }; "ariaLabel": { "alias": "aria-label"; "required": false; }; "ariaLabelledby": { "alias": "aria-labelledby"; "required": false; }; "ariaDescribedby": { "alias": "aria-describedby"; "required": false; }; "required": { "alias": "required"; "required": false; }; "color": { "alias": "color"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "disableRipple": { "alias": "disableRipple"; "required": false; }; "tabIndex": { "alias": "tabIndex"; "required": false; }; "checked": { "alias": "checked"; "required": false; }; "hideIcon": { "alias": "hideIcon"; "required": false; }; "disabledInteractive": { "alias": "disabledInteractive"; "required": false; }; }, { "change": "change"; "toggleChange": "toggleChange"; }, never, ["*"], true, never>;
    static ngAcceptInputType_required: unknown;
    static ngAcceptInputType_disabled: unknown;
    static ngAcceptInputType_disableRipple: unknown;
    static ngAcceptInputType_tabIndex: unknown;
    static ngAcceptInputType_checked: unknown;
    static ngAcceptInputType_hideIcon: unknown;
    static ngAcceptInputType_disabledInteractive: unknown;
}

declare class MatSlideToggleModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSlideToggleModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatSlideToggleModule, never, [typeof MatSlideToggle, typeof MatCommonModule], [typeof MatSlideToggle, typeof MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatSlideToggleModule>;
}

export { MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, MatSlideToggle, MatSlideToggleChange, MatSlideToggleModule };
export type { MatSlideToggleDefaultOptions };
