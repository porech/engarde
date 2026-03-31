/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { Connect, ViteDevServer } from 'vite';
/**
 * Creates a middleware for adding custom headers.
 *
 * This middleware is responsible for setting HTTP headers as configured in the Vite server options.
 * If headers are defined in the server configuration, they are applied to the server response.
 *
 * @param server - The instance of `ViteDevServer` containing the configuration, including custom headers.
 * @returns A middleware function that processes the incoming request, sets headers if available,
 *          and passes control to the next middleware in the chain.
 */
export declare function createAngularHeadersMiddleware(server: ViteDevServer): Connect.NextHandleFunction;
