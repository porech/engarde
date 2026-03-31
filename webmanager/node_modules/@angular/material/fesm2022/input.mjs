import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform, getSupportedInputTypes } from '@angular/cdk/platform';
import { AutofillMonitor, TextFieldModule } from '@angular/cdk/text-field';
import * as i0 from '@angular/core';
import { InjectionToken, inject, ElementRef, NgZone, Renderer2, isSignal, effect, booleanAttribute, Directive, Input, NgModule } from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { NgControl, Validators, NgForm, FormGroupDirective } from '@angular/forms';
import { Subject } from 'rxjs';
import { MAT_INPUT_VALUE_ACCESSOR } from './input-value-accessor.mjs';
import { MAT_FORM_FIELD, MatFormFieldControl } from './form-field2.mjs';
export { MatError, MatFormField, MatHint, MatLabel, MatPrefix, MatSuffix } from './form-field2.mjs';
import { ErrorStateMatcher } from './error-options.mjs';
import { _ErrorStateTracker } from './error-state.mjs';
import { MatFormFieldModule } from './form-field-module.mjs';
import { MatCommonModule } from './common-module.mjs';
import '@angular/cdk/bidi';
import '@angular/common';
import 'rxjs/operators';
import '@angular/cdk/observers/private';
import './animation.mjs';
import '@angular/cdk/layout';
import '@angular/cdk/observers';

/** @docs-private */
function getMatInputUnsupportedTypeError(type) {
    return Error(`Input type "${type}" isn't supported by matInput.`);
}

// Invalid input type. Using one of these will throw an MatInputUnsupportedTypeError.
const MAT_INPUT_INVALID_TYPES = [
    'button',
    'checkbox',
    'file',
    'hidden',
    'image',
    'radio',
    'range',
    'reset',
    'submit',
];
/** Injection token that can be used to provide the default options for the input. */
const MAT_INPUT_CONFIG = new InjectionToken('MAT_INPUT_CONFIG');
class MatInput {
    _elementRef = inject(ElementRef);
    _platform = inject(Platform);
    ngControl = inject(NgControl, { optional: true, self: true });
    _autofillMonitor = inject(AutofillMonitor);
    _ngZone = inject(NgZone);
    _formField = inject(MAT_FORM_FIELD, { optional: true });
    _renderer = inject(Renderer2);
    _uid = inject(_IdGenerator).getId('mat-input-');
    _previousNativeValue;
    _inputValueAccessor;
    _signalBasedValueAccessor;
    _previousPlaceholder;
    _errorStateTracker;
    _config = inject(MAT_INPUT_CONFIG, { optional: true });
    _cleanupIosKeyup;
    _cleanupWebkitWheel;
    /** Whether the component is being rendered on the server. */
    _isServer;
    /** Whether the component is a native html select. */
    _isNativeSelect;
    /** Whether the component is a textarea. */
    _isTextarea;
    /** Whether the input is inside of a form field. */
    _isInFormField;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    focused = false;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    stateChanges = new Subject();
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    controlType = 'mat-input';
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    autofilled = false;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        // Browsers may not fire the blur event if the input is disabled too quickly.
        // Reset from here to ensure that the element doesn't become stuck.
        if (this.focused) {
            this.focused = false;
            this.stateChanges.next();
        }
    }
    _disabled = false;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value || this._uid;
    }
    _id;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    placeholder;
    /**
     * Name of the input.
     * @docs-private
     */
    name;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get required() {
        return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false;
    }
    set required(value) {
        this._required = coerceBooleanProperty(value);
    }
    _required;
    /** Input type of the element. */
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value || 'text';
        this._validateType();
        // When using Angular inputs, developers are no longer able to set the properties on the native
        // input element. To ensure that bindings for `type` work, we need to sync the setter
        // with the native property. Textarea elements don't support the type property or attribute.
        if (!this._isTextarea && getSupportedInputTypes().has(this._type)) {
            this._elementRef.nativeElement.type = this._type;
        }
    }
    _type = 'text';
    /** An object used to control when error messages are shown. */
    get errorStateMatcher() {
        return this._errorStateTracker.matcher;
    }
    set errorStateMatcher(value) {
        this._errorStateTracker.matcher = value;
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    userAriaDescribedBy;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get value() {
        return this._signalBasedValueAccessor
            ? this._signalBasedValueAccessor.value()
            : this._inputValueAccessor.value;
    }
    set value(value) {
        if (value !== this.value) {
            if (this._signalBasedValueAccessor) {
                this._signalBasedValueAccessor.value.set(value);
            }
            else {
                this._inputValueAccessor.value = value;
            }
            this.stateChanges.next();
        }
    }
    /** Whether the element is readonly. */
    get readonly() {
        return this._readonly;
    }
    set readonly(value) {
        this._readonly = coerceBooleanProperty(value);
    }
    _readonly = false;
    /** Whether the input should remain interactive when it is disabled. */
    disabledInteractive;
    /** Whether the input is in an error state. */
    get errorState() {
        return this._errorStateTracker.errorState;
    }
    set errorState(value) {
        this._errorStateTracker.errorState = value;
    }
    _neverEmptyInputTypes = [
        'date',
        'datetime',
        'datetime-local',
        'month',
        'time',
        'week',
    ].filter(t => getSupportedInputTypes().has(t));
    constructor() {
        const parentForm = inject(NgForm, { optional: true });
        const parentFormGroup = inject(FormGroupDirective, { optional: true });
        const defaultErrorStateMatcher = inject(ErrorStateMatcher);
        const accessor = inject(MAT_INPUT_VALUE_ACCESSOR, { optional: true, self: true });
        const element = this._elementRef.nativeElement;
        const nodeName = element.nodeName.toLowerCase();
        if (accessor) {
            if (isSignal(accessor.value)) {
                this._signalBasedValueAccessor = accessor;
            }
            else {
                this._inputValueAccessor = accessor;
            }
        }
        else {
            // If no input value accessor was explicitly specified, use the element as the input value
            // accessor.
            this._inputValueAccessor = element;
        }
        this._previousNativeValue = this.value;
        // Force setter to be called in case id was not specified.
        this.id = this.id;
        // On some versions of iOS the caret gets stuck in the wrong place when holding down the delete
        // key. In order to get around this we need to "jiggle" the caret loose. Since this bug only
        // exists on iOS, we only bother to install the listener on iOS.
        if (this._platform.IOS) {
            this._ngZone.runOutsideAngular(() => {
                this._cleanupIosKeyup = this._renderer.listen(element, 'keyup', this._iOSKeyupListener);
            });
        }
        this._errorStateTracker = new _ErrorStateTracker(defaultErrorStateMatcher, this.ngControl, parentFormGroup, parentForm, this.stateChanges);
        this._isServer = !this._platform.isBrowser;
        this._isNativeSelect = nodeName === 'select';
        this._isTextarea = nodeName === 'textarea';
        this._isInFormField = !!this._formField;
        this.disabledInteractive = this._config?.disabledInteractive || false;
        if (this._isNativeSelect) {
            this.controlType = element.multiple
                ? 'mat-native-select-multiple'
                : 'mat-native-select';
        }
        if (this._signalBasedValueAccessor) {
            effect(() => {
                // Read the value so the effect can register the dependency.
                this._signalBasedValueAccessor.value();
                this.stateChanges.next();
            });
        }
    }
    ngAfterViewInit() {
        if (this._platform.isBrowser) {
            this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(event => {
                this.autofilled = event.isAutofilled;
                this.stateChanges.next();
            });
        }
    }
    ngOnChanges() {
        this.stateChanges.next();
    }
    ngOnDestroy() {
        this.stateChanges.complete();
        if (this._platform.isBrowser) {
            this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement);
        }
        this._cleanupIosKeyup?.();
        this._cleanupWebkitWheel?.();
    }
    ngDoCheck() {
        if (this.ngControl) {
            // We need to re-evaluate this on every change detection cycle, because there are some
            // error triggers that we can't subscribe to (e.g. parent form submissions). This means
            // that whatever logic is in here has to be super lean or we risk destroying the performance.
            this.updateErrorState();
            // Since the input isn't a `ControlValueAccessor`, we don't have a good way of knowing when
            // the disabled state has changed. We can't use the `ngControl.statusChanges`, because it
            // won't fire if the input is disabled with `emitEvents = false`, despite the input becoming
            // disabled.
            if (this.ngControl.disabled !== null && this.ngControl.disabled !== this.disabled) {
                this.disabled = this.ngControl.disabled;
                this.stateChanges.next();
            }
        }
        // We need to dirty-check the native element's value, because there are some cases where
        // we won't be notified when it changes (e.g. the consumer isn't using forms or they're
        // updating the value using `emitEvent: false`).
        this._dirtyCheckNativeValue();
        // We need to dirty-check and set the placeholder attribute ourselves, because whether it's
        // present or not depends on a query which is prone to "changed after checked" errors.
        this._dirtyCheckPlaceholder();
    }
    /** Focuses the input. */
    focus(options) {
        this._elementRef.nativeElement.focus(options);
    }
    /** Refreshes the error state of the input. */
    updateErrorState() {
        this._errorStateTracker.updateErrorState();
    }
    /** Callback for the cases where the focused state of the input changes. */
    _focusChanged(isFocused) {
        if (isFocused === this.focused) {
            return;
        }
        if (!this._isNativeSelect && isFocused && this.disabled && this.disabledInteractive) {
            const element = this._elementRef.nativeElement;
            // Focusing an input that has text will cause all the text to be selected. Clear it since
            // the user won't be able to change it. This is based on the internal implementation.
            if (element.type === 'number') {
                // setSelectionRange doesn't work on number inputs so it needs to be set briefly to text.
                element.type = 'text';
                element.setSelectionRange(0, 0);
                element.type = 'number';
            }
            else {
                element.setSelectionRange(0, 0);
            }
        }
        this.focused = isFocused;
        this.stateChanges.next();
    }
    _onInput() {
        // This is a noop function and is used to let Angular know whenever the value changes.
        // Angular will run a new change detection each time the `input` event has been dispatched.
        // It's necessary that Angular recognizes the value change, because when floatingLabel
        // is set to false and Angular forms aren't used, the placeholder won't recognize the
        // value changes and will not disappear.
        // Listening to the input event wouldn't be necessary when the input is using the
        // FormsModule or ReactiveFormsModule, because Angular forms also listens to input events.
    }
    /** Does some manual dirty checking on the native input `value` property. */
    _dirtyCheckNativeValue() {
        const newValue = this._elementRef.nativeElement.value;
        if (this._previousNativeValue !== newValue) {
            this._previousNativeValue = newValue;
            this.stateChanges.next();
        }
    }
    /** Does some manual dirty checking on the native input `placeholder` attribute. */
    _dirtyCheckPlaceholder() {
        const placeholder = this._getPlaceholder();
        if (placeholder !== this._previousPlaceholder) {
            const element = this._elementRef.nativeElement;
            this._previousPlaceholder = placeholder;
            placeholder
                ? element.setAttribute('placeholder', placeholder)
                : element.removeAttribute('placeholder');
        }
    }
    /** Gets the current placeholder of the form field. */
    _getPlaceholder() {
        return this.placeholder || null;
    }
    /** Make sure the input is a supported type. */
    _validateType() {
        if (MAT_INPUT_INVALID_TYPES.indexOf(this._type) > -1 &&
            (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw getMatInputUnsupportedTypeError(this._type);
        }
    }
    /** Checks whether the input type is one of the types that are never empty. */
    _isNeverEmpty() {
        return this._neverEmptyInputTypes.indexOf(this._type) > -1;
    }
    /** Checks whether the input is invalid based on the native validation. */
    _isBadInput() {
        // The `validity` property won't be present on platform-server.
        let validity = this._elementRef.nativeElement.validity;
        return validity && validity.badInput;
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get empty() {
        return (!this._isNeverEmpty() &&
            !this._elementRef.nativeElement.value &&
            !this._isBadInput() &&
            !this.autofilled);
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get shouldLabelFloat() {
        if (this._isNativeSelect) {
            // For a single-selection `<select>`, the label should float when the selected option has
            // a non-empty display value. For a `<select multiple>`, the label *always* floats to avoid
            // overlapping the label with the options.
            const selectElement = this._elementRef.nativeElement;
            const firstOption = selectElement.options[0];
            // On most browsers the `selectedIndex` will always be 0, however on IE and Edge it'll be
            // -1 if the `value` is set to something, that isn't in the list of options, at a later point.
            return (this.focused ||
                selectElement.multiple ||
                !this.empty ||
                !!(selectElement.selectedIndex > -1 && firstOption && firstOption.label));
        }
        else {
            return (this.focused && !this.disabled) || !this.empty;
        }
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get describedByIds() {
        const element = this._elementRef.nativeElement;
        const existingDescribedBy = element.getAttribute('aria-describedby');
        return existingDescribedBy?.split(' ') || [];
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    setDescribedByIds(ids) {
        const element = this._elementRef.nativeElement;
        if (ids.length) {
            element.setAttribute('aria-describedby', ids.join(' '));
        }
        else {
            element.removeAttribute('aria-describedby');
        }
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    onContainerClick() {
        // Do not re-focus the input element if the element is already focused. Otherwise it can happen
        // that someone clicks on a time input and the cursor resets to the "hours" field while the
        // "minutes" field was actually clicked. See: https://github.com/angular/components/issues/12849
        if (!this.focused) {
            this.focus();
        }
    }
    /** Whether the form control is a native select that is displayed inline. */
    _isInlineSelect() {
        const element = this._elementRef.nativeElement;
        return this._isNativeSelect && (element.multiple || element.size > 1);
    }
    _iOSKeyupListener = (event) => {
        const el = event.target;
        // Note: We specifically check for 0, rather than `!el.selectionStart`, because the two
        // indicate different things. If the value is 0, it means that the caret is at the start
        // of the input, whereas a value of `null` means that the input doesn't support
        // manipulating the selection range. Inputs that don't support setting the selection range
        // will throw an error so we want to avoid calling `setSelectionRange` on them. See:
        // https://html.spec.whatwg.org/multipage/input.html#do-not-apply
        if (!el.value && el.selectionStart === 0 && el.selectionEnd === 0) {
            // Note: Just setting `0, 0` doesn't fix the issue. Setting
            // `1, 1` fixes it for the first time that you type text and
            // then hold delete. Toggling to `1, 1` and then back to
            // `0, 0` seems to completely fix it.
            el.setSelectionRange(1, 1);
            el.setSelectionRange(0, 0);
        }
    };
    /** Gets the value to set on the `readonly` attribute. */
    _getReadonlyAttribute() {
        if (this._isNativeSelect) {
            return null;
        }
        if (this.readonly || (this.disabled && this.disabledInteractive)) {
            return 'true';
        }
        return null;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatInput, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "20.2.0-next.2", type: MatInput, isStandalone: true, selector: "input[matInput], textarea[matInput], select[matNativeControl],\n      input[matNativeControl], textarea[matNativeControl]", inputs: { disabled: "disabled", id: "id", placeholder: "placeholder", name: "name", required: "required", type: "type", errorStateMatcher: "errorStateMatcher", userAriaDescribedBy: ["aria-describedby", "userAriaDescribedBy"], value: "value", readonly: "readonly", disabledInteractive: ["disabledInteractive", "disabledInteractive", booleanAttribute] }, host: { listeners: { "focus": "_focusChanged(true)", "blur": "_focusChanged(false)", "input": "_onInput()" }, properties: { "class.mat-input-server": "_isServer", "class.mat-mdc-form-field-textarea-control": "_isInFormField && _isTextarea", "class.mat-mdc-form-field-input-control": "_isInFormField", "class.mat-mdc-input-disabled-interactive": "disabledInteractive", "class.mdc-text-field__input": "_isInFormField", "class.mat-mdc-native-select-inline": "_isInlineSelect()", "id": "id", "disabled": "disabled && !disabledInteractive", "required": "required", "attr.name": "name || null", "attr.readonly": "_getReadonlyAttribute()", "attr.aria-disabled": "disabled && disabledInteractive ? \"true\" : null", "attr.aria-invalid": "(empty && required) ? null : errorState", "attr.aria-required": "required", "attr.id": "id" }, classAttribute: "mat-mdc-input-element" }, providers: [{ provide: MatFormFieldControl, useExisting: MatInput }], exportAs: ["matInput"], usesOnChanges: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatInput, decorators: [{
            type: Directive,
            args: [{
                    selector: `input[matInput], textarea[matInput], select[matNativeControl],
      input[matNativeControl], textarea[matNativeControl]`,
                    exportAs: 'matInput',
                    host: {
                        'class': 'mat-mdc-input-element',
                        // The BaseMatInput parent class adds `mat-input-element`, `mat-form-field-control` and
                        // `mat-form-field-autofill-control` to the CSS class list, but this should not be added for
                        // this MDC equivalent input.
                        '[class.mat-input-server]': '_isServer',
                        '[class.mat-mdc-form-field-textarea-control]': '_isInFormField && _isTextarea',
                        '[class.mat-mdc-form-field-input-control]': '_isInFormField',
                        '[class.mat-mdc-input-disabled-interactive]': 'disabledInteractive',
                        '[class.mdc-text-field__input]': '_isInFormField',
                        '[class.mat-mdc-native-select-inline]': '_isInlineSelect()',
                        // Native input properties that are overwritten by Angular inputs need to be synced with
                        // the native input element. Otherwise property bindings for those don't work.
                        '[id]': 'id',
                        '[disabled]': 'disabled && !disabledInteractive',
                        '[required]': 'required',
                        '[attr.name]': 'name || null',
                        '[attr.readonly]': '_getReadonlyAttribute()',
                        '[attr.aria-disabled]': 'disabled && disabledInteractive ? "true" : null',
                        // Only mark the input as invalid for assistive technology if it has a value since the
                        // state usually overlaps with `aria-required` when the input is empty and can be redundant.
                        '[attr.aria-invalid]': '(empty && required) ? null : errorState',
                        '[attr.aria-required]': 'required',
                        // Native input properties that are overwritten by Angular inputs need to be synced with
                        // the native input element. Otherwise property bindings for those don't work.
                        '[attr.id]': 'id',
                        '(focus)': '_focusChanged(true)',
                        '(blur)': '_focusChanged(false)',
                        '(input)': '_onInput()',
                    },
                    providers: [{ provide: MatFormFieldControl, useExisting: MatInput }],
                }]
        }], ctorParameters: () => [], propDecorators: { disabled: [{
                type: Input
            }], id: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], name: [{
                type: Input
            }], required: [{
                type: Input
            }], type: [{
                type: Input
            }], errorStateMatcher: [{
                type: Input
            }], userAriaDescribedBy: [{
                type: Input,
                args: ['aria-describedby']
            }], value: [{
                type: Input
            }], readonly: [{
                type: Input
            }], disabledInteractive: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });

class MatInputModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatInputModule, imports: [MatCommonModule, MatFormFieldModule, MatInput], exports: [MatInput, MatFormFieldModule, TextFieldModule, MatCommonModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatInputModule, imports: [MatCommonModule, MatFormFieldModule, MatFormFieldModule, TextFieldModule, MatCommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatInputModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule, MatFormFieldModule, MatInput],
                    exports: [MatInput, MatFormFieldModule, TextFieldModule, MatCommonModule],
                }]
        }] });

export { MAT_INPUT_CONFIG, MAT_INPUT_VALUE_ACCESSOR, MatInput, MatInputModule, getMatInputUnsupportedTypeError };
//# sourceMappingURL=input.mjs.map
