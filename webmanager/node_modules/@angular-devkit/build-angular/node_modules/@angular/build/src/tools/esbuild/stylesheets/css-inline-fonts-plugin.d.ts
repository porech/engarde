/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { Plugin } from 'esbuild';
import { NormalizedCachedOptions } from '../../../utils/normalize-cache';
import { LoadResultCache } from '../load-result-cache';
/**
 * Options for the createCssInlineFontsPlugin
 * @see createCssInlineFontsPlugin
 */
export interface CssInlineFontsPluginOptions {
    /** Disk cache normalized options */
    cacheOptions?: NormalizedCachedOptions;
    /** Load results cache. */
    cache?: LoadResultCache;
}
/**
 * Creates an esbuild {@link Plugin} that inlines fonts imported via import-rule.
 * within the build configuration.
 */
export declare function createCssInlineFontsPlugin({ cache, cacheOptions, }: CssInlineFontsPluginOptions): Plugin;
