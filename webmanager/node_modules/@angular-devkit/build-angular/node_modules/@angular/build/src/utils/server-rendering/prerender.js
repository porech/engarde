"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.prerenderPages = prerenderPages;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const schema_1 = require("../../builders/application/schema");
const bundler_context_1 = require("../../tools/esbuild/bundler-context");
const error_1 = require("../error");
const path_1 = require("../path");
const url_1 = require("../url");
const worker_pool_1 = require("../worker-pool");
const utils_1 = require("./esm-in-memory-loader/utils");
const manifest_1 = require("./manifest");
const models_1 = require("./models");
async function prerenderPages(workspaceRoot, baseHref, appShellOptions, prerenderOptions, outputFiles, assets, outputMode, sourcemap = false, maxThreads = 1) {
    const outputFilesForWorker = {};
    const serverBundlesSourceMaps = new Map();
    const warnings = [];
    const errors = [];
    for (const { text, path, type } of outputFiles) {
        if (type !== bundler_context_1.BuildOutputFileType.ServerApplication && type !== bundler_context_1.BuildOutputFileType.ServerRoot) {
            continue;
        }
        // Contains the server runnable application code
        if ((0, node_path_1.extname)(path) === '.map') {
            serverBundlesSourceMaps.set(path.slice(0, -4), text);
        }
        else {
            outputFilesForWorker[path] = text;
        }
    }
    // Inline sourcemap into JS file. This is needed to make Node.js resolve sourcemaps
    // when using `--enable-source-maps` when using in memory files.
    for (const [filePath, map] of serverBundlesSourceMaps) {
        const jsContent = outputFilesForWorker[filePath];
        if (jsContent) {
            outputFilesForWorker[filePath] =
                jsContent +
                    `\n//# sourceMappingURL=` +
                    `data:application/json;base64,${Buffer.from(map).toString('base64')}`;
        }
    }
    serverBundlesSourceMaps.clear();
    const assetsReversed = {};
    for (const { source, destination } of assets) {
        assetsReversed[addLeadingSlash((0, path_1.toPosixPath)(destination))] = source;
    }
    // Get routes to prerender
    const { errors: extractionErrors, serializedRouteTree: serializableRouteTreeNode, appShellRoute, } = await getAllRoutes(workspaceRoot, baseHref, outputFilesForWorker, assetsReversed, appShellOptions, prerenderOptions, sourcemap, outputMode).catch((err) => {
        return {
            errors: [`An error occurred while extracting routes.\n\n${err.message ?? err.stack ?? err}`],
            serializedRouteTree: [],
            appShellRoute: undefined,
        };
    });
    errors.push(...extractionErrors);
    const serializableRouteTreeNodeForPrerender = [];
    for (const metadata of serializableRouteTreeNode) {
        if (outputMode !== schema_1.OutputMode.Static && metadata.redirectTo) {
            // Skip redirects if output mode is not static.
            continue;
        }
        if (metadata.route.includes('*')) {
            // Skip catch all routes from prerender.
            continue;
        }
        switch (metadata.renderMode) {
            case undefined: /* Legacy building mode */
            case models_1.RouteRenderMode.Prerender:
                serializableRouteTreeNodeForPrerender.push(metadata);
                break;
            case models_1.RouteRenderMode.Server:
                if (outputMode === schema_1.OutputMode.Static) {
                    errors.push(`Route '${metadata.route}' is configured with server render mode, but the build 'outputMode' is set to 'static'.`);
                }
                break;
        }
    }
    if (!serializableRouteTreeNodeForPrerender.length || errors.length > 0) {
        return {
            errors,
            warnings,
            output: {},
            serializableRouteTreeNode,
        };
    }
    // Add the extracted routes to the manifest file.
    // We could re-generate it from the start, but that would require a number of options to be passed down.
    const manifest = outputFilesForWorker[manifest_1.SERVER_APP_MANIFEST_FILENAME];
    if (manifest) {
        outputFilesForWorker[manifest_1.SERVER_APP_MANIFEST_FILENAME] = manifest.replace('routes: undefined,', `routes: ${JSON.stringify(serializableRouteTreeNodeForPrerender, undefined, 2)},`);
    }
    // Render routes
    const { errors: renderingErrors, output } = await renderPages(baseHref, sourcemap, serializableRouteTreeNodeForPrerender, maxThreads, workspaceRoot, outputFilesForWorker, assetsReversed, outputMode, appShellRoute ?? appShellOptions?.route);
    errors.push(...renderingErrors);
    return {
        errors,
        warnings,
        output,
        serializableRouteTreeNode,
    };
}
async function renderPages(baseHref, sourcemap, serializableRouteTreeNode, maxThreads, workspaceRoot, outputFilesForWorker, assetFilesForWorker, outputMode, appShellRoute) {
    const output = {};
    const errors = [];
    const workerExecArgv = [utils_1.IMPORT_EXEC_ARGV];
    if (sourcemap) {
        workerExecArgv.push('--enable-source-maps');
    }
    const renderWorker = new worker_pool_1.WorkerPool({
        filename: require.resolve('./render-worker'),
        maxThreads: Math.min(serializableRouteTreeNode.length, maxThreads),
        workerData: {
            workspaceRoot,
            outputFiles: outputFilesForWorker,
            assetFiles: assetFilesForWorker,
            outputMode,
            hasSsrEntry: !!outputFilesForWorker['server.mjs'],
        },
        execArgv: workerExecArgv,
    });
    try {
        const renderingPromises = [];
        const appShellRouteWithLeadingSlash = appShellRoute && addLeadingSlash(appShellRoute);
        const baseHrefPathnameWithLeadingSlash = new URL(baseHref, 'http://localhost').pathname;
        for (const { route, redirectTo } of serializableRouteTreeNode) {
            // Remove the base href from the file output path.
            const routeWithoutBaseHref = addTrailingSlash(route).startsWith(baseHrefPathnameWithLeadingSlash)
                ? addLeadingSlash(route.slice(baseHrefPathnameWithLeadingSlash.length))
                : route;
            const outPath = node_path_1.posix.join(removeLeadingSlash(routeWithoutBaseHref), 'index.html');
            if (typeof redirectTo === 'string') {
                output[outPath] = { content: generateRedirectStaticPage(redirectTo), appShellRoute: false };
                continue;
            }
            const render = renderWorker.run({ url: route });
            const renderResult = render
                .then((content) => {
                if (content !== null) {
                    output[outPath] = {
                        content,
                        appShellRoute: appShellRouteWithLeadingSlash === routeWithoutBaseHref,
                    };
                }
            })
                .catch((err) => {
                errors.push(`An error occurred while prerendering route '${route}'.\n\n${err.message ?? err.stack ?? err.code ?? err}`);
                void renderWorker.destroy();
            });
            renderingPromises.push(renderResult);
        }
        await Promise.all(renderingPromises);
    }
    finally {
        void renderWorker.destroy();
    }
    return {
        errors,
        output,
    };
}
async function getAllRoutes(workspaceRoot, baseHref, outputFilesForWorker, assetFilesForWorker, appShellOptions, prerenderOptions, sourcemap, outputMode) {
    const { routesFile, discoverRoutes } = prerenderOptions ?? {};
    const routes = [];
    let appShellRoute;
    if (appShellOptions) {
        appShellRoute = (0, url_1.urlJoin)(baseHref, appShellOptions.route);
        routes.push({
            renderMode: models_1.RouteRenderMode.Prerender,
            route: appShellRoute,
        });
    }
    if (routesFile) {
        const routesFromFile = (await (0, promises_1.readFile)(routesFile, 'utf8')).split(/\r?\n/);
        for (const route of routesFromFile) {
            routes.push({
                renderMode: models_1.RouteRenderMode.Prerender,
                route: (0, url_1.urlJoin)(baseHref, route.trim()),
            });
        }
    }
    if (!discoverRoutes) {
        return { errors: [], appShellRoute, serializedRouteTree: routes };
    }
    const workerExecArgv = [utils_1.IMPORT_EXEC_ARGV];
    if (sourcemap) {
        workerExecArgv.push('--enable-source-maps');
    }
    const renderWorker = new worker_pool_1.WorkerPool({
        filename: require.resolve('./routes-extractor-worker'),
        maxThreads: 1,
        workerData: {
            workspaceRoot,
            outputFiles: outputFilesForWorker,
            assetFiles: assetFilesForWorker,
            outputMode,
            hasSsrEntry: !!outputFilesForWorker['server.mjs'],
        },
        execArgv: workerExecArgv,
    });
    try {
        const { serializedRouteTree, appShellRoute, errors } = await renderWorker.run({});
        if (!routes.length) {
            return { errors, appShellRoute, serializedRouteTree };
        }
        // Merge the routing trees
        const uniqueRoutes = new Map();
        for (const item of [...routes, ...serializedRouteTree]) {
            if (!uniqueRoutes.has(item.route)) {
                uniqueRoutes.set(item.route, item);
            }
        }
        return { errors, serializedRouteTree: Array.from(uniqueRoutes.values()) };
    }
    catch (err) {
        (0, error_1.assertIsError)(err);
        return {
            errors: [
                `An error occurred while extracting routes.\n\n${err.message ?? err.stack ?? err.code ?? err}`,
            ],
            serializedRouteTree: [],
        };
    }
    finally {
        void renderWorker.destroy();
    }
}
function addLeadingSlash(value) {
    return value[0] === '/' ? value : '/' + value;
}
function addTrailingSlash(url) {
    return url[url.length - 1] === '/' ? url : `${url}/`;
}
function removeLeadingSlash(value) {
    return value[0] === '/' ? value.slice(1) : value;
}
/**
 * Generates a static HTML page with a meta refresh tag to redirect the user to a specified URL.
 *
 * This function creates a simple HTML page that performs a redirect using a meta tag.
 * It includes a fallback link in case the meta-refresh doesn't work.
 *
 * @param url - The URL to which the page should redirect.
 * @returns The HTML content of the static redirect page.
 */
function generateRedirectStaticPage(url) {
    return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting</title>
    <meta http-equiv="refresh" content="0; url=${url}">
  </head>
  <body>
    <pre>Redirecting to <a href="${url}">${url}</a></pre>
  </body>
</html>
`.trim();
}
