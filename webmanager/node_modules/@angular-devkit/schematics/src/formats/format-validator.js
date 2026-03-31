"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatValidator = formatValidator;
const core_1 = require("@angular-devkit/core");
async function formatValidator(data, dataSchema, formats) {
    const registry = new core_1.schema.CoreSchemaRegistry();
    for (const format of formats) {
        registry.addFormat(format);
    }
    const validator = await registry.compile(dataSchema);
    return validator(data);
}
