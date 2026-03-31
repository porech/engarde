"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEOL = getEOL;
const node_os_1 = require("node:os");
const CRLF = '\r\n';
const LF = '\n';
function getEOL(content) {
    const newlines = content.match(/(?:\r?\n)/g);
    if (newlines?.length) {
        const crlf = newlines.filter((l) => l === CRLF).length;
        const lf = newlines.length - crlf;
        return crlf > lf ? CRLF : LF;
    }
    return node_os_1.EOL;
}
