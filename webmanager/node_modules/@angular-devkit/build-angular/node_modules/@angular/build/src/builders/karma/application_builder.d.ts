/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { ResultFile } from '../application/results';
import { Schema as KarmaBuilderOptions } from './schema';
import type { KarmaBuilderTransformsOptions } from './index';
export declare function execute(options: KarmaBuilderOptions, context: BuilderContext, transforms?: KarmaBuilderTransformsOptions): AsyncIterable<BuilderOutput>;
export declare function writeTestFiles(files: Record<string, ResultFile>, testDir: string): Promise<void>;
