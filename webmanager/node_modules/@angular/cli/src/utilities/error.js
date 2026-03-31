"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertIsError = assertIsError;
const node_assert_1 = __importDefault(require("node:assert"));
const node_util_1 = require("node:util");
/**
 * Checks if a given value is an Error-like object.
 *
 * This type guard checks if the value is an instance of `Error` or if it's an object
 * with `name` and `message` properties. This is useful for identifying error-like
 * objects that may not be direct instances of `Error` (e.g., from RxJs).
 *
 * @param value The value to check.
 * @returns `true` if the value is an Error-like object, `false` otherwise.
 */
function isError(value) {
    return (value instanceof Error ||
        (typeof value === 'object' && value !== null && 'name' in value && 'message' in value));
}
/**
 * Asserts that a given value is an Error-like object.
 *
 * If the value is not an `Error` or an object with `name` and `message` properties,
 * this function will throw an `AssertionError` with a descriptive message.
 *
 * @param value The value to check.
 */
function assertIsError(value) {
    (0, node_assert_1.default)(isError(value), `Expected a value to be an Error-like object, but received: ${(0, node_util_1.inspect)(value)}`);
}
