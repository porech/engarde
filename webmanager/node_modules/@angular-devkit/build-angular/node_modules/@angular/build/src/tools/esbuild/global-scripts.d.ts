/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { NormalizedApplicationBuildOptions } from '../../builders/application/options';
import { BundlerOptionsFactory } from './bundler-context';
/**
 * Create an esbuild 'build' options object for all global scripts defined in the user provied
 * build options.
 * @param options The builder's user-provider normalized options.
 * @returns An esbuild BuildOptions object.
 */
export declare function createGlobalScriptsBundleOptions(options: NormalizedApplicationBuildOptions, target: string[], initial: boolean): BundlerOptionsFactory | undefined;
