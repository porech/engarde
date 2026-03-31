/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { BuilderContext } from '@angular-devkit/architect';
import { ExecutionResult, RebuildState } from '../../tools/esbuild/bundler-execution-result';
import { NormalizedApplicationBuildOptions } from './options';
export declare function executeBuild(options: NormalizedApplicationBuildOptions, context: BuilderContext, rebuildState?: RebuildState): Promise<ExecutionResult>;
