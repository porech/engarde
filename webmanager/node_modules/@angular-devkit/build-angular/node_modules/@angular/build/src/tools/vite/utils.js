"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathnameWithoutBasePath = pathnameWithoutBasePath;
exports.lookupMimeTypeFromRequest = lookupMimeTypeFromRequest;
exports.getDepOptimizationConfig = getDepOptimizationConfig;
const mrmime_1 = require("mrmime");
const node_path_1 = require("node:path");
const utils_1 = require("../esbuild/utils");
function pathnameWithoutBasePath(url, basePath) {
    const parsedUrl = new URL(url, 'http://localhost');
    const pathname = decodeURIComponent(parsedUrl.pathname);
    // slice(basePath.length - 1) to retain the trailing slash
    return basePath !== '/' && pathname.startsWith(basePath)
        ? pathname.slice(basePath.length - 1)
        : pathname;
}
function lookupMimeTypeFromRequest(url) {
    const extension = (0, node_path_1.extname)(url.split('?')[0]);
    if (extension === '.ico') {
        return 'image/x-icon';
    }
    return extension && (0, mrmime_1.lookup)(extension);
}
function getDepOptimizationConfig({ disabled, exclude, include, target, zoneless, prebundleTransformer, ssr, loader, thirdPartySourcemaps, define = {}, }) {
    const plugins = [
        {
            name: `angular-vite-optimize-deps${ssr ? '-ssr' : ''}${thirdPartySourcemaps ? '-vendor-sourcemap' : ''}`,
            setup(build) {
                build.onLoad({ filter: /\.[cm]?js$/ }, async (args) => {
                    return {
                        contents: await prebundleTransformer.transformFile(args.path),
                        loader: 'js',
                    };
                });
            },
        },
    ];
    return {
        // Exclude any explicitly defined dependencies (currently build defined externals)
        exclude,
        // NB: to disable the deps optimizer, set optimizeDeps.noDiscovery to true and optimizeDeps.include as undefined.
        // Include all implict dependencies from the external packages internal option
        include: disabled ? undefined : include,
        noDiscovery: disabled,
        // Add an esbuild plugin to run the Angular linker on dependencies
        esbuildOptions: {
            // Set esbuild supported targets.
            target,
            supported: (0, utils_1.getFeatureSupport)(target, zoneless),
            plugins,
            loader,
            define: {
                ...define,
                'ngServerMode': `${ssr}`,
            },
            resolveExtensions: ['.mjs', '.js', '.cjs'],
        },
    };
}
