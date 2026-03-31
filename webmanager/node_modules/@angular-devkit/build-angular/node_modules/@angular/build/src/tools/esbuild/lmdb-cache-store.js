"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LmbdCacheStore = void 0;
const lmdb_1 = require("lmdb");
const cache_1 = require("./cache");
class LmbdCacheStore {
    cachePath;
    #cacheFileUrl;
    #db;
    constructor(cachePath) {
        this.cachePath = cachePath;
        this.#cacheFileUrl = cachePath;
    }
    #ensureCacheFile() {
        this.#db ??= (0, lmdb_1.open)({
            path: this.#cacheFileUrl,
            compression: true,
        });
        return this.#db;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async get(key) {
        const db = this.#ensureCacheFile();
        const value = db.get(key);
        return value;
    }
    has(key) {
        return this.#ensureCacheFile().doesExist(key);
    }
    async set(key, value) {
        const db = this.#ensureCacheFile();
        await db.put(key, value);
        return this;
    }
    createCache(namespace) {
        return new cache_1.Cache(this, namespace);
    }
    async close() {
        try {
            await this.#db?.close();
        }
        catch {
            // Failure to close should not be fatal
        }
    }
}
exports.LmbdCacheStore = LmbdCacheStore;
