/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { Plugin } from 'esbuild';
/**
 * Creates a plugin that marks any resolved path as external if it is within a node modules directory.
 * This is used instead of the esbuild `packages` option to avoid marking files that should be loaded
 * via customized loaders. This is necessary to prevent Vite development server pre-bundling errors.
 *
 * @returns An esbuild plugin.
 */
export declare function createExternalPackagesPlugin(options?: {
    exclude?: string[];
}): Plugin;
