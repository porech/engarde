"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToFileBuffer = stringToFileBuffer;
exports.fileBufferToString = fileBufferToString;
const node_util_1 = require("node:util");
function stringToFileBuffer(str) {
    return new node_util_1.TextEncoder().encode(str).buffer;
}
function fileBufferToString(fileBuffer) {
    if (fileBuffer.toString.length === 1) {
        return fileBuffer.toString('utf-8');
    }
    return new node_util_1.TextDecoder('utf-8').decode(new Uint8Array(fileBuffer));
}
