/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { Connect, ViteDevServer } from 'vite';
export declare function createAngularSsrInternalMiddleware(server: ViteDevServer, indexHtmlTransformer?: (content: string) => Promise<string>): Connect.NextHandleFunction;
export declare function createAngularSsrExternalMiddleware(server: ViteDevServer, indexHtmlTransformer?: (content: string) => Promise<string>): Promise<Connect.NextHandleFunction>;
