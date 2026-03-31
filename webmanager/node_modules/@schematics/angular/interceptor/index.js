"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const generate_from_files_1 = require("../utility/generate-from-files");
function default_1(options) {
    const templateFilesDirectory = options.functional ? './functional-files' : './class-files';
    return (0, generate_from_files_1.generateFromFiles)({ ...options, templateFilesDirectory });
}
