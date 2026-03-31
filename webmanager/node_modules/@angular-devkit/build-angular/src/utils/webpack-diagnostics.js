"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWarning = addWarning;
exports.addError = addError;
function addWarning(compilation, message) {
    compilation.warnings.push(new compilation.compiler.webpack.WebpackError(message));
}
function addError(compilation, message) {
    compilation.errors.push(new compilation.compiler.webpack.WebpackError(message));
}
