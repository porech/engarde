/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
/**
 * Asserts that a given value is an Error-like object.
 *
 * If the value is not an `Error` or an object with `name` and `message` properties,
 * this function will throw an `AssertionError` with a descriptive message.
 *
 * @param value The value to check.
 */
export declare function assertIsError(value: unknown): asserts value is Error & {
    code?: string;
};
