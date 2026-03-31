import * as i0 from '@angular/core';
import { InjectionToken, OnInit, AfterViewChecked, OnDestroy, ElementRef } from '@angular/core';
import { MatCommonModule } from './common-module.d.js';
import { ThemePalette } from './palette.d.js';

/** Default options for `mat-icon`.  */
interface MatIconDefaultOptions {
    /**
     * Theme color of the icon. This API is supported in M2 themes only, it
     * has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/icon/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color?: ThemePalette;
    /** Font set that the icon is a part of. */
    fontSet?: string;
}
/** Injection token to be used to override the default options for `mat-icon`. */
declare const MAT_ICON_DEFAULT_OPTIONS: InjectionToken<MatIconDefaultOptions>;
/**
 * Injection token used to provide the current location to `MatIcon`.
 * Used to handle server-side rendering and to stub out during unit tests.
 * @docs-private
 */
declare const MAT_ICON_LOCATION: InjectionToken<MatIconLocation>;
/**
 * Stubbed out location for `MatIcon`.
 * @docs-private
 */
interface MatIconLocation {
    getPathname: () => string;
}
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
declare function MAT_ICON_LOCATION_FACTORY(): MatIconLocation;
/**
 * Component to display an icon. It can be used in the following ways:
 *
 * - Specify the svgIcon input to load an SVG icon from a URL previously registered with the
 *   addSvgIcon, addSvgIconInNamespace, addSvgIconSet, or addSvgIconSetInNamespace methods of
 *   MatIconRegistry. If the svgIcon value contains a colon it is assumed to be in the format
 *   "[namespace]:[name]", if not the value will be the name of an icon in the default namespace.
 *   Examples:
 *     `<mat-icon svgIcon="left-arrow"></mat-icon>
 *     <mat-icon svgIcon="animals:cat"></mat-icon>`
 *
 * - Use a font ligature as an icon by putting the ligature text in the `fontIcon` attribute or the
 *   content of the `<mat-icon>` component. If you register a custom font class, don't forget to also
 *   include the special class `mat-ligature-font`. It is recommended to use the attribute alternative
 *   to prevent the ligature text to be selectable and to appear in search engine results.
 *   By default, the Material icons font is used as described at
 *   http://google.github.io/material-design-icons/#icon-font-for-the-web. You can specify an
 *   alternate font by setting the fontSet input to either the CSS class to apply to use the
 *   desired font, or to an alias previously registered with MatIconRegistry.registerFontClassAlias.
 *   Examples:
 *     `<mat-icon fontIcon="home"></mat-icon>
 *     <mat-icon>home</mat-icon>
 *     <mat-icon fontSet="myfont" fontIcon="sun"></mat-icon>
 *     <mat-icon fontSet="myfont">sun</mat-icon>`
 *
 * - Specify a font glyph to be included via CSS rules by setting the fontSet input to specify the
 *   font, and the fontIcon input to specify the icon. Typically the fontIcon will specify a
 *   CSS class which causes the glyph to be displayed via a :before selector, as in
 *   https://fontawesome-v4.github.io/examples/
 *   Example:
 *     `<mat-icon fontSet="fa" fontIcon="alarm"></mat-icon>`
 */
declare class MatIcon implements OnInit, AfterViewChecked, OnDestroy {
    readonly _elementRef: ElementRef<HTMLElement>;
    private _iconRegistry;
    private _location;
    private readonly _errorHandler;
    private _defaultColor;
    /**
     * Theme color of the icon. This API is supported in M2 themes only, it
     * has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/icon/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    get color(): string | null | undefined;
    set color(value: string | null | undefined);
    private _color;
    /**
     * Whether the icon should be inlined, automatically sizing the icon to match the font size of
     * the element the icon is contained in.
     */
    inline: boolean;
    /** Name of the icon in the SVG icon set. */
    get svgIcon(): string;
    set svgIcon(value: string);
    private _svgIcon;
    /** Font set that the icon is a part of. */
    get fontSet(): string;
    set fontSet(value: string);
    private _fontSet;
    /** Name of an icon within a font set. */
    get fontIcon(): string;
    set fontIcon(value: string);
    private _fontIcon;
    private _previousFontSetClass;
    private _previousFontIconClass;
    _svgName: string | null;
    _svgNamespace: string | null;
    /** Keeps track of the current page path. */
    private _previousPath?;
    /** Keeps track of the elements and attributes that we've prefixed with the current path. */
    private _elementsWithExternalReferences?;
    /** Subscription to the current in-progress SVG icon request. */
    private _currentIconFetch;
    constructor(...args: unknown[]);
    /**
     * Splits an svgIcon binding value into its icon set and icon name components.
     * Returns a 2-element array of [(icon set), (icon name)].
     * The separator for the two fields is ':'. If there is no separator, an empty
     * string is returned for the icon set and the entire value is returned for
     * the icon name. If the argument is falsy, returns an array of two empty strings.
     * Throws an error if the name contains two or more ':' separators.
     * Examples:
     *   `'social:cake' -> ['social', 'cake']
     *   'penguin' -> ['', 'penguin']
     *   null -> ['', '']
     *   'a:b:c' -> (throws Error)`
     */
    private _splitIconName;
    ngOnInit(): void;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    _usingFontIcon(): boolean;
    private _setSvgElement;
    private _clearSvgElement;
    private _updateFontIconClasses;
    /**
     * Cleans up a value to be used as a fontIcon or fontSet.
     * Since the value ends up being assigned as a CSS class, we
     * have to trim the value and omit space-separated values.
     */
    private _cleanupFontValue;
    /**
     * Prepends the current path to all elements that have an attribute pointing to a `FuncIRI`
     * reference. This is required because WebKit browsers require references to be prefixed with
     * the current path, if the page has a `base` tag.
     */
    private _prependPathToReferences;
    /**
     * Caches the children of an SVG element that have `url()`
     * references that we need to prefix with the current path.
     */
    private _cacheChildrenWithExternalReferences;
    /** Sets a new SVG icon with a particular name. */
    private _updateSvgIcon;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatIcon, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatIcon, "mat-icon", ["matIcon"], { "color": { "alias": "color"; "required": false; }; "inline": { "alias": "inline"; "required": false; }; "svgIcon": { "alias": "svgIcon"; "required": false; }; "fontSet": { "alias": "fontSet"; "required": false; }; "fontIcon": { "alias": "fontIcon"; "required": false; }; }, {}, never, ["*"], true, never>;
    static ngAcceptInputType_inline: unknown;
}

declare class MatIconModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatIconModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatIconModule, never, [typeof MatCommonModule, typeof MatIcon], [typeof MatIcon, typeof MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatIconModule>;
}

export { MAT_ICON_DEFAULT_OPTIONS, MAT_ICON_LOCATION, MAT_ICON_LOCATION_FACTORY, MatIcon, MatIconModule };
export type { MatIconDefaultOptions, MatIconLocation };
