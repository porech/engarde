/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { BuilderContext } from '@angular-devkit/architect';
import type { Plugin } from 'esbuild';
import type http from 'node:http';
import { type IndexHtmlTransform } from './internal';
import type { DevServerBuilderOutput } from './output';
import type { Schema as DevServerBuilderOptions } from './schema';
/**
 * A Builder that executes a development server based on the provided browser target option.
 *
 * Usage of the `transforms` and/or `extensions` parameters is NOT supported and may cause
 * unexpected build output or build failures.
 *
 * @param options Dev Server options.
 * @param context The build context.
 * @param extensions An optional object containing an array of build plugins (esbuild-based)
 * and/or HTTP request middleware.
 *
 * @experimental Direct usage of this function is considered experimental.
 */
export declare function execute(options: DevServerBuilderOptions, context: BuilderContext, extensions?: {
    buildPlugins?: Plugin[];
    middleware?: ((req: http.IncomingMessage, res: http.ServerResponse, next: (err?: unknown) => void) => void)[];
    indexHtmlTransformer?: IndexHtmlTransform;
}): AsyncIterable<DevServerBuilderOutput>;
