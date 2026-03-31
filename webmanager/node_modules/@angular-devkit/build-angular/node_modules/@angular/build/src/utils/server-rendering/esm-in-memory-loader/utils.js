"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMPORT_EXEC_ARGV = void 0;
const node_path_1 = require("node:path");
const node_url_1 = require("node:url");
exports.IMPORT_EXEC_ARGV = '--import=' + (0, node_url_1.pathToFileURL)((0, node_path_1.join)(__dirname, 'register-hooks.js')).href;
