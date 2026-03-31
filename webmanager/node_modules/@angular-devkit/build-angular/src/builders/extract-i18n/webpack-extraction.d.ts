/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { ɵParsedMessage as LocalizeMessage } from '@angular/localize';
import { BuilderContext } from '@angular-devkit/architect';
import { BuildResult } from '@angular-devkit/build-webpack';
import webpack from 'webpack';
import { ExecutionTransformer } from '../../transforms';
import { NormalizedExtractI18nOptions } from './options';
export declare function extractMessages(options: NormalizedExtractI18nOptions, builderName: string, context: BuilderContext, transforms?: {
    webpackConfiguration?: ExecutionTransformer<webpack.Configuration>;
}): Promise<{
    builderResult: BuildResult;
    basePath: string;
    messages: LocalizeMessage[];
    useLegacyIds: boolean;
}>;
