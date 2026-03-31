"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAngularHeadersMiddleware = createAngularHeadersMiddleware;
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
function createAngularHeadersMiddleware(server) {
    return function angularHeadersMiddleware(_req, res, next) {
        const headers = server.config.server.headers;
        if (!headers) {
            return next();
        }
        for (const [name, value] of Object.entries(headers)) {
            if (value !== undefined) {
                res.setHeader(name, value);
            }
        }
        next();
    };
}
