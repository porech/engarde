import { InjectionToken, inject, LOCALE_ID } from '@angular/core';
import { Subject } from 'rxjs';

/** InjectionToken for datepicker that can be used to override default locale code. */
const MAT_DATE_LOCALE = new InjectionToken('MAT_DATE_LOCALE', {
    providedIn: 'root',
    factory: MAT_DATE_LOCALE_FACTORY,
});
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
function MAT_DATE_LOCALE_FACTORY() {
    return inject(LOCALE_ID);
}
const NOT_IMPLEMENTED = 'Method not implemented';
/** Adapts type `D` to be usable as a date by cdk-based components that work with dates. */
class DateAdapter {
    /** The locale to use for all dates. */
    locale;
    _localeChanges = new Subject();
    /** A stream that emits when the locale changes. */
    localeChanges = this._localeChanges;
    /**
     * Sets the time of one date to the time of another.
     * @param target Date whose time will be set.
     * @param hours New hours to set on the date object.
     * @param minutes New minutes to set on the date object.
     * @param seconds New seconds to set on the date object.
     */
    setTime(target, hours, minutes, seconds) {
        throw new Error(NOT_IMPLEMENTED);
    }
    /**
     * Gets the hours component of the given date.
     * @param date The date to extract the hours from.
     */
    getHours(date) {
        throw new Error(NOT_IMPLEMENTED);
    }
    /**
     * Gets the minutes component of the given date.
     * @param date The date to extract the minutes from.
     */
    getMinutes(date) {
        throw new Error(NOT_IMPLEMENTED);
    }
    /**
     * Gets the seconds component of the given date.
     * @param date The date to extract the seconds from.
     */
    getSeconds(date) {
        throw new Error(NOT_IMPLEMENTED);
    }
    /**
     * Parses a date with a specific time from a user-provided value.
     * @param value The value to parse.
     * @param parseFormat The expected format of the value being parsed
     *     (type is implementation-dependent).
     */
    parseTime(value, parseFormat) {
        throw new Error(NOT_IMPLEMENTED);
    }
    /**
     * Adds an amount of seconds to the specified date.
     * @param date Date to which to add the seconds.
     * @param amount Amount of seconds to add to the date.
     */
    addSeconds(date, amount) {
        throw new Error(NOT_IMPLEMENTED);
    }
    /**
     * Given a potential date object, returns that same date object if it is
     * a valid date, or `null` if it's not a valid date.
     * @param obj The object to check.
     * @returns A date or `null`.
     */
    getValidDateOrNull(obj) {
        return this.isDateInstance(obj) && this.isValid(obj) ? obj : null;
    }
    /**
     * Attempts to deserialize a value to a valid date object. This is different from parsing in that
     * deserialize should only accept non-ambiguous, locale-independent formats (e.g. a ISO 8601
     * string). The default implementation does not allow any deserialization, it simply checks that
     * the given value is already a valid date object or null. The `<mat-datepicker>` will call this
     * method on all of its `@Input()` properties that accept dates. It is therefore possible to
     * support passing values from your backend directly to these properties by overriding this method
     * to also deserialize the format used by your backend.
     * @param value The value to be deserialized into a date object.
     * @returns The deserialized date object, either a valid date, null if the value can be
     *     deserialized into a null date (e.g. the empty string), or an invalid date.
     */
    deserialize(value) {
        if (value == null || (this.isDateInstance(value) && this.isValid(value))) {
            return value;
        }
        return this.invalid();
    }
    /**
     * Sets the locale used for all dates.
     * @param locale The new locale.
     */
    setLocale(locale) {
        this.locale = locale;
        this._localeChanges.next();
    }
    /**
     * Compares two dates.
     * @param first The first date to compare.
     * @param second The second date to compare.
     * @returns 0 if the dates are equal, a number less than 0 if the first date is earlier,
     *     a number greater than 0 if the first date is later.
     */
    compareDate(first, second) {
        return (this.getYear(first) - this.getYear(second) ||
            this.getMonth(first) - this.getMonth(second) ||
            this.getDate(first) - this.getDate(second));
    }
    /**
     * Compares the time values of two dates.
     * @param first First date to compare.
     * @param second Second date to compare.
     * @returns 0 if the times are equal, a number less than 0 if the first time is earlier,
     *     a number greater than 0 if the first time is later.
     */
    compareTime(first, second) {
        return (this.getHours(first) - this.getHours(second) ||
            this.getMinutes(first) - this.getMinutes(second) ||
            this.getSeconds(first) - this.getSeconds(second));
    }
    /**
     * Checks if two dates are equal.
     * @param first The first date to check.
     * @param second The second date to check.
     * @returns Whether the two dates are equal.
     *     Null dates are considered equal to other null dates.
     */
    sameDate(first, second) {
        if (first && second) {
            let firstValid = this.isValid(first);
            let secondValid = this.isValid(second);
            if (firstValid && secondValid) {
                return !this.compareDate(first, second);
            }
            return firstValid == secondValid;
        }
        return first == second;
    }
    /**
     * Checks if the times of two dates are equal.
     * @param first The first date to check.
     * @param second The second date to check.
     * @returns Whether the times of the two dates are equal.
     *     Null dates are considered equal to other null dates.
     */
    sameTime(first, second) {
        if (first && second) {
            const firstValid = this.isValid(first);
            const secondValid = this.isValid(second);
            if (firstValid && secondValid) {
                return !this.compareTime(first, second);
            }
            return firstValid == secondValid;
        }
        return first == second;
    }
    /**
     * Clamp the given date between min and max dates.
     * @param date The date to clamp.
     * @param min The minimum value to allow. If null or omitted no min is enforced.
     * @param max The maximum value to allow. If null or omitted no max is enforced.
     * @returns `min` if `date` is less than `min`, `max` if date is greater than `max`,
     *     otherwise `date`.
     */
    clampDate(date, min, max) {
        if (min && this.compareDate(date, min) < 0) {
            return min;
        }
        if (max && this.compareDate(date, max) > 0) {
            return max;
        }
        return date;
    }
}

const MAT_DATE_FORMATS = new InjectionToken('mat-date-formats');

export { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_DATE_LOCALE_FACTORY };
//# sourceMappingURL=date-formats.mjs.map
