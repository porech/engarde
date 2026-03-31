"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewriteForBazel = rewriteForBazel;
const node_path_1 = require("node:path");
const bazelBinDirectory = process.env['BAZEL_BINDIR'];
const bazelExecRoot = process.env['JS_BINARY__EXECROOT'];
function rewriteForBazel(path) {
    if (!bazelBinDirectory || !bazelExecRoot) {
        return path;
    }
    const fromExecRoot = (0, node_path_1.relative)(bazelExecRoot, path);
    if (!fromExecRoot.startsWith('..')) {
        return path;
    }
    const fromBinDirectory = (0, node_path_1.relative)(bazelBinDirectory, path);
    if (fromBinDirectory.startsWith('..')) {
        return path;
    }
    return (0, node_path_1.join)(bazelExecRoot, fromBinDirectory);
}
