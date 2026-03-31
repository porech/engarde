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
exports.default = default_1;
const remapping_1 = __importDefault(require("@ampproject/remapping"));
const terser_1 = require("terser");
const esbuild_executor_1 = require("./esbuild-executor");
/**
 * The cached esbuild executor.
 * This will automatically use the native or WASM version based on platform and availability
 * with the native version given priority due to its superior performance.
 */
let esbuild;
/**
 * Handles optimization requests sent from the main thread via the `JavaScriptOptimizerPlugin`.
 */
async function default_1({ asset, options }) {
    // esbuild is used as a first pass
    const esbuildResult = await optimizeWithEsbuild(asset.code, asset.name, options);
    if (isEsBuildFailure(esbuildResult)) {
        return {
            name: asset.name,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            errors: await esbuild.formatMessages(esbuildResult.errors, { kind: 'error' }),
        };
    }
    // terser is used as a second pass
    const terserResult = await optimizeWithTerser(asset.name, esbuildResult.code, options.sourcemap, options.advanced);
    // Merge intermediate sourcemaps with input sourcemap if enabled
    let fullSourcemap;
    if (options.sourcemap) {
        const partialSourcemaps = [];
        if (esbuildResult.map) {
            partialSourcemaps.unshift(JSON.parse(esbuildResult.map));
        }
        if (terserResult.map) {
            partialSourcemaps.unshift(terserResult.map);
        }
        if (asset.map) {
            partialSourcemaps.push(asset.map);
        }
        fullSourcemap = (0, remapping_1.default)(partialSourcemaps, () => null);
    }
    return { name: asset.name, code: terserResult.code, map: fullSourcemap };
}
/**
 * Optimizes a JavaScript asset using esbuild.
 *
 * @param content The JavaScript asset source content to optimize.
 * @param name The name of the JavaScript asset. Used to generate source maps.
 * @param options The optimization request options to apply to the content.
 * @returns A promise that resolves with the optimized code, source map, and any warnings.
 */
async function optimizeWithEsbuild(content, name, options) {
    if (!esbuild) {
        esbuild = new esbuild_executor_1.EsbuildExecutor(options.alwaysUseWasm);
    }
    try {
        return await esbuild.transform(content, {
            minifyIdentifiers: !options.keepIdentifierNames,
            minifySyntax: true,
            // NOTE: Disabling whitespace ensures unused pure annotations are kept
            minifyWhitespace: false,
            pure: ['forwardRef'],
            legalComments: options.removeLicenses ? 'none' : 'inline',
            sourcefile: name,
            sourcemap: options.sourcemap && 'external',
            define: options.define,
            target: options.target,
        });
    }
    catch (error) {
        if (isEsBuildFailure(error)) {
            return error;
        }
        throw error;
    }
}
/**
 * Optimizes a JavaScript asset using terser.
 *
 * @param name The name of the JavaScript asset. Used to generate source maps.
 * @param code The JavaScript asset source content to optimize.
 * @param sourcemaps If true, generate an output source map for the optimized code.
 * @param advanced Controls advanced optimizations.
 * @returns A promise that resolves with the optimized code and source map.
 */
async function optimizeWithTerser(name, code, sourcemaps, advanced) {
    const result = await (0, terser_1.minify)({ [name]: code }, {
        compress: {
            passes: advanced ? 2 : 1,
            pure_getters: advanced,
        },
        // Set to ES2015 to prevent higher level features from being introduced when browserslist
        // contains older browsers. The build system requires browsers to support ES2015 at a minimum.
        ecma: 2015,
        // esbuild in the first pass is used to minify identifiers instead of mangle here
        mangle: false,
        // esbuild in the first pass is used to minify function names
        keep_fnames: true,
        format: {
            // ASCII output is enabled here as well to prevent terser from converting back to UTF-8
            ascii_only: true,
            wrap_func_args: false,
        },
        sourceMap: sourcemaps &&
            {
                asObject: true,
                // typings don't include asObject option
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            },
    });
    if (typeof result.code !== 'string') {
        throw new Error('Terser failed for unknown reason.');
    }
    return { code: result.code, map: result.map };
}
/**
 * Determines if an unknown value is an esbuild BuildFailure error object thrown by esbuild.
 * @param value A potential esbuild BuildFailure error object.
 * @returns `true` if the object is determined to be a BuildFailure object; otherwise, `false`.
 */
function isEsBuildFailure(value) {
    return !!value && typeof value === 'object' && 'errors' in value && 'warnings' in value;
}
