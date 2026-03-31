"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nInliner = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const node_crypto_1 = require("node:crypto");
const node_path_1 = require("node:path");
const worker_pool_1 = require("../../utils/worker-pool");
const bundler_context_1 = require("./bundler-context");
const utils_1 = require("./utils");
/**
 * A keyword used to indicate if a JavaScript file may require inlining of translations.
 * This keyword is used to avoid processing files that would not otherwise need i18n processing.
 */
const LOCALIZE_KEYWORD = '$localize';
/**
 * A class that performs i18n translation inlining of JavaScript code.
 * A worker pool is used to distribute the transformation actions and allow
 * parallel processing. Inlining is only performed on code that contains the
 * localize function (`$localize`).
 */
class I18nInliner {
    options;
    #cacheInitFailed = false;
    #workerPool;
    #cache;
    #localizeFiles;
    #unmodifiedFiles;
    constructor(options, maxThreads) {
        this.options = options;
        this.#unmodifiedFiles = [];
        const { outputFiles, shouldOptimize, missingTranslation } = options;
        const files = new Map();
        const pendingMaps = [];
        for (const file of outputFiles) {
            if (file.type === bundler_context_1.BuildOutputFileType.Root || file.type === bundler_context_1.BuildOutputFileType.ServerRoot) {
                // Skip also the server entry-point.
                // Skip stats and similar files.
                continue;
            }
            const fileExtension = (0, node_path_1.extname)(file.path);
            if (fileExtension === '.js' || fileExtension === '.mjs') {
                // Check if localizations are present
                const contentBuffer = Buffer.isBuffer(file.contents)
                    ? file.contents
                    : Buffer.from(file.contents.buffer, file.contents.byteOffset, file.contents.byteLength);
                const hasLocalize = contentBuffer.includes(LOCALIZE_KEYWORD);
                if (hasLocalize) {
                    files.set(file.path, file);
                    continue;
                }
            }
            else if (fileExtension === '.map') {
                // The related JS file may not have been checked yet. To ensure that map files are not
                // missed, store any pending map files and check them after all output files.
                pendingMaps.push(file);
                continue;
            }
            this.#unmodifiedFiles.push(file);
        }
        // Check if any pending map files should be processed by checking if the parent JS file is present
        for (const file of pendingMaps) {
            if (files.has(file.path.slice(0, -4))) {
                files.set(file.path, file);
            }
            else {
                this.#unmodifiedFiles.push(file);
            }
        }
        this.#localizeFiles = files;
        this.#workerPool = new worker_pool_1.WorkerPool({
            filename: require.resolve('./i18n-inliner-worker'),
            maxThreads,
            // Extract options to ensure only the named options are serialized and sent to the worker
            workerData: {
                missingTranslation,
                shouldOptimize,
                // A Blob is an immutable data structure that allows sharing the data between workers
                // without copying until the data is actually used within a Worker. This is useful here
                // since each file may not actually be processed in each Worker and the Blob avoids
                // unneeded repeat copying of potentially large JavaScript files.
                files: new Map(Array.from(files, ([name, file]) => [name, new Blob([file.contents])])),
            },
        });
    }
    /**
     * Performs inlining of translations for the provided locale and translations. The files that
     * are processed originate from the files passed to the class constructor and filter by presence
     * of the localize function keyword.
     * @param locale The string representing the locale to inline.
     * @param translation The translation messages to use when inlining.
     * @returns A promise that resolves to an array of OutputFiles representing a translated result.
     */
    async inlineForLocale(locale, translation) {
        await this.initCache();
        const { shouldOptimize, missingTranslation } = this.options;
        // Request inlining for each file that contains localize calls
        const requests = [];
        let fileCacheKeyBase;
        for (const [filename, file] of this.#localizeFiles) {
            let cacheKey;
            if (filename.endsWith('.map')) {
                continue;
            }
            let cacheResultPromise = Promise.resolve(null);
            if (this.#cache) {
                fileCacheKeyBase ??= Buffer.from(JSON.stringify({ locale, translation, missingTranslation, shouldOptimize }), 'utf-8');
                // NOTE: If additional options are added, this may need to be updated.
                // TODO: Consider xxhash or similar instead of SHA256
                cacheKey = (0, node_crypto_1.createHash)('sha256')
                    .update(file.hash)
                    .update(filename)
                    .update(fileCacheKeyBase)
                    .digest('hex');
                // Failure to get the value should not fail the transform
                cacheResultPromise = this.#cache.get(cacheKey).catch(() => null);
            }
            const fileResult = cacheResultPromise.then(async (cachedResult) => {
                if (cachedResult) {
                    return cachedResult;
                }
                const result = await this.#workerPool.run({ filename, locale, translation });
                if (this.#cache && cacheKey) {
                    // Failure to set the value should not fail the transform
                    await this.#cache.set(cacheKey, result).catch(() => { });
                }
                return result;
            });
            requests.push(fileResult);
        }
        // Wait for all file requests to complete
        const rawResults = await Promise.all(requests);
        // Convert raw results to output file objects and include all unmodified files
        const errors = [];
        const warnings = [];
        const outputFiles = [
            ...rawResults.flatMap(({ file, code, map, messages }) => {
                const type = this.#localizeFiles.get(file)?.type;
                (0, node_assert_1.default)(type !== undefined, 'localized file should always have a type' + file);
                const resultFiles = [(0, utils_1.createOutputFile)(file, code, type)];
                if (map) {
                    resultFiles.push((0, utils_1.createOutputFile)(file + '.map', map, type));
                }
                for (const message of messages) {
                    if (message.type === 'error') {
                        errors.push(message.message);
                    }
                    else {
                        warnings.push(message.message);
                    }
                }
                return resultFiles;
            }),
            ...this.#unmodifiedFiles.map((file) => file.clone()),
        ];
        return {
            outputFiles,
            errors,
            warnings,
        };
    }
    async inlineTemplateUpdate(locale, translation, templateCode, templateId) {
        const hasLocalize = templateCode.includes(LOCALIZE_KEYWORD);
        if (!hasLocalize) {
            return {
                code: templateCode,
                errors: [],
                warnings: [],
            };
        }
        const { output, messages } = await this.#workerPool.run({ code: templateCode, filename: templateId, locale, translation }, { name: 'inlineCode' });
        const errors = [];
        const warnings = [];
        for (const message of messages) {
            if (message.type === 'error') {
                errors.push(message.message);
            }
            else {
                warnings.push(message.message);
            }
        }
        return {
            code: output,
            errors,
            warnings,
        };
    }
    /**
     * Stops all active transformation tasks and shuts down all workers.
     * @returns A void promise that resolves when closing is complete.
     */
    close() {
        return this.#workerPool.destroy();
    }
    /**
     * Initializes the cache for storing translated bundles.
     * If the cache is already initialized, it does nothing.
     *
     * @returns A promise that resolves once the cache initialization process is complete.
     */
    async initCache() {
        if (this.#cache || this.#cacheInitFailed) {
            return;
        }
        const { persistentCachePath } = this.options;
        // Webcontainers currently do not support this persistent cache store.
        if (!persistentCachePath || process.versions.webcontainer) {
            return;
        }
        // Initialize a persistent cache for i18n transformations.
        try {
            const { LmbdCacheStore } = await Promise.resolve().then(() => __importStar(require('./lmdb-cache-store')));
            this.#cache = new LmbdCacheStore((0, node_path_1.join)(persistentCachePath, 'angular-i18n.db'));
        }
        catch {
            this.#cacheInitFailed = true;
            // eslint-disable-next-line no-console
            console.warn('Unable to initialize JavaScript cache storage.\n' +
                'This will not affect the build output content but may result in slower builds.');
        }
    }
}
exports.I18nInliner = I18nInliner;
