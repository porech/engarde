"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDirectoryPath = normalizeDirectoryPath;
exports.getProjectRootPaths = getProjectRootPaths;
const node_path_1 = require("node:path");
/**
 * Normalize a directory path string.
 * Currently only removes a trailing slash if present.
 * @param path A path string.
 * @returns A normalized path string.
 */
function normalizeDirectoryPath(path) {
    const last = path[path.length - 1];
    if (last === '/' || last === '\\') {
        return path.slice(0, -1);
    }
    return path;
}
function getProjectRootPaths(workspaceRoot, projectMetadata) {
    const projectRoot = normalizeDirectoryPath((0, node_path_1.join)(workspaceRoot, projectMetadata.root ?? ''));
    const rawSourceRoot = projectMetadata.sourceRoot;
    const projectSourceRoot = normalizeDirectoryPath(rawSourceRoot === undefined ? (0, node_path_1.join)(projectRoot, 'src') : (0, node_path_1.join)(workspaceRoot, rawSourceRoot));
    return { projectRoot, projectSourceRoot };
}
