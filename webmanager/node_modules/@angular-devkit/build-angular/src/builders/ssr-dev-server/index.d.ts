/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { json, logging } from '@angular-devkit/core';
import { Observable } from 'rxjs';
import { Schema } from './schema';
export type SSRDevServerBuilderOptions = Schema;
export type SSRDevServerBuilderOutput = BuilderOutput & {
    baseUrl?: string;
    port?: string;
};
export declare function execute(options: SSRDevServerBuilderOptions, context: BuilderContext): Observable<SSRDevServerBuilderOutput>;
export declare function log({ stderr, stdout }: {
    stderr: string | undefined;
    stdout: string | undefined;
}, logger: logging.LoggerApi): void;
declare const _default: import("@angular-devkit/architect").Builder<Schema & json.JsonObject>;
export default _default;
