import * as i0 from '@angular/core';
import { InjectionToken, ElementRef } from '@angular/core';
import { ThemePalette } from './palette.d.js';

/** Possible mode for a progress spinner. */
type ProgressSpinnerMode = 'determinate' | 'indeterminate';
/** Default `mat-progress-spinner` options that can be overridden. */
interface MatProgressSpinnerDefaultOptions {
    /**
     * Default theme color of the progress spinner. This API is supported in M2 themes only, it
     * has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/progress-spinner/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color?: ThemePalette;
    /** Diameter of the spinner. */
    diameter?: number;
    /** Width of the spinner's stroke. */
    strokeWidth?: number;
    /**
     * Whether the animations should be force to be enabled, ignoring if the current environment is
     * using NoopAnimationsModule.
     */
    _forceAnimations?: boolean;
}
/** Injection token to be used to override the default options for `mat-progress-spinner`. */
declare const MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS: InjectionToken<MatProgressSpinnerDefaultOptions>;
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
declare function MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY(): MatProgressSpinnerDefaultOptions;
declare class MatProgressSpinner {
    readonly _elementRef: ElementRef<HTMLElement>;
    /** Whether the _mat-animation-noopable class should be applied, disabling animations.  */
    _noopAnimations: boolean;
    /**
     * Theme color of the progress spinner. This API is supported in M2 themes only, it
     * has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/progress-spinner/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    get color(): string | null | undefined;
    set color(value: string | null | undefined);
    private _color;
    private _defaultColor;
    /** The element of the determinate spinner. */
    _determinateCircle: ElementRef<HTMLElement>;
    constructor(...args: unknown[]);
    /**
     * Mode of the progress bar.
     *
     * Input must be one of these values: determinate, indeterminate, buffer, query, defaults to
     * 'determinate'.
     * Mirrored to mode attribute.
     */
    mode: ProgressSpinnerMode;
    /** Value of the progress bar. Defaults to zero. Mirrored to aria-valuenow. */
    get value(): number;
    set value(v: number);
    private _value;
    /** The diameter of the progress spinner (will set width and height of svg). */
    get diameter(): number;
    set diameter(size: number);
    private _diameter;
    /** Stroke width of the progress spinner. */
    get strokeWidth(): number;
    set strokeWidth(value: number);
    private _strokeWidth;
    /** The radius of the spinner, adjusted for stroke width. */
    _circleRadius(): number;
    /** The view box of the spinner's svg element. */
    _viewBox(): string;
    /** The stroke circumference of the svg circle. */
    _strokeCircumference(): number;
    /** The dash offset of the svg circle. */
    _strokeDashOffset(): number | null;
    /** Stroke width of the circle in percent. */
    _circleStrokeWidth(): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatProgressSpinner, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatProgressSpinner, "mat-progress-spinner, mat-spinner", ["matProgressSpinner"], { "color": { "alias": "color"; "required": false; }; "mode": { "alias": "mode"; "required": false; }; "value": { "alias": "value"; "required": false; }; "diameter": { "alias": "diameter"; "required": false; }; "strokeWidth": { "alias": "strokeWidth"; "required": false; }; }, {}, never, never, true, never>;
    static ngAcceptInputType_value: unknown;
    static ngAcceptInputType_diameter: unknown;
    static ngAcceptInputType_strokeWidth: unknown;
}
/**
 * @deprecated Import Progress Spinner instead. Note that the
 *    `mat-spinner` selector isn't deprecated.
 * @breaking-change 16.0.0
 */
declare const MatSpinner: typeof MatProgressSpinner;

export { MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY, MatProgressSpinner, MatSpinner };
export type { MatProgressSpinnerDefaultOptions, ProgressSpinnerMode };
