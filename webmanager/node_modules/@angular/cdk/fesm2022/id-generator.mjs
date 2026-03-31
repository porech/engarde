import * as i0 from '@angular/core';
import { inject, APP_ID, Injectable } from '@angular/core';

/**
 * Keeps track of the ID count per prefix. This helps us make the IDs a bit more deterministic
 * like they were before the service was introduced. Note that ideally we wouldn't have to do
 * this, but there are some internal tests that rely on the IDs.
 */
const counters = {};
/** Service that generates unique IDs for DOM nodes. */
class _IdGenerator {
    _appId = inject(APP_ID);
    /**
     * Generates a unique ID with a specific prefix.
     * @param prefix Prefix to add to the ID.
     */
    getId(prefix) {
        // Omit the app ID if it's the default `ng`. Since the vast majority of pages have one
        // Angular app on them, we can reduce the amount of breakages by not adding it.
        if (this._appId !== 'ng') {
            prefix += this._appId;
        }
        if (!counters.hasOwnProperty(prefix)) {
            counters[prefix] = 0;
        }
        return `${prefix}${counters[prefix]++}`;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: _IdGenerator, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: _IdGenerator, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: _IdGenerator, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

export { _IdGenerator };
//# sourceMappingURL=id-generator.mjs.map
