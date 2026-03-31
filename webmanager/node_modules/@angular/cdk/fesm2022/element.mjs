import { ElementRef } from '@angular/core';

function coerceNumberProperty(value, fallbackValue = 0) {
    if (_isNumberValue(value)) {
        return Number(value);
    }
    return arguments.length === 2 ? fallbackValue : 0;
}
/**
 * Whether the provided value is considered a number.
 * @docs-private
 */
function _isNumberValue(value) {
    // parseFloat(value) handles most of the cases we're interested in (it treats null, empty string,
    // and other non-number values as NaN, where Number just uses 0) but it considers the string
    // '123hello' to be a valid number. Therefore we also check if Number(value) is NaN.
    return !isNaN(parseFloat(value)) && !isNaN(Number(value));
}

/**
 * Coerces an ElementRef or an Element into an element.
 * Useful for APIs that can accept either a ref or the native element itself.
 */
function coerceElement(elementOrRef) {
    return elementOrRef instanceof ElementRef ? elementOrRef.nativeElement : elementOrRef;
}

export { _isNumberValue, coerceElement, coerceNumberProperty };
//# sourceMappingURL=element.mjs.map
