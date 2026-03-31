"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectIndexFiles = getProjectIndexFiles;
const posix_1 = require("node:path/posix");
const project_targets_1 = require("./project-targets");
/**
 * Gets the path of the index file in the given project.
 * This only searches the base options for each target and not any defined target configurations.
 */
function getProjectIndexFiles(project) {
    var _a, _b;
    // Use a Set to remove duplicate index files referenced in multiple build targets of a project.
    const paths = new Set();
    for (const target of (0, project_targets_1.getProjectBuildTargets)(project)) {
        const indexValue = (_a = target.options) === null || _a === void 0 ? void 0 : _a['index'];
        switch (typeof indexValue) {
            case 'string':
                // "index": "src/index.html"
                paths.add(indexValue);
                break;
            case 'object':
                // "index": { "input": "src/index.html", ... }
                if (indexValue && 'input' in indexValue) {
                    paths.add(indexValue['input']);
                }
                break;
            case 'undefined':
                // v20+ supports an optional index field; default of `<project_source_root>/index.html`
                // `project_source_root` is the project level `sourceRoot`; default of `<project_root>/src`
                paths.add((0, posix_1.join)((_b = project.sourceRoot) !== null && _b !== void 0 ? _b : (0, posix_1.join)(project.root, 'src'), 'index.html'));
                break;
        }
    }
    return Array.from(paths);
}
//# sourceMappingURL=project-index-file.js.map