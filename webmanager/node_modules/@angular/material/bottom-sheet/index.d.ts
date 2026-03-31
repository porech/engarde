import * as i0 from '@angular/core';
import { OnDestroy, EventEmitter, InjectionToken, ViewContainerRef, ComponentRef, TemplateRef } from '@angular/core';
import * as i1 from '@angular/cdk/dialog';
import { CdkDialogContainer, DialogRef } from '@angular/cdk/dialog';
import { MatCommonModule } from '../common-module.d.js';
import * as i3 from '@angular/cdk/portal';
import { ComponentType } from '@angular/cdk/portal';
import { Direction } from '@angular/cdk/bidi';
import { ScrollStrategy } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';

/**
 * Internal component that wraps user-provided bottom sheet content.
 * @docs-private
 */
declare class MatBottomSheetContainer extends CdkDialogContainer implements OnDestroy {
    private _breakpointSubscription;
    protected _animationsDisabled: boolean;
    /** The state of the bottom sheet animations. */
    _animationState: 'void' | 'visible' | 'hidden';
    /** Emits whenever the state of the animation changes. */
    _animationStateChanged: EventEmitter<{
        toState: "visible" | "hidden";
        phase: "start" | "done";
    }>;
    /** Whether the component has been destroyed. */
    private _destroyed;
    constructor(...args: unknown[]);
    /** Begin animation of bottom sheet entrance into view. */
    enter(): void;
    /** Begin animation of the bottom sheet exiting from view. */
    exit(): void;
    ngOnDestroy(): void;
    private _simulateAnimation;
    protected _trapFocus(): void;
    protected _handleAnimationEvent(isStart: boolean, animationName: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatBottomSheetContainer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatBottomSheetContainer, "mat-bottom-sheet-container", never, {}, {}, never, never, true, never>;
}

declare class MatBottomSheetModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatBottomSheetModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatBottomSheetModule, never, [typeof i1.DialogModule, typeof MatCommonModule, typeof i3.PortalModule, typeof MatBottomSheetContainer], [typeof MatBottomSheetContainer, typeof MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatBottomSheetModule>;
}

/** Options for where to set focus to automatically on dialog open */
type AutoFocusTarget = 'dialog' | 'first-tabbable' | 'first-heading';
/** Injection token that can be used to access the data that was passed in to a bottom sheet. */
declare const MAT_BOTTOM_SHEET_DATA: InjectionToken<any>;
/**
 * Configuration used when opening a bottom sheet.
 */
declare class MatBottomSheetConfig<D = any> {
    /** The view container to place the overlay for the bottom sheet into. */
    viewContainerRef?: ViewContainerRef;
    /** Extra CSS classes to be added to the bottom sheet container. */
    panelClass?: string | string[];
    /** Text layout direction for the bottom sheet. */
    direction?: Direction;
    /** Data being injected into the child component. */
    data?: D | null;
    /** Whether the bottom sheet has a backdrop. */
    hasBackdrop?: boolean;
    /** Custom class for the backdrop. */
    backdropClass?: string;
    /** Whether the user can use escape or clicking outside to close the bottom sheet. */
    disableClose?: boolean;
    /** Aria label to assign to the bottom sheet element. */
    ariaLabel?: string | null;
    /**
     * Whether this is a modal dialog. Used to set the `aria-modal` attribute. Off by default,
     * because it can interfere with other overlay-based components (e.g. `mat-select`) and because
     * it is redundant since the dialog marks all outside content as `aria-hidden` anyway.
     */
    ariaModal?: boolean;
    /**
     * Whether the bottom sheet should close when the user goes backwards/forwards in history.
     * Note that this usually doesn't include clicking on links (unless the user is using
     * the `HashLocationStrategy`).
     */
    closeOnNavigation?: boolean;
    /**
     * Where the bottom sheet should focus on open.
     * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or
     * AutoFocusTarget instead.
     */
    autoFocus?: AutoFocusTarget | string | boolean;
    /**
     * Whether the bottom sheet should restore focus to the
     * previously-focused element, after it's closed.
     */
    restoreFocus?: boolean;
    /** Scroll strategy to be used for the bottom sheet. */
    scrollStrategy?: ScrollStrategy;
    /** Height for the bottom sheet. */
    height?: string;
    /** Minimum height for the bottom sheet. If a number is provided, assumes pixel units. */
    minHeight?: number | string;
    /** Maximum height for the bottom sheet. If a number is provided, assumes pixel units. */
    maxHeight?: number | string;
}

/**
 * Reference to a bottom sheet dispatched from the bottom sheet service.
 */
declare class MatBottomSheetRef<T = any, R = any> {
    private _ref;
    /** Instance of the component making up the content of the bottom sheet. */
    get instance(): T;
    /**
     * `ComponentRef` of the component opened into the bottom sheet. Will be
     * null when the bottom sheet is opened using a `TemplateRef`.
     */
    get componentRef(): ComponentRef<T> | null;
    /**
     * Instance of the component into which the bottom sheet content is projected.
     * @docs-private
     */
    containerInstance: MatBottomSheetContainer;
    /** Whether the user is allowed to close the bottom sheet. */
    disableClose: boolean | undefined;
    /** Subject for notifying the user that the bottom sheet has opened and appeared. */
    private readonly _afterOpened;
    /** Result to be passed down to the `afterDismissed` stream. */
    private _result;
    /** Handle to the timeout that's running as a fallback in case the exit animation doesn't fire. */
    private _closeFallbackTimeout;
    constructor(_ref: DialogRef<R, T>, config: MatBottomSheetConfig, containerInstance: MatBottomSheetContainer);
    /**
     * Dismisses the bottom sheet.
     * @param result Data to be passed back to the bottom sheet opener.
     */
    dismiss(result?: R): void;
    /** Gets an observable that is notified when the bottom sheet is finished closing. */
    afterDismissed(): Observable<R | undefined>;
    /** Gets an observable that is notified when the bottom sheet has opened and appeared. */
    afterOpened(): Observable<void>;
    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     */
    backdropClick(): Observable<MouseEvent>;
    /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     */
    keydownEvents(): Observable<KeyboardEvent>;
}

/** Injection token that can be used to specify default bottom sheet options. */
declare const MAT_BOTTOM_SHEET_DEFAULT_OPTIONS: InjectionToken<MatBottomSheetConfig<any>>;
/**
 * Service to trigger Material Design bottom sheets.
 */
declare class MatBottomSheet implements OnDestroy {
    private _injector;
    private _parentBottomSheet;
    private _animationsDisabled;
    private _defaultOptions;
    private _bottomSheetRefAtThisLevel;
    private _dialog;
    /** Reference to the currently opened bottom sheet. */
    get _openedBottomSheetRef(): MatBottomSheetRef<any> | null;
    set _openedBottomSheetRef(value: MatBottomSheetRef<any> | null);
    constructor(...args: unknown[]);
    /**
     * Opens a bottom sheet containing the given component.
     * @param component Type of the component to load into the bottom sheet.
     * @param config Extra configuration options.
     * @returns Reference to the newly-opened bottom sheet.
     */
    open<T, D = any, R = any>(component: ComponentType<T>, config?: MatBottomSheetConfig<D>): MatBottomSheetRef<T, R>;
    /**
     * Opens a bottom sheet containing the given template.
     * @param template TemplateRef to instantiate as the bottom sheet content.
     * @param config Extra configuration options.
     * @returns Reference to the newly-opened bottom sheet.
     */
    open<T, D = any, R = any>(template: TemplateRef<T>, config?: MatBottomSheetConfig<D>): MatBottomSheetRef<T, R>;
    /**
     * Dismisses the currently-visible bottom sheet.
     * @param result Data to pass to the bottom sheet instance.
     */
    dismiss<R = any>(result?: R): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatBottomSheet, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MatBottomSheet>;
}

/**
 * Animations used by the Material bottom sheet.
 * @deprecated No longer used. Will be removed.
 * @breaking-change 21.0.0
 */
declare const matBottomSheetAnimations: {
    readonly bottomSheetState: any;
};

export { MAT_BOTTOM_SHEET_DATA, MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatBottomSheet, MatBottomSheetConfig, MatBottomSheetContainer, MatBottomSheetModule, MatBottomSheetRef, matBottomSheetAnimations };
export type { AutoFocusTarget };
