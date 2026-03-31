"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionResult = void 0;
const node_path_1 = require("node:path");
const utils_1 = require("./utils");
/**
 * Represents the result of a single builder execute call.
 */
class ExecutionResult {
    rebuildContexts;
    componentStyleBundler;
    codeBundleCache;
    templateUpdates;
    outputFiles = [];
    assetFiles = [];
    errors = [];
    prerenderedRoutes = {};
    warnings = [];
    logs = [];
    externalMetadata;
    extraWatchFiles = [];
    htmlIndexPath;
    htmlBaseHref;
    constructor(rebuildContexts, componentStyleBundler, codeBundleCache, templateUpdates) {
        this.rebuildContexts = rebuildContexts;
        this.componentStyleBundler = componentStyleBundler;
        this.codeBundleCache = codeBundleCache;
        this.templateUpdates = templateUpdates;
    }
    addOutputFile(path, content, type) {
        this.outputFiles.push((0, utils_1.createOutputFile)(path, content, type));
    }
    addAssets(assets) {
        this.assetFiles.push(...assets);
    }
    addLog(value) {
        this.logs.push(value);
    }
    addError(error) {
        if (typeof error === 'string') {
            this.errors.push({ text: error, location: null });
        }
        else {
            this.errors.push(error);
        }
    }
    addErrors(errors) {
        for (const error of errors) {
            this.addError(error);
        }
    }
    addPrerenderedRoutes(routes) {
        Object.assign(this.prerenderedRoutes, routes);
        // Sort the prerendered routes.
        const sortedObj = {};
        for (const key of Object.keys(this.prerenderedRoutes).sort()) {
            sortedObj[key] = this.prerenderedRoutes[key];
        }
        this.prerenderedRoutes = sortedObj;
    }
    addWarning(error) {
        if (typeof error === 'string') {
            this.warnings.push({ text: error, location: null });
        }
        else {
            this.warnings.push(error);
        }
    }
    addWarnings(errors) {
        for (const error of errors) {
            this.addWarning(error);
        }
    }
    /**
     * Add external JavaScript import metadata to the result. This is currently used
     * by the development server to optimize the prebundling process.
     * @param implicitBrowser External dependencies for the browser bundles due to the external packages option.
     * @param implicitServer External dependencies for the server bundles due to the external packages option.
     * @param explicit External dependencies due to explicit project configuration.
     */
    setExternalMetadata(implicitBrowser, implicitServer, explicit) {
        this.externalMetadata = { implicitBrowser, implicitServer, explicit };
    }
    get output() {
        return {
            success: this.errors.length === 0,
        };
    }
    get outputWithFiles() {
        return {
            success: this.errors.length === 0,
            outputFiles: this.outputFiles,
            assetFiles: this.assetFiles,
            errors: this.errors,
            externalMetadata: this.externalMetadata,
        };
    }
    get watchFiles() {
        const { typescriptContexts, otherContexts } = this.rebuildContexts;
        return [
            // Bundler contexts internally normalize file dependencies.
            ...typescriptContexts.flatMap((context) => [...context.watchFiles]),
            ...otherContexts.flatMap((context) => [...context.watchFiles]),
            // These files originate from TS/NG and can have POSIX path separators even on Windows.
            // To ensure path comparisons are valid, all these paths must be normalized.
            ...(this.codeBundleCache?.referencedFiles?.map(node_path_1.normalize) ?? []),
            // The assets source files.
            ...this.assetFiles.map(({ source }) => source),
            ...this.extraWatchFiles,
        ];
    }
    createRebuildState(fileChanges) {
        return {
            rebuildContexts: this.rebuildContexts,
            codeBundleCache: this.codeBundleCache,
            componentStyleBundler: this.componentStyleBundler,
            fileChanges,
            previousOutputInfo: new Map(this.outputFiles.map(({ path, hash, type }) => [path, { hash, type }])),
            previousAssetsInfo: new Map(this.assetFiles.map(({ source, destination }) => [source, destination])),
            templateUpdates: this.templateUpdates,
        };
    }
    findChangedFiles(previousOutputHashes) {
        const changed = new Set();
        for (const file of this.outputFiles) {
            const previousHash = previousOutputHashes.get(file.path)?.hash;
            if (previousHash === undefined || previousHash !== file.hash) {
                changed.add(file.path);
            }
        }
        return changed;
    }
    async dispose() {
        await Promise.allSettled([
            ...this.rebuildContexts.typescriptContexts.map((context) => context.dispose()),
            ...this.rebuildContexts.otherContexts.map((context) => context.dispose()),
            this.componentStyleBundler.dispose(),
        ]);
    }
}
exports.ExecutionResult = ExecutionResult;
