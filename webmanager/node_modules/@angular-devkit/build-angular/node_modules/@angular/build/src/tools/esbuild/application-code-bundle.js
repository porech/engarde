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
exports.createBrowserCodeBundleOptions = createBrowserCodeBundleOptions;
exports.createBrowserPolyfillBundleOptions = createBrowserPolyfillBundleOptions;
exports.createServerPolyfillBundleOptions = createServerPolyfillBundleOptions;
exports.createServerMainCodeBundleOptions = createServerMainCodeBundleOptions;
exports.createSsrEntryCodeBundleOptions = createSsrEntryCodeBundleOptions;
const node_assert_1 = __importDefault(require("node:assert"));
const node_crypto_1 = require("node:crypto");
const node_path_1 = require("node:path");
const schema_1 = require("../../builders/application/schema");
const environment_options_1 = require("../../utils/environment-options");
const path_1 = require("../../utils/path");
const manifest_1 = require("../../utils/server-rendering/manifest");
const compilation_1 = require("../angular/compilation");
const compiler_plugin_1 = require("./angular/compiler-plugin");
const angular_localize_init_warning_plugin_1 = require("./angular-localize-init-warning-plugin");
const compiler_plugin_options_1 = require("./compiler-plugin-options");
const external_packages_plugin_1 = require("./external-packages-plugin");
const i18n_locale_plugin_1 = require("./i18n-locale-plugin");
const loader_import_attribute_plugin_1 = require("./loader-import-attribute-plugin");
const rxjs_esm_resolution_plugin_1 = require("./rxjs-esm-resolution-plugin");
const server_bundle_metadata_plugin_1 = require("./server-bundle-metadata-plugin");
const sourcemap_ignorelist_plugin_1 = require("./sourcemap-ignorelist-plugin");
const utils_1 = require("./utils");
const virtual_module_plugin_1 = require("./virtual-module-plugin");
const wasm_plugin_1 = require("./wasm-plugin");
function createBrowserCodeBundleOptions(options, target, sourceFileCache, stylesheetBundler, angularCompilation, templateUpdates) {
    return (loadCache) => {
        const { entryPoints, outputNames, polyfills } = options;
        const zoneless = (0, utils_1.isZonelessApp)(polyfills);
        const pluginOptions = (0, compiler_plugin_options_1.createCompilerPluginOptions)(options, sourceFileCache, loadCache, templateUpdates);
        const buildOptions = {
            ...getEsBuildCommonOptions(options),
            platform: 'browser',
            // Note: `es2015` is needed for RxJS v6. If not specified, `module` would
            // match and the ES5 distribution would be bundled and ends up breaking at
            // runtime with the RxJS testing library.
            // More details: https://github.com/angular/angular-cli/issues/25405.
            mainFields: ['es2020', 'es2015', 'browser', 'module', 'main'],
            entryNames: outputNames.bundles,
            entryPoints,
            target,
            supported: (0, utils_1.getFeatureSupport)(target, zoneless),
        };
        buildOptions.plugins ??= [];
        buildOptions.plugins.push((0, wasm_plugin_1.createWasmPlugin)({ allowAsync: zoneless, cache: loadCache }), (0, angular_localize_init_warning_plugin_1.createAngularLocalizeInitWarningPlugin)(), (0, compiler_plugin_1.createCompilerPlugin)(
        // JS/TS options
        pluginOptions, angularCompilation, 
        // Component stylesheet bundler
        stylesheetBundler));
        if (options.plugins) {
            buildOptions.plugins.push(...options.plugins);
        }
        return buildOptions;
    };
}
function createBrowserPolyfillBundleOptions(options, target, sourceFileCache, stylesheetBundler) {
    const namespace = 'angular:polyfills';
    const polyfillBundleOptions = getEsBuildCommonPolyfillsOptions(options, namespace, true, sourceFileCache.loadResultCache);
    if (!polyfillBundleOptions) {
        return;
    }
    const { outputNames, polyfills } = options;
    const hasTypeScriptEntries = polyfills?.some((entry) => /\.[cm]?tsx?$/.test(entry));
    const buildOptions = {
        ...polyfillBundleOptions,
        platform: 'browser',
        // Note: `es2015` is needed for RxJS v6. If not specified, `module` would
        // match and the ES5 distribution would be bundled and ends up breaking at
        // runtime with the RxJS testing library.
        // More details: https://github.com/angular/angular-cli/issues/25405.
        mainFields: ['es2020', 'es2015', 'browser', 'module', 'main'],
        entryNames: outputNames.bundles,
        target,
        entryPoints: {
            'polyfills': namespace,
        },
    };
    // Only add the Angular TypeScript compiler if TypeScript files are provided in the polyfills
    if (hasTypeScriptEntries) {
        buildOptions.plugins ??= [];
        const pluginOptions = (0, compiler_plugin_options_1.createCompilerPluginOptions)(options, sourceFileCache);
        buildOptions.plugins.push((0, compiler_plugin_1.createCompilerPlugin)(
        // JS/TS options
        pluginOptions, 
        // Browser compilation handles the actual Angular code compilation
        new compilation_1.NoopCompilation(), 
        // Component stylesheet options are unused for polyfills but required by the plugin
        stylesheetBundler));
    }
    // Use an options factory to allow fully incremental bundling when no TypeScript files are present.
    // The TypeScript compilation is not currently integrated into the bundler invalidation so
    // cannot be used with fully incremental bundling yet.
    return hasTypeScriptEntries ? buildOptions : () => buildOptions;
}
function createServerPolyfillBundleOptions(options, target, loadResultCache) {
    const serverPolyfills = [];
    const polyfillsFromConfig = new Set(options.polyfills);
    const isNodePlatform = options.ssrOptions?.platform !== schema_1.ExperimentalPlatform.Neutral;
    if (!(0, utils_1.isZonelessApp)(options.polyfills)) {
        serverPolyfills.push(isNodePlatform ? 'zone.js/node' : 'zone.js');
    }
    if (polyfillsFromConfig.has('@angular/localize') ||
        polyfillsFromConfig.has('@angular/localize/init')) {
        serverPolyfills.push('@angular/localize/init');
    }
    serverPolyfills.push('@angular/platform-server/init');
    const namespace = 'angular:polyfills-server';
    const polyfillBundleOptions = getEsBuildCommonPolyfillsOptions({
        ...options,
        polyfills: serverPolyfills,
    }, namespace, false, loadResultCache);
    if (!polyfillBundleOptions) {
        return;
    }
    const jsBanner = [];
    if (polyfillBundleOptions.external?.length) {
        jsBanner.push(`globalThis['ngServerMode'] = true;`);
    }
    if (isNodePlatform) {
        // Note: Needed as esbuild does not provide require shims / proxy from ESModules.
        // See: https://github.com/evanw/esbuild/issues/1921.
        jsBanner.push(`import { createRequire } from 'node:module';`, `globalThis['require'] ??= createRequire(import.meta.url);`);
    }
    const buildOptions = {
        ...polyfillBundleOptions,
        platform: isNodePlatform ? 'node' : 'neutral',
        outExtension: { '.js': '.mjs' },
        // Note: `es2015` is needed for RxJS v6. If not specified, `module` would
        // match and the ES5 distribution would be bundled and ends up breaking at
        // runtime with the RxJS testing library.
        // More details: https://github.com/angular/angular-cli/issues/25405.
        mainFields: ['es2020', 'es2015', 'module', 'main'],
        entryNames: '[name]',
        banner: {
            js: jsBanner.join('\n'),
        },
        target,
        entryPoints: {
            'polyfills.server': namespace,
        },
    };
    buildOptions.plugins ??= [];
    buildOptions.plugins.push((0, server_bundle_metadata_plugin_1.createServerBundleMetadata)());
    return () => buildOptions;
}
function createServerMainCodeBundleOptions(options, target, sourceFileCache, stylesheetBundler) {
    const { serverEntryPoint: mainServerEntryPoint, workspaceRoot, outputMode, externalPackages, ssrOptions, polyfills, } = options;
    (0, node_assert_1.default)(mainServerEntryPoint, 'createServerCodeBundleOptions should not be called without a defined serverEntryPoint.');
    return (loadResultCache) => {
        const pluginOptions = (0, compiler_plugin_options_1.createCompilerPluginOptions)(options, sourceFileCache, loadResultCache);
        const mainServerNamespace = 'angular:main-server';
        const mainServerInjectManifestNamespace = 'angular:main-server-inject-manifest';
        const zoneless = (0, utils_1.isZonelessApp)(polyfills);
        const entryPoints = {
            'main.server': mainServerNamespace,
        };
        const ssrEntryPoint = ssrOptions?.entry;
        const isOldBehaviour = !outputMode;
        if (ssrEntryPoint && isOldBehaviour) {
            // Old behavior: 'server.ts' was bundled together with the SSR (Server-Side Rendering) code.
            // This approach combined server-side logic and rendering into a single bundle.
            entryPoints['server'] = ssrEntryPoint;
        }
        const buildOptions = {
            ...getEsBuildServerCommonOptions(options),
            target,
            banner: {
                js: `import './polyfills.server.mjs';`,
            },
            entryPoints,
            supported: (0, utils_1.getFeatureSupport)(target, zoneless),
        };
        buildOptions.plugins ??= [];
        buildOptions.plugins.push((0, wasm_plugin_1.createWasmPlugin)({ allowAsync: zoneless, cache: loadResultCache }), (0, angular_localize_init_warning_plugin_1.createAngularLocalizeInitWarningPlugin)(), (0, compiler_plugin_1.createCompilerPlugin)(
        // JS/TS options
        pluginOptions, 
        // Browser compilation handles the actual Angular code compilation
        new compilation_1.NoopCompilation(), 
        // Component stylesheet bundler
        stylesheetBundler));
        if (!externalPackages) {
            buildOptions.plugins.push((0, rxjs_esm_resolution_plugin_1.createRxjsEsmResolutionPlugin)());
        }
        // Mark manifest and polyfills file as external as these are generated by a different bundle step.
        (buildOptions.external ??= []).push(...utils_1.SERVER_GENERATED_EXTERNALS);
        const isNodePlatform = options.ssrOptions?.platform !== schema_1.ExperimentalPlatform.Neutral;
        if (!isNodePlatform) {
            // `@angular/platform-server` lazily depends on `xhr2` for XHR usage with the HTTP client.
            // Since `xhr2` has Node.js dependencies, it cannot be used when targeting non-Node.js platforms.
            // Note: The framework already issues a warning when using XHR with SSR.
            buildOptions.external.push('xhr2');
        }
        buildOptions.plugins.push((0, server_bundle_metadata_plugin_1.createServerBundleMetadata)(), (0, virtual_module_plugin_1.createVirtualModulePlugin)({
            namespace: mainServerInjectManifestNamespace,
            cache: loadResultCache,
            entryPointOnly: false,
            loadContent: async () => {
                const contents = [
                    // Configure `@angular/ssr` manifest.
                    `import manifest from './${manifest_1.SERVER_APP_MANIFEST_FILENAME}';`,
                    `import { ɵsetAngularAppManifest } from '@angular/ssr';`,
                    `ɵsetAngularAppManifest(manifest);`,
                ];
                return {
                    contents: contents.join('\n'),
                    loader: 'js',
                    resolveDir: workspaceRoot,
                };
            },
        }), (0, virtual_module_plugin_1.createVirtualModulePlugin)({
            namespace: mainServerNamespace,
            cache: loadResultCache,
            loadContent: async () => {
                const mainServerEntryPointJsImport = entryFileToWorkspaceRelative(workspaceRoot, mainServerEntryPoint);
                const contents = [
                    // Inject manifest
                    `import '${mainServerInjectManifestNamespace}';`,
                    // Add @angular/ssr exports
                    `export {
              ɵdestroyAngularServerApp,
              ɵextractRoutesAndCreateRouteTree,
              ɵgetOrCreateAngularServerApp,
            } from '@angular/ssr';`,
                    // Need for HMR
                    `export { ɵresetCompiledComponents } from '@angular/core';`,
                    // Re-export all symbols including default export from 'main.server.ts'
                    `export { default } from '${mainServerEntryPointJsImport}';`,
                    `export * from '${mainServerEntryPointJsImport}';`,
                ];
                return {
                    contents: contents.join('\n'),
                    loader: 'js',
                    resolveDir: workspaceRoot,
                };
            },
        }));
        if (options.plugins) {
            buildOptions.plugins.push(...options.plugins);
        }
        return buildOptions;
    };
}
function createSsrEntryCodeBundleOptions(options, target, sourceFileCache, stylesheetBundler) {
    const { workspaceRoot, ssrOptions, externalPackages } = options;
    const serverEntryPoint = ssrOptions?.entry;
    (0, node_assert_1.default)(serverEntryPoint, 'createSsrEntryCodeBundleOptions should not be called without a defined serverEntryPoint.');
    return (loadResultCache) => {
        const pluginOptions = (0, compiler_plugin_options_1.createCompilerPluginOptions)(options, sourceFileCache, loadResultCache);
        const ssrEntryNamespace = 'angular:ssr-entry';
        const ssrInjectManifestNamespace = 'angular:ssr-entry-inject-manifest';
        const isNodePlatform = options.ssrOptions?.platform !== schema_1.ExperimentalPlatform.Neutral;
        const jsBanner = [];
        if (options.externalDependencies?.length) {
            jsBanner.push(`globalThis['ngServerMode'] = true;`);
        }
        if (isNodePlatform) {
            // Note: Needed as esbuild does not provide require shims / proxy from ESModules.
            // See: https://github.com/evanw/esbuild/issues/1921.
            jsBanner.push(`import { createRequire } from 'node:module';`, `globalThis['require'] ??= createRequire(import.meta.url);`);
        }
        const buildOptions = {
            ...getEsBuildServerCommonOptions(options),
            target,
            banner: {
                js: jsBanner.join('\n'),
            },
            entryPoints: {
                'server': ssrEntryNamespace,
            },
            supported: (0, utils_1.getFeatureSupport)(target, true),
        };
        buildOptions.plugins ??= [];
        buildOptions.plugins.push((0, angular_localize_init_warning_plugin_1.createAngularLocalizeInitWarningPlugin)(), (0, compiler_plugin_1.createCompilerPlugin)(
        // JS/TS options
        pluginOptions, 
        // Browser compilation handles the actual Angular code compilation
        new compilation_1.NoopCompilation(), 
        // Component stylesheet bundler
        stylesheetBundler));
        if (!externalPackages) {
            buildOptions.plugins.push((0, rxjs_esm_resolution_plugin_1.createRxjsEsmResolutionPlugin)());
        }
        // Mark manifest file as external. As this will be generated later on.
        (buildOptions.external ??= []).push('*/main.server.mjs', ...utils_1.SERVER_GENERATED_EXTERNALS);
        if (!isNodePlatform) {
            // `@angular/platform-server` lazily depends on `xhr2` for XHR usage with the HTTP client.
            // Since `xhr2` has Node.js dependencies, it cannot be used when targeting non-Node.js platforms.
            // Note: The framework already issues a warning when using XHR with SSR.
            buildOptions.external.push('xhr2');
        }
        buildOptions.plugins.push((0, server_bundle_metadata_plugin_1.createServerBundleMetadata)({ ssrEntryBundle: true }), (0, virtual_module_plugin_1.createVirtualModulePlugin)({
            namespace: ssrInjectManifestNamespace,
            cache: loadResultCache,
            entryPointOnly: false,
            loadContent: () => {
                const contents = [
                    // Configure `@angular/ssr` app engine manifest.
                    `import manifest from './${manifest_1.SERVER_APP_ENGINE_MANIFEST_FILENAME}';`,
                    `import { ɵsetAngularAppEngineManifest } from '@angular/ssr';`,
                    `ɵsetAngularAppEngineManifest(manifest);`,
                ];
                return {
                    contents: contents.join('\n'),
                    loader: 'js',
                    resolveDir: workspaceRoot,
                };
            },
        }), (0, virtual_module_plugin_1.createVirtualModulePlugin)({
            namespace: ssrEntryNamespace,
            cache: loadResultCache,
            loadContent: () => {
                const serverEntryPointJsImport = entryFileToWorkspaceRelative(workspaceRoot, serverEntryPoint);
                const contents = [
                    // Configure `@angular/ssr` app engine manifest.
                    `import '${ssrInjectManifestNamespace}';`,
                    // Re-export all symbols including default export
                    `import * as server from '${serverEntryPointJsImport}';`,
                    `export * from '${serverEntryPointJsImport}';`,
                    // The below is needed to avoid
                    // `Import "default" will always be undefined because there is no matching export` warning when no default is present.
                    `const defaultExportName = 'default';`,
                    `export default server[defaultExportName]`,
                    // Add @angular/ssr exports
                    `export { AngularAppEngine } from '@angular/ssr';`,
                ];
                return {
                    contents: contents.join('\n'),
                    loader: 'js',
                    resolveDir: workspaceRoot,
                };
            },
        }));
        if (options.plugins) {
            buildOptions.plugins.push(...options.plugins);
        }
        return buildOptions;
    };
}
function getEsBuildServerCommonOptions(options) {
    const isNodePlatform = options.ssrOptions?.platform !== schema_1.ExperimentalPlatform.Neutral;
    const commonOptions = getEsBuildCommonOptions(options);
    commonOptions.define ??= {};
    commonOptions.define['ngServerMode'] = 'true';
    return {
        ...commonOptions,
        platform: isNodePlatform ? 'node' : 'neutral',
        outExtension: { '.js': '.mjs' },
        // Note: `es2015` is needed for RxJS v6. If not specified, `module` would
        // match and the ES5 distribution would be bundled and ends up breaking at
        // runtime with the RxJS testing library.
        // More details: https://github.com/angular/angular-cli/issues/25405.
        mainFields: ['es2020', 'es2015', 'module', 'main'],
        entryNames: '[name]',
    };
}
function getEsBuildCommonOptions(options) {
    const { workspaceRoot, outExtension, optimizationOptions, sourcemapOptions, tsconfig, externalDependencies, outputNames, preserveSymlinks, jit, loaderExtensions, jsonLogs, i18nOptions, customConditions, frameworkVersion, } = options;
    // Ensure unique hashes for i18n translation changes when using post-process inlining.
    // This hash value is added as a footer to each file and ensures that the output file names (with hashes)
    // change when translation files have changed. If this is not done the post processed files may have
    // different content but would retain identical production file names which would lead to browser caching problems.
    let footer;
    if (i18nOptions.shouldInline) {
        // Update file hashes to include translation file content
        const i18nHash = Object.values(i18nOptions.locales).reduce((data, locale) => data + locale.files.map((file) => file.integrity || '').join('|'), '');
        footer = { js: `/**i18n:${(0, node_crypto_1.createHash)('sha256').update(i18nHash).digest('hex')}*/` };
    }
    // Core conditions that are always included
    const conditions = [
        // Required to support rxjs 7.x which will use es5 code if this condition is not present
        'es2015',
        'es2020',
    ];
    // The pre-linked code is not used with JIT for two reasons:
    // 1) The pre-linked code may not have the metadata included that is required for JIT
    // 2) The CLI is otherwise setup to use runtime linking for JIT to match the application template compilation
    if (!jit) {
        // The pre-linked package condition is based on the framework version.
        // Currently this is specific to each patch version of the framework.
        conditions.push('angular:linked-' + frameworkVersion);
    }
    // Append custom conditions if present
    if (customConditions) {
        conditions.push(...customConditions);
    }
    else {
        // Include default conditions
        conditions.push('module', optimizationOptions.scripts ? 'production' : 'development');
    }
    const plugins = [
        (0, loader_import_attribute_plugin_1.createLoaderImportAttributePlugin)(),
        (0, sourcemap_ignorelist_plugin_1.createSourcemapIgnorelistPlugin)(),
    ];
    let packages = 'bundle';
    if (options.externalPackages) {
        // Package files affected by a customized loader should not be implicitly marked as external
        if (options.loaderExtensions ||
            options.plugins ||
            typeof options.externalPackages === 'object') {
            // Plugin must be added after custom plugins to ensure any added loader options are considered
            plugins.push((0, external_packages_plugin_1.createExternalPackagesPlugin)(options.externalPackages !== true ? options.externalPackages : undefined));
            packages = 'bundle';
        }
        else {
            // Safe to use the packages external option directly
            packages = 'external';
        }
    }
    return {
        absWorkingDir: workspaceRoot,
        format: 'esm',
        bundle: true,
        packages,
        assetNames: outputNames.media,
        conditions,
        resolveExtensions: ['.ts', '.tsx', '.mjs', '.js', '.cjs'],
        metafile: true,
        legalComments: options.extractLicenses ? 'none' : 'eof',
        logLevel: options.verbose && !jsonLogs ? 'debug' : 'silent',
        minifyIdentifiers: optimizationOptions.scripts && environment_options_1.allowMangle,
        minifySyntax: optimizationOptions.scripts,
        minifyWhitespace: optimizationOptions.scripts,
        pure: ['forwardRef'],
        outdir: workspaceRoot,
        outExtension: outExtension ? { '.js': `.${outExtension}` } : undefined,
        sourcemap: sourcemapOptions.scripts && (sourcemapOptions.hidden ? 'external' : true),
        sourcesContent: sourcemapOptions.sourcesContent,
        splitting: true,
        chunkNames: options.namedChunks ? '[name]-[hash]' : 'chunk-[hash]',
        tsconfig,
        external: externalDependencies ? [...externalDependencies] : undefined,
        write: false,
        preserveSymlinks,
        define: {
            ...options.define,
            // Only set to false when script optimizations are enabled. It should not be set to true because
            // Angular turns `ngDevMode` into an object for development debugging purposes when not defined
            // which a constant true value would break.
            ...(optimizationOptions.scripts ? { 'ngDevMode': 'false' } : undefined),
            'ngJitMode': jit ? 'true' : 'false',
            'ngServerMode': 'false',
            'ngHmrMode': options.templateUpdates ? 'true' : 'false',
        },
        loader: loaderExtensions,
        footer,
        plugins,
    };
}
function getEsBuildCommonPolyfillsOptions(options, namespace, tryToResolvePolyfillsAsRelative, loadResultCache) {
    const { jit, workspaceRoot, i18nOptions } = options;
    const buildOptions = getEsBuildCommonOptions(options);
    buildOptions.splitting = false;
    buildOptions.plugins ??= [];
    let polyfills = options.polyfills ? [...options.polyfills] : [];
    // Angular JIT mode requires the runtime compiler
    if (jit) {
        polyfills.unshift('@angular/compiler');
    }
    // Add Angular's global locale data if i18n options are present.
    // Locale data should go first so that project provided polyfill code can augment if needed.
    let needLocaleDataPlugin = false;
    if (i18nOptions.shouldInline) {
        // Remove localize polyfill as this is not needed for build time i18n.
        polyfills = polyfills.filter((path) => !path.startsWith('@angular/localize'));
        // Add locale data for all active locales
        // TODO: Inject each individually within the inlining process itself
        for (const locale of i18nOptions.inlineLocales) {
            polyfills.unshift(`angular:locale/data:${locale}`);
        }
        needLocaleDataPlugin = true;
    }
    else if (i18nOptions.hasDefinedSourceLocale) {
        // When not inlining and a source local is present, use the source locale data directly
        polyfills.unshift(`angular:locale/data:${i18nOptions.sourceLocale}`);
        needLocaleDataPlugin = true;
    }
    if (needLocaleDataPlugin) {
        buildOptions.plugins.push((0, i18n_locale_plugin_1.createAngularLocaleDataPlugin)());
    }
    if (polyfills.length === 0) {
        return;
    }
    buildOptions.plugins.push((0, virtual_module_plugin_1.createVirtualModulePlugin)({
        namespace,
        cache: loadResultCache,
        loadContent: async (_, build) => {
            let polyfillPaths = polyfills;
            let warnings;
            if (tryToResolvePolyfillsAsRelative) {
                polyfillPaths = await Promise.all(polyfills.map(async (path) => {
                    if (path.startsWith('zone.js') || !(0, node_path_1.extname)(path)) {
                        return path;
                    }
                    const potentialPathRelative = './' + path;
                    const result = await build.resolve(potentialPathRelative, {
                        kind: 'import-statement',
                        resolveDir: workspaceRoot,
                    });
                    return result.path ? potentialPathRelative : path;
                }));
            }
            // Generate module contents with an import statement per defined polyfill
            let contents = polyfillPaths.map((file) => `import '${(0, path_1.toPosixPath)(file)}';`).join('\n');
            // The below should be done after loading `$localize` as otherwise the locale will be overridden.
            if (i18nOptions.shouldInline) {
                // When inlining, a placeholder is used to allow the post-processing step to inject the $localize locale identifier.
                contents += '(globalThis.$localize ??= {}).locale = "___NG_LOCALE_INSERT___";\n';
            }
            else if (i18nOptions.hasDefinedSourceLocale) {
                // If not inlining translations and source locale is defined, inject the locale specifier.
                contents += `(globalThis.$localize ??= {}).locale = "${i18nOptions.sourceLocale}";\n`;
            }
            return {
                contents,
                loader: 'js',
                warnings,
                resolveDir: workspaceRoot,
            };
        },
    }));
    return buildOptions;
}
function entryFileToWorkspaceRelative(workspaceRoot, entryFile) {
    return './' + (0, path_1.toPosixPath)((0, node_path_1.relative)(workspaceRoot, entryFile).replace(/.[mc]?ts$/, ''));
}
