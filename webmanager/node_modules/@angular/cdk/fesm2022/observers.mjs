import * as i0 from '@angular/core';
import { Injectable, inject, NgZone, ElementRef, EventEmitter, booleanAttribute, Directive, Output, Input, NgModule } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, filter, debounceTime } from 'rxjs/operators';
import { coerceNumberProperty, coerceElement } from './element.mjs';

// Angular may add, remove, or edit comment nodes during change detection. We don't care about
// these changes because they don't affect the user-preceived content, and worse it can cause
// infinite change detection cycles where the change detection updates a comment, triggering the
// MutationObserver, triggering another change detection and kicking the cycle off again.
function shouldIgnoreRecord(record) {
    // Ignore changes to comment text.
    if (record.type === 'characterData' && record.target instanceof Comment) {
        return true;
    }
    // Ignore addition / removal of comments.
    if (record.type === 'childList') {
        for (let i = 0; i < record.addedNodes.length; i++) {
            if (!(record.addedNodes[i] instanceof Comment)) {
                return false;
            }
        }
        for (let i = 0; i < record.removedNodes.length; i++) {
            if (!(record.removedNodes[i] instanceof Comment)) {
                return false;
            }
        }
        return true;
    }
    // Observe everything else.
    return false;
}
/**
 * Factory that creates a new MutationObserver and allows us to stub it out in unit tests.
 * @docs-private
 */
class MutationObserverFactory {
    create(callback) {
        return typeof MutationObserver === 'undefined' ? null : new MutationObserver(callback);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MutationObserverFactory, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MutationObserverFactory, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MutationObserverFactory, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
/** An injectable service that allows watching elements for changes to their content. */
class ContentObserver {
    _mutationObserverFactory = inject(MutationObserverFactory);
    /** Keeps track of the existing MutationObservers so they can be reused. */
    _observedElements = new Map();
    _ngZone = inject(NgZone);
    constructor() { }
    ngOnDestroy() {
        this._observedElements.forEach((_, element) => this._cleanupObserver(element));
    }
    observe(elementOrRef) {
        const element = coerceElement(elementOrRef);
        return new Observable((observer) => {
            const stream = this._observeElement(element);
            const subscription = stream
                .pipe(map(records => records.filter(record => !shouldIgnoreRecord(record))), filter(records => !!records.length))
                .subscribe(records => {
                this._ngZone.run(() => {
                    observer.next(records);
                });
            });
            return () => {
                subscription.unsubscribe();
                this._unobserveElement(element);
            };
        });
    }
    /**
     * Observes the given element by using the existing MutationObserver if available, or creating a
     * new one if not.
     */
    _observeElement(element) {
        return this._ngZone.runOutsideAngular(() => {
            if (!this._observedElements.has(element)) {
                const stream = new Subject();
                const observer = this._mutationObserverFactory.create(mutations => stream.next(mutations));
                if (observer) {
                    observer.observe(element, {
                        characterData: true,
                        childList: true,
                        subtree: true,
                    });
                }
                this._observedElements.set(element, { observer, stream, count: 1 });
            }
            else {
                this._observedElements.get(element).count++;
            }
            return this._observedElements.get(element).stream;
        });
    }
    /**
     * Un-observes the given element and cleans up the underlying MutationObserver if nobody else is
     * observing this element.
     */
    _unobserveElement(element) {
        if (this._observedElements.has(element)) {
            this._observedElements.get(element).count--;
            if (!this._observedElements.get(element).count) {
                this._cleanupObserver(element);
            }
        }
    }
    /** Clean up the underlying MutationObserver for the specified element. */
    _cleanupObserver(element) {
        if (this._observedElements.has(element)) {
            const { observer, stream } = this._observedElements.get(element);
            if (observer) {
                observer.disconnect();
            }
            stream.complete();
            this._observedElements.delete(element);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: ContentObserver, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: ContentObserver, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: ContentObserver, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });
/**
 * Directive that triggers a callback whenever the content of
 * its associated element has changed.
 */
class CdkObserveContent {
    _contentObserver = inject(ContentObserver);
    _elementRef = inject(ElementRef);
    /** Event emitted for each change in the element's content. */
    event = new EventEmitter();
    /**
     * Whether observing content is disabled. This option can be used
     * to disconnect the underlying MutationObserver until it is needed.
     */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = value;
        this._disabled ? this._unsubscribe() : this._subscribe();
    }
    _disabled = false;
    /** Debounce interval for emitting the changes. */
    get debounce() {
        return this._debounce;
    }
    set debounce(value) {
        this._debounce = coerceNumberProperty(value);
        this._subscribe();
    }
    _debounce;
    _currentSubscription = null;
    constructor() { }
    ngAfterContentInit() {
        if (!this._currentSubscription && !this.disabled) {
            this._subscribe();
        }
    }
    ngOnDestroy() {
        this._unsubscribe();
    }
    _subscribe() {
        this._unsubscribe();
        const stream = this._contentObserver.observe(this._elementRef);
        this._currentSubscription = (this.debounce ? stream.pipe(debounceTime(this.debounce)) : stream).subscribe(this.event);
    }
    _unsubscribe() {
        this._currentSubscription?.unsubscribe();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkObserveContent, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "20.2.0-next.2", type: CdkObserveContent, isStandalone: true, selector: "[cdkObserveContent]", inputs: { disabled: ["cdkObserveContentDisabled", "disabled", booleanAttribute], debounce: "debounce" }, outputs: { event: "cdkObserveContent" }, exportAs: ["cdkObserveContent"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkObserveContent, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkObserveContent]',
                    exportAs: 'cdkObserveContent',
                }]
        }], ctorParameters: () => [], propDecorators: { event: [{
                type: Output,
                args: ['cdkObserveContent']
            }], disabled: [{
                type: Input,
                args: [{ alias: 'cdkObserveContentDisabled', transform: booleanAttribute }]
            }], debounce: [{
                type: Input
            }] } });
class ObserversModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: ObserversModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: ObserversModule, imports: [CdkObserveContent], exports: [CdkObserveContent] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: ObserversModule, providers: [MutationObserverFactory] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: ObserversModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CdkObserveContent],
                    exports: [CdkObserveContent],
                    providers: [MutationObserverFactory],
                }]
        }] });

export { CdkObserveContent, ContentObserver, MutationObserverFactory, ObserversModule };
//# sourceMappingURL=observers.mjs.map
