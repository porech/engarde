/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
/**
 * @fileoverview
 * Provides infrastructure for common caching functionality within the build system.
 */
/**
 * A backing data store for one or more Cache instances.
 * The interface is intentionally designed to support using a JavaScript
 * Map instance as a potential cache store.
 */
export interface CacheStore<V> {
    /**
     * Returns the specified value from the cache store or `undefined` if not found.
     * @param key The key to retrieve from the store.
     */
    get(key: string): V | undefined | Promise<V | undefined>;
    /**
     * Returns whether the provided key is present in the cache store.
     * @param key The key to check from the store.
     */
    has(key: string): boolean | Promise<boolean>;
    /**
     * Adds a new value to the cache store if the key is not present.
     * Updates the value for the key if already present.
     * @param key The key to associate with the value in the cache store.
     * @param value The value to add to the cache store.
     */
    set(key: string, value: V): this | Promise<this>;
}
/**
 * A cache object that allows accessing and storing key/value pairs in
 * an underlying CacheStore. This class is the primary method for consumers
 * to use a cache.
 */
export declare class Cache<V, S extends CacheStore<V> = CacheStore<V>> {
    protected readonly store: S;
    readonly namespace?: string | undefined;
    constructor(store: S, namespace?: string | undefined);
    /**
     * Prefixes a key with the cache namespace if present.
     * @param key A key string to prefix.
     * @returns A prefixed key if a namespace is present. Otherwise the provided key.
     */
    protected withNamespace(key: string): string;
    /**
     * Gets the value associated with a provided key if available.
     * Otherwise, creates a value using the factory creator function, puts the value
     * in the cache, and returns the new value.
     * @param key A key associated with the value.
     * @param creator A factory function for the value if no value is present.
     * @returns A value associated with the provided key.
     */
    getOrCreate(key: string, creator: () => V | Promise<V>): Promise<V>;
    /**
     * Gets the value associated with a provided key if available.
     * @param key A key associated with the value.
     * @returns A value associated with the provided key if present. Otherwise, `undefined`.
     */
    get(key: string): Promise<V | undefined>;
    /**
     * Puts a value in the cache and associates it with the provided key.
     * If the key is already present, the value is updated instead.
     * @param key A key associated with the value.
     * @param value A value to put in the cache.
     */
    put(key: string, value: V): Promise<void>;
}
/**
 * A lightweight in-memory cache implementation based on a JavaScript Map object.
 */
export declare class MemoryCache<V> extends Cache<V, Map<string, V>> {
    constructor();
    /**
     * Removes all entries from the cache instance.
     */
    clear(): void;
    /**
     * Provides all the values currently present in the cache instance.
     * @returns An iterable of all values in the cache.
     */
    values(): MapIterator<V>;
    /**
     * Provides all the keys/values currently present in the cache instance.
     * @returns An iterable of all key/value pairs in the cache.
     */
    entries(): MapIterator<[string, V]>;
}
