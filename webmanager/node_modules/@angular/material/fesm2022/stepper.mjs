import { TemplatePortal, CdkPortalOutlet, PortalModule } from '@angular/cdk/portal';
import { CdkStepLabel, CdkStepHeader, CdkStep, CdkStepper, CdkStepperNext, CdkStepperPrevious, CdkStepperModule } from '@angular/cdk/stepper';
import * as i0 from '@angular/core';
import { Directive, Injectable, Optional, SkipSelf, inject, ChangeDetectorRef, Component, ViewEncapsulation, ChangeDetectionStrategy, Input, TemplateRef, ViewContainerRef, ContentChild, NgZone, Renderer2, signal, QueryList, EventEmitter, ElementRef, ViewChildren, ContentChildren, Output, NgModule } from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subject, Subscription } from 'rxjs';
import { NgTemplateOutlet } from '@angular/common';
import { _CdkPrivateStyleLoader, _VisuallyHiddenLoader } from '@angular/cdk/private';
import { MatIcon, MatIconModule } from './icon.mjs';
import { _StructuralStylesLoader } from './structural-styles.mjs';
import { MatRipple } from './ripple.mjs';
import { Platform } from '@angular/cdk/platform';
import { switchMap, map, startWith, takeUntil } from 'rxjs/operators';
import { ErrorStateMatcher } from './error-options.mjs';
import { _animationsDisabled } from './animation.mjs';
import { MatCommonModule } from './common-module.mjs';
import { MatRippleModule } from './ripple-module.mjs';
import './icon-registry.mjs';
import '@angular/common/http';
import '@angular/platform-browser';
import '@angular/cdk/coercion';
import '@angular/cdk/layout';
import '@angular/cdk/bidi';

class MatStepLabel extends CdkStepLabel {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepLabel, deps: null, target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: MatStepLabel, isStandalone: true, selector: "[matStepLabel]", usesInheritance: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepLabel, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matStepLabel]',
                }]
        }] });

/** Stepper data that is required for internationalization. */
class MatStepperIntl {
    /**
     * Stream that emits whenever the labels here are changed. Use this to notify
     * components if the labels have changed after initialization.
     */
    changes = new Subject();
    /** Label that is rendered below optional steps. */
    optionalLabel = 'Optional';
    /** Label that is used to indicate step as completed to screen readers. */
    completedLabel = 'Completed';
    /** Label that is used to indicate step as editable to screen readers. */
    editableLabel = 'Editable';
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepperIntl, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepperIntl, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepperIntl, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
function MAT_STEPPER_INTL_PROVIDER_FACTORY(parentIntl) {
    return parentIntl || new MatStepperIntl();
}
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
const MAT_STEPPER_INTL_PROVIDER = {
    provide: MatStepperIntl,
    deps: [[new Optional(), new SkipSelf(), MatStepperIntl]],
    useFactory: MAT_STEPPER_INTL_PROVIDER_FACTORY,
};

class MatStepHeader extends CdkStepHeader {
    _intl = inject(MatStepperIntl);
    _focusMonitor = inject(FocusMonitor);
    _intlSubscription;
    /** State of the given step. */
    state;
    /** Label of the given step. */
    label;
    /** Error message to display when there's an error. */
    errorMessage;
    /** Overrides for the header icons, passed in via the stepper. */
    iconOverrides;
    /** Index of the given step. */
    index;
    /** Whether the given step is selected. */
    selected;
    /** Whether the given step label is active. */
    active;
    /** Whether the given step is optional. */
    optional;
    /** Whether the ripple should be disabled. */
    disableRipple;
    /**
     * Theme color of the step header. This API is supported in M2 themes only, it
     * has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/stepper/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color;
    constructor() {
        super();
        const styleLoader = inject(_CdkPrivateStyleLoader);
        styleLoader.load(_StructuralStylesLoader);
        styleLoader.load(_VisuallyHiddenLoader);
        const changeDetectorRef = inject(ChangeDetectorRef);
        this._intlSubscription = this._intl.changes.subscribe(() => changeDetectorRef.markForCheck());
    }
    ngAfterViewInit() {
        this._focusMonitor.monitor(this._elementRef, true);
    }
    ngOnDestroy() {
        this._intlSubscription.unsubscribe();
        this._focusMonitor.stopMonitoring(this._elementRef);
    }
    /** Focuses the step header. */
    focus(origin, options) {
        if (origin) {
            this._focusMonitor.focusVia(this._elementRef, origin, options);
        }
        else {
            this._elementRef.nativeElement.focus(options);
        }
    }
    /** Returns string label of given step if it is a text label. */
    _stringLabel() {
        return this.label instanceof MatStepLabel ? null : this.label;
    }
    /** Returns MatStepLabel if the label of given step is a template label. */
    _templateLabel() {
        return this.label instanceof MatStepLabel ? this.label : null;
    }
    /** Returns the host HTML element. */
    _getHostElement() {
        return this._elementRef.nativeElement;
    }
    _getDefaultTextForState(state) {
        if (state == 'number') {
            return `${this.index + 1}`;
        }
        if (state == 'edit') {
            return 'create';
        }
        if (state == 'error') {
            return 'warning';
        }
        return state;
    }
    _hasEmptyLabel() {
        return (!this._stringLabel() &&
            !this._templateLabel() &&
            !this._hasOptionalLabel() &&
            !this._hasErrorLabel());
    }
    _hasOptionalLabel() {
        return this.optional && this.state !== 'error';
    }
    _hasErrorLabel() {
        return this.state === 'error';
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepHeader, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.0-next.2", type: MatStepHeader, isStandalone: true, selector: "mat-step-header", inputs: { state: "state", label: "label", errorMessage: "errorMessage", iconOverrides: "iconOverrides", index: "index", selected: "selected", active: "active", optional: "optional", disableRipple: "disableRipple", color: "color" }, host: { attributes: { "role": "tab" }, properties: { "class.mat-step-header-empty-label": "_hasEmptyLabel()", "class": "\"mat-\" + (color || \"primary\")" }, classAttribute: "mat-step-header" }, usesInheritance: true, ngImport: i0, template: "<div class=\"mat-step-header-ripple mat-focus-indicator\" matRipple\n     [matRippleTrigger]=\"_getHostElement()\"\n     [matRippleDisabled]=\"disableRipple\"></div>\n\n<div class=\"mat-step-icon-state-{{state}} mat-step-icon\" [class.mat-step-icon-selected]=\"selected\">\n  <div class=\"mat-step-icon-content\">\n    @if (iconOverrides && iconOverrides[state]) {\n      <ng-container\n        [ngTemplateOutlet]=\"iconOverrides[state]\"\n        [ngTemplateOutletContext]=\"{index, active, optional}\"></ng-container>\n    } @else {\n      @switch (state) {\n        @case ('number') {\n          <span aria-hidden=\"true\">{{_getDefaultTextForState(state)}}</span>\n        }\n\n        @default {\n          @if (state === 'done') {\n            <span class=\"cdk-visually-hidden\">{{_intl.completedLabel}}</span>\n          } @else if (state === 'edit') {\n            <span class=\"cdk-visually-hidden\">{{_intl.editableLabel}}</span>\n          }\n\n          <mat-icon aria-hidden=\"true\">{{_getDefaultTextForState(state)}}</mat-icon>\n        }\n      }\n    }\n  </div>\n</div>\n<div class=\"mat-step-label\"\n     [class.mat-step-label-active]=\"active\"\n     [class.mat-step-label-selected]=\"selected\"\n     [class.mat-step-label-error]=\"state == 'error'\">\n  @if (_templateLabel(); as templateLabel) {\n    <!-- If there is a label template, use it. -->\n    <div class=\"mat-step-text-label\">\n      <ng-container [ngTemplateOutlet]=\"templateLabel.template\"></ng-container>\n    </div>\n  } @else if (_stringLabel()) {\n    <!-- If there is no label template, fall back to the text label. -->\n    <div class=\"mat-step-text-label\">{{label}}</div>\n  }\n\n  @if (_hasOptionalLabel()) {\n    <div class=\"mat-step-optional\">{{_intl.optionalLabel}}</div>\n  }\n\n  @if (_hasErrorLabel()) {\n    <div class=\"mat-step-sub-label-error\">{{errorMessage}}</div>\n  }\n</div>\n\n", styles: [".mat-step-header{overflow:hidden;outline:none;cursor:pointer;position:relative;box-sizing:content-box;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-step-header:focus .mat-focus-indicator::before{content:\"\"}.mat-step-header:hover[aria-disabled=true]{cursor:default}.mat-step-header:hover:not([aria-disabled]),.mat-step-header:hover[aria-disabled=false]{background-color:var(--mat-stepper-header-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));border-radius:var(--mat-stepper-header-hover-state-layer-shape, var(--mat-sys-corner-medium))}.mat-step-header.cdk-keyboard-focused,.mat-step-header.cdk-program-focused{background-color:var(--mat-stepper-header-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));border-radius:var(--mat-stepper-header-focus-state-layer-shape, var(--mat-sys-corner-medium))}@media(hover: none){.mat-step-header:hover{background:none}}@media(forced-colors: active){.mat-step-header{outline:solid 1px}.mat-step-header[aria-selected=true] .mat-step-label{text-decoration:underline}.mat-step-header[aria-disabled=true]{outline-color:GrayText}.mat-step-header[aria-disabled=true] .mat-step-label,.mat-step-header[aria-disabled=true] .mat-step-icon,.mat-step-header[aria-disabled=true] .mat-step-optional{color:GrayText}}.mat-step-optional{font-size:12px;color:var(--mat-stepper-header-optional-label-text-color, var(--mat-sys-on-surface-variant))}.mat-step-sub-label-error{font-size:12px;font-weight:normal}.mat-step-icon{border-radius:50%;height:24px;width:24px;flex-shrink:0;position:relative;color:var(--mat-stepper-header-icon-foreground-color, var(--mat-sys-surface));background-color:var(--mat-stepper-header-icon-background-color, var(--mat-sys-on-surface-variant))}.mat-step-icon-content{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);display:flex}.mat-step-icon .mat-icon{font-size:16px;height:16px;width:16px}.mat-step-icon-state-error{background-color:var(--mat-stepper-header-error-state-icon-background-color, transparent);color:var(--mat-stepper-header-error-state-icon-foreground-color, var(--mat-sys-error))}.mat-step-icon-state-error .mat-icon{font-size:24px;height:24px;width:24px}.mat-step-label{display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:50px;vertical-align:middle;font-family:var(--mat-stepper-header-label-text-font, var(--mat-sys-title-small-font));font-size:var(--mat-stepper-header-label-text-size, var(--mat-sys-title-small-size));font-weight:var(--mat-stepper-header-label-text-weight, var(--mat-sys-title-small-weight));color:var(--mat-stepper-header-label-text-color, var(--mat-sys-on-surface-variant))}.mat-step-label.mat-step-label-active{color:var(--mat-stepper-header-selected-state-label-text-color, var(--mat-sys-on-surface-variant))}.mat-step-label.mat-step-label-error{color:var(--mat-stepper-header-error-state-label-text-color, var(--mat-sys-error));font-size:var(--mat-stepper-header-error-state-label-text-size, var(--mat-sys-title-small-size))}.mat-step-label.mat-step-label-selected{font-size:var(--mat-stepper-header-selected-state-label-text-size, var(--mat-sys-title-small-size));font-weight:var(--mat-stepper-header-selected-state-label-text-weight, var(--mat-sys-title-small-weight))}.mat-step-header-empty-label .mat-step-label{min-width:0}.mat-step-text-label{text-overflow:ellipsis;overflow:hidden}.mat-step-header .mat-step-header-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-step-icon-selected{background-color:var(--mat-stepper-header-selected-state-icon-background-color, var(--mat-sys-primary));color:var(--mat-stepper-header-selected-state-icon-foreground-color, var(--mat-sys-on-primary))}.mat-step-icon-state-done{background-color:var(--mat-stepper-header-done-state-icon-background-color, var(--mat-sys-primary));color:var(--mat-stepper-header-done-state-icon-foreground-color, var(--mat-sys-on-primary))}.mat-step-icon-state-edit{background-color:var(--mat-stepper-header-edit-state-icon-background-color, var(--mat-sys-primary));color:var(--mat-stepper-header-edit-state-icon-foreground-color, var(--mat-sys-on-primary))}\n"], dependencies: [{ kind: "directive", type: MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepHeader, decorators: [{
            type: Component,
            args: [{ selector: 'mat-step-header', host: {
                        'class': 'mat-step-header',
                        '[class.mat-step-header-empty-label]': '_hasEmptyLabel()',
                        '[class]': '"mat-" + (color || "primary")',
                        'role': 'tab',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, imports: [MatRipple, NgTemplateOutlet, MatIcon], template: "<div class=\"mat-step-header-ripple mat-focus-indicator\" matRipple\n     [matRippleTrigger]=\"_getHostElement()\"\n     [matRippleDisabled]=\"disableRipple\"></div>\n\n<div class=\"mat-step-icon-state-{{state}} mat-step-icon\" [class.mat-step-icon-selected]=\"selected\">\n  <div class=\"mat-step-icon-content\">\n    @if (iconOverrides && iconOverrides[state]) {\n      <ng-container\n        [ngTemplateOutlet]=\"iconOverrides[state]\"\n        [ngTemplateOutletContext]=\"{index, active, optional}\"></ng-container>\n    } @else {\n      @switch (state) {\n        @case ('number') {\n          <span aria-hidden=\"true\">{{_getDefaultTextForState(state)}}</span>\n        }\n\n        @default {\n          @if (state === 'done') {\n            <span class=\"cdk-visually-hidden\">{{_intl.completedLabel}}</span>\n          } @else if (state === 'edit') {\n            <span class=\"cdk-visually-hidden\">{{_intl.editableLabel}}</span>\n          }\n\n          <mat-icon aria-hidden=\"true\">{{_getDefaultTextForState(state)}}</mat-icon>\n        }\n      }\n    }\n  </div>\n</div>\n<div class=\"mat-step-label\"\n     [class.mat-step-label-active]=\"active\"\n     [class.mat-step-label-selected]=\"selected\"\n     [class.mat-step-label-error]=\"state == 'error'\">\n  @if (_templateLabel(); as templateLabel) {\n    <!-- If there is a label template, use it. -->\n    <div class=\"mat-step-text-label\">\n      <ng-container [ngTemplateOutlet]=\"templateLabel.template\"></ng-container>\n    </div>\n  } @else if (_stringLabel()) {\n    <!-- If there is no label template, fall back to the text label. -->\n    <div class=\"mat-step-text-label\">{{label}}</div>\n  }\n\n  @if (_hasOptionalLabel()) {\n    <div class=\"mat-step-optional\">{{_intl.optionalLabel}}</div>\n  }\n\n  @if (_hasErrorLabel()) {\n    <div class=\"mat-step-sub-label-error\">{{errorMessage}}</div>\n  }\n</div>\n\n", styles: [".mat-step-header{overflow:hidden;outline:none;cursor:pointer;position:relative;box-sizing:content-box;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-step-header:focus .mat-focus-indicator::before{content:\"\"}.mat-step-header:hover[aria-disabled=true]{cursor:default}.mat-step-header:hover:not([aria-disabled]),.mat-step-header:hover[aria-disabled=false]{background-color:var(--mat-stepper-header-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));border-radius:var(--mat-stepper-header-hover-state-layer-shape, var(--mat-sys-corner-medium))}.mat-step-header.cdk-keyboard-focused,.mat-step-header.cdk-program-focused{background-color:var(--mat-stepper-header-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));border-radius:var(--mat-stepper-header-focus-state-layer-shape, var(--mat-sys-corner-medium))}@media(hover: none){.mat-step-header:hover{background:none}}@media(forced-colors: active){.mat-step-header{outline:solid 1px}.mat-step-header[aria-selected=true] .mat-step-label{text-decoration:underline}.mat-step-header[aria-disabled=true]{outline-color:GrayText}.mat-step-header[aria-disabled=true] .mat-step-label,.mat-step-header[aria-disabled=true] .mat-step-icon,.mat-step-header[aria-disabled=true] .mat-step-optional{color:GrayText}}.mat-step-optional{font-size:12px;color:var(--mat-stepper-header-optional-label-text-color, var(--mat-sys-on-surface-variant))}.mat-step-sub-label-error{font-size:12px;font-weight:normal}.mat-step-icon{border-radius:50%;height:24px;width:24px;flex-shrink:0;position:relative;color:var(--mat-stepper-header-icon-foreground-color, var(--mat-sys-surface));background-color:var(--mat-stepper-header-icon-background-color, var(--mat-sys-on-surface-variant))}.mat-step-icon-content{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);display:flex}.mat-step-icon .mat-icon{font-size:16px;height:16px;width:16px}.mat-step-icon-state-error{background-color:var(--mat-stepper-header-error-state-icon-background-color, transparent);color:var(--mat-stepper-header-error-state-icon-foreground-color, var(--mat-sys-error))}.mat-step-icon-state-error .mat-icon{font-size:24px;height:24px;width:24px}.mat-step-label{display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:50px;vertical-align:middle;font-family:var(--mat-stepper-header-label-text-font, var(--mat-sys-title-small-font));font-size:var(--mat-stepper-header-label-text-size, var(--mat-sys-title-small-size));font-weight:var(--mat-stepper-header-label-text-weight, var(--mat-sys-title-small-weight));color:var(--mat-stepper-header-label-text-color, var(--mat-sys-on-surface-variant))}.mat-step-label.mat-step-label-active{color:var(--mat-stepper-header-selected-state-label-text-color, var(--mat-sys-on-surface-variant))}.mat-step-label.mat-step-label-error{color:var(--mat-stepper-header-error-state-label-text-color, var(--mat-sys-error));font-size:var(--mat-stepper-header-error-state-label-text-size, var(--mat-sys-title-small-size))}.mat-step-label.mat-step-label-selected{font-size:var(--mat-stepper-header-selected-state-label-text-size, var(--mat-sys-title-small-size));font-weight:var(--mat-stepper-header-selected-state-label-text-weight, var(--mat-sys-title-small-weight))}.mat-step-header-empty-label .mat-step-label{min-width:0}.mat-step-text-label{text-overflow:ellipsis;overflow:hidden}.mat-step-header .mat-step-header-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-step-icon-selected{background-color:var(--mat-stepper-header-selected-state-icon-background-color, var(--mat-sys-primary));color:var(--mat-stepper-header-selected-state-icon-foreground-color, var(--mat-sys-on-primary))}.mat-step-icon-state-done{background-color:var(--mat-stepper-header-done-state-icon-background-color, var(--mat-sys-primary));color:var(--mat-stepper-header-done-state-icon-foreground-color, var(--mat-sys-on-primary))}.mat-step-icon-state-edit{background-color:var(--mat-stepper-header-edit-state-icon-background-color, var(--mat-sys-primary));color:var(--mat-stepper-header-edit-state-icon-foreground-color, var(--mat-sys-on-primary))}\n"] }]
        }], ctorParameters: () => [], propDecorators: { state: [{
                type: Input
            }], label: [{
                type: Input
            }], errorMessage: [{
                type: Input
            }], iconOverrides: [{
                type: Input
            }], index: [{
                type: Input
            }], selected: [{
                type: Input
            }], active: [{
                type: Input
            }], optional: [{
                type: Input
            }], disableRipple: [{
                type: Input
            }], color: [{
                type: Input
            }] } });

/**
 * Template to be used to override the icons inside the step header.
 */
class MatStepperIcon {
    templateRef = inject(TemplateRef);
    /** Name of the icon to be overridden. */
    name;
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepperIcon, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: MatStepperIcon, isStandalone: true, selector: "ng-template[matStepperIcon]", inputs: { name: ["matStepperIcon", "name"] }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepperIcon, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[matStepperIcon]',
                }]
        }], ctorParameters: () => [], propDecorators: { name: [{
                type: Input,
                args: ['matStepperIcon']
            }] } });

/**
 * Content for a `mat-step` that will be rendered lazily.
 */
class MatStepContent {
    _template = inject(TemplateRef);
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepContent, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: MatStepContent, isStandalone: true, selector: "ng-template[matStepContent]", ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepContent, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[matStepContent]',
                }]
        }], ctorParameters: () => [] });

class MatStep extends CdkStep {
    _errorStateMatcher = inject(ErrorStateMatcher, { skipSelf: true });
    _viewContainerRef = inject(ViewContainerRef);
    _isSelected = Subscription.EMPTY;
    /** Content for step label given by `<ng-template matStepLabel>`. */
    // We need an initializer here to avoid a TS error.
    stepLabel = undefined;
    /**
     * Theme color for the particular step. This API is supported in M2 themes
     * only, it has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/stepper/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color;
    /** Content that will be rendered lazily. */
    _lazyContent;
    /** Currently-attached portal containing the lazy content. */
    _portal;
    ngAfterContentInit() {
        this._isSelected = this._stepper.steps.changes
            .pipe(switchMap(() => {
            return this._stepper.selectionChange.pipe(map(event => event.selectedStep === this), startWith(this._stepper.selected === this));
        }))
            .subscribe(isSelected => {
            if (isSelected && this._lazyContent && !this._portal) {
                this._portal = new TemplatePortal(this._lazyContent._template, this._viewContainerRef);
            }
        });
    }
    ngOnDestroy() {
        this._isSelected.unsubscribe();
    }
    /** Custom error state matcher that additionally checks for validity of interacted form. */
    isErrorState(control, form) {
        const originalErrorState = this._errorStateMatcher.isErrorState(control, form);
        // Custom error state checks for the validity of form that is not submitted or touched
        // since user can trigger a form change by calling for another step without directly
        // interacting with the current form.
        const customErrorState = !!(control && control.invalid && this.interacted);
        return originalErrorState || customErrorState;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStep, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.0-next.2", type: MatStep, isStandalone: true, selector: "mat-step", inputs: { color: "color" }, host: { attributes: { "hidden": "" } }, providers: [
            { provide: ErrorStateMatcher, useExisting: MatStep },
            { provide: CdkStep, useExisting: MatStep },
        ], queries: [{ propertyName: "stepLabel", first: true, predicate: MatStepLabel, descendants: true }, { propertyName: "_lazyContent", first: true, predicate: MatStepContent, descendants: true }], exportAs: ["matStep"], usesInheritance: true, ngImport: i0, template: "<ng-template>\n  <ng-content></ng-content>\n  <ng-template [cdkPortalOutlet]=\"_portal\"></ng-template>\n</ng-template>\n", dependencies: [{ kind: "directive", type: CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStep, decorators: [{
            type: Component,
            args: [{ selector: 'mat-step', providers: [
                        { provide: ErrorStateMatcher, useExisting: MatStep },
                        { provide: CdkStep, useExisting: MatStep },
                    ], encapsulation: ViewEncapsulation.None, exportAs: 'matStep', changeDetection: ChangeDetectionStrategy.OnPush, imports: [CdkPortalOutlet], host: {
                        'hidden': '', // Hide the steps so they don't affect the layout.
                    }, template: "<ng-template>\n  <ng-content></ng-content>\n  <ng-template [cdkPortalOutlet]=\"_portal\"></ng-template>\n</ng-template>\n" }]
        }], propDecorators: { stepLabel: [{
                type: ContentChild,
                args: [MatStepLabel]
            }], color: [{
                type: Input
            }], _lazyContent: [{
                type: ContentChild,
                args: [MatStepContent, { static: false }]
            }] } });
class MatStepper extends CdkStepper {
    _ngZone = inject(NgZone);
    _renderer = inject(Renderer2);
    _animationsDisabled = _animationsDisabled();
    _cleanupTransition;
    _isAnimating = signal(false, ...(ngDevMode ? [{ debugName: "_isAnimating" }] : []));
    /** The list of step headers of the steps in the stepper. */
    _stepHeader = undefined;
    /** Elements hosting the step animations. */
    _animatedContainers;
    /** Full list of steps inside the stepper, including inside nested steppers. */
    _steps = undefined;
    /** Steps that belong to the current stepper, excluding ones from nested steppers. */
    steps = new QueryList();
    /** Custom icon overrides passed in by the consumer. */
    _icons;
    /** Event emitted when the current step is done transitioning in. */
    animationDone = new EventEmitter();
    /** Whether ripples should be disabled for the step headers. */
    disableRipple;
    /**
     * Theme color for all of the steps in stepper. This API is supported in M2
     * themes only, it has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/stepper/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color;
    /**
     * Whether the label should display in bottom or end position.
     * Only applies in the `horizontal` orientation.
     */
    labelPosition = 'end';
    /**
     * Position of the stepper's header.
     * Only applies in the `horizontal` orientation.
     */
    headerPosition = 'top';
    /** Consumer-specified template-refs to be used to override the header icons. */
    _iconOverrides = {};
    /** Duration for the animation. Will be normalized to milliseconds if no units are set. */
    get animationDuration() {
        return this._animationDuration;
    }
    set animationDuration(value) {
        this._animationDuration = /^\d+$/.test(value) ? value + 'ms' : value;
    }
    _animationDuration = '';
    /** Whether the stepper is rendering on the server. */
    _isServer = !inject(Platform).isBrowser;
    constructor() {
        super();
        const elementRef = inject(ElementRef);
        const nodeName = elementRef.nativeElement.nodeName.toLowerCase();
        this.orientation = nodeName === 'mat-vertical-stepper' ? 'vertical' : 'horizontal';
    }
    ngAfterContentInit() {
        super.ngAfterContentInit();
        this._icons.forEach(({ name, templateRef }) => (this._iconOverrides[name] = templateRef));
        // Mark the component for change detection whenever the content children query changes
        this.steps.changes.pipe(takeUntil(this._destroyed)).subscribe(() => this._stateChanged());
        // Transition events won't fire if animations are disabled so we simulate them.
        this.selectedIndexChange.pipe(takeUntil(this._destroyed)).subscribe(() => {
            const duration = this._getAnimationDuration();
            if (duration === '0ms' || duration === '0s') {
                this._onAnimationDone();
            }
            else {
                this._isAnimating.set(true);
            }
        });
        this._ngZone.runOutsideAngular(() => {
            if (!this._animationsDisabled) {
                setTimeout(() => {
                    // Delay enabling the animations so we don't animate the initial state.
                    this._elementRef.nativeElement.classList.add('mat-stepper-animations-enabled');
                    // Bind this outside the zone since it fires for all transitions inside the stepper.
                    this._cleanupTransition = this._renderer.listen(this._elementRef.nativeElement, 'transitionend', this._handleTransitionend);
                }, 200);
            }
        });
    }
    ngAfterViewInit() {
        super.ngAfterViewInit();
        // Prior to #30314 the stepper had animation `done` events bound to each animated container.
        // The animations module was firing them on initialization and for each subsequent animation.
        // Since the events were bound in the template, it had the unintended side-effect of triggering
        // change detection as well. It appears that this side-effect ended up being load-bearing,
        // because it was ensuring that the content elements (e.g. `matStepLabel`) that are defined
        // in sub-components actually get picked up in a timely fashion. This subscription simulates
        // the same change detection by using `queueMicrotask` similarly to the animations module.
        if (typeof queueMicrotask === 'function') {
            let hasEmittedInitial = false;
            this._animatedContainers.changes
                .pipe(startWith(null), takeUntil(this._destroyed))
                .subscribe(() => queueMicrotask(() => {
                // Simulate the initial `animationDone` event
                // that gets emitted by the animations module.
                if (!hasEmittedInitial) {
                    hasEmittedInitial = true;
                    this.animationDone.emit();
                }
                this._stateChanged();
            }));
        }
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this._cleanupTransition?.();
    }
    _getAnimationDuration() {
        if (this._animationsDisabled) {
            return '0ms';
        }
        if (this.animationDuration) {
            return this.animationDuration;
        }
        return this.orientation === 'horizontal' ? '500ms' : '225ms';
    }
    _handleTransitionend = (event) => {
        const target = event.target;
        if (!target) {
            return;
        }
        // Because we bind a single `transitionend` handler on the host node and because transition
        // events bubble, we have to filter down to only the active step so don't emit events too
        // often. We check the orientation and `property` name first to reduce the amount of times
        // we need to check the DOM.
        const isHorizontalActiveElement = this.orientation === 'horizontal' &&
            event.propertyName === 'transform' &&
            target.classList.contains('mat-horizontal-stepper-content-current');
        const isVerticalActiveElement = this.orientation === 'vertical' &&
            event.propertyName === 'grid-template-rows' &&
            target.classList.contains('mat-vertical-content-container-active');
        // Finally we need to ensure that the animated element is a direct descendant,
        // rather than one coming from a nested stepper.
        const shouldEmit = (isHorizontalActiveElement || isVerticalActiveElement) &&
            this._animatedContainers.find(ref => ref.nativeElement === target);
        if (shouldEmit) {
            this._onAnimationDone();
        }
    };
    _onAnimationDone() {
        this._isAnimating.set(false);
        this.animationDone.emit();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepper, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.0-next.2", type: MatStepper, isStandalone: true, selector: "mat-stepper, mat-vertical-stepper, mat-horizontal-stepper, [matStepper]", inputs: { disableRipple: "disableRipple", color: "color", labelPosition: "labelPosition", headerPosition: "headerPosition", animationDuration: "animationDuration" }, outputs: { animationDone: "animationDone" }, host: { attributes: { "role": "tablist" }, properties: { "class.mat-stepper-horizontal": "orientation === \"horizontal\"", "class.mat-stepper-vertical": "orientation === \"vertical\"", "class.mat-stepper-label-position-end": "orientation === \"horizontal\" && labelPosition == \"end\"", "class.mat-stepper-label-position-bottom": "orientation === \"horizontal\" && labelPosition == \"bottom\"", "class.mat-stepper-header-position-bottom": "headerPosition === \"bottom\"", "class.mat-stepper-animating": "_isAnimating()", "style.--mat-stepper-animation-duration": "_getAnimationDuration()", "attr.aria-orientation": "orientation" } }, providers: [{ provide: CdkStepper, useExisting: MatStepper }], queries: [{ propertyName: "_steps", predicate: MatStep, descendants: true }, { propertyName: "_icons", predicate: MatStepperIcon, descendants: true }], viewQueries: [{ propertyName: "_stepHeader", predicate: MatStepHeader, descendants: true }, { propertyName: "_animatedContainers", predicate: ["animatedContainer"], descendants: true }], exportAs: ["matStepper", "matVerticalStepper", "matHorizontalStepper"], usesInheritance: true, ngImport: i0, template: "<!--\n  We need to project the content somewhere to avoid hydration errors. Some observations:\n  1. This is only necessary on the server.\n  2. We get a hydration error if there aren't any nodes after the `ng-content`.\n  3. We get a hydration error if `ng-content` is wrapped in another element.\n-->\n@if (_isServer) {\n  <ng-content/>\n}\n\n@switch (orientation) {\n  @case ('horizontal') {\n    <div class=\"mat-horizontal-stepper-wrapper\">\n      <div class=\"mat-horizontal-stepper-header-container\">\n        @for (step of steps; track step) {\n          <ng-container\n            [ngTemplateOutlet]=\"stepTemplate\"\n            [ngTemplateOutletContext]=\"{step}\"/>\n          @if (!$last) {\n            <div class=\"mat-stepper-horizontal-line\"></div>\n          }\n        }\n      </div>\n\n      <div class=\"mat-horizontal-content-container\">\n        @for (step of steps; track step) {\n          <div\n            #animatedContainer\n            class=\"mat-horizontal-stepper-content\"\n            role=\"tabpanel\"\n            [id]=\"_getStepContentId($index)\"\n            [attr.aria-labelledby]=\"_getStepLabelId($index)\"\n            [class]=\"'mat-horizontal-stepper-content-' + _getAnimationDirection($index)\"\n            [attr.inert]=\"selectedIndex === $index ? null : ''\">\n            <ng-container [ngTemplateOutlet]=\"step.content\"/>\n          </div>\n        }\n      </div>\n    </div>\n  }\n\n  @case ('vertical') {\n    @for (step of steps; track step) {\n      <div class=\"mat-step\">\n        <ng-container\n          [ngTemplateOutlet]=\"stepTemplate\"\n          [ngTemplateOutletContext]=\"{step}\"/>\n        <div\n          #animatedContainer\n          class=\"mat-vertical-content-container\"\n          [class.mat-stepper-vertical-line]=\"!$last\"\n          [class.mat-vertical-content-container-active]=\"selectedIndex === $index\"\n          [attr.inert]=\"selectedIndex === $index ? null : ''\">\n          <div class=\"mat-vertical-stepper-content\"\n            role=\"tabpanel\"\n            [id]=\"_getStepContentId($index)\"\n            [attr.aria-labelledby]=\"_getStepLabelId($index)\">\n            <div class=\"mat-vertical-content\">\n              <ng-container [ngTemplateOutlet]=\"step.content\"/>\n            </div>\n          </div>\n        </div>\n      </div>\n    }\n  }\n}\n\n<!-- Common step templating -->\n<ng-template let-step=\"step\" #stepTemplate>\n  <mat-step-header\n    [class.mat-horizontal-stepper-header]=\"orientation === 'horizontal'\"\n    [class.mat-vertical-stepper-header]=\"orientation === 'vertical'\"\n    (click)=\"step.select()\"\n    (keydown)=\"_onKeydown($event)\"\n    [tabIndex]=\"_getFocusIndex() === step.index() ? 0 : -1\"\n    [id]=\"_getStepLabelId(step.index())\"\n    [attr.aria-posinset]=\"step.index() + 1\"\n    [attr.aria-setsize]=\"steps.length\"\n    [attr.aria-controls]=\"_getStepContentId(step.index())\"\n    [attr.aria-selected]=\"step.isSelected()\"\n    [attr.aria-label]=\"step.ariaLabel || null\"\n    [attr.aria-labelledby]=\"(!step.ariaLabel && step.ariaLabelledby) ? step.ariaLabelledby : null\"\n    [attr.aria-disabled]=\"step.isNavigable() ? null : true\"\n    [index]=\"step.index()\"\n    [state]=\"step.indicatorType()\"\n    [label]=\"step.stepLabel || step.label\"\n    [selected]=\"step.isSelected()\"\n    [active]=\"step.isNavigable()\"\n    [optional]=\"step.optional\"\n    [errorMessage]=\"step.errorMessage\"\n    [iconOverrides]=\"_iconOverrides\"\n    [disableRipple]=\"disableRipple || !step.isNavigable()\"\n    [color]=\"step.color || color\"/>\n</ng-template>\n", styles: [".mat-stepper-vertical,.mat-stepper-horizontal{display:block;font-family:var(--mat-stepper-container-text-font, var(--mat-sys-body-medium-font));background:var(--mat-stepper-container-color, var(--mat-sys-surface))}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header-container{align-items:flex-start}.mat-stepper-header-position-bottom .mat-horizontal-stepper-header-container{order:1}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px;border-top-color:var(--mat-stepper-line-color, var(--mat-sys-outline))}.mat-stepper-label-position-bottom .mat-stepper-horizontal-line{margin:0;min-width:0;position:relative;top:calc(calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) + 12px)}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{border-top-width:1px;border-top-style:solid;content:\"\";display:inline-block;height:0;position:absolute;width:calc(50% - 20px)}.mat-horizontal-stepper-header{display:flex;overflow:hidden;align-items:center;padding:0 24px;height:var(--mat-stepper-header-height, 72px)}.mat-horizontal-stepper-header .mat-step-icon{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:8px}.mat-horizontal-stepper-header.mat-step-header-empty-label .mat-step-icon{margin:0}.mat-horizontal-stepper-header::before,.mat-horizontal-stepper-header::after{border-top-color:var(--mat-stepper-line-color, var(--mat-sys-outline))}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{padding:calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) 24px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header::after{top:calc(calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) + 12px)}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{box-sizing:border-box;flex-direction:column;height:auto}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{right:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before{left:0}[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:last-child::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:first-child::after{display:none}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-label{padding:16px 0 0 0;text-align:center;width:100%}.mat-vertical-stepper-header{display:flex;align-items:center;height:24px;padding:calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) 24px}.mat-vertical-stepper-header .mat-step-icon{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon{margin-right:0;margin-left:12px}.mat-horizontal-stepper-wrapper{display:flex;flex-direction:column}.mat-horizontal-stepper-content{visibility:hidden;overflow:hidden;outline:0;height:0}.mat-stepper-animations-enabled .mat-horizontal-stepper-content{transition:transform var(--mat-stepper-animation-duration, 0) cubic-bezier(0.35, 0, 0.25, 1)}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-previous{transform:translate3d(-100%, 0, 0)}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-next{transform:translate3d(100%, 0, 0)}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-current{visibility:visible;transform:none;height:auto}.mat-stepper-horizontal:not(.mat-stepper-animating) .mat-horizontal-stepper-content.mat-horizontal-stepper-content-current{overflow:visible}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}@media(forced-colors: active){.mat-horizontal-content-container{outline:solid 1px}}.mat-stepper-header-position-bottom .mat-horizontal-content-container{padding:24px 24px 0 24px}.mat-vertical-content-container{display:grid;grid-template-rows:0fr;grid-template-columns:100%;margin-left:36px;border:0;position:relative}.mat-stepper-animations-enabled .mat-vertical-content-container{transition:grid-template-rows var(--mat-stepper-animation-duration, 0) cubic-bezier(0.4, 0, 0.2, 1)}.mat-vertical-content-container.mat-vertical-content-container-active{grid-template-rows:1fr}.mat-step:last-child .mat-vertical-content-container{border:none}@media(forced-colors: active){.mat-vertical-content-container{outline:solid 1px}}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}@supports not (grid-template-rows: 0fr){.mat-vertical-content-container{height:0}.mat-vertical-content-container.mat-vertical-content-container-active{height:auto}}.mat-stepper-vertical-line::before{content:\"\";position:absolute;left:0;border-left-width:1px;border-left-style:solid;border-left-color:var(--mat-stepper-line-color, var(--mat-sys-outline));top:calc(8px - calc((var(--mat-stepper-header-height, 72px) - 24px) / 2));bottom:calc(8px - calc((var(--mat-stepper-header-height, 72px) - 24px) / 2))}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden;outline:0;visibility:hidden}.mat-stepper-animations-enabled .mat-vertical-stepper-content{transition:visibility var(--mat-stepper-animation-duration, 0) linear}.mat-vertical-content-container-active>.mat-vertical-stepper-content{visibility:visible}.mat-vertical-content{padding:0 24px 24px 24px}\n"], dependencies: [{ kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: MatStepHeader, selector: "mat-step-header", inputs: ["state", "label", "errorMessage", "iconOverrides", "index", "selected", "active", "optional", "disableRipple", "color"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepper, decorators: [{
            type: Component,
            args: [{ selector: 'mat-stepper, mat-vertical-stepper, mat-horizontal-stepper, [matStepper]', exportAs: 'matStepper, matVerticalStepper, matHorizontalStepper', host: {
                        '[class.mat-stepper-horizontal]': 'orientation === "horizontal"',
                        '[class.mat-stepper-vertical]': 'orientation === "vertical"',
                        '[class.mat-stepper-label-position-end]': 'orientation === "horizontal" && labelPosition == "end"',
                        '[class.mat-stepper-label-position-bottom]': 'orientation === "horizontal" && labelPosition == "bottom"',
                        '[class.mat-stepper-header-position-bottom]': 'headerPosition === "bottom"',
                        '[class.mat-stepper-animating]': '_isAnimating()',
                        '[style.--mat-stepper-animation-duration]': '_getAnimationDuration()',
                        '[attr.aria-orientation]': 'orientation',
                        'role': 'tablist',
                    }, providers: [{ provide: CdkStepper, useExisting: MatStepper }], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, imports: [NgTemplateOutlet, MatStepHeader], template: "<!--\n  We need to project the content somewhere to avoid hydration errors. Some observations:\n  1. This is only necessary on the server.\n  2. We get a hydration error if there aren't any nodes after the `ng-content`.\n  3. We get a hydration error if `ng-content` is wrapped in another element.\n-->\n@if (_isServer) {\n  <ng-content/>\n}\n\n@switch (orientation) {\n  @case ('horizontal') {\n    <div class=\"mat-horizontal-stepper-wrapper\">\n      <div class=\"mat-horizontal-stepper-header-container\">\n        @for (step of steps; track step) {\n          <ng-container\n            [ngTemplateOutlet]=\"stepTemplate\"\n            [ngTemplateOutletContext]=\"{step}\"/>\n          @if (!$last) {\n            <div class=\"mat-stepper-horizontal-line\"></div>\n          }\n        }\n      </div>\n\n      <div class=\"mat-horizontal-content-container\">\n        @for (step of steps; track step) {\n          <div\n            #animatedContainer\n            class=\"mat-horizontal-stepper-content\"\n            role=\"tabpanel\"\n            [id]=\"_getStepContentId($index)\"\n            [attr.aria-labelledby]=\"_getStepLabelId($index)\"\n            [class]=\"'mat-horizontal-stepper-content-' + _getAnimationDirection($index)\"\n            [attr.inert]=\"selectedIndex === $index ? null : ''\">\n            <ng-container [ngTemplateOutlet]=\"step.content\"/>\n          </div>\n        }\n      </div>\n    </div>\n  }\n\n  @case ('vertical') {\n    @for (step of steps; track step) {\n      <div class=\"mat-step\">\n        <ng-container\n          [ngTemplateOutlet]=\"stepTemplate\"\n          [ngTemplateOutletContext]=\"{step}\"/>\n        <div\n          #animatedContainer\n          class=\"mat-vertical-content-container\"\n          [class.mat-stepper-vertical-line]=\"!$last\"\n          [class.mat-vertical-content-container-active]=\"selectedIndex === $index\"\n          [attr.inert]=\"selectedIndex === $index ? null : ''\">\n          <div class=\"mat-vertical-stepper-content\"\n            role=\"tabpanel\"\n            [id]=\"_getStepContentId($index)\"\n            [attr.aria-labelledby]=\"_getStepLabelId($index)\">\n            <div class=\"mat-vertical-content\">\n              <ng-container [ngTemplateOutlet]=\"step.content\"/>\n            </div>\n          </div>\n        </div>\n      </div>\n    }\n  }\n}\n\n<!-- Common step templating -->\n<ng-template let-step=\"step\" #stepTemplate>\n  <mat-step-header\n    [class.mat-horizontal-stepper-header]=\"orientation === 'horizontal'\"\n    [class.mat-vertical-stepper-header]=\"orientation === 'vertical'\"\n    (click)=\"step.select()\"\n    (keydown)=\"_onKeydown($event)\"\n    [tabIndex]=\"_getFocusIndex() === step.index() ? 0 : -1\"\n    [id]=\"_getStepLabelId(step.index())\"\n    [attr.aria-posinset]=\"step.index() + 1\"\n    [attr.aria-setsize]=\"steps.length\"\n    [attr.aria-controls]=\"_getStepContentId(step.index())\"\n    [attr.aria-selected]=\"step.isSelected()\"\n    [attr.aria-label]=\"step.ariaLabel || null\"\n    [attr.aria-labelledby]=\"(!step.ariaLabel && step.ariaLabelledby) ? step.ariaLabelledby : null\"\n    [attr.aria-disabled]=\"step.isNavigable() ? null : true\"\n    [index]=\"step.index()\"\n    [state]=\"step.indicatorType()\"\n    [label]=\"step.stepLabel || step.label\"\n    [selected]=\"step.isSelected()\"\n    [active]=\"step.isNavigable()\"\n    [optional]=\"step.optional\"\n    [errorMessage]=\"step.errorMessage\"\n    [iconOverrides]=\"_iconOverrides\"\n    [disableRipple]=\"disableRipple || !step.isNavigable()\"\n    [color]=\"step.color || color\"/>\n</ng-template>\n", styles: [".mat-stepper-vertical,.mat-stepper-horizontal{display:block;font-family:var(--mat-stepper-container-text-font, var(--mat-sys-body-medium-font));background:var(--mat-stepper-container-color, var(--mat-sys-surface))}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header-container{align-items:flex-start}.mat-stepper-header-position-bottom .mat-horizontal-stepper-header-container{order:1}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px;border-top-color:var(--mat-stepper-line-color, var(--mat-sys-outline))}.mat-stepper-label-position-bottom .mat-stepper-horizontal-line{margin:0;min-width:0;position:relative;top:calc(calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) + 12px)}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{border-top-width:1px;border-top-style:solid;content:\"\";display:inline-block;height:0;position:absolute;width:calc(50% - 20px)}.mat-horizontal-stepper-header{display:flex;overflow:hidden;align-items:center;padding:0 24px;height:var(--mat-stepper-header-height, 72px)}.mat-horizontal-stepper-header .mat-step-icon{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:8px}.mat-horizontal-stepper-header.mat-step-header-empty-label .mat-step-icon{margin:0}.mat-horizontal-stepper-header::before,.mat-horizontal-stepper-header::after{border-top-color:var(--mat-stepper-line-color, var(--mat-sys-outline))}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{padding:calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) 24px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header::after{top:calc(calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) + 12px)}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{box-sizing:border-box;flex-direction:column;height:auto}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{right:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before{left:0}[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:last-child::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:first-child::after{display:none}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-label{padding:16px 0 0 0;text-align:center;width:100%}.mat-vertical-stepper-header{display:flex;align-items:center;height:24px;padding:calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) 24px}.mat-vertical-stepper-header .mat-step-icon{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon{margin-right:0;margin-left:12px}.mat-horizontal-stepper-wrapper{display:flex;flex-direction:column}.mat-horizontal-stepper-content{visibility:hidden;overflow:hidden;outline:0;height:0}.mat-stepper-animations-enabled .mat-horizontal-stepper-content{transition:transform var(--mat-stepper-animation-duration, 0) cubic-bezier(0.35, 0, 0.25, 1)}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-previous{transform:translate3d(-100%, 0, 0)}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-next{transform:translate3d(100%, 0, 0)}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-current{visibility:visible;transform:none;height:auto}.mat-stepper-horizontal:not(.mat-stepper-animating) .mat-horizontal-stepper-content.mat-horizontal-stepper-content-current{overflow:visible}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}@media(forced-colors: active){.mat-horizontal-content-container{outline:solid 1px}}.mat-stepper-header-position-bottom .mat-horizontal-content-container{padding:24px 24px 0 24px}.mat-vertical-content-container{display:grid;grid-template-rows:0fr;grid-template-columns:100%;margin-left:36px;border:0;position:relative}.mat-stepper-animations-enabled .mat-vertical-content-container{transition:grid-template-rows var(--mat-stepper-animation-duration, 0) cubic-bezier(0.4, 0, 0.2, 1)}.mat-vertical-content-container.mat-vertical-content-container-active{grid-template-rows:1fr}.mat-step:last-child .mat-vertical-content-container{border:none}@media(forced-colors: active){.mat-vertical-content-container{outline:solid 1px}}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}@supports not (grid-template-rows: 0fr){.mat-vertical-content-container{height:0}.mat-vertical-content-container.mat-vertical-content-container-active{height:auto}}.mat-stepper-vertical-line::before{content:\"\";position:absolute;left:0;border-left-width:1px;border-left-style:solid;border-left-color:var(--mat-stepper-line-color, var(--mat-sys-outline));top:calc(8px - calc((var(--mat-stepper-header-height, 72px) - 24px) / 2));bottom:calc(8px - calc((var(--mat-stepper-header-height, 72px) - 24px) / 2))}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden;outline:0;visibility:hidden}.mat-stepper-animations-enabled .mat-vertical-stepper-content{transition:visibility var(--mat-stepper-animation-duration, 0) linear}.mat-vertical-content-container-active>.mat-vertical-stepper-content{visibility:visible}.mat-vertical-content{padding:0 24px 24px 24px}\n"] }]
        }], ctorParameters: () => [], propDecorators: { _stepHeader: [{
                type: ViewChildren,
                args: [MatStepHeader]
            }], _animatedContainers: [{
                type: ViewChildren,
                args: ['animatedContainer']
            }], _steps: [{
                type: ContentChildren,
                args: [MatStep, { descendants: true }]
            }], _icons: [{
                type: ContentChildren,
                args: [MatStepperIcon, { descendants: true }]
            }], animationDone: [{
                type: Output
            }], disableRipple: [{
                type: Input
            }], color: [{
                type: Input
            }], labelPosition: [{
                type: Input
            }], headerPosition: [{
                type: Input
            }], animationDuration: [{
                type: Input
            }] } });

/** Button that moves to the next step in a stepper workflow. */
class MatStepperNext extends CdkStepperNext {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepperNext, deps: null, target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: MatStepperNext, isStandalone: true, selector: "button[matStepperNext]", host: { properties: { "type": "type" }, classAttribute: "mat-stepper-next" }, usesInheritance: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepperNext, decorators: [{
            type: Directive,
            args: [{
                    selector: 'button[matStepperNext]',
                    host: {
                        'class': 'mat-stepper-next',
                        '[type]': 'type',
                    },
                }]
        }] });
/** Button that moves to the previous step in a stepper workflow. */
class MatStepperPrevious extends CdkStepperPrevious {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepperPrevious, deps: null, target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: MatStepperPrevious, isStandalone: true, selector: "button[matStepperPrevious]", host: { properties: { "type": "type" }, classAttribute: "mat-stepper-previous" }, usesInheritance: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepperPrevious, decorators: [{
            type: Directive,
            args: [{
                    selector: 'button[matStepperPrevious]',
                    host: {
                        'class': 'mat-stepper-previous',
                        '[type]': 'type',
                    },
                }]
        }] });

class MatStepperModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepperModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepperModule, imports: [MatCommonModule,
            PortalModule,
            CdkStepperModule,
            MatIconModule,
            MatRippleModule,
            MatStep,
            MatStepLabel,
            MatStepper,
            MatStepperNext,
            MatStepperPrevious,
            MatStepHeader,
            MatStepperIcon,
            MatStepContent], exports: [MatCommonModule,
            MatStep,
            MatStepLabel,
            MatStepper,
            MatStepperNext,
            MatStepperPrevious,
            MatStepHeader,
            MatStepperIcon,
            MatStepContent] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepperModule, providers: [MAT_STEPPER_INTL_PROVIDER, ErrorStateMatcher], imports: [MatCommonModule,
            PortalModule,
            CdkStepperModule,
            MatIconModule,
            MatRippleModule,
            MatStepper,
            MatStepHeader, MatCommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatStepperModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        MatCommonModule,
                        PortalModule,
                        CdkStepperModule,
                        MatIconModule,
                        MatRippleModule,
                        MatStep,
                        MatStepLabel,
                        MatStepper,
                        MatStepperNext,
                        MatStepperPrevious,
                        MatStepHeader,
                        MatStepperIcon,
                        MatStepContent,
                    ],
                    exports: [
                        MatCommonModule,
                        MatStep,
                        MatStepLabel,
                        MatStepper,
                        MatStepperNext,
                        MatStepperPrevious,
                        MatStepHeader,
                        MatStepperIcon,
                        MatStepContent,
                    ],
                    providers: [MAT_STEPPER_INTL_PROVIDER, ErrorStateMatcher],
                }]
        }] });

/**
 * Animations used by the Material steppers.
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
const matStepperAnimations = {
    // Represents:
    // trigger('horizontalStepTransition', [
    //   state('previous', style({transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden'})),
    //   // Transition to `inherit`, rather than `visible`,
    //   // because visibility on a child element the one from the parent,
    //   // making this element focusable inside of a `hidden` element.
    //   state('current', style({transform: 'none', visibility: 'inherit'})),
    //   state('next', style({transform: 'translate3d(100%, 0, 0)', visibility: 'hidden'})),
    //   transition(
    //     '* => *',
    //     group([
    //       animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)'),
    //       query('@*', animateChild(), {optional: true}),
    //     ]),
    //     {
    //       params: {animationDuration: '500ms'},
    //     },
    //   ),
    // ])
    /** Animation that transitions the step along the X axis in a horizontal stepper. */
    horizontalStepTransition: {
        type: 7,
        name: 'horizontalStepTransition',
        definitions: [
            {
                type: 0,
                name: 'previous',
                styles: {
                    type: 6,
                    styles: { transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden' },
                    offset: null,
                },
            },
            {
                type: 0,
                name: 'current',
                styles: {
                    type: 6,
                    styles: { transform: 'none', visibility: 'inherit' },
                    offset: null,
                },
            },
            {
                type: 0,
                name: 'next',
                styles: {
                    type: 6,
                    styles: { transform: 'translate3d(100%, 0, 0)', visibility: 'hidden' },
                    offset: null,
                },
            },
            {
                type: 1,
                expr: '* => *',
                animation: {
                    type: 3,
                    steps: [
                        {
                            type: 4,
                            styles: null,
                            timings: '{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)',
                        },
                        {
                            type: 11,
                            selector: '@*',
                            animation: { type: 9, options: null },
                            options: { optional: true },
                        },
                    ],
                    options: null,
                },
                options: { params: { animationDuration: '500ms' } },
            },
        ],
        options: {},
    },
    // Represents:
    // trigger('verticalStepTransition', [
    //   state('previous', style({height: '0px', visibility: 'hidden'})),
    //   state('next', style({height: '0px', visibility: 'hidden'})),
    //   // Transition to `inherit`, rather than `visible`,
    //   // because visibility on a child element the one from the parent,
    //   // making this element focusable inside of a `hidden` element.
    //   state('current', style({height: '*', visibility: 'inherit'})),
    //   transition(
    //     '* <=> current',
    //     group([
    //       animate('{{animationDuration}} cubic-bezier(0.4, 0.0, 0.2, 1)'),
    //       query('@*', animateChild(), {optional: true}),
    //     ]),
    //     {
    //       params: {animationDuration: '225ms'},
    //     },
    //   ),
    // ])
    /** Animation that transitions the step along the Y axis in a vertical stepper. */
    verticalStepTransition: {
        type: 7,
        name: 'verticalStepTransition',
        definitions: [
            {
                type: 0,
                name: 'previous',
                styles: { type: 6, styles: { 'height': '0px', visibility: 'hidden' }, offset: null },
            },
            {
                type: 0,
                name: 'next',
                styles: { type: 6, styles: { 'height': '0px', visibility: 'hidden' }, offset: null },
            },
            {
                type: 0,
                name: 'current',
                styles: { type: 6, styles: { 'height': '*', visibility: 'inherit' }, offset: null },
            },
            {
                type: 1,
                expr: '* <=> current',
                animation: {
                    type: 3,
                    steps: [
                        {
                            type: 4,
                            styles: null,
                            timings: '{{animationDuration}} cubic-bezier(0.4, 0.0, 0.2, 1)',
                        },
                        {
                            type: 11,
                            selector: '@*',
                            animation: { type: 9, options: null },
                            options: { optional: true },
                        },
                    ],
                    options: null,
                },
                options: { params: { animationDuration: '225ms' } },
            },
        ],
        options: {},
    },
};

export { MAT_STEPPER_INTL_PROVIDER, MAT_STEPPER_INTL_PROVIDER_FACTORY, MatStep, MatStepContent, MatStepHeader, MatStepLabel, MatStepper, MatStepperIcon, MatStepperIntl, MatStepperModule, MatStepperNext, MatStepperPrevious, matStepperAnimations };
//# sourceMappingURL=stepper.mjs.map
