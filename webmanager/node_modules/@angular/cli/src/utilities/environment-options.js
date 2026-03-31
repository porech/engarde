"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.forceTty = exports.forceAutocomplete = exports.ngDebug = exports.disableVersionCheck = exports.isCI = exports.analyticsDisabled = void 0;
/** A set of strings that are considered "truthy" when parsing environment variables. */
const TRUTHY_VALUES = new Set(['1', 'true']);
/** A set of strings that are considered "falsy" when parsing environment variables. */
const FALSY_VALUES = new Set(['0', 'false']);
/**
 * Checks if an environment variable is present and has a non-empty value.
 * @param variable The environment variable to check.
 * @returns `true` if the variable is a non-empty string.
 */
function isPresent(variable) {
    return typeof variable === 'string' && variable !== '';
}
/**
 * Parses an environment variable into a boolean or undefined.
 * @returns `true` if the variable is truthy ('1', 'true').
 * @returns `false` if the variable is falsy ('0', 'false').
 * @returns `undefined` if the variable is not present or has an unknown value.
 */
function parseTristate(variable) {
    if (!isPresent(variable)) {
        return undefined;
    }
    const value = variable.toLowerCase();
    if (TRUTHY_VALUES.has(value)) {
        return true;
    }
    if (FALSY_VALUES.has(value)) {
        return false;
    }
    return undefined;
}
/** Disables all analytics reporting when the `NG_CLI_ANALYTICS` environment variable is set to '0' or 'false'. */
exports.analyticsDisabled = parseTristate(process.env['NG_CLI_ANALYTICS']) === false;
/** Identifies when the CLI is running in a Continuous Integration environment. */
exports.isCI = parseTristate(process.env['CI']) === true;
/** Disables the automatic version check when the `NG_DISABLE_VERSION_CHECK` environment variable is enabled. */
exports.disableVersionCheck = parseTristate(process.env['NG_DISABLE_VERSION_CHECK']) === true;
/** Enables debugging messages when the `NG_DEBUG` environment variable is enabled. */
exports.ngDebug = parseTristate(process.env['NG_DEBUG']) === true;
/**
 * Forces the autocomplete script to be generated.
 * The `NG_FORCE_AUTOCOMPLETE` environment variable can be 'true', 'false', or undefined (for default behavior).
 */
exports.forceAutocomplete = parseTristate(process.env['NG_FORCE_AUTOCOMPLETE']);
/**
 * When enabled, forces TTY mode.
 * The `NG_FORCE_TTY` environment variable can be 'true', 'false', or undefined (for default behavior).
 */
exports.forceTty = parseTristate(process.env['NG_FORCE_TTY']);
