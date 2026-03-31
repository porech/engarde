"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeOptions = mergeOptions;
const core_1 = require("@angular-devkit/core");
function mergeOptions(baseOptions, overrideOptions) {
    if (!overrideOptions) {
        return { ...baseOptions };
    }
    const options = {
        ...baseOptions,
        ...overrideOptions,
    };
    // For object-object overrides, we merge one layer deep.
    for (const key of Object.keys(overrideOptions)) {
        const override = overrideOptions[key];
        const base = baseOptions[key];
        if (core_1.json.isJsonObject(base) && core_1.json.isJsonObject(override)) {
            options[key] = { ...base, ...override };
        }
    }
    return options;
}
