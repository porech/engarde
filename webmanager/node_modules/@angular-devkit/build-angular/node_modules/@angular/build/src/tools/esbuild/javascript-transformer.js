"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptTransformer = void 0;
const node_crypto_1 = require("node:crypto");
const promises_1 = require("node:fs/promises");
const utils_1 = require("../../utils/server-rendering/esm-in-memory-loader/utils");
const worker_pool_1 = require("../../utils/worker-pool");
/**
 * A class that performs transformation of JavaScript files and raw data.
 * A worker pool is used to distribute the transformation actions and allow
 * parallel processing. Transformation behavior is based on the filename and
 * data. Transformations may include: async downleveling, Angular linking,
 * and advanced optimizations.
 */
class JavaScriptTransformer {
    maxThreads;
    cache;
    #workerPool;
    #commonOptions;
    #fileCacheKeyBase;
    constructor(options, maxThreads, cache) {
        this.maxThreads = maxThreads;
        this.cache = cache;
        // Extract options to ensure only the named options are serialized and sent to the worker
        const { sourcemap, thirdPartySourcemaps = false, advancedOptimizations = false, jit = false, } = options;
        this.#commonOptions = {
            sourcemap,
            thirdPartySourcemaps,
            advancedOptimizations,
            jit,
        };
        this.#fileCacheKeyBase = Buffer.from(JSON.stringify(this.#commonOptions), 'utf-8');
    }
    #ensureWorkerPool() {
        if (this.#workerPool) {
            return this.#workerPool;
        }
        const workerPoolOptions = {
            filename: require.resolve('./javascript-transformer-worker'),
            maxThreads: this.maxThreads,
        };
        // Prevent passing SSR `--import` (loader-hooks) from parent to child worker.
        const filteredExecArgv = process.execArgv.filter((v) => v !== utils_1.IMPORT_EXEC_ARGV);
        if (process.execArgv.length !== filteredExecArgv.length) {
            workerPoolOptions.execArgv = filteredExecArgv;
        }
        this.#workerPool = new worker_pool_1.WorkerPool(workerPoolOptions);
        return this.#workerPool;
    }
    /**
     * Performs JavaScript transformations on a file from the filesystem.
     * If no transformations are required, the data for the original file will be returned.
     * @param filename The full path to the file.
     * @param skipLinker If true, bypass all Angular linker processing; if false, attempt linking.
     * @param sideEffects If false, and `advancedOptimizations` is enabled tslib decorators are wrapped.
     * @returns A promise that resolves to a UTF-8 encoded Uint8Array containing the result.
     */
    async transformFile(filename, skipLinker, sideEffects, instrumentForCoverage) {
        const data = await (0, promises_1.readFile)(filename);
        let result;
        let cacheKey;
        if (this.cache) {
            // Create a cache key from the file data and options that effect the output.
            // NOTE: If additional options are added, this may need to be updated.
            // TODO: Consider xxhash or similar instead of SHA256
            const hash = (0, node_crypto_1.createHash)('sha256');
            hash.update(`${!!skipLinker}--${!!sideEffects}`);
            hash.update(data);
            hash.update(this.#fileCacheKeyBase);
            cacheKey = hash.digest('hex');
            try {
                result = await this.cache?.get(cacheKey);
            }
            catch {
                // Failure to get the value should not fail the transform
            }
        }
        if (result === undefined) {
            // If there is no cache or no cached entry, process the file
            result = (await this.#ensureWorkerPool().run({
                filename,
                data,
                skipLinker,
                sideEffects,
                instrumentForCoverage,
                ...this.#commonOptions,
            }, {
                // The below is disable as with Yarn PNP this causes build failures with the below message
                // `Unable to deserialize cloned data`.
                transferList: process.versions.pnp ? undefined : [data.buffer],
            }));
            // If there is a cache then store the result
            if (this.cache && cacheKey) {
                try {
                    await this.cache.put(cacheKey, result);
                }
                catch {
                    // Failure to store the value in the cache should not fail the transform
                }
            }
        }
        return result;
    }
    /**
     * Performs JavaScript transformations on the provided data of a file. The file does not need
     * to exist on the filesystem.
     * @param filename The full path of the file represented by the data.
     * @param data The data of the file that should be transformed.
     * @param skipLinker If true, bypass all Angular linker processing; if false, attempt linking.
     * @param sideEffects If false, and `advancedOptimizations` is enabled tslib decorators are wrapped.
     * @returns A promise that resolves to a UTF-8 encoded Uint8Array containing the result.
     */
    async transformData(filename, data, skipLinker, sideEffects, instrumentForCoverage) {
        // Perform a quick test to determine if the data needs any transformations.
        // This allows directly returning the data without the worker communication overhead.
        if (skipLinker && !this.#commonOptions.advancedOptimizations && !instrumentForCoverage) {
            const keepSourcemap = this.#commonOptions.sourcemap &&
                (!!this.#commonOptions.thirdPartySourcemaps || !/[\\/]node_modules[\\/]/.test(filename));
            return Buffer.from(keepSourcemap ? data : data.replace(/^\/\/# sourceMappingURL=[^\r\n]*/gm, ''), 'utf-8');
        }
        return this.#ensureWorkerPool().run({
            filename,
            data,
            skipLinker,
            sideEffects,
            instrumentForCoverage,
            ...this.#commonOptions,
        });
    }
    /**
     * Stops all active transformation tasks and shuts down all workers.
     * @returns A void promise that resolves when closing is complete.
     */
    async close() {
        if (this.#workerPool) {
            try {
                await this.#workerPool.destroy();
            }
            finally {
                this.#workerPool = undefined;
            }
        }
    }
}
exports.JavaScriptTransformer = JavaScriptTransformer;
