/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { OnLoadResult, Plugin, PluginBuild } from 'esbuild';
import type { Options } from 'sass';
import type { PostcssConfiguration } from '../../../utils/postcss-configuration';
import { LoadResultCache } from '../load-result-cache';
/**
 * Configuration options for handling Sass-specific deprecations in a stylesheet plugin.
 */
export type StylesheetPluginsass = Pick<Options<'async'>, 'futureDeprecations' | 'fatalDeprecations' | 'silenceDeprecations'>;
/**
 * An object containing the plugin options to use when processing stylesheets.
 */
export interface StylesheetPluginOptions {
    /**
     * Controls the use and creation of sourcemaps when processing the stylesheets.
     * If true, sourcemap processing is enabled; if false, disabled.
     */
    sourcemap: boolean;
    /**
     * An optional array of paths that will be searched for stylesheets if the default
     * resolution process for the stylesheet language does not succeed.
     */
    includePaths?: string[];
    /**
     * Optional component data for any inline styles from Component decorator `styles` fields.
     * The key is an internal angular resource URI and the value is the stylesheet content.
     */
    inlineComponentData?: Record<string, string>;
    /**
     * Optional information used to load and configure Tailwind CSS. If present, the postcss
     * will be added to the stylesheet processing with the Tailwind plugin setup as provided
     * by the configuration file.
     */
    tailwindConfiguration?: {
        file: string;
        package: string;
    };
    /**
     * Optional configuration object for custom postcss usage. If present, postcss will be
     * initialized and used for every stylesheet. This overrides the tailwind integration
     * and any tailwind usage must be manually configured in the custom postcss usage.
     */
    postcssConfiguration?: PostcssConfiguration;
    /**
     * Optional Options for configuring Sass behavior.
     */
    sass?: StylesheetPluginsass;
}
export interface StylesheetLanguage {
    name: string;
    componentFilter: RegExp;
    fileFilter: RegExp;
    process?(data: string, file: string, format: string, options: StylesheetPluginOptions, build: PluginBuild): OnLoadResult | Promise<OnLoadResult>;
}
export declare class StylesheetPluginFactory {
    private readonly options;
    private readonly cache?;
    constructor(options: StylesheetPluginOptions, cache?: LoadResultCache | undefined);
    create(language: Readonly<StylesheetLanguage>): Plugin;
    private setupPostcssPromise;
    private get setupPostcss();
    private initPostcssCallCount;
    /**
     * This method should not be called directly.
     * Use {@link setupPostcss} instead.
     */
    private initPostcss;
}
