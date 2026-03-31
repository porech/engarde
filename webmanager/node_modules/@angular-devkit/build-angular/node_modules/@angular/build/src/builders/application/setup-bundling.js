"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupBundlerContexts = setupBundlerContexts;
exports.createComponentStyleBundler = createComponentStyleBundler;
const component_stylesheets_1 = require("../../tools/esbuild/angular/component-stylesheets");
const application_code_bundle_1 = require("../../tools/esbuild/application-code-bundle");
const bundler_context_1 = require("../../tools/esbuild/bundler-context");
const global_scripts_1 = require("../../tools/esbuild/global-scripts");
const global_styles_1 = require("../../tools/esbuild/global-styles");
const utils_1 = require("../../tools/esbuild/utils");
/**
 * Generates one or more BundlerContext instances based on the builder provided
 * configuration.
 * @param options The normalized application builder options to use.
 * @param browsers An string array of browserslist browsers to support.
 * @param codeBundleCache An instance of the TypeScript source file cache.
 * @returns An array of BundlerContext objects.
 */
function setupBundlerContexts(options, target, codeBundleCache, stylesheetBundler, angularCompilation, templateUpdates) {
    const { outputMode, serverEntryPoint, appShellOptions, prerenderOptions, ssrOptions, workspaceRoot, watch = false, } = options;
    const typescriptContexts = [];
    const otherContexts = [];
    // Browser application code
    typescriptContexts.push(new bundler_context_1.BundlerContext(workspaceRoot, watch, (0, application_code_bundle_1.createBrowserCodeBundleOptions)(options, target, codeBundleCache, stylesheetBundler, angularCompilation, templateUpdates)));
    // Browser polyfills code
    const browserPolyfillBundleOptions = (0, application_code_bundle_1.createBrowserPolyfillBundleOptions)(options, target, codeBundleCache, stylesheetBundler);
    if (browserPolyfillBundleOptions) {
        const browserPolyfillContext = new bundler_context_1.BundlerContext(workspaceRoot, watch, browserPolyfillBundleOptions);
        if (typeof browserPolyfillBundleOptions === 'function') {
            otherContexts.push(browserPolyfillContext);
        }
        else {
            typescriptContexts.push(browserPolyfillContext);
        }
    }
    // Global Stylesheets
    if (options.globalStyles.length > 0) {
        for (const initial of [true, false]) {
            const bundleOptions = (0, global_styles_1.createGlobalStylesBundleOptions)(options, target, initial);
            if (bundleOptions) {
                otherContexts.push(new bundler_context_1.BundlerContext(workspaceRoot, watch, bundleOptions, () => initial));
            }
        }
    }
    // Global Scripts
    if (options.globalScripts.length > 0) {
        for (const initial of [true, false]) {
            const bundleOptions = (0, global_scripts_1.createGlobalScriptsBundleOptions)(options, target, initial);
            if (bundleOptions) {
                otherContexts.push(new bundler_context_1.BundlerContext(workspaceRoot, watch, bundleOptions, () => initial));
            }
        }
    }
    // Skip server build when none of the features are enabled.
    if (serverEntryPoint && (outputMode || prerenderOptions || appShellOptions || ssrOptions)) {
        const nodeTargets = [...target, ...(0, utils_1.getSupportedNodeTargets)()];
        typescriptContexts.push(new bundler_context_1.BundlerContext(workspaceRoot, watch, (0, application_code_bundle_1.createServerMainCodeBundleOptions)(options, nodeTargets, codeBundleCache, stylesheetBundler)));
        if (outputMode && ssrOptions?.entry) {
            // New behavior introduced: 'server.ts' is now bundled separately from 'main.server.ts'.
            typescriptContexts.push(new bundler_context_1.BundlerContext(workspaceRoot, watch, (0, application_code_bundle_1.createSsrEntryCodeBundleOptions)(options, nodeTargets, codeBundleCache, stylesheetBundler)));
        }
        // Server polyfills code
        const serverPolyfillBundleOptions = (0, application_code_bundle_1.createServerPolyfillBundleOptions)(options, nodeTargets, codeBundleCache.loadResultCache);
        if (serverPolyfillBundleOptions) {
            otherContexts.push(new bundler_context_1.BundlerContext(workspaceRoot, watch, serverPolyfillBundleOptions));
        }
    }
    return { typescriptContexts, otherContexts };
}
function createComponentStyleBundler(options, target) {
    const { workspaceRoot, optimizationOptions, sourcemapOptions, outputNames, externalDependencies, preserveSymlinks, stylePreprocessorOptions, inlineStyleLanguage, cacheOptions, tailwindConfiguration, postcssConfiguration, publicPath, } = options;
    const incremental = !!options.watch;
    return new component_stylesheets_1.ComponentStylesheetBundler({
        workspaceRoot,
        inlineFonts: !!optimizationOptions.fonts.inline,
        optimization: !!optimizationOptions.styles.minify,
        sourcemap: 
        // Hidden component stylesheet sourcemaps are inaccessible which is effectively
        // the same as being disabled. Disabling has the advantage of avoiding the overhead
        // of sourcemap processing.
        sourcemapOptions.styles && !sourcemapOptions.hidden ? 'linked' : false,
        sourcesContent: sourcemapOptions.sourcesContent,
        outputNames,
        includePaths: stylePreprocessorOptions?.includePaths,
        // string[] | undefined' is not assignable to type '(Version | DeprecationOrId)[] | undefined'.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sass: stylePreprocessorOptions?.sass,
        externalDependencies,
        target,
        preserveSymlinks,
        tailwindConfiguration,
        postcssConfiguration,
        cacheOptions,
        publicPath,
    }, inlineStyleLanguage, incremental);
}
