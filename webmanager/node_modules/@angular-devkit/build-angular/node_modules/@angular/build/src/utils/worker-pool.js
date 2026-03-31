"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerPool = void 0;
const node_module_1 = require("node:module");
const piscina_1 = require("piscina");
class WorkerPool extends piscina_1.Piscina {
    constructor(options) {
        const piscinaOptions = {
            minThreads: 1,
            idleTimeout: 4_000,
            // Web containers do not support transferable objects with receiveOnMessagePort which
            // is used when the Atomics based wait loop is enable.
            atomics: process.versions.webcontainer ? 'disabled' : 'sync',
            recordTiming: false,
            ...options,
        };
        // Enable compile code caching if enabled for the main process (only exists on Node.js v22.8+).
        // Skip if running inside Bazel via a RUNFILES environment variable check. The cache does not work
        // well with Bazel's hermeticity requirements.
        const compileCacheDirectory = process.env['RUNFILES'] ? undefined : (0, node_module_1.getCompileCacheDir)?.();
        if (compileCacheDirectory) {
            if (typeof piscinaOptions.env === 'object') {
                piscinaOptions.env['NODE_COMPILE_CACHE'] = compileCacheDirectory;
            }
            else {
                // Default behavior of `env` option is to copy current process values
                piscinaOptions.env = {
                    ...process.env,
                    'NODE_COMPILE_CACHE': compileCacheDirectory,
                };
            }
        }
        super(piscinaOptions);
    }
}
exports.WorkerPool = WorkerPool;
