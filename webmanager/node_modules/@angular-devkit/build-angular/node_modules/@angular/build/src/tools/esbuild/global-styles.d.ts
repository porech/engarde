/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { NormalizedApplicationBuildOptions } from '../../builders/application/options';
import { BundlerOptionsFactory } from './bundler-context';
export declare function createGlobalStylesBundleOptions(options: NormalizedApplicationBuildOptions, target: string[], initial: boolean): BundlerOptionsFactory | undefined;
