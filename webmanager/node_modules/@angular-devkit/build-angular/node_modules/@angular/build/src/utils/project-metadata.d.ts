/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
/**
 * Normalize a directory path string.
 * Currently only removes a trailing slash if present.
 * @param path A path string.
 * @returns A normalized path string.
 */
export declare function normalizeDirectoryPath(path: string): string;
export declare function getProjectRootPaths(workspaceRoot: string, projectMetadata: {
    root?: string;
    sourceRoot?: string;
}): {
    projectRoot: string;
    projectSourceRoot: string;
};
