"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureOutputPaths = ensureOutputPaths;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
function ensureOutputPaths(baseOutputPath, i18n) {
    const outputPaths = i18n.shouldInline
        ? [...i18n.inlineLocales].map((l) => [
            l,
            i18n.flatOutput ? baseOutputPath : (0, node_path_1.join)(baseOutputPath, i18n.locales[l].subPath),
        ])
        : [['', baseOutputPath]];
    for (const [, outputPath] of outputPaths) {
        if (!(0, node_fs_1.existsSync)(outputPath)) {
            (0, node_fs_1.mkdirSync)(outputPath, { recursive: true });
        }
    }
    return new Map(outputPaths);
}
