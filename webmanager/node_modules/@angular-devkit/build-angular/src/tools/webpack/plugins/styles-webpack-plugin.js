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
exports.StylesWebpackPlugin = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const error_1 = require("../../../utils/error");
const webpack_diagnostics_1 = require("../../../utils/webpack-diagnostics");
/**
 * The name of the plugin provided to Webpack when tapping Webpack compiler hooks.
 */
const PLUGIN_NAME = 'styles-webpack-plugin';
class StylesWebpackPlugin {
    options;
    compilation;
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        const { entryPoints, preserveSymlinks, root } = this.options;
        const resolver = compiler.resolverFactory.get('global-styles', {
            conditionNames: ['sass', 'less', 'style'],
            mainFields: ['sass', 'less', 'style', 'main', '...'],
            extensions: ['.scss', '.sass', '.less', '.css'],
            restrictions: [/\.((le|sa|sc|c)ss)$/i],
            preferRelative: true,
            useSyncFileSystemCalls: true,
            symlinks: !preserveSymlinks,
            fileSystem: compiler.inputFileSystem ?? undefined,
        });
        const webpackOptions = compiler.options;
        compiler.hooks.environment.tap(PLUGIN_NAME, () => {
            const entry = typeof webpackOptions.entry === 'function' ? webpackOptions.entry() : webpackOptions.entry;
            webpackOptions.entry = async () => {
                const entrypoints = await entry;
                for (const [bundleName, paths] of Object.entries(entryPoints)) {
                    entrypoints[bundleName] ??= {};
                    const entryImport = (entrypoints[bundleName].import ??= []);
                    for (const path of paths) {
                        try {
                            const resolvedPath = resolver.resolveSync({}, root, path);
                            if (resolvedPath) {
                                entryImport.push(`${resolvedPath}?ngGlobalStyle`);
                            }
                            else {
                                (0, node_assert_1.default)(this.compilation, 'Compilation cannot be undefined.');
                                (0, webpack_diagnostics_1.addError)(this.compilation, `Cannot resolve '${path}'.`);
                            }
                        }
                        catch (error) {
                            (0, node_assert_1.default)(this.compilation, 'Compilation cannot be undefined.');
                            (0, error_1.assertIsError)(error);
                            (0, webpack_diagnostics_1.addError)(this.compilation, error.message);
                        }
                    }
                }
                return entrypoints;
            };
        });
        compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
            this.compilation = compilation;
        });
    }
}
exports.StylesWebpackPlugin = StylesWebpackPlugin;
