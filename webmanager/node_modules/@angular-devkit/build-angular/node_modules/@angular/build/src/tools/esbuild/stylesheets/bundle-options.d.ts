/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { BuildOptions } from 'esbuild';
import { NormalizedCachedOptions } from '../../../utils/normalize-cache';
import { PostcssConfiguration } from '../../../utils/postcss-configuration';
import { LoadResultCache } from '../load-result-cache';
import { StylesheetPluginsass } from './stylesheet-plugin-factory';
export interface BundleStylesheetOptions {
    workspaceRoot: string;
    optimization: boolean;
    inlineFonts: boolean;
    preserveSymlinks?: boolean;
    sourcemap: boolean | 'external' | 'inline' | 'linked';
    sourcesContent?: boolean;
    outputNames: {
        bundles: string;
        media: string;
    };
    includePaths?: string[];
    sass?: StylesheetPluginsass;
    externalDependencies?: string[];
    target: string[];
    tailwindConfiguration?: {
        file: string;
        package: string;
    };
    postcssConfiguration?: PostcssConfiguration;
    publicPath?: string;
    cacheOptions: NormalizedCachedOptions;
}
export declare function createStylesheetBundleOptions(options: BundleStylesheetOptions, cache?: LoadResultCache, inlineComponentData?: Record<string, string>): BuildOptions & {
    plugins: NonNullable<BuildOptions['plugins']>;
};
