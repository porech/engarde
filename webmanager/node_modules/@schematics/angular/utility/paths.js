"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.relativePathToWorkspaceRoot = relativePathToWorkspaceRoot;
const posix_1 = require("node:path/posix");
function relativePathToWorkspaceRoot(projectRoot) {
    if (!projectRoot) {
        return '.';
    }
    return (0, posix_1.relative)((0, posix_1.join)('/', projectRoot), '/') || '.';
}
