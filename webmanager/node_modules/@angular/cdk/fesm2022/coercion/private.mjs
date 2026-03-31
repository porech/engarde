import { isObservable, of } from 'rxjs';

/**
 * Given either an Observable or non-Observable value, returns either the original
 * Observable, or wraps it in an Observable that emits the non-Observable value.
 */
function coerceObservable(data) {
    if (!isObservable(data)) {
        return of(data);
    }
    return data;
}

export { coerceObservable };
//# sourceMappingURL=private.mjs.map
