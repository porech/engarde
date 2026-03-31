/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { Schema } from './schema';
type PrerenderBuilderOptions = Schema;
type PrerenderBuilderOutput = BuilderOutput;
/**
 * Builds the browser and server, then renders each route in options.routes
 * and writes them to prerender/<route>/index.html for each output path in
 * the browser result.
 */
export declare function execute(options: PrerenderBuilderOptions, context: BuilderContext): Promise<PrerenderBuilderOutput>;
declare const _default: import("@angular-devkit/architect").Builder<Schema & import("@angular-devkit/core").JsonObject>;
export default _default;
