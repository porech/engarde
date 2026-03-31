/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import type webpack from 'webpack';
import type { ExecutionTransformer } from '../../transforms';
import { Schema as ExtractI18nBuilderOptions } from './schema';
/**
 * @experimental Direct usage of this function is considered experimental.
 */
export declare function execute(options: ExtractI18nBuilderOptions, context: BuilderContext, transforms?: {
    webpackConfiguration?: ExecutionTransformer<webpack.Configuration>;
}): Promise<BuilderOutput>;
