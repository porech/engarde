"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.time = time;
exports.timeEnd = timeEnd;
// Internal benchmark reporting flag.
// Use with CLI --no-progress flag for best results.
// This should be false for commited code.
const _benchmark = false;
/* eslint-disable no-console */
function time(label) {
    if (_benchmark) {
        console.time(label);
    }
}
function timeEnd(label) {
    if (_benchmark) {
        console.timeEnd(label);
    }
}
