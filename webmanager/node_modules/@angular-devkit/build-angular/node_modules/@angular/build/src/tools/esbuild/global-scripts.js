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
exports.createGlobalScriptsBundleOptions = createGlobalScriptsBundleOptions;
const magic_string_1 = __importStar(require("magic-string"));
const node_assert_1 = __importDefault(require("node:assert"));
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const error_1 = require("../../utils/error");
const load_result_cache_1 = require("./load-result-cache");
const sourcemap_ignorelist_plugin_1 = require("./sourcemap-ignorelist-plugin");
const virtual_module_plugin_1 = require("./virtual-module-plugin");
/**
 * Create an esbuild 'build' options object for all global scripts defined in the user provied
 * build options.
 * @param options The builder's user-provider normalized options.
 * @returns An esbuild BuildOptions object.
 */
function createGlobalScriptsBundleOptions(options, target, initial) {
    const { globalScripts, optimizationOptions, outputNames, preserveSymlinks, sourcemapOptions, jsonLogs, workspaceRoot, define, } = options;
    const namespace = 'angular:script/global';
    const entryPoints = {};
    let found = false;
    for (const script of globalScripts) {
        if (script.initial === initial) {
            found = true;
            entryPoints[script.name] = `${namespace}:${script.name}`;
        }
    }
    // Skip if there are no entry points for the style loading type
    if (found === false) {
        return;
    }
    return (loadCache) => {
        return {
            absWorkingDir: workspaceRoot,
            bundle: false,
            splitting: false,
            entryPoints,
            entryNames: initial ? outputNames.bundles : '[name]',
            assetNames: outputNames.media,
            mainFields: ['script', 'browser', 'main'],
            conditions: ['script', optimizationOptions.scripts ? 'production' : 'development'],
            resolveExtensions: ['.mjs', '.js', '.cjs'],
            logLevel: options.verbose && !jsonLogs ? 'debug' : 'silent',
            metafile: true,
            minify: optimizationOptions.scripts,
            outdir: workspaceRoot,
            sourcemap: sourcemapOptions.scripts && (sourcemapOptions.hidden ? 'external' : true),
            write: false,
            platform: 'neutral',
            target,
            preserveSymlinks,
            define,
            plugins: [
                (0, sourcemap_ignorelist_plugin_1.createSourcemapIgnorelistPlugin)(),
                (0, virtual_module_plugin_1.createVirtualModulePlugin)({
                    namespace,
                    external: true,
                    // Add the `js` extension here so that esbuild generates an output file with the extension
                    transformPath: (path) => path.slice(namespace.length + 1) + '.js',
                    loadContent: (args, build) => (0, load_result_cache_1.createCachedLoad)(loadCache, async (args) => {
                        const files = globalScripts.find(({ name }) => name === args.path.slice(0, -3))?.files;
                        (0, node_assert_1.default)(files, `Invalid operation: global scripts name not found [${args.path}]`);
                        // Global scripts are concatenated using magic-string instead of bundled via esbuild.
                        const bundleContent = new magic_string_1.Bundle();
                        const watchFiles = [];
                        for (const filename of files) {
                            let fileContent;
                            try {
                                // Attempt to read as a relative path from the workspace root
                                const fullPath = node_path_1.default.join(workspaceRoot, filename);
                                fileContent = await (0, promises_1.readFile)(fullPath, 'utf-8');
                                watchFiles.push(fullPath);
                            }
                            catch (e) {
                                (0, error_1.assertIsError)(e);
                                if (e.code !== 'ENOENT') {
                                    throw e;
                                }
                                // If not found, attempt to resolve as a module specifier
                                const resolveResult = await build.resolve(filename, {
                                    kind: 'entry-point',
                                    resolveDir: workspaceRoot,
                                });
                                if (resolveResult.errors.length) {
                                    // Remove resolution failure notes about marking as external since it doesn't apply
                                    // to global scripts.
                                    resolveResult.errors.forEach((error) => (error.notes = []));
                                    return {
                                        errors: resolveResult.errors,
                                        warnings: resolveResult.warnings,
                                    };
                                }
                                watchFiles.push(resolveResult.path);
                                fileContent = await (0, promises_1.readFile)(resolveResult.path, 'utf-8');
                            }
                            bundleContent.addSource(new magic_string_1.default(fileContent, { filename }));
                        }
                        return {
                            contents: bundleContent.toString(),
                            loader: 'js',
                            watchFiles,
                        };
                    }).call(build, args),
                }),
            ],
        };
    };
}
