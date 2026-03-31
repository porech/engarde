"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJsonObject = isJsonObject;
exports.isJsonArray = isJsonArray;
function isJsonObject(value) {
    return value != null && typeof value === 'object' && !Array.isArray(value);
}
function isJsonArray(value) {
    return Array.isArray(value);
}
