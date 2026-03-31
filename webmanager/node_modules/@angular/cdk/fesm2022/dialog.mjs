import * as i0 from '@angular/core';
import { inject, ElementRef, NgZone, Renderer2, ChangeDetectorRef, Injector, DOCUMENT, afterNextRender, Component, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, InjectionToken, TemplateRef, Injectable, signal, EventEmitter, NgModule } from '@angular/core';
import { Subject, defer } from 'rxjs';
import { BasePortalOutlet, CdkPortalOutlet, ComponentPortal, TemplatePortal, PortalModule } from './portal.mjs';
export { CdkPortal as ɵɵCdkPortal, PortalHostDirective as ɵɵPortalHostDirective, TemplatePortalDirective as ɵɵTemplatePortalDirective } from './portal.mjs';
import { FocusTrapFactory, InteractivityChecker, A11yModule } from './a11y-module.mjs';
import { FocusMonitor } from './focus-monitor.mjs';
import { Platform } from './platform2.mjs';
import { _getFocusedElementPierceShadowDom } from './shadow-dom.mjs';
import { ESCAPE } from './keycodes2.mjs';
import { hasModifierKey } from './keycodes.mjs';
import { startWith, take } from 'rxjs/operators';
import { createBlockScrollStrategy, OverlayContainer, createOverlayRef, OverlayConfig, createGlobalPositionStrategy, OverlayRef, OverlayModule } from './overlay-module.mjs';
import { _IdGenerator } from './id-generator.mjs';
import { Directionality } from './directionality.mjs';
import './style-loader.mjs';
import './private.mjs';
import './breakpoints-observer.mjs';
import './array.mjs';
import './observers.mjs';
import './element.mjs';
import './fake-event-detection.mjs';
import './passive-listeners.mjs';
import '@angular/common';
import './test-environment.mjs';
import './css-pixel-value.mjs';
import './scrolling.mjs';
import './scrolling2.mjs';
import './bidi.mjs';
import './recycle-view-repeater-strategy.mjs';
import './data-source.mjs';

/** Configuration for opening a modal dialog. */
class DialogConfig {
    /**
     * Where the attached component should live in Angular's *logical* component tree.
     * This affects what is available for injection and the change detection order for the
     * component instantiated inside of the dialog. This does not affect where the dialog
     * content will be rendered.
     */
    viewContainerRef;
    /**
     * Injector used for the instantiation of the component to be attached. If provided,
     * takes precedence over the injector indirectly provided by `ViewContainerRef`.
     */
    injector;
    /** ID for the dialog. If omitted, a unique one will be generated. */
    id;
    /** The ARIA role of the dialog element. */
    role = 'dialog';
    /** Optional CSS class or classes applied to the overlay panel. */
    panelClass = '';
    /** Whether the dialog has a backdrop. */
    hasBackdrop = true;
    /** Optional CSS class or classes applied to the overlay backdrop. */
    backdropClass = '';
    /** Whether the dialog closes with the escape key or pointer events outside the panel element. */
    disableClose = false;
    /** Function used to determine whether the dialog is allowed to close. */
    closePredicate;
    /** Width of the dialog. */
    width = '';
    /** Height of the dialog. */
    height = '';
    /** Min-width of the dialog. If a number is provided, assumes pixel units. */
    minWidth;
    /** Min-height of the dialog. If a number is provided, assumes pixel units. */
    minHeight;
    /** Max-width of the dialog. If a number is provided, assumes pixel units. */
    maxWidth;
    /** Max-height of the dialog. If a number is provided, assumes pixel units. */
    maxHeight;
    /** Strategy to use when positioning the dialog. Defaults to centering it on the page. */
    positionStrategy;
    /** Data being injected into the child component. */
    data = null;
    /** Layout direction for the dialog's content. */
    direction;
    /** ID of the element that describes the dialog. */
    ariaDescribedBy = null;
    /** ID of the element that labels the dialog. */
    ariaLabelledBy = null;
    /** Dialog label applied via `aria-label` */
    ariaLabel = null;
    /**
     * Whether this is a modal dialog. Used to set the `aria-modal` attribute. Off by default,
     * because it can interfere with other overlay-based components (e.g. `mat-select`) and because
     * it is redundant since the dialog marks all outside content as `aria-hidden` anyway.
     */
    ariaModal = false;
    /**
     * Where the dialog should focus on open.
     * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or
     * AutoFocusTarget instead.
     */
    autoFocus = 'first-tabbable';
    /**
     * Whether the dialog should restore focus to the previously-focused element upon closing.
     * Has the following behavior based on the type that is passed in:
     * - `boolean` - when true, will return focus to the element that was focused before the dialog
     *    was opened, otherwise won't restore focus at all.
     * - `string` - focus will be restored to the first element that matches the CSS selector.
     * - `HTMLElement` - focus will be restored to the specific element.
     */
    restoreFocus = true;
    /**
     * Scroll strategy to be used for the dialog. This determines how
     * the dialog responds to scrolling underneath the panel element.
     */
    scrollStrategy;
    /**
     * Whether the dialog should close when the user navigates backwards or forwards through browser
     * history. This does not apply to navigation via anchor element unless using URL-hash based
     * routing (`HashLocationStrategy` in the Angular router).
     */
    closeOnNavigation = true;
    /**
     * Whether the dialog should close when the dialog service is destroyed. This is useful if
     * another service is wrapping the dialog and is managing the destruction instead.
     */
    closeOnDestroy = true;
    /**
     * Whether the dialog should close when the underlying overlay is detached. This is useful if
     * another service is wrapping the dialog and is managing the destruction instead. E.g. an
     * external detachment can happen as a result of a scroll strategy triggering it or when the
     * browser location changes.
     */
    closeOnOverlayDetachments = true;
    /**
     * Whether the built-in overlay animations should be disabled.
     */
    disableAnimations = false;
    /**
     * Providers that will be exposed to the contents of the dialog. Can also
     * be provided as a function in order to generate the providers lazily.
     */
    providers;
    /**
     * Component into which the dialog content will be rendered. Defaults to `CdkDialogContainer`.
     * A configuration object can be passed in to customize the providers that will be exposed
     * to the dialog container.
     */
    container;
    /**
     * Context that will be passed to template-based dialogs.
     * A function can be passed in to resolve the context lazily.
     */
    templateContext;
}

function throwDialogContentAlreadyAttachedError() {
    throw Error('Attempting to attach dialog content after content is already attached');
}
/**
 * Internal component that wraps user-provided dialog content.
 * @docs-private
 */
class CdkDialogContainer extends BasePortalOutlet {
    _elementRef = inject(ElementRef);
    _focusTrapFactory = inject(FocusTrapFactory);
    _config;
    _interactivityChecker = inject(InteractivityChecker);
    _ngZone = inject(NgZone);
    _focusMonitor = inject(FocusMonitor);
    _renderer = inject(Renderer2);
    _changeDetectorRef = inject(ChangeDetectorRef);
    _injector = inject(Injector);
    _platform = inject(Platform);
    _document = inject(DOCUMENT);
    /** The portal outlet inside of this container into which the dialog content will be loaded. */
    _portalOutlet;
    _focusTrapped = new Subject();
    /** The class that traps and manages focus within the dialog. */
    _focusTrap = null;
    /** Element that was focused before the dialog was opened. Save this to restore upon close. */
    _elementFocusedBeforeDialogWasOpened = null;
    /**
     * Type of interaction that led to the dialog being closed. This is used to determine
     * whether the focus style will be applied when returning focus to its original location
     * after the dialog is closed.
     */
    _closeInteractionType = null;
    /**
     * Queue of the IDs of the dialog's label element, based on their definition order. The first
     * ID will be used as the `aria-labelledby` value. We use a queue here to handle the case
     * where there are two or more titles in the DOM at a time and the first one is destroyed while
     * the rest are present.
     */
    _ariaLabelledByQueue = [];
    _isDestroyed = false;
    constructor() {
        super();
        // Callback is primarily for some internal tests
        // that were instantiating the dialog container manually.
        this._config = (inject(DialogConfig, { optional: true }) || new DialogConfig());
        if (this._config.ariaLabelledBy) {
            this._ariaLabelledByQueue.push(this._config.ariaLabelledBy);
        }
    }
    _addAriaLabelledBy(id) {
        this._ariaLabelledByQueue.push(id);
        this._changeDetectorRef.markForCheck();
    }
    _removeAriaLabelledBy(id) {
        const index = this._ariaLabelledByQueue.indexOf(id);
        if (index > -1) {
            this._ariaLabelledByQueue.splice(index, 1);
            this._changeDetectorRef.markForCheck();
        }
    }
    _contentAttached() {
        this._initializeFocusTrap();
        this._captureInitialFocus();
    }
    /**
     * Can be used by child classes to customize the initial focus
     * capturing behavior (e.g. if it's tied to an animation).
     */
    _captureInitialFocus() {
        this._trapFocus();
    }
    ngOnDestroy() {
        this._focusTrapped.complete();
        this._isDestroyed = true;
        this._restoreFocus();
    }
    /**
     * Attach a ComponentPortal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    attachComponentPortal(portal) {
        if (this._portalOutlet.hasAttached() && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throwDialogContentAlreadyAttachedError();
        }
        const result = this._portalOutlet.attachComponentPortal(portal);
        this._contentAttached();
        return result;
    }
    /**
     * Attach a TemplatePortal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    attachTemplatePortal(portal) {
        if (this._portalOutlet.hasAttached() && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throwDialogContentAlreadyAttachedError();
        }
        const result = this._portalOutlet.attachTemplatePortal(portal);
        this._contentAttached();
        return result;
    }
    /**
     * Attaches a DOM portal to the dialog container.
     * @param portal Portal to be attached.
     * @deprecated To be turned into a method.
     * @breaking-change 10.0.0
     */
    attachDomPortal = (portal) => {
        if (this._portalOutlet.hasAttached() && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throwDialogContentAlreadyAttachedError();
        }
        const result = this._portalOutlet.attachDomPortal(portal);
        this._contentAttached();
        return result;
    };
    // TODO(crisbeto): this shouldn't be exposed, but there are internal references to it.
    /** Captures focus if it isn't already inside the dialog. */
    _recaptureFocus() {
        if (!this._containsFocus()) {
            this._trapFocus();
        }
    }
    /**
     * Focuses the provided element. If the element is not focusable, it will add a tabIndex
     * attribute to forcefully focus it. The attribute is removed after focus is moved.
     * @param element The element to focus.
     */
    _forceFocus(element, options) {
        if (!this._interactivityChecker.isFocusable(element)) {
            element.tabIndex = -1;
            // The tabindex attribute should be removed to avoid navigating to that element again
            this._ngZone.runOutsideAngular(() => {
                const callback = () => {
                    deregisterBlur();
                    deregisterMousedown();
                    element.removeAttribute('tabindex');
                };
                const deregisterBlur = this._renderer.listen(element, 'blur', callback);
                const deregisterMousedown = this._renderer.listen(element, 'mousedown', callback);
            });
        }
        element.focus(options);
    }
    /**
     * Focuses the first element that matches the given selector within the focus trap.
     * @param selector The CSS selector for the element to set focus to.
     */
    _focusByCssSelector(selector, options) {
        let elementToFocus = this._elementRef.nativeElement.querySelector(selector);
        if (elementToFocus) {
            this._forceFocus(elementToFocus, options);
        }
    }
    /**
     * Moves the focus inside the focus trap. When autoFocus is not set to 'dialog', if focus
     * cannot be moved then focus will go to the dialog container.
     */
    _trapFocus(options) {
        if (this._isDestroyed) {
            return;
        }
        // If were to attempt to focus immediately, then the content of the dialog would not yet be
        // ready in instances where change detection has to run first. To deal with this, we simply
        // wait until after the next render.
        afterNextRender(() => {
            const element = this._elementRef.nativeElement;
            switch (this._config.autoFocus) {
                case false:
                case 'dialog':
                    // Ensure that focus is on the dialog container. It's possible that a different
                    // component tried to move focus while the open animation was running. See:
                    // https://github.com/angular/components/issues/16215. Note that we only want to do this
                    // if the focus isn't inside the dialog already, because it's possible that the consumer
                    // turned off `autoFocus` in order to move focus themselves.
                    if (!this._containsFocus()) {
                        element.focus(options);
                    }
                    break;
                case true:
                case 'first-tabbable':
                    const focusedSuccessfully = this._focusTrap?.focusInitialElement(options);
                    // If we weren't able to find a focusable element in the dialog, then focus the dialog
                    // container instead.
                    if (!focusedSuccessfully) {
                        this._focusDialogContainer(options);
                    }
                    break;
                case 'first-heading':
                    this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]', options);
                    break;
                default:
                    this._focusByCssSelector(this._config.autoFocus, options);
                    break;
            }
            this._focusTrapped.next();
        }, { injector: this._injector });
    }
    /** Restores focus to the element that was focused before the dialog opened. */
    _restoreFocus() {
        const focusConfig = this._config.restoreFocus;
        let focusTargetElement = null;
        if (typeof focusConfig === 'string') {
            focusTargetElement = this._document.querySelector(focusConfig);
        }
        else if (typeof focusConfig === 'boolean') {
            focusTargetElement = focusConfig ? this._elementFocusedBeforeDialogWasOpened : null;
        }
        else if (focusConfig) {
            focusTargetElement = focusConfig;
        }
        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (this._config.restoreFocus &&
            focusTargetElement &&
            typeof focusTargetElement.focus === 'function') {
            const activeElement = _getFocusedElementPierceShadowDom();
            const element = this._elementRef.nativeElement;
            // Make sure that focus is still inside the dialog or is on the body (usually because a
            // non-focusable element like the backdrop was clicked) before moving it. It's possible that
            // the consumer moved it themselves before the animation was done, in which case we shouldn't
            // do anything.
            if (!activeElement ||
                activeElement === this._document.body ||
                activeElement === element ||
                element.contains(activeElement)) {
                if (this._focusMonitor) {
                    this._focusMonitor.focusVia(focusTargetElement, this._closeInteractionType);
                    this._closeInteractionType = null;
                }
                else {
                    focusTargetElement.focus();
                }
            }
        }
        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
    }
    /** Focuses the dialog container. */
    _focusDialogContainer(options) {
        // Note that there is no focus method when rendering on the server.
        this._elementRef.nativeElement.focus?.(options);
    }
    /** Returns whether focus is inside the dialog. */
    _containsFocus() {
        const element = this._elementRef.nativeElement;
        const activeElement = _getFocusedElementPierceShadowDom();
        return element === activeElement || element.contains(activeElement);
    }
    /** Sets up the focus trap. */
    _initializeFocusTrap() {
        if (this._platform.isBrowser) {
            this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
            // Save the previously focused element. This element will be re-focused
            // when the dialog closes.
            if (this._document) {
                this._elementFocusedBeforeDialogWasOpened = _getFocusedElementPierceShadowDom();
            }
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkDialogContainer, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.0-next.2", type: CdkDialogContainer, isStandalone: true, selector: "cdk-dialog-container", host: { attributes: { "tabindex": "-1" }, properties: { "attr.id": "_config.id || null", "attr.role": "_config.role", "attr.aria-modal": "_config.ariaModal", "attr.aria-labelledby": "_config.ariaLabel ? null : _ariaLabelledByQueue[0]", "attr.aria-label": "_config.ariaLabel", "attr.aria-describedby": "_config.ariaDescribedBy || null" }, classAttribute: "cdk-dialog-container" }, viewQueries: [{ propertyName: "_portalOutlet", first: true, predicate: CdkPortalOutlet, descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<ng-template cdkPortalOutlet />\n", styles: [".cdk-dialog-container{display:block;width:100%;height:100%;min-height:inherit;max-height:inherit}\n"], dependencies: [{ kind: "directive", type: CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkDialogContainer, decorators: [{
            type: Component,
            args: [{ selector: 'cdk-dialog-container', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, imports: [CdkPortalOutlet], host: {
                        'class': 'cdk-dialog-container',
                        'tabindex': '-1',
                        '[attr.id]': '_config.id || null',
                        '[attr.role]': '_config.role',
                        '[attr.aria-modal]': '_config.ariaModal',
                        '[attr.aria-labelledby]': '_config.ariaLabel ? null : _ariaLabelledByQueue[0]',
                        '[attr.aria-label]': '_config.ariaLabel',
                        '[attr.aria-describedby]': '_config.ariaDescribedBy || null',
                    }, template: "<ng-template cdkPortalOutlet />\n", styles: [".cdk-dialog-container{display:block;width:100%;height:100%;min-height:inherit;max-height:inherit}\n"] }]
        }], ctorParameters: () => [], propDecorators: { _portalOutlet: [{
                type: ViewChild,
                args: [CdkPortalOutlet, { static: true }]
            }] } });

/**
 * Reference to a dialog opened via the Dialog service.
 */
class DialogRef {
    overlayRef;
    config;
    /**
     * Instance of component opened into the dialog. Will be
     * null when the dialog is opened using a `TemplateRef`.
     */
    componentInstance;
    /**
     * `ComponentRef` of the component opened into the dialog. Will be
     * null when the dialog is opened using a `TemplateRef`.
     */
    componentRef;
    /** Instance of the container that is rendering out the dialog content. */
    containerInstance;
    /** Whether the user is allowed to close the dialog. */
    disableClose;
    /** Emits when the dialog has been closed. */
    closed = new Subject();
    /** Emits when the backdrop of the dialog is clicked. */
    backdropClick;
    /** Emits when on keyboard events within the dialog. */
    keydownEvents;
    /** Emits on pointer events that happen outside of the dialog. */
    outsidePointerEvents;
    /** Unique ID for the dialog. */
    id;
    /** Subscription to external detachments of the dialog. */
    _detachSubscription;
    constructor(overlayRef, config) {
        this.overlayRef = overlayRef;
        this.config = config;
        this.disableClose = config.disableClose;
        this.backdropClick = overlayRef.backdropClick();
        this.keydownEvents = overlayRef.keydownEvents();
        this.outsidePointerEvents = overlayRef.outsidePointerEvents();
        this.id = config.id; // By the time the dialog is created we are guaranteed to have an ID.
        this.keydownEvents.subscribe(event => {
            if (event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event)) {
                event.preventDefault();
                this.close(undefined, { focusOrigin: 'keyboard' });
            }
        });
        this.backdropClick.subscribe(() => {
            if (!this.disableClose && this._canClose()) {
                this.close(undefined, { focusOrigin: 'mouse' });
            }
            else {
                // Clicking on the backdrop will move focus out of dialog.
                // Recapture it if closing via the backdrop is disabled.
                this.containerInstance._recaptureFocus?.();
            }
        });
        this._detachSubscription = overlayRef.detachments().subscribe(() => {
            // Check specifically for `false`, because we want `undefined` to be treated like `true`.
            if (config.closeOnOverlayDetachments !== false) {
                this.close();
            }
        });
    }
    /**
     * Close the dialog.
     * @param result Optional result to return to the dialog opener.
     * @param options Additional options to customize the closing behavior.
     */
    close(result, options) {
        if (this._canClose(result)) {
            const closedSubject = this.closed;
            this.containerInstance._closeInteractionType = options?.focusOrigin || 'program';
            // Drop the detach subscription first since it can be triggered by the
            // `dispose` call and override the result of this closing sequence.
            this._detachSubscription.unsubscribe();
            this.overlayRef.dispose();
            closedSubject.next(result);
            closedSubject.complete();
            this.componentInstance = this.containerInstance = null;
        }
    }
    /** Updates the position of the dialog based on the current position strategy. */
    updatePosition() {
        this.overlayRef.updatePosition();
        return this;
    }
    /**
     * Updates the dialog's width and height.
     * @param width New width of the dialog.
     * @param height New height of the dialog.
     */
    updateSize(width = '', height = '') {
        this.overlayRef.updateSize({ width, height });
        return this;
    }
    /** Add a CSS class or an array of classes to the overlay pane. */
    addPanelClass(classes) {
        this.overlayRef.addPanelClass(classes);
        return this;
    }
    /** Remove a CSS class or an array of classes from the overlay pane. */
    removePanelClass(classes) {
        this.overlayRef.removePanelClass(classes);
        return this;
    }
    /** Whether the dialog is allowed to close. */
    _canClose(result) {
        const config = this.config;
        return (!!this.containerInstance &&
            (!config.closePredicate || config.closePredicate(result, config, this.componentInstance)));
    }
}

/** Injection token for the Dialog's ScrollStrategy. */
const DIALOG_SCROLL_STRATEGY = new InjectionToken('DialogScrollStrategy', {
    providedIn: 'root',
    factory: () => {
        const injector = inject(Injector);
        return () => createBlockScrollStrategy(injector);
    },
});
/** Injection token for the Dialog's Data. */
const DIALOG_DATA = new InjectionToken('DialogData');
/** Injection token that can be used to provide default options for the dialog module. */
const DEFAULT_DIALOG_CONFIG = new InjectionToken('DefaultDialogConfig');

function getDirectionality(value) {
    const valueSignal = signal(value, ...(ngDevMode ? [{ debugName: "valueSignal" }] : []));
    const change = new EventEmitter();
    return {
        valueSignal,
        get value() {
            return valueSignal();
        },
        change,
        ngOnDestroy() {
            change.complete();
        },
    };
}
class Dialog {
    _injector = inject(Injector);
    _defaultOptions = inject(DEFAULT_DIALOG_CONFIG, { optional: true });
    _parentDialog = inject(Dialog, { optional: true, skipSelf: true });
    _overlayContainer = inject(OverlayContainer);
    _idGenerator = inject(_IdGenerator);
    _openDialogsAtThisLevel = [];
    _afterAllClosedAtThisLevel = new Subject();
    _afterOpenedAtThisLevel = new Subject();
    _ariaHiddenElements = new Map();
    _scrollStrategy = inject(DIALOG_SCROLL_STRATEGY);
    /** Keeps track of the currently-open dialogs. */
    get openDialogs() {
        return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
    }
    /** Stream that emits when a dialog has been opened. */
    get afterOpened() {
        return this._parentDialog ? this._parentDialog.afterOpened : this._afterOpenedAtThisLevel;
    }
    /**
     * Stream that emits when all open dialog have finished closing.
     * Will emit on subscribe if there are no open dialogs to begin with.
     */
    afterAllClosed = defer(() => this.openDialogs.length
        ? this._getAfterAllClosed()
        : this._getAfterAllClosed().pipe(startWith(undefined)));
    constructor() { }
    open(componentOrTemplateRef, config) {
        const defaults = (this._defaultOptions || new DialogConfig());
        config = { ...defaults, ...config };
        config.id = config.id || this._idGenerator.getId('cdk-dialog-');
        if (config.id &&
            this.getDialogById(config.id) &&
            (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error(`Dialog with id "${config.id}" exists already. The dialog id must be unique.`);
        }
        const overlayConfig = this._getOverlayConfig(config);
        const overlayRef = createOverlayRef(this._injector, overlayConfig);
        const dialogRef = new DialogRef(overlayRef, config);
        const dialogContainer = this._attachContainer(overlayRef, dialogRef, config);
        dialogRef.containerInstance = dialogContainer;
        // If this is the first dialog that we're opening, hide all the non-overlay content.
        if (!this.openDialogs.length) {
            // Resolve this ahead of time, because some internal apps
            // mock it out and depend on it being synchronous.
            const overlayContainer = this._overlayContainer.getContainerElement();
            if (dialogContainer._focusTrapped) {
                dialogContainer._focusTrapped.pipe(take(1)).subscribe(() => {
                    this._hideNonDialogContentFromAssistiveTechnology(overlayContainer);
                });
            }
            else {
                this._hideNonDialogContentFromAssistiveTechnology(overlayContainer);
            }
        }
        this._attachDialogContent(componentOrTemplateRef, dialogRef, dialogContainer, config);
        this.openDialogs.push(dialogRef);
        dialogRef.closed.subscribe(() => this._removeOpenDialog(dialogRef, true));
        this.afterOpened.next(dialogRef);
        return dialogRef;
    }
    /**
     * Closes all of the currently-open dialogs.
     */
    closeAll() {
        reverseForEach(this.openDialogs, dialog => dialog.close());
    }
    /**
     * Finds an open dialog by its id.
     * @param id ID to use when looking up the dialog.
     */
    getDialogById(id) {
        return this.openDialogs.find(dialog => dialog.id === id);
    }
    ngOnDestroy() {
        // Make one pass over all the dialogs that need to be untracked, but should not be closed. We
        // want to stop tracking the open dialog even if it hasn't been closed, because the tracking
        // determines when `aria-hidden` is removed from elements outside the dialog.
        reverseForEach(this._openDialogsAtThisLevel, dialog => {
            // Check for `false` specifically since we want `undefined` to be interpreted as `true`.
            if (dialog.config.closeOnDestroy === false) {
                this._removeOpenDialog(dialog, false);
            }
        });
        // Make a second pass and close the remaining dialogs. We do this second pass in order to
        // correctly dispatch the `afterAllClosed` event in case we have a mixed array of dialogs
        // that should be closed and dialogs that should not.
        reverseForEach(this._openDialogsAtThisLevel, dialog => dialog.close());
        this._afterAllClosedAtThisLevel.complete();
        this._afterOpenedAtThisLevel.complete();
        this._openDialogsAtThisLevel = [];
    }
    /**
     * Creates an overlay config from a dialog config.
     * @param config The dialog configuration.
     * @returns The overlay configuration.
     */
    _getOverlayConfig(config) {
        const state = new OverlayConfig({
            positionStrategy: config.positionStrategy ||
                createGlobalPositionStrategy().centerHorizontally().centerVertically(),
            scrollStrategy: config.scrollStrategy || this._scrollStrategy(),
            panelClass: config.panelClass,
            hasBackdrop: config.hasBackdrop,
            direction: config.direction,
            minWidth: config.minWidth,
            minHeight: config.minHeight,
            maxWidth: config.maxWidth,
            maxHeight: config.maxHeight,
            width: config.width,
            height: config.height,
            disposeOnNavigation: config.closeOnNavigation,
            disableAnimations: config.disableAnimations,
        });
        if (config.backdropClass) {
            state.backdropClass = config.backdropClass;
        }
        return state;
    }
    /**
     * Attaches a dialog container to a dialog's already-created overlay.
     * @param overlay Reference to the dialog's underlying overlay.
     * @param config The dialog configuration.
     * @returns A promise resolving to a ComponentRef for the attached container.
     */
    _attachContainer(overlay, dialogRef, config) {
        const userInjector = config.injector || config.viewContainerRef?.injector;
        const providers = [
            { provide: DialogConfig, useValue: config },
            { provide: DialogRef, useValue: dialogRef },
            { provide: OverlayRef, useValue: overlay },
        ];
        let containerType;
        if (config.container) {
            if (typeof config.container === 'function') {
                containerType = config.container;
            }
            else {
                containerType = config.container.type;
                providers.push(...config.container.providers(config));
            }
        }
        else {
            containerType = CdkDialogContainer;
        }
        const containerPortal = new ComponentPortal(containerType, config.viewContainerRef, Injector.create({ parent: userInjector || this._injector, providers }));
        const containerRef = overlay.attach(containerPortal);
        return containerRef.instance;
    }
    /**
     * Attaches the user-provided component to the already-created dialog container.
     * @param componentOrTemplateRef The type of component being loaded into the dialog,
     *     or a TemplateRef to instantiate as the content.
     * @param dialogRef Reference to the dialog being opened.
     * @param dialogContainer Component that is going to wrap the dialog content.
     * @param config Configuration used to open the dialog.
     */
    _attachDialogContent(componentOrTemplateRef, dialogRef, dialogContainer, config) {
        if (componentOrTemplateRef instanceof TemplateRef) {
            const injector = this._createInjector(config, dialogRef, dialogContainer, undefined);
            let context = { $implicit: config.data, dialogRef };
            if (config.templateContext) {
                context = {
                    ...context,
                    ...(typeof config.templateContext === 'function'
                        ? config.templateContext()
                        : config.templateContext),
                };
            }
            dialogContainer.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, null, context, injector));
        }
        else {
            const injector = this._createInjector(config, dialogRef, dialogContainer, this._injector);
            const contentRef = dialogContainer.attachComponentPortal(new ComponentPortal(componentOrTemplateRef, config.viewContainerRef, injector));
            dialogRef.componentRef = contentRef;
            dialogRef.componentInstance = contentRef.instance;
        }
    }
    /**
     * Creates a custom injector to be used inside the dialog. This allows a component loaded inside
     * of a dialog to close itself and, optionally, to return a value.
     * @param config Config object that is used to construct the dialog.
     * @param dialogRef Reference to the dialog being opened.
     * @param dialogContainer Component that is going to wrap the dialog content.
     * @param fallbackInjector Injector to use as a fallback when a lookup fails in the custom
     * dialog injector, if the user didn't provide a custom one.
     * @returns The custom injector that can be used inside the dialog.
     */
    _createInjector(config, dialogRef, dialogContainer, fallbackInjector) {
        const userInjector = config.injector || config.viewContainerRef?.injector;
        const providers = [
            { provide: DIALOG_DATA, useValue: config.data },
            { provide: DialogRef, useValue: dialogRef },
        ];
        if (config.providers) {
            if (typeof config.providers === 'function') {
                providers.push(...config.providers(dialogRef, config, dialogContainer));
            }
            else {
                providers.push(...config.providers);
            }
        }
        if (config.direction &&
            (!userInjector ||
                !userInjector.get(Directionality, null, { optional: true }))) {
            providers.push({
                provide: Directionality,
                useValue: getDirectionality(config.direction),
            });
        }
        return Injector.create({ parent: userInjector || fallbackInjector, providers });
    }
    /**
     * Removes a dialog from the array of open dialogs.
     * @param dialogRef Dialog to be removed.
     * @param emitEvent Whether to emit an event if this is the last dialog.
     */
    _removeOpenDialog(dialogRef, emitEvent) {
        const index = this.openDialogs.indexOf(dialogRef);
        if (index > -1) {
            this.openDialogs.splice(index, 1);
            // If all the dialogs were closed, remove/restore the `aria-hidden`
            // to a the siblings and emit to the `afterAllClosed` stream.
            if (!this.openDialogs.length) {
                this._ariaHiddenElements.forEach((previousValue, element) => {
                    if (previousValue) {
                        element.setAttribute('aria-hidden', previousValue);
                    }
                    else {
                        element.removeAttribute('aria-hidden');
                    }
                });
                this._ariaHiddenElements.clear();
                if (emitEvent) {
                    this._getAfterAllClosed().next();
                }
            }
        }
    }
    /** Hides all of the content that isn't an overlay from assistive technology. */
    _hideNonDialogContentFromAssistiveTechnology(overlayContainer) {
        // Ensure that the overlay container is attached to the DOM.
        if (overlayContainer.parentElement) {
            const siblings = overlayContainer.parentElement.children;
            for (let i = siblings.length - 1; i > -1; i--) {
                const sibling = siblings[i];
                if (sibling !== overlayContainer &&
                    sibling.nodeName !== 'SCRIPT' &&
                    sibling.nodeName !== 'STYLE' &&
                    !sibling.hasAttribute('aria-live')) {
                    this._ariaHiddenElements.set(sibling, sibling.getAttribute('aria-hidden'));
                    sibling.setAttribute('aria-hidden', 'true');
                }
            }
        }
    }
    _getAfterAllClosed() {
        const parent = this._parentDialog;
        return parent ? parent._getAfterAllClosed() : this._afterAllClosedAtThisLevel;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: Dialog, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: Dialog, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: Dialog, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });
/**
 * Executes a callback against all elements in an array while iterating in reverse.
 * Useful if the array is being modified as it is being iterated.
 */
function reverseForEach(items, callback) {
    let i = items.length;
    while (i--) {
        callback(items[i]);
    }
}

class DialogModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: DialogModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: DialogModule, imports: [OverlayModule, PortalModule, A11yModule, CdkDialogContainer], exports: [
            // Re-export the PortalModule so that people extending the `CdkDialogContainer`
            // don't have to remember to import it or be faced with an unhelpful error.
            PortalModule,
            CdkDialogContainer] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: DialogModule, providers: [Dialog], imports: [OverlayModule, PortalModule, A11yModule, 
            // Re-export the PortalModule so that people extending the `CdkDialogContainer`
            // don't have to remember to import it or be faced with an unhelpful error.
            PortalModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: DialogModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [OverlayModule, PortalModule, A11yModule, CdkDialogContainer],
                    exports: [
                        // Re-export the PortalModule so that people extending the `CdkDialogContainer`
                        // don't have to remember to import it or be faced with an unhelpful error.
                        PortalModule,
                        CdkDialogContainer,
                    ],
                    providers: [Dialog],
                }]
        }] });

export { CdkDialogContainer, DEFAULT_DIALOG_CONFIG, DIALOG_DATA, DIALOG_SCROLL_STRATEGY, Dialog, DialogConfig, DialogModule, DialogRef, throwDialogContentAlreadyAttachedError, CdkPortalOutlet as ɵɵCdkPortalOutlet };
//# sourceMappingURL=dialog.mjs.map
