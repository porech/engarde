/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { BundleContextResult } from '../../tools/esbuild/bundler-context';
/**
 * Optimizes the chunks of a build result using rolldown.
 *
 * This function takes the output of an esbuild build, identifies the main browser entry point,
 * and uses rolldown to bundle and optimize the JavaScript chunks. The optimized chunks
 * replace the original ones in the build result, and the metafile is updated to reflect
 * the changes.
 *
 * @param original The original build result from esbuild.
 * @param sourcemap A boolean or 'hidden' to control sourcemap generation.
 * @returns A promise that resolves to the updated build result with optimized chunks.
 */
export declare function optimizeChunks(original: BundleContextResult, sourcemap: boolean | 'hidden'): Promise<BundleContextResult>;
