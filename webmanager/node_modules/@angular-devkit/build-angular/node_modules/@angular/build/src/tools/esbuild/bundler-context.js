"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundlerContext = exports.BuildOutputFileType = void 0;
const esbuild_1 = require("esbuild");
const node_assert_1 = __importDefault(require("node:assert"));
const node_module_1 = require("node:module");
const node_path_1 = require("node:path");
const load_result_cache_1 = require("./load-result-cache");
const utils_1 = require("./utils");
var BuildOutputFileType;
(function (BuildOutputFileType) {
    BuildOutputFileType[BuildOutputFileType["Browser"] = 0] = "Browser";
    BuildOutputFileType[BuildOutputFileType["Media"] = 1] = "Media";
    BuildOutputFileType[BuildOutputFileType["ServerApplication"] = 2] = "ServerApplication";
    BuildOutputFileType[BuildOutputFileType["ServerRoot"] = 3] = "ServerRoot";
    BuildOutputFileType[BuildOutputFileType["Root"] = 4] = "Root";
})(BuildOutputFileType || (exports.BuildOutputFileType = BuildOutputFileType = {}));
/**
 * Determines if an unknown value is an esbuild BuildFailure error object thrown by esbuild.
 * @param value A potential esbuild BuildFailure error object.
 * @returns `true` if the object is determined to be a BuildFailure object; otherwise, `false`.
 */
function isEsBuildFailure(value) {
    return !!value && typeof value === 'object' && 'errors' in value && 'warnings' in value;
}
class BundlerContext {
    workspaceRoot;
    incremental;
    initialFilter;
    #esbuildContext;
    #esbuildOptions;
    #esbuildResult;
    #optionsFactory;
    #shouldCacheResult;
    #loadCache;
    watchFiles = new Set();
    constructor(workspaceRoot, incremental, options, initialFilter) {
        this.workspaceRoot = workspaceRoot;
        this.incremental = incremental;
        this.initialFilter = initialFilter;
        // To cache the results an option factory is needed to capture the full set of dependencies
        this.#shouldCacheResult = incremental && typeof options === 'function';
        this.#optionsFactory = (...args) => {
            const baseOptions = typeof options === 'function' ? options(...args) : options;
            return {
                ...baseOptions,
                metafile: true,
                write: false,
            };
        };
    }
    static async bundleAll(contexts, changedFiles) {
        const individualResults = await Promise.all([...contexts].map((context) => {
            if (changedFiles) {
                context.invalidate(changedFiles);
            }
            return context.bundle();
        }));
        return BundlerContext.mergeResults(individualResults);
    }
    static mergeResults(results) {
        // Return directly if only one result
        if (results.length === 1) {
            return results[0];
        }
        let errors;
        const warnings = [];
        const metafile = { inputs: {}, outputs: {} };
        const initialFiles = new Map();
        const externalImportsBrowser = new Set();
        const externalImportsServer = new Set();
        const outputFiles = [];
        let externalConfiguration;
        for (const result of results) {
            warnings.push(...result.warnings);
            if (result.errors) {
                errors ??= [];
                errors.push(...result.errors);
                continue;
            }
            // Combine metafiles used for the stats option as well as bundle budgets and console output
            if (result.metafile) {
                Object.assign(metafile.inputs, result.metafile.inputs);
                Object.assign(metafile.outputs, result.metafile.outputs);
            }
            result.initialFiles.forEach((value, key) => initialFiles.set(key, value));
            outputFiles.push(...result.outputFiles);
            result.externalImports.browser?.forEach((value) => externalImportsBrowser.add(value));
            result.externalImports.server?.forEach((value) => externalImportsServer.add(value));
            if (result.externalConfiguration) {
                externalConfiguration ??= new Set();
                for (const value of result.externalConfiguration) {
                    externalConfiguration.add(value);
                }
            }
        }
        if (errors !== undefined) {
            return { errors, warnings };
        }
        return {
            errors,
            warnings,
            metafile,
            initialFiles,
            outputFiles,
            externalImports: {
                browser: externalImportsBrowser,
                server: externalImportsServer,
            },
            externalConfiguration: externalConfiguration ? [...externalConfiguration] : undefined,
        };
    }
    /**
     * Executes the esbuild build function and normalizes the build result in the event of a
     * build failure that results in no output being generated.
     * All builds use the `write` option with a value of `false` to allow for the output files
     * build result array to be populated.
     *
     * @param force If true, always rebundle.
     * @returns If output files are generated, the full esbuild BuildResult; if not, the
     * warnings and errors for the attempted build.
     */
    async bundle(force) {
        // Return existing result if present
        if (!force && this.#esbuildResult) {
            return this.#esbuildResult;
        }
        const result = await this.#performBundle();
        if (this.#shouldCacheResult) {
            this.#esbuildResult = result;
        }
        return result;
    }
    // eslint-disable-next-line max-lines-per-function
    async #performBundle() {
        // Create esbuild options if not present
        if (this.#esbuildOptions === undefined) {
            if (this.incremental) {
                this.#loadCache = new load_result_cache_1.MemoryLoadResultCache();
            }
            this.#esbuildOptions = this.#optionsFactory(this.#loadCache);
        }
        if (this.incremental) {
            this.watchFiles.clear();
        }
        let result;
        try {
            if (this.#esbuildContext) {
                // Rebuild using the existing incremental build context
                result = await this.#esbuildContext.rebuild();
            }
            else if (this.incremental) {
                // Create an incremental build context and perform the first build.
                // Context creation does not perform a build.
                this.#esbuildContext = await (0, esbuild_1.context)(this.#esbuildOptions);
                result = await this.#esbuildContext.rebuild();
            }
            else {
                // For non-incremental builds, perform a single build
                result = await (0, esbuild_1.build)(this.#esbuildOptions);
            }
        }
        catch (failure) {
            // Build failures will throw an exception which contains errors/warnings
            if (isEsBuildFailure(failure)) {
                this.#addErrorsToWatch(failure);
                return failure;
            }
            else {
                throw failure;
            }
        }
        finally {
            if (this.incremental) {
                // When incremental always add any files from the load result cache
                if (this.#loadCache) {
                    for (const file of this.#loadCache.watchFiles) {
                        if (!isInternalAngularFile(file)) {
                            // watch files are fully resolved paths
                            this.watchFiles.add(file);
                        }
                    }
                }
            }
        }
        // Update files that should be watched.
        // While this should technically not be linked to incremental mode, incremental is only
        // currently enabled with watch mode where watch files are needed.
        if (this.incremental) {
            // Add input files except virtual angular files which do not exist on disk
            for (const input of Object.keys(result.metafile.inputs)) {
                if (isInternalAngularFile(input) || isInternalBundlerFile(input)) {
                    continue;
                }
                // Input file paths are always relative to the workspace root
                this.watchFiles.add((0, node_path_1.join)(this.workspaceRoot, input));
            }
        }
        // Return if the build encountered any errors
        if (result.errors.length) {
            this.#addErrorsToWatch(result);
            return {
                errors: result.errors,
                warnings: result.warnings,
            };
        }
        const { 'ng-platform-server': isPlatformServer = false, 'ng-ssr-entry-bundle': isSsrEntryBundle = false, } = result.metafile;
        // Find all initial files
        const initialFiles = new Map();
        for (const outputFile of result.outputFiles) {
            // Entries in the metafile are relative to the `absWorkingDir` option which is set to the workspaceRoot
            const relativeFilePath = (0, node_path_1.relative)(this.workspaceRoot, outputFile.path);
            const entryPoint = result.metafile.outputs[relativeFilePath]?.entryPoint;
            outputFile.path = relativeFilePath;
            if (entryPoint) {
                // The first part of the filename is the name of file (e.g., "polyfills" for "polyfills-7S5G3MDY.js")
                const name = (0, node_path_1.basename)(relativeFilePath).replace(/(?:-[\dA-Z]{8})?\.[a-z]{2,3}$/, '');
                // Entry points are only styles or scripts
                const type = (0, node_path_1.extname)(relativeFilePath) === '.css' ? 'style' : 'script';
                // Only entrypoints with an entry in the options are initial files.
                // Dynamic imports also have an entryPoint value in the meta file.
                if (this.#esbuildOptions.entryPoints?.[name]) {
                    // An entryPoint value indicates an initial file
                    const record = {
                        name,
                        type,
                        entrypoint: true,
                        serverFile: isPlatformServer,
                        depth: 0,
                    };
                    if (!this.initialFilter || this.initialFilter(record)) {
                        initialFiles.set(relativeFilePath, record);
                    }
                }
            }
        }
        // Analyze for transitive initial files
        const entriesToAnalyze = [...initialFiles];
        let currentEntry;
        while ((currentEntry = entriesToAnalyze.pop())) {
            const [entryPath, entryRecord] = currentEntry;
            for (const initialImport of result.metafile.outputs[entryPath].imports) {
                const existingRecord = initialFiles.get(initialImport.path);
                if (existingRecord) {
                    // Store the smallest value depth
                    if (existingRecord.depth > entryRecord.depth + 1) {
                        existingRecord.depth = entryRecord.depth + 1;
                    }
                    continue;
                }
                if (initialImport.kind === 'import-statement' || initialImport.kind === 'import-rule') {
                    const record = {
                        type: initialImport.kind === 'import-rule' ? 'style' : 'script',
                        entrypoint: false,
                        external: initialImport.external,
                        serverFile: isPlatformServer,
                        depth: entryRecord.depth + 1,
                    };
                    if (!this.initialFilter || this.initialFilter(record)) {
                        initialFiles.set(initialImport.path, record);
                    }
                    if (!initialImport.external) {
                        entriesToAnalyze.push([initialImport.path, record]);
                    }
                }
            }
        }
        // Collect all external package names
        const externalImports = new Set();
        for (const { imports } of Object.values(result.metafile.outputs)) {
            for (const { external, kind, path } of imports) {
                if (!external ||
                    utils_1.SERVER_GENERATED_EXTERNALS.has(path) ||
                    isInternalAngularFile(path) ||
                    (kind !== 'import-statement' && kind !== 'dynamic-import' && kind !== 'require-call')) {
                    continue;
                }
                externalImports.add(path);
            }
        }
        (0, node_assert_1.default)(this.#esbuildOptions, 'esbuild options cannot be undefined.');
        const outputFiles = result.outputFiles.map((file) => {
            let fileType;
            // All files that are not JS, CSS, WASM, or sourcemaps for them are considered media
            if (!/\.([cm]?js|css|wasm)(\.map)?$/i.test(file.path)) {
                fileType = BuildOutputFileType.Media;
            }
            else if (isPlatformServer) {
                fileType = isSsrEntryBundle
                    ? BuildOutputFileType.ServerRoot
                    : BuildOutputFileType.ServerApplication;
            }
            else {
                fileType = BuildOutputFileType.Browser;
            }
            return (0, utils_1.convertOutputFile)(file, fileType);
        });
        let externalConfiguration = this.#esbuildOptions.external;
        if (isPlatformServer && externalConfiguration) {
            externalConfiguration = externalConfiguration.filter((dep) => !utils_1.SERVER_GENERATED_EXTERNALS.has(dep));
            if (!externalConfiguration.length) {
                externalConfiguration = undefined;
            }
        }
        // Return the successful build results
        return {
            ...result,
            outputFiles,
            initialFiles,
            externalImports: {
                [isPlatformServer ? 'server' : 'browser']: externalImports,
            },
            externalConfiguration,
            errors: undefined,
        };
    }
    #addErrorsToWatch(result) {
        for (const error of result.errors) {
            let file = error.location?.file;
            if (file && !isInternalAngularFile(file)) {
                this.watchFiles.add((0, node_path_1.join)(this.workspaceRoot, file));
            }
            for (const note of error.notes) {
                file = note.location?.file;
                if (file && !isInternalAngularFile(file)) {
                    this.watchFiles.add((0, node_path_1.join)(this.workspaceRoot, file));
                }
            }
        }
    }
    /**
     * Invalidate a stored bundler result based on the previous watch files
     * and a list of changed files.
     * The context must be created with incremental mode enabled for results
     * to be stored.
     * @returns True, if the result was invalidated; False, otherwise.
     */
    invalidate(files) {
        if (!this.incremental) {
            return false;
        }
        let invalid = false;
        for (const file of files) {
            if (this.#loadCache?.invalidate(file)) {
                invalid = true;
                continue;
            }
            invalid ||= this.watchFiles.has(file);
        }
        if (invalid) {
            this.#esbuildResult = undefined;
        }
        return invalid;
    }
    /**
     * Disposes incremental build resources present in the context.
     *
     * @returns A promise that resolves when disposal is complete.
     */
    async dispose() {
        try {
            this.#esbuildOptions = undefined;
            this.#esbuildResult = undefined;
            this.#loadCache = undefined;
            await this.#esbuildContext?.dispose();
        }
        finally {
            this.#esbuildContext = undefined;
        }
    }
}
exports.BundlerContext = BundlerContext;
function isInternalAngularFile(file) {
    return file.startsWith('angular:');
}
function isInternalBundlerFile(file) {
    // Bundler virtual files such as "<define:???>" or "<runtime>"
    if (file[0] === '<' && file.at(-1) === '>') {
        return true;
    }
    const DISABLED_BUILTIN = '(disabled):';
    // Disabled node builtins such as "/some/path/(disabled):fs"
    const disabledIndex = file.indexOf(DISABLED_BUILTIN);
    if (disabledIndex >= 0) {
        return node_module_1.builtinModules.includes(file.slice(disabledIndex + DISABLED_BUILTIN.length));
    }
    return false;
}
