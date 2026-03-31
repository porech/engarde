/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { BuilderContext } from '@angular-devkit/architect';
import { Schema as WtrBuilderOptions } from './schema';
/** Logs a warning for any unsupported options specified. */
export declare function logBuilderStatusWarnings(options: WtrBuilderOptions, ctx: BuilderContext): void;
