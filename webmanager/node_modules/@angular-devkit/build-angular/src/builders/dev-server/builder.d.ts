/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { DevServerBuilderOutput } from '@angular/build';
import { type IndexHtmlTransform } from '@angular/build/private';
import type { BuilderContext } from '@angular-devkit/architect';
import type { Plugin } from 'esbuild';
import type http from 'node:http';
import { Observable } from 'rxjs';
import type { ExecutionTransformer } from '../../transforms';
import type { Schema as DevServerBuilderOptions } from './schema';
/**
 * A Builder that executes a development server based on the provided browser target option.
 *
 * Usage of the `transforms` and/or `extensions` parameters is NOT supported and may cause
 * unexpected build output or build failures.
 *
 * @param options Dev Server options.
 * @param context The build context.
 * @param transforms A map of transforms that can be used to hook into some logic (such as
 * transforming webpack configuration before passing it to webpack).
 * @param extensions An optional object containing an array of build plugins (esbuild-based)
 * and/or HTTP request middleware.
 *
 * @experimental Direct usage of this function is considered experimental.
 */
export declare function execute(options: DevServerBuilderOptions, context: BuilderContext, transforms?: {
    webpackConfiguration?: ExecutionTransformer<import('webpack').Configuration>;
    logging?: import('@angular-devkit/build-webpack').WebpackLoggingCallback;
    indexHtml?: IndexHtmlTransform;
}, extensions?: {
    buildPlugins?: Plugin[];
    middleware?: ((req: http.IncomingMessage, res: http.ServerResponse, next: (err?: unknown) => void) => void)[];
    builderSelector?: (info: BuilderSelectorInfo, logger: BuilderContext['logger']) => string;
}): Observable<DevServerBuilderOutput>;
export declare function isEsbuildBased(builderName: string): builderName is '@angular/build:application' | '@angular-devkit/build-angular:application' | '@angular-devkit/build-angular:browser-esbuild';
interface BuilderSelectorInfo {
    builderName: string;
    forceEsbuild: boolean;
}
export {};
