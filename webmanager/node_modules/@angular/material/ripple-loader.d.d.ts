import * as i0 from '@angular/core';
import { OnDestroy } from '@angular/core';

/**
 * Handles attaching ripples on demand.
 *
 * This service allows us to avoid eagerly creating & attaching MatRipples.
 * It works by creating & attaching a ripple only when a component is first interacted with.
 *
 * @docs-private
 */
declare class MatRippleLoader implements OnDestroy {
    private _document;
    private _animationsDisabled;
    private _globalRippleOptions;
    private _platform;
    private _ngZone;
    private _injector;
    private _eventCleanups;
    private _hosts;
    constructor();
    ngOnDestroy(): void;
    /**
     * Configures the ripple that will be rendered by the ripple loader.
     *
     * Stores the given information about how the ripple should be configured on the host
     * element so that it can later be retrived & used when the ripple is actually created.
     */
    configureRipple(host: HTMLElement, config: {
        className?: string;
        centered?: boolean;
        disabled?: boolean;
    }): void;
    /** Sets the disabled state on the ripple instance corresponding to the given host element. */
    setDisabled(host: HTMLElement, disabled: boolean): void;
    /**
     * Handles creating and attaching component internals
     * when a component is initially interacted with.
     */
    private _onInteraction;
    /** Creates a MatRipple and appends it to the given element. */
    private _createRipple;
    destroyRipple(host: HTMLElement): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatRippleLoader, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MatRippleLoader>;
}

export { MatRippleLoader };
