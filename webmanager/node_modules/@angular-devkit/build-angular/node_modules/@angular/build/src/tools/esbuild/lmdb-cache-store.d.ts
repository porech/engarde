/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Cache, CacheStore } from './cache';
export declare class LmbdCacheStore implements CacheStore<unknown> {
    #private;
    readonly cachePath: string;
    constructor(cachePath: string);
    get(key: string): Promise<any>;
    has(key: string): boolean;
    set(key: string, value: unknown): Promise<this>;
    createCache<V = unknown>(namespace: string): Cache<V>;
    close(): Promise<void>;
}
