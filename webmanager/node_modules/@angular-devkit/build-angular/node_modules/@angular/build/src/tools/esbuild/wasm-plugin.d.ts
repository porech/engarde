/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { Plugin } from 'esbuild';
import { LoadResultCache } from './load-result-cache';
/**
 * Options for the Angular WASM esbuild plugin
 * @see createWasmPlugin
 */
export interface WasmPluginOptions {
    /** Allow generation of async (proposal compliant) WASM imports. This requires zoneless to enable async/await. */
    allowAsync?: boolean;
    /** Load results cache. */
    cache?: LoadResultCache;
}
/**
 * Creates an esbuild plugin to use WASM files with import statements and expressions.
 * The default behavior follows the WebAssembly/ES mode integration proposal found at
 * https://github.com/WebAssembly/esm-integration/tree/main/proposals/esm-integration.
 * This behavior requires top-level await support which is only available in zoneless
 * Angular applications.
 * @returns An esbuild plugin.
 */
export declare function createWasmPlugin(options: WasmPluginOptions): Plugin;
