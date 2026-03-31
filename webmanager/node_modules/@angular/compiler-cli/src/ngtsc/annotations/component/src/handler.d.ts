/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ConstantPool } from '@angular/compiler';
import ts from 'typescript';
import { CycleAnalyzer, CycleHandlingStrategy } from '../../../cycles';
import { DeferredSymbolTracker, ImportedSymbolsTracker, LocalCompilationExtraImportsTracker, ModuleResolver, ReferenceEmitter } from '../../../imports';
import { DependencyTracker } from '../../../incremental/api';
import { SemanticDepGraphUpdater } from '../../../incremental/semantic_graph';
import { IndexingContext } from '../../../indexer';
import { HostDirectivesResolver, MetadataReader, MetadataRegistry, ResourceRegistry } from '../../../metadata';
import { PartialEvaluator } from '../../../partial_evaluator';
import { PerfRecorder } from '../../../perf';
import { ClassDeclaration, Decorator, ReflectionHost } from '../../../reflection';
import { ComponentScopeReader, LocalModuleScopeRegistry, TypeCheckScopeRegistry } from '../../../scope';
import { AnalysisOutput, CompilationMode, CompileResult, DecoratorHandler, DetectResult, HandlerPrecedence, ResolveResult } from '../../../transform';
import { TypeCheckContext } from '../../../typecheck/api';
import { ExtendedTemplateChecker } from '../../../typecheck/extended/api';
import { TemplateSemanticsChecker } from '../../../typecheck/template_semantics/api/api';
import { Xi18nContext } from '../../../xi18n';
import { InjectableClassRegistry, ReferencesRegistry, ResourceLoader } from '../../common';
import { ComponentAnalysisData, ComponentResolutionData } from './metadata';
import { ComponentSymbol } from './symbol';
import { JitDeclarationRegistry } from '../../common/src/jit_declaration_registry';
/**
 * `DecoratorHandler` which handles the `@Component` annotation.
 */
export declare class ComponentDecoratorHandler implements DecoratorHandler<Decorator, ComponentAnalysisData, ComponentSymbol, ComponentResolutionData> {
    private reflector;
    private evaluator;
    private metaRegistry;
    private metaReader;
    private scopeReader;
    private compilerHost;
    private scopeRegistry;
    private typeCheckScopeRegistry;
    private resourceRegistry;
    private isCore;
    private strictCtorDeps;
    private resourceLoader;
    private rootDirs;
    private defaultPreserveWhitespaces;
    private i18nUseExternalIds;
    private enableI18nLegacyMessageIdFormat;
    private usePoisonedData;
    private i18nNormalizeLineEndingsInICUs;
    private moduleResolver;
    private cycleAnalyzer;
    private cycleHandlingStrategy;
    private refEmitter;
    private referencesRegistry;
    private depTracker;
    private injectableRegistry;
    private semanticDepGraphUpdater;
    private annotateForClosureCompiler;
    private perf;
    private hostDirectivesResolver;
    private importTracker;
    private includeClassMetadata;
    private readonly compilationMode;
    private readonly deferredSymbolTracker;
    private readonly forbidOrphanRendering;
    private readonly enableBlockSyntax;
    private readonly enableLetSyntax;
    private readonly externalRuntimeStyles;
    private readonly localCompilationExtraImportsTracker;
    private readonly jitDeclarationRegistry;
    private readonly i18nPreserveSignificantWhitespace;
    private readonly strictStandalone;
    private readonly enableHmr;
    private readonly implicitStandaloneValue;
    private readonly typeCheckHostBindings;
    private readonly enableSelectorless;
    private readonly emitDeclarationOnly;
    constructor(reflector: ReflectionHost, evaluator: PartialEvaluator, metaRegistry: MetadataRegistry, metaReader: MetadataReader, scopeReader: ComponentScopeReader, compilerHost: Pick<ts.CompilerHost, 'getCanonicalFileName'>, scopeRegistry: LocalModuleScopeRegistry, typeCheckScopeRegistry: TypeCheckScopeRegistry, resourceRegistry: ResourceRegistry, isCore: boolean, strictCtorDeps: boolean, resourceLoader: ResourceLoader, rootDirs: ReadonlyArray<string>, defaultPreserveWhitespaces: boolean, i18nUseExternalIds: boolean, enableI18nLegacyMessageIdFormat: boolean, usePoisonedData: boolean, i18nNormalizeLineEndingsInICUs: boolean, moduleResolver: ModuleResolver, cycleAnalyzer: CycleAnalyzer, cycleHandlingStrategy: CycleHandlingStrategy, refEmitter: ReferenceEmitter, referencesRegistry: ReferencesRegistry, depTracker: DependencyTracker | null, injectableRegistry: InjectableClassRegistry, semanticDepGraphUpdater: SemanticDepGraphUpdater | null, annotateForClosureCompiler: boolean, perf: PerfRecorder, hostDirectivesResolver: HostDirectivesResolver, importTracker: ImportedSymbolsTracker, includeClassMetadata: boolean, compilationMode: CompilationMode, deferredSymbolTracker: DeferredSymbolTracker, forbidOrphanRendering: boolean, enableBlockSyntax: boolean, enableLetSyntax: boolean, externalRuntimeStyles: boolean, localCompilationExtraImportsTracker: LocalCompilationExtraImportsTracker | null, jitDeclarationRegistry: JitDeclarationRegistry, i18nPreserveSignificantWhitespace: boolean, strictStandalone: boolean, enableHmr: boolean, implicitStandaloneValue: boolean, typeCheckHostBindings: boolean, enableSelectorless: boolean, emitDeclarationOnly: boolean);
    private literalCache;
    private elementSchemaRegistry;
    private readonly undecoratedMetadataExtractor;
    /**
     * During the asynchronous preanalyze phase, it's necessary to parse the template to extract
     * any potential <link> tags which might need to be loaded. This cache ensures that work is not
     * thrown away, and the parsed template is reused during the analyze phase.
     */
    private preanalyzeTemplateCache;
    private preanalyzeStylesCache;
    /** Whether generated code for a component can defer its dependencies. */
    private readonly canDeferDeps;
    private extractTemplateOptions;
    readonly precedence = HandlerPrecedence.PRIMARY;
    readonly name = "ComponentDecoratorHandler";
    detect(node: ClassDeclaration, decorators: Decorator[] | null): DetectResult<Decorator> | undefined;
    preanalyze(node: ClassDeclaration, decorator: Readonly<Decorator>): Promise<void> | undefined;
    analyze(node: ClassDeclaration, decorator: Readonly<Decorator>): AnalysisOutput<ComponentAnalysisData>;
    symbol(node: ClassDeclaration, analysis: Readonly<ComponentAnalysisData>): ComponentSymbol;
    register(node: ClassDeclaration, analysis: ComponentAnalysisData): void;
    index(context: IndexingContext, node: ClassDeclaration, analysis: Readonly<ComponentAnalysisData>): null;
    typeCheck(ctx: TypeCheckContext, node: ClassDeclaration, meta: Readonly<ComponentAnalysisData>): void;
    extendedTemplateCheck(component: ts.ClassDeclaration, extendedTemplateChecker: ExtendedTemplateChecker): ts.Diagnostic[];
    templateSemanticsCheck(component: ts.ClassDeclaration, templateSemanticsChecker: TemplateSemanticsChecker): ts.Diagnostic[];
    resolve(node: ClassDeclaration, analysis: Readonly<ComponentAnalysisData>, symbol: ComponentSymbol): ResolveResult<ComponentResolutionData>;
    xi18n(ctx: Xi18nContext, node: ClassDeclaration, analysis: Readonly<ComponentAnalysisData>): void;
    updateResources(node: ClassDeclaration, analysis: ComponentAnalysisData): void;
    compileFull(node: ClassDeclaration, analysis: Readonly<ComponentAnalysisData>, resolution: Readonly<ComponentResolutionData>, pool: ConstantPool): CompileResult[];
    compilePartial(node: ClassDeclaration, analysis: Readonly<ComponentAnalysisData>, resolution: Readonly<ComponentResolutionData>): CompileResult[];
    compileLocal(node: ClassDeclaration, analysis: Readonly<ComponentAnalysisData>, resolution: Readonly<Partial<ComponentResolutionData>>, pool: ConstantPool): CompileResult[];
    compileHmrUpdateDeclaration(node: ClassDeclaration, analysis: Readonly<ComponentAnalysisData>, resolution: Readonly<ComponentResolutionData>): ts.FunctionDeclaration | null;
    /**
     * Determines the dependencies of a component and
     * categorizes them based on how they were introduced.
     */
    private resolveComponentDependencies;
    /**
     * Converts component dependencies into declarations by
     * resolving their metadata and deduplicating them.
     */
    private componentDependenciesToDeclarations;
    /** Handles any cycles in the dependencies of a component. */
    private handleDependencyCycles;
    /** Produces diagnostics that require more than local information. */
    private getNonLocalDiagnostics;
    /**
     * Locates defer blocks in case scope information is not available.
     * For example, this happens in the local compilation mode.
     */
    private locateDeferBlocksWithoutScope;
    /**
     * Computes a list of deferrable symbols based on dependencies from
     * the `@Component.imports` field and their usage in `@defer` blocks.
     */
    private resolveAllDeferredDependencies;
    /**
     * Collects deferrable symbols from the `@Component.deferredImports` field.
     */
    private collectExplicitlyDeferredSymbols;
    /**
     * Check whether adding an import from `origin` to the source-file corresponding to `expr` would
     * create a cyclic import.
     *
     * @returns a `Cycle` object if a cycle would be created, otherwise `null`.
     */
    private _checkForCyclicImport;
    private maybeRecordSyntheticImport;
    /**
     * Resolves information about defer blocks dependencies to make it
     * available for the final `compile` step.
     */
    private resolveDeferBlocks;
    /**
     * Inspects provided imports expression (either `@Component.imports` or
     * `@Component.deferredImports`) and registers imported types as deferrable
     * candidates.
     */
    private registerDeferrableCandidate;
    private compileDeferBlocks;
    /** Creates a new binding parser. */
    private getNewBindingParser;
}
