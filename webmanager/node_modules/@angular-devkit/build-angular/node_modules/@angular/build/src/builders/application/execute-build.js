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
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeBuild = executeBuild;
const compilation_1 = require("../../tools/angular/compilation");
const source_file_cache_1 = require("../../tools/esbuild/angular/source-file-cache");
const budget_stats_1 = require("../../tools/esbuild/budget-stats");
const bundler_context_1 = require("../../tools/esbuild/bundler-context");
const bundler_execution_result_1 = require("../../tools/esbuild/bundler-execution-result");
const commonjs_checker_1 = require("../../tools/esbuild/commonjs-checker");
const license_extractor_1 = require("../../tools/esbuild/license-extractor");
const profiling_1 = require("../../tools/esbuild/profiling");
const utils_1 = require("../../tools/esbuild/utils");
const bundle_calculator_1 = require("../../utils/bundle-calculator");
const environment_options_1 = require("../../utils/environment-options");
const resolve_assets_1 = require("../../utils/resolve-assets");
const manifest_1 = require("../../utils/server-rendering/manifest");
const supported_browsers_1 = require("../../utils/supported-browsers");
const execute_post_bundle_1 = require("./execute-post-bundle");
const i18n_1 = require("./i18n");
const setup_bundling_1 = require("./setup-bundling");
// eslint-disable-next-line max-lines-per-function
async function executeBuild(options, context, rebuildState) {
    const { projectRoot, workspaceRoot, i18nOptions, optimizationOptions, assets, cacheOptions, serverEntryPoint, baseHref, ssrOptions, verbose, colors, jsonLogs, } = options;
    // TODO: Consider integrating into watch mode. Would require full rebuild on target changes.
    const browsers = (0, supported_browsers_1.getSupportedBrowsers)(projectRoot, context.logger);
    // Load active translations if inlining
    // TODO: Integrate into watch mode and only load changed translations
    if (i18nOptions.shouldInline) {
        await (0, i18n_1.loadActiveTranslations)(context, i18nOptions);
    }
    // Reuse rebuild state or create new bundle contexts for code and global stylesheets
    let bundlerContexts;
    let componentStyleBundler;
    let codeBundleCache;
    let bundlingResult;
    let templateUpdates;
    if (rebuildState) {
        bundlerContexts = rebuildState.rebuildContexts;
        componentStyleBundler = rebuildState.componentStyleBundler;
        codeBundleCache = rebuildState.codeBundleCache;
        templateUpdates = rebuildState.templateUpdates;
        // Reset template updates for new rebuild
        templateUpdates?.clear();
        const allFileChanges = rebuildState.fileChanges.all;
        // Bundle all contexts that do not require TypeScript changed file checks.
        // These will automatically use cached results based on the changed files.
        bundlingResult = await bundler_context_1.BundlerContext.bundleAll(bundlerContexts.otherContexts, allFileChanges);
        // Check the TypeScript code bundling cache for changes. If invalid, force a rebundle of
        // all TypeScript related contexts.
        const forceTypeScriptRebuild = codeBundleCache?.invalidate(allFileChanges);
        const typescriptResults = [];
        for (const typescriptContext of bundlerContexts.typescriptContexts) {
            typescriptContext.invalidate(allFileChanges);
            const result = await typescriptContext.bundle(forceTypeScriptRebuild);
            typescriptResults.push(result);
        }
        bundlingResult = bundler_context_1.BundlerContext.mergeResults([bundlingResult, ...typescriptResults]);
    }
    else {
        const target = (0, utils_1.transformSupportedBrowsersToTargets)(browsers);
        codeBundleCache = new source_file_cache_1.SourceFileCache(cacheOptions.enabled ? cacheOptions.path : undefined);
        componentStyleBundler = (0, setup_bundling_1.createComponentStyleBundler)(options, target);
        if (options.templateUpdates) {
            templateUpdates = new Map();
        }
        bundlerContexts = (0, setup_bundling_1.setupBundlerContexts)(options, target, codeBundleCache, componentStyleBundler, 
        // Create new reusable compilation for the appropriate mode based on the `jit` plugin option
        await (0, compilation_1.createAngularCompilation)(!!options.jit, !options.serverEntryPoint), templateUpdates);
        // Bundle everything on initial build
        bundlingResult = await bundler_context_1.BundlerContext.bundleAll([
            ...bundlerContexts.typescriptContexts,
            ...bundlerContexts.otherContexts,
        ]);
    }
    // Update any external component styles if enabled and rebuilding.
    // TODO: Only attempt rebundling of invalidated styles once incremental build results are supported.
    if (rebuildState && options.externalRuntimeStyles) {
        componentStyleBundler.invalidate(rebuildState.fileChanges.all);
        const componentResults = await componentStyleBundler.bundleAllFiles(true, true);
        bundlingResult = bundler_context_1.BundlerContext.mergeResults([bundlingResult, ...componentResults]);
    }
    if (options.optimizationOptions.scripts && environment_options_1.shouldOptimizeChunks) {
        const { optimizeChunks } = await Promise.resolve().then(() => __importStar(require('./chunk-optimizer')));
        bundlingResult = await (0, profiling_1.profileAsync)('OPTIMIZE_CHUNKS', () => optimizeChunks(bundlingResult, options.sourcemapOptions.scripts ? !options.sourcemapOptions.hidden || 'hidden' : false));
    }
    const executionResult = new bundler_execution_result_1.ExecutionResult(bundlerContexts, componentStyleBundler, codeBundleCache, templateUpdates);
    executionResult.addWarnings(bundlingResult.warnings);
    // Add used external component style referenced files to be watched
    if (options.externalRuntimeStyles) {
        executionResult.extraWatchFiles.push(...componentStyleBundler.collectReferencedFiles());
    }
    // Return if the bundling has errors
    if (bundlingResult.errors) {
        executionResult.addErrors(bundlingResult.errors);
        return executionResult;
    }
    // Analyze external imports if external options are enabled
    if (options.externalPackages || bundlingResult.externalConfiguration) {
        const { externalConfiguration = [], externalImports: { browser = [], server = [] }, } = bundlingResult;
        // Similar to esbuild, --external:@foo/bar automatically implies --external:@foo/bar/*,
        // which matches import paths like @foo/bar/baz.
        // This means all paths within the @foo/bar package are also marked as external.
        const exclusionsPrefixes = externalConfiguration.map((exclusion) => exclusion + '/');
        const exclusions = new Set(externalConfiguration);
        const explicitExternal = new Set();
        const isExplicitExternal = (dep) => {
            if (exclusions.has(dep)) {
                return true;
            }
            for (const prefix of exclusionsPrefixes) {
                if (dep.startsWith(prefix)) {
                    return true;
                }
            }
            return false;
        };
        const implicitBrowser = [];
        for (const dep of browser) {
            if (isExplicitExternal(dep)) {
                explicitExternal.add(dep);
            }
            else {
                implicitBrowser.push(dep);
            }
        }
        const implicitServer = [];
        for (const dep of server) {
            if (isExplicitExternal(dep)) {
                explicitExternal.add(dep);
            }
            else {
                implicitServer.push(dep);
            }
        }
        executionResult.setExternalMetadata(implicitBrowser, implicitServer, [...explicitExternal]);
    }
    const { metafile, initialFiles, outputFiles } = bundlingResult;
    executionResult.outputFiles.push(...outputFiles);
    // Analyze files for bundle budget failures if present
    let budgetFailures;
    if (options.budgets) {
        const compatStats = (0, budget_stats_1.generateBudgetStats)(metafile, outputFiles, initialFiles);
        budgetFailures = [...(0, bundle_calculator_1.checkBudgets)(options.budgets, compatStats, true)];
        for (const { message, severity } of budgetFailures) {
            if (severity === 'error') {
                executionResult.addError(message);
            }
            else {
                executionResult.addWarning(message);
            }
        }
    }
    // Calculate estimated transfer size if scripts are optimized
    let estimatedTransferSizes;
    if (optimizationOptions.scripts || optimizationOptions.styles.minify) {
        estimatedTransferSizes = await (0, utils_1.calculateEstimatedTransferSizes)(executionResult.outputFiles);
    }
    // Check metafile for CommonJS module usage if optimizing scripts
    if (optimizationOptions.scripts) {
        const messages = (0, commonjs_checker_1.checkCommonJSModules)(metafile, options.allowedCommonJsDependencies);
        executionResult.addWarnings(messages);
    }
    // Copy assets
    if (assets) {
        executionResult.addAssets(await (0, resolve_assets_1.resolveAssets)(assets, workspaceRoot));
    }
    // Extract and write licenses for used packages
    if (options.extractLicenses) {
        executionResult.addOutputFile('3rdpartylicenses.txt', await (0, license_extractor_1.extractLicenses)(metafile, workspaceRoot), bundler_context_1.BuildOutputFileType.Root);
    }
    // Watch input index HTML file if configured
    if (options.indexHtmlOptions) {
        executionResult.extraWatchFiles.push(options.indexHtmlOptions.input);
        executionResult.htmlIndexPath = options.indexHtmlOptions.output;
        executionResult.htmlBaseHref = options.baseHref;
    }
    // Create server app engine manifest
    if (serverEntryPoint) {
        executionResult.addOutputFile(manifest_1.SERVER_APP_ENGINE_MANIFEST_FILENAME, (0, manifest_1.generateAngularServerAppEngineManifest)(i18nOptions, baseHref), bundler_context_1.BuildOutputFileType.ServerRoot);
    }
    // Perform i18n translation inlining if enabled
    if (i18nOptions.shouldInline) {
        const result = await (0, i18n_1.inlineI18n)(metafile, options, executionResult, initialFiles);
        executionResult.addErrors(result.errors);
        executionResult.addWarnings(result.warnings);
        executionResult.addPrerenderedRoutes(result.prerenderedRoutes);
    }
    else {
        const result = await (0, execute_post_bundle_1.executePostBundleSteps)(metafile, options, executionResult.outputFiles, executionResult.assetFiles, initialFiles, 
        // Set lang attribute to the defined source locale if present
        i18nOptions.hasDefinedSourceLocale ? i18nOptions.sourceLocale : undefined);
        // Deduplicate and add errors and warnings
        executionResult.addErrors([...new Set(result.errors)]);
        executionResult.addWarnings([...new Set(result.warnings)]);
        executionResult.addPrerenderedRoutes(result.prerenderedRoutes);
        executionResult.outputFiles.push(...result.additionalOutputFiles);
        executionResult.assetFiles.push(...result.additionalAssets);
    }
    executionResult.addOutputFile('prerendered-routes.json', JSON.stringify({ routes: executionResult.prerenderedRoutes }, null, 2), bundler_context_1.BuildOutputFileType.Root);
    // Write metafile if stats option is enabled
    if (options.stats) {
        executionResult.addOutputFile('stats.json', JSON.stringify(metafile, null, 2), bundler_context_1.BuildOutputFileType.Root);
    }
    if (!jsonLogs) {
        const changedFiles = rebuildState && executionResult.findChangedFiles(rebuildState.previousOutputInfo);
        executionResult.addLog((0, utils_1.logBuildStats)(metafile, outputFiles, initialFiles, budgetFailures, colors, changedFiles, estimatedTransferSizes, !!ssrOptions, verbose));
    }
    return executionResult;
}
