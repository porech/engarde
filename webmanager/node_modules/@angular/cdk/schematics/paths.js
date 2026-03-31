"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIGRATION_PATH = exports.COLLECTION_PATH = void 0;
const path_1 = require("path");
/** Path to the schematic collection for non-migration schematics. */
exports.COLLECTION_PATH = (0, path_1.join)(__dirname, 'collection.json');
/** Path to the schematic collection that includes the migrations. */
exports.MIGRATION_PATH = (0, path_1.join)(__dirname, 'migration.json');
//# sourceMappingURL=paths.js.map