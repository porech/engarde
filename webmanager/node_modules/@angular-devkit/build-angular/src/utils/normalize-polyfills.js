"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePolyfills = normalizePolyfills;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
function normalizePolyfills(polyfills, root) {
    if (!polyfills) {
        return [];
    }
    const polyfillsList = Array.isArray(polyfills) ? polyfills : [polyfills];
    return polyfillsList.map((p) => {
        const resolvedPath = (0, node_path_1.resolve)(root, p);
        // If file doesn't exist, let the bundle resolve it using node module resolution.
        return (0, node_fs_1.existsSync)(resolvedPath) ? resolvedPath : p;
    });
}
