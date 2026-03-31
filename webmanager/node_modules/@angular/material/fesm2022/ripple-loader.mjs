import * as i0 from '@angular/core';
import { inject, DOCUMENT, NgZone, Injector, RendererFactory2, Injectable } from '@angular/core';
import { Platform, _getEventTarget } from '@angular/cdk/platform';
import { _animationsDisabled } from './animation.mjs';
import { MAT_RIPPLE_GLOBAL_OPTIONS, RippleRenderer, defaultRippleAnimationConfig } from './ripple.mjs';

/** The options for the MatRippleLoader's event listeners. */
const eventListenerOptions = { capture: true };
/**
 * The events that should trigger the initialization of the ripple.
 * Note that we use `mousedown`, rather than `click`, for mouse devices because
 * we can't rely on `mouseenter` in the shadow DOM and `click` happens too late.
 */
const rippleInteractionEvents = ['focus', 'mousedown', 'mouseenter', 'touchstart'];
/** The attribute attached to a component whose ripple has not yet been initialized. */
const matRippleUninitialized = 'mat-ripple-loader-uninitialized';
/** Additional classes that should be added to the ripple when it is rendered. */
const matRippleClassName = 'mat-ripple-loader-class-name';
/** Whether the ripple should be centered. */
const matRippleCentered = 'mat-ripple-loader-centered';
/** Whether the ripple should be disabled. */
const matRippleDisabled = 'mat-ripple-loader-disabled';
/**
 * Handles attaching ripples on demand.
 *
 * This service allows us to avoid eagerly creating & attaching MatRipples.
 * It works by creating & attaching a ripple only when a component is first interacted with.
 *
 * @docs-private
 */
class MatRippleLoader {
    _document = inject(DOCUMENT);
    _animationsDisabled = _animationsDisabled();
    _globalRippleOptions = inject(MAT_RIPPLE_GLOBAL_OPTIONS, { optional: true });
    _platform = inject(Platform);
    _ngZone = inject(NgZone);
    _injector = inject(Injector);
    _eventCleanups;
    _hosts = new Map();
    constructor() {
        const renderer = inject(RendererFactory2).createRenderer(null, null);
        this._eventCleanups = this._ngZone.runOutsideAngular(() => rippleInteractionEvents.map(name => renderer.listen(this._document, name, this._onInteraction, eventListenerOptions)));
    }
    ngOnDestroy() {
        const hosts = this._hosts.keys();
        for (const host of hosts) {
            this.destroyRipple(host);
        }
        this._eventCleanups.forEach(cleanup => cleanup());
    }
    /**
     * Configures the ripple that will be rendered by the ripple loader.
     *
     * Stores the given information about how the ripple should be configured on the host
     * element so that it can later be retrived & used when the ripple is actually created.
     */
    configureRipple(host, config) {
        // Indicates that the ripple has not yet been rendered for this component.
        host.setAttribute(matRippleUninitialized, this._globalRippleOptions?.namespace ?? '');
        // Store the additional class name(s) that should be added to the ripple element.
        if (config.className || !host.hasAttribute(matRippleClassName)) {
            host.setAttribute(matRippleClassName, config.className || '');
        }
        // Store whether the ripple should be centered.
        if (config.centered) {
            host.setAttribute(matRippleCentered, '');
        }
        if (config.disabled) {
            host.setAttribute(matRippleDisabled, '');
        }
    }
    /** Sets the disabled state on the ripple instance corresponding to the given host element. */
    setDisabled(host, disabled) {
        const ripple = this._hosts.get(host);
        // If the ripple has already been instantiated, just disable it.
        if (ripple) {
            ripple.target.rippleDisabled = disabled;
            if (!disabled && !ripple.hasSetUpEvents) {
                ripple.hasSetUpEvents = true;
                ripple.renderer.setupTriggerEvents(host);
            }
        }
        else if (disabled) {
            // Otherwise, set an attribute so we know what the
            // disabled state should be when the ripple is initialized.
            host.setAttribute(matRippleDisabled, '');
        }
        else {
            host.removeAttribute(matRippleDisabled);
        }
    }
    /**
     * Handles creating and attaching component internals
     * when a component is initially interacted with.
     */
    _onInteraction = (event) => {
        const eventTarget = _getEventTarget(event);
        if (eventTarget instanceof HTMLElement) {
            // TODO(wagnermaciel): Consider batching these events to improve runtime performance.
            const element = eventTarget.closest(`[${matRippleUninitialized}="${this._globalRippleOptions?.namespace ?? ''}"]`);
            if (element) {
                this._createRipple(element);
            }
        }
    };
    /** Creates a MatRipple and appends it to the given element. */
    _createRipple(host) {
        if (!this._document || this._hosts.has(host)) {
            return;
        }
        // Create the ripple element.
        host.querySelector('.mat-ripple')?.remove();
        const rippleEl = this._document.createElement('span');
        rippleEl.classList.add('mat-ripple', host.getAttribute(matRippleClassName));
        host.append(rippleEl);
        const globalOptions = this._globalRippleOptions;
        const enterDuration = this._animationsDisabled
            ? 0
            : (globalOptions?.animation?.enterDuration ?? defaultRippleAnimationConfig.enterDuration);
        const exitDuration = this._animationsDisabled
            ? 0
            : (globalOptions?.animation?.exitDuration ?? defaultRippleAnimationConfig.exitDuration);
        const target = {
            rippleDisabled: this._animationsDisabled || globalOptions?.disabled || host.hasAttribute(matRippleDisabled),
            rippleConfig: {
                centered: host.hasAttribute(matRippleCentered),
                terminateOnPointerUp: globalOptions?.terminateOnPointerUp,
                animation: {
                    enterDuration,
                    exitDuration,
                },
            },
        };
        const renderer = new RippleRenderer(target, this._ngZone, rippleEl, this._platform, this._injector);
        const hasSetUpEvents = !target.rippleDisabled;
        if (hasSetUpEvents) {
            renderer.setupTriggerEvents(host);
        }
        this._hosts.set(host, {
            target,
            renderer,
            hasSetUpEvents,
        });
        host.removeAttribute(matRippleUninitialized);
    }
    destroyRipple(host) {
        const ripple = this._hosts.get(host);
        if (ripple) {
            ripple.renderer._removeTriggerEvents();
            this._hosts.delete(host);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatRippleLoader, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatRippleLoader, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatRippleLoader, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });

export { MatRippleLoader };
//# sourceMappingURL=ripple-loader.mjs.map
