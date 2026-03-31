/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Expression, R3ClassMetadata, R3FactoryMetadata, R3InjectorMetadata, R3NgModuleMetadata, SchemaMetadata } from '@angular/compiler';
import ts from 'typescript';
import { LocalCompilationExtraImportsTracker, Reference, ReferenceEmitter } from '../../../imports';
import { SemanticDepGraphUpdater, SemanticReference, SemanticSymbol } from '../../../incremental/semantic_graph';
import { ExportedProviderStatusResolver, MetadataReader, MetadataRegistry } from '../../../metadata';
import { PartialEvaluator } from '../../../partial_evaluator';
import { PerfRecorder } from '../../../perf';
import { ClassDeclaration, Decorator, ReflectionHost } from '../../../reflection';
import { LocalModuleScopeRegistry } from '../../../scope';
import { AnalysisOutput, CompilationMode, CompileResult, DecoratorHandler, DetectResult, HandlerPrecedence, ResolveResult } from '../../../transform';
import { InjectableClassRegistry, JitDeclarationRegistry, ReferencesRegistry } from '../../common';
export interface NgModuleAnalysis {
    mod: R3NgModuleMetadata;
    inj: R3InjectorMetadata;
    fac: R3FactoryMetadata;
    classMetadata: R3ClassMetadata | null;
    declarations: Reference<ClassDeclaration>[];
    rawDeclarations: ts.Expression | null;
    schemas: SchemaMetadata[];
    imports: TopLevelImportedExpression[];
    importRefs: Reference<ClassDeclaration>[];
    rawImports: ts.Expression | null;
    exports: Reference<ClassDeclaration>[];
    rawExports: ts.Expression | null;
    id: Expression | null;
    factorySymbolName: string;
    providersRequiringFactory: Set<Reference<ClassDeclaration>> | null;
    providers: ts.Expression | null;
    remoteScopesMayRequireCycleProtection: boolean;
    decorator: ts.Decorator | null;
}
export interface NgModuleResolution {
    injectorImports: Expression[];
}
/**
 * Represents an Angular NgModule.
 */
export declare class NgModuleSymbol extends SemanticSymbol {
    readonly hasProviders: boolean;
    private remotelyScopedComponents;
    /**
     * `SemanticSymbol`s of the transitive imports of this NgModule which came from imported
     * standalone components.
     *
     * Standalone components are excluded/included in the `InjectorDef` emit output of the NgModule
     * based on whether the compiler can prove that their transitive imports may contain exported
     * providers, so a change in this set of symbols may affect the compilation output of this
     * NgModule.
     */
    private transitiveImportsFromStandaloneComponents;
    constructor(decl: ClassDeclaration, hasProviders: boolean);
    isPublicApiAffected(previousSymbol: SemanticSymbol): boolean;
    isEmitAffected(previousSymbol: SemanticSymbol): boolean;
    isTypeCheckApiAffected(previousSymbol: SemanticSymbol): boolean;
    addRemotelyScopedComponent(component: SemanticSymbol, usedDirectives: SemanticReference[], usedPipes: SemanticReference[]): void;
    addTransitiveImportFromStandaloneComponent(importedSymbol: SemanticSymbol): void;
}
/**
 * Compiles @NgModule annotations to ngModuleDef fields.
 */
export declare class NgModuleDecoratorHandler implements DecoratorHandler<Decorator, NgModuleAnalysis, NgModuleSymbol, NgModuleResolution> {
    private reflector;
    private evaluator;
    private metaReader;
    private metaRegistry;
    private scopeRegistry;
    private referencesRegistry;
    private exportedProviderStatusResolver;
    private semanticDepGraphUpdater;
    private isCore;
    private refEmitter;
    private annotateForClosureCompiler;
    private onlyPublishPublicTypings;
    private injectableRegistry;
    private perf;
    private includeClassMetadata;
    private includeSelectorScope;
    private readonly compilationMode;
    private readonly localCompilationExtraImportsTracker;
    private readonly jitDeclarationRegistry;
    private readonly emitDeclarationOnly;
    constructor(reflector: ReflectionHost, evaluator: PartialEvaluator, metaReader: MetadataReader, metaRegistry: MetadataRegistry, scopeRegistry: LocalModuleScopeRegistry, referencesRegistry: ReferencesRegistry, exportedProviderStatusResolver: ExportedProviderStatusResolver, semanticDepGraphUpdater: SemanticDepGraphUpdater | null, isCore: boolean, refEmitter: ReferenceEmitter, annotateForClosureCompiler: boolean, onlyPublishPublicTypings: boolean, injectableRegistry: InjectableClassRegistry, perf: PerfRecorder, includeClassMetadata: boolean, includeSelectorScope: boolean, compilationMode: CompilationMode, localCompilationExtraImportsTracker: LocalCompilationExtraImportsTracker | null, jitDeclarationRegistry: JitDeclarationRegistry, emitDeclarationOnly: boolean);
    readonly precedence = HandlerPrecedence.PRIMARY;
    readonly name = "NgModuleDecoratorHandler";
    detect(node: ClassDeclaration, decorators: Decorator[] | null): DetectResult<Decorator> | undefined;
    analyze(node: ClassDeclaration, decorator: Readonly<Decorator>): AnalysisOutput<NgModuleAnalysis>;
    symbol(node: ClassDeclaration, analysis: NgModuleAnalysis): NgModuleSymbol;
    register(node: ClassDeclaration, analysis: NgModuleAnalysis): void;
    resolve(node: ClassDeclaration, analysis: Readonly<NgModuleAnalysis>): ResolveResult<NgModuleResolution>;
    compileFull(node: ClassDeclaration, { inj, mod, fac, classMetadata, declarations, remoteScopesMayRequireCycleProtection, }: Readonly<NgModuleAnalysis>, { injectorImports }: Readonly<NgModuleResolution>): CompileResult[];
    compilePartial(node: ClassDeclaration, { inj, fac, mod, classMetadata }: Readonly<NgModuleAnalysis>, { injectorImports }: Readonly<NgModuleResolution>): CompileResult[];
    compileLocal(node: ClassDeclaration, { inj, mod, fac, classMetadata, declarations, remoteScopesMayRequireCycleProtection, }: Readonly<NgModuleAnalysis>): CompileResult[];
    /**
     * Add class metadata statements, if provided, to the `ngModuleStatements`.
     */
    private insertMetadataStatement;
    /**
     * Add remote scoping statements, as needed, to the `ngModuleStatements`.
     */
    private appendRemoteScopingStatements;
    private compileNgModule;
    private _toR3Reference;
    private isClassDeclarationReference;
    /**
     * Compute a list of `Reference`s from a resolved metadata value.
     */
    private resolveTypeList;
}
export interface TopLevelImportedExpression {
    expression: ts.Expression;
    resolvedReferences: Array<Reference<ClassDeclaration>>;
    hasModuleWithProviders: boolean;
}
