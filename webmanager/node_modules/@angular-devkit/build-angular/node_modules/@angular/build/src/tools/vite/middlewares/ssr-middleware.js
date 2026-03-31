"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAngularSsrInternalMiddleware = createAngularSsrInternalMiddleware;
exports.createAngularSsrExternalMiddleware = createAngularSsrExternalMiddleware;
const load_esm_1 = require("../../../utils/load-esm");
const utils_1 = require("../../../utils/server-rendering/utils");
function createAngularSsrInternalMiddleware(server, indexHtmlTransformer) {
    let cachedAngularServerApp;
    return function angularSsrMiddleware(req, res, next) {
        if (req.url === undefined) {
            return next();
        }
        (async () => {
            // Load the compiler because `@angular/ssr/node` depends on `@angular/` packages,
            // which must be processed by the runtime linker, even if they are not used.
            await (0, load_esm_1.loadEsmModule)('@angular/compiler');
            const { writeResponseToNodeResponse, createWebRequestFromNodeRequest } = await (0, load_esm_1.loadEsmModule)('@angular/ssr/node');
            const { ɵgetOrCreateAngularServerApp } = (await server.ssrLoadModule('/main.server.mjs'));
            // `ɵgetOrCreateAngularServerApp` can be undefined right after an error.
            // See: https://github.com/angular/angular-cli/issues/29907
            if (!ɵgetOrCreateAngularServerApp) {
                return next();
            }
            const angularServerApp = ɵgetOrCreateAngularServerApp({
                allowStaticRouteRender: true,
            });
            // Only Add the transform hook only if it's a different instance.
            if (cachedAngularServerApp !== angularServerApp) {
                angularServerApp.hooks.on('html:transform:pre', async ({ html, url }) => {
                    const processedHtml = await server.transformIndexHtml(url.pathname, html);
                    return indexHtmlTransformer?.(processedHtml) ?? processedHtml;
                });
                cachedAngularServerApp = angularServerApp;
            }
            const webReq = new Request(createWebRequestFromNodeRequest(req), {
                signal: AbortSignal.timeout(30_000),
            });
            const webRes = await angularServerApp.handle(webReq);
            if (!webRes) {
                return next();
            }
            return writeResponseToNodeResponse(webRes, res);
        })().catch(next);
    };
}
async function createAngularSsrExternalMiddleware(server, indexHtmlTransformer) {
    let fallbackWarningShown = false;
    let cachedAngularAppEngine;
    let angularSsrInternalMiddleware;
    // Load the compiler because `@angular/ssr/node` depends on `@angular/` packages,
    // which must be processed by the runtime linker, even if they are not used.
    await (0, load_esm_1.loadEsmModule)('@angular/compiler');
    const { createWebRequestFromNodeRequest, writeResponseToNodeResponse } = await (0, load_esm_1.loadEsmModule)('@angular/ssr/node');
    return function angularSsrExternalMiddleware(req, res, next) {
        (async () => {
            const { reqHandler, AngularAppEngine } = (await server.ssrLoadModule('./server.mjs'));
            if (!(0, utils_1.isSsrNodeRequestHandler)(reqHandler) && !(0, utils_1.isSsrRequestHandler)(reqHandler)) {
                if (!fallbackWarningShown) {
                    // eslint-disable-next-line no-console
                    console.warn(`The 'reqHandler' export in 'server.ts' is either undefined or does not provide a recognized request handler. ` +
                        'Using the internal SSR middleware instead.');
                    fallbackWarningShown = true;
                }
                angularSsrInternalMiddleware ??= createAngularSsrInternalMiddleware(server, indexHtmlTransformer);
                angularSsrInternalMiddleware(req, res, next);
                return;
            }
            if (cachedAngularAppEngine !== AngularAppEngine) {
                AngularAppEngine.ɵallowStaticRouteRender = true;
                AngularAppEngine.ɵhooks.on('html:transform:pre', async ({ html, url }) => {
                    const processedHtml = await server.transformIndexHtml(url.pathname, html);
                    return indexHtmlTransformer?.(processedHtml) ?? processedHtml;
                });
                cachedAngularAppEngine = AngularAppEngine;
            }
            // Forward the request to the middleware in server.ts
            if ((0, utils_1.isSsrNodeRequestHandler)(reqHandler)) {
                await reqHandler(req, res, next);
            }
            else {
                const webRes = await reqHandler(createWebRequestFromNodeRequest(req));
                if (!webRes) {
                    next();
                    return;
                }
                await writeResponseToNodeResponse(webRes, res);
            }
        })().catch(next);
    };
}
