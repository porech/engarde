import * as i3$1 from '@angular/cdk/stepper';
import { CdkStepLabel, StepState, CdkStepHeader, CdkStep, CdkStepper, CdkStepperNext, CdkStepperPrevious } from '@angular/cdk/stepper';
export { StepState, StepperOrientation } from '@angular/cdk/stepper';
import * as i0 from '@angular/core';
import { Optional, TemplateRef, AfterViewInit, OnDestroy, AfterContentInit, QueryList, ElementRef, EventEmitter } from '@angular/core';
import { MatCommonModule } from '../common-module.d.js';
import * as i3 from '@angular/cdk/portal';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatIconModule } from '../icon-module.d.js';
import { MatRippleModule } from '../ripple-module.d.js';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ThemePalette } from '../palette.d.js';
import { ErrorStateMatcher } from '../error-options.d.js';
import { FocusOrigin } from '@angular/cdk/a11y';
import { Subject } from 'rxjs';
import '@angular/cdk/bidi';
import '../ripple.d.js';
import '@angular/cdk/platform';

declare class MatStepLabel extends CdkStepLabel {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatStepLabel, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatStepLabel, "[matStepLabel]", never, {}, {}, never, never, true, never>;
}

/** Stepper data that is required for internationalization. */
declare class MatStepperIntl {
    /**
     * Stream that emits whenever the labels here are changed. Use this to notify
     * components if the labels have changed after initialization.
     */
    readonly changes: Subject<void>;
    /** Label that is rendered below optional steps. */
    optionalLabel: string;
    /** Label that is used to indicate step as completed to screen readers. */
    completedLabel: string;
    /** Label that is used to indicate step as editable to screen readers. */
    editableLabel: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatStepperIntl, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MatStepperIntl>;
}
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
declare function MAT_STEPPER_INTL_PROVIDER_FACTORY(parentIntl: MatStepperIntl): MatStepperIntl;
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
declare const MAT_STEPPER_INTL_PROVIDER: {
    provide: typeof MatStepperIntl;
    deps: Optional[][];
    useFactory: typeof MAT_STEPPER_INTL_PROVIDER_FACTORY;
};

/** Template context available to an attached `matStepperIcon`. */
interface MatStepperIconContext {
    /** Index of the step. */
    index: number;
    /** Whether the step is currently active. */
    active: boolean;
    /** Whether the step is optional. */
    optional: boolean;
}
/**
 * Template to be used to override the icons inside the step header.
 */
declare class MatStepperIcon {
    templateRef: TemplateRef<MatStepperIconContext>;
    /** Name of the icon to be overridden. */
    name: StepState;
    constructor(...args: unknown[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatStepperIcon, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatStepperIcon, "ng-template[matStepperIcon]", never, { "name": { "alias": "matStepperIcon"; "required": false; }; }, {}, never, never, true, never>;
}

declare class MatStepHeader extends CdkStepHeader implements AfterViewInit, OnDestroy {
    _intl: MatStepperIntl;
    private _focusMonitor;
    private _intlSubscription;
    /** State of the given step. */
    state: StepState;
    /** Label of the given step. */
    label: MatStepLabel | string;
    /** Error message to display when there's an error. */
    errorMessage: string;
    /** Overrides for the header icons, passed in via the stepper. */
    iconOverrides: {
        [key: string]: TemplateRef<MatStepperIconContext>;
    };
    /** Index of the given step. */
    index: number;
    /** Whether the given step is selected. */
    selected: boolean;
    /** Whether the given step label is active. */
    active: boolean;
    /** Whether the given step is optional. */
    optional: boolean;
    /** Whether the ripple should be disabled. */
    disableRipple: boolean;
    /**
     * Theme color of the step header. This API is supported in M2 themes only, it
     * has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/stepper/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color: ThemePalette;
    constructor(...args: unknown[]);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /** Focuses the step header. */
    focus(origin?: FocusOrigin, options?: FocusOptions): void;
    /** Returns string label of given step if it is a text label. */
    _stringLabel(): string | null;
    /** Returns MatStepLabel if the label of given step is a template label. */
    _templateLabel(): MatStepLabel | null;
    /** Returns the host HTML element. */
    _getHostElement(): HTMLElement;
    _getDefaultTextForState(state: StepState): string;
    protected _hasEmptyLabel(): boolean;
    protected _hasOptionalLabel(): boolean;
    protected _hasErrorLabel(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatStepHeader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatStepHeader, "mat-step-header", never, { "state": { "alias": "state"; "required": false; }; "label": { "alias": "label"; "required": false; }; "errorMessage": { "alias": "errorMessage"; "required": false; }; "iconOverrides": { "alias": "iconOverrides"; "required": false; }; "index": { "alias": "index"; "required": false; }; "selected": { "alias": "selected"; "required": false; }; "active": { "alias": "active"; "required": false; }; "optional": { "alias": "optional"; "required": false; }; "disableRipple": { "alias": "disableRipple"; "required": false; }; "color": { "alias": "color"; "required": false; }; }, {}, never, never, true, never>;
}

/**
 * Content for a `mat-step` that will be rendered lazily.
 */
declare class MatStepContent {
    _template: TemplateRef<any>;
    constructor(...args: unknown[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatStepContent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatStepContent, "ng-template[matStepContent]", never, {}, {}, never, never, true, never>;
}

declare class MatStep extends CdkStep implements ErrorStateMatcher, AfterContentInit, OnDestroy {
    private _errorStateMatcher;
    private _viewContainerRef;
    private _isSelected;
    /** Content for step label given by `<ng-template matStepLabel>`. */
    stepLabel: MatStepLabel;
    /**
     * Theme color for the particular step. This API is supported in M2 themes
     * only, it has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/stepper/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color: ThemePalette;
    /** Content that will be rendered lazily. */
    _lazyContent: MatStepContent;
    /** Currently-attached portal containing the lazy content. */
    _portal: TemplatePortal;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /** Custom error state matcher that additionally checks for validity of interacted form. */
    isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatStep, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatStep, "mat-step", ["matStep"], { "color": { "alias": "color"; "required": false; }; }, {}, ["stepLabel", "_lazyContent"], ["*"], true, never>;
}
declare class MatStepper extends CdkStepper implements AfterViewInit, AfterContentInit, OnDestroy {
    private _ngZone;
    private _renderer;
    private _animationsDisabled;
    private _cleanupTransition;
    protected _isAnimating: i0.WritableSignal<boolean>;
    /** The list of step headers of the steps in the stepper. */
    _stepHeader: QueryList<MatStepHeader>;
    /** Elements hosting the step animations. */
    _animatedContainers: QueryList<ElementRef>;
    /** Full list of steps inside the stepper, including inside nested steppers. */
    _steps: QueryList<MatStep>;
    /** Steps that belong to the current stepper, excluding ones from nested steppers. */
    readonly steps: QueryList<MatStep>;
    /** Custom icon overrides passed in by the consumer. */
    _icons: QueryList<MatStepperIcon>;
    /** Event emitted when the current step is done transitioning in. */
    readonly animationDone: EventEmitter<void>;
    /** Whether ripples should be disabled for the step headers. */
    disableRipple: boolean;
    /**
     * Theme color for all of the steps in stepper. This API is supported in M2
     * themes only, it has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/stepper/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color: ThemePalette;
    /**
     * Whether the label should display in bottom or end position.
     * Only applies in the `horizontal` orientation.
     */
    labelPosition: 'bottom' | 'end';
    /**
     * Position of the stepper's header.
     * Only applies in the `horizontal` orientation.
     */
    headerPosition: 'top' | 'bottom';
    /** Consumer-specified template-refs to be used to override the header icons. */
    _iconOverrides: Record<string, TemplateRef<MatStepperIconContext>>;
    /** Duration for the animation. Will be normalized to milliseconds if no units are set. */
    get animationDuration(): string;
    set animationDuration(value: string);
    private _animationDuration;
    /** Whether the stepper is rendering on the server. */
    protected _isServer: boolean;
    constructor(...args: unknown[]);
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    _getAnimationDuration(): string;
    private _handleTransitionend;
    private _onAnimationDone;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatStepper, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatStepper, "mat-stepper, mat-vertical-stepper, mat-horizontal-stepper, [matStepper]", ["matStepper", "matVerticalStepper", "matHorizontalStepper"], { "disableRipple": { "alias": "disableRipple"; "required": false; }; "color": { "alias": "color"; "required": false; }; "labelPosition": { "alias": "labelPosition"; "required": false; }; "headerPosition": { "alias": "headerPosition"; "required": false; }; "animationDuration": { "alias": "animationDuration"; "required": false; }; }, { "animationDone": "animationDone"; }, ["_steps", "_icons"], ["*"], true, never>;
}

/** Button that moves to the next step in a stepper workflow. */
declare class MatStepperNext extends CdkStepperNext {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatStepperNext, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatStepperNext, "button[matStepperNext]", never, {}, {}, never, never, true, never>;
}
/** Button that moves to the previous step in a stepper workflow. */
declare class MatStepperPrevious extends CdkStepperPrevious {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatStepperPrevious, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatStepperPrevious, "button[matStepperPrevious]", never, {}, {}, never, never, true, never>;
}

declare class MatStepperModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatStepperModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatStepperModule, never, [typeof MatCommonModule, typeof i3.PortalModule, typeof i3$1.CdkStepperModule, typeof MatIconModule, typeof MatRippleModule, typeof MatStep, typeof MatStepLabel, typeof MatStepper, typeof MatStepperNext, typeof MatStepperPrevious, typeof MatStepHeader, typeof MatStepperIcon, typeof MatStepContent], [typeof MatCommonModule, typeof MatStep, typeof MatStepLabel, typeof MatStepper, typeof MatStepperNext, typeof MatStepperPrevious, typeof MatStepHeader, typeof MatStepperIcon, typeof MatStepContent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatStepperModule>;
}

/**
 * Animations used by the Material steppers.
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
declare const matStepperAnimations: {
    readonly horizontalStepTransition: any;
    readonly verticalStepTransition: any;
};

export { MAT_STEPPER_INTL_PROVIDER, MAT_STEPPER_INTL_PROVIDER_FACTORY, MatStep, MatStepContent, MatStepHeader, MatStepLabel, MatStepper, MatStepperIcon, MatStepperIntl, MatStepperModule, MatStepperNext, MatStepperPrevious, matStepperAnimations };
export type { MatStepperIconContext };
