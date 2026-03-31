import * as i0 from '@angular/core';
import { NgZone, ElementRef, Injector, InjectionToken, OnInit, OnDestroy } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

/** Possible states for a ripple element. */
declare enum RippleState {
    FADING_IN = 0,
    VISIBLE = 1,
    FADING_OUT = 2,
    HIDDEN = 3
}
type RippleConfig = {
    color?: string;
    centered?: boolean;
    radius?: number;
    persistent?: boolean;
    animation?: RippleAnimationConfig;
    terminateOnPointerUp?: boolean;
};
/**
 * Interface that describes the configuration for the animation of a ripple.
 * There are two animation phases with different durations for the ripples.
 */
interface RippleAnimationConfig {
    /** Duration in milliseconds for the enter animation (expansion from point of contact). */
    enterDuration?: number;
    /** Duration in milliseconds for the exit animation (fade-out). */
    exitDuration?: number;
}
/**
 * Reference to a previously launched ripple element.
 */
declare class RippleRef {
    private _renderer;
    /** Reference to the ripple HTML element. */
    element: HTMLElement;
    /** Ripple configuration used for the ripple. */
    config: RippleConfig;
    _animationForciblyDisabledThroughCss: boolean;
    /** Current state of the ripple. */
    state: RippleState;
    constructor(_renderer: {
        fadeOutRipple(ref: RippleRef): void;
    }, 
    /** Reference to the ripple HTML element. */
    element: HTMLElement, 
    /** Ripple configuration used for the ripple. */
    config: RippleConfig, _animationForciblyDisabledThroughCss?: boolean);
    /** Fades out the ripple element. */
    fadeOut(): void;
}

/**
 * Interface that describes the target for launching ripples.
 * It defines the ripple configuration and disabled state for interaction ripples.
 * @docs-private
 */
interface RippleTarget {
    /** Configuration for ripples that are launched on pointer down. */
    rippleConfig: RippleConfig;
    /** Whether ripples on pointer down should be disabled. */
    rippleDisabled: boolean;
}
/**
 * Default ripple animation configuration for ripples without an explicit
 * animation config specified.
 */
declare const defaultRippleAnimationConfig: {
    enterDuration: number;
    exitDuration: number;
};
/**
 * Helper service that performs DOM manipulations. Not intended to be used outside this module.
 * The constructor takes a reference to the ripple directive's host element and a map of DOM
 * event handlers to be installed on the element that triggers ripple animations.
 * This will eventually become a custom renderer once Angular support exists.
 * @docs-private
 */
declare class RippleRenderer implements EventListenerObject {
    private _target;
    private _ngZone;
    private _platform;
    /** Element where the ripples are being added to. */
    private _containerElement;
    /** Element which triggers the ripple elements on mouse events. */
    private _triggerElement;
    /** Whether the pointer is currently down or not. */
    private _isPointerDown;
    /**
     * Map of currently active ripple references.
     * The ripple reference is mapped to its element event listeners.
     * The reason why `| null` is used is that event listeners are added only
     * when the condition is truthy (see the `_startFadeOutTransition` method).
     */
    private _activeRipples;
    /** Latest non-persistent ripple that was triggered. */
    private _mostRecentTransientRipple;
    /** Time in milliseconds when the last touchstart event happened. */
    private _lastTouchStartEvent;
    /** Whether pointer-up event listeners have been registered. */
    private _pointerUpEventsRegistered;
    /**
     * Cached dimensions of the ripple container. Set when the first
     * ripple is shown and cleared once no more ripples are visible.
     */
    private _containerRect;
    private static _eventManager;
    constructor(_target: RippleTarget, _ngZone: NgZone, elementOrElementRef: HTMLElement | ElementRef<HTMLElement>, _platform: Platform, injector?: Injector);
    /**
     * Fades in a ripple at the given coordinates.
     * @param x Coordinate within the element, along the X axis at which to start the ripple.
     * @param y Coordinate within the element, along the Y axis at which to start the ripple.
     * @param config Extra ripple options.
     */
    fadeInRipple(x: number, y: number, config?: RippleConfig): RippleRef;
    /** Fades out a ripple reference. */
    fadeOutRipple(rippleRef: RippleRef): void;
    /** Fades out all currently active ripples. */
    fadeOutAll(): void;
    /** Fades out all currently active non-persistent ripples. */
    fadeOutAllNonPersistent(): void;
    /** Sets up the trigger event listeners */
    setupTriggerEvents(elementOrElementRef: HTMLElement | ElementRef<HTMLElement>): void;
    /**
     * Handles all registered events.
     * @docs-private
     */
    handleEvent(event: Event): void;
    /** Method that will be called if the fade-in or fade-in transition completed. */
    private _finishRippleTransition;
    /**
     * Starts the fade-out transition of the given ripple if it's not persistent and the pointer
     * is not held down anymore.
     */
    private _startFadeOutTransition;
    /** Destroys the given ripple by removing it from the DOM and updating its state. */
    private _destroyRipple;
    /** Function being called whenever the trigger is being pressed using mouse. */
    private _onMousedown;
    /** Function being called whenever the trigger is being pressed using touch. */
    private _onTouchStart;
    /** Function being called whenever the trigger is being released. */
    private _onPointerUp;
    private _getActiveRipples;
    /** Removes previously registered event listeners from the trigger element. */
    _removeTriggerEvents(): void;
}

/** Configurable options for `matRipple`. */
interface RippleGlobalOptions {
    /**
     * Whether ripples should be disabled. Ripples can be still launched manually by using
     * the `launch()` method. Therefore focus indicators will still show up.
     */
    disabled?: boolean;
    /**
     * Default configuration for the animation duration of the ripples. There are two phases with
     * different durations for the ripples: `enter` and `leave`. The durations will be overwritten
     * by the value of `matRippleAnimation` or if the `NoopAnimationsModule` is included.
     */
    animation?: RippleAnimationConfig;
    /**
     * Whether ripples should start fading out immediately after the mouse or touch is released. By
     * default, ripples will wait for the enter animation to complete and for mouse or touch release.
     */
    terminateOnPointerUp?: boolean;
    /**
     * A namespace to use for ripple loader to allow multiple instances to exist on the same page.
     */
    namespace?: string;
}
/** Injection token that can be used to specify the global ripple options. */
declare const MAT_RIPPLE_GLOBAL_OPTIONS: InjectionToken<RippleGlobalOptions>;
declare class MatRipple implements OnInit, OnDestroy, RippleTarget {
    private _elementRef;
    private _animationsDisabled;
    /** Custom color for all ripples. */
    color: string;
    /** Whether the ripples should be visible outside the component's bounds. */
    unbounded: boolean;
    /**
     * Whether the ripple always originates from the center of the host element's bounds, rather
     * than originating from the location of the click event.
     */
    centered: boolean;
    /**
     * If set, the radius in pixels of foreground ripples when fully expanded. If unset, the radius
     * will be the distance from the center of the ripple to the furthest corner of the host element's
     * bounding rectangle.
     */
    radius: number;
    /**
     * Configuration for the ripple animation. Allows modifying the enter and exit animation
     * duration of the ripples. The animation durations will be overwritten if the
     * `NoopAnimationsModule` is being used.
     */
    animation: RippleAnimationConfig;
    /**
     * Whether click events will not trigger the ripple. Ripples can be still launched manually
     * by using the `launch()` method.
     */
    get disabled(): boolean;
    set disabled(value: boolean);
    private _disabled;
    /**
     * The element that triggers the ripple when click events are received.
     * Defaults to the directive's host element.
     */
    get trigger(): HTMLElement;
    set trigger(trigger: HTMLElement);
    private _trigger;
    /** Renderer for the ripple DOM manipulations. */
    private _rippleRenderer;
    /** Options that are set globally for all ripples. */
    private _globalOptions;
    /** @docs-private Whether ripple directive is initialized and the input bindings are set. */
    _isInitialized: boolean;
    constructor(...args: unknown[]);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /** Fades out all currently showing ripple elements. */
    fadeOutAll(): void;
    /** Fades out all currently showing non-persistent ripple elements. */
    fadeOutAllNonPersistent(): void;
    /**
     * Ripple configuration from the directive's input values.
     * @docs-private Implemented as part of RippleTarget
     */
    get rippleConfig(): RippleConfig;
    /**
     * Whether ripples on pointer-down are disabled or not.
     * @docs-private Implemented as part of RippleTarget
     */
    get rippleDisabled(): boolean;
    /** Sets up the trigger event listeners if ripples are enabled. */
    private _setupTriggerEventsIfEnabled;
    /**
     * Launches a manual ripple using the specified ripple configuration.
     * @param config Configuration for the manual ripple.
     */
    launch(config: RippleConfig): RippleRef;
    /**
     * Launches a manual ripple at the specified coordinates relative to the viewport.
     * @param x Coordinate along the X axis at which to fade-in the ripple. Coordinate
     *   should be relative to the viewport.
     * @param y Coordinate along the Y axis at which to fade-in the ripple. Coordinate
     *   should be relative to the viewport.
     * @param config Optional ripple configuration for the manual ripple.
     */
    launch(x: number, y: number, config?: RippleConfig): RippleRef;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatRipple, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatRipple, "[mat-ripple], [matRipple]", ["matRipple"], { "color": { "alias": "matRippleColor"; "required": false; }; "unbounded": { "alias": "matRippleUnbounded"; "required": false; }; "centered": { "alias": "matRippleCentered"; "required": false; }; "radius": { "alias": "matRippleRadius"; "required": false; }; "animation": { "alias": "matRippleAnimation"; "required": false; }; "disabled": { "alias": "matRippleDisabled"; "required": false; }; "trigger": { "alias": "matRippleTrigger"; "required": false; }; }, {}, never, never, true, never>;
}

export { MAT_RIPPLE_GLOBAL_OPTIONS, MatRipple, RippleRef, RippleRenderer, RippleState, defaultRippleAnimationConfig };
export type { RippleAnimationConfig, RippleConfig, RippleGlobalOptions, RippleTarget };
