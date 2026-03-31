"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const node_module_1 = require("node:module");
const node_url_1 = require("node:url");
const node_worker_threads_1 = require("node:worker_threads");
(0, node_module_1.register)('./loader-hooks.js', { parentURL: (0, node_url_1.pathToFileURL)(__filename), data: node_worker_threads_1.workerData });
