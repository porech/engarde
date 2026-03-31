/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
/**
 * Parses and validates input and output initializer function options.
 *
 * This currently only parses the `alias` option and returns it. The other
 * options for signal inputs are runtime constructs that aren't relevant at
 * compile time.
 */
export declare function parseAndValidateInputAndOutputOptions(optionsNode: ts.Expression): {
    alias: string | undefined;
};
