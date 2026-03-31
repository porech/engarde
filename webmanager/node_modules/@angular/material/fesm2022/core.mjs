export { _MatInternalFormField } from './internal-form-field.mjs';
import * as i0 from '@angular/core';
import { Version, inject, Injectable, NgModule } from '@angular/core';
export { AnimationCurves, AnimationDurations, MATERIAL_ANIMATIONS, _animationsDisabled, _getAnimationsState } from './animation.mjs';
export { MATERIAL_SANITY_CHECKS, MatCommonModule } from './common-module.mjs';
export { _ErrorStateTracker } from './error-state.mjs';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from './date-formats.mjs';
export { MAT_DATE_LOCALE_FACTORY } from './date-formats.mjs';
export { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from './error-options.mjs';
export { _StructuralStylesLoader } from './structural-styles.mjs';
export { MatLine, MatLineModule, setLines } from './line.mjs';
export { MatOptionModule } from './option-module.mjs';
export { MAT_OPTGROUP, MAT_OPTION_PARENT_COMPONENT, MatOptgroup, MatOption, MatOptionSelectionChange, _countGroupLabelsBeforeOption, _getOptionScrollPosition } from './option.mjs';
export { MatRippleLoader } from './ripple-loader.mjs';
export { MAT_RIPPLE_GLOBAL_OPTIONS, MatRipple, RippleRef, RippleRenderer, RippleState, defaultRippleAnimationConfig } from './ripple.mjs';
export { MatRippleModule } from './ripple-module.mjs';
export { MatPseudoCheckbox } from './pseudo-checkbox.mjs';
export { MatPseudoCheckboxModule } from './pseudo-checkbox-module.mjs';
import '@angular/cdk/layout';
import '@angular/cdk/a11y';
import '@angular/cdk/bidi';
import 'rxjs';
import 'rxjs/operators';
import '@angular/cdk/keycodes';
import '@angular/cdk/private';
import '@angular/cdk/platform';
import '@angular/cdk/coercion';

/** Current version of Angular Material. */
const VERSION = new Version('20.2.10');

/**
 * Matches strings that have the form of a valid RFC 3339 string
 * (https://tools.ietf.org/html/rfc3339). Note that the string may not actually be a valid date
 * because the regex will match strings with an out of bounds month, date, etc.
 */
const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:(?:\+|-)\d{2}:\d{2}))?)?$/;
/**
 * Matches a time string. Supported formats:
 * - {{hours}}:{{minutes}}
 * - {{hours}}:{{minutes}}:{{seconds}}
 * - {{hours}}:{{minutes}} AM/PM
 * - {{hours}}:{{minutes}}:{{seconds}} AM/PM
 * - {{hours}}.{{minutes}}
 * - {{hours}}.{{minutes}}.{{seconds}}
 * - {{hours}}.{{minutes}} AM/PM
 * - {{hours}}.{{minutes}}.{{seconds}} AM/PM
 */
const TIME_REGEX = /^(\d?\d)[:.](\d?\d)(?:[:.](\d?\d))?\s*(AM|PM)?$/i;
/** Creates an array and fills it with values. */
function range(length, valueFunction) {
    const valuesArray = Array(length);
    for (let i = 0; i < length; i++) {
        valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
}
/** Adapts the native JS Date for use with cdk-based components that work with dates. */
class NativeDateAdapter extends DateAdapter {
    /**
     * @deprecated No longer being used. To be removed.
     * @breaking-change 14.0.0
     */
    useUtcForDisplay = false;
    /** The injected locale. */
    _matDateLocale = inject(MAT_DATE_LOCALE, { optional: true });
    constructor() {
        super();
        const matDateLocale = inject(MAT_DATE_LOCALE, { optional: true });
        if (matDateLocale !== undefined) {
            this._matDateLocale = matDateLocale;
        }
        super.setLocale(this._matDateLocale);
    }
    getYear(date) {
        return date.getFullYear();
    }
    getMonth(date) {
        return date.getMonth();
    }
    getDate(date) {
        return date.getDate();
    }
    getDayOfWeek(date) {
        return date.getDay();
    }
    getMonthNames(style) {
        const dtf = new Intl.DateTimeFormat(this.locale, { month: style, timeZone: 'utc' });
        return range(12, i => this._format(dtf, new Date(2017, i, 1)));
    }
    getDateNames() {
        const dtf = new Intl.DateTimeFormat(this.locale, { day: 'numeric', timeZone: 'utc' });
        return range(31, i => this._format(dtf, new Date(2017, 0, i + 1)));
    }
    getDayOfWeekNames(style) {
        const dtf = new Intl.DateTimeFormat(this.locale, { weekday: style, timeZone: 'utc' });
        return range(7, i => this._format(dtf, new Date(2017, 0, i + 1)));
    }
    getYearName(date) {
        const dtf = new Intl.DateTimeFormat(this.locale, { year: 'numeric', timeZone: 'utc' });
        return this._format(dtf, date);
    }
    getFirstDayOfWeek() {
        // At the time of writing `Intl.Locale` isn't available
        // in the internal types so we need to cast to `any`.
        if (typeof Intl !== 'undefined' && Intl.Locale) {
            const locale = new Intl.Locale(this.locale);
            // Some browsers implement a `getWeekInfo` method while others have a `weekInfo` getter.
            // Note that this isn't supported in all browsers so we need to null check it.
            const firstDay = (locale.getWeekInfo?.() || locale.weekInfo)?.firstDay ?? 0;
            // `weekInfo.firstDay` is a number between 1 and 7 where, starting from Monday,
            // whereas our representation is 0 to 6 where 0 is Sunday so we need to normalize it.
            return firstDay === 7 ? 0 : firstDay;
        }
        // Default to Sunday if the browser doesn't provide the week information.
        return 0;
    }
    getNumDaysInMonth(date) {
        return this.getDate(this._createDateWithOverflow(this.getYear(date), this.getMonth(date) + 1, 0));
    }
    clone(date) {
        return new Date(date.getTime());
    }
    createDate(year, month, date) {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            // Check for invalid month and date (except upper bound on date which we have to check after
            // creating the Date).
            if (month < 0 || month > 11) {
                throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
            }
            if (date < 1) {
                throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
            }
        }
        let result = this._createDateWithOverflow(year, month, date);
        // Check that the date wasn't above the upper bound for the month, causing the month to overflow
        if (result.getMonth() != month && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error(`Invalid date "${date}" for month with index "${month}".`);
        }
        return result;
    }
    today() {
        return new Date();
    }
    parse(value, parseFormat) {
        // We have no way using the native JS Date to set the parse format or locale, so we ignore these
        // parameters.
        if (typeof value == 'number') {
            return new Date(value);
        }
        return value ? new Date(Date.parse(value)) : null;
    }
    format(date, displayFormat) {
        if (!this.isValid(date)) {
            throw Error('NativeDateAdapter: Cannot format invalid date.');
        }
        const dtf = new Intl.DateTimeFormat(this.locale, { ...displayFormat, timeZone: 'utc' });
        return this._format(dtf, date);
    }
    addCalendarYears(date, years) {
        return this.addCalendarMonths(date, years * 12);
    }
    addCalendarMonths(date, months) {
        let newDate = this._createDateWithOverflow(this.getYear(date), this.getMonth(date) + months, this.getDate(date));
        // It's possible to wind up in the wrong month if the original month has more days than the new
        // month. In this case we want to go to the last day of the desired month.
        // Note: the additional + 12 % 12 ensures we end up with a positive number, since JS % doesn't
        // guarantee this.
        if (this.getMonth(newDate) != (((this.getMonth(date) + months) % 12) + 12) % 12) {
            newDate = this._createDateWithOverflow(this.getYear(newDate), this.getMonth(newDate), 0);
        }
        return newDate;
    }
    addCalendarDays(date, days) {
        return this._createDateWithOverflow(this.getYear(date), this.getMonth(date), this.getDate(date) + days);
    }
    toIso8601(date) {
        return [
            date.getUTCFullYear(),
            this._2digit(date.getUTCMonth() + 1),
            this._2digit(date.getUTCDate()),
        ].join('-');
    }
    /**
     * Returns the given value if given a valid Date or null. Deserializes valid ISO 8601 strings
     * (https://www.ietf.org/rfc/rfc3339.txt) into valid Dates and empty string into null. Returns an
     * invalid date for all other values.
     */
    deserialize(value) {
        if (typeof value === 'string') {
            if (!value) {
                return null;
            }
            // The `Date` constructor accepts formats other than ISO 8601, so we need to make sure the
            // string is the right format first.
            if (ISO_8601_REGEX.test(value)) {
                let date = new Date(value);
                if (this.isValid(date)) {
                    return date;
                }
            }
        }
        return super.deserialize(value);
    }
    isDateInstance(obj) {
        return obj instanceof Date;
    }
    isValid(date) {
        return !isNaN(date.getTime());
    }
    invalid() {
        return new Date(NaN);
    }
    setTime(target, hours, minutes, seconds) {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!inRange(hours, 0, 23)) {
                throw Error(`Invalid hours "${hours}". Hours value must be between 0 and 23.`);
            }
            if (!inRange(minutes, 0, 59)) {
                throw Error(`Invalid minutes "${minutes}". Minutes value must be between 0 and 59.`);
            }
            if (!inRange(seconds, 0, 59)) {
                throw Error(`Invalid seconds "${seconds}". Seconds value must be between 0 and 59.`);
            }
        }
        const clone = this.clone(target);
        clone.setHours(hours, minutes, seconds, 0);
        return clone;
    }
    getHours(date) {
        return date.getHours();
    }
    getMinutes(date) {
        return date.getMinutes();
    }
    getSeconds(date) {
        return date.getSeconds();
    }
    parseTime(userValue, parseFormat) {
        if (typeof userValue !== 'string') {
            return userValue instanceof Date ? new Date(userValue.getTime()) : null;
        }
        const value = userValue.trim();
        if (value.length === 0) {
            return null;
        }
        // Attempt to parse the value directly.
        let result = this._parseTimeString(value);
        // Some locales add extra characters around the time, but are otherwise parseable
        // (e.g. `00:05 ч.` in bg-BG). Try replacing all non-number and non-colon characters.
        if (result === null) {
            const withoutExtras = value.replace(/[^0-9:(AM|PM)]/gi, '').trim();
            if (withoutExtras.length > 0) {
                result = this._parseTimeString(withoutExtras);
            }
        }
        return result || this.invalid();
    }
    addSeconds(date, amount) {
        return new Date(date.getTime() + amount * 1000);
    }
    /** Creates a date but allows the month and date to overflow. */
    _createDateWithOverflow(year, month, date) {
        // Passing the year to the constructor causes year numbers <100 to be converted to 19xx.
        // To work around this we use `setFullYear` and `setHours` instead.
        const d = new Date();
        d.setFullYear(year, month, date);
        d.setHours(0, 0, 0, 0);
        return d;
    }
    /**
     * Pads a number to make it two digits.
     * @param n The number to pad.
     * @returns The padded number.
     */
    _2digit(n) {
        return ('00' + n).slice(-2);
    }
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
    _format(dtf, date) {
        // Passing the year to the constructor causes year numbers <100 to be converted to 19xx.
        // To work around this we use `setUTCFullYear` and `setUTCHours` instead.
        const d = new Date();
        d.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        d.setUTCHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
        return dtf.format(d);
    }
    /**
     * Attempts to parse a time string into a date object. Returns null if it cannot be parsed.
     * @param value Time string to parse.
     */
    _parseTimeString(value) {
        // Note: we can technically rely on the browser for the time parsing by generating
        // an ISO string and appending the string to the end of it. We don't do it, because
        // browsers aren't consistent in what they support. Some examples:
        // - Safari doesn't support AM/PM.
        // - Firefox produces a valid date object if the time string has overflows (e.g. 12:75) while
        //   other browsers produce an invalid date.
        // - Safari doesn't allow padded numbers.
        const parsed = value.toUpperCase().match(TIME_REGEX);
        if (parsed) {
            let hours = parseInt(parsed[1]);
            const minutes = parseInt(parsed[2]);
            let seconds = parsed[3] == null ? undefined : parseInt(parsed[3]);
            const amPm = parsed[4];
            if (hours === 12) {
                hours = amPm === 'AM' ? 0 : hours;
            }
            else if (amPm === 'PM') {
                hours += 12;
            }
            if (inRange(hours, 0, 23) &&
                inRange(minutes, 0, 59) &&
                (seconds == null || inRange(seconds, 0, 59))) {
                return this.setTime(this.today(), hours, minutes, seconds || 0);
            }
        }
        return null;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: NativeDateAdapter, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: NativeDateAdapter });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: NativeDateAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: () => [] });
/** Checks whether a number is within a certain range. */
function inRange(value, min, max) {
    return !isNaN(value) && value >= min && value <= max;
}

const MAT_NATIVE_DATE_FORMATS = {
    parse: {
        dateInput: null,
        timeInput: null,
    },
    display: {
        dateInput: { year: 'numeric', month: 'numeric', day: 'numeric' },
        timeInput: { hour: 'numeric', minute: 'numeric' },
        monthYearLabel: { year: 'numeric', month: 'short' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
        timeOptionLabel: { hour: 'numeric', minute: 'numeric' },
    },
};

class NativeDateModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: NativeDateModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: NativeDateModule });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: NativeDateModule, providers: [{ provide: DateAdapter, useClass: NativeDateAdapter }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: NativeDateModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [{ provide: DateAdapter, useClass: NativeDateAdapter }],
                }]
        }] });
class MatNativeDateModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatNativeDateModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatNativeDateModule });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatNativeDateModule, providers: [provideNativeDateAdapter()] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatNativeDateModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [provideNativeDateAdapter()],
                }]
        }] });
function provideNativeDateAdapter(formats = MAT_NATIVE_DATE_FORMATS) {
    return [
        { provide: DateAdapter, useClass: NativeDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: formats },
    ];
}

export { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter, NativeDateModule, VERSION, provideNativeDateAdapter };
//# sourceMappingURL=core.mjs.map
