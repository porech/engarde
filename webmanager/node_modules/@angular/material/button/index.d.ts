import { FocusOrigin } from '@angular/cdk/a11y';
import * as i0 from '@angular/core';
import { InjectionToken, AfterViewInit, OnDestroy, ElementRef, NgZone } from '@angular/core';
import { ThemePalette } from '../palette.d.js';
import { MatRippleLoader } from '../ripple-loader.d.js';
import { MatCommonModule } from '../common-module.d.js';
import { MatRippleModule } from '../ripple-module.d.js';
import '@angular/cdk/bidi';
import '../ripple.d.js';
import '@angular/cdk/platform';

/**
 * Possible appearances for a `MatButton`.
 * See https://m3.material.io/components/buttons/overview
 */
type MatButtonAppearance = 'text' | 'filled' | 'elevated' | 'outlined' | 'tonal';
/** Object that can be used to configure the default options for the button component. */
interface MatButtonConfig {
    /** Whether disabled buttons should be interactive. */
    disabledInteractive?: boolean;
    /** Default palette color to apply to buttons. */
    color?: ThemePalette;
    /** Default appearance for plain buttons (not icon buttons or FABs). */
    defaultAppearance?: MatButtonAppearance;
}
/** Injection token that can be used to provide the default options the button component. */
declare const MAT_BUTTON_CONFIG: InjectionToken<MatButtonConfig>;
/** Base class for all buttons. */
declare class MatButtonBase implements AfterViewInit, OnDestroy {
    _elementRef: ElementRef<HTMLElement>;
    protected _ngZone: NgZone;
    protected _animationsDisabled: boolean;
    protected readonly _config: MatButtonConfig | null;
    private readonly _focusMonitor;
    private _cleanupClick;
    private _renderer;
    /**
     * Handles the lazy creation of the MatButton ripple.
     * Used to improve initial load time of large applications.
     */
    protected _rippleLoader: MatRippleLoader;
    /** Whether the button is set on an anchor node. */
    protected _isAnchor: boolean;
    /** Whether this button is a FAB. Used to apply the correct class on the ripple. */
    protected _isFab: boolean;
    /**
     * Theme color of the button. This API is supported in M2 themes only, it has
     * no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/button/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color?: string | null;
    /** Whether the ripple effect is disabled or not. */
    get disableRipple(): boolean;
    set disableRipple(value: any);
    private _disableRipple;
    /** Whether the button is disabled. */
    get disabled(): boolean;
    set disabled(value: any);
    private _disabled;
    /** `aria-disabled` value of the button. */
    ariaDisabled: boolean | undefined;
    /**
     * Natively disabled buttons prevent focus and any pointer events from reaching the button.
     * In some scenarios this might not be desirable, because it can prevent users from finding out
     * why the button is disabled (e.g. via tooltip). This is also useful for buttons that may
     * become disabled when activated, which would cause focus to be transferred to the document
     * body instead of remaining on the button.
     *
     * Enabling this input will change the button so that it is styled to be disabled and will be
     * marked as `aria-disabled`, but it will allow the button to receive events and focus.
     *
     * Note that by enabling this, you need to set the `tabindex` yourself if the button isn't
     * meant to be tabbable and you have to prevent the button action (e.g. form submissions).
     */
    disabledInteractive: boolean;
    /** Tab index for the button. */
    tabIndex: number;
    /**
     * Backwards-compatibility input that handles pre-existing `[tabindex]` bindings.
     * @docs-private
     */
    set _tabindex(value: number);
    constructor(...args: unknown[]);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /** Focuses the button. */
    focus(origin?: FocusOrigin, options?: FocusOptions): void;
    protected _getAriaDisabled(): boolean | null;
    protected _getDisabledAttribute(): true | null;
    private _updateRippleDisabled;
    protected _getTabIndex(): number;
    private _setupAsAnchor;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatButtonBase, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatButtonBase, never, never, { "color": { "alias": "color"; "required": false; }; "disableRipple": { "alias": "disableRipple"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "ariaDisabled": { "alias": "aria-disabled"; "required": false; }; "disabledInteractive": { "alias": "disabledInteractive"; "required": false; }; "tabIndex": { "alias": "tabIndex"; "required": false; }; "_tabindex": { "alias": "tabindex"; "required": false; }; }, {}, never, never, true, never>;
    static ngAcceptInputType_disableRipple: unknown;
    static ngAcceptInputType_disabled: unknown;
    static ngAcceptInputType_ariaDisabled: unknown;
    static ngAcceptInputType_disabledInteractive: unknown;
    static ngAcceptInputType_tabIndex: unknown;
    static ngAcceptInputType__tabindex: unknown;
}

/**
 * Material Design button component. Users interact with a button to perform an action.
 * See https://m3.material.io/components/buttons/overview
 */
declare class MatButton extends MatButtonBase {
    /** Appearance of the button. */
    get appearance(): MatButtonAppearance | null;
    set appearance(value: MatButtonAppearance | '');
    private _appearance;
    constructor(...args: unknown[]);
    /** Programmatically sets the appearance of the button. */
    setAppearance(appearance: MatButtonAppearance): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatButton, "    button[matButton], a[matButton], button[mat-button], button[mat-raised-button],    button[mat-flat-button], button[mat-stroked-button], a[mat-button], a[mat-raised-button],    a[mat-flat-button], a[mat-stroked-button]  ", ["matButton", "matAnchor"], { "appearance": { "alias": "matButton"; "required": false; }; }, {}, never, [".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])", "*", ".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]"], true, never>;
}
/**
 * Material Design button component for anchor elements. Anchor elements are used to provide
 * links for the user to navigate across different routes or pages.
 * See https://m3.material.io/components/buttons/overview
 */
declare const MatAnchor: typeof MatButton;
type MatAnchor = MatButton;

/** Default FAB options that can be overridden. */
interface MatFabDefaultOptions {
    /**
     * Default theme color of the button. This API is supported in M2 themes
     * only, it has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/button/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants.
     */
    color?: ThemePalette;
}
/** Injection token to be used to override the default options for FAB. */
declare const MAT_FAB_DEFAULT_OPTIONS: InjectionToken<MatFabDefaultOptions>;
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
declare function MAT_FAB_DEFAULT_OPTIONS_FACTORY(): MatFabDefaultOptions;
/**
 * Material Design floating action button (FAB) component. These buttons represent the primary
 * or most common action for users to interact with.
 * See https://m3.material.io/components/floating-action-button/overview
 *
 * The `MatFabButton` class has two appearances: normal and extended.
 */
declare class MatFabButton extends MatButtonBase {
    private _options;
    _isFab: boolean;
    extended: boolean;
    constructor(...args: unknown[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFabButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatFabButton, "button[mat-fab], a[mat-fab], button[matFab], a[matFab]", ["matButton", "matAnchor"], { "extended": { "alias": "extended"; "required": false; }; }, {}, never, [".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])", "*", ".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]"], true, never>;
    static ngAcceptInputType_extended: unknown;
}
/**
 * Material Design mini floating action button (FAB) component. These buttons represent the primary
 * or most common action for users to interact with.
 * See https://m3.material.io/components/floating-action-button/overview
 */
declare class MatMiniFabButton extends MatButtonBase {
    private _options;
    _isFab: boolean;
    constructor(...args: unknown[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatMiniFabButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatMiniFabButton, "button[mat-mini-fab], a[mat-mini-fab], button[matMiniFab], a[matMiniFab]", ["matButton", "matAnchor"], {}, {}, never, [".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])", "*", ".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]"], true, never>;
}
/**
 * Material Design floating action button (FAB) component for anchor elements. Anchor elements
 * are used to provide links for the user to navigate across different routes or pages.
 * See https://m3.material.io/components/floating-action-button/overview
 *
 * The `MatFabAnchor` class has two appearances: normal and extended.
 */
declare const MatFabAnchor: typeof MatFabButton;
type MatFabAnchor = MatFabButton;
/**
 * Material Design mini floating action button (FAB) component for anchor elements. Anchor elements
 * are used to provide links for the user to navigate across different routes or pages.
 * See https://m3.material.io/components/floating-action-button/overview
 */
declare const MatMiniFabAnchor: typeof MatMiniFabButton;
type MatMiniFabAnchor = MatMiniFabButton;

/**
 * Material Design icon button component. This type of button displays a single interactive icon for
 * users to perform an action.
 * See https://material.io/develop/web/components/buttons/icon-buttons/
 */
declare class MatIconButton extends MatButtonBase {
    constructor(...args: unknown[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatIconButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatIconButton, "button[mat-icon-button], a[mat-icon-button], button[matIconButton], a[matIconButton]", ["matButton", "matAnchor"], {}, {}, never, ["*"], true, never>;
}
/**
 * Material Design icon button component for anchor elements. This button displays a single
 * interaction icon that allows users to navigate across different routes or pages.
 * See https://material.io/develop/web/components/buttons/icon-buttons/
 */
declare const MatIconAnchor: typeof MatIconButton;
type MatIconAnchor = MatIconButton;

declare class MatButtonModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatButtonModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatButtonModule, never, [typeof MatCommonModule, typeof MatRippleModule, typeof MatButton, typeof MatMiniFabButton, typeof MatIconButton, typeof MatFabButton], [typeof MatCommonModule, typeof MatButton, typeof MatMiniFabButton, typeof MatIconButton, typeof MatFabButton]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatButtonModule>;
}

export { MAT_BUTTON_CONFIG, MAT_FAB_DEFAULT_OPTIONS, MAT_FAB_DEFAULT_OPTIONS_FACTORY, MatAnchor, MatButton, MatButtonModule, MatFabAnchor, MatFabButton, MatIconAnchor, MatIconButton, MatMiniFabAnchor, MatMiniFabButton };
export type { MatButtonAppearance, MatButtonConfig, MatFabDefaultOptions };
