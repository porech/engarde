"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAngularIndexHtmlMiddleware = createAngularIndexHtmlMiddleware;
const node_path_1 = require("node:path");
const utils_1 = require("../utils");
function createAngularIndexHtmlMiddleware(server, outputFiles, resetComponentUpdates, indexHtmlTransformer) {
    return function angularIndexHtmlMiddleware(req, res, next) {
        if (!req.url) {
            next();
            return;
        }
        // Parse the incoming request.
        // The base of the URL is unused but required to parse the URL.
        const pathname = (0, utils_1.pathnameWithoutBasePath)(req.url, server.config.base);
        const extension = (0, node_path_1.extname)(pathname);
        if (extension !== '.html') {
            next();
            return;
        }
        const rawHtml = outputFiles.get(pathname)?.contents;
        if (!rawHtml) {
            next();
            return;
        }
        // A request for the index indicates a full page reload request.
        resetComponentUpdates();
        server
            .transformIndexHtml(req.url, Buffer.from(rawHtml).toString('utf-8'))
            .then(async (processedHtml) => {
            if (indexHtmlTransformer) {
                processedHtml = await indexHtmlTransformer(processedHtml);
            }
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Cache-Control', 'no-cache');
            res.end(processedHtml);
        })
            .catch((error) => next(error));
    };
}
