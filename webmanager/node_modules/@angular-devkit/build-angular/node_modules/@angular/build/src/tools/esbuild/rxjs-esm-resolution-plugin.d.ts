/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { Plugin } from 'esbuild';
/**
 * Creates a plugin that forces ESM resolution of rxjs.
 * This is needed as when targeting node, the CJS version is used to the current package conditional exports.
 * @see: https://github.com/ReactiveX/rxjs/blob/2947583bb33e97f3db9e6d9f6cea70c62a173060/package.json#L19.
 *
 * NOTE: This can be removed when and if rxjs adds an import condition that allows ESM usage on Node.js.
 *
 * @returns An esbuild plugin.
 */
export declare function createRxjsEsmResolutionPlugin(): Plugin;
