import * as i0 from '@angular/core';
import { InjectionToken, TemplateRef, AfterContentInit, OnChanges, OnDestroy, EventEmitter, SimpleChanges, ElementRef, AfterViewInit, QueryList } from '@angular/core';
import { MatCommonModule } from '../common-module.d.js';
import * as i2 from '@angular/cdk/accordion';
import { CdkAccordion, CdkAccordionItem } from '@angular/cdk/accordion';
import * as i3 from '@angular/cdk/portal';
import { TemplatePortal } from '@angular/cdk/portal';
import { FocusableOption, FocusOrigin } from '@angular/cdk/a11y';
import { Subject } from 'rxjs';
import '@angular/cdk/bidi';

/** MatAccordion's display modes. */
type MatAccordionDisplayMode = 'default' | 'flat';
/** MatAccordion's toggle positions. */
type MatAccordionTogglePosition = 'before' | 'after';
/**
 * Base interface for a `MatAccordion`.
 * @docs-private
 */
interface MatAccordionBase extends CdkAccordion {
    /** Whether the expansion indicator should be hidden. */
    hideToggle: boolean;
    /** Display mode used for all expansion panels in the accordion. */
    displayMode: MatAccordionDisplayMode;
    /** The position of the expansion indicator. */
    togglePosition: MatAccordionTogglePosition;
    /** Handles keyboard events coming in from the panel headers. */
    _handleHeaderKeydown: (event: KeyboardEvent) => void;
    /** Handles focus events on the panel headers. */
    _handleHeaderFocus: (header: any) => void;
}
/**
 * Token used to provide a `MatAccordion` to `MatExpansionPanel`.
 * Used primarily to avoid circular imports between `MatAccordion` and `MatExpansionPanel`.
 */
declare const MAT_ACCORDION: InjectionToken<MatAccordionBase>;

/**
 * Base interface for a `MatExpansionPanel`.
 * @docs-private
 */
interface MatExpansionPanelBase extends CdkAccordionItem {
    /** Whether the toggle indicator should be hidden. */
    hideToggle: boolean;
}
/**
 * Token used to provide a `MatExpansionPanel` to `MatExpansionPanelContent`.
 * Used to avoid circular imports between `MatExpansionPanel` and `MatExpansionPanelContent`.
 */
declare const MAT_EXPANSION_PANEL: InjectionToken<MatExpansionPanelBase>;

/**
 * Expansion panel content that will be rendered lazily
 * after the panel is opened for the first time.
 */
declare class MatExpansionPanelContent {
    _template: TemplateRef<any>;
    _expansionPanel: MatExpansionPanelBase | null;
    constructor(...args: unknown[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatExpansionPanelContent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatExpansionPanelContent, "ng-template[matExpansionPanelContent]", never, {}, {}, never, never, true, never>;
}

/** MatExpansionPanel's states. */
type MatExpansionPanelState = 'expanded' | 'collapsed';
/**
 * Object that can be used to override the default options
 * for all of the expansion panels in a module.
 */
interface MatExpansionPanelDefaultOptions {
    /** Height of the header while the panel is expanded. */
    expandedHeight: string;
    /** Height of the header while the panel is collapsed. */
    collapsedHeight: string;
    /** Whether the toggle indicator should be hidden. */
    hideToggle: boolean;
}
/**
 * Injection token that can be used to configure the default
 * options for the expansion panel component.
 */
declare const MAT_EXPANSION_PANEL_DEFAULT_OPTIONS: InjectionToken<MatExpansionPanelDefaultOptions>;
/**
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the MatAccordion directive attached.
 */
declare class MatExpansionPanel extends CdkAccordionItem implements AfterContentInit, OnChanges, OnDestroy {
    private _viewContainerRef;
    private readonly _animationsDisabled;
    private _document;
    private _ngZone;
    private _elementRef;
    private _renderer;
    private _cleanupTransitionEnd;
    /** Whether the toggle indicator should be hidden. */
    get hideToggle(): boolean;
    set hideToggle(value: boolean);
    private _hideToggle;
    /** The position of the expansion indicator. */
    get togglePosition(): MatAccordionTogglePosition;
    set togglePosition(value: MatAccordionTogglePosition);
    private _togglePosition;
    /** An event emitted after the body's expansion animation happens. */
    readonly afterExpand: EventEmitter<void>;
    /** An event emitted after the body's collapse animation happens. */
    readonly afterCollapse: EventEmitter<void>;
    /** Stream that emits for changes in `@Input` properties. */
    readonly _inputChanges: Subject<SimpleChanges>;
    /** Optionally defined accordion the expansion panel belongs to. */
    accordion: MatAccordionBase;
    /** Content that will be rendered lazily. */
    _lazyContent: MatExpansionPanelContent;
    /** Element containing the panel's user-provided content. */
    _body: ElementRef<HTMLElement>;
    /** Element wrapping the panel body. */
    protected _bodyWrapper: ElementRef<HTMLElement> | undefined;
    /** Portal holding the user's content. */
    _portal: TemplatePortal;
    /** ID for the associated header element. Used for a11y labelling. */
    _headerId: string;
    constructor(...args: unknown[]);
    /** Determines whether the expansion panel should have spacing between it and its siblings. */
    _hasSpacing(): boolean;
    /** Gets the expanded state string. */
    _getExpandedState(): MatExpansionPanelState;
    /** Toggles the expanded state of the expansion panel. */
    toggle(): void;
    /** Sets the expanded state of the expansion panel to false. */
    close(): void;
    /** Sets the expanded state of the expansion panel to true. */
    open(): void;
    ngAfterContentInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /** Checks whether the expansion panel's content contains the currently-focused element. */
    _containsFocus(): boolean;
    private _transitionEndListener;
    protected _setupAnimationEvents(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatExpansionPanel, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatExpansionPanel, "mat-expansion-panel", ["matExpansionPanel"], { "hideToggle": { "alias": "hideToggle"; "required": false; }; "togglePosition": { "alias": "togglePosition"; "required": false; }; }, { "afterExpand": "afterExpand"; "afterCollapse": "afterCollapse"; }, ["_lazyContent"], ["mat-expansion-panel-header", "*", "mat-action-row"], true, never>;
    static ngAcceptInputType_hideToggle: unknown;
}
/**
 * Actions of a `<mat-expansion-panel>`.
 */
declare class MatExpansionPanelActionRow {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatExpansionPanelActionRow, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatExpansionPanelActionRow, "mat-action-row", never, {}, {}, never, never, true, never>;
}

/**
 * Header element of a `<mat-expansion-panel>`.
 */
declare class MatExpansionPanelHeader implements AfterViewInit, OnDestroy, FocusableOption {
    panel: MatExpansionPanel;
    private _element;
    private _focusMonitor;
    private _changeDetectorRef;
    private _parentChangeSubscription;
    constructor(...args: unknown[]);
    /** Height of the header while the panel is expanded. */
    expandedHeight: string;
    /** Height of the header while the panel is collapsed. */
    collapsedHeight: string;
    /** Tab index of the header. */
    tabIndex: number;
    /**
     * Whether the associated panel is disabled. Implemented as a part of `FocusableOption`.
     * @docs-private
     */
    get disabled(): boolean;
    /** Toggles the expanded state of the panel. */
    _toggle(): void;
    /** Gets whether the panel is expanded. */
    _isExpanded(): boolean;
    /** Gets the expanded state string of the panel. */
    _getExpandedState(): string;
    /** Gets the panel id. */
    _getPanelId(): string;
    /** Gets the toggle position for the header. */
    _getTogglePosition(): MatAccordionTogglePosition;
    /** Gets whether the expand indicator should be shown. */
    _showToggle(): boolean;
    /**
     * Gets the current height of the header. Null if no custom height has been
     * specified, and if the default height from the stylesheet should be used.
     */
    _getHeaderHeight(): string | null;
    /** Handle keydown event calling to toggle() if appropriate. */
    _keydown(event: KeyboardEvent): void;
    /**
     * Focuses the panel header. Implemented as a part of `FocusableOption`.
     * @param origin Origin of the action that triggered the focus.
     * @docs-private
     */
    focus(origin?: FocusOrigin, options?: FocusOptions): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatExpansionPanelHeader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatExpansionPanelHeader, "mat-expansion-panel-header", never, { "expandedHeight": { "alias": "expandedHeight"; "required": false; }; "collapsedHeight": { "alias": "collapsedHeight"; "required": false; }; "tabIndex": { "alias": "tabIndex"; "required": false; }; }, {}, never, ["mat-panel-title", "mat-panel-description", "*"], true, never>;
    static ngAcceptInputType_tabIndex: unknown;
}
/**
 * Description element of a `<mat-expansion-panel-header>`.
 */
declare class MatExpansionPanelDescription {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatExpansionPanelDescription, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatExpansionPanelDescription, "mat-panel-description", never, {}, {}, never, never, true, never>;
}
/**
 * Title element of a `<mat-expansion-panel-header>`.
 */
declare class MatExpansionPanelTitle {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatExpansionPanelTitle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatExpansionPanelTitle, "mat-panel-title", never, {}, {}, never, never, true, never>;
}

/**
 * Directive for a Material Design Accordion.
 */
declare class MatAccordion extends CdkAccordion implements MatAccordionBase, AfterContentInit, OnDestroy {
    private _keyManager;
    /** Headers belonging to this accordion. */
    private _ownHeaders;
    /** All headers inside the accordion. Includes headers inside nested accordions. */
    _headers: QueryList<MatExpansionPanelHeader>;
    /** Whether the expansion indicator should be hidden. */
    hideToggle: boolean;
    /**
     * Display mode used for all expansion panels in the accordion. Currently two display
     * modes exist:
     *  default - a gutter-like spacing is placed around any expanded panel, placing the expanded
     *     panel at a different elevation from the rest of the accordion.
     *  flat - no spacing is placed around expanded panels, showing all panels at the same
     *     elevation.
     */
    displayMode: MatAccordionDisplayMode;
    /** The position of the expansion indicator. */
    togglePosition: MatAccordionTogglePosition;
    ngAfterContentInit(): void;
    /** Handles keyboard events coming in from the panel headers. */
    _handleHeaderKeydown(event: KeyboardEvent): void;
    _handleHeaderFocus(header: MatExpansionPanelHeader): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatAccordion, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatAccordion, "mat-accordion", ["matAccordion"], { "hideToggle": { "alias": "hideToggle"; "required": false; }; "displayMode": { "alias": "displayMode"; "required": false; }; "togglePosition": { "alias": "togglePosition"; "required": false; }; }, {}, ["_headers"], never, true, never>;
    static ngAcceptInputType_hideToggle: unknown;
}

declare class MatExpansionModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatExpansionModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatExpansionModule, never, [typeof MatCommonModule, typeof i2.CdkAccordionModule, typeof i3.PortalModule, typeof MatAccordion, typeof MatExpansionPanel, typeof MatExpansionPanelActionRow, typeof MatExpansionPanelHeader, typeof MatExpansionPanelTitle, typeof MatExpansionPanelDescription, typeof MatExpansionPanelContent], [typeof MatAccordion, typeof MatExpansionPanel, typeof MatExpansionPanelActionRow, typeof MatExpansionPanelHeader, typeof MatExpansionPanelTitle, typeof MatExpansionPanelDescription, typeof MatExpansionPanelContent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatExpansionModule>;
}

/**
 * Time and timing curve for expansion panel animations.
 * @deprecated No longer used. Will be removed.
 * @breaking-change 21.0.0
 */
declare const EXPANSION_PANEL_ANIMATION_TIMING = "225ms cubic-bezier(0.4,0.0,0.2,1)";
/**
 * Animations used by the Material expansion panel.
 *
 * A bug in angular animation's `state` when ViewContainers are moved using ViewContainerRef.move()
 * causes the animation state of moved components to become `void` upon exit, and not update again
 * upon reentry into the DOM. This can lead a to situation for the expansion panel where the state
 * of the panel is `expanded` or `collapsed` but the animation state is `void`.
 *
 * To correctly handle animating to the next state, we animate between `void` and `collapsed` which
 * are defined to have the same styles. Since angular animates from the current styles to the
 * destination state's style definition, in situations where we are moving from `void`'s styles to
 * `collapsed` this acts a noop since no style values change.
 *
 * In the case where angular's animation state is out of sync with the expansion panel's state, the
 * expansion panel being `expanded` and angular animations being `void`, the animation from the
 * `expanded`'s effective styles (though in a `void` animation state) to the collapsed state will
 * occur as expected.
 *
 * Angular Bug: https://github.com/angular/angular/issues/18847
 *
 * @docs-private
 * @deprecated No longer being used, to be removed.
 * @breaking-change 21.0.0
 */
declare const matExpansionAnimations: {
    readonly indicatorRotate: any;
    readonly bodyExpansion: any;
};

export { EXPANSION_PANEL_ANIMATION_TIMING, MAT_ACCORDION, MAT_EXPANSION_PANEL, MAT_EXPANSION_PANEL_DEFAULT_OPTIONS, MatAccordion, MatExpansionModule, MatExpansionPanel, MatExpansionPanelActionRow, MatExpansionPanelContent, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle, matExpansionAnimations };
export type { MatAccordionBase, MatAccordionDisplayMode, MatAccordionTogglePosition, MatExpansionPanelDefaultOptions, MatExpansionPanelState };
