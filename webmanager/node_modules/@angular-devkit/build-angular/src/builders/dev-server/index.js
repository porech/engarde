"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeDevServer = exports.executeDevServerBuilder = void 0;
const architect_1 = require("@angular-devkit/architect");
const builder_1 = require("./builder");
Object.defineProperty(exports, "executeDevServerBuilder", { enumerable: true, get: function () { return builder_1.execute; } });
Object.defineProperty(exports, "executeDevServer", { enumerable: true, get: function () { return builder_1.execute; } });
exports.default = (0, architect_1.createBuilder)(builder_1.execute);
