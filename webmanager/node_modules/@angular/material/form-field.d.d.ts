import * as i0 from '@angular/core';
import { InjectionToken, OnDestroy, AfterViewInit, ElementRef, AfterContentInit, AfterContentChecked, QueryList } from '@angular/core';
import { BooleanInput } from '@angular/cdk/coercion';
import { AbstractControlDirective } from '@angular/forms';
import { ThemePalette } from './palette.d.js';
import { MatFormFieldControl as MatFormFieldControl$1 } from './form-field-control.d.js';

/**
 * Injection token that can be used to reference instances of `MatError`. It serves as
 * alternative token to the actual `MatError` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
declare const MAT_ERROR: InjectionToken<MatError>;
/** Single error message to be shown underneath the form-field. */
declare class MatError {
    id: string;
    constructor(...args: unknown[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatError, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatError, "mat-error, [matError]", never, { "id": { "alias": "id"; "required": false; }; }, {}, never, never, true, never>;
}

/** Hint text to be shown underneath the form field control. */
declare class MatHint {
    /** Whether to align the hint label at the start or end of the line. */
    align: 'start' | 'end';
    /** Unique ID for the hint. Used for the aria-describedby on the form field control. */
    id: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatHint, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatHint, "mat-hint", never, { "align": { "alias": "align"; "required": false; }; "id": { "alias": "id"; "required": false; }; }, {}, never, never, true, never>;
}

/**
 * Injection token that can be used to reference instances of `MatPrefix`. It serves as
 * alternative token to the actual `MatPrefix` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
declare const MAT_PREFIX: InjectionToken<MatPrefix>;
/** Prefix to be placed in front of the form field. */
declare class MatPrefix {
    set _isTextSelector(value: '');
    _isText: boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatPrefix, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatPrefix, "[matPrefix], [matIconPrefix], [matTextPrefix]", never, { "_isTextSelector": { "alias": "matTextPrefix"; "required": false; }; }, {}, never, never, true, never>;
}

/**
 * Injection token that can be used to reference instances of `MatSuffix`. It serves as
 * alternative token to the actual `MatSuffix` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
declare const MAT_SUFFIX: InjectionToken<MatSuffix>;
/** Suffix to be placed at the end of the form field. */
declare class MatSuffix {
    set _isTextSelector(value: '');
    _isText: boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSuffix, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatSuffix, "[matSuffix], [matIconSuffix], [matTextSuffix]", never, { "_isTextSelector": { "alias": "matTextSuffix"; "required": false; }; }, {}, never, never, true, never>;
}

/** An interface that the parent form-field should implement to receive resize events. */
interface FloatingLabelParent {
    _handleLabelResized(): void;
}
/**
 * Internal directive that maintains a MDC floating label. This directive does not
 * use the `MDCFloatingLabelFoundation` class, as it is not worth the size cost of
 * including it just to measure the label width and toggle some classes.
 *
 * The use of a directive allows us to conditionally render a floating label in the
 * template without having to manually manage instantiation and destruction of the
 * floating label component based on.
 *
 * The component is responsible for setting up the floating label styles, measuring label
 * width for the outline notch, and providing inputs that can be used to toggle the
 * label's floating or required state.
 */
declare class MatFormFieldFloatingLabel implements OnDestroy {
    private _elementRef;
    /** Whether the label is floating. */
    get floating(): boolean;
    set floating(value: boolean);
    private _floating;
    /** Whether to monitor for resize events on the floating label. */
    get monitorResize(): boolean;
    set monitorResize(value: boolean);
    private _monitorResize;
    /** The shared ResizeObserver. */
    private _resizeObserver;
    /** The Angular zone. */
    private _ngZone;
    /** The parent form-field. */
    private _parent;
    /** The current resize event subscription. */
    private _resizeSubscription;
    constructor(...args: unknown[]);
    ngOnDestroy(): void;
    /** Gets the width of the label. Used for the outline notch. */
    getWidth(): number;
    /** Gets the HTML element for the floating label. */
    get element(): HTMLElement;
    /** Handles resize events from the ResizeObserver. */
    private _handleResize;
    /** Subscribes to resize events. */
    private _subscribeToResize;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFormFieldFloatingLabel, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatFormFieldFloatingLabel, "label[matFormFieldFloatingLabel]", never, { "floating": { "alias": "floating"; "required": false; }; "monitorResize": { "alias": "monitorResize"; "required": false; }; }, {}, never, never, true, never>;
}

/**
 * Internal directive that creates an instance of the MDC line-ripple component. Using a
 * directive allows us to conditionally render a line-ripple in the template without having
 * to manually create and destroy the `MDCLineRipple` component whenever the condition changes.
 *
 * The directive sets up the styles for the line-ripple and provides an API for activating
 * and deactivating the line-ripple.
 */
declare class MatFormFieldLineRipple implements OnDestroy {
    private _elementRef;
    private _cleanupTransitionEnd;
    constructor(...args: unknown[]);
    activate(): void;
    deactivate(): void;
    private _handleTransitionEnd;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFormFieldLineRipple, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatFormFieldLineRipple, "div[matFormFieldLineRipple]", never, {}, {}, never, never, true, never>;
}

/**
 * Internal component that creates an instance of the MDC notched-outline component.
 *
 * The component sets up the HTML structure and styles for the notched-outline. It provides
 * inputs to toggle the notch state and width.
 */
declare class MatFormFieldNotchedOutline implements AfterViewInit {
    private _elementRef;
    private _ngZone;
    /** Whether the notch should be opened. */
    open: boolean;
    _notch: ElementRef<HTMLElement>;
    ngAfterViewInit(): void;
    _setNotchWidth(labelWidth: number): void;
    _setMaxWidth(prefixAndSuffixWidth: number): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFormFieldNotchedOutline, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatFormFieldNotchedOutline, "div[matFormFieldNotchedOutline]", never, { "open": { "alias": "matFormFieldNotchedOutlineOpen"; "required": false; }; }, {}, never, ["*"], true, never>;
}

/** Type for the available floatLabel values. */
type FloatLabelType = 'always' | 'auto';
/** Possible appearance styles for the form field. */
type MatFormFieldAppearance = 'fill' | 'outline';
/** Behaviors for how the subscript height is set. */
type SubscriptSizing = 'fixed' | 'dynamic';
/**
 * Represents the default options for the form field that can be configured
 * using the `MAT_FORM_FIELD_DEFAULT_OPTIONS` injection token.
 */
interface MatFormFieldDefaultOptions {
    /** Default form field appearance style. */
    appearance?: MatFormFieldAppearance;
    /**
     * Default theme color of the form field. This API is supported in M2 themes only, it has no
     * effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/form-field/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color?: ThemePalette;
    /** Whether the required marker should be hidden by default. */
    hideRequiredMarker?: boolean;
    /**
     * Whether the label for form fields should by default float `always`,
     * `never`, or `auto` (only when necessary).
     */
    floatLabel?: FloatLabelType;
    /** Whether the form field should reserve space for one line by default. */
    subscriptSizing?: SubscriptSizing;
}
/**
 * Injection token that can be used to inject an instances of `MatFormField`. It serves
 * as alternative token to the actual `MatFormField` class which would cause unnecessary
 * retention of the `MatFormField` class and its component metadata.
 */
declare const MAT_FORM_FIELD: InjectionToken<MatFormField>;
/**
 * Injection token that can be used to configure the
 * default options for all form field within an app.
 */
declare const MAT_FORM_FIELD_DEFAULT_OPTIONS: InjectionToken<MatFormFieldDefaultOptions>;
/**
 * Despite `MatFormFieldControl` being an abstract class, most of our usages enforce its shape
 * using `implements` instead of `extends`. This appears to be problematic when Closure compiler
 * is configured to use type information to rename properties, because it can't figure out which
 * class properties are coming from. This interface seems to work around the issue while preserving
 * our type safety (alternative being using `any` everywhere).
 * @docs-private
 */
interface MatFormFieldControl<T> extends MatFormFieldControl$1<T> {
}
/** Container for form controls that applies Material Design styling and behavior. */
declare class MatFormField implements FloatingLabelParent, AfterContentInit, AfterContentChecked, AfterViewInit, OnDestroy {
    _elementRef: ElementRef<any>;
    private _changeDetectorRef;
    private _platform;
    private _idGenerator;
    private _ngZone;
    private _defaults;
    private _currentDirection;
    _textField: ElementRef<HTMLElement>;
    _iconPrefixContainer: ElementRef<HTMLElement>;
    _textPrefixContainer: ElementRef<HTMLElement>;
    _iconSuffixContainer: ElementRef<HTMLElement>;
    _textSuffixContainer: ElementRef<HTMLElement>;
    _floatingLabel: MatFormFieldFloatingLabel | undefined;
    _notchedOutline: MatFormFieldNotchedOutline | undefined;
    _lineRipple: MatFormFieldLineRipple | undefined;
    private _iconPrefixContainerSignal;
    private _textPrefixContainerSignal;
    private _iconSuffixContainerSignal;
    private _textSuffixContainerSignal;
    private _prefixSuffixContainers;
    _formFieldControl: MatFormFieldControl<any>;
    _prefixChildren: QueryList<MatPrefix>;
    _suffixChildren: QueryList<MatSuffix>;
    _errorChildren: QueryList<MatError>;
    _hintChildren: QueryList<MatHint>;
    private readonly _labelChild;
    /** Whether the required marker should be hidden. */
    get hideRequiredMarker(): boolean;
    set hideRequiredMarker(value: BooleanInput);
    private _hideRequiredMarker;
    /**
     * Theme color of the form field. This API is supported in M2 themes only, it
     * has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/form-field/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color: ThemePalette;
    /** Whether the label should always float or float as the user types. */
    get floatLabel(): FloatLabelType;
    set floatLabel(value: FloatLabelType);
    private _floatLabel;
    /** The form field appearance style. */
    get appearance(): MatFormFieldAppearance;
    set appearance(value: MatFormFieldAppearance);
    private _appearanceSignal;
    /**
     * Whether the form field should reserve space for one line of hint/error text (default)
     * or to have the spacing grow from 0px as needed based on the size of the hint/error content.
     * Note that when using dynamic sizing, layout shifts will occur when hint/error text changes.
     */
    get subscriptSizing(): SubscriptSizing;
    set subscriptSizing(value: SubscriptSizing);
    private _subscriptSizing;
    /** Text for the form field hint. */
    get hintLabel(): string;
    set hintLabel(value: string);
    private _hintLabel;
    _hasIconPrefix: boolean;
    _hasTextPrefix: boolean;
    _hasIconSuffix: boolean;
    _hasTextSuffix: boolean;
    readonly _labelId: string;
    readonly _hintLabelId: string;
    private _describedByIds;
    /** Gets the current form field control */
    get _control(): MatFormFieldControl<any>;
    set _control(value: MatFormFieldControl<any>);
    private _destroyed;
    private _isFocused;
    private _explicitFormFieldControl;
    private _previousControl;
    private _previousControlValidatorFn;
    private _stateChanges;
    private _valueChanges;
    private _describedByChanges;
    private _outlineLabelOffsetResizeObserver;
    protected readonly _animationsDisabled: boolean;
    constructor(...args: unknown[]);
    ngAfterViewInit(): void;
    ngAfterContentInit(): void;
    ngAfterContentChecked(): void;
    ngOnDestroy(): void;
    /**
     * Gets the id of the label element. If no label is present, returns `null`.
     */
    getLabelId: i0.Signal<string | null>;
    /**
     * Gets an ElementRef for the element that a overlay attached to the form field
     * should be positioned relative to.
     */
    getConnectedOverlayOrigin(): ElementRef;
    /** Animates the placeholder up and locks it in position. */
    _animateAndLockLabel(): void;
    /** Initializes the registered form field control. */
    private _initializeControl;
    private _checkPrefixAndSuffixTypes;
    /** Initializes the prefix and suffix containers. */
    private _initializePrefixAndSuffix;
    /**
     * Initializes the subscript by validating hints and synchronizing "aria-describedby" ids
     * with the custom form field control. Also subscribes to hint and error changes in order
     * to be able to validate and synchronize ids on change.
     */
    private _initializeSubscript;
    /** Throws an error if the form field's control is missing. */
    private _assertFormFieldControl;
    private _updateFocusState;
    /**
     * The floating label in the docked state needs to account for prefixes. The horizontal offset
     * is calculated whenever the appearance changes to `outline`, the prefixes change, or when the
     * form field is added to the DOM. This method sets up all subscriptions which are needed to
     * trigger the label offset update.
     */
    private _syncOutlineLabelOffset;
    /** Whether the floating label should always float or not. */
    _shouldAlwaysFloat(): boolean;
    _hasOutline(): boolean;
    /**
     * Whether the label should display in the infix. Labels in the outline appearance are
     * displayed as part of the notched-outline and are horizontally offset to account for
     * form field prefix content. This won't work in server side rendering since we cannot
     * measure the width of the prefix container. To make the docked label appear as if the
     * right offset has been calculated, we forcibly render the label inside the infix. Since
     * the label is part of the infix, the label cannot overflow the prefix content.
     */
    _forceDisplayInfixLabel(): boolean | 0;
    _hasFloatingLabel: i0.Signal<boolean>;
    _shouldLabelFloat(): boolean;
    /**
     * Determines whether a class from the AbstractControlDirective
     * should be forwarded to the host element.
     */
    _shouldForward(prop: keyof AbstractControlDirective): boolean;
    /** Gets the type of subscript message to render (error or hint). */
    _getSubscriptMessageType(): 'error' | 'hint';
    /** Handle label resize events. */
    _handleLabelResized(): void;
    /** Refreshes the width of the outline-notch, if present. */
    _refreshOutlineNotchWidth(): void;
    /** Does any extra processing that is required when handling the hints. */
    private _processHints;
    /**
     * Ensure that there is a maximum of one of each "mat-hint" alignment specified. The hint
     * label specified set through the input is being considered as "start" aligned.
     *
     * This method is a noop if Angular runs in production mode.
     */
    private _validateHints;
    /**
     * Sets the list of element IDs that describe the child control. This allows the control to update
     * its `aria-describedby` attribute accordingly.
     */
    private _syncDescribedByIds;
    /**
     * Calculates the horizontal offset of the label in the outline appearance. In the outline
     * appearance, the notched-outline and label are not relative to the infix container because
     * the outline intends to surround prefixes, suffixes and the infix. This means that the
     * floating label by default overlaps prefixes in the docked state. To avoid this, we need to
     * horizontally offset the label by the width of the prefix container. The MDC text-field does
     * not need to do this because they use a fixed width for prefixes. Hence, they can simply
     * incorporate the horizontal offset into their default text-field styles.
     */
    private _getOutlinedLabelOffset;
    /** Writes the styles produced by `_getOutlineLabelOffset` synchronously to the DOM. */
    private _writeOutlinedLabelStyles;
    /** Checks whether the form field is attached to the DOM. */
    private _isAttachedToDom;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFormField, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatFormField, "mat-form-field", ["matFormField"], { "hideRequiredMarker": { "alias": "hideRequiredMarker"; "required": false; }; "color": { "alias": "color"; "required": false; }; "floatLabel": { "alias": "floatLabel"; "required": false; }; "appearance": { "alias": "appearance"; "required": false; }; "subscriptSizing": { "alias": "subscriptSizing"; "required": false; }; "hintLabel": { "alias": "hintLabel"; "required": false; }; }, {}, ["_labelChild", "_formFieldControl", "_prefixChildren", "_suffixChildren", "_errorChildren", "_hintChildren"], ["mat-label", "[matPrefix], [matIconPrefix]", "[matTextPrefix]", "*", "[matTextSuffix]", "[matSuffix], [matIconSuffix]", "mat-error, [matError]", "mat-hint:not([align='end'])", "mat-hint[align='end']"], true, never>;
}

export { MAT_ERROR, MAT_FORM_FIELD, MAT_FORM_FIELD_DEFAULT_OPTIONS, MAT_PREFIX, MAT_SUFFIX, MatError, MatFormField, MatHint, MatPrefix, MatSuffix };
export type { FloatLabelType, MatFormFieldAppearance, MatFormFieldDefaultOptions, SubscriptSizing };
