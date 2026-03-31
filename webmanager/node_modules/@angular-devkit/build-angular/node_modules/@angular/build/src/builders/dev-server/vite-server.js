"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveWithVite = serveWithVite;
exports.setupServer = setupServer;
const node_assert_1 = __importDefault(require("node:assert"));
const promises_1 = require("node:fs/promises");
const node_module_1 = require("node:module");
const node_path_1 = require("node:path");
const plugins_1 = require("../../tools/vite/plugins");
const utils_1 = require("../../tools/vite/utils");
const utils_2 = require("../../utils");
const environment_options_1 = require("../../utils/environment-options");
const load_esm_1 = require("../../utils/load-esm");
const results_1 = require("../application/results");
const schema_1 = require("../application/schema");
const internal_1 = require("./internal");
/**
 * Build options that are also present on the dev server but are only passed
 * to the build.
 */
const CONVENIENCE_BUILD_OPTIONS = ['watch', 'poll', 'verbose'];
// eslint-disable-next-line max-lines-per-function
async function* serveWithVite(serverOptions, builderName, builderAction, context, transformers, extensions) {
    // Get the browser configuration from the target name.
    const rawBrowserOptions = await context.getTargetOptions(serverOptions.buildTarget);
    // Deploy url is not used in the dev-server.
    delete rawBrowserOptions.deployUrl;
    // Copy convenience options to build
    for (const optionName of CONVENIENCE_BUILD_OPTIONS) {
        const optionValue = serverOptions[optionName];
        if (optionValue !== undefined) {
            rawBrowserOptions[optionName] = optionValue;
        }
    }
    // TODO: Adjust architect to not force a JsonObject derived return type
    const browserOptions = (await context.validateOptions(rawBrowserOptions, builderName));
    if (browserOptions.prerender || (browserOptions.outputMode && browserOptions.server)) {
        // Disable prerendering if enabled and force SSR.
        // This is so instead of prerendering all the routes for every change, the page is "prerendered" when it is requested.
        browserOptions.prerender = undefined;
        browserOptions.ssr ||= true;
    }
    // Disable auto CSP.
    browserOptions.security = {
        autoCsp: false,
    };
    // Disable JSON build stats.
    // These are not accessible with the dev server and can cause HMR fallbacks.
    if (browserOptions.statsJson === true) {
        context.logger.warn('Build JSON statistics output (`statsJson` option) has been disabled.' +
            ' The development server does not support this option.');
    }
    browserOptions.statsJson = false;
    // Set all packages as external to support Vite's prebundle caching
    browserOptions.externalPackages = serverOptions.prebundle;
    // Disable generating a full manifest with routes.
    // This is done during runtime when using the dev-server.
    browserOptions.partialSSRBuild = true;
    // The development server currently only supports a single locale when localizing.
    // This matches the behavior of the Webpack-based development server but could be expanded in the future.
    if (browserOptions.localize === true ||
        (Array.isArray(browserOptions.localize) && browserOptions.localize.length > 1)) {
        context.logger.warn('Localization (`localize` option) has been disabled. The development server only supports localizing a single locale per build.');
        browserOptions.localize = false;
    }
    else if (browserOptions.localize) {
        // When localization is enabled with a single locale, force a flat path to maintain behavior with the existing Webpack-based dev server.
        browserOptions.forceI18nFlatOutput = true;
    }
    const { vendor: thirdPartySourcemaps, scripts: scriptsSourcemaps } = (0, utils_2.normalizeSourceMaps)(browserOptions.sourceMap ?? false);
    if (scriptsSourcemaps && browserOptions.server) {
        // https://nodejs.org/api/process.html#processsetsourcemapsenabledval
        process.setSourceMapsEnabled(true);
    }
    if (serverOptions.hmr &&
        (browserOptions.outputHashing === schema_1.OutputHashing.All ||
            browserOptions.outputHashing === schema_1.OutputHashing.Bundles)) {
        serverOptions.hmr = false;
        context.logger.warn(`Hot Module Replacement (HMR) is disabled because the 'outputHashing' option is set to '${browserOptions.outputHashing}'. ` +
            'HMR is incompatible with this setting.');
    }
    const componentsHmrCanBeUsed = browserOptions.aot && serverOptions.liveReload && serverOptions.hmr;
    // Enable to support link-based component style hot reloading (`NG_HMR_CSTYLES=1` can be used to enable)
    browserOptions.externalRuntimeStyles = componentsHmrCanBeUsed && environment_options_1.useComponentStyleHmr;
    // Enable to support component template hot replacement (`NG_HMR_TEMPLATE=0` can be used to disable selectively)
    // This will also replace file-based/inline styles as code if external runtime styles are not enabled.
    browserOptions.templateUpdates = componentsHmrCanBeUsed && environment_options_1.useComponentTemplateHmr;
    browserOptions.incrementalResults = true;
    // Setup the prebundling transformer that will be shared across Vite prebundling requests
    const prebundleTransformer = new internal_1.JavaScriptTransformer(
    // Always enable JIT linking to support applications built with and without AOT.
    // In a development environment the additional scope information does not
    // have a negative effect unlike production where final output size is relevant.
    { sourcemap: true, jit: true, thirdPartySourcemaps }, 1);
    // The index HTML path will be updated from the build results if provided by the builder
    let htmlIndexPath = 'index.html';
    // dynamically import Vite for ESM compatibility
    const { createServer, normalizePath } = await (0, load_esm_1.loadEsmModule)('vite');
    let server;
    let serverUrl;
    let hadError = false;
    const generatedFiles = new Map();
    const assetFiles = new Map();
    const externalMetadata = {
        implicitBrowser: [],
        implicitServer: [],
        explicitBrowser: [],
        explicitServer: [],
    };
    const componentStyles = new Map();
    const templateUpdates = new Map();
    // Add cleanup logic via a builder teardown.
    let deferred;
    context.addTeardown(async () => {
        await server?.close();
        await prebundleTransformer.close();
        deferred?.();
    });
    // TODO: Switch this to an architect schedule call when infrastructure settings are supported
    for await (const result of builderAction(browserOptions, context, extensions?.buildPlugins)) {
        if (result.kind === results_1.ResultKind.Failure) {
            if (result.errors.length && server) {
                hadError = true;
                server.ws.send({
                    type: 'error',
                    err: {
                        message: result.errors[0].text,
                        stack: '',
                        loc: result.errors[0].location ?? undefined,
                    },
                });
            }
            yield { baseUrl: '', success: false };
            continue;
        }
        // Clear existing error overlay on successful result
        if (hadError && server) {
            hadError = false;
            // Send an empty update to clear the error overlay
            server.ws.send({
                'type': 'update',
                updates: [],
            });
        }
        let needClientUpdate = true;
        switch (result.kind) {
            case results_1.ResultKind.Full:
                if (result.detail?.['htmlIndexPath']) {
                    htmlIndexPath = result.detail['htmlIndexPath'];
                }
                if (serverOptions.servePath === undefined && result.detail?.['htmlBaseHref']) {
                    const baseHref = result.detail['htmlBaseHref'];
                    // Remove trailing slash
                    serverOptions.servePath =
                        baseHref !== './' && baseHref[baseHref.length - 1] === '/'
                            ? baseHref.slice(0, -1)
                            : baseHref;
                }
                assetFiles.clear();
                componentStyles.clear();
                generatedFiles.clear();
                for (const [outputPath, file] of Object.entries(result.files)) {
                    updateResultRecord(outputPath, file, normalizePath, htmlIndexPath, generatedFiles, assetFiles, componentStyles, 
                    // The initial build will not yet have a server setup
                    !server);
                }
                // Clear stale template updates on code rebuilds
                templateUpdates.clear();
                break;
            case results_1.ResultKind.Incremental:
                (0, node_assert_1.default)(server, 'Builder must provide an initial full build before incremental results.');
                // Background updates should only update server files/options
                needClientUpdate = !result.background;
                for (const removed of result.removed) {
                    const filePath = '/' + normalizePath(removed.path);
                    generatedFiles.delete(filePath);
                    assetFiles.delete(filePath);
                }
                for (const modified of result.modified) {
                    updateResultRecord(modified, result.files[modified], normalizePath, htmlIndexPath, generatedFiles, assetFiles, componentStyles);
                }
                for (const added of result.added) {
                    updateResultRecord(added, result.files[added], normalizePath, htmlIndexPath, generatedFiles, assetFiles, componentStyles);
                }
                break;
            case results_1.ResultKind.ComponentUpdate:
                (0, node_assert_1.default)(serverOptions.hmr, 'Component updates are only supported with HMR enabled.');
                (0, node_assert_1.default)(server, 'Builder must provide an initial full build before component update results.');
                for (const componentUpdate of result.updates) {
                    if (componentUpdate.type === 'template') {
                        templateUpdates.set(componentUpdate.id, componentUpdate.content);
                        server.ws.send('angular:component-update', {
                            id: componentUpdate.id,
                            timestamp: Date.now(),
                        });
                    }
                }
                context.logger.info('Component update sent to client(s).');
                continue;
            default:
                context.logger.warn(`Unknown result kind [${result.kind}] provided by build.`);
                continue;
        }
        // To avoid disconnecting the array objects from the option, these arrays need to be mutated instead of replaced.
        if (result.detail?.['externalMetadata']) {
            const { implicitBrowser, implicitServer, explicit } = result.detail['externalMetadata'];
            const implicitServerFiltered = implicitServer.filter((m) => !(0, node_module_1.isBuiltin)(m) && !isAbsoluteUrl(m));
            const implicitBrowserFiltered = implicitBrowser.filter((m) => !isAbsoluteUrl(m));
            // Empty Arrays to avoid growing unlimited with every re-build.
            externalMetadata.explicitBrowser.length = 0;
            externalMetadata.explicitServer.length = 0;
            externalMetadata.implicitServer.length = 0;
            externalMetadata.implicitBrowser.length = 0;
            const externalDeps = browserOptions.externalDependencies ?? [];
            externalMetadata.explicitBrowser.push(...explicit, ...externalDeps);
            externalMetadata.explicitServer.push(...explicit, ...externalDeps, ...node_module_1.builtinModules);
            externalMetadata.implicitServer.push(...implicitServerFiltered);
            externalMetadata.implicitBrowser.push(...implicitBrowserFiltered);
            // The below needs to be sorted as Vite uses these options are part of the hashing invalidation algorithm.
            // See: https://github.com/vitejs/vite/blob/0873bae0cfe0f0718ad2f5743dd34a17e4ab563d/packages/vite/src/node/optimizer/index.ts#L1203-L1239
            externalMetadata.explicitBrowser.sort();
            externalMetadata.explicitServer.sort();
            externalMetadata.implicitServer.sort();
            externalMetadata.implicitBrowser.sort();
        }
        if (server) {
            // Update fs allow list to include any new assets from the build option.
            server.config.server.fs.allow = [
                ...new Set([
                    ...server.config.server.fs.allow,
                    ...[...assetFiles.values()].map(({ source }) => source),
                ]),
            ];
            const updatedFiles = await invalidateUpdatedFiles(normalizePath, generatedFiles, assetFiles, server);
            if (needClientUpdate) {
                handleUpdate(server, serverOptions, context.logger, componentStyles, updatedFiles);
            }
        }
        else {
            const projectName = context.target?.project;
            if (!projectName) {
                throw new Error('The builder requires a target.');
            }
            context.logger.info('NOTE: Raw file sizes do not reflect development server per-request transformations.');
            if (browserOptions.ssr && serverOptions.inspect) {
                const { host, port } = serverOptions.inspect;
                const { default: inspector } = await Promise.resolve().then(() => __importStar(require('node:inspector')));
                inspector.open(port, host, true);
                context.addTeardown(() => inspector.close());
            }
            const { root = '' } = await context.getProjectMetadata(projectName);
            const projectRoot = (0, node_path_1.join)(context.workspaceRoot, root);
            const browsers = (0, internal_1.getSupportedBrowsers)(projectRoot, context.logger);
            const target = (0, internal_1.transformSupportedBrowsersToTargets)(browsers);
            // Needed for browser-esbuild as polyfills can be a string.
            const polyfills = Array.isArray((browserOptions.polyfills ??= []))
                ? browserOptions.polyfills
                : [browserOptions.polyfills];
            let ssrMode = plugins_1.ServerSsrMode.NoSsr;
            if (browserOptions.outputMode &&
                typeof browserOptions.ssr === 'object' &&
                browserOptions.ssr.entry) {
                ssrMode = plugins_1.ServerSsrMode.ExternalSsrMiddleware;
            }
            else if (browserOptions.ssr) {
                ssrMode = plugins_1.ServerSsrMode.InternalSsrMiddleware;
            }
            if (browserOptions.progress !== false && ssrMode !== plugins_1.ServerSsrMode.NoSsr) {
                // This is a workaround for https://github.com/angular/angular-cli/issues/28336, which is caused by the interaction between `zone.js` and `listr2`.
                process.once('SIGINT', () => {
                    process.kill(process.pid);
                });
            }
            // Setup server and start listening
            const serverConfiguration = await setupServer(serverOptions, generatedFiles, assetFiles, browserOptions.preserveSymlinks, externalMetadata, ssrMode, prebundleTransformer, target, (0, internal_1.isZonelessApp)(polyfills), componentStyles, templateUpdates, browserOptions.loader, {
                ...browserOptions.define,
                'ngJitMode': browserOptions.aot ? 'false' : 'true',
                'ngHmrMode': browserOptions.templateUpdates ? 'true' : 'false',
            }, extensions?.middleware, transformers?.indexHtml, thirdPartySourcemaps);
            server = await createServer(serverConfiguration);
            await server.listen();
            // Setup builder context logging for browser clients
            server.hot.on('angular:log', (data) => {
                if (typeof data?.text !== 'string') {
                    context.logger.warn('Development server client sent invalid internal log event.');
                }
                switch (data.kind) {
                    case 'error':
                        context.logger.error(`[CLIENT ERROR]: ${data.text}`);
                        break;
                    case 'warning':
                        context.logger.warn(`[CLIENT WARNING]: ${data.text}`);
                        break;
                    default:
                        context.logger.info(`[CLIENT INFO]: ${data.text}`);
                        break;
                }
            });
            // Setup component HMR invalidation
            // Invalidation occurs when the runtime cannot update a component
            server.hot.on('angular:invalidate', (data) => {
                if (typeof data?.id !== 'string') {
                    context.logger.warn('Development server client sent invalid internal invalidate event.');
                }
                // Clear invalid template update
                templateUpdates.delete(data.id);
                // Some cases are expected unsupported update scenarios but some may be errors.
                // If an error occurred, log the error in addition to the invalidation.
                if (data.error) {
                    context.logger.error(`Component update failed${data.message ? `: ${data.message}` : '.'}` +
                        '\nPlease consider reporting the error at https://github.com/angular/angular-cli/issues');
                }
                else {
                    context.logger.warn(`Component update unsupported${data.message ? `: ${data.message}` : '.'}`);
                }
                server?.ws.send({
                    type: 'full-reload',
                    path: '*',
                });
                context.logger.info('Page reload sent to client(s).');
            });
            const urls = server.resolvedUrls;
            if (urls && (urls.local.length || urls.network.length)) {
                serverUrl = new URL(urls.local[0] ?? urls.network[0]);
            }
            // log connection information
            server.printUrls();
            server.bindCLIShortcuts({
                print: true,
                customShortcuts: [
                    {
                        key: 'r',
                        description: 'force reload browser',
                        action(server) {
                            componentStyles.forEach((record) => record.used?.clear());
                            server.ws.send({
                                type: 'full-reload',
                                path: '*',
                            });
                        },
                    },
                ],
            });
        }
        // TODO: adjust output typings to reflect both development servers
        yield {
            success: true,
            port: serverUrl?.port,
            baseUrl: serverUrl?.href,
        };
    }
    await new Promise((resolve) => (deferred = resolve));
}
/**
 * Invalidates any updated asset or generated files and resets their `updated` state.
 * This function also clears the server application cache when necessary.
 *
 * @returns A list of files that were updated and invalidated.
 */
async function invalidateUpdatedFiles(normalizePath, generatedFiles, assetFiles, server) {
    const updatedFiles = [];
    // Invalidate any updated asset
    for (const [file, record] of assetFiles) {
        if (!record.updated) {
            continue;
        }
        record.updated = false;
        updatedFiles.push(file);
    }
    // Invalidate any updated files
    let serverApplicationChanged = false;
    for (const [file, record] of generatedFiles) {
        if (!record.updated) {
            continue;
        }
        record.updated = false;
        updatedFiles.push(file);
        serverApplicationChanged ||= record.type === internal_1.BuildOutputFileType.ServerApplication;
        const updatedModules = server.moduleGraph.getModulesByFile(normalizePath((0, node_path_1.join)(server.config.root, file)));
        updatedModules?.forEach((m) => server.moduleGraph.invalidateModule(m));
    }
    if (serverApplicationChanged) {
        // Clear the server app cache and
        // trigger module evaluation before reload to initiate dependency optimization.
        const { ɵdestroyAngularServerApp } = (await server.ssrLoadModule('/main.server.mjs'));
        ɵdestroyAngularServerApp();
    }
    return updatedFiles;
}
/**
 * Handles updates for the client by sending HMR or full page reload commands
 * based on the updated files. It also ensures proper tracking of component styles and determines if
 * a full reload is needed.
 */
function handleUpdate(server, serverOptions, logger, componentStyles, updatedFiles) {
    if (!updatedFiles.length) {
        return;
    }
    if (serverOptions.hmr) {
        if (updatedFiles.every((f) => f.endsWith('.css'))) {
            let requiresReload = false;
            const timestamp = Date.now();
            const updates = updatedFiles.flatMap((filePath) => {
                // For component styles, an HMR update must be sent for each one with the corresponding
                // component identifier search parameter (`ngcomp`). The Vite client code will not keep
                // the existing search parameters when it performs an update and each one must be
                // specified explicitly. Typically, there is only one each though as specific style files
                // are not typically reused across components.
                const record = componentStyles.get(filePath);
                if (record) {
                    if (record.reload) {
                        // Shadow DOM components currently require a full reload.
                        // Vite's CSS hot replacement does not support shadow root searching.
                        requiresReload = true;
                        return [];
                    }
                    return Array.from(record.used ?? []).map((id) => {
                        return {
                            type: 'css-update',
                            timestamp,
                            path: `${filePath}?ngcomp` + (typeof id === 'string' ? `=${id}` : ''),
                            acceptedPath: filePath,
                        };
                    });
                }
                return {
                    type: 'css-update',
                    timestamp,
                    path: filePath,
                    acceptedPath: filePath,
                };
            });
            if (!requiresReload) {
                server.ws.send({
                    type: 'update',
                    updates,
                });
                logger.info('Stylesheet update sent to client(s).');
                return;
            }
        }
    }
    // Send reload command to clients
    if (serverOptions.liveReload) {
        // Clear used component tracking on full reload
        componentStyles.forEach((record) => record.used?.clear());
        server.ws.send({
            type: 'full-reload',
            path: '*',
        });
        logger.info('Page reload sent to client(s).');
    }
}
function updateResultRecord(outputPath, file, normalizePath, htmlIndexPath, generatedFiles, assetFiles, componentStyles, initial = false) {
    if (file.origin === 'disk') {
        assetFiles.set('/' + normalizePath(outputPath), {
            source: normalizePath(file.inputPath),
            updated: !initial,
        });
        return;
    }
    let filePath;
    if (outputPath === htmlIndexPath) {
        // Convert custom index output path to standard index path for dev-server usage.
        // This mimics the Webpack dev-server behavior.
        filePath = '/index.html';
    }
    else {
        filePath = '/' + normalizePath(outputPath);
    }
    const servable = file.type === internal_1.BuildOutputFileType.Browser || file.type === internal_1.BuildOutputFileType.Media;
    // Skip analysis of sourcemaps
    if (filePath.endsWith('.map')) {
        generatedFiles.set(filePath, {
            contents: file.contents,
            servable,
            size: file.contents.byteLength,
            hash: file.hash,
            type: file.type,
            updated: false,
        });
        return;
    }
    // New or updated file
    generatedFiles.set(filePath, {
        contents: file.contents,
        size: file.contents.byteLength,
        hash: file.hash,
        // Consider the files updated except on the initial build result
        updated: !initial,
        type: file.type,
        servable,
    });
    // Record any external component styles
    if (filePath.endsWith('.css') && /^\/[a-f0-9]{64}\.css$/.test(filePath)) {
        const componentStyle = componentStyles.get(filePath);
        if (componentStyle) {
            componentStyle.rawContent = file.contents;
        }
        else {
            componentStyles.set(filePath, {
                rawContent: file.contents,
            });
        }
    }
}
// eslint-disable-next-line max-lines-per-function
async function setupServer(serverOptions, outputFiles, assets, preserveSymlinks, externalMetadata, ssrMode, prebundleTransformer, target, zoneless, componentStyles, templateUpdates, prebundleLoaderExtensions, define, extensionMiddleware, indexHtmlTransformer, thirdPartySourcemaps = false) {
    const proxy = await (0, utils_2.loadProxyConfiguration)(serverOptions.workspaceRoot, serverOptions.proxyConfig);
    // dynamically import Vite for ESM compatibility
    const { normalizePath } = await (0, load_esm_1.loadEsmModule)('vite');
    // Path will not exist on disk and only used to provide separate path for Vite requests
    const virtualProjectRoot = normalizePath((0, node_path_1.join)(serverOptions.workspaceRoot, `.angular/vite-root`, serverOptions.buildTarget.project));
    // Files used for SSR warmup.
    let ssrFiles;
    switch (ssrMode) {
        case plugins_1.ServerSsrMode.InternalSsrMiddleware:
            ssrFiles = ['./main.server.mjs'];
            break;
        case plugins_1.ServerSsrMode.ExternalSsrMiddleware:
            ssrFiles = ['./main.server.mjs', './server.mjs'];
            break;
    }
    /**
     * Required when using `externalDependencies` to prevent Vite load errors.
     *
     * @note Can be removed if Vite introduces native support for externals.
     * @note Vite misresolves browser modules in SSR when accessing URLs with multiple segments
     *       (e.g., 'foo/bar'), as they are not correctly re-based from the base href.
     */
    const preTransformRequests = externalMetadata.explicitBrowser.length === 0 && ssrMode === plugins_1.ServerSsrMode.NoSsr;
    const cacheDir = (0, node_path_1.join)(serverOptions.cacheOptions.path, serverOptions.buildTarget.project, 'vite');
    const configuration = {
        configFile: false,
        envFile: false,
        cacheDir,
        root: virtualProjectRoot,
        publicDir: false,
        esbuild: false,
        mode: 'development',
        // We use custom as we do not rely on Vite's htmlFallbackMiddleware and indexHtmlMiddleware.
        appType: 'custom',
        css: {
            devSourcemap: true,
        },
        // Ensure custom 'file' loader build option entries are handled by Vite in application code that
        // reference third-party libraries. Relative usage is handled directly by the build and not Vite.
        // Only 'file' loader entries are currently supported directly by Vite.
        assetsInclude: prebundleLoaderExtensions &&
            Object.entries(prebundleLoaderExtensions)
                .filter(([, value]) => value === 'file')
                // Create a file extension glob for each key
                .map(([key]) => '*' + key),
        // Vite will normalize the `base` option by adding a leading slash.
        base: serverOptions.servePath,
        resolve: {
            mainFields: ['es2020', 'browser', 'module', 'main'],
            preserveSymlinks,
        },
        dev: {
            preTransformRequests,
        },
        server: {
            preTransformRequests,
            warmup: {
                ssrFiles,
            },
            port: serverOptions.port,
            strictPort: true,
            host: serverOptions.host,
            open: serverOptions.open,
            allowedHosts: serverOptions.allowedHosts,
            headers: serverOptions.headers,
            // Disable the websocket if live reload is disabled (false/undefined are the only valid values)
            ws: serverOptions.liveReload === false && serverOptions.hmr === false ? false : undefined,
            // When server-side rendering (SSR) is enabled togather with SSL and Express is being used,
            // we must configure Vite to use HTTP/1.1.
            // This is necessary because Express does not support HTTP/2.
            // We achieve this by defining an empty proxy.
            // See: https://github.com/vitejs/vite/blob/c4b532cc900bf988073583511f57bd581755d5e3/packages/vite/src/node/http.ts#L106
            proxy: serverOptions.ssl && ssrMode === plugins_1.ServerSsrMode.ExternalSsrMiddleware
                ? (proxy ?? {})
                : proxy,
            cors: {
                // This will add the header `Access-Control-Allow-Origin: http://example.com`,
                // where `http://example.com` is the requesting origin.
                origin: true,
                // Allow preflight requests to be proxied.
                preflightContinue: true,
            },
            // File watching is handled by the build directly. `null` disables file watching for Vite.
            watch: null,
            fs: {
                // Ensure cache directory, node modules, and all assets are accessible by the client.
                // The first two are required for Vite to function in prebundling mode (the default) and to load
                // the Vite client-side code for browser reloading. These would be available by default but when
                // the `allow` option is explicitly configured, they must be included manually.
                allow: [
                    cacheDir,
                    (0, node_path_1.join)(serverOptions.workspaceRoot, 'node_modules'),
                    ...[...assets.values()].map(({ source }) => source),
                ],
            },
        },
        ssr: {
            // Note: `true` and `/.*/` have different sematics. When true, the `external` option is ignored.
            noExternal: /.*/,
            // Exclude any Node.js built in module and provided dependencies (currently build defined externals)
            external: externalMetadata.explicitServer,
            optimizeDeps: (0, utils_1.getDepOptimizationConfig)({
                // Only enable with caching since it causes prebundle dependencies to be cached
                disabled: serverOptions.prebundle === false,
                // Exclude any explicitly defined dependencies (currently build defined externals and node.js built-ins)
                exclude: externalMetadata.explicitServer,
                // Include all implict dependencies from the external packages internal option
                include: externalMetadata.implicitServer,
                ssr: true,
                prebundleTransformer,
                zoneless,
                target,
                loader: prebundleLoaderExtensions,
                thirdPartySourcemaps,
                define,
            }),
        },
        plugins: [
            (0, plugins_1.createAngularSetupMiddlewaresPlugin)({
                outputFiles,
                assets,
                indexHtmlTransformer,
                extensionMiddleware,
                componentStyles,
                templateUpdates,
                ssrMode,
                resetComponentUpdates: () => templateUpdates.clear(),
                projectRoot: serverOptions.projectRoot,
            }),
            (0, plugins_1.createRemoveIdPrefixPlugin)(externalMetadata.explicitBrowser),
            await (0, plugins_1.createAngularSsrTransformPlugin)(serverOptions.workspaceRoot),
            await (0, plugins_1.createAngularMemoryPlugin)({
                virtualProjectRoot,
                outputFiles,
                templateUpdates,
                external: externalMetadata.explicitBrowser,
                disableViteTransport: !serverOptions.liveReload,
            }),
        ],
        // Browser only optimizeDeps. (This does not run for SSR dependencies).
        optimizeDeps: (0, utils_1.getDepOptimizationConfig)({
            // Only enable with caching since it causes prebundle dependencies to be cached
            disabled: serverOptions.prebundle === false,
            // Exclude any explicitly defined dependencies (currently build defined externals)
            exclude: externalMetadata.explicitBrowser,
            // Include all implict dependencies from the external packages internal option
            include: externalMetadata.implicitBrowser,
            ssr: false,
            prebundleTransformer,
            target,
            zoneless,
            loader: prebundleLoaderExtensions,
            thirdPartySourcemaps,
            define,
        }),
    };
    if (serverOptions.ssl) {
        if (serverOptions.sslCert && serverOptions.sslKey) {
            configuration.server ??= {};
            // server configuration is defined above
            configuration.server.https = {
                cert: await (0, promises_1.readFile)(serverOptions.sslCert),
                key: await (0, promises_1.readFile)(serverOptions.sslKey),
            };
        }
        else {
            const { default: basicSslPlugin } = await Promise.resolve().then(() => __importStar(require('@vitejs/plugin-basic-ssl')));
            configuration.plugins ??= [];
            configuration.plugins.push(basicSslPlugin());
        }
    }
    return configuration;
}
/**
 * Checks if the given value is an absolute URL.
 *
 * This function helps in avoiding Vite's prebundling from processing absolute URLs (http://, https://, //) as files.
 *
 * @param value - The URL or path to check.
 * @returns `true` if the value is not an absolute URL; otherwise, `false`.
 */
function isAbsoluteUrl(value) {
    return /^(?:https?:)?\/\//.test(value);
}
