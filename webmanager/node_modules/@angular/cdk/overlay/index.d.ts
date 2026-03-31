import { ScrollStrategy, OverlayRef, PositionStrategy, FlexibleConnectedPositionStrategyOrigin, FlexibleConnectedPositionStrategy, OverlayConfig, OverlayContainer } from '../overlay-module.d.js';
export { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedOverlayPositionChange, ConnectedPosition, ConnectionPositionPair, HorizontalConnectionPos, OriginConnectionPosition, OverlayConnectionPosition, OverlayKeyboardDispatcher, OverlayModule, OverlayOutsideClickDispatcher, OverlaySizeConfig, STANDARD_DROPDOWN_ADJACENT_POSITIONS, STANDARD_DROPDOWN_BELOW_POSITIONS, ScrollingVisibility, VerticalConnectionPos, createFlexibleConnectedPositionStrategy, validateHorizontalPosition, validateVerticalPosition } from '../overlay-module.d.js';
import { ScrollDispatcher } from '../scrolling-module.d.js';
export { CdkScrollable, CdkFixedSizeVirtualScroll as ɵɵCdkFixedSizeVirtualScroll, CdkScrollableModule as ɵɵCdkScrollableModule, CdkVirtualForOf as ɵɵCdkVirtualForOf, CdkVirtualScrollViewport as ɵɵCdkVirtualScrollViewport, CdkVirtualScrollableElement as ɵɵCdkVirtualScrollableElement, CdkVirtualScrollableWindow as ɵɵCdkVirtualScrollableWindow } from '../scrolling-module.d.js';
import { ViewportRuler } from '../scrolling/index.js';
import * as i0 from '@angular/core';
import { Injector, NgZone, OnDestroy } from '@angular/core';
export { ComponentType } from '../portal-directives.d.js';
export { Dir as ɵɵDir } from '../bidi-module.d.js';
import '@angular/common';
import 'rxjs';
import '../platform.d.js';
import '../style-loader.d.js';
import '../data-source.d.js';
import '../number-property.d.js';

/**
 * Config options for the RepositionScrollStrategy.
 */
interface RepositionScrollStrategyConfig {
    /** Time in milliseconds to throttle the scroll events. */
    scrollThrottle?: number;
    /** Whether to close the overlay once the user has scrolled away completely. */
    autoClose?: boolean;
}
/**
 * Creates a scroll strategy that updates the overlay's position when the user scrolls.
 * @param injector Injector used to resolve dependencies of the scroll strategy.
 * @param config Configuration options for the scroll strategy.
 */
declare function createRepositionScrollStrategy(injector: Injector, config?: RepositionScrollStrategyConfig): RepositionScrollStrategy;
/**
 * Strategy that will update the element position as the user is scrolling.
 */
declare class RepositionScrollStrategy implements ScrollStrategy {
    private _scrollDispatcher;
    private _viewportRuler;
    private _ngZone;
    private _config?;
    private _scrollSubscription;
    private _overlayRef;
    constructor(_scrollDispatcher: ScrollDispatcher, _viewportRuler: ViewportRuler, _ngZone: NgZone, _config?: RepositionScrollStrategyConfig | undefined);
    /** Attaches this scroll strategy to an overlay. */
    attach(overlayRef: OverlayRef): void;
    /** Enables repositioning of the attached overlay on scroll. */
    enable(): void;
    /** Disables repositioning of the attached overlay on scroll. */
    disable(): void;
    detach(): void;
}

/**
 * Creates a scroll strategy that prevents the user from scrolling while the overlay is open.
 * @param injector Injector used to resolve dependencies of the scroll strategy.
 * @param config Configuration options for the scroll strategy.
 */
declare function createBlockScrollStrategy(injector: Injector): BlockScrollStrategy;
/**
 * Strategy that will prevent the user from scrolling while the overlay is visible.
 */
declare class BlockScrollStrategy implements ScrollStrategy {
    private _viewportRuler;
    private _previousHTMLStyles;
    private _previousScrollPosition;
    private _isEnabled;
    private _document;
    constructor(_viewportRuler: ViewportRuler, document: any);
    /** Attaches this scroll strategy to an overlay. */
    attach(): void;
    /** Blocks page-level scroll while the attached overlay is open. */
    enable(): void;
    /** Unblocks page-level scroll while the attached overlay is open. */
    disable(): void;
    private _canBeEnabled;
}

/**
 * Config options for the CloseScrollStrategy.
 */
interface CloseScrollStrategyConfig {
    /** Amount of pixels the user has to scroll before the overlay is closed. */
    threshold?: number;
}
/**
 * Creates a scroll strategy that closes the overlay when the user starts to scroll.
 * @param injector Injector used to resolve dependencies of the scroll strategy.
 * @param config Configuration options for the scroll strategy.
 */
declare function createCloseScrollStrategy(injector: Injector, config?: CloseScrollStrategyConfig): CloseScrollStrategy;
/**
 * Strategy that will close the overlay as soon as the user starts scrolling.
 */
declare class CloseScrollStrategy implements ScrollStrategy {
    private _scrollDispatcher;
    private _ngZone;
    private _viewportRuler;
    private _config?;
    private _scrollSubscription;
    private _overlayRef;
    private _initialScrollPosition;
    constructor(_scrollDispatcher: ScrollDispatcher, _ngZone: NgZone, _viewportRuler: ViewportRuler, _config?: CloseScrollStrategyConfig | undefined);
    /** Attaches this scroll strategy to an overlay. */
    attach(overlayRef: OverlayRef): void;
    /** Enables the closing of the attached overlay on scroll. */
    enable(): void;
    /** Disables the closing the attached overlay on scroll. */
    disable(): void;
    detach(): void;
    /** Detaches the overlay ref and disables the scroll strategy. */
    private _detach;
}

/** Creates a scroll strategy that does nothing. */
declare function createNoopScrollStrategy(): NoopScrollStrategy;
/** Scroll strategy that doesn't do anything. */
declare class NoopScrollStrategy implements ScrollStrategy {
    /** Does nothing, as this scroll strategy is a no-op. */
    enable(): void;
    /** Does nothing, as this scroll strategy is a no-op. */
    disable(): void;
    /** Does nothing, as this scroll strategy is a no-op. */
    attach(): void;
}

/**
 * Options for how an overlay will handle scrolling.
 *
 * Users can provide a custom value for `ScrollStrategyOptions` to replace the default
 * behaviors. This class primarily acts as a factory for ScrollStrategy instances.
 */
declare class ScrollStrategyOptions {
    private _injector;
    constructor(...args: unknown[]);
    /** Do nothing on scroll. */
    noop: () => NoopScrollStrategy;
    /**
     * Close the overlay as soon as the user scrolls.
     * @param config Configuration to be used inside the scroll strategy.
     */
    close: (config?: CloseScrollStrategyConfig) => CloseScrollStrategy;
    /** Block scrolling. */
    block: () => BlockScrollStrategy;
    /**
     * Update the overlay's position on scroll.
     * @param config Configuration to be used inside the scroll strategy.
     * Allows debouncing the reposition calls.
     */
    reposition: (config?: RepositionScrollStrategyConfig) => RepositionScrollStrategy;
    static ɵfac: i0.ɵɵFactoryDeclaration<ScrollStrategyOptions, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ScrollStrategyOptions>;
}

/**
 * Creates a global position strategy.
 * @param injector Injector used to resolve dependencies for the strategy.
 */
declare function createGlobalPositionStrategy(_injector: Injector): GlobalPositionStrategy;
/**
 * A strategy for positioning overlays. Using this strategy, an overlay is given an
 * explicit position relative to the browser's viewport. We use flexbox, instead of
 * transforms, in order to avoid issues with subpixel rendering which can cause the
 * element to become blurry.
 */
declare class GlobalPositionStrategy implements PositionStrategy {
    /** The overlay to which this strategy is attached. */
    private _overlayRef;
    private _cssPosition;
    private _topOffset;
    private _bottomOffset;
    private _alignItems;
    private _xPosition;
    private _xOffset;
    private _width;
    private _height;
    private _isDisposed;
    attach(overlayRef: OverlayRef): void;
    /**
     * Sets the top position of the overlay. Clears any previously set vertical position.
     * @param value New top offset.
     */
    top(value?: string): this;
    /**
     * Sets the left position of the overlay. Clears any previously set horizontal position.
     * @param value New left offset.
     */
    left(value?: string): this;
    /**
     * Sets the bottom position of the overlay. Clears any previously set vertical position.
     * @param value New bottom offset.
     */
    bottom(value?: string): this;
    /**
     * Sets the right position of the overlay. Clears any previously set horizontal position.
     * @param value New right offset.
     */
    right(value?: string): this;
    /**
     * Sets the overlay to the start of the viewport, depending on the overlay direction.
     * This will be to the left in LTR layouts and to the right in RTL.
     * @param offset Offset from the edge of the screen.
     */
    start(value?: string): this;
    /**
     * Sets the overlay to the end of the viewport, depending on the overlay direction.
     * This will be to the right in LTR layouts and to the left in RTL.
     * @param offset Offset from the edge of the screen.
     */
    end(value?: string): this;
    /**
     * Sets the overlay width and clears any previously set width.
     * @param value New width for the overlay
     * @deprecated Pass the `width` through the `OverlayConfig`.
     * @breaking-change 8.0.0
     */
    width(value?: string): this;
    /**
     * Sets the overlay height and clears any previously set height.
     * @param value New height for the overlay
     * @deprecated Pass the `height` through the `OverlayConfig`.
     * @breaking-change 8.0.0
     */
    height(value?: string): this;
    /**
     * Centers the overlay horizontally with an optional offset.
     * Clears any previously set horizontal position.
     *
     * @param offset Overlay offset from the horizontal center.
     */
    centerHorizontally(offset?: string): this;
    /**
     * Centers the overlay vertically with an optional offset.
     * Clears any previously set vertical position.
     *
     * @param offset Overlay offset from the vertical center.
     */
    centerVertically(offset?: string): this;
    /**
     * Apply the position to the element.
     * @docs-private
     */
    apply(): void;
    /**
     * Cleans up the DOM changes from the position strategy.
     * @docs-private
     */
    dispose(): void;
}

/** Builder for overlay position strategy. */
declare class OverlayPositionBuilder {
    private _injector;
    constructor(...args: unknown[]);
    /**
     * Creates a global position strategy.
     */
    global(): GlobalPositionStrategy;
    /**
     * Creates a flexible position strategy.
     * @param origin Origin relative to which to position the overlay.
     */
    flexibleConnectedTo(origin: FlexibleConnectedPositionStrategyOrigin): FlexibleConnectedPositionStrategy;
    static ɵfac: i0.ɵɵFactoryDeclaration<OverlayPositionBuilder, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OverlayPositionBuilder>;
}

/**
 * Creates an overlay.
 * @param injector Injector to use when resolving the overlay's dependencies.
 * @param config Configuration applied to the overlay.
 * @returns Reference to the created overlay.
 */
declare function createOverlayRef(injector: Injector, config?: OverlayConfig): OverlayRef;
/**
 * Service to create Overlays. Overlays are dynamically added pieces of floating UI, meant to be
 * used as a low-level building block for other components. Dialogs, tooltips, menus,
 * selects, etc. can all be built using overlays. The service should primarily be used by authors
 * of re-usable components rather than developers building end-user applications.
 *
 * An overlay *is* a PortalOutlet, so any kind of Portal can be loaded into one.
 */
declare class Overlay {
    scrollStrategies: ScrollStrategyOptions;
    private _positionBuilder;
    private _injector;
    constructor(...args: unknown[]);
    /**
     * Creates an overlay.
     * @param config Configuration applied to the overlay.
     * @returns Reference to the created overlay.
     */
    create(config?: OverlayConfig): OverlayRef;
    /**
     * Gets a position builder that can be used, via fluent API,
     * to construct and configure a position strategy.
     * @returns An overlay position builder.
     */
    position(): OverlayPositionBuilder;
    static ɵfac: i0.ɵɵFactoryDeclaration<Overlay, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Overlay>;
}

/**
 * Alternative to OverlayContainer that supports correct displaying of overlay elements in
 * Fullscreen mode
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen
 *
 * Should be provided in the root component.
 */
declare class FullscreenOverlayContainer extends OverlayContainer implements OnDestroy {
    private _renderer;
    private _fullScreenEventName;
    private _cleanupFullScreenListener;
    constructor(...args: unknown[]);
    ngOnDestroy(): void;
    protected _createContainer(): void;
    private _adjustParentForFullscreenChange;
    private _getEventName;
    /**
     * When the page is put into fullscreen mode, a specific element is specified.
     * Only that element and its children are visible when in fullscreen mode.
     */
    getFullscreenElement(): Element;
    static ɵfac: i0.ɵɵFactoryDeclaration<FullscreenOverlayContainer, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FullscreenOverlayContainer>;
}

export { BlockScrollStrategy, CloseScrollStrategy, FlexibleConnectedPositionStrategy, FlexibleConnectedPositionStrategyOrigin, FullscreenOverlayContainer, GlobalPositionStrategy, NoopScrollStrategy, Overlay, OverlayConfig, OverlayContainer, OverlayPositionBuilder, OverlayRef, PositionStrategy, RepositionScrollStrategy, ScrollDispatcher, ScrollStrategy, ScrollStrategyOptions, ViewportRuler, createBlockScrollStrategy, createCloseScrollStrategy, createGlobalPositionStrategy, createNoopScrollStrategy, createOverlayRef, createRepositionScrollStrategy };
export type { RepositionScrollStrategyConfig };
