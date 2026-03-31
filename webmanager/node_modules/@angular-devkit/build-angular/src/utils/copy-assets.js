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
exports.copyAssets = copyAssets;
const fast_glob_1 = __importDefault(require("fast-glob"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
async function copyAssets(entries, basePaths, root, changed) {
    const defaultIgnore = ['.gitkeep', '**/.DS_Store', '**/Thumbs.db'];
    const outputFiles = [];
    for (const entry of entries) {
        const cwd = node_path_1.default.resolve(root, entry.input);
        const files = await (0, fast_glob_1.default)(entry.glob, {
            cwd,
            dot: true,
            ignore: entry.ignore ? defaultIgnore.concat(entry.ignore) : defaultIgnore,
            followSymbolicLinks: entry.followSymlinks,
        });
        const directoryExists = new Set();
        for (const file of files) {
            const src = node_path_1.default.join(cwd, file);
            if (changed && !changed.has(src)) {
                continue;
            }
            const filePath = entry.flatten ? node_path_1.default.basename(file) : file;
            outputFiles.push({ source: src, destination: node_path_1.default.join(entry.output, filePath) });
            for (const base of basePaths) {
                const dest = node_path_1.default.join(base, entry.output, filePath);
                const dir = node_path_1.default.dirname(dest);
                if (!directoryExists.has(dir)) {
                    if (!node_fs_1.default.existsSync(dir)) {
                        node_fs_1.default.mkdirSync(dir, { recursive: true });
                    }
                    directoryExists.add(dir);
                }
                node_fs_1.default.copyFileSync(src, dest, node_fs_1.default.constants.COPYFILE_FICLONE);
            }
        }
    }
    return outputFiles;
}
