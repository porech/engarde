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
exports.writeTestFiles = writeTestFiles;
const build_1 = require("@angular/build");
const private_1 = require("@angular/build/private");
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
async function writeTestFiles(files, testDir) {
    const directoryExists = new Set();
    // Writes the test related output files to disk and ensures the containing directories are present
    await (0, private_1.emitFilesToDisk)(Object.entries(files), async ([filePath, file]) => {
        if (file.type !== build_1.BuildOutputFileType.Browser && file.type !== build_1.BuildOutputFileType.Media) {
            return;
        }
        const fullFilePath = node_path_1.default.join(testDir, filePath);
        // Ensure output subdirectories exist
        const fileBasePath = node_path_1.default.dirname(fullFilePath);
        if (fileBasePath && !directoryExists.has(fileBasePath)) {
            await promises_1.default.mkdir(fileBasePath, { recursive: true });
            directoryExists.add(fileBasePath);
        }
        if (file.origin === 'memory') {
            // Write file contents
            await promises_1.default.writeFile(fullFilePath, file.contents);
        }
        else {
            // Copy file contents
            await promises_1.default.copyFile(file.inputPath, fullFilePath, promises_1.default.constants.COPYFILE_FICLONE);
        }
    });
}
