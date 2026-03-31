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
exports.createGlobalStylesBundleOptions = createGlobalStylesBundleOptions;
const node_assert_1 = __importDefault(require("node:assert"));
const path_1 = require("../../utils/path");
const bundle_options_1 = require("./stylesheets/bundle-options");
const virtual_module_plugin_1 = require("./virtual-module-plugin");
function createGlobalStylesBundleOptions(options, target, initial) {
    const { workspaceRoot, optimizationOptions, sourcemapOptions, outputNames, globalStyles, preserveSymlinks, externalDependencies, stylePreprocessorOptions, tailwindConfiguration, postcssConfiguration, cacheOptions, } = options;
    const namespace = 'angular:styles/global';
    const entryPoints = {};
    let found = false;
    for (const style of globalStyles) {
        if (style.initial === initial) {
            found = true;
            entryPoints[style.name] = `${namespace};${style.name}`;
        }
    }
    // Skip if there are no entry points for the style loading type
    if (found === false) {
        return;
    }
    return (loadCache) => {
        const buildOptions = (0, bundle_options_1.createStylesheetBundleOptions)({
            workspaceRoot,
            optimization: !!optimizationOptions.styles.minify,
            inlineFonts: !!optimizationOptions.fonts.inline,
            sourcemap: !!sourcemapOptions.styles && (sourcemapOptions.hidden ? 'external' : true),
            sourcesContent: sourcemapOptions.sourcesContent,
            preserveSymlinks,
            target,
            externalDependencies,
            outputNames: initial
                ? outputNames
                : {
                    ...outputNames,
                    bundles: '[name]',
                },
            includePaths: stylePreprocessorOptions?.includePaths,
            // string[] | undefined' is not assignable to type '(Version | DeprecationOrId)[] | undefined'.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sass: stylePreprocessorOptions?.sass,
            tailwindConfiguration,
            postcssConfiguration,
            cacheOptions,
        }, loadCache);
        // Keep special CSS comments `/*! comment */` in place when `removeSpecialComments` is disabled.
        // These comments are special for a number of CSS tools such as Beasties and PurgeCSS.
        buildOptions.legalComments = optimizationOptions.styles?.removeSpecialComments
            ? 'none'
            : 'inline';
        buildOptions.entryPoints = entryPoints;
        buildOptions.plugins.unshift((0, virtual_module_plugin_1.createVirtualModulePlugin)({
            namespace,
            transformPath: (path) => path.split(';', 2)[1],
            loadContent: (args) => {
                const files = globalStyles.find(({ name }) => name === args.path)?.files;
                (0, node_assert_1.default)(files, `global style name should always be found [${args.path}]`);
                return {
                    contents: files.map((file) => `@import '${(0, path_1.toPosixPath)(file)}';`).join('\n'),
                    loader: 'css',
                    resolveDir: workspaceRoot,
                };
            },
        }));
        return buildOptions;
    };
}
