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
/**
 * Gets the end-of-line sequence from a string.
 *
 * This function analyzes the given string to determine the most frequent end-of-line (EOL)
 * sequence. It counts the occurrences of carriage return line feed (`\r\n`) and
 * line feed (`\n`).
 *
 * @param content The string to process.
 * @returns The most frequent EOL sequence. If `\r\n` is more frequent, it returns `\r\n`.
 * Otherwise (including ties), it returns `\n`. If no newlines are found, it falls back
 * to the operating system's default EOL sequence.
 */
function getEOL(content) {
    const newlines = content.match(/(?:\r?\n)/g);
    if (newlines?.length) {
        const crlf = newlines.filter((l) => l === CRLF).length;
        const lf = newlines.length - crlf;
        return crlf > lf ? CRLF : LF;
    }
    return node_os_1.EOL;
}
