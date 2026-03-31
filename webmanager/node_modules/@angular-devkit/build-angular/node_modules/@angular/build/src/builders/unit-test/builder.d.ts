/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import type { ApplicationBuilderExtensions } from '../application/options';
import type { Schema as UnitTestBuilderOptions } from './schema';
export type { UnitTestBuilderOptions };
/**
 * @experimental Direct usage of this function is considered experimental.
 */
export declare function execute(options: UnitTestBuilderOptions, context: BuilderContext, extensions?: ApplicationBuilderExtensions): AsyncIterable<BuilderOutput>;
