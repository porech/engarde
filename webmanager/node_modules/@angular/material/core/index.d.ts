import * as i0 from '@angular/core';
import { Version, InjectionToken, Provider } from '@angular/core';
export { GranularSanityChecks, MATERIAL_SANITY_CHECKS, MatCommonModule, SanityChecks } from '../common-module.d.js';
export { ThemePalette } from '../palette.d.js';
import { NgControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { ErrorStateMatcher as ErrorStateMatcher$1 } from '../error-options.d.js';
export { ShowOnDirtyErrorStateMatcher } from '../error-options.d.js';
export { MatLine, MatLineModule, setLines } from '../line.d.js';
export { MatOptionModule } from '../option-module.d.js';
export { MAT_OPTGROUP, MatOptgroup, MatOption, MatOptionSelectionChange, _countGroupLabelsBeforeOption, _getOptionScrollPosition } from '../option.d.js';
export { MAT_OPTION_PARENT_COMPONENT, MatOptionParentComponent } from '../option-parent.d.js';
export { MatRippleLoader } from '../ripple-loader.d.js';
export { MAT_RIPPLE_GLOBAL_OPTIONS, MatRipple, RippleAnimationConfig, RippleConfig, RippleGlobalOptions, RippleRef, RippleRenderer, RippleState, RippleTarget, defaultRippleAnimationConfig } from '../ripple.d.js';
export { MatRippleModule } from '../ripple-module.d.js';
export { MatPseudoCheckbox, MatPseudoCheckboxModule, MatPseudoCheckboxState } from '../pseudo-checkbox-module.d.js';
import { DateAdapter } from '../date-adapter.d.js';
export { MAT_DATE_LOCALE, MAT_DATE_LOCALE_FACTORY } from '../date-adapter.d.js';
import '@angular/cdk/bidi';
import '@angular/cdk/a11y';
import '@angular/cdk/platform';

/** Current version of Angular Material. */
declare const VERSION: Version;

/** Object used to configure the animation in Angular Material. */
interface AnimationsConfig {
    /** Whether all animations should be disabled. */
    animationsDisabled?: boolean;
}
/** Injection token used to configure the animations in Angular Material. */
declare const MATERIAL_ANIMATIONS: InjectionToken<AnimationsConfig>;
/**
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 * @docs-private
 */
declare class AnimationCurves {
    static STANDARD_CURVE: string;
    static DECELERATION_CURVE: string;
    static ACCELERATION_CURVE: string;
    static SHARP_CURVE: string;
}
/**
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 * @docs-private
 */
declare class AnimationDurations {
    static COMPLEX: string;
    static ENTERING: string;
    static EXITING: string;
}
/**
 * Gets the the configured animations state.
 * @docs-private
 */
declare function _getAnimationsState(): 'enabled' | 'di-disabled' | 'reduced-motion';
/**
 * Returns whether animations have been disabled by DI. Must be called in a DI context.
 * @docs-private
 */
declare function _animationsDisabled(): boolean;

interface ErrorStateMatcher extends ErrorStateMatcher$1 {
}
/**
 * Class that tracks the error state of a component.
 * @docs-private
 */
declare class _ErrorStateTracker {
    private _defaultMatcher;
    ngControl: NgControl | null;
    private _parentFormGroup;
    private _parentForm;
    private _stateChanges;
    /** Whether the tracker is currently in an error state. */
    errorState: boolean;
    /** User-defined matcher for the error state. */
    matcher: ErrorStateMatcher;
    constructor(_defaultMatcher: ErrorStateMatcher | null, ngControl: NgControl | null, _parentFormGroup: FormGroupDirective | null, _parentForm: NgForm | null, _stateChanges: Subject<void>);
    /** Updates the error state based on the provided error state matcher. */
    updateErrorState(): void;
}

type MatDateFormats = {
    parse: {
        dateInput: any;
        timeInput?: any;
    };
    display: {
        dateInput: any;
        monthLabel?: any;
        monthYearLabel: any;
        dateA11yLabel: any;
        monthYearA11yLabel: any;
        timeInput?: any;
        timeOptionLabel?: any;
    };
};
declare const MAT_DATE_FORMATS: InjectionToken<MatDateFormats>;

/** Adapts the native JS Date for use with cdk-based components that work with dates. */
declare class NativeDateAdapter extends DateAdapter<Date> {
    /**
     * @deprecated No longer being used. To be removed.
     * @breaking-change 14.0.0
     */
    useUtcForDisplay: boolean;
    /** The injected locale. */
    private readonly _matDateLocale;
    constructor(...args: unknown[]);
    getYear(date: Date): number;
    getMonth(date: Date): number;
    getDate(date: Date): number;
    getDayOfWeek(date: Date): number;
    getMonthNames(style: 'long' | 'short' | 'narrow'): string[];
    getDateNames(): string[];
    getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[];
    getYearName(date: Date): string;
    getFirstDayOfWeek(): number;
    getNumDaysInMonth(date: Date): number;
    clone(date: Date): Date;
    createDate(year: number, month: number, date: number): Date;
    today(): Date;
    parse(value: any, parseFormat?: any): Date | null;
    format(date: Date, displayFormat: Object): string;
    addCalendarYears(date: Date, years: number): Date;
    addCalendarMonths(date: Date, months: number): Date;
    addCalendarDays(date: Date, days: number): Date;
    toIso8601(date: Date): string;
    /**
     * Returns the given value if given a valid Date or null. Deserializes valid ISO 8601 strings
     * (https://www.ietf.org/rfc/rfc3339.txt) into valid Dates and empty string into null. Returns an
     * invalid date for all other values.
     */
    deserialize(value: any): Date | null;
    isDateInstance(obj: any): obj is Date;
    isValid(date: Date): boolean;
    invalid(): Date;
    setTime(target: Date, hours: number, minutes: number, seconds: number): Date;
    getHours(date: Date): number;
    getMinutes(date: Date): number;
    getSeconds(date: Date): number;
    parseTime(userValue: any, parseFormat?: any): Date | null;
    addSeconds(date: Date, amount: number): Date;
    /** Creates a date but allows the month and date to overflow. */
    private _createDateWithOverflow;
    /**
     * Pads a number to make it two digits.
     * @param n The number to pad.
     * @returns The padded number.
     */
    private _2digit;
    /**
     * When converting Date object to string, javascript built-in functions may return wrong
     * results because it applies its internal DST rules. The DST rules around the world change
     * very frequently, and the current valid rule is not always valid in previous years though.
     * We work around this problem building a new Date object which has its internal UTC
     * representation with the local date and time.
     * @param dtf Intl.DateTimeFormat object, containing the desired string format. It must have
     *    timeZone set to 'utc' to work fine.
     * @param date Date from which we want to get the string representation according to dtf
     * @returns A Date object with its UTC representation based on the passed in date info
     */
    private _format;
    /**
     * Attempts to parse a time string into a date object. Returns null if it cannot be parsed.
     * @param value Time string to parse.
     */
    private _parseTimeString;
    static ɵfac: i0.ɵɵFactoryDeclaration<NativeDateAdapter, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NativeDateAdapter>;
}

declare const MAT_NATIVE_DATE_FORMATS: MatDateFormats;

declare class NativeDateModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<NativeDateModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<NativeDateModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<NativeDateModule>;
}
declare class MatNativeDateModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatNativeDateModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatNativeDateModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatNativeDateModule>;
}
declare function provideNativeDateAdapter(formats?: MatDateFormats): Provider[];

/**
 * Component used to load structural styles for focus indicators.
 * @docs-private
 */
declare class _StructuralStylesLoader {
    static ɵfac: i0.ɵɵFactoryDeclaration<_StructuralStylesLoader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<_StructuralStylesLoader, "structural-styles", never, {}, {}, never, never, true, never>;
}

/**
 * Internal shared component used as a container in form field controls.
 * Not to be confused with `mat-form-field` which MDC calls a "text field".
 * @docs-private
 */
declare class _MatInternalFormField {
    /** Position of the label relative to the content. */
    labelPosition: 'before' | 'after';
    static ɵfac: i0.ɵɵFactoryDeclaration<_MatInternalFormField, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<_MatInternalFormField, "div[mat-internal-form-field]", never, { "labelPosition": { "alias": "labelPosition"; "required": true; }; }, {}, never, ["*"], true, never>;
}

export { AnimationCurves, AnimationDurations, DateAdapter, ErrorStateMatcher$1 as ErrorStateMatcher, MATERIAL_ANIMATIONS, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter, NativeDateModule, VERSION, _ErrorStateTracker, _MatInternalFormField, _StructuralStylesLoader, _animationsDisabled, _getAnimationsState, provideNativeDateAdapter };
export type { AnimationsConfig, MatDateFormats };
