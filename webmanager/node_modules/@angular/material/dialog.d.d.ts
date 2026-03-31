import { ScrollStrategy, ComponentType } from '@angular/cdk/overlay';
import * as i0 from '@angular/core';
import { ViewContainerRef, Injector, OnDestroy, EventEmitter, ComponentRef, InjectionToken, TemplateRef } from '@angular/core';
import { Direction } from '@angular/cdk/bidi';
import { DialogConfig, CdkDialogContainer, DialogRef, Dialog } from '@angular/cdk/dialog';
import { FocusOrigin } from '@angular/cdk/a11y';
import { Observable, Subject } from 'rxjs';
import { ComponentPortal } from '@angular/cdk/portal';

/** Options for where to set focus to automatically on dialog open */
type AutoFocusTarget = 'dialog' | 'first-tabbable' | 'first-heading';
/** Valid ARIA roles for a dialog element. */
type DialogRole = 'dialog' | 'alertdialog';
/** Possible overrides for a dialog's position. */
interface DialogPosition {
    /** Override for the dialog's top position. */
    top?: string;
    /** Override for the dialog's bottom position. */
    bottom?: string;
    /** Override for the dialog's left position. */
    left?: string;
    /** Override for the dialog's right position. */
    right?: string;
}
/**
 * Configuration for opening a modal dialog with the MatDialog service.
 */
declare class MatDialogConfig<D = any> {
    /**
     * Where the attached component should live in Angular's *logical* component tree.
     * This affects what is available for injection and the change detection order for the
     * component instantiated inside of the dialog. This does not affect where the dialog
     * content will be rendered.
     */
    viewContainerRef?: ViewContainerRef;
    /**
     * Injector used for the instantiation of the component to be attached. If provided,
     * takes precedence over the injector indirectly provided by `ViewContainerRef`.
     */
    injector?: Injector;
    /** ID for the dialog. If omitted, a unique one will be generated. */
    id?: string;
    /** The ARIA role of the dialog element. */
    role?: DialogRole;
    /** Custom class for the overlay pane. */
    panelClass?: string | string[];
    /** Whether the dialog has a backdrop. */
    hasBackdrop?: boolean;
    /** Custom class for the backdrop. */
    backdropClass?: string | string[];
    /** Whether the user can use escape or clicking on the backdrop to close the modal. */
    disableClose?: boolean;
    /** Function used to determine whether the dialog is allowed to close. */
    closePredicate?: <Result = unknown, Component = unknown, Config extends DialogConfig = MatDialogConfig>(result: Result | undefined, config: Config, componentInstance: Component | null) => boolean;
    /** Width of the dialog. */
    width?: string;
    /** Height of the dialog. */
    height?: string;
    /** Min-width of the dialog. If a number is provided, assumes pixel units. */
    minWidth?: number | string;
    /** Min-height of the dialog. If a number is provided, assumes pixel units. */
    minHeight?: number | string;
    /** Max-width of the dialog. If a number is provided, assumes pixel units. */
    maxWidth?: number | string;
    /** Max-height of the dialog. If a number is provided, assumes pixel units. */
    maxHeight?: number | string;
    /** Position overrides. */
    position?: DialogPosition;
    /** Data being injected into the child component. */
    data?: D | null;
    /** Layout direction for the dialog's content. */
    direction?: Direction;
    /** ID of the element that describes the dialog. */
    ariaDescribedBy?: string | null;
    /** ID of the element that labels the dialog. */
    ariaLabelledBy?: string | null;
    /** Aria label to assign to the dialog element. */
    ariaLabel?: string | null;
    /**
     * Whether this is a modal dialog. Used to set the `aria-modal` attribute. Off by default,
     * because it can interfere with other overlay-based components (e.g. `mat-select`) and because
     * it is redundant since the dialog marks all outside content as `aria-hidden` anyway.
     */
    ariaModal?: boolean;
    /**
     * Where the dialog should focus on open.
     * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or
     * AutoFocusTarget instead.
     */
    autoFocus?: AutoFocusTarget | string | boolean;
    /**
     * Whether the dialog should restore focus to the
     * previously-focused element, after it's closed.
     */
    restoreFocus?: boolean;
    /** Whether to wait for the opening animation to finish before trapping focus. */
    delayFocusTrap?: boolean;
    /** Scroll strategy to be used for the dialog. */
    scrollStrategy?: ScrollStrategy;
    /**
     * Whether the dialog should close when the user goes backwards/forwards in history.
     * Note that this usually doesn't include clicking on links (unless the user is using
     * the `HashLocationStrategy`).
     */
    closeOnNavigation?: boolean;
    /**
     * Duration of the enter animation in ms.
     * Should be a number, string type is deprecated.
     * @breaking-change 17.0.0 Remove string signature.
     */
    enterAnimationDuration?: string | number;
    /**
     * Duration of the exit animation in ms.
     * Should be a number, string type is deprecated.
     * @breaking-change 17.0.0 Remove string signature.
     */
    exitAnimationDuration?: string | number;
}

/** Event that captures the state of dialog container animations. */
interface LegacyDialogAnimationEvent {
    state: 'opened' | 'opening' | 'closing' | 'closed';
    totalTime: number;
}
declare class MatDialogContainer extends CdkDialogContainer<MatDialogConfig> implements OnDestroy {
    /** Emits when an animation state changes. */
    _animationStateChanged: EventEmitter<LegacyDialogAnimationEvent>;
    /** Whether animations are enabled. */
    _animationsEnabled: boolean;
    /** Number of actions projected in the dialog. */
    protected _actionSectionCount: number;
    /** Host element of the dialog container component. */
    private _hostElement;
    /** Duration of the dialog open animation. */
    private _enterAnimationDuration;
    /** Duration of the dialog close animation. */
    private _exitAnimationDuration;
    /** Current timer for dialog animations. */
    private _animationTimer;
    protected _contentAttached(): void;
    /** Starts the dialog open animation if enabled. */
    private _startOpenAnimation;
    /**
     * Starts the exit animation of the dialog if enabled. This method is
     * called by the dialog ref.
     */
    _startExitAnimation(): void;
    /**
     * Updates the number action sections.
     * @param delta Increase/decrease in the number of sections.
     */
    _updateActionSectionCount(delta: number): void;
    /**
     * Completes the dialog open by clearing potential animation classes, trapping
     * focus and emitting an opened event.
     */
    private _finishDialogOpen;
    /**
     * Completes the dialog close by clearing potential animation classes, restoring
     * focus and emitting a closed event.
     */
    private _finishDialogClose;
    /** Clears all dialog animation classes. */
    private _clearAnimationClasses;
    private _waitForAnimationToComplete;
    /** Runs a callback in `requestAnimationFrame`, if available. */
    private _requestAnimationFrame;
    protected _captureInitialFocus(): void;
    /**
     * Callback for when the open dialog animation has finished. Intended to
     * be called by sub-classes that use different animation implementations.
     */
    protected _openAnimationDone(totalTime: number): void;
    ngOnDestroy(): void;
    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDialogContainer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatDialogContainer, "mat-dialog-container", never, {}, {}, never, never, true, never>;
}

/** Possible states of the lifecycle of a dialog. */

declare enum MatDialogState {
    OPEN = 0,
    CLOSING = 1,
    CLOSED = 2
}
/**
 * Reference to a dialog opened via the MatDialog service.
 */
declare class MatDialogRef<T, R = any> {
    private _ref;
    private _config;
    _containerInstance: MatDialogContainer;
    /** The instance of component opened into the dialog. */
    componentInstance: T;
    /**
     * `ComponentRef` of the component opened into the dialog. Will be
     * null when the dialog is opened using a `TemplateRef`.
     */
    readonly componentRef: ComponentRef<T> | null;
    /** Whether the user is allowed to close the dialog. */
    disableClose: boolean | undefined;
    /** Unique ID for the dialog. */
    id: string;
    /** Subject for notifying the user that the dialog has finished opening. */
    private readonly _afterOpened;
    /** Subject for notifying the user that the dialog has started closing. */
    private readonly _beforeClosed;
    /** Result to be passed to afterClosed. */
    private _result;
    /** Handle to the timeout that's running as a fallback in case the exit animation doesn't fire. */
    private _closeFallbackTimeout;
    /** Current state of the dialog. */
    private _state;
    /** Interaction that caused the dialog to close. */
    private _closeInteractionType;
    constructor(_ref: DialogRef<R, T>, _config: MatDialogConfig, _containerInstance: MatDialogContainer);
    /**
     * Close the dialog.
     * @param dialogResult Optional result to return to the dialog opener.
     */
    close(dialogResult?: R): void;
    /**
     * Gets an observable that is notified when the dialog is finished opening.
     */
    afterOpened(): Observable<void>;
    /**
     * Gets an observable that is notified when the dialog is finished closing.
     */
    afterClosed(): Observable<R | undefined>;
    /**
     * Gets an observable that is notified when the dialog has started closing.
     */
    beforeClosed(): Observable<R | undefined>;
    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     */
    backdropClick(): Observable<MouseEvent>;
    /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     */
    keydownEvents(): Observable<KeyboardEvent>;
    /**
     * Updates the dialog's position.
     * @param position New dialog position.
     */
    updatePosition(position?: DialogPosition): this;
    /**
     * Updates the dialog's width and height.
     * @param width New width of the dialog.
     * @param height New height of the dialog.
     */
    updateSize(width?: string, height?: string): this;
    /** Add a CSS class or an array of classes to the overlay pane. */
    addPanelClass(classes: string | string[]): this;
    /** Remove a CSS class or an array of classes from the overlay pane. */
    removePanelClass(classes: string | string[]): this;
    /** Gets the current state of the dialog's lifecycle. */
    getState(): MatDialogState;
    /**
     * Finishes the dialog close by updating the state of the dialog
     * and disposing the overlay.
     */
    private _finishDialogClose;
}
/**
 * Closes the dialog with the specified interaction type. This is currently not part of
 * `MatDialogRef` as that would conflict with custom dialog ref mocks provided in tests.
 * More details. See: https://github.com/angular/components/pull/9257#issuecomment-651342226.
 */
declare function _closeDialogVia<R>(ref: MatDialogRef<R>, interactionType: FocusOrigin, result?: R): void;

/** Injection token that can be used to access the data that was passed in to a dialog. */
declare const MAT_DIALOG_DATA: InjectionToken<any>;
/** Injection token that can be used to specify default dialog options. */
declare const MAT_DIALOG_DEFAULT_OPTIONS: InjectionToken<MatDialogConfig<any>>;
/** Injection token that determines the scroll handling while the dialog is open. */
declare const MAT_DIALOG_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
/**
 * Service to open Material Design modal dialogs.
 */
declare class MatDialog implements OnDestroy {
    private _defaultOptions;
    private _scrollStrategy;
    private _parentDialog;
    private _idGenerator;
    private _injector;
    protected _dialog: Dialog;
    private _animationsDisabled;
    private readonly _openDialogsAtThisLevel;
    private readonly _afterAllClosedAtThisLevel;
    private readonly _afterOpenedAtThisLevel;
    protected dialogConfigClass: typeof MatDialogConfig;
    private readonly _dialogRefConstructor;
    private readonly _dialogContainerType;
    private readonly _dialogDataToken;
    /** Keeps track of the currently-open dialogs. */
    get openDialogs(): MatDialogRef<any>[];
    /** Stream that emits when a dialog has been opened. */
    get afterOpened(): Subject<MatDialogRef<any>>;
    private _getAfterAllClosed;
    /**
     * Stream that emits when all open dialog have finished closing.
     * Will emit on subscribe if there are no open dialogs to begin with.
     */
    readonly afterAllClosed: Observable<void>;
    constructor(...args: unknown[]);
    /**
     * Opens a modal dialog containing the given component.
     * @param component Type of the component to load into the dialog.
     * @param config Extra configuration options.
     * @returns Reference to the newly-opened dialog.
     */
    open<T, D = any, R = any>(component: ComponentType<T>, config?: MatDialogConfig<D>): MatDialogRef<T, R>;
    /**
     * Opens a modal dialog containing the given template.
     * @param template TemplateRef to instantiate as the dialog content.
     * @param config Extra configuration options.
     * @returns Reference to the newly-opened dialog.
     */
    open<T, D = any, R = any>(template: TemplateRef<T>, config?: MatDialogConfig<D>): MatDialogRef<T, R>;
    open<T, D = any, R = any>(template: ComponentType<T> | TemplateRef<T>, config?: MatDialogConfig<D>): MatDialogRef<T, R>;
    /**
     * Closes all of the currently-open dialogs.
     */
    closeAll(): void;
    /**
     * Finds an open dialog by its id.
     * @param id ID to use when looking up the dialog.
     */
    getDialogById(id: string): MatDialogRef<any> | undefined;
    ngOnDestroy(): void;
    private _closeDialogs;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDialog, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MatDialog>;
}

export { MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MatDialogConfig, MatDialogContainer, MatDialogRef, MatDialogState, _closeDialogVia };
export type { AutoFocusTarget, DialogPosition, DialogRole };
