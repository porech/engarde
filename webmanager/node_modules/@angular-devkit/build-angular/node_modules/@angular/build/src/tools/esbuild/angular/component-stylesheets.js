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
exports.ComponentStylesheetBundler = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const node_crypto_1 = require("node:crypto");
const node_path_1 = __importDefault(require("node:path"));
const bundler_context_1 = require("../bundler-context");
const cache_1 = require("../cache");
const bundle_options_1 = require("../stylesheets/bundle-options");
/**
 * Bundles component stylesheets. A stylesheet can be either an inline stylesheet that
 * is contained within the Component's metadata definition or an external file referenced
 * from the Component's metadata definition.
 */
class ComponentStylesheetBundler {
    options;
    defaultInlineLanguage;
    incremental;
    #fileContexts = new cache_1.MemoryCache();
    #inlineContexts = new cache_1.MemoryCache();
    /**
     *
     * @param options An object containing the stylesheet bundling options.
     * @param cache A load result cache to use when bundling.
     */
    constructor(options, defaultInlineLanguage, incremental) {
        this.options = options;
        this.defaultInlineLanguage = defaultInlineLanguage;
        this.incremental = incremental;
    }
    /**
     * Bundle a file-based component stylesheet for use within an AOT compiled Angular application.
     * @param entry The file path of the stylesheet.
     * @param externalId Either an external identifier string for initial bundling or a boolean for rebuilds, if external.
     * @param direct If true, the output will be used directly by the builder; false if used inside the compiler plugin.
     * @returns A component bundle result object.
     */
    async bundleFile(entry, externalId, direct) {
        const bundlerContext = await this.#fileContexts.getOrCreate(entry, () => {
            return new bundler_context_1.BundlerContext(this.options.workspaceRoot, this.incremental, (loadCache) => {
                const buildOptions = (0, bundle_options_1.createStylesheetBundleOptions)(this.options, loadCache);
                if (externalId) {
                    (0, node_assert_1.default)(typeof externalId === 'string', 'Initial external component stylesheets must have a string identifier');
                    buildOptions.entryPoints = { [externalId]: entry };
                    buildOptions.entryNames = '[name]';
                    delete buildOptions.publicPath;
                }
                else {
                    buildOptions.entryPoints = [entry];
                }
                // Angular encapsulation does not support nesting
                // See: https://github.com/angular/angular/issues/58996
                buildOptions.supported ??= {};
                buildOptions.supported['nesting'] = false;
                return buildOptions;
            });
        });
        return this.extractResult(await bundlerContext.bundle(), bundlerContext.watchFiles, !!externalId, !!direct);
    }
    bundleAllFiles(external, direct) {
        return Promise.all(Array.from(this.#fileContexts.entries()).map(([entry]) => this.bundleFile(entry, external, direct)));
    }
    async bundleInline(data, filename, language = this.defaultInlineLanguage, externalId) {
        // Use a hash of the inline stylesheet content to ensure a consistent identifier. External stylesheets will resolve
        // to the actual stylesheet file path.
        // TODO: Consider xxhash instead for hashing
        const id = (0, node_crypto_1.createHash)('sha256')
            .update(data)
            .update(externalId ?? '')
            .digest('hex');
        const entry = [language, id, filename].join(';');
        const bundlerContext = await this.#inlineContexts.getOrCreate(entry, () => {
            const namespace = 'angular:styles/component';
            return new bundler_context_1.BundlerContext(this.options.workspaceRoot, this.incremental, (loadCache) => {
                const buildOptions = (0, bundle_options_1.createStylesheetBundleOptions)(this.options, loadCache, {
                    [entry]: data,
                });
                if (externalId) {
                    buildOptions.entryPoints = { [externalId]: `${namespace};${entry}` };
                    buildOptions.entryNames = '[name]';
                    delete buildOptions.publicPath;
                }
                else {
                    buildOptions.entryPoints = [`${namespace};${entry}`];
                }
                // Angular encapsulation does not support nesting
                // See: https://github.com/angular/angular/issues/58996
                buildOptions.supported ??= {};
                buildOptions.supported['nesting'] = false;
                buildOptions.plugins.push({
                    name: 'angular-component-styles',
                    setup(build) {
                        build.onResolve({ filter: /^angular:styles\/component;/ }, (args) => {
                            if (args.kind !== 'entry-point') {
                                return null;
                            }
                            return {
                                path: entry,
                                namespace,
                            };
                        });
                        build.onLoad({ filter: /^css;/, namespace }, () => {
                            return {
                                contents: data,
                                loader: 'css',
                                resolveDir: node_path_1.default.dirname(filename),
                            };
                        });
                    },
                });
                return buildOptions;
            });
        });
        // Extract the result of the bundling from the output files
        return this.extractResult(await bundlerContext.bundle(), bundlerContext.watchFiles, !!externalId, false);
    }
    /**
     * Invalidates both file and inline based component style bundling state for a set of modified files.
     * @param files The group of files that have been modified
     * @returns An array of file based stylesheet entries if any were invalidated; otherwise, undefined.
     */
    invalidate(files) {
        if (!this.incremental) {
            return;
        }
        const normalizedFiles = [...files].map(node_path_1.default.normalize);
        let entries;
        for (const [entry, bundler] of this.#fileContexts.entries()) {
            if (bundler.invalidate(normalizedFiles)) {
                entries ??= [];
                entries.push(entry);
            }
        }
        for (const bundler of this.#inlineContexts.values()) {
            bundler.invalidate(normalizedFiles);
        }
        return entries;
    }
    collectReferencedFiles() {
        const files = [];
        for (const context of this.#fileContexts.values()) {
            files.push(...context.watchFiles);
        }
        return files;
    }
    async dispose() {
        const contexts = [...this.#fileContexts.values(), ...this.#inlineContexts.values()];
        this.#fileContexts.clear();
        this.#inlineContexts.clear();
        await Promise.allSettled(contexts.map((context) => context.dispose()));
    }
    extractResult(result, referencedFiles, external, direct) {
        let contents = '';
        const outputFiles = [];
        const { errors, warnings } = result;
        if (errors) {
            return { errors, warnings, referencedFiles, contents: '' };
        }
        for (const outputFile of result.outputFiles) {
            const filename = node_path_1.default.basename(outputFile.path);
            if (outputFile.type === bundler_context_1.BuildOutputFileType.Media || filename.endsWith('.css.map')) {
                // The output files could also contain resources (images/fonts/etc.) that were referenced and the map files.
                // Clone the output file to avoid amending the original path which would causes problems during rebuild.
                const clonedOutputFile = outputFile.clone();
                // Needed for Bazel as otherwise the files will not be written in the correct place,
                // this is because esbuild will resolve the output file from the outdir which is currently set to `workspaceRoot` twice,
                // once in the stylesheet and the other in the application code bundler.
                // Ex: `../../../../../app.component.css.map`.
                if (!direct) {
                    clonedOutputFile.path = node_path_1.default.join(this.options.workspaceRoot, outputFile.path);
                }
                outputFiles.push(clonedOutputFile);
            }
            else if (filename.endsWith('.css')) {
                if (external) {
                    const clonedOutputFile = outputFile.clone();
                    if (!direct) {
                        clonedOutputFile.path = node_path_1.default.join(this.options.workspaceRoot, outputFile.path);
                    }
                    outputFiles.push(clonedOutputFile);
                    contents = node_path_1.default.posix.join(this.options.publicPath ?? '', filename);
                }
                else {
                    contents = outputFile.text;
                }
            }
            else {
                throw new Error(`Unexpected non CSS/Media file "${filename}" outputted during component stylesheet processing.`);
            }
        }
        const metafile = result.metafile;
        // Remove entryPoint fields from outputs to prevent the internal component styles from being
        // treated as initial files. Also mark the entry as a component resource for stat reporting.
        Object.values(metafile.outputs).forEach((output) => {
            delete output.entryPoint;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            output['ng-component'] = true;
        });
        return {
            errors,
            warnings,
            contents,
            outputFiles,
            metafile,
            referencedFiles,
            externalImports: result.externalImports,
            initialFiles: new Map(),
        };
    }
}
exports.ComponentStylesheetBundler = ComponentStylesheetBundler;
