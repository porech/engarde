"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executePostBundleSteps = executePostBundleSteps;
const node_assert_1 = __importDefault(require("node:assert"));
const bundler_context_1 = require("../../tools/esbuild/bundler-context");
const index_html_generator_1 = require("../../tools/esbuild/index-html-generator");
const utils_1 = require("../../tools/esbuild/utils");
const environment_options_1 = require("../../utils/environment-options");
const manifest_1 = require("../../utils/server-rendering/manifest");
const models_1 = require("../../utils/server-rendering/models");
const prerender_1 = require("../../utils/server-rendering/prerender");
const service_worker_1 = require("../../utils/service-worker");
const options_1 = require("./options");
const schema_1 = require("./schema");
/**
 * Run additional builds steps including SSG, AppShell, Index HTML file and Service worker generation.
 * @param metafile An esbuild metafile object.
 * @param options The normalized application builder options used to create the build.
 * @param outputFiles The output files of an executed build.
 * @param assetFiles The assets of an executed build.
 * @param initialFiles A map containing initial file information for the executed build.
 * @param locale A language locale to insert in the index.html.
 */
// eslint-disable-next-line max-lines-per-function
async function executePostBundleSteps(metafile, options, outputFiles, assetFiles, initialFiles, locale) {
    const additionalAssets = [];
    const additionalOutputFiles = [];
    const allErrors = [];
    const allWarnings = [];
    const prerenderedRoutes = {};
    const { baseHref = '/', serviceWorker, ssrOptions, indexHtmlOptions, optimizationOptions, sourcemapOptions, outputMode, serverEntryPoint, prerenderOptions, appShellOptions, publicPath, workspaceRoot, partialSSRBuild, } = options;
    // Index HTML content without CSS inlining to be used for server rendering (AppShell, SSG and SSR).
    // NOTE: Critical CSS inlining is deliberately omitted here, as it will be handled during server rendering.
    // Additionally, when using prerendering or AppShell, the index HTML file may be regenerated.
    // To prevent generating duplicate files with the same filename, a `Map` is used to store and manage the files.
    const additionalHtmlOutputFiles = new Map();
    // Generate index HTML file
    // If localization is enabled, index generation is handled in the inlining process.
    if (indexHtmlOptions) {
        const { csrContent, ssrContent, errors, warnings } = await (0, index_html_generator_1.generateIndexHtml)(initialFiles, outputFiles, options, locale);
        allErrors.push(...errors);
        allWarnings.push(...warnings);
        additionalHtmlOutputFiles.set(indexHtmlOptions.output, (0, utils_1.createOutputFile)(indexHtmlOptions.output, csrContent, bundler_context_1.BuildOutputFileType.Browser));
        if (ssrContent) {
            additionalHtmlOutputFiles.set(options_1.INDEX_HTML_SERVER, (0, utils_1.createOutputFile)(options_1.INDEX_HTML_SERVER, ssrContent, bundler_context_1.BuildOutputFileType.ServerApplication));
        }
    }
    // Create server manifest
    const initialFilesPaths = new Set(initialFiles.keys());
    if (serverEntryPoint && (outputMode || prerenderOptions || appShellOptions || ssrOptions)) {
        const { manifestContent, serverAssetsChunks } = (0, manifest_1.generateAngularServerAppManifest)(additionalHtmlOutputFiles, outputFiles, optimizationOptions.styles.inlineCritical ?? false, undefined, locale, baseHref, initialFilesPaths, metafile, publicPath);
        additionalOutputFiles.push(...serverAssetsChunks, (0, utils_1.createOutputFile)(manifest_1.SERVER_APP_MANIFEST_FILENAME, manifestContent, bundler_context_1.BuildOutputFileType.ServerApplication));
    }
    // Pre-render (SSG) and App-shell
    // If localization is enabled, prerendering is handled in the inlining process.
    if (!partialSSRBuild &&
        (prerenderOptions || appShellOptions || (outputMode && serverEntryPoint)) &&
        !allErrors.length) {
        (0, node_assert_1.default)(indexHtmlOptions, 'The "index" option is required when using the "ssg" or "appShell" options.');
        const { output, warnings, errors, serializableRouteTreeNode } = await (0, prerender_1.prerenderPages)(workspaceRoot, baseHref, appShellOptions, prerenderOptions, [...outputFiles, ...additionalOutputFiles], assetFiles, outputMode, sourcemapOptions.scripts, environment_options_1.maxWorkers);
        allErrors.push(...errors);
        allWarnings.push(...warnings);
        const indexHasBeenPrerendered = output[indexHtmlOptions.output];
        for (const [path, { content, appShellRoute }] of Object.entries(output)) {
            // Update the index contents with the app shell under these conditions:
            // - Replace 'index.html' with the app shell only if it hasn't been prerendered yet.
            // - Always replace 'index.csr.html' with the app shell.
            let filePath = path;
            if (appShellRoute && !indexHasBeenPrerendered) {
                if (outputMode !== schema_1.OutputMode.Server && indexHtmlOptions.output === options_1.INDEX_HTML_CSR) {
                    filePath = 'index.html';
                }
                else {
                    filePath = indexHtmlOptions.output;
                }
            }
            additionalHtmlOutputFiles.set(filePath, (0, utils_1.createOutputFile)(filePath, content, bundler_context_1.BuildOutputFileType.Browser));
        }
        const serializableRouteTreeNodeForManifest = [];
        for (const metadata of serializableRouteTreeNode) {
            serializableRouteTreeNodeForManifest.push(metadata);
            if (metadata.renderMode === models_1.RouteRenderMode.Prerender && !metadata.route.includes('*')) {
                prerenderedRoutes[metadata.route] = { headers: metadata.headers };
            }
        }
        if (outputMode === schema_1.OutputMode.Server) {
            // Regenerate the manifest to append route tree. This is only needed if SSR is enabled.
            const manifest = additionalOutputFiles.find((f) => f.path === manifest_1.SERVER_APP_MANIFEST_FILENAME);
            (0, node_assert_1.default)(manifest, `${manifest_1.SERVER_APP_MANIFEST_FILENAME} was not found in output files.`);
            const { manifestContent, serverAssetsChunks } = (0, manifest_1.generateAngularServerAppManifest)(additionalHtmlOutputFiles, outputFiles, optimizationOptions.styles.inlineCritical ?? false, serializableRouteTreeNodeForManifest, locale, baseHref, initialFilesPaths, metafile, publicPath);
            for (const chunk of serverAssetsChunks) {
                const idx = additionalOutputFiles.findIndex(({ path }) => path === chunk.path);
                if (idx === -1) {
                    additionalOutputFiles.push(chunk);
                }
                else {
                    additionalOutputFiles[idx] = chunk;
                }
            }
            manifest.contents = new TextEncoder().encode(manifestContent);
        }
    }
    additionalOutputFiles.push(...additionalHtmlOutputFiles.values());
    // Augment the application with service worker support
    // If localization is enabled, service worker is handled in the inlining process.
    if (serviceWorker) {
        try {
            const serviceWorkerResult = await (0, service_worker_1.augmentAppWithServiceWorkerEsbuild)(workspaceRoot, serviceWorker, baseHref, options.indexHtmlOptions?.output, 
            // Ensure additional files recently added are used
            [...outputFiles, ...additionalOutputFiles], assetFiles);
            additionalOutputFiles.push((0, utils_1.createOutputFile)('ngsw.json', serviceWorkerResult.manifest, bundler_context_1.BuildOutputFileType.Browser));
            additionalAssets.push(...serviceWorkerResult.assetFiles);
        }
        catch (error) {
            allErrors.push(error instanceof Error ? error.message : `${error}`);
        }
    }
    return {
        errors: allErrors,
        warnings: allWarnings,
        additionalAssets,
        prerenderedRoutes,
        additionalOutputFiles,
    };
}
