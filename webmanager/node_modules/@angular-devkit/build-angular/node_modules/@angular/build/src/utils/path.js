"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPosixPath = toPosixPath;
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const WINDOWS_PATH_SEPERATOR_REGEXP = /\\/g;
/**
 * Converts a Windows-style file path to a POSIX-compliant path.
 *
 * This function replaces all backslashes (`\`) with forward slashes (`/`).
 * It is a no-op on POSIX systems (e.g., Linux, macOS), as the conversion
 * only runs on Windows (`win32`).
 *
 * @param path - The file path to convert.
 * @returns The POSIX-compliant file path.
 *
 * @example
 * ```ts
 * // On a Windows system:
 * toPosixPath('C:\\Users\\Test\\file.txt');
 * // => 'C:/Users/Test/file.txt'
 *
 * // On a POSIX system (Linux/macOS):
 * toPosixPath('/home/user/file.txt');
 * // => '/home/user/file.txt'
 * ```
 */
function toPosixPath(path) {
    return node_process_1.platform === 'win32' ? path.replace(WINDOWS_PATH_SEPERATOR_REGEXP, node_path_1.posix.sep) : path;
}
