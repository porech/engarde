import { CdkDialogContainer, Dialog, DialogConfig, DialogModule } from '@angular/cdk/dialog';
import { createBlockScrollStrategy, createGlobalPositionStrategy, OverlayModule } from '@angular/cdk/overlay';
import { CdkPortalOutlet, PortalModule } from '@angular/cdk/portal';
import * as i0 from '@angular/core';
import { EventEmitter, Component, ViewEncapsulation, ChangeDetectionStrategy, InjectionToken, inject, Injector, Injectable, ElementRef, Directive, Input, NgModule } from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { _animationsDisabled } from './animation.mjs';
import { Subject, merge, defer } from 'rxjs';
import { filter, take, startWith } from 'rxjs/operators';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { _IdGenerator } from '@angular/cdk/a11y';
import * as i1 from '@angular/cdk/scrolling';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatCommonModule } from './common-module.mjs';

/**
 * Configuration for opening a modal dialog with the MatDialog service.
 */
class MatDialogConfig {
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
    /** Custom class for the overlay pane. */
    panelClass = '';
    /** Whether the dialog has a backdrop. */
    hasBackdrop = true;
    /** Custom class for the backdrop. */
    backdropClass = '';
    /** Whether the user can use escape or clicking on the backdrop to close the modal. */
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
    /** Position overrides. */
    position;
    /** Data being injected into the child component. */
    data = null;
    /** Layout direction for the dialog's content. */
    direction;
    /** ID of the element that describes the dialog. */
    ariaDescribedBy = null;
    /** ID of the element that labels the dialog. */
    ariaLabelledBy = null;
    /** Aria label to assign to the dialog element. */
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
     * Whether the dialog should restore focus to the
     * previously-focused element, after it's closed.
     */
    restoreFocus = true;
    /** Whether to wait for the opening animation to finish before trapping focus. */
    delayFocusTrap = true;
    /** Scroll strategy to be used for the dialog. */
    scrollStrategy;
    /**
     * Whether the dialog should close when the user goes backwards/forwards in history.
     * Note that this usually doesn't include clicking on links (unless the user is using
     * the `HashLocationStrategy`).
     */
    closeOnNavigation = true;
    /**
     * Duration of the enter animation in ms.
     * Should be a number, string type is deprecated.
     * @breaking-change 17.0.0 Remove string signature.
     */
    enterAnimationDuration;
    /**
     * Duration of the exit animation in ms.
     * Should be a number, string type is deprecated.
     * @breaking-change 17.0.0 Remove string signature.
     */
    exitAnimationDuration;
}

/** Class added when the dialog is open. */
const OPEN_CLASS = 'mdc-dialog--open';
/** Class added while the dialog is opening. */
const OPENING_CLASS = 'mdc-dialog--opening';
/** Class added while the dialog is closing. */
const CLOSING_CLASS = 'mdc-dialog--closing';
/** Duration of the opening animation in milliseconds. */
const OPEN_ANIMATION_DURATION = 150;
/** Duration of the closing animation in milliseconds. */
const CLOSE_ANIMATION_DURATION = 75;
class MatDialogContainer extends CdkDialogContainer {
    /** Emits when an animation state changes. */
    _animationStateChanged = new EventEmitter();
    /** Whether animations are enabled. */
    _animationsEnabled = !_animationsDisabled();
    /** Number of actions projected in the dialog. */
    _actionSectionCount = 0;
    /** Host element of the dialog container component. */
    _hostElement = this._elementRef.nativeElement;
    /** Duration of the dialog open animation. */
    _enterAnimationDuration = this._animationsEnabled
        ? (parseCssTime(this._config.enterAnimationDuration) ?? OPEN_ANIMATION_DURATION)
        : 0;
    /** Duration of the dialog close animation. */
    _exitAnimationDuration = this._animationsEnabled
        ? (parseCssTime(this._config.exitAnimationDuration) ?? CLOSE_ANIMATION_DURATION)
        : 0;
    /** Current timer for dialog animations. */
    _animationTimer = null;
    _contentAttached() {
        // Delegate to the original dialog-container initialization (i.e. saving the
        // previous element, setting up the focus trap and moving focus to the container).
        super._contentAttached();
        // Note: Usually we would be able to use the MDC dialog foundation here to handle
        // the dialog animation for us, but there are a few reasons why we just leverage
        // their styles and not use the runtime foundation code:
        //   1. Foundation does not allow us to disable animations.
        //   2. Foundation contains unnecessary features we don't need and aren't
        //      tree-shakeable. e.g. background scrim, keyboard event handlers for ESC button.
        this._startOpenAnimation();
    }
    /** Starts the dialog open animation if enabled. */
    _startOpenAnimation() {
        this._animationStateChanged.emit({ state: 'opening', totalTime: this._enterAnimationDuration });
        if (this._animationsEnabled) {
            this._hostElement.style.setProperty(TRANSITION_DURATION_PROPERTY, `${this._enterAnimationDuration}ms`);
            // We need to give the `setProperty` call from above some time to be applied.
            // One would expect that the open class is added once the animation finished, but MDC
            // uses the open class in combination with the opening class to start the animation.
            this._requestAnimationFrame(() => this._hostElement.classList.add(OPENING_CLASS, OPEN_CLASS));
            this._waitForAnimationToComplete(this._enterAnimationDuration, this._finishDialogOpen);
        }
        else {
            this._hostElement.classList.add(OPEN_CLASS);
            // Note: We could immediately finish the dialog opening here with noop animations,
            // but we defer until next tick so that consumers can subscribe to `afterOpened`.
            // Executing this immediately would mean that `afterOpened` emits synchronously
            // on `dialog.open` before the consumer had a change to subscribe to `afterOpened`.
            Promise.resolve().then(() => this._finishDialogOpen());
        }
    }
    /**
     * Starts the exit animation of the dialog if enabled. This method is
     * called by the dialog ref.
     */
    _startExitAnimation() {
        this._animationStateChanged.emit({ state: 'closing', totalTime: this._exitAnimationDuration });
        this._hostElement.classList.remove(OPEN_CLASS);
        if (this._animationsEnabled) {
            this._hostElement.style.setProperty(TRANSITION_DURATION_PROPERTY, `${this._exitAnimationDuration}ms`);
            // We need to give the `setProperty` call from above some time to be applied.
            this._requestAnimationFrame(() => this._hostElement.classList.add(CLOSING_CLASS));
            this._waitForAnimationToComplete(this._exitAnimationDuration, this._finishDialogClose);
        }
        else {
            // This subscription to the `OverlayRef#backdropClick` observable in the `DialogRef` is
            // set up before any user can subscribe to the backdrop click. The subscription triggers
            // the dialog close and this method synchronously. If we'd synchronously emit the `CLOSED`
            // animation state event if animations are disabled, the overlay would be disposed
            // immediately and all other subscriptions to `DialogRef#backdropClick` would be silently
            // skipped. We work around this by waiting with the dialog close until the next tick when
            // all subscriptions have been fired as expected. This is not an ideal solution, but
            // there doesn't seem to be any other good way. Alternatives that have been considered:
            //   1. Deferring `DialogRef.close`. This could be a breaking change due to a new microtask.
            //      Also this issue is specific to the MDC implementation where the dialog could
            //      technically be closed synchronously. In the non-MDC one, Angular animations are used
            //      and closing always takes at least a tick.
            //   2. Ensuring that user subscriptions to `backdropClick`, `keydownEvents` in the dialog
            //      ref are first. This would solve the issue, but has the risk of memory leaks and also
            //      doesn't solve the case where consumers call `DialogRef.close` in their subscriptions.
            // Based on the fact that this is specific to the MDC-based implementation of the dialog
            // animations, the defer is applied here.
            Promise.resolve().then(() => this._finishDialogClose());
        }
    }
    /**
     * Updates the number action sections.
     * @param delta Increase/decrease in the number of sections.
     */
    _updateActionSectionCount(delta) {
        this._actionSectionCount += delta;
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Completes the dialog open by clearing potential animation classes, trapping
     * focus and emitting an opened event.
     */
    _finishDialogOpen = () => {
        this._clearAnimationClasses();
        this._openAnimationDone(this._enterAnimationDuration);
    };
    /**
     * Completes the dialog close by clearing potential animation classes, restoring
     * focus and emitting a closed event.
     */
    _finishDialogClose = () => {
        this._clearAnimationClasses();
        this._animationStateChanged.emit({ state: 'closed', totalTime: this._exitAnimationDuration });
    };
    /** Clears all dialog animation classes. */
    _clearAnimationClasses() {
        this._hostElement.classList.remove(OPENING_CLASS, CLOSING_CLASS);
    }
    _waitForAnimationToComplete(duration, callback) {
        if (this._animationTimer !== null) {
            clearTimeout(this._animationTimer);
        }
        // Note that we want this timer to run inside the NgZone, because we want
        // the related events like `afterClosed` to be inside the zone as well.
        this._animationTimer = setTimeout(callback, duration);
    }
    /** Runs a callback in `requestAnimationFrame`, if available. */
    _requestAnimationFrame(callback) {
        this._ngZone.runOutsideAngular(() => {
            if (typeof requestAnimationFrame === 'function') {
                requestAnimationFrame(callback);
            }
            else {
                callback();
            }
        });
    }
    _captureInitialFocus() {
        if (!this._config.delayFocusTrap) {
            this._trapFocus();
        }
    }
    /**
     * Callback for when the open dialog animation has finished. Intended to
     * be called by sub-classes that use different animation implementations.
     */
    _openAnimationDone(totalTime) {
        if (this._config.delayFocusTrap) {
            this._trapFocus();
        }
        this._animationStateChanged.next({ state: 'opened', totalTime });
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._animationTimer !== null) {
            clearTimeout(this._animationTimer);
        }
    }
    attachComponentPortal(portal) {
        // When a component is passed into the dialog, the host element interrupts
        // the `display:flex` from affecting the dialog title, content, and
        // actions. To fix this, we make the component host `display: contents` by
        // marking its host with the `mat-mdc-dialog-component-host` class.
        //
        // Note that this problem does not exist when a template ref is used since
        // the title, contents, and actions are then nested directly under the
        // dialog surface.
        const ref = super.attachComponentPortal(portal);
        ref.location.nativeElement.classList.add('mat-mdc-dialog-component-host');
        return ref;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatDialogContainer, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.0-next.2", type: MatDialogContainer, isStandalone: true, selector: "mat-dialog-container", host: { attributes: { "tabindex": "-1" }, properties: { "attr.aria-modal": "_config.ariaModal", "id": "_config.id", "attr.role": "_config.role", "attr.aria-labelledby": "_config.ariaLabel ? null : _ariaLabelledByQueue[0]", "attr.aria-label": "_config.ariaLabel", "attr.aria-describedby": "_config.ariaDescribedBy || null", "class._mat-animation-noopable": "!_animationsEnabled", "class.mat-mdc-dialog-container-with-actions": "_actionSectionCount > 0" }, classAttribute: "mat-mdc-dialog-container mdc-dialog" }, usesInheritance: true, ngImport: i0, template: "<div class=\"mat-mdc-dialog-inner-container mdc-dialog__container\">\n  <div class=\"mat-mdc-dialog-surface mdc-dialog__surface\">\n    <ng-template cdkPortalOutlet />\n  </div>\n</div>\n", styles: [".mat-mdc-dialog-container{width:100%;height:100%;display:block;box-sizing:border-box;max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit;outline:0}.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-max-width, 560px);min-width:var(--mat-dialog-container-min-width, 280px)}@media(max-width: 599px){.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-small-max-width, calc(100vw - 32px))}}.mat-mdc-dialog-inner-container{display:flex;flex-direction:row;align-items:center;justify-content:space-around;box-sizing:border-box;height:100%;opacity:0;transition:opacity linear var(--mat-dialog-transition-duration, 0ms);max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit}.mdc-dialog--closing .mat-mdc-dialog-inner-container{transition:opacity 75ms linear;transform:none}.mdc-dialog--open .mat-mdc-dialog-inner-container{opacity:1}._mat-animation-noopable .mat-mdc-dialog-inner-container{transition:none}.mat-mdc-dialog-surface{display:flex;flex-direction:column;flex-grow:0;flex-shrink:0;box-sizing:border-box;width:100%;height:100%;position:relative;overflow-y:auto;outline:0;transform:scale(0.8);transition:transform var(--mat-dialog-transition-duration, 0ms) cubic-bezier(0, 0, 0.2, 1);max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit;box-shadow:var(--mat-dialog-container-elevation-shadow, none);border-radius:var(--mat-dialog-container-shape, var(--mat-sys-corner-extra-large, 4px));background-color:var(--mat-dialog-container-color, var(--mat-sys-surface, white))}[dir=rtl] .mat-mdc-dialog-surface{text-align:right}.mdc-dialog--open .mat-mdc-dialog-surface,.mdc-dialog--closing .mat-mdc-dialog-surface{transform:none}._mat-animation-noopable .mat-mdc-dialog-surface{transition:none}.mat-mdc-dialog-surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:2px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}.mat-mdc-dialog-title{display:block;position:relative;flex-shrink:0;box-sizing:border-box;margin:0 0 1px;padding:var(--mat-dialog-headline-padding, 6px 24px 13px)}.mat-mdc-dialog-title::before{display:inline-block;width:0;height:40px;content:\"\";vertical-align:0}[dir=rtl] .mat-mdc-dialog-title{text-align:right}.mat-mdc-dialog-container .mat-mdc-dialog-title{color:var(--mat-dialog-subhead-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));font-family:var(--mat-dialog-subhead-font, var(--mat-sys-headline-small-font, inherit));line-height:var(--mat-dialog-subhead-line-height, var(--mat-sys-headline-small-line-height, 1.5rem));font-size:var(--mat-dialog-subhead-size, var(--mat-sys-headline-small-size, 1rem));font-weight:var(--mat-dialog-subhead-weight, var(--mat-sys-headline-small-weight, 400));letter-spacing:var(--mat-dialog-subhead-tracking, var(--mat-sys-headline-small-tracking, 0.03125em))}.mat-mdc-dialog-content{display:block;flex-grow:1;box-sizing:border-box;margin:0;overflow:auto;max-height:65vh}.mat-mdc-dialog-content>:first-child{margin-top:0}.mat-mdc-dialog-content>:last-child{margin-bottom:0}.mat-mdc-dialog-container .mat-mdc-dialog-content{color:var(--mat-dialog-supporting-text-color, var(--mat-sys-on-surface-variant, rgba(0, 0, 0, 0.6)));font-family:var(--mat-dialog-supporting-text-font, var(--mat-sys-body-medium-font, inherit));line-height:var(--mat-dialog-supporting-text-line-height, var(--mat-sys-body-medium-line-height, 1.5rem));font-size:var(--mat-dialog-supporting-text-size, var(--mat-sys-body-medium-size, 1rem));font-weight:var(--mat-dialog-supporting-text-weight, var(--mat-sys-body-medium-weight, 400));letter-spacing:var(--mat-dialog-supporting-text-tracking, var(--mat-sys-body-medium-tracking, 0.03125em))}.mat-mdc-dialog-container .mat-mdc-dialog-content{padding:var(--mat-dialog-content-padding, 20px 24px)}.mat-mdc-dialog-container-with-actions .mat-mdc-dialog-content{padding:var(--mat-dialog-with-actions-content-padding, 20px 24px 0)}.mat-mdc-dialog-container .mat-mdc-dialog-title+.mat-mdc-dialog-content{padding-top:0}.mat-mdc-dialog-actions{display:flex;position:relative;flex-shrink:0;flex-wrap:wrap;align-items:center;box-sizing:border-box;min-height:52px;margin:0;border-top:1px solid rgba(0,0,0,0);padding:var(--mat-dialog-actions-padding, 16px 24px);justify-content:var(--mat-dialog-actions-alignment, flex-end)}@media(forced-colors: active){.mat-mdc-dialog-actions{border-top-color:CanvasText}}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-start,.mat-mdc-dialog-actions[align=start]{justify-content:start}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-center,.mat-mdc-dialog-actions[align=center]{justify-content:center}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-end,.mat-mdc-dialog-actions[align=end]{justify-content:flex-end}.mat-mdc-dialog-actions .mat-button-base+.mat-button-base,.mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-mdc-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}.mat-mdc-dialog-component-host{display:contents}\n"], dependencies: [{ kind: "directive", type: CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatDialogContainer, decorators: [{
            type: Component,
            args: [{ selector: 'mat-dialog-container', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, imports: [CdkPortalOutlet], host: {
                        'class': 'mat-mdc-dialog-container mdc-dialog',
                        'tabindex': '-1',
                        '[attr.aria-modal]': '_config.ariaModal',
                        '[id]': '_config.id',
                        '[attr.role]': '_config.role',
                        '[attr.aria-labelledby]': '_config.ariaLabel ? null : _ariaLabelledByQueue[0]',
                        '[attr.aria-label]': '_config.ariaLabel',
                        '[attr.aria-describedby]': '_config.ariaDescribedBy || null',
                        '[class._mat-animation-noopable]': '!_animationsEnabled',
                        '[class.mat-mdc-dialog-container-with-actions]': '_actionSectionCount > 0',
                    }, template: "<div class=\"mat-mdc-dialog-inner-container mdc-dialog__container\">\n  <div class=\"mat-mdc-dialog-surface mdc-dialog__surface\">\n    <ng-template cdkPortalOutlet />\n  </div>\n</div>\n", styles: [".mat-mdc-dialog-container{width:100%;height:100%;display:block;box-sizing:border-box;max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit;outline:0}.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-max-width, 560px);min-width:var(--mat-dialog-container-min-width, 280px)}@media(max-width: 599px){.cdk-overlay-pane.mat-mdc-dialog-panel{max-width:var(--mat-dialog-container-small-max-width, calc(100vw - 32px))}}.mat-mdc-dialog-inner-container{display:flex;flex-direction:row;align-items:center;justify-content:space-around;box-sizing:border-box;height:100%;opacity:0;transition:opacity linear var(--mat-dialog-transition-duration, 0ms);max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit}.mdc-dialog--closing .mat-mdc-dialog-inner-container{transition:opacity 75ms linear;transform:none}.mdc-dialog--open .mat-mdc-dialog-inner-container{opacity:1}._mat-animation-noopable .mat-mdc-dialog-inner-container{transition:none}.mat-mdc-dialog-surface{display:flex;flex-direction:column;flex-grow:0;flex-shrink:0;box-sizing:border-box;width:100%;height:100%;position:relative;overflow-y:auto;outline:0;transform:scale(0.8);transition:transform var(--mat-dialog-transition-duration, 0ms) cubic-bezier(0, 0, 0.2, 1);max-height:inherit;min-height:inherit;min-width:inherit;max-width:inherit;box-shadow:var(--mat-dialog-container-elevation-shadow, none);border-radius:var(--mat-dialog-container-shape, var(--mat-sys-corner-extra-large, 4px));background-color:var(--mat-dialog-container-color, var(--mat-sys-surface, white))}[dir=rtl] .mat-mdc-dialog-surface{text-align:right}.mdc-dialog--open .mat-mdc-dialog-surface,.mdc-dialog--closing .mat-mdc-dialog-surface{transform:none}._mat-animation-noopable .mat-mdc-dialog-surface{transition:none}.mat-mdc-dialog-surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:2px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}.mat-mdc-dialog-title{display:block;position:relative;flex-shrink:0;box-sizing:border-box;margin:0 0 1px;padding:var(--mat-dialog-headline-padding, 6px 24px 13px)}.mat-mdc-dialog-title::before{display:inline-block;width:0;height:40px;content:\"\";vertical-align:0}[dir=rtl] .mat-mdc-dialog-title{text-align:right}.mat-mdc-dialog-container .mat-mdc-dialog-title{color:var(--mat-dialog-subhead-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));font-family:var(--mat-dialog-subhead-font, var(--mat-sys-headline-small-font, inherit));line-height:var(--mat-dialog-subhead-line-height, var(--mat-sys-headline-small-line-height, 1.5rem));font-size:var(--mat-dialog-subhead-size, var(--mat-sys-headline-small-size, 1rem));font-weight:var(--mat-dialog-subhead-weight, var(--mat-sys-headline-small-weight, 400));letter-spacing:var(--mat-dialog-subhead-tracking, var(--mat-sys-headline-small-tracking, 0.03125em))}.mat-mdc-dialog-content{display:block;flex-grow:1;box-sizing:border-box;margin:0;overflow:auto;max-height:65vh}.mat-mdc-dialog-content>:first-child{margin-top:0}.mat-mdc-dialog-content>:last-child{margin-bottom:0}.mat-mdc-dialog-container .mat-mdc-dialog-content{color:var(--mat-dialog-supporting-text-color, var(--mat-sys-on-surface-variant, rgba(0, 0, 0, 0.6)));font-family:var(--mat-dialog-supporting-text-font, var(--mat-sys-body-medium-font, inherit));line-height:var(--mat-dialog-supporting-text-line-height, var(--mat-sys-body-medium-line-height, 1.5rem));font-size:var(--mat-dialog-supporting-text-size, var(--mat-sys-body-medium-size, 1rem));font-weight:var(--mat-dialog-supporting-text-weight, var(--mat-sys-body-medium-weight, 400));letter-spacing:var(--mat-dialog-supporting-text-tracking, var(--mat-sys-body-medium-tracking, 0.03125em))}.mat-mdc-dialog-container .mat-mdc-dialog-content{padding:var(--mat-dialog-content-padding, 20px 24px)}.mat-mdc-dialog-container-with-actions .mat-mdc-dialog-content{padding:var(--mat-dialog-with-actions-content-padding, 20px 24px 0)}.mat-mdc-dialog-container .mat-mdc-dialog-title+.mat-mdc-dialog-content{padding-top:0}.mat-mdc-dialog-actions{display:flex;position:relative;flex-shrink:0;flex-wrap:wrap;align-items:center;box-sizing:border-box;min-height:52px;margin:0;border-top:1px solid rgba(0,0,0,0);padding:var(--mat-dialog-actions-padding, 16px 24px);justify-content:var(--mat-dialog-actions-alignment, flex-end)}@media(forced-colors: active){.mat-mdc-dialog-actions{border-top-color:CanvasText}}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-start,.mat-mdc-dialog-actions[align=start]{justify-content:start}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-center,.mat-mdc-dialog-actions[align=center]{justify-content:center}.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-end,.mat-mdc-dialog-actions[align=end]{justify-content:flex-end}.mat-mdc-dialog-actions .mat-button-base+.mat-button-base,.mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-mdc-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-mdc-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}.mat-mdc-dialog-component-host{display:contents}\n"] }]
        }] });
const TRANSITION_DURATION_PROPERTY = '--mat-dialog-transition-duration';
// TODO(mmalerba): Remove this function after animation durations are required
//  to be numbers.
/**
 * Converts a CSS time string to a number in ms. If the given time is already a
 * number, it is assumed to be in ms.
 */
function parseCssTime(time) {
    if (time == null) {
        return null;
    }
    if (typeof time === 'number') {
        return time;
    }
    if (time.endsWith('ms')) {
        return coerceNumberProperty(time.substring(0, time.length - 2));
    }
    if (time.endsWith('s')) {
        return coerceNumberProperty(time.substring(0, time.length - 1)) * 1000;
    }
    if (time === '0') {
        return 0;
    }
    return null; // anything else is invalid.
}

var MatDialogState;
(function (MatDialogState) {
    MatDialogState[MatDialogState["OPEN"] = 0] = "OPEN";
    MatDialogState[MatDialogState["CLOSING"] = 1] = "CLOSING";
    MatDialogState[MatDialogState["CLOSED"] = 2] = "CLOSED";
})(MatDialogState || (MatDialogState = {}));
/**
 * Reference to a dialog opened via the MatDialog service.
 */
class MatDialogRef {
    _ref;
    _config;
    _containerInstance;
    /** The instance of component opened into the dialog. */
    componentInstance;
    /**
     * `ComponentRef` of the component opened into the dialog. Will be
     * null when the dialog is opened using a `TemplateRef`.
     */
    componentRef;
    /** Whether the user is allowed to close the dialog. */
    disableClose;
    /** Unique ID for the dialog. */
    id;
    /** Subject for notifying the user that the dialog has finished opening. */
    _afterOpened = new Subject();
    /** Subject for notifying the user that the dialog has started closing. */
    _beforeClosed = new Subject();
    /** Result to be passed to afterClosed. */
    _result;
    /** Handle to the timeout that's running as a fallback in case the exit animation doesn't fire. */
    _closeFallbackTimeout;
    /** Current state of the dialog. */
    _state = MatDialogState.OPEN;
    // TODO(crisbeto): we shouldn't have to declare this property, because `DialogRef.close`
    // already has a second `options` parameter that we can use. The problem is that internal tests
    // have assertions like `expect(MatDialogRef.close).toHaveBeenCalledWith(foo)` which will break,
    // because it'll be called with two arguments by things like `MatDialogClose`.
    /** Interaction that caused the dialog to close. */
    _closeInteractionType;
    constructor(_ref, _config, _containerInstance) {
        this._ref = _ref;
        this._config = _config;
        this._containerInstance = _containerInstance;
        this.disableClose = _config.disableClose;
        this.id = _ref.id;
        // Used to target panels specifically tied to dialogs.
        _ref.addPanelClass('mat-mdc-dialog-panel');
        // Emit when opening animation completes
        _containerInstance._animationStateChanged
            .pipe(filter(event => event.state === 'opened'), take(1))
            .subscribe(() => {
            this._afterOpened.next();
            this._afterOpened.complete();
        });
        // Dispose overlay when closing animation is complete
        _containerInstance._animationStateChanged
            .pipe(filter(event => event.state === 'closed'), take(1))
            .subscribe(() => {
            clearTimeout(this._closeFallbackTimeout);
            this._finishDialogClose();
        });
        _ref.overlayRef.detachments().subscribe(() => {
            this._beforeClosed.next(this._result);
            this._beforeClosed.complete();
            this._finishDialogClose();
        });
        merge(this.backdropClick(), this.keydownEvents().pipe(filter(event => event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event)))).subscribe(event => {
            if (!this.disableClose) {
                event.preventDefault();
                _closeDialogVia(this, event.type === 'keydown' ? 'keyboard' : 'mouse');
            }
        });
    }
    /**
     * Close the dialog.
     * @param dialogResult Optional result to return to the dialog opener.
     */
    close(dialogResult) {
        const closePredicate = this._config.closePredicate;
        if (closePredicate && !closePredicate(dialogResult, this._config, this.componentInstance)) {
            return;
        }
        this._result = dialogResult;
        // Transition the backdrop in parallel to the dialog.
        this._containerInstance._animationStateChanged
            .pipe(filter(event => event.state === 'closing'), take(1))
            .subscribe(event => {
            this._beforeClosed.next(dialogResult);
            this._beforeClosed.complete();
            this._ref.overlayRef.detachBackdrop();
            // The logic that disposes of the overlay depends on the exit animation completing, however
            // it isn't guaranteed if the parent view is destroyed while it's running. Add a fallback
            // timeout which will clean everything up if the animation hasn't fired within the specified
            // amount of time plus 100ms. We don't need to run this outside the NgZone, because for the
            // vast majority of cases the timeout will have been cleared before it has the chance to fire.
            this._closeFallbackTimeout = setTimeout(() => this._finishDialogClose(), event.totalTime + 100);
        });
        this._state = MatDialogState.CLOSING;
        this._containerInstance._startExitAnimation();
    }
    /**
     * Gets an observable that is notified when the dialog is finished opening.
     */
    afterOpened() {
        return this._afterOpened;
    }
    /**
     * Gets an observable that is notified when the dialog is finished closing.
     */
    afterClosed() {
        return this._ref.closed;
    }
    /**
     * Gets an observable that is notified when the dialog has started closing.
     */
    beforeClosed() {
        return this._beforeClosed;
    }
    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     */
    backdropClick() {
        return this._ref.backdropClick;
    }
    /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     */
    keydownEvents() {
        return this._ref.keydownEvents;
    }
    /**
     * Updates the dialog's position.
     * @param position New dialog position.
     */
    updatePosition(position) {
        let strategy = this._ref.config.positionStrategy;
        if (position && (position.left || position.right)) {
            position.left ? strategy.left(position.left) : strategy.right(position.right);
        }
        else {
            strategy.centerHorizontally();
        }
        if (position && (position.top || position.bottom)) {
            position.top ? strategy.top(position.top) : strategy.bottom(position.bottom);
        }
        else {
            strategy.centerVertically();
        }
        this._ref.updatePosition();
        return this;
    }
    /**
     * Updates the dialog's width and height.
     * @param width New width of the dialog.
     * @param height New height of the dialog.
     */
    updateSize(width = '', height = '') {
        this._ref.updateSize(width, height);
        return this;
    }
    /** Add a CSS class or an array of classes to the overlay pane. */
    addPanelClass(classes) {
        this._ref.addPanelClass(classes);
        return this;
    }
    /** Remove a CSS class or an array of classes from the overlay pane. */
    removePanelClass(classes) {
        this._ref.removePanelClass(classes);
        return this;
    }
    /** Gets the current state of the dialog's lifecycle. */
    getState() {
        return this._state;
    }
    /**
     * Finishes the dialog close by updating the state of the dialog
     * and disposing the overlay.
     */
    _finishDialogClose() {
        this._state = MatDialogState.CLOSED;
        this._ref.close(this._result, { focusOrigin: this._closeInteractionType });
        this.componentInstance = null;
    }
}
/**
 * Closes the dialog with the specified interaction type. This is currently not part of
 * `MatDialogRef` as that would conflict with custom dialog ref mocks provided in tests.
 * More details. See: https://github.com/angular/components/pull/9257#issuecomment-651342226.
 */
// TODO: Move this back into `MatDialogRef` when we provide an official mock dialog ref.
function _closeDialogVia(ref, interactionType, result) {
    ref._closeInteractionType = interactionType;
    return ref.close(result);
}

/** Injection token that can be used to access the data that was passed in to a dialog. */
const MAT_DIALOG_DATA = new InjectionToken('MatMdcDialogData');
/** Injection token that can be used to specify default dialog options. */
const MAT_DIALOG_DEFAULT_OPTIONS = new InjectionToken('mat-mdc-dialog-default-options');
/** Injection token that determines the scroll handling while the dialog is open. */
const MAT_DIALOG_SCROLL_STRATEGY = new InjectionToken('mat-mdc-dialog-scroll-strategy', {
    providedIn: 'root',
    factory: () => {
        const injector = inject(Injector);
        return () => createBlockScrollStrategy(injector);
    },
});
/**
 * Service to open Material Design modal dialogs.
 */
class MatDialog {
    _defaultOptions = inject(MAT_DIALOG_DEFAULT_OPTIONS, { optional: true });
    _scrollStrategy = inject(MAT_DIALOG_SCROLL_STRATEGY);
    _parentDialog = inject(MatDialog, { optional: true, skipSelf: true });
    _idGenerator = inject(_IdGenerator);
    _injector = inject(Injector);
    _dialog = inject(Dialog);
    _animationsDisabled = _animationsDisabled();
    _openDialogsAtThisLevel = [];
    _afterAllClosedAtThisLevel = new Subject();
    _afterOpenedAtThisLevel = new Subject();
    dialogConfigClass = MatDialogConfig;
    _dialogRefConstructor;
    _dialogContainerType;
    _dialogDataToken;
    /** Keeps track of the currently-open dialogs. */
    get openDialogs() {
        return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
    }
    /** Stream that emits when a dialog has been opened. */
    get afterOpened() {
        return this._parentDialog ? this._parentDialog.afterOpened : this._afterOpenedAtThisLevel;
    }
    _getAfterAllClosed() {
        const parent = this._parentDialog;
        return parent ? parent._getAfterAllClosed() : this._afterAllClosedAtThisLevel;
    }
    /**
     * Stream that emits when all open dialog have finished closing.
     * Will emit on subscribe if there are no open dialogs to begin with.
     */
    afterAllClosed = defer(() => this.openDialogs.length
        ? this._getAfterAllClosed()
        : this._getAfterAllClosed().pipe(startWith(undefined)));
    constructor() {
        this._dialogRefConstructor = MatDialogRef;
        this._dialogContainerType = MatDialogContainer;
        this._dialogDataToken = MAT_DIALOG_DATA;
    }
    open(componentOrTemplateRef, config) {
        let dialogRef;
        config = { ...(this._defaultOptions || new MatDialogConfig()), ...config };
        config.id = config.id || this._idGenerator.getId('mat-mdc-dialog-');
        config.scrollStrategy = config.scrollStrategy || this._scrollStrategy();
        const cdkRef = this._dialog.open(componentOrTemplateRef, {
            ...config,
            positionStrategy: createGlobalPositionStrategy(this._injector)
                .centerHorizontally()
                .centerVertically(),
            // Disable closing since we need to sync it up to the animation ourselves.
            disableClose: true,
            // Closing is tied to our animation so the close predicate has to be implemented separately.
            closePredicate: undefined,
            // Disable closing on destroy, because this service cleans up its open dialogs as well.
            // We want to do the cleanup here, rather than the CDK service, because the CDK destroys
            // the dialogs immediately whereas we want it to wait for the animations to finish.
            closeOnDestroy: false,
            // Disable closing on detachments so that we can sync up the animation.
            // The Material dialog ref handles this manually.
            closeOnOverlayDetachments: false,
            disableAnimations: this._animationsDisabled ||
                config.enterAnimationDuration?.toLocaleString() === '0' ||
                config.exitAnimationDuration?.toString() === '0',
            container: {
                type: this._dialogContainerType,
                providers: () => [
                    // Provide our config as the CDK config as well since it has the same interface as the
                    // CDK one, but it contains the actual values passed in by the user for things like
                    // `disableClose` which we disable for the CDK dialog since we handle it ourselves.
                    { provide: this.dialogConfigClass, useValue: config },
                    { provide: DialogConfig, useValue: config },
                ],
            },
            templateContext: () => ({ dialogRef }),
            providers: (ref, cdkConfig, dialogContainer) => {
                dialogRef = new this._dialogRefConstructor(ref, config, dialogContainer);
                dialogRef.updatePosition(config?.position);
                return [
                    { provide: this._dialogContainerType, useValue: dialogContainer },
                    { provide: this._dialogDataToken, useValue: cdkConfig.data },
                    { provide: this._dialogRefConstructor, useValue: dialogRef },
                ];
            },
        });
        // This can't be assigned in the `providers` callback, because
        // the instance hasn't been assigned to the CDK ref yet.
        dialogRef.componentRef = cdkRef.componentRef;
        dialogRef.componentInstance = cdkRef.componentInstance;
        this.openDialogs.push(dialogRef);
        this.afterOpened.next(dialogRef);
        dialogRef.afterClosed().subscribe(() => {
            const index = this.openDialogs.indexOf(dialogRef);
            if (index > -1) {
                this.openDialogs.splice(index, 1);
                if (!this.openDialogs.length) {
                    this._getAfterAllClosed().next();
                }
            }
        });
        return dialogRef;
    }
    /**
     * Closes all of the currently-open dialogs.
     */
    closeAll() {
        this._closeDialogs(this.openDialogs);
    }
    /**
     * Finds an open dialog by its id.
     * @param id ID to use when looking up the dialog.
     */
    getDialogById(id) {
        return this.openDialogs.find(dialog => dialog.id === id);
    }
    ngOnDestroy() {
        // Only close the dialogs at this level on destroy
        // since the parent service may still be active.
        this._closeDialogs(this._openDialogsAtThisLevel);
        this._afterAllClosedAtThisLevel.complete();
        this._afterOpenedAtThisLevel.complete();
    }
    _closeDialogs(dialogs) {
        let i = dialogs.length;
        while (i--) {
            dialogs[i].close();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatDialog, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatDialog, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatDialog, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });

/**
 * Button that will close the current dialog.
 */
class MatDialogClose {
    dialogRef = inject(MatDialogRef, { optional: true });
    _elementRef = inject(ElementRef);
    _dialog = inject(MatDialog);
    /** Screen-reader label for the button. */
    ariaLabel;
    /** Default to "button" to prevents accidental form submits. */
    type = 'button';
    /** Dialog close input. */
    dialogResult;
    _matDialogClose;
    constructor() { }
    ngOnInit() {
        if (!this.dialogRef) {
            // When this directive is included in a dialog via TemplateRef (rather than being
            // in a Component), the DialogRef isn't available via injection because embedded
            // views cannot be given a custom injector. Instead, we look up the DialogRef by
            // ID. This must occur in `onInit`, as the ID binding for the dialog container won't
            // be resolved at constructor time.
            this.dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
        }
    }
    ngOnChanges(changes) {
        const proxiedChange = changes['_matDialogClose'] || changes['_matDialogCloseResult'];
        if (proxiedChange) {
            this.dialogResult = proxiedChange.currentValue;
        }
    }
    _onButtonClick(event) {
        // Determinate the focus origin using the click event, because using the FocusMonitor will
        // result in incorrect origins. Most of the time, close buttons will be auto focused in the
        // dialog, and therefore clicking the button won't result in a focus change. This means that
        // the FocusMonitor won't detect any origin change, and will always output `program`.
        _closeDialogVia(this.dialogRef, event.screenX === 0 && event.screenY === 0 ? 'keyboard' : 'mouse', this.dialogResult);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatDialogClose, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: MatDialogClose, isStandalone: true, selector: "[mat-dialog-close], [matDialogClose]", inputs: { ariaLabel: ["aria-label", "ariaLabel"], type: "type", dialogResult: ["mat-dialog-close", "dialogResult"], _matDialogClose: ["matDialogClose", "_matDialogClose"] }, host: { listeners: { "click": "_onButtonClick($event)" }, properties: { "attr.aria-label": "ariaLabel || null", "attr.type": "type" } }, exportAs: ["matDialogClose"], usesOnChanges: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatDialogClose, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-dialog-close], [matDialogClose]',
                    exportAs: 'matDialogClose',
                    host: {
                        '(click)': '_onButtonClick($event)',
                        '[attr.aria-label]': 'ariaLabel || null',
                        '[attr.type]': 'type',
                    },
                }]
        }], ctorParameters: () => [], propDecorators: { ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], type: [{
                type: Input
            }], dialogResult: [{
                type: Input,
                args: ['mat-dialog-close']
            }], _matDialogClose: [{
                type: Input,
                args: ['matDialogClose']
            }] } });
class MatDialogLayoutSection {
    _dialogRef = inject(MatDialogRef, { optional: true });
    _elementRef = inject(ElementRef);
    _dialog = inject(MatDialog);
    constructor() { }
    ngOnInit() {
        if (!this._dialogRef) {
            this._dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs);
        }
        if (this._dialogRef) {
            Promise.resolve().then(() => {
                this._onAdd();
            });
        }
    }
    ngOnDestroy() {
        // Note: we null check because there are some internal
        // tests that are mocking out `MatDialogRef` incorrectly.
        const instance = this._dialogRef?._containerInstance;
        if (instance) {
            Promise.resolve().then(() => {
                this._onRemove();
            });
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatDialogLayoutSection, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: MatDialogLayoutSection, isStandalone: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatDialogLayoutSection, decorators: [{
            type: Directive
        }], ctorParameters: () => [] });
/**
 * Title of a dialog element. Stays fixed to the top of the dialog when scrolling.
 */
class MatDialogTitle extends MatDialogLayoutSection {
    id = inject(_IdGenerator).getId('mat-mdc-dialog-title-');
    _onAdd() {
        // Note: we null check the queue, because there are some internal
        // tests that are mocking out `MatDialogRef` incorrectly.
        this._dialogRef._containerInstance?._addAriaLabelledBy?.(this.id);
    }
    _onRemove() {
        this._dialogRef?._containerInstance?._removeAriaLabelledBy?.(this.id);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatDialogTitle, deps: null, target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: MatDialogTitle, isStandalone: true, selector: "[mat-dialog-title], [matDialogTitle]", inputs: { id: "id" }, host: { properties: { "id": "id" }, classAttribute: "mat-mdc-dialog-title mdc-dialog__title" }, exportAs: ["matDialogTitle"], usesInheritance: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatDialogTitle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-dialog-title], [matDialogTitle]',
                    exportAs: 'matDialogTitle',
                    host: {
                        'class': 'mat-mdc-dialog-title mdc-dialog__title',
                        '[id]': 'id',
                    },
                }]
        }], propDecorators: { id: [{
                type: Input
            }] } });
/**
 * Scrollable content container of a dialog.
 */
class MatDialogContent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatDialogContent, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: MatDialogContent, isStandalone: true, selector: "[mat-dialog-content], mat-dialog-content, [matDialogContent]", host: { classAttribute: "mat-mdc-dialog-content mdc-dialog__content" }, hostDirectives: [{ directive: i1.CdkScrollable }], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatDialogContent, decorators: [{
            type: Directive,
            args: [{
                    selector: `[mat-dialog-content], mat-dialog-content, [matDialogContent]`,
                    host: { 'class': 'mat-mdc-dialog-content mdc-dialog__content' },
                    hostDirectives: [CdkScrollable],
                }]
        }] });
/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
class MatDialogActions extends MatDialogLayoutSection {
    /**
     * Horizontal alignment of action buttons.
     */
    align;
    _onAdd() {
        this._dialogRef._containerInstance?._updateActionSectionCount?.(1);
    }
    _onRemove() {
        this._dialogRef._containerInstance?._updateActionSectionCount?.(-1);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatDialogActions, deps: null, target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: MatDialogActions, isStandalone: true, selector: "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]", inputs: { align: "align" }, host: { properties: { "class.mat-mdc-dialog-actions-align-start": "align === \"start\"", "class.mat-mdc-dialog-actions-align-center": "align === \"center\"", "class.mat-mdc-dialog-actions-align-end": "align === \"end\"" }, classAttribute: "mat-mdc-dialog-actions mdc-dialog__actions" }, usesInheritance: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatDialogActions, decorators: [{
            type: Directive,
            args: [{
                    selector: `[mat-dialog-actions], mat-dialog-actions, [matDialogActions]`,
                    host: {
                        'class': 'mat-mdc-dialog-actions mdc-dialog__actions',
                        '[class.mat-mdc-dialog-actions-align-start]': 'align === "start"',
                        '[class.mat-mdc-dialog-actions-align-center]': 'align === "center"',
                        '[class.mat-mdc-dialog-actions-align-end]': 'align === "end"',
                    },
                }]
        }], propDecorators: { align: [{
                type: Input
            }] } });
/**
 * Finds the closest MatDialogRef to an element by looking at the DOM.
 * @param element Element relative to which to look for a dialog.
 * @param openDialogs References to the currently-open dialogs.
 */
function getClosestDialog(element, openDialogs) {
    let parent = element.nativeElement.parentElement;
    while (parent && !parent.classList.contains('mat-mdc-dialog-container')) {
        parent = parent.parentElement;
    }
    return parent ? openDialogs.find(dialog => dialog.id === parent.id) : null;
}

const DIRECTIVES = [
    MatDialogContainer,
    MatDialogClose,
    MatDialogTitle,
    MatDialogActions,
    MatDialogContent,
];
class MatDialogModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatDialogModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatDialogModule, imports: [DialogModule, OverlayModule, PortalModule, MatCommonModule, MatDialogContainer,
            MatDialogClose,
            MatDialogTitle,
            MatDialogActions,
            MatDialogContent], exports: [MatCommonModule, MatDialogContainer,
            MatDialogClose,
            MatDialogTitle,
            MatDialogActions,
            MatDialogContent] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatDialogModule, providers: [MatDialog], imports: [DialogModule, OverlayModule, PortalModule, MatCommonModule, MatCommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatDialogModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [DialogModule, OverlayModule, PortalModule, MatCommonModule, ...DIRECTIVES],
                    exports: [MatCommonModule, ...DIRECTIVES],
                    providers: [MatDialog],
                }]
        }] });

export { MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MatDialogActions, MatDialogClose, MatDialogConfig, MatDialogContainer, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogState, MatDialogTitle, _closeDialogVia };
//# sourceMappingURL=dialog-module.mjs.map
