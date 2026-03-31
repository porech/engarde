export { Platform } from '../platform.d.js';
import * as i0 from '@angular/core';

declare class PlatformModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<PlatformModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<PlatformModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<PlatformModule>;
}

/** @returns The input types supported by this browser. */
declare function getSupportedInputTypes(): Set<string>;

/**
 * Checks whether the user's browser supports passive event listeners.
 * See: https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
 */
declare function supportsPassiveEventListeners(): boolean;
/**
 * Normalizes an `AddEventListener` object to something that can be passed
 * to `addEventListener` on any browser, no matter whether it supports the
 * `options` parameter.
 * @param options Object to be normalized.
 */
declare function normalizePassiveListenerOptions(options: AddEventListenerOptions): AddEventListenerOptions | boolean;

/** The possible ways the browser may handle the horizontal scroll axis in RTL languages. */
declare enum RtlScrollAxisType {
    /**
     * scrollLeft is 0 when scrolled all the way left and (scrollWidth - clientWidth) when scrolled
     * all the way right.
     */
    NORMAL = 0,
    /**
     * scrollLeft is -(scrollWidth - clientWidth) when scrolled all the way left and 0 when scrolled
     * all the way right.
     */
    NEGATED = 1,
    /**
     * scrollLeft is (scrollWidth - clientWidth) when scrolled all the way left and 0 when scrolled
     * all the way right.
     */
    INVERTED = 2
}
/** Check whether the browser supports scroll behaviors. */
declare function supportsScrollBehavior(): boolean;
/**
 * Checks the type of RTL scroll axis used by this browser. As of time of writing, Chrome is NORMAL,
 * Firefox & Safari are NEGATED, and IE & Edge are INVERTED.
 */
declare function getRtlScrollAxisType(): RtlScrollAxisType;

/** Checks whether the user's browser support Shadow DOM. */
declare function _supportsShadowDom(): boolean;
/** Gets the shadow root of an element, if supported and the element is inside the Shadow DOM. */
declare function _getShadowRoot(element: HTMLElement): ShadowRoot | null;
/**
 * Gets the currently-focused element on the page while
 * also piercing through Shadow DOM boundaries.
 */
declare function _getFocusedElementPierceShadowDom(): HTMLElement | null;
/** Gets the target of an event while accounting for Shadow DOM. */
declare function _getEventTarget<T extends EventTarget>(event: Event): T | null;

/** Gets whether the code is currently running in a test environment. */
declare function _isTestEnvironment(): boolean;

export { PlatformModule, RtlScrollAxisType, _getEventTarget, _getFocusedElementPierceShadowDom, _getShadowRoot, _isTestEnvironment, _supportsShadowDom, getRtlScrollAxisType, getSupportedInputTypes, normalizePassiveListenerOptions, supportsPassiveEventListeners, supportsScrollBehavior };
