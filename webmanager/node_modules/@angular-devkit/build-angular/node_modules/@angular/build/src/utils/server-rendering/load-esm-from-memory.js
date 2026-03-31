"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEsmModuleFromMemory = loadEsmModuleFromMemory;
const error_1 = require("../error");
const load_esm_1 = require("../load-esm");
function loadEsmModuleFromMemory(path) {
    return (0, load_esm_1.loadEsmModule)(new URL(path, 'memory://')).catch((e) => {
        (0, error_1.assertIsError)(e);
        // While the error is an 'instanceof Error', it is extended with non transferable properties
        // and cannot be transferred from a worker when using `--import`. This results in the error object
        // displaying as '[Object object]' when read outside of the worker. Therefore, we reconstruct the error message here.
        const error = new Error(e.message);
        error.stack = e.stack;
        error.name = e.name;
        error.code = e.code;
        throw error;
    });
}
