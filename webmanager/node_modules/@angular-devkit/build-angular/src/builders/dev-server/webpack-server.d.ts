/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { IndexHtmlTransform } from '@angular/build/private';
import { BuilderContext } from '@angular-devkit/architect';
import { DevServerBuildOutput, WebpackLoggingCallback } from '@angular-devkit/build-webpack';
import { Observable } from 'rxjs';
import webpack from 'webpack';
import { BuildEventStats } from '../../tools/webpack/utils/stats';
import { ExecutionTransformer } from '../../transforms';
import { NormalizedDevServerOptions } from './options';
/**
 * @experimental Direct usage of this type is considered experimental.
 */
export type DevServerBuilderOutput = DevServerBuildOutput & {
    baseUrl: string;
    stats: BuildEventStats;
};
/**
 * Reusable implementation of the Angular Webpack development server builder.
 * @param options Dev Server options.
 * @param builderName The name of the builder used to build the application.
 * @param context The build context.
 * @param transforms A map of transforms that can be used to hook into some logic (such as
 *     transforming webpack configuration before passing it to webpack).
 */
export declare function serveWebpackBrowser(options: NormalizedDevServerOptions, builderName: string, context: BuilderContext, transforms?: {
    webpackConfiguration?: ExecutionTransformer<webpack.Configuration>;
    logging?: WebpackLoggingCallback;
    indexHtml?: IndexHtmlTransform;
}): Observable<DevServerBuilderOutput>;
