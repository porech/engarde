/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { Schema as NgPackagrBuilderOptions } from './schema';
/**
 * @experimental Direct usage of this function is considered experimental.
 */
export declare function execute(options: NgPackagrBuilderOptions, context: BuilderContext): Observable<BuilderOutput>;
export type { NgPackagrBuilderOptions };
declare const _default: import("@angular-devkit/architect").Builder<Record<string, string> & NgPackagrBuilderOptions & import("@angular-devkit/core").JsonObject>;
export default _default;
