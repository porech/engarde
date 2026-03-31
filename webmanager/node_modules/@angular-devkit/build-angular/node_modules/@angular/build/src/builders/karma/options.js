"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeOptions = normalizeOptions;
const node_path_1 = require("node:path");
function normalizeOptions(context, options) {
    const { sourceMap, karmaConfig, browsers, watch = true, include = [], exclude = [], reporters = [], ...rest } = options;
    let normalizedBrowsers;
    if (typeof options.browsers === 'string' && options.browsers) {
        normalizedBrowsers = options.browsers.split(',').map((browser) => browser.trim());
    }
    else if (options.browsers === false) {
        normalizedBrowsers = [];
    }
    // Split along commas to make it more natural, and remove empty strings.
    const normalizedReporters = reporters
        .reduce((acc, curr) => acc.concat(curr.split(',')), [])
        .filter((x) => !!x);
    // Sourcemaps are always needed when code coverage is enabled.
    const normalizedSourceMap = options.codeCoverage
        ? {
            scripts: true,
            styles: true,
            vendor: true,
        }
        : sourceMap;
    return {
        ...rest,
        sourceMap: normalizedSourceMap,
        karmaConfig: karmaConfig ? (0, node_path_1.resolve)(context.workspaceRoot, karmaConfig) : undefined,
        reporters: normalizedReporters.length ? normalizedReporters : undefined,
        browsers: normalizedBrowsers,
        watch,
        include,
        exclude,
    };
}
