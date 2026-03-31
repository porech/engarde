/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { type Builder, type BuilderContext, type BuilderOutput } from '@angular-devkit/architect';
import type { ConfigOptions } from 'karma';
import type { Schema as KarmaBuilderOptions } from './schema';
export interface KarmaBuilderTransformsOptions {
    karmaOptions?: (options: ConfigOptions) => ConfigOptions | Promise<ConfigOptions>;
}
/**
 * @experimental Direct usage of this function is considered experimental.
 */
export declare function execute(options: KarmaBuilderOptions, context: BuilderContext, transforms?: KarmaBuilderTransformsOptions): AsyncIterable<BuilderOutput>;
export type { KarmaBuilderOptions };
declare const builder: Builder<KarmaBuilderOptions>;
export default builder;
