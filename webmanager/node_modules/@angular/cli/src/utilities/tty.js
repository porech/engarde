"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTTY = isTTY;
const environment_options_1 = require("./environment-options");
/**
 * Determines if the `stream` is a TTY.
 *
 * @param stream A NodeJS stream to check. Defaults to `process.stdout`.
 * @returns `true` if the `stream` is a TTY, `false` otherwise. This detection is overridden
 * by the `NG_FORCE_TTY` environment variable. In a CI environment, this will also be `false`
 * unless `NG_FORCE_TTY` is set.
 */
function isTTY(stream = process.stdout) {
    return environment_options_1.forceTty ?? (!!stream.isTTY && !environment_options_1.isCI);
}
