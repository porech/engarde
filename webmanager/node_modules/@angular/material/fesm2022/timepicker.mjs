import * as i0 from '@angular/core';
import { InjectionToken, inject, Injector, ViewContainerRef, signal, viewChild, viewChildren, input, output, booleanAttribute, computed, effect, ElementRef, afterNextRender, untracked, Component, ChangeDetectionStrategy, ViewEncapsulation, model, Renderer2, Directive, HostAttributeToken, NgModule } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { createRepositionScrollStrategy, createFlexibleConnectedPositionStrategy, createOverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { _getEventTarget, _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { TAB, ESCAPE, hasModifierKey, ENTER, DOWN_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
import { ActiveDescendantKeyManager, _IdGenerator } from '@angular/cdk/a11y';
import { DateAdapter, MAT_DATE_FORMATS } from './date-formats.mjs';
import { _animationsDisabled } from './animation.mjs';
import { MatOption, MAT_OPTION_PARENT_COMPONENT } from './option.mjs';
import { Validators, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { MAT_FORM_FIELD } from './form-field2.mjs';
import { MAT_INPUT_VALUE_ACCESSOR } from './input-value-accessor.mjs';
import { MatIconButton } from './icon-button.mjs';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import 'rxjs';
import '@angular/cdk/layout';
import './ripple.mjs';
import '@angular/cdk/coercion';
import '@angular/cdk/private';
import './pseudo-checkbox.mjs';
import './structural-styles.mjs';
import '@angular/common';
import 'rxjs/operators';
import '@angular/cdk/observers/private';
import './ripple-loader.mjs';

/** Pattern that interval strings have to match. */
const INTERVAL_PATTERN = /^(\d*\.?\d+)\s*(h|hour|hours|m|min|minute|minutes|s|second|seconds)?$/i;
/**
 * Injection token that can be used to configure the default options for the timepicker component.
 */
const MAT_TIMEPICKER_CONFIG = new InjectionToken('MAT_TIMEPICKER_CONFIG');
/** Parses an interval value into seconds. */
function parseInterval(value) {
    let result;
    if (value === null) {
        return null;
    }
    else if (typeof value === 'number') {
        result = value;
    }
    else {
        if (value.trim().length === 0) {
            return null;
        }
        const parsed = value.match(INTERVAL_PATTERN);
        const amount = parsed ? parseFloat(parsed[1]) : null;
        const unit = parsed?.[2]?.toLowerCase() || null;
        if (!parsed || amount === null || isNaN(amount)) {
            return null;
        }
        if (unit === 'h' || unit === 'hour' || unit === 'hours') {
            result = amount * 3600;
        }
        else if (unit === 'm' || unit === 'min' || unit === 'minute' || unit === 'minutes') {
            result = amount * 60;
        }
        else {
            result = amount;
        }
    }
    return result;
}
/**
 * Generates the options to show in a timepicker.
 * @param adapter Date adapter to be used to generate the options.
 * @param formats Formatting config to use when displaying the options.
 * @param min Time from which to start generating the options.
 * @param max Time at which to stop generating the options.
 * @param interval Amount of seconds between each option.
 */
function generateOptions(adapter, formats, min, max, interval) {
    const options = [];
    let current = adapter.compareTime(min, max) < 1 ? min : max;
    while (adapter.sameDate(current, min) &&
        adapter.compareTime(current, max) < 1 &&
        adapter.isValid(current)) {
        options.push({ value: current, label: adapter.format(current, formats.display.timeOptionLabel) });
        current = adapter.addSeconds(current, interval);
    }
    return options;
}
/** Checks whether a date adapter is set up correctly for use with the timepicker. */
function validateAdapter(adapter, formats) {
    function missingAdapterError(provider) {
        return Error(`MatTimepicker: No provider found for ${provider}. You must add one of the following ` +
            `to your app config: provideNativeDateAdapter, provideDateFnsAdapter, ` +
            `provideLuxonDateAdapter, provideMomentDateAdapter, or provide a custom implementation.`);
    }
    if (!adapter) {
        throw missingAdapterError('DateAdapter');
    }
    if (!formats) {
        throw missingAdapterError('MAT_DATE_FORMATS');
    }
    if (formats.display.timeInput === undefined ||
        formats.display.timeOptionLabel === undefined ||
        formats.parse.timeInput === undefined) {
        throw new Error('MatTimepicker: Incomplete `MAT_DATE_FORMATS` has been provided. ' +
            '`MAT_DATE_FORMATS` must provide `display.timeInput`, `display.timeOptionLabel` ' +
            'and `parse.timeInput` formats in order to be compatible with MatTimepicker.');
    }
}

/** Injection token used to configure the behavior of the timepicker dropdown while scrolling. */
const MAT_TIMEPICKER_SCROLL_STRATEGY = new InjectionToken('MAT_TIMEPICKER_SCROLL_STRATEGY', {
    providedIn: 'root',
    factory: () => {
        const injector = inject(Injector);
        return () => createRepositionScrollStrategy(injector);
    },
});
/**
 * Renders out a listbox that can be used to select a time of day.
 * Intended to be used together with `MatTimepickerInput`.
 */
class MatTimepicker {
    _dir = inject(Directionality, { optional: true });
    _viewContainerRef = inject(ViewContainerRef);
    _injector = inject(Injector);
    _defaultConfig = inject(MAT_TIMEPICKER_CONFIG, { optional: true });
    _dateAdapter = inject(DateAdapter, { optional: true });
    _dateFormats = inject(MAT_DATE_FORMATS, { optional: true });
    _scrollStrategyFactory = inject(MAT_TIMEPICKER_SCROLL_STRATEGY);
    _animationsDisabled = _animationsDisabled();
    _isOpen = signal(false, ...(ngDevMode ? [{ debugName: "_isOpen" }] : []));
    _activeDescendant = signal(null, ...(ngDevMode ? [{ debugName: "_activeDescendant" }] : []));
    _input = signal(null, ...(ngDevMode ? [{ debugName: "_input" }] : []));
    _overlayRef = null;
    _portal = null;
    _optionsCacheKey = null;
    _localeChanges;
    _onOpenRender = null;
    _panelTemplate = viewChild.required('panelTemplate');
    _timeOptions = [];
    _options = viewChildren(MatOption, ...(ngDevMode ? [{ debugName: "_options" }] : []));
    _keyManager = new ActiveDescendantKeyManager(this._options, this._injector)
        .withHomeAndEnd(true)
        .withPageUpDown(true)
        .withVerticalOrientation(true);
    /**
     * Interval between each option in the timepicker. The value can either be an amount of
     * seconds (e.g. 90) or a number with a unit (e.g. 45m). Supported units are `s` for seconds,
     * `m` for minutes or `h` for hours.
     */
    interval = input(parseInterval(this._defaultConfig?.interval || null), ...(ngDevMode ? [{ debugName: "interval", transform: parseInterval }] : [{ transform: parseInterval }]));
    /**
     * Array of pre-defined options that the user can select from, as an alternative to using the
     * `interval` input. An error will be thrown if both `options` and `interval` are specified.
     */
    options = input(null, ...(ngDevMode ? [{ debugName: "options" }] : []));
    /** Whether the timepicker is open. */
    isOpen = this._isOpen.asReadonly();
    /** Emits when the user selects a time. */
    selected = output();
    /** Emits when the timepicker is opened. */
    opened = output();
    /** Emits when the timepicker is closed. */
    closed = output();
    /** ID of the active descendant option. */
    activeDescendant = this._activeDescendant.asReadonly();
    /** Unique ID of the timepicker's panel */
    panelId = inject(_IdGenerator).getId('mat-timepicker-panel-');
    /** Whether ripples within the timepicker should be disabled. */
    disableRipple = input(this._defaultConfig?.disableRipple ?? false, ...(ngDevMode ? [{ debugName: "disableRipple", transform: booleanAttribute }] : [{
            transform: booleanAttribute,
        }]));
    /** ARIA label for the timepicker panel. */
    ariaLabel = input(null, ...(ngDevMode ? [{ debugName: "ariaLabel", alias: 'aria-label' }] : [{
            alias: 'aria-label',
        }]));
    /** ID of the label element for the timepicker panel. */
    ariaLabelledby = input(null, ...(ngDevMode ? [{ debugName: "ariaLabelledby", alias: 'aria-labelledby' }] : [{
            alias: 'aria-labelledby',
        }]));
    /** Whether the timepicker is currently disabled. */
    disabled = computed(() => !!this._input()?.disabled(), ...(ngDevMode ? [{ debugName: "disabled" }] : []));
    constructor() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            validateAdapter(this._dateAdapter, this._dateFormats);
            effect(() => {
                const options = this.options();
                const interval = this.interval();
                if (options !== null && interval !== null) {
                    throw new Error('Cannot specify both the `options` and `interval` inputs at the same time');
                }
                else if (options?.length === 0) {
                    throw new Error('Value of `options` input cannot be an empty array');
                }
            });
        }
        // Since the panel ID is static, we can set it once without having to maintain a host binding.
        const element = inject(ElementRef);
        element.nativeElement.setAttribute('mat-timepicker-panel-id', this.panelId);
        this._handleLocaleChanges();
        this._handleInputStateChanges();
        this._keyManager.change.subscribe(() => this._activeDescendant.set(this._keyManager.activeItem?.id || null));
    }
    /** Opens the timepicker. */
    open() {
        const input = this._input();
        if (!input) {
            return;
        }
        // Focus should already be on the input, but this call is in case the timepicker is opened
        // programmatically. We need to call this even if the timepicker is already open, because
        // the user might be clicking the toggle.
        input.focus();
        if (this._isOpen()) {
            return;
        }
        this._isOpen.set(true);
        this._generateOptions();
        const overlayRef = this._getOverlayRef();
        overlayRef.updateSize({ width: input.getOverlayOrigin().nativeElement.offsetWidth });
        this._portal ??= new TemplatePortal(this._panelTemplate(), this._viewContainerRef);
        // We need to check this in case `isOpen` was flipped, but change detection hasn't
        // had a chance to run yet. See https://github.com/angular/components/issues/30637
        if (!overlayRef.hasAttached()) {
            overlayRef.attach(this._portal);
        }
        this._onOpenRender?.destroy();
        this._onOpenRender = afterNextRender(() => {
            const options = this._options();
            this._syncSelectedState(input.value(), options, options[0]);
            this._onOpenRender = null;
        }, { injector: this._injector });
        this.opened.emit();
    }
    /** Closes the timepicker. */
    close() {
        if (this._isOpen()) {
            this._isOpen.set(false);
            this.closed.emit();
            if (this._animationsDisabled) {
                this._overlayRef?.detach();
            }
        }
    }
    /** Registers an input with the timepicker. */
    registerInput(input) {
        const currentInput = this._input();
        if (currentInput && input !== currentInput && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw new Error('MatTimepicker can only be registered with one input at a time');
        }
        this._input.set(input);
    }
    ngOnDestroy() {
        this._keyManager.destroy();
        this._localeChanges.unsubscribe();
        this._onOpenRender?.destroy();
        this._overlayRef?.dispose();
    }
    /** Selects a specific time value. */
    _selectValue(option) {
        this.close();
        this._keyManager.setActiveItem(option);
        this._options().forEach(current => {
            // This is primarily here so we don't show two selected options while animating away.
            if (current !== option) {
                current.deselect(false);
            }
        });
        // Notify the input first so it can sync up the form control before emitting to `selected`.
        this._input()?._timepickerValueAssigned(option.value);
        this.selected.emit({ value: option.value, source: this });
        this._input()?.focus();
    }
    /** Gets the value of the `aria-labelledby` attribute. */
    _getAriaLabelledby() {
        if (this.ariaLabel()) {
            return null;
        }
        return this.ariaLabelledby() || this._input()?._getLabelId() || null;
    }
    /** Handles animation events coming from the panel. */
    _handleAnimationEnd(event) {
        if (event.animationName === '_mat-timepicker-exit') {
            this._overlayRef?.detach();
        }
    }
    /** Creates an overlay reference for the timepicker panel. */
    _getOverlayRef() {
        if (this._overlayRef) {
            return this._overlayRef;
        }
        const positionStrategy = createFlexibleConnectedPositionStrategy(this._injector, this._input().getOverlayOrigin())
            .withFlexibleDimensions(false)
            .withPush(false)
            .withTransformOriginOn('.mat-timepicker-panel')
            .withPositions([
            {
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'top',
            },
            {
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'bottom',
                panelClass: 'mat-timepicker-above',
            },
        ]);
        this._overlayRef = createOverlayRef(this._injector, {
            positionStrategy,
            scrollStrategy: this._scrollStrategyFactory(),
            direction: this._dir || 'ltr',
            hasBackdrop: false,
            disableAnimations: this._animationsDisabled,
        });
        this._overlayRef.detachments().subscribe(() => this.close());
        this._overlayRef.keydownEvents().subscribe(event => this._handleKeydown(event));
        this._overlayRef.outsidePointerEvents().subscribe(event => {
            const target = _getEventTarget(event);
            const origin = this._input()?.getOverlayOrigin().nativeElement;
            if (target && origin && target !== origin && !origin.contains(target)) {
                this.close();
            }
        });
        return this._overlayRef;
    }
    /** Generates the list of options from which the user can select.. */
    _generateOptions() {
        // Default the interval to 30 minutes.
        const interval = this.interval() ?? 30 * 60;
        const options = this.options();
        if (options !== null) {
            this._timeOptions = options;
        }
        else {
            const input = this._input();
            const adapter = this._dateAdapter;
            const timeFormat = this._dateFormats.display.timeInput;
            const min = input?.min() || adapter.setTime(adapter.today(), 0, 0, 0);
            const max = input?.max() || adapter.setTime(adapter.today(), 23, 59, 0);
            const cacheKey = interval + '/' + adapter.format(min, timeFormat) + '/' + adapter.format(max, timeFormat);
            // Don't re-generate the options if the inputs haven't changed.
            if (cacheKey !== this._optionsCacheKey) {
                this._optionsCacheKey = cacheKey;
                this._timeOptions = generateOptions(adapter, this._dateFormats, min, max, interval);
            }
        }
    }
    /**
     * Synchronizes the internal state of the component based on a specific selected date.
     * @param value Currently selected date.
     * @param options Options rendered out in the timepicker.
     * @param fallback Option to set as active if no option is selected.
     */
    _syncSelectedState(value, options, fallback) {
        let hasSelected = false;
        for (const option of options) {
            if (value && this._dateAdapter.sameTime(option.value, value)) {
                option.select(false);
                scrollOptionIntoView(option, 'center');
                untracked(() => this._keyManager.setActiveItem(option));
                hasSelected = true;
            }
            else {
                option.deselect(false);
            }
        }
        // If no option was selected, we need to reset the key manager since
        // it might be holding onto an option that no longer exists.
        if (!hasSelected) {
            if (fallback) {
                untracked(() => this._keyManager.setActiveItem(fallback));
                scrollOptionIntoView(fallback, 'center');
            }
            else {
                untracked(() => this._keyManager.setActiveItem(-1));
            }
        }
    }
    /** Handles keyboard events while the overlay is open. */
    _handleKeydown(event) {
        const keyCode = event.keyCode;
        if (keyCode === TAB) {
            this.close();
        }
        else if (keyCode === ESCAPE && !hasModifierKey(event)) {
            event.preventDefault();
            this.close();
        }
        else if (keyCode === ENTER) {
            event.preventDefault();
            if (this._keyManager.activeItem) {
                this._selectValue(this._keyManager.activeItem);
            }
            else {
                this.close();
            }
        }
        else {
            const previousActive = this._keyManager.activeItem;
            this._keyManager.onKeydown(event);
            const currentActive = this._keyManager.activeItem;
            if (currentActive && currentActive !== previousActive) {
                scrollOptionIntoView(currentActive, 'nearest');
            }
        }
    }
    /** Sets up the logic that updates the timepicker when the locale changes. */
    _handleLocaleChanges() {
        // Re-generate the options list if the locale changes.
        this._localeChanges = this._dateAdapter.localeChanges.subscribe(() => {
            this._optionsCacheKey = null;
            if (this.isOpen()) {
                this._generateOptions();
            }
        });
    }
    /**
     * Sets up the logic that updates the timepicker when the state of the connected input changes.
     */
    _handleInputStateChanges() {
        effect(() => {
            const input = this._input();
            const options = this._options();
            if (this._isOpen() && input) {
                this._syncSelectedState(input.value(), options, null);
            }
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatTimepicker, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.0-next.2", type: MatTimepicker, isStandalone: true, selector: "mat-timepicker", inputs: { interval: { classPropertyName: "interval", publicName: "interval", isSignal: true, isRequired: false, transformFunction: null }, options: { classPropertyName: "options", publicName: "options", isSignal: true, isRequired: false, transformFunction: null }, disableRipple: { classPropertyName: "disableRipple", publicName: "disableRipple", isSignal: true, isRequired: false, transformFunction: null }, ariaLabel: { classPropertyName: "ariaLabel", publicName: "aria-label", isSignal: true, isRequired: false, transformFunction: null }, ariaLabelledby: { classPropertyName: "ariaLabelledby", publicName: "aria-labelledby", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { selected: "selected", opened: "opened", closed: "closed" }, providers: [
            {
                provide: MAT_OPTION_PARENT_COMPONENT,
                useExisting: MatTimepicker,
            },
        ], viewQueries: [{ propertyName: "_panelTemplate", first: true, predicate: ["panelTemplate"], descendants: true, isSignal: true }, { propertyName: "_options", predicate: MatOption, descendants: true, isSignal: true }], exportAs: ["matTimepicker"], ngImport: i0, template: "<ng-template #panelTemplate>\n  <div\n    role=\"listbox\"\n    class=\"mat-timepicker-panel\"\n    [class.mat-timepicker-panel-animations-enabled]=\"!_animationsDisabled\"\n    [class.mat-timepicker-panel-exit]=\"!isOpen()\"\n    [attr.aria-label]=\"ariaLabel() || null\"\n    [attr.aria-labelledby]=\"_getAriaLabelledby()\"\n    [id]=\"panelId\"\n    (animationend)=\"_handleAnimationEnd($event)\">\n    @for (option of _timeOptions; track option.value) {\n      <mat-option\n        [value]=\"option.value\"\n        (onSelectionChange)=\"_selectValue($event.source)\">{{option.label}}</mat-option>\n    }\n  </div>\n</ng-template>\n", styles: ["@keyframes _mat-timepicker-enter{from{opacity:0;transform:scaleY(0.8)}to{opacity:1;transform:none}}@keyframes _mat-timepicker-exit{from{opacity:1}to{opacity:0}}mat-timepicker{display:none}.mat-timepicker-panel{width:100%;max-height:256px;transform-origin:center top;overflow:auto;padding:8px 0;box-sizing:border-box;position:relative;border-bottom-left-radius:var(--mat-timepicker-container-shape, var(--mat-sys-corner-extra-small));border-bottom-right-radius:var(--mat-timepicker-container-shape, var(--mat-sys-corner-extra-small));box-shadow:var(--mat-timepicker-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));background-color:var(--mat-timepicker-container-background-color, var(--mat-sys-surface-container))}@media(forced-colors: active){.mat-timepicker-panel{outline:solid 1px}}.mat-timepicker-above .mat-timepicker-panel{border-bottom-left-radius:0;border-bottom-right-radius:0;border-top-left-radius:var(--mat-timepicker-container-shape, var(--mat-sys-corner-extra-small));border-top-right-radius:var(--mat-timepicker-container-shape, var(--mat-sys-corner-extra-small))}.mat-timepicker-panel-animations-enabled{animation:_mat-timepicker-enter 120ms cubic-bezier(0, 0, 0.2, 1)}.mat-timepicker-panel-animations-enabled.mat-timepicker-panel-exit{animation:_mat-timepicker-exit 100ms linear}.mat-timepicker-input[readonly]{cursor:pointer}@media(forced-colors: active){.mat-timepicker-toggle-default-icon{color:CanvasText}}\n"], dependencies: [{ kind: "component", type: MatOption, selector: "mat-option", inputs: ["value", "id", "disabled"], outputs: ["onSelectionChange"], exportAs: ["matOption"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatTimepicker, decorators: [{
            type: Component,
            args: [{ selector: 'mat-timepicker', exportAs: 'matTimepicker', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [MatOption], providers: [
                        {
                            provide: MAT_OPTION_PARENT_COMPONENT,
                            useExisting: MatTimepicker,
                        },
                    ], template: "<ng-template #panelTemplate>\n  <div\n    role=\"listbox\"\n    class=\"mat-timepicker-panel\"\n    [class.mat-timepicker-panel-animations-enabled]=\"!_animationsDisabled\"\n    [class.mat-timepicker-panel-exit]=\"!isOpen()\"\n    [attr.aria-label]=\"ariaLabel() || null\"\n    [attr.aria-labelledby]=\"_getAriaLabelledby()\"\n    [id]=\"panelId\"\n    (animationend)=\"_handleAnimationEnd($event)\">\n    @for (option of _timeOptions; track option.value) {\n      <mat-option\n        [value]=\"option.value\"\n        (onSelectionChange)=\"_selectValue($event.source)\">{{option.label}}</mat-option>\n    }\n  </div>\n</ng-template>\n", styles: ["@keyframes _mat-timepicker-enter{from{opacity:0;transform:scaleY(0.8)}to{opacity:1;transform:none}}@keyframes _mat-timepicker-exit{from{opacity:1}to{opacity:0}}mat-timepicker{display:none}.mat-timepicker-panel{width:100%;max-height:256px;transform-origin:center top;overflow:auto;padding:8px 0;box-sizing:border-box;position:relative;border-bottom-left-radius:var(--mat-timepicker-container-shape, var(--mat-sys-corner-extra-small));border-bottom-right-radius:var(--mat-timepicker-container-shape, var(--mat-sys-corner-extra-small));box-shadow:var(--mat-timepicker-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));background-color:var(--mat-timepicker-container-background-color, var(--mat-sys-surface-container))}@media(forced-colors: active){.mat-timepicker-panel{outline:solid 1px}}.mat-timepicker-above .mat-timepicker-panel{border-bottom-left-radius:0;border-bottom-right-radius:0;border-top-left-radius:var(--mat-timepicker-container-shape, var(--mat-sys-corner-extra-small));border-top-right-radius:var(--mat-timepicker-container-shape, var(--mat-sys-corner-extra-small))}.mat-timepicker-panel-animations-enabled{animation:_mat-timepicker-enter 120ms cubic-bezier(0, 0, 0.2, 1)}.mat-timepicker-panel-animations-enabled.mat-timepicker-panel-exit{animation:_mat-timepicker-exit 100ms linear}.mat-timepicker-input[readonly]{cursor:pointer}@media(forced-colors: active){.mat-timepicker-toggle-default-icon{color:CanvasText}}\n"] }]
        }], ctorParameters: () => [] });
/**
 * Scrolls an option into view.
 * @param option Option to be scrolled into view.
 * @param position Position to which to align the option relative to the scrollable container.
 */
function scrollOptionIntoView(option, position) {
    option._getHostElement().scrollIntoView({ block: position, inline: position });
}

/**
 * Input that can be used to enter time and connect to a `mat-timepicker`.
 */
class MatTimepickerInput {
    _elementRef = inject(ElementRef);
    _dateAdapter = inject(DateAdapter, { optional: true });
    _dateFormats = inject(MAT_DATE_FORMATS, { optional: true });
    _formField = inject(MAT_FORM_FIELD, { optional: true });
    _onChange;
    _onTouched;
    _validatorOnChange;
    _cleanupClick;
    _accessorDisabled = signal(false, ...(ngDevMode ? [{ debugName: "_accessorDisabled" }] : []));
    _localeSubscription;
    _timepickerSubscription;
    _validator;
    _lastValueValid = true;
    _lastValidDate = null;
    /** Value of the `aria-activedescendant` attribute. */
    _ariaActiveDescendant = computed(() => {
        const timepicker = this.timepicker();
        const isOpen = timepicker.isOpen();
        const activeDescendant = timepicker.activeDescendant();
        return isOpen && activeDescendant ? activeDescendant : null;
    }, ...(ngDevMode ? [{ debugName: "_ariaActiveDescendant" }] : []));
    /** Value of the `aria-expanded` attribute. */
    _ariaExpanded = computed(() => this.timepicker().isOpen() + '', ...(ngDevMode ? [{ debugName: "_ariaExpanded" }] : []));
    /** Value of the `aria-controls` attribute. */
    _ariaControls = computed(() => {
        const timepicker = this.timepicker();
        return timepicker.isOpen() ? timepicker.panelId : null;
    }, ...(ngDevMode ? [{ debugName: "_ariaControls" }] : []));
    /** Current value of the input. */
    value = model(null, ...(ngDevMode ? [{ debugName: "value" }] : []));
    /** Timepicker that the input is associated with. */
    timepicker = input.required(...(ngDevMode ? [{ debugName: "timepicker", alias: 'matTimepicker' }] : [{
            alias: 'matTimepicker',
        }]));
    /**
     * Minimum time that can be selected or typed in. Can be either
     * a date object (only time will be used) or a valid time string.
     */
    min = input(null, ...(ngDevMode ? [{ debugName: "min", alias: 'matTimepickerMin',
            transform: (value) => this._transformDateInput(value) }] : [{
            alias: 'matTimepickerMin',
            transform: (value) => this._transformDateInput(value),
        }]));
    /**
     * Maximum time that can be selected or typed in. Can be either
     * a date object (only time will be used) or a valid time string.
     */
    max = input(null, ...(ngDevMode ? [{ debugName: "max", alias: 'matTimepickerMax',
            transform: (value) => this._transformDateInput(value) }] : [{
            alias: 'matTimepickerMax',
            transform: (value) => this._transformDateInput(value),
        }]));
    /**
     * Whether to open the timepicker overlay when clicking on the input. Enabled by default.
     * Note that when disabling this option, you'll have to provide your own logic for opening
     * the overlay.
     */
    openOnClick = input(true, ...(ngDevMode ? [{ debugName: "openOnClick", alias: 'matTimepickerOpenOnClick',
            transform: booleanAttribute }] : [{
            alias: 'matTimepickerOpenOnClick',
            transform: booleanAttribute,
        }]));
    /** Whether the input is disabled. */
    disabled = computed(() => this.disabledInput() || this._accessorDisabled(), ...(ngDevMode ? [{ debugName: "disabled" }] : []));
    /**
     * Whether the input should be disabled through the template.
     * @docs-private
     */
    disabledInput = input(false, ...(ngDevMode ? [{ debugName: "disabledInput", transform: booleanAttribute,
            alias: 'disabled' }] : [{
            transform: booleanAttribute,
            alias: 'disabled',
        }]));
    constructor() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            validateAdapter(this._dateAdapter, this._dateFormats);
        }
        const renderer = inject(Renderer2);
        this._validator = this._getValidator();
        this._respondToValueChanges();
        this._respondToMinMaxChanges();
        this._registerTimepicker();
        this._localeSubscription = this._dateAdapter.localeChanges.subscribe(() => {
            if (!this._hasFocus()) {
                this._formatValue(this.value());
            }
        });
        // Bind the click listener manually to the overlay origin, because we want the entire
        // form field to be clickable, if the timepicker is used in `mat-form-field`.
        this._cleanupClick = renderer.listen(this.getOverlayOrigin().nativeElement, 'click', this._handleClick);
    }
    /**
     * Implemented as a part of `ControlValueAccessor`.
     * @docs-private
     */
    writeValue(value) {
        // Note that we need to deserialize here, rather than depend on the value change effect,
        // because `getValidDateOrNull` will clobber the value if it's parseable, but not created by
        // the current adapter (see #30140).
        const deserialized = this._dateAdapter.deserialize(value);
        this.value.set(this._dateAdapter.getValidDateOrNull(deserialized));
    }
    /**
     * Implemented as a part of `ControlValueAccessor`.
     * @docs-private
     */
    registerOnChange(fn) {
        this._onChange = fn;
    }
    /**
     * Implemented as a part of `ControlValueAccessor`.
     * @docs-private
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * Implemented as a part of `ControlValueAccessor`.
     * @docs-private
     */
    setDisabledState(isDisabled) {
        this._accessorDisabled.set(isDisabled);
    }
    /**
     * Implemented as a part of `Validator`.
     * @docs-private
     */
    validate(control) {
        return this._validator(control);
    }
    /**
     * Implemented as a part of `Validator`.
     * @docs-private
     */
    registerOnValidatorChange(fn) {
        this._validatorOnChange = fn;
    }
    /** Gets the element to which the timepicker popup should be attached. */
    getOverlayOrigin() {
        return this._formField?.getConnectedOverlayOrigin() || this._elementRef;
    }
    /** Focuses the input. */
    focus() {
        this._elementRef.nativeElement.focus();
    }
    ngOnDestroy() {
        this._cleanupClick();
        this._timepickerSubscription?.unsubscribe();
        this._localeSubscription.unsubscribe();
    }
    /** Gets the ID of the input's label. */
    _getLabelId() {
        return this._formField?.getLabelId() || null;
    }
    /** Handles clicks on the input or the containing form field. */
    _handleClick = () => {
        if (!this.disabled() && this.openOnClick()) {
            this.timepicker().open();
        }
    };
    /** Handles the `input` event. */
    _handleInput(event) {
        const value = event.target.value;
        const currentValue = this.value();
        const date = this._dateAdapter.parseTime(value, this._dateFormats.parse.timeInput);
        const hasChanged = !this._dateAdapter.sameTime(date, currentValue);
        if (!date || hasChanged || !!(value && !currentValue)) {
            // We need to fire the CVA change event for all nulls, otherwise the validators won't run.
            this._assignUserSelection(date, true);
        }
        else {
            // Call the validator even if the value hasn't changed since
            // some fields change depending on what the user has entered.
            this._validatorOnChange?.();
        }
    }
    /** Handles the `blur` event. */
    _handleBlur() {
        const value = this.value();
        // Only reformat on blur so the value doesn't change while the user is interacting.
        if (value && this._isValid(value)) {
            this._formatValue(value);
        }
        if (!this.timepicker().isOpen()) {
            this._onTouched?.();
        }
    }
    /** Handles the `keydown` event. */
    _handleKeydown(event) {
        // All keyboard events while open are handled through the timepicker.
        if (this.timepicker().isOpen() || this.disabled()) {
            return;
        }
        if (event.keyCode === ESCAPE && !hasModifierKey(event) && this.value() !== null) {
            event.preventDefault();
            this.value.set(null);
            this._formatValue(null);
        }
        else if (event.keyCode === DOWN_ARROW || event.keyCode === UP_ARROW) {
            event.preventDefault();
            this.timepicker().open();
        }
    }
    /** Called by the timepicker to sync up the user-selected value. */
    _timepickerValueAssigned(value) {
        if (!this._dateAdapter.sameTime(value, this.value())) {
            this._assignUserSelection(value, true);
            this._formatValue(value);
        }
    }
    /** Sets up the code that watches for changes in the value and adjusts the input. */
    _respondToValueChanges() {
        effect(() => {
            const value = this._dateAdapter.deserialize(this.value());
            const wasValid = this._lastValueValid;
            this._lastValueValid = this._isValid(value);
            // Reformat the value if it changes while the user isn't interacting.
            if (!this._hasFocus()) {
                this._formatValue(value);
            }
            if (value && this._lastValueValid) {
                this._lastValidDate = value;
            }
            // Trigger the validator if the state changed.
            if (wasValid !== this._lastValueValid) {
                this._validatorOnChange?.();
            }
        });
    }
    /** Sets up the logic that registers the input with the timepicker. */
    _registerTimepicker() {
        effect(() => {
            const timepicker = this.timepicker();
            timepicker.registerInput(this);
            timepicker.closed.subscribe(() => this._onTouched?.());
        });
    }
    /** Sets up the logic that adjusts the input if the min/max changes. */
    _respondToMinMaxChanges() {
        effect(() => {
            // Read the min/max so the effect knows when to fire.
            this.min();
            this.max();
            this._validatorOnChange?.();
        });
    }
    /**
     * Assigns a value set by the user to the input's model.
     * @param selection Time selected by the user that should be assigned.
     * @param propagateToAccessor Whether the value should be propagated to the ControlValueAccessor.
     */
    _assignUserSelection(selection, propagateToAccessor) {
        let toAssign;
        if (selection == null || !this._isValid(selection)) {
            toAssign = selection;
        }
        else {
            // If a datepicker and timepicker are writing to the same object and the user enters an
            // invalid time into the timepicker, we may end up clearing their selection from the
            // datepicker. If the user enters a valid time afterwards, the datepicker's selection will
            // have been lost. This logic restores the previously-valid date and sets its time to
            // the newly-selected time.
            const adapter = this._dateAdapter;
            const target = adapter.getValidDateOrNull(this._lastValidDate || this.value());
            const hours = adapter.getHours(selection);
            const minutes = adapter.getMinutes(selection);
            const seconds = adapter.getSeconds(selection);
            toAssign = target ? adapter.setTime(target, hours, minutes, seconds) : selection;
        }
        // Propagate to the form control before emitting to `valueChange`.
        if (propagateToAccessor) {
            this._onChange?.(toAssign);
        }
        this.value.set(toAssign);
    }
    /** Formats the current value and assigns it to the input. */
    _formatValue(value) {
        value = this._dateAdapter.getValidDateOrNull(value);
        this._elementRef.nativeElement.value =
            value == null ? '' : this._dateAdapter.format(value, this._dateFormats.display.timeInput);
    }
    /** Checks whether a value is valid. */
    _isValid(value) {
        return !value || this._dateAdapter.isValid(value);
    }
    /** Transforms an arbitrary value into a value that can be assigned to a date-based input. */
    _transformDateInput(value) {
        const date = typeof value === 'string'
            ? this._dateAdapter.parseTime(value, this._dateFormats.parse.timeInput)
            : this._dateAdapter.deserialize(value);
        return date && this._dateAdapter.isValid(date) ? date : null;
    }
    /** Whether the input is currently focused. */
    _hasFocus() {
        return _getFocusedElementPierceShadowDom() === this._elementRef.nativeElement;
    }
    /** Gets a function that can be used to validate the input. */
    _getValidator() {
        return Validators.compose([
            () => this._lastValueValid
                ? null
                : { 'matTimepickerParse': { 'text': this._elementRef.nativeElement.value } },
            control => {
                const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
                const min = this.min();
                return !min || !controlValue || this._dateAdapter.compareTime(min, controlValue) <= 0
                    ? null
                    : { 'matTimepickerMin': { 'min': min, 'actual': controlValue } };
            },
            control => {
                const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
                const max = this.max();
                return !max || !controlValue || this._dateAdapter.compareTime(max, controlValue) >= 0
                    ? null
                    : { 'matTimepickerMax': { 'max': max, 'actual': controlValue } };
            },
        ]);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatTimepickerInput, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "20.2.0-next.2", type: MatTimepickerInput, isStandalone: true, selector: "input[matTimepicker]", inputs: { value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, timepicker: { classPropertyName: "timepicker", publicName: "matTimepicker", isSignal: true, isRequired: true, transformFunction: null }, min: { classPropertyName: "min", publicName: "matTimepickerMin", isSignal: true, isRequired: false, transformFunction: null }, max: { classPropertyName: "max", publicName: "matTimepickerMax", isSignal: true, isRequired: false, transformFunction: null }, openOnClick: { classPropertyName: "openOnClick", publicName: "matTimepickerOpenOnClick", isSignal: true, isRequired: false, transformFunction: null }, disabledInput: { classPropertyName: "disabledInput", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { value: "valueChange" }, host: { attributes: { "role": "combobox", "type": "text", "aria-haspopup": "listbox" }, listeners: { "blur": "_handleBlur()", "input": "_handleInput($event)", "keydown": "_handleKeydown($event)" }, properties: { "attr.aria-activedescendant": "_ariaActiveDescendant()", "attr.aria-expanded": "_ariaExpanded()", "attr.aria-controls": "_ariaControls()", "attr.mat-timepicker-id": "timepicker()?.panelId", "disabled": "disabled()" }, classAttribute: "mat-timepicker-input" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: MatTimepickerInput,
                multi: true,
            },
            {
                provide: NG_VALIDATORS,
                useExisting: MatTimepickerInput,
                multi: true,
            },
            {
                provide: MAT_INPUT_VALUE_ACCESSOR,
                useExisting: MatTimepickerInput,
            },
        ], exportAs: ["matTimepickerInput"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatTimepickerInput, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[matTimepicker]',
                    exportAs: 'matTimepickerInput',
                    host: {
                        'class': 'mat-timepicker-input',
                        'role': 'combobox',
                        'type': 'text',
                        'aria-haspopup': 'listbox',
                        '[attr.aria-activedescendant]': '_ariaActiveDescendant()',
                        '[attr.aria-expanded]': '_ariaExpanded()',
                        '[attr.aria-controls]': '_ariaControls()',
                        '[attr.mat-timepicker-id]': 'timepicker()?.panelId',
                        '[disabled]': 'disabled()',
                        '(blur)': '_handleBlur()',
                        '(input)': '_handleInput($event)',
                        '(keydown)': '_handleKeydown($event)',
                    },
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: MatTimepickerInput,
                            multi: true,
                        },
                        {
                            provide: NG_VALIDATORS,
                            useExisting: MatTimepickerInput,
                            multi: true,
                        },
                        {
                            provide: MAT_INPUT_VALUE_ACCESSOR,
                            useExisting: MatTimepickerInput,
                        },
                    ],
                }]
        }], ctorParameters: () => [] });

/** Button that can be used to open a `mat-timepicker`. */
class MatTimepickerToggle {
    _defaultConfig = inject(MAT_TIMEPICKER_CONFIG, { optional: true });
    _defaultTabIndex = (() => {
        const value = inject(new HostAttributeToken('tabindex'), { optional: true });
        const parsed = Number(value);
        return isNaN(parsed) ? null : parsed;
    })();
    _isDisabled = computed(() => {
        const timepicker = this.timepicker();
        return this.disabled() || timepicker.disabled();
    }, ...(ngDevMode ? [{ debugName: "_isDisabled" }] : []));
    /** Timepicker instance that the button will toggle. */
    timepicker = input.required(...(ngDevMode ? [{ debugName: "timepicker", alias: 'for' }] : [{
            alias: 'for',
        }]));
    /** Screen-reader label for the button. */
    ariaLabel = input(undefined, ...(ngDevMode ? [{ debugName: "ariaLabel", alias: 'aria-label' }] : [{
            alias: 'aria-label',
        }]));
    /** Screen-reader labelled by id for the button. */
    ariaLabelledby = input(undefined, ...(ngDevMode ? [{ debugName: "ariaLabelledby", alias: 'aria-labelledby' }] : [{
            alias: 'aria-labelledby',
        }]));
    /** Default aria-label for the toggle if none is provided. */
    _defaultAriaLabel = 'Open timepicker options';
    /** Whether the toggle button is disabled. */
    disabled = input(false, ...(ngDevMode ? [{ debugName: "disabled", transform: booleanAttribute,
            alias: 'disabled' }] : [{
            transform: booleanAttribute,
            alias: 'disabled',
        }]));
    /** Tabindex for the toggle. */
    tabIndex = input(this._defaultTabIndex, ...(ngDevMode ? [{ debugName: "tabIndex" }] : []));
    /** Whether ripples on the toggle should be disabled. */
    disableRipple = input(this._defaultConfig?.disableRipple ?? false, ...(ngDevMode ? [{ debugName: "disableRipple", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** Opens the connected timepicker. */
    _open(event) {
        if (this.timepicker() && !this._isDisabled()) {
            this.timepicker().open();
            event.stopPropagation();
        }
    }
    /**
     * Checks for ariaLabelledby and if empty uses custom
     * aria-label or defaultAriaLabel if neither is provided.
     */
    getAriaLabel() {
        return this.ariaLabelledby() ? null : this.ariaLabel() || this._defaultAriaLabel;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatTimepickerToggle, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "20.2.0-next.2", type: MatTimepickerToggle, isStandalone: true, selector: "mat-timepicker-toggle", inputs: { timepicker: { classPropertyName: "timepicker", publicName: "for", isSignal: true, isRequired: true, transformFunction: null }, ariaLabel: { classPropertyName: "ariaLabel", publicName: "aria-label", isSignal: true, isRequired: false, transformFunction: null }, ariaLabelledby: { classPropertyName: "ariaLabelledby", publicName: "aria-labelledby", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, tabIndex: { classPropertyName: "tabIndex", publicName: "tabIndex", isSignal: true, isRequired: false, transformFunction: null }, disableRipple: { classPropertyName: "disableRipple", publicName: "disableRipple", isSignal: true, isRequired: false, transformFunction: null } }, host: { listeners: { "click": "_open($event)" }, properties: { "attr.tabindex": "null" }, classAttribute: "mat-timepicker-toggle" }, exportAs: ["matTimepickerToggle"], ngImport: i0, template: "<button\n  matIconButton\n  type=\"button\"\n  aria-haspopup=\"listbox\"\n  [attr.aria-label]=\"getAriaLabel()\"\n  [attr.aria-labelledby]=\"ariaLabelledby()\"\n  [attr.aria-expanded]=\"timepicker().isOpen()\"\n  [tabIndex]=\"_isDisabled() ? -1 : tabIndex()\"\n  [disabled]=\"_isDisabled()\"\n  [disableRipple]=\"disableRipple()\">\n\n  <ng-content select=\"[matTimepickerToggleIcon]\">\n    <svg\n      class=\"mat-timepicker-toggle-default-icon\"\n      height=\"24px\"\n      width=\"24px\"\n      viewBox=\"0 -960 960 960\"\n      fill=\"currentColor\"\n      focusable=\"false\"\n      aria-hidden=\"true\">\n      <path d=\"m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z\"/>\n    </svg>\n  </ng-content>\n</button>\n", dependencies: [{ kind: "component", type: MatIconButton, selector: "button[mat-icon-button], a[mat-icon-button], button[matIconButton], a[matIconButton]", exportAs: ["matButton", "matAnchor"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatTimepickerToggle, decorators: [{
            type: Component,
            args: [{ selector: 'mat-timepicker-toggle', host: {
                        'class': 'mat-timepicker-toggle',
                        '[attr.tabindex]': 'null',
                        // Bind the `click` on the host, rather than the inner `button`, so that we can call
                        // `stopPropagation` on it without affecting the user's `click` handlers. We need to stop
                        // it so that the input doesn't get focused automatically by the form field (See #21836).
                        '(click)': '_open($event)',
                    }, exportAs: 'matTimepickerToggle', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, imports: [MatIconButton], template: "<button\n  matIconButton\n  type=\"button\"\n  aria-haspopup=\"listbox\"\n  [attr.aria-label]=\"getAriaLabel()\"\n  [attr.aria-labelledby]=\"ariaLabelledby()\"\n  [attr.aria-expanded]=\"timepicker().isOpen()\"\n  [tabIndex]=\"_isDisabled() ? -1 : tabIndex()\"\n  [disabled]=\"_isDisabled()\"\n  [disableRipple]=\"disableRipple()\">\n\n  <ng-content select=\"[matTimepickerToggleIcon]\">\n    <svg\n      class=\"mat-timepicker-toggle-default-icon\"\n      height=\"24px\"\n      width=\"24px\"\n      viewBox=\"0 -960 960 960\"\n      fill=\"currentColor\"\n      focusable=\"false\"\n      aria-hidden=\"true\">\n      <path d=\"m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z\"/>\n    </svg>\n  </ng-content>\n</button>\n" }]
        }] });

class MatTimepickerModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatTimepickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatTimepickerModule, imports: [MatTimepicker, MatTimepickerInput, MatTimepickerToggle], exports: [CdkScrollableModule, MatTimepicker, MatTimepickerInput, MatTimepickerToggle] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatTimepickerModule, imports: [MatTimepicker, MatTimepickerToggle, CdkScrollableModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatTimepickerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatTimepicker, MatTimepickerInput, MatTimepickerToggle],
                    exports: [CdkScrollableModule, MatTimepicker, MatTimepickerInput, MatTimepickerToggle],
                }]
        }] });

export { MAT_TIMEPICKER_CONFIG, MAT_TIMEPICKER_SCROLL_STRATEGY, MatTimepicker, MatTimepickerInput, MatTimepickerModule, MatTimepickerToggle };
//# sourceMappingURL=timepicker.mjs.map
