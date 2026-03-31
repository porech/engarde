"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeOptions = normalizeOptions;
/**
 * Normalizes input options validated by the schema to a more precise and useful
 * options type in {@link JestBuilderOptions}.
 */
function normalizeOptions(schema) {
    return {
        // Options with default values can't actually be null, even if the types say so.
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        include: schema.include,
        exclude: schema.exclude,
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
        ...schema,
    };
}
