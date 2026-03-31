"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOutputDir = deleteOutputDir;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
/**
 * Delete an output directory, but error out if it's the root of the project.
 */
async function deleteOutputDir(root, outputPath, emptyOnlyDirectories) {
    const resolvedOutputPath = (0, node_path_1.resolve)(root, outputPath);
    if (resolvedOutputPath === root) {
        throw new Error('Output path MUST not be project root directory!');
    }
    const directoriesToEmpty = emptyOnlyDirectories
        ? new Set(emptyOnlyDirectories.map((directory) => (0, node_path_1.join)(resolvedOutputPath, directory)))
        : undefined;
    // Avoid removing the actual directory to avoid errors in cases where the output
    // directory is mounted or symlinked. Instead the contents are removed.
    let entries;
    try {
        entries = await (0, promises_1.readdir)(resolvedOutputPath);
    }
    catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            return;
        }
        throw error;
    }
    for (const entry of entries) {
        const fullEntry = (0, node_path_1.join)(resolvedOutputPath, entry);
        // Leave requested directories. This allows symlinks to continue to function.
        if (directoriesToEmpty?.has(fullEntry)) {
            await deleteOutputDir(resolvedOutputPath, fullEntry);
            continue;
        }
        await (0, promises_1.rm)(fullEntry, { force: true, recursive: true, maxRetries: 3 });
    }
}
