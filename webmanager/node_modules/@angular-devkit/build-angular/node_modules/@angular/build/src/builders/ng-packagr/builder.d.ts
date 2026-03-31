/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import type { Schema as NgPackagrBuilderOptions } from './schema';
/**
 * A Builder that executes the `ng-packagr` tool to build an Angular library.
 *
 * @param options The builder options as defined by the JSON schema.
 * @param context A BuilderContext instance.
 * @returns A BuilderOutput object.
 *
 * @experimental Direct usage of this function is considered experimental.
 */
export declare function execute(options: NgPackagrBuilderOptions, context: BuilderContext): AsyncIterableIterator<BuilderOutput>;
