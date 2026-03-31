"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const architect_1 = require("@angular-devkit/architect");
exports.default = (0, architect_1.createBuilder)((_options, context) => {
    context.logger.error('Protractor has reached end-of-life and is no longer supported. For additional information and alternatives, please see https://blog.angular.dev/protractor-deprecation-update-august-2023-2beac7402ce0.');
    return { success: false };
});
