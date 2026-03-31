"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerSsrMode = void 0;
exports.createAngularSetupMiddlewaresPlugin = createAngularSetupMiddlewaresPlugin;
const load_esm_1 = require("../../../utils/load-esm");
const middlewares_1 = require("../middlewares");
var ServerSsrMode;
(function (ServerSsrMode) {
    /**
     * No SSR
     */
    ServerSsrMode[ServerSsrMode["NoSsr"] = 0] = "NoSsr";
    /**
     * Internal server-side rendering (SSR) is handled through the built-in middleware.
     *
     * In this mode, the SSR process is managed internally by the dev-server's middleware.
     * The server automatically renders pages on the server without requiring external
     * middleware or additional configuration from the developer.
     */
    ServerSsrMode[ServerSsrMode["InternalSsrMiddleware"] = 1] = "InternalSsrMiddleware";
    /**
     * External server-side rendering (SSR) is handled by a custom middleware defined in server.ts.
     *
     * This mode allows developers to define custom SSR behavior by providing a middleware in the
     * `server.ts` file. It gives more flexibility for handling SSR, such as integrating with other
     * frameworks or customizing the rendering pipeline.
     */
    ServerSsrMode[ServerSsrMode["ExternalSsrMiddleware"] = 2] = "ExternalSsrMiddleware";
})(ServerSsrMode || (exports.ServerSsrMode = ServerSsrMode = {}));
async function createEncapsulateStyle() {
    const { encapsulateStyle } = await (0, load_esm_1.loadEsmModule)('@angular/compiler');
    const decoder = new TextDecoder('utf-8');
    return (style, componentId) => {
        return encapsulateStyle(decoder.decode(style), componentId);
    };
}
function createAngularSetupMiddlewaresPlugin(options) {
    return {
        name: 'vite:angular-setup-middlewares',
        enforce: 'pre',
        async configureServer(server) {
            const { indexHtmlTransformer, outputFiles, extensionMiddleware, assets, componentStyles, templateUpdates, ssrMode, resetComponentUpdates, } = options;
            // Headers, assets and resources get handled first
            server.middlewares.use((0, middlewares_1.createAngularHeadersMiddleware)(server));
            server.middlewares.use((0, middlewares_1.createAngularComponentMiddleware)(server, templateUpdates));
            server.middlewares.use((0, middlewares_1.createAngularAssetsMiddleware)(server, assets, outputFiles, componentStyles, await createEncapsulateStyle()));
            server.middlewares.use((0, middlewares_1.createChromeDevtoolsMiddleware)(server.config.cacheDir, options.projectRoot));
            extensionMiddleware?.forEach((middleware) => server.middlewares.use(middleware));
            // Returning a function, installs middleware after the main transform middleware but
            // before the built-in HTML middleware
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            return async () => {
                if (ssrMode === ServerSsrMode.ExternalSsrMiddleware) {
                    server.middlewares.use(await (0, middlewares_1.createAngularSsrExternalMiddleware)(server, indexHtmlTransformer));
                    return;
                }
                if (ssrMode === ServerSsrMode.InternalSsrMiddleware) {
                    server.middlewares.use((0, middlewares_1.createAngularSsrInternalMiddleware)(server, indexHtmlTransformer));
                }
                server.middlewares.use(middlewares_1.angularHtmlFallbackMiddleware);
                server.middlewares.use((0, middlewares_1.createAngularIndexHtmlMiddleware)(server, outputFiles, resetComponentUpdates, indexHtmlTransformer));
            };
        },
    };
}
