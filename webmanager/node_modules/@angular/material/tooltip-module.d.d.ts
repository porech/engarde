import * as i0 from '@angular/core';
import { InjectionToken, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import * as i1 from '@angular/cdk/a11y';
import * as i2 from '@angular/cdk/overlay';
import { ScrollStrategy, OverlayRef, ConnectedPosition, OriginConnectionPosition, OverlayConnectionPosition } from '@angular/cdk/overlay';
import { MatCommonModule } from './common-module.d.js';
import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { Directionality } from '@angular/cdk/bidi';
import { Observable } from 'rxjs';
import * as i5 from '@angular/cdk/scrolling';

/** Possible positions for a tooltip. */
type TooltipPosition = 'left' | 'right' | 'above' | 'below' | 'before' | 'after';
/**
 * Options for how the tooltip trigger should handle touch gestures.
 * See `MatTooltip.touchGestures` for more information.
 */
type TooltipTouchGestures = 'auto' | 'on' | 'off';
/** Possible visibility states of a tooltip. */
type TooltipVisibility = 'initial' | 'visible' | 'hidden';
/** Time in ms to throttle repositioning after scroll events. */
declare const SCROLL_THROTTLE_MS = 20;
/**
 * Creates an error to be thrown if the user supplied an invalid tooltip position.
 * @docs-private
 */
declare function getMatTooltipInvalidPositionError(position: string): Error;
/** Injection token that determines the scroll handling while a tooltip is visible. */
declare const MAT_TOOLTIP_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
declare function MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY(_overlay: unknown): () => ScrollStrategy;
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
declare const MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER: {
    provide: InjectionToken<() => ScrollStrategy>;
    deps: any[];
    useFactory: typeof MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY;
};
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
declare function MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY(): MatTooltipDefaultOptions;
/** Injection token to be used to override the default options for `matTooltip`. */
declare const MAT_TOOLTIP_DEFAULT_OPTIONS: InjectionToken<MatTooltipDefaultOptions>;
/** Default `matTooltip` options that can be overridden. */
interface MatTooltipDefaultOptions {
    /** Default delay when the tooltip is shown. */
    showDelay: number;
    /** Default delay when the tooltip is hidden. */
    hideDelay: number;
    /** Default delay when hiding the tooltip on a touch device. */
    touchendHideDelay: number;
    /** Time between the user putting the pointer on a tooltip trigger and the long press event being fired on a touch device. */
    touchLongPressShowDelay?: number;
    /** Default touch gesture handling for tooltips. */
    touchGestures?: TooltipTouchGestures;
    /** Default position for tooltips. */
    position?: TooltipPosition;
    /**
     * Default value for whether tooltips should be positioned near the click or touch origin
     * instead of outside the element bounding box.
     */
    positionAtOrigin?: boolean;
    /** Disables the ability for the user to interact with the tooltip element. */
    disableTooltipInteractivity?: boolean;
    /**
     * Default classes to be applied to the tooltip. These default classes will not be applied if
     * `tooltipClass` is defined directly on the tooltip element, as it will override the default.
     */
    tooltipClass?: string | string[];
}
/**
 * CSS class that will be attached to the overlay panel.
 * @deprecated
 * @breaking-change 13.0.0 remove this variable
 */
declare const TOOLTIP_PANEL_CLASS = "mat-mdc-tooltip-panel";
/**
 * Directive that attaches a material design tooltip to the host element. Animates the showing and
 * hiding of a tooltip provided position (defaults to below the element).
 *
 * https://material.io/design/components/tooltips.html
 */
declare class MatTooltip implements OnDestroy, AfterViewInit {
    private _elementRef;
    private _ngZone;
    private _platform;
    private _ariaDescriber;
    private _focusMonitor;
    protected _dir: Directionality;
    private _injector;
    private _viewContainerRef;
    private _animationsDisabled;
    private _defaultOptions;
    _overlayRef: OverlayRef | null;
    _tooltipInstance: TooltipComponent | null;
    _overlayPanelClass: string[] | undefined;
    private _portal;
    private _position;
    private _positionAtOrigin;
    private _disabled;
    private _tooltipClass;
    private _viewInitialized;
    private _pointerExitEventsInitialized;
    private readonly _tooltipComponent;
    private _viewportMargin;
    private _currentPosition;
    private readonly _cssClassPrefix;
    private _ariaDescriptionPending;
    private _dirSubscribed;
    /** Allows the user to define the position of the tooltip relative to the parent element */
    get position(): TooltipPosition;
    set position(value: TooltipPosition);
    /**
     * Whether tooltip should be relative to the click or touch origin
     * instead of outside the element bounding box.
     */
    get positionAtOrigin(): boolean;
    set positionAtOrigin(value: BooleanInput);
    /** Disables the display of the tooltip. */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    /** The default delay in ms before showing the tooltip after show is called */
    get showDelay(): number;
    set showDelay(value: NumberInput);
    private _showDelay;
    /** The default delay in ms before hiding the tooltip after hide is called */
    get hideDelay(): number;
    set hideDelay(value: NumberInput);
    private _hideDelay;
    /**
     * How touch gestures should be handled by the tooltip. On touch devices the tooltip directive
     * uses a long press gesture to show and hide, however it can conflict with the native browser
     * gestures. To work around the conflict, Angular Material disables native gestures on the
     * trigger, but that might not be desirable on particular elements (e.g. inputs and draggable
     * elements). The different values for this option configure the touch event handling as follows:
     * - `auto` - Enables touch gestures for all elements, but tries to avoid conflicts with native
     *   browser gestures on particular elements. In particular, it allows text selection on inputs
     *   and textareas, and preserves the native browser dragging on elements marked as `draggable`.
     * - `on` - Enables touch gestures for all elements and disables native
     *   browser gestures with no exceptions.
     * - `off` - Disables touch gestures. Note that this will prevent the tooltip from
     *   showing on touch devices.
     */
    touchGestures: TooltipTouchGestures;
    /** The message to be displayed in the tooltip */
    get message(): string;
    set message(value: string | null | undefined);
    private _message;
    /** Classes to be passed to the tooltip. Supports the same syntax as `ngClass`. */
    get tooltipClass(): string | string[] | Set<string> | {
        [key: string]: any;
    };
    set tooltipClass(value: string | string[] | Set<string> | {
        [key: string]: any;
    });
    /** Manually-bound passive event listeners. */
    private readonly _passiveListeners;
    /** Timer started at the last `touchstart` event. */
    private _touchstartTimeout;
    /** Emits when the component is destroyed. */
    private readonly _destroyed;
    /** Whether ngOnDestroyed has been called. */
    private _isDestroyed;
    constructor(...args: unknown[]);
    ngAfterViewInit(): void;
    /**
     * Dispose the tooltip when destroyed.
     */
    ngOnDestroy(): void;
    /** Shows the tooltip after the delay in ms, defaults to tooltip-delay-show or 0ms if no input */
    show(delay?: number, origin?: {
        x: number;
        y: number;
    }): void;
    /** Hides the tooltip after the delay in ms, defaults to tooltip-delay-hide or 0ms if no input */
    hide(delay?: number): void;
    /** Shows/hides the tooltip */
    toggle(origin?: {
        x: number;
        y: number;
    }): void;
    /** Returns true if the tooltip is currently visible to the user */
    _isTooltipVisible(): boolean;
    /** Create the overlay config and position strategy */
    private _createOverlay;
    /** Detaches the currently-attached tooltip. */
    private _detach;
    /** Updates the position of the current tooltip. */
    private _updatePosition;
    /** Adds the configured offset to a position. Used as a hook for child classes. */
    protected _addOffset(position: ConnectedPosition): ConnectedPosition;
    /**
     * Returns the origin position and a fallback position based on the user's position preference.
     * The fallback position is the inverse of the origin (e.g. `'below' -> 'above'`).
     */
    _getOrigin(): {
        main: OriginConnectionPosition;
        fallback: OriginConnectionPosition;
    };
    /** Returns the overlay position and a fallback position based on the user's preference */
    _getOverlayPosition(): {
        main: OverlayConnectionPosition;
        fallback: OverlayConnectionPosition;
    };
    /** Updates the tooltip message and repositions the overlay according to the new message length */
    private _updateTooltipMessage;
    /** Updates the tooltip class */
    private _setTooltipClass;
    /** Inverts an overlay position. */
    private _invertPosition;
    /** Updates the class on the overlay panel based on the current position of the tooltip. */
    private _updateCurrentPositionClass;
    /** Binds the pointer events to the tooltip trigger. */
    private _setupPointerEnterEventsIfNeeded;
    private _setupPointerExitEventsIfNeeded;
    private _addListeners;
    private _platformSupportsMouseEvents;
    /** Listener for the `wheel` event on the element. */
    private _wheelListener;
    /** Disables the native browser gestures, based on how the tooltip has been configured. */
    private _disableNativeGesturesIfNecessary;
    /** Updates the tooltip's ARIA description based on it current state. */
    private _syncAriaDescription;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTooltip, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatTooltip, "[matTooltip]", ["matTooltip"], { "position": { "alias": "matTooltipPosition"; "required": false; }; "positionAtOrigin": { "alias": "matTooltipPositionAtOrigin"; "required": false; }; "disabled": { "alias": "matTooltipDisabled"; "required": false; }; "showDelay": { "alias": "matTooltipShowDelay"; "required": false; }; "hideDelay": { "alias": "matTooltipHideDelay"; "required": false; }; "touchGestures": { "alias": "matTooltipTouchGestures"; "required": false; }; "message": { "alias": "matTooltip"; "required": false; }; "tooltipClass": { "alias": "matTooltipClass"; "required": false; }; }, {}, never, never, true, never>;
}
/**
 * Internal component that wraps the tooltip's content.
 * @docs-private
 */
declare class TooltipComponent implements OnDestroy {
    private _changeDetectorRef;
    protected _elementRef: ElementRef<HTMLElement>;
    _isMultiline: boolean;
    /** Message to display in the tooltip */
    message: string;
    /** Classes to be added to the tooltip. Supports the same syntax as `ngClass`. */
    tooltipClass: string | string[] | Set<string> | {
        [key: string]: any;
    };
    /** The timeout ID of any current timer set to show the tooltip */
    private _showTimeoutId;
    /** The timeout ID of any current timer set to hide the tooltip */
    private _hideTimeoutId;
    /** Element that caused the tooltip to open. */
    _triggerElement: HTMLElement;
    /** Amount of milliseconds to delay the closing sequence. */
    _mouseLeaveHideDelay: number;
    /** Whether animations are currently disabled. */
    private _animationsDisabled;
    /** Reference to the internal tooltip element. */
    _tooltip: ElementRef<HTMLElement>;
    /** Whether interactions on the page should close the tooltip */
    private _closeOnInteraction;
    /** Whether the tooltip is currently visible. */
    private _isVisible;
    /** Subject for notifying that the tooltip has been hidden from the view */
    private readonly _onHide;
    /** Name of the show animation and the class that toggles it. */
    private readonly _showAnimation;
    /** Name of the hide animation and the class that toggles it. */
    private readonly _hideAnimation;
    constructor(...args: unknown[]);
    /**
     * Shows the tooltip with an animation originating from the provided origin
     * @param delay Amount of milliseconds to the delay showing the tooltip.
     */
    show(delay: number): void;
    /**
     * Begins the animation to hide the tooltip after the provided delay in ms.
     * @param delay Amount of milliseconds to delay showing the tooltip.
     */
    hide(delay: number): void;
    /** Returns an observable that notifies when the tooltip has been hidden from view. */
    afterHidden(): Observable<void>;
    /** Whether the tooltip is being displayed. */
    isVisible(): boolean;
    ngOnDestroy(): void;
    /**
     * Interactions on the HTML body should close the tooltip immediately as defined in the
     * material design spec.
     * https://material.io/design/components/tooltips.html#behavior
     */
    _handleBodyInteraction(): void;
    /**
     * Marks that the tooltip needs to be checked in the next change detection run.
     * Mainly used for rendering the initial text before positioning a tooltip, which
     * can be problematic in components with OnPush change detection.
     */
    _markForCheck(): void;
    _handleMouseLeave({ relatedTarget }: MouseEvent): void;
    /**
     * Callback for when the timeout in this.show() gets completed.
     * This method is only needed by the mdc-tooltip, and so it is only implemented
     * in the mdc-tooltip, not here.
     */
    protected _onShow(): void;
    /** Whether the tooltip text has overflown to the next line */
    private _isTooltipMultiline;
    /** Event listener dispatched when an animation on the tooltip finishes. */
    _handleAnimationEnd({ animationName }: AnimationEvent): void;
    /** Cancels any pending animation sequences. */
    _cancelPendingAnimations(): void;
    /** Handles the cleanup after an animation has finished. */
    private _finalizeAnimation;
    /** Toggles the visibility of the tooltip element. */
    private _toggleVisibility;
    static ɵfac: i0.ɵɵFactoryDeclaration<TooltipComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TooltipComponent, "mat-tooltip-component", never, {}, {}, never, never, true, never>;
}

declare class MatTooltipModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTooltipModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatTooltipModule, never, [typeof i1.A11yModule, typeof i2.OverlayModule, typeof MatCommonModule, typeof MatTooltip, typeof TooltipComponent], [typeof MatTooltip, typeof TooltipComponent, typeof MatCommonModule, typeof i5.CdkScrollableModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatTooltipModule>;
}

export { MAT_TOOLTIP_DEFAULT_OPTIONS, MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY, MAT_TOOLTIP_SCROLL_STRATEGY, MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY, MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER, MatTooltip, MatTooltipModule, SCROLL_THROTTLE_MS, TOOLTIP_PANEL_CLASS, TooltipComponent, getMatTooltipInvalidPositionError };
export type { MatTooltipDefaultOptions, TooltipPosition, TooltipTouchGestures, TooltipVisibility };
