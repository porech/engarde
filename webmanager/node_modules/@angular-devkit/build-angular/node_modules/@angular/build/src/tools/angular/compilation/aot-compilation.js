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
exports.AotCompilation = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const typescript_1 = __importDefault(require("typescript"));
const profiling_1 = require("../../esbuild/profiling");
const angular_host_1 = require("../angular-host");
const jit_bootstrap_transformer_1 = require("../transformers/jit-bootstrap-transformer");
const lazy_routes_transformer_1 = require("../transformers/lazy-routes-transformer");
const web_worker_transformer_1 = require("../transformers/web-worker-transformer");
const angular_compilation_1 = require("./angular-compilation");
const hmr_candidates_1 = require("./hmr-candidates");
/**
 * The modified files count limit for performing component HMR analysis.
 * Performing content analysis for a large amount of files can result in longer rebuild times
 * than a full rebuild would entail.
 */
const HMR_MODIFIED_FILE_LIMIT = 32;
class AngularCompilationState {
    angularProgram;
    compilerHost;
    typeScriptProgram;
    affectedFiles;
    templateDiagnosticsOptimization;
    webWorkerTransform;
    diagnosticCache;
    constructor(angularProgram, compilerHost, typeScriptProgram, affectedFiles, templateDiagnosticsOptimization, webWorkerTransform, diagnosticCache = new WeakMap()) {
        this.angularProgram = angularProgram;
        this.compilerHost = compilerHost;
        this.typeScriptProgram = typeScriptProgram;
        this.affectedFiles = affectedFiles;
        this.templateDiagnosticsOptimization = templateDiagnosticsOptimization;
        this.webWorkerTransform = webWorkerTransform;
        this.diagnosticCache = diagnosticCache;
    }
    get angularCompiler() {
        return this.angularProgram.compiler;
    }
}
class AotCompilation extends angular_compilation_1.AngularCompilation {
    browserOnlyBuild;
    #state;
    constructor(browserOnlyBuild) {
        super();
        this.browserOnlyBuild = browserOnlyBuild;
    }
    async initialize(tsconfig, hostOptions, compilerOptionsTransformer) {
        // Dynamically load the Angular compiler CLI package
        const { NgtscProgram, OptimizeFor } = await angular_compilation_1.AngularCompilation.loadCompilerCli();
        // Load the compiler configuration and transform as needed
        const { options: originalCompilerOptions, rootNames, errors: configurationDiagnostics, } = await this.loadConfiguration(tsconfig);
        const compilerOptions = compilerOptionsTransformer?.(originalCompilerOptions) ?? originalCompilerOptions;
        if (compilerOptions.externalRuntimeStyles) {
            hostOptions.externalStylesheets ??= new Map();
        }
        // Reuse the package.json cache from the previous compilation
        const packageJsonCache = this.#state?.compilerHost
            .getModuleResolutionCache?.()
            ?.getPackageJsonInfoCache();
        const useHmr = compilerOptions['_enableHmr'] &&
            hostOptions.modifiedFiles &&
            hostOptions.modifiedFiles.size <= HMR_MODIFIED_FILE_LIMIT;
        let staleSourceFiles;
        let clearPackageJsonCache = false;
        if (hostOptions.modifiedFiles && this.#state) {
            for (const modifiedFile of hostOptions.modifiedFiles) {
                // Clear package.json cache if a node modules file was modified
                if (!clearPackageJsonCache && modifiedFile.includes('node_modules')) {
                    clearPackageJsonCache = true;
                    packageJsonCache?.clear();
                }
                // Collect stale source files for HMR analysis of inline component resources
                if (useHmr) {
                    const sourceFile = this.#state.typeScriptProgram.getSourceFile(modifiedFile);
                    if (sourceFile) {
                        staleSourceFiles ??= new Map();
                        staleSourceFiles.set(modifiedFile, sourceFile);
                    }
                }
            }
        }
        // Create Angular compiler host
        const host = (0, angular_host_1.createAngularCompilerHost)(typescript_1.default, compilerOptions, hostOptions, packageJsonCache);
        // Create the Angular specific program that contains the Angular compiler
        const angularProgram = (0, profiling_1.profileSync)('NG_CREATE_PROGRAM', () => new NgtscProgram(rootNames, compilerOptions, host, this.#state?.angularProgram));
        const angularCompiler = angularProgram.compiler;
        const angularTypeScriptProgram = angularProgram.getTsProgram();
        (0, angular_host_1.ensureSourceFileVersions)(angularTypeScriptProgram);
        let oldProgram = this.#state?.typeScriptProgram;
        let usingBuildInfo = false;
        if (!oldProgram) {
            oldProgram = typescript_1.default.readBuilderProgram(compilerOptions, host);
            usingBuildInfo = !!oldProgram;
        }
        const typeScriptProgram = typescript_1.default.createEmitAndSemanticDiagnosticsBuilderProgram(angularTypeScriptProgram, host, oldProgram, configurationDiagnostics);
        await (0, profiling_1.profileAsync)('NG_ANALYZE_PROGRAM', () => angularCompiler.analyzeAsync());
        let templateUpdates;
        if (useHmr && hostOptions.modifiedFiles && this.#state) {
            const componentNodes = (0, hmr_candidates_1.collectHmrCandidates)(hostOptions.modifiedFiles, angularProgram, staleSourceFiles);
            for (const node of componentNodes) {
                if (!typescript_1.default.isClassDeclaration(node)) {
                    continue;
                }
                const componentFilename = node.getSourceFile().fileName;
                let relativePath = (0, node_path_1.relative)(host.getCurrentDirectory(), componentFilename);
                if (relativePath.startsWith('..')) {
                    relativePath = componentFilename;
                }
                relativePath = relativePath.replaceAll('\\', '/');
                const updateId = encodeURIComponent(`${host.getCanonicalFileName(relativePath)}@${node.name?.text}`);
                const updateText = angularCompiler.emitHmrUpdateModule(node);
                // If compiler cannot generate an update for the component, prevent template updates.
                if (updateText === null) {
                    // Build is needed if a template cannot be updated
                    templateUpdates = undefined;
                    break;
                }
                templateUpdates ??= new Map();
                templateUpdates.set(updateId, updateText);
            }
        }
        const affectedFiles = (0, profiling_1.profileSync)('NG_FIND_AFFECTED', () => findAffectedFiles(typeScriptProgram, angularCompiler, usingBuildInfo));
        // Get all files referenced in the TypeScript/Angular program including component resources
        const referencedFiles = typeScriptProgram
            .getSourceFiles()
            .filter((sourceFile) => !angularCompiler.ignoreForEmit.has(sourceFile))
            .flatMap((sourceFile) => {
            const resourceDependencies = angularCompiler.getResourceDependencies(sourceFile);
            // Also invalidate Angular diagnostics for a source file if component resources are modified
            if (this.#state && hostOptions.modifiedFiles?.size) {
                for (const resourceDependency of resourceDependencies) {
                    if (hostOptions.modifiedFiles.has(resourceDependency)) {
                        this.#state.diagnosticCache.delete(sourceFile);
                        // Also mark as affected in case changed template affects diagnostics
                        affectedFiles.add(sourceFile);
                    }
                }
            }
            return [sourceFile.fileName, ...resourceDependencies];
        });
        this.#state = new AngularCompilationState(angularProgram, host, typeScriptProgram, affectedFiles, affectedFiles.size === 1 ? OptimizeFor.SingleFile : OptimizeFor.WholeProgram, (0, web_worker_transformer_1.createWorkerTransformer)(hostOptions.processWebWorker.bind(hostOptions)), this.#state?.diagnosticCache);
        return {
            affectedFiles,
            compilerOptions,
            referencedFiles,
            externalStylesheets: hostOptions.externalStylesheets,
            templateUpdates,
        };
    }
    *collectDiagnostics(modes) {
        (0, node_assert_1.default)(this.#state, 'Angular compilation must be initialized prior to collecting diagnostics.');
        const { affectedFiles, angularCompiler, diagnosticCache, templateDiagnosticsOptimization, typeScriptProgram, } = this.#state;
        const syntactic = modes & angular_compilation_1.DiagnosticModes.Syntactic;
        const semantic = modes & angular_compilation_1.DiagnosticModes.Semantic;
        // Collect program level diagnostics
        if (modes & angular_compilation_1.DiagnosticModes.Option) {
            yield* typeScriptProgram.getConfigFileParsingDiagnostics();
            yield* angularCompiler.getOptionDiagnostics();
            yield* typeScriptProgram.getOptionsDiagnostics();
        }
        if (syntactic) {
            yield* typeScriptProgram.getGlobalDiagnostics();
        }
        // Collect source file specific diagnostics
        for (const sourceFile of typeScriptProgram.getSourceFiles()) {
            if (angularCompiler.ignoreForDiagnostics.has(sourceFile)) {
                continue;
            }
            if (syntactic) {
                // TypeScript will use cached diagnostics for files that have not been
                // changed or affected for this build when using incremental building.
                yield* (0, profiling_1.profileSync)('NG_DIAGNOSTICS_SYNTACTIC', () => typeScriptProgram.getSyntacticDiagnostics(sourceFile), true);
            }
            if (!semantic) {
                continue;
            }
            yield* (0, profiling_1.profileSync)('NG_DIAGNOSTICS_SEMANTIC', () => typeScriptProgram.getSemanticDiagnostics(sourceFile), true);
            // Declaration files cannot have template diagnostics
            if (sourceFile.isDeclarationFile) {
                continue;
            }
            // Only request Angular template diagnostics for affected files to avoid
            // overhead of template diagnostics for unchanged files.
            if (affectedFiles.has(sourceFile)) {
                const angularDiagnostics = (0, profiling_1.profileSync)('NG_DIAGNOSTICS_TEMPLATE', () => angularCompiler.getDiagnosticsForFile(sourceFile, templateDiagnosticsOptimization), true);
                diagnosticCache.set(sourceFile, angularDiagnostics);
                yield* angularDiagnostics;
            }
            else {
                const angularDiagnostics = diagnosticCache.get(sourceFile);
                if (angularDiagnostics) {
                    yield* angularDiagnostics;
                }
            }
        }
    }
    emitAffectedFiles() {
        (0, node_assert_1.default)(this.#state, 'Angular compilation must be initialized prior to emitting files.');
        const { affectedFiles, angularCompiler, compilerHost, typeScriptProgram, webWorkerTransform } = this.#state;
        const compilerOptions = typeScriptProgram.getCompilerOptions();
        const buildInfoFilename = compilerOptions.tsBuildInfoFile ?? '.tsbuildinfo';
        const useTypeScriptTranspilation = !compilerOptions.isolatedModules ||
            !!compilerOptions.sourceMap ||
            !!compilerOptions.inlineSourceMap;
        const emittedFiles = new Map();
        const writeFileCallback = (filename, contents, _a, _b, sourceFiles) => {
            if (!sourceFiles?.length && filename.endsWith(buildInfoFilename)) {
                // Save builder info contents to specified location
                compilerHost.writeFile(filename, contents, false);
                return;
            }
            (0, node_assert_1.default)(sourceFiles?.length === 1, 'Invalid TypeScript program emit for ' + filename);
            const sourceFile = typescript_1.default.getOriginalNode(sourceFiles[0], typescript_1.default.isSourceFile);
            if (angularCompiler.ignoreForEmit.has(sourceFile)) {
                return;
            }
            angularCompiler.incrementalCompilation.recordSuccessfulEmit(sourceFile);
            emittedFiles.set(sourceFile, { filename: sourceFile.fileName, contents });
        };
        const transformers = angularCompiler.prepareEmit().transformers;
        transformers.before ??= [];
        transformers.before.push((0, jit_bootstrap_transformer_1.replaceBootstrap)(() => typeScriptProgram.getProgram().getTypeChecker()), webWorkerTransform);
        if (!this.browserOnlyBuild) {
            transformers.before.push((0, lazy_routes_transformer_1.lazyRoutesTransformer)(compilerOptions, compilerHost));
        }
        // Emit is handled in write file callback when using TypeScript
        if (useTypeScriptTranspilation) {
            // TypeScript will loop until there are no more affected files in the program
            while (typeScriptProgram.emitNextAffectedFile(writeFileCallback, undefined, undefined, transformers)) {
                /* empty */
            }
        }
        else if (compilerOptions.tsBuildInfoFile) {
            // Manually get the builder state for the persistent cache
            // The TypeScript API currently embeds this behavior inside the program emit
            // via emitNextAffectedFile but that also applies all internal transforms.
            const programWithGetState = typeScriptProgram.getProgram();
            (0, node_assert_1.default)(typeof programWithGetState.emitBuildInfo === 'function', 'TypeScript program emitBuildInfo is missing.');
            programWithGetState.emitBuildInfo();
        }
        // Angular may have files that must be emitted but TypeScript does not consider affected
        for (const sourceFile of typeScriptProgram.getSourceFiles()) {
            if (emittedFiles.has(sourceFile) || angularCompiler.ignoreForEmit.has(sourceFile)) {
                continue;
            }
            if (sourceFile.isDeclarationFile) {
                continue;
            }
            if (angularCompiler.incrementalCompilation.safeToSkipEmit(sourceFile) &&
                !affectedFiles.has(sourceFile)) {
                continue;
            }
            if (useTypeScriptTranspilation) {
                typeScriptProgram.emit(sourceFile, writeFileCallback, undefined, undefined, transformers);
                continue;
            }
            // When not using TypeScript transpilation, directly apply only Angular specific transformations
            const transformResult = typescript_1.default.transform(sourceFile, [
                ...(transformers.before ?? []),
                ...(transformers.after ?? []),
            ], compilerOptions);
            (0, node_assert_1.default)(transformResult.transformed.length === 1, 'TypeScript transforms should not produce multiple outputs for ' + sourceFile.fileName);
            let contents;
            if (sourceFile === transformResult.transformed[0]) {
                // Use original content if no changes were made
                contents = sourceFile.text;
            }
            else {
                // Otherwise, print the transformed source file
                const printer = typescript_1.default.createPrinter(compilerOptions, transformResult);
                contents = printer.printFile(transformResult.transformed[0]);
            }
            angularCompiler.incrementalCompilation.recordSuccessfulEmit(sourceFile);
            emittedFiles.set(sourceFile, { filename: sourceFile.fileName, contents });
        }
        return emittedFiles.values();
    }
}
exports.AotCompilation = AotCompilation;
function findAffectedFiles(builder, { ignoreForDiagnostics }, includeTTC) {
    const affectedFiles = new Set();
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const result = builder.getSemanticDiagnosticsOfNextAffectedFile(undefined, (sourceFile) => {
            // If the affected file is a TTC shim, add the shim's original source file.
            // This ensures that changes that affect TTC are typechecked even when the changes
            // are otherwise unrelated from a TS perspective and do not result in Ivy codegen changes.
            // For example, changing @Input property types of a directive used in another component's
            // template.
            // A TTC shim is a file that has been ignored for diagnostics and has a filename ending in `.ngtypecheck.ts`.
            if (ignoreForDiagnostics.has(sourceFile) && sourceFile.fileName.endsWith('.ngtypecheck.ts')) {
                // This file name conversion relies on internal compiler logic and should be converted
                // to an official method when available. 15 is length of `.ngtypecheck.ts`
                const originalFilename = sourceFile.fileName.slice(0, -15) + '.ts';
                const originalSourceFile = builder.getSourceFile(originalFilename);
                if (originalSourceFile) {
                    affectedFiles.add(originalSourceFile);
                }
                return true;
            }
            return false;
        });
        if (!result) {
            break;
        }
        affectedFiles.add(result.affected);
    }
    // Add all files with associated template type checking files.
    // Stored TS build info does not have knowledge of the AOT compiler or the typechecking state of the templates.
    // To ensure that errors are reported correctly, all AOT component diagnostics need to be analyzed even if build
    // info is present.
    if (includeTTC) {
        for (const sourceFile of builder.getSourceFiles()) {
            if (ignoreForDiagnostics.has(sourceFile) && sourceFile.fileName.endsWith('.ngtypecheck.ts')) {
                // This file name conversion relies on internal compiler logic and should be converted
                // to an official method when available. 15 is length of `.ngtypecheck.ts`
                const originalFilename = sourceFile.fileName.slice(0, -15) + '.ts';
                const originalSourceFile = builder.getSourceFile(originalFilename);
                if (originalSourceFile) {
                    affectedFiles.add(originalSourceFile);
                }
            }
        }
    }
    return affectedFiles;
}
