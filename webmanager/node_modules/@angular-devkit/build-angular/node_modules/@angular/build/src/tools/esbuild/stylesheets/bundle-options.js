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
exports.createStylesheetBundleOptions = createStylesheetBundleOptions;
const node_path_1 = __importDefault(require("node:path"));
const css_inline_fonts_plugin_1 = require("./css-inline-fonts-plugin");
const css_language_1 = require("./css-language");
const css_resource_plugin_1 = require("./css-resource-plugin");
const less_language_1 = require("./less-language");
const sass_language_1 = require("./sass-language");
const stylesheet_plugin_factory_1 = require("./stylesheet-plugin-factory");
function createStylesheetBundleOptions(options, cache, inlineComponentData) {
    // Ensure preprocessor include paths are absolute based on the workspace root
    const includePaths = options.includePaths?.map((includePath) => node_path_1.default.resolve(options.workspaceRoot, includePath));
    const pluginFactory = new stylesheet_plugin_factory_1.StylesheetPluginFactory({
        sourcemap: !!options.sourcemap,
        includePaths,
        inlineComponentData,
        tailwindConfiguration: options.tailwindConfiguration,
        postcssConfiguration: options.postcssConfiguration,
        sass: options.sass,
    }, cache);
    const plugins = [
        pluginFactory.create(sass_language_1.SassStylesheetLanguage),
        pluginFactory.create(less_language_1.LessStylesheetLanguage),
        pluginFactory.create(css_language_1.CssStylesheetLanguage),
        (0, css_resource_plugin_1.createCssResourcePlugin)(cache),
    ];
    if (options.inlineFonts) {
        plugins.unshift((0, css_inline_fonts_plugin_1.createCssInlineFontsPlugin)({ cache, cacheOptions: options.cacheOptions }));
    }
    return {
        absWorkingDir: options.workspaceRoot,
        bundle: true,
        entryNames: options.outputNames.bundles,
        assetNames: options.outputNames.media,
        logLevel: 'silent',
        minify: options.optimization,
        metafile: true,
        sourcemap: options.sourcemap,
        sourcesContent: options.sourcesContent,
        outdir: options.workspaceRoot,
        write: false,
        platform: 'browser',
        target: options.target,
        preserveSymlinks: options.preserveSymlinks,
        external: options.externalDependencies,
        publicPath: options.publicPath,
        conditions: ['style', 'sass', 'less', options.optimization ? 'production' : 'development'],
        mainFields: ['style', 'sass'],
        // Unlike JS, CSS does not have implicit file extensions in the general case.
        // Preprocessor specific behavior is handled in each stylesheet language plugin.
        resolveExtensions: [],
        plugins,
    };
}
