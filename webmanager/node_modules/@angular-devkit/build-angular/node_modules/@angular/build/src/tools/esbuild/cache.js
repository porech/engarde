"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryCache = exports.Cache = void 0;
/**
 * A cache object that allows accessing and storing key/value pairs in
 * an underlying CacheStore. This class is the primary method for consumers
 * to use a cache.
 */
class Cache {
    store;
    namespace;
    constructor(store, namespace) {
        this.store = store;
        this.namespace = namespace;
    }
    /**
     * Prefixes a key with the cache namespace if present.
     * @param key A key string to prefix.
     * @returns A prefixed key if a namespace is present. Otherwise the provided key.
     */
    withNamespace(key) {
        if (this.namespace) {
            return `${this.namespace}:${key}`;
        }
        return key;
    }
    /**
     * Gets the value associated with a provided key if available.
     * Otherwise, creates a value using the factory creator function, puts the value
     * in the cache, and returns the new value.
     * @param key A key associated with the value.
     * @param creator A factory function for the value if no value is present.
     * @returns A value associated with the provided key.
     */
    async getOrCreate(key, creator) {
        const namespacedKey = this.withNamespace(key);
        let value = await this.store.get(namespacedKey);
        if (value === undefined) {
            value = await creator();
            await this.store.set(namespacedKey, value);
        }
        return value;
    }
    /**
     * Gets the value associated with a provided key if available.
     * @param key A key associated with the value.
     * @returns A value associated with the provided key if present. Otherwise, `undefined`.
     */
    async get(key) {
        const value = await this.store.get(this.withNamespace(key));
        return value;
    }
    /**
     * Puts a value in the cache and associates it with the provided key.
     * If the key is already present, the value is updated instead.
     * @param key A key associated with the value.
     * @param value A value to put in the cache.
     */
    async put(key, value) {
        await this.store.set(this.withNamespace(key), value);
    }
}
exports.Cache = Cache;
/**
 * A lightweight in-memory cache implementation based on a JavaScript Map object.
 */
class MemoryCache extends Cache {
    constructor() {
        super(new Map());
    }
    /**
     * Removes all entries from the cache instance.
     */
    clear() {
        this.store.clear();
    }
    /**
     * Provides all the values currently present in the cache instance.
     * @returns An iterable of all values in the cache.
     */
    values() {
        return this.store.values();
    }
    /**
     * Provides all the keys/values currently present in the cache instance.
     * @returns An iterable of all key/value pairs in the cache.
     */
    entries() {
        return this.store.entries();
    }
}
exports.MemoryCache = MemoryCache;
