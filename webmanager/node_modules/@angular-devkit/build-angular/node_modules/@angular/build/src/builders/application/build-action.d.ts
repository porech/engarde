/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { BuilderContext } from '@angular-devkit/architect';
import { ExecutionResult, RebuildState } from '../../tools/esbuild/bundler-execution-result';
import { NormalizedCachedOptions } from '../../utils/normalize-cache';
import { NormalizedOutputOptions } from './options';
import { Result } from './results';
export declare function runEsBuildBuildAction(action: (rebuildState?: RebuildState) => Promise<ExecutionResult>, options: {
    workspaceRoot: string;
    projectRoot: string;
    outputOptions: NormalizedOutputOptions;
    logger: BuilderContext['logger'];
    cacheOptions: NormalizedCachedOptions;
    watch?: boolean;
    verbose?: boolean;
    progress?: boolean;
    poll?: number;
    signal?: AbortSignal;
    preserveSymlinks?: boolean;
    clearScreen?: boolean;
    colors?: boolean;
    jsonLogs?: boolean;
    incrementalResults?: boolean;
}): AsyncIterable<Result>;
