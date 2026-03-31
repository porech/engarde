/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { Metafile, OutputFile, PluginBuild } from 'esbuild';
import { LoadResultCache } from '../load-result-cache';
import { ComponentStylesheetBundler } from './component-stylesheets';
/**
 * Sets up esbuild resolve and load callbacks to support Angular JIT mode processing
 * for both Component stylesheets and templates. These callbacks work alongside the JIT
 * resource TypeScript transformer to convert and then bundle Component resources as
 * static imports.
 * @param build An esbuild {@link PluginBuild} instance used to add callbacks.
 * @param styleOptions The options to use when bundling stylesheets.
 * @param additionalResultFiles A Map where stylesheet resources will be added.
 */
export declare function setupJitPluginCallbacks(build: PluginBuild, stylesheetBundler: ComponentStylesheetBundler, additionalResultFiles: Map<string, {
    outputFiles?: OutputFile[];
    metafile?: Metafile;
}>, loadCache?: LoadResultCache): void;
