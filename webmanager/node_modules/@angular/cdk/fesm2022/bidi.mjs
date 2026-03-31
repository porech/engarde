import { _resolveDirectionality, Directionality } from './directionality.mjs';
export { DIR_DOCUMENT } from './directionality.mjs';
import * as i0 from '@angular/core';
import { EventEmitter, signal, Directive, Output, Input, NgModule } from '@angular/core';

/**
 * Directive to listen for changes of direction of part of the DOM.
 *
 * Provides itself as Directionality such that descendant directives only need to ever inject
 * Directionality to get the closest direction.
 */
class Dir {
    /** Whether the `value` has been set to its initial value. */
    _isInitialized = false;
    /** Direction as passed in by the consumer. */
    _rawDir;
    /** Event emitted when the direction changes. */
    change = new EventEmitter();
    /** @docs-private */
    get dir() {
        return this.valueSignal();
    }
    set dir(value) {
        const previousValue = this.valueSignal();
        // Note: `_resolveDirectionality` resolves the language based on the browser's language,
        // whereas the browser does it based on the content of the element. Since doing so based
        // on the content can be expensive, for now we're doing the simpler matching.
        this.valueSignal.set(_resolveDirectionality(value));
        this._rawDir = value;
        if (previousValue !== this.valueSignal() && this._isInitialized) {
            this.change.emit(this.valueSignal());
        }
    }
    /** Current layout direction of the element. */
    get value() {
        return this.dir;
    }
    valueSignal = signal('ltr', ...(ngDevMode ? [{ debugName: "valueSignal" }] : []));
    /** Initialize once default value has been set. */
    ngAfterContentInit() {
        this._isInitialized = true;
    }
    ngOnDestroy() {
        this.change.complete();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: Dir, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: Dir, isStandalone: true, selector: "[dir]", inputs: { dir: "dir" }, outputs: { change: "dirChange" }, host: { properties: { "attr.dir": "_rawDir" } }, providers: [{ provide: Directionality, useExisting: Dir }], exportAs: ["dir"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: Dir, decorators: [{
            type: Directive,
            args: [{
                    selector: '[dir]',
                    providers: [{ provide: Directionality, useExisting: Dir }],
                    host: { '[attr.dir]': '_rawDir' },
                    exportAs: 'dir',
                }]
        }], propDecorators: { change: [{
                type: Output,
                args: ['dirChange']
            }], dir: [{
                type: Input
            }] } });

class BidiModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: BidiModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: BidiModule, imports: [Dir], exports: [Dir] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: BidiModule });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: BidiModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [Dir],
                    exports: [Dir],
                }]
        }] });

export { BidiModule, Dir, Directionality };
//# sourceMappingURL=bidi.mjs.map
