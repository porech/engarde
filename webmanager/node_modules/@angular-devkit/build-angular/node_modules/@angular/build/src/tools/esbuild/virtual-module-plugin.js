"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVirtualModulePlugin = createVirtualModulePlugin;
const load_result_cache_1 = require("./load-result-cache");
/**
 * Creates an esbuild plugin that generated virtual modules.
 *
 * @returns An esbuild plugin.
 */
function createVirtualModulePlugin(options) {
    const { namespace, external, transformPath: pathTransformer, loadContent, cache, entryPointOnly = true, } = options;
    return {
        name: namespace.replace(/[/:]/g, '-'),
        setup(build) {
            build.onResolve({ filter: new RegExp('^' + namespace) }, ({ kind, path }) => {
                if (entryPointOnly && kind !== 'entry-point') {
                    return null;
                }
                return {
                    path: pathTransformer?.(path) ?? path,
                    namespace,
                };
            });
            if (external) {
                build.onResolve({ filter: /./, namespace }, ({ path }) => {
                    return {
                        path,
                        external: true,
                    };
                });
            }
            build.onLoad({ filter: /./, namespace }, (0, load_result_cache_1.createCachedLoad)(cache, (args) => loadContent(args, build)));
        },
    };
}
