/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { createRequestHandler } from '@angular/ssr';
import type { createNodeRequestHandler } from '@angular/ssr/node';
export declare function isSsrNodeRequestHandler(value: unknown): value is ReturnType<typeof createNodeRequestHandler>;
export declare function isSsrRequestHandler(value: unknown): value is ReturnType<typeof createRequestHandler>;
