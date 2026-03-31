import * as i0 from '@angular/core';
import { AfterViewInit, ElementRef, QueryList } from '@angular/core';
import { MatCommonModule } from '../common-module.d.js';
import '@angular/cdk/bidi';

declare class MatToolbarRow {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatToolbarRow, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatToolbarRow, "mat-toolbar-row", ["matToolbarRow"], {}, {}, never, never, true, never>;
}
declare class MatToolbar implements AfterViewInit {
    protected _elementRef: ElementRef<any>;
    private _platform;
    private _document;
    /**
     * Theme color of the toolbar. This API is supported in M2 themes only, it has
     * no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/toolbar/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color?: string | null;
    /** Reference to all toolbar row elements that have been projected. */
    _toolbarRows: QueryList<MatToolbarRow>;
    constructor(...args: unknown[]);
    ngAfterViewInit(): void;
    /**
     * Throws an exception when developers are attempting to combine the different toolbar row modes.
     */
    private _checkToolbarMixedModes;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatToolbar, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatToolbar, "mat-toolbar", ["matToolbar"], { "color": { "alias": "color"; "required": false; }; }, {}, ["_toolbarRows"], ["*", "mat-toolbar-row"], true, never>;
}
/**
 * Throws an exception when attempting to combine the different toolbar row modes.
 * @docs-private
 */
declare function throwToolbarMixedModesError(): void;

declare class MatToolbarModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatToolbarModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatToolbarModule, never, [typeof MatCommonModule, typeof MatToolbar, typeof MatToolbarRow], [typeof MatToolbar, typeof MatToolbarRow, typeof MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatToolbarModule>;
}

export { MatToolbar, MatToolbarModule, MatToolbarRow, throwToolbarMixedModesError };
