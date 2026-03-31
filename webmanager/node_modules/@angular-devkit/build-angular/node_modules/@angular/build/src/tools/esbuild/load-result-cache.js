"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryLoadResultCache = void 0;
exports.createCachedLoad = createCachedLoad;
const node_path_1 = require("node:path");
function createCachedLoad(cache, callback) {
    if (cache === undefined) {
        return callback;
    }
    return async (args) => {
        const loadCacheKey = `${args.namespace}:${args.path}`;
        let result = cache.get(loadCacheKey);
        if (result === undefined) {
            result = await callback(args);
            // Do not cache null or undefined
            if (result) {
                // Ensure requested path is included if it was a resolved file
                if (args.namespace === 'file') {
                    result.watchFiles ??= [];
                    result.watchFiles.push(args.path);
                }
                await cache.put(loadCacheKey, result);
            }
        }
        return result;
    };
}
class MemoryLoadResultCache {
    #loadResults = new Map();
    #fileDependencies = new Map();
    get(path) {
        return this.#loadResults.get(path);
    }
    async put(path, result) {
        this.#loadResults.set(path, result);
        if (result.watchFiles) {
            for (const watchFile of result.watchFiles) {
                // Normalize the watch file path to ensure OS consistent paths
                const normalizedWatchFile = (0, node_path_1.normalize)(watchFile);
                let affected = this.#fileDependencies.get(normalizedWatchFile);
                if (affected === undefined) {
                    affected = new Set();
                    this.#fileDependencies.set(normalizedWatchFile, affected);
                }
                affected.add(path);
            }
        }
    }
    invalidate(path) {
        const affectedPaths = this.#fileDependencies.get(path);
        let found = false;
        if (affectedPaths) {
            for (const affected of affectedPaths) {
                if (this.#loadResults.delete(affected)) {
                    found = true;
                }
            }
            this.#fileDependencies.delete(path);
        }
        return found;
    }
    get watchFiles() {
        // this.#loadResults.keys() is not included here because the keys
        // are namespaced request paths and not disk-based file paths.
        return [...this.#fileDependencies.keys()];
    }
}
exports.MemoryLoadResultCache = MemoryLoadResultCache;
