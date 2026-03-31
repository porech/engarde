/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Builder, BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { ApplicationBuilderExtensions, ApplicationBuilderInternalOptions } from './options';
import { Result } from './results';
import { Schema as ApplicationBuilderOptions } from './schema';
export type { ApplicationBuilderOptions };
export declare function buildApplicationInternal(options: ApplicationBuilderInternalOptions, context: BuilderContext & {
    signal?: AbortSignal;
}, extensions?: ApplicationBuilderExtensions): AsyncIterable<Result>;
/**
 * Builds an application using the `application` builder with the provided
 * options.
 *
 * Usage of the `extensions` parameter is NOT supported and may cause unexpected
 * build output or build failures.
 *
 * @experimental Direct usage of this function is considered experimental.
 *
 * @param options The options defined by the builder's schema to use.
 * @param context An Architect builder context instance.
 * @param extensions An object contain extension points for the build.
 * @returns The build output results of the build.
 */
export declare function buildApplication(options: ApplicationBuilderOptions, context: BuilderContext, extensions?: ApplicationBuilderExtensions): AsyncIterable<BuilderOutput>;
declare const builder: Builder<ApplicationBuilderOptions>;
export default builder;
