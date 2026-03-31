/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
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
export declare function getEOL(content: string): string;
