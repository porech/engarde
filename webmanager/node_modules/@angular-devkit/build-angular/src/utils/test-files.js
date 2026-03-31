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
exports.findTestFiles = findTestFiles;
const fast_glob_1 = __importDefault(require("fast-glob"));
/**
 * Finds all test files in the project.
 *
 * @param options The builder options describing where to find tests.
 * @param workspaceRoot The path to the root directory of the workspace.
 * @param glob A promisified implementation of the `glob` module. Only intended for
 *     testing purposes.
 * @returns A set of all test files in the project.
 */
async function findTestFiles(include, exclude, workspaceRoot, glob = fast_glob_1.default) {
    const globOptions = {
        cwd: workspaceRoot,
        ignore: ['node_modules/**'].concat(exclude),
        braceExpansion: false, // Do not expand `a{b,c}` to `ab,ac`.
        extglob: false, // Disable "extglob" patterns.
    };
    const included = await Promise.all(include.map((pattern) => glob(pattern, globOptions)));
    // Flatten and deduplicate any files found in multiple include patterns.
    return new Set(included.flat());
}
