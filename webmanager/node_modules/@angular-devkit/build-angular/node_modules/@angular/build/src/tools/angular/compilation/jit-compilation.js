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
exports.JitCompilation = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const typescript_1 = __importDefault(require("typescript"));
const load_esm_1 = require("../../../utils/load-esm");
const profiling_1 = require("../../esbuild/profiling");
const angular_host_1 = require("../angular-host");
const jit_resource_transformer_1 = require("../transformers/jit-resource-transformer");
const lazy_routes_transformer_1 = require("../transformers/lazy-routes-transformer");
const web_worker_transformer_1 = require("../transformers/web-worker-transformer");
const angular_compilation_1 = require("./angular-compilation");
class JitCompilationState {
    compilerHost;
    typeScriptProgram;
    constructorParametersDownlevelTransform;
    replaceResourcesTransform;
    webWorkerTransform;
    constructor(compilerHost, typeScriptProgram, constructorParametersDownlevelTransform, replaceResourcesTransform, webWorkerTransform) {
        this.compilerHost = compilerHost;
        this.typeScriptProgram = typeScriptProgram;
        this.constructorParametersDownlevelTransform = constructorParametersDownlevelTransform;
        this.replaceResourcesTransform = replaceResourcesTransform;
        this.webWorkerTransform = webWorkerTransform;
    }
}
class JitCompilation extends angular_compilation_1.AngularCompilation {
    browserOnlyBuild;
    #state;
    constructor(browserOnlyBuild) {
        super();
        this.browserOnlyBuild = browserOnlyBuild;
    }
    async initialize(tsconfig, hostOptions, compilerOptionsTransformer) {
        // Dynamically load the Angular compiler CLI package
        const { constructorParametersDownlevelTransform } = await (0, load_esm_1.loadEsmModule)('@angular/compiler-cli/private/tooling');
        // Load the compiler configuration and transform as needed
        const { options: originalCompilerOptions, rootNames, errors: configurationDiagnostics, } = await this.loadConfiguration(tsconfig);
        const compilerOptions = compilerOptionsTransformer?.(originalCompilerOptions) ?? originalCompilerOptions;
        // Create Angular compiler host
        const host = (0, angular_host_1.createAngularCompilerHost)(typescript_1.default, compilerOptions, hostOptions, undefined);
        // Create the TypeScript Program
        const typeScriptProgram = (0, profiling_1.profileSync)('TS_CREATE_PROGRAM', () => typescript_1.default.createEmitAndSemanticDiagnosticsBuilderProgram(rootNames, compilerOptions, host, this.#state?.typeScriptProgram ?? typescript_1.default.readBuilderProgram(compilerOptions, host), configurationDiagnostics));
        const affectedFiles = (0, profiling_1.profileSync)('TS_FIND_AFFECTED', () => findAffectedFiles(typeScriptProgram));
        this.#state = new JitCompilationState(host, typeScriptProgram, constructorParametersDownlevelTransform(typeScriptProgram.getProgram()), (0, jit_resource_transformer_1.createJitResourceTransformer)(() => typeScriptProgram.getProgram().getTypeChecker()), (0, web_worker_transformer_1.createWorkerTransformer)(hostOptions.processWebWorker.bind(hostOptions)));
        const referencedFiles = typeScriptProgram
            .getSourceFiles()
            .map((sourceFile) => sourceFile.fileName);
        return { affectedFiles, compilerOptions, referencedFiles };
    }
    *collectDiagnostics(modes) {
        (0, node_assert_1.default)(this.#state, 'Compilation must be initialized prior to collecting diagnostics.');
        const { typeScriptProgram } = this.#state;
        // Collect program level diagnostics
        if (modes & angular_compilation_1.DiagnosticModes.Option) {
            yield* typeScriptProgram.getConfigFileParsingDiagnostics();
            yield* typeScriptProgram.getOptionsDiagnostics();
        }
        if (modes & angular_compilation_1.DiagnosticModes.Syntactic) {
            yield* typeScriptProgram.getGlobalDiagnostics();
            yield* (0, profiling_1.profileSync)('NG_DIAGNOSTICS_SYNTACTIC', () => typeScriptProgram.getSyntacticDiagnostics());
        }
        if (modes & angular_compilation_1.DiagnosticModes.Semantic) {
            yield* (0, profiling_1.profileSync)('NG_DIAGNOSTICS_SEMANTIC', () => typeScriptProgram.getSemanticDiagnostics());
        }
    }
    emitAffectedFiles() {
        (0, node_assert_1.default)(this.#state, 'Compilation must be initialized prior to emitting files.');
        const { compilerHost, typeScriptProgram, constructorParametersDownlevelTransform, replaceResourcesTransform, webWorkerTransform, } = this.#state;
        const compilerOptions = typeScriptProgram.getCompilerOptions();
        const buildInfoFilename = compilerOptions.tsBuildInfoFile ?? '.tsbuildinfo';
        const emittedFiles = [];
        const writeFileCallback = (filename, contents, _a, _b, sourceFiles) => {
            if (!sourceFiles?.length && filename.endsWith(buildInfoFilename)) {
                // Save builder info contents to specified location
                compilerHost.writeFile(filename, contents, false);
                return;
            }
            (0, node_assert_1.default)(sourceFiles?.length === 1, 'Invalid TypeScript program emit for ' + filename);
            emittedFiles.push({ filename: sourceFiles[0].fileName, contents });
        };
        const transformers = {
            before: [
                replaceResourcesTransform,
                constructorParametersDownlevelTransform,
                webWorkerTransform,
            ],
        };
        if (!this.browserOnlyBuild) {
            transformers.before.push((0, lazy_routes_transformer_1.lazyRoutesTransformer)(compilerOptions, compilerHost));
        }
        // TypeScript will loop until there are no more affected files in the program
        while (typeScriptProgram.emitNextAffectedFile(writeFileCallback, undefined, undefined, transformers)) {
            /* empty */
        }
        return emittedFiles;
    }
}
exports.JitCompilation = JitCompilation;
function findAffectedFiles(builder) {
    const affectedFiles = new Set();
    let result;
    while ((result = builder.getSemanticDiagnosticsOfNextAffectedFile())) {
        affectedFiles.add(result.affected);
    }
    return affectedFiles;
}
