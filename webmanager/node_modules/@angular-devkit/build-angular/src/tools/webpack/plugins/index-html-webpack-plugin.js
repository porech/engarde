"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexHtmlWebpackPlugin = void 0;
const private_1 = require("@angular/build/private");
const node_path_1 = require("node:path");
const webpack_1 = require("webpack");
const error_1 = require("../../../utils/error");
const webpack_diagnostics_1 = require("../../../utils/webpack-diagnostics");
const PLUGIN_NAME = 'index-html-webpack-plugin';
class IndexHtmlWebpackPlugin extends private_1.IndexHtmlGenerator {
    options;
    _compilation;
    get compilation() {
        if (this._compilation) {
            return this._compilation;
        }
        throw new Error('compilation is undefined.');
    }
    constructor(options) {
        super(options);
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
            this._compilation = compilation;
            compilation.hooks.processAssets.tapPromise({
                name: PLUGIN_NAME,
                stage: webpack_1.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE + 1,
            }, callback);
        });
        const callback = async (assets) => {
            const files = [];
            try {
                for (const chunk of this.compilation.chunks) {
                    for (const file of chunk.files) {
                        // https://github.com/webpack/webpack/blob/1f99ad6367f2b8a6ef17cce0e058f7a67fb7db18/lib/config/defaults.js#L1000
                        if (file.endsWith('.hot-update.js') || file.endsWith('.hot-update.mjs')) {
                            continue;
                        }
                        files.push({
                            name: chunk.name ?? undefined,
                            file,
                            extension: (0, node_path_1.extname)(file),
                        });
                    }
                }
                const { csrContent: content, warnings, errors, } = await this.process({
                    files,
                    outputPath: (0, node_path_1.dirname)(this.options.outputPath),
                    baseHref: this.options.baseHref,
                    lang: this.options.lang,
                });
                assets[this.options.outputPath] = new webpack_1.sources.RawSource(content);
                warnings.forEach((msg) => (0, webpack_diagnostics_1.addWarning)(this.compilation, msg));
                errors.forEach((msg) => (0, webpack_diagnostics_1.addError)(this.compilation, msg));
            }
            catch (error) {
                (0, error_1.assertIsError)(error);
                (0, webpack_diagnostics_1.addError)(this.compilation, error.message);
            }
        };
    }
    async readAsset(path) {
        const data = this.compilation.assets[(0, node_path_1.basename)(path)].source();
        return typeof data === 'string' ? data : data.toString();
    }
    async readIndex(path) {
        return new Promise((resolve, reject) => {
            this.compilation.inputFileSystem.readFile(path, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.compilation.fileDependencies.add(path);
                resolve(data?.toString() ?? '');
            });
        });
    }
}
exports.IndexHtmlWebpackPlugin = IndexHtmlWebpackPlugin;
