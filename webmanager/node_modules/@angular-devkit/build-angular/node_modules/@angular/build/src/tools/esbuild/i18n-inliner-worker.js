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
exports.default = inlineFile;
exports.inlineCode = inlineCode;
const remapping_1 = __importDefault(require("@ampproject/remapping"));
const core_1 = require("@babel/core");
const node_assert_1 = __importDefault(require("node:assert"));
const node_worker_threads_1 = require("node:worker_threads");
const error_1 = require("../../utils/error");
const load_esm_1 = require("../../utils/load-esm");
// Extract the application files and common options used for inline requests from the Worker context
// TODO: Evaluate overall performance difference of passing translations here as well
const { files, missingTranslation, shouldOptimize } = (node_worker_threads_1.workerData || {});
/**
 * Inlines the provided locale and translation into a JavaScript file that contains `$localize` usage.
 * This function is the main entry for the Worker's action that is called by the worker pool.
 *
 * @param request An InlineRequest object representing the options for inlining
 * @returns An object containing the inlined file and optional map content.
 */
async function inlineFile(request) {
    const data = files.get(request.filename);
    (0, node_assert_1.default)(data !== undefined, `Invalid inline request for file '${request.filename}'.`);
    const code = await data.text();
    const map = await files.get(request.filename + '.map')?.text();
    const result = await transformWithBabel(code, map && JSON.parse(map), request);
    return {
        file: request.filename,
        code: result.code,
        map: result.map,
        messages: result.diagnostics.messages,
    };
}
/**
 * Inlines the provided locale and translation into JavaScript code that contains `$localize` usage.
 * This function is a secondary entry primarily for use with component HMR update modules.
 *
 * @param request An InlineRequest object representing the options for inlining
 * @returns An object containing the inlined code.
 */
async function inlineCode(request) {
    const result = await transformWithBabel(request.code, undefined, request);
    return {
        output: result.code,
        messages: result.diagnostics.messages,
    };
}
/**
 * Cached instance of the `@angular/localize/tools` module.
 * This is used to remove the need to repeatedly import the module per file translation.
 */
let localizeToolsModule;
/**
 * Attempts to load the `@angular/localize/tools` module containing the functionality to
 * perform the file translations.
 * This module must be dynamically loaded as it is an ESM module and this file is CommonJS.
 */
async function loadLocalizeTools() {
    // Load ESM `@angular/localize/tools` using the TypeScript dynamic import workaround.
    // Once TypeScript provides support for keeping the dynamic import this workaround can be
    // changed to a direct dynamic import.
    localizeToolsModule ??= await (0, load_esm_1.loadEsmModule)('@angular/localize/tools');
    return localizeToolsModule;
}
/**
 * Creates the needed Babel plugins to inline a given locale and translation for a JavaScript file.
 * @param locale A string containing the locale specifier to use.
 * @param translation A object record containing locale specific messages to use.
 * @returns An array of Babel plugins.
 */
async function createI18nPlugins(locale, translation) {
    const { Diagnostics, makeEs2015TranslatePlugin } = await loadLocalizeTools();
    const plugins = [];
    const diagnostics = new Diagnostics();
    plugins.push(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    makeEs2015TranslatePlugin(diagnostics, (translation || {}), {
        missingTranslation: translation === undefined ? 'ignore' : missingTranslation,
    }));
    // Create a plugin to replace the locale specifier constant inject by the build system with the actual specifier
    plugins.push({
        visitor: {
            StringLiteral(path) {
                if (path.node.value === '___NG_LOCALE_INSERT___') {
                    path.replaceWith(core_1.types.stringLiteral(locale));
                }
            },
        },
    });
    return { diagnostics, plugins };
}
/**
 * Transforms a JavaScript file using Babel to inline the request locale and translation.
 * @param code A string containing the JavaScript code to transform.
 * @param map A sourcemap object for the provided JavaScript code.
 * @param options The inline request options to use.
 * @returns An object containing the code, map, and diagnostics from the transformation.
 */
async function transformWithBabel(code, map, options) {
    let ast;
    try {
        ast = (0, core_1.parseSync)(code, {
            babelrc: false,
            configFile: false,
            sourceType: 'unambiguous',
            filename: options.filename,
        });
    }
    catch (error) {
        (0, error_1.assertIsError)(error);
        // Make the error more readable.
        // Same errors will contain the full content of the file as the error message
        // Which makes it hard to find the actual error message.
        const index = error.message.indexOf(')\n');
        const msg = index !== -1 ? error.message.slice(0, index + 1) : error.message;
        throw new Error(`${msg}\nAn error occurred inlining file "${options.filename}"`);
    }
    if (!ast) {
        throw new Error(`Unknown error occurred inlining file "${options.filename}"`);
    }
    const { diagnostics, plugins } = await createI18nPlugins(options.locale, options.translation);
    const transformResult = await (0, core_1.transformFromAstAsync)(ast, code, {
        filename: options.filename,
        // false is a valid value but not included in the type definition
        inputSourceMap: false,
        sourceMaps: !!map,
        compact: shouldOptimize,
        configFile: false,
        babelrc: false,
        browserslistConfigFile: false,
        plugins,
    });
    if (!transformResult || !transformResult.code) {
        throw new Error(`Unknown error occurred processing bundle for "${options.filename}".`);
    }
    let outputMap;
    if (map && transformResult.map) {
        outputMap = (0, remapping_1.default)([transformResult.map, map], () => null);
    }
    return { code: transformResult.code, map: outputMap && JSON.stringify(outputMap), diagnostics };
}
