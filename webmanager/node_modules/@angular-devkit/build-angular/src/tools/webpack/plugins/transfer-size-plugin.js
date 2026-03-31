"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferSizePlugin = void 0;
const node_util_1 = require("node:util");
const node_zlib_1 = require("node:zlib");
const webpack_diagnostics_1 = require("../../../utils/webpack-diagnostics");
const brotliCompressAsync = (0, node_util_1.promisify)(node_zlib_1.brotliCompress);
const PLUGIN_NAME = 'angular-transfer-size-estimator';
class TransferSizePlugin {
    constructor() { }
    apply(compiler) {
        compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
            compilation.hooks.processAssets.tapPromise({
                name: PLUGIN_NAME,
                stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ANALYSE,
            }, async (compilationAssets) => {
                const actions = [];
                for (const assetName of Object.keys(compilationAssets)) {
                    if (!assetName.endsWith('.js') && !assetName.endsWith('.css')) {
                        continue;
                    }
                    const scriptAsset = compilation.getAsset(assetName);
                    if (!scriptAsset || scriptAsset.source.size() <= 0) {
                        continue;
                    }
                    actions.push(brotliCompressAsync(scriptAsset.source.source())
                        .then((result) => {
                        compilation.updateAsset(assetName, (s) => s, (assetInfo) => ({
                            ...assetInfo,
                            estimatedTransferSize: result.length,
                        }));
                    })
                        .catch((error) => {
                        (0, webpack_diagnostics_1.addWarning)(compilation, `Unable to calculate estimated transfer size for '${assetName}'. Reason: ${error.message}`);
                    }));
                }
                await Promise.all(actions);
            });
        });
    }
}
exports.TransferSizePlugin = TransferSizePlugin;
