/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ConstantPool, R3ClassMetadata, R3DirectiveMetadata } from '@angular/compiler';
import ts from 'typescript';
import { ImportedSymbolsTracker, Reference, ReferenceEmitter } from '../../../imports';
import { SemanticDepGraphUpdater } from '../../../incremental/semantic_graph';
import { ClassPropertyMapping, DirectiveResources, DirectiveTypeCheckMeta, HostDirectiveMeta, InputMapping, MetadataReader, MetadataRegistry, ResourceRegistry } from '../../../metadata';
import { PartialEvaluator } from '../../../partial_evaluator';
import { PerfRecorder } from '../../../perf';
import { ClassDeclaration, Decorator, ReflectionHost } from '../../../reflection';
import { LocalModuleScopeRegistry, TypeCheckScopeRegistry } from '../../../scope';
import { AnalysisOutput, CompilationMode, CompileResult, DecoratorHandler, DetectResult, HandlerPrecedence, ResolveResult } from '../../../transform';
import { InjectableClassRegistry, ReferencesRegistry } from '../../common';
import { HostBindingNodes } from './shared';
import { DirectiveSymbol } from './symbol';
import { JitDeclarationRegistry } from '../../common/src/jit_declaration_registry';
import { TypeCheckContext } from '../../../typecheck/api';
export interface DirectiveHandlerData {
    baseClass: Reference<ClassDeclaration> | 'dynamic' | null;
    typeCheckMeta: DirectiveTypeCheckMeta;
    meta: R3DirectiveMetadata;
    classMetadata: R3ClassMetadata | null;
    providersRequiringFactory: Set<Reference<ClassDeclaration>> | null;
    inputs: ClassPropertyMapping<InputMapping>;
    inputFieldNamesFromMetadataArray: Set<string>;
    outputs: ClassPropertyMapping;
    isPoisoned: boolean;
    isStructural: boolean;
    decorator: ts.Decorator | null;
    hostDirectives: HostDirectiveMeta[] | null;
    rawHostDirectives: ts.Expression | null;
    hostBindingNodes: HostBindingNodes;
    resources: DirectiveResources;
}
export declare class DirectiveDecoratorHandler implements DecoratorHandler<Decorator | null, DirectiveHandlerData, DirectiveSymbol, unknown> {
    private reflector;
    private evaluator;
    private metaRegistry;
    private scopeRegistry;
    private metaReader;
    private injectableRegistry;
    private refEmitter;
    private referencesRegistry;
    private isCore;
    private strictCtorDeps;
    private semanticDepGraphUpdater;
    private annotateForClosureCompiler;
    private perf;
    private importTracker;
    private includeClassMetadata;
    private typeCheckScopeRegistry;
    private readonly compilationMode;
    private readonly jitDeclarationRegistry;
    private readonly resourceRegistry;
    private readonly strictStandalone;
    private readonly implicitStandaloneValue;
    private readonly usePoisonedData;
    private readonly typeCheckHostBindings;
    private readonly emitDeclarationOnly;
    constructor(reflector: ReflectionHost, evaluator: PartialEvaluator, metaRegistry: MetadataRegistry, scopeRegistry: LocalModuleScopeRegistry, metaReader: MetadataReader, injectableRegistry: InjectableClassRegistry, refEmitter: ReferenceEmitter, referencesRegistry: ReferencesRegistry, isCore: boolean, strictCtorDeps: boolean, semanticDepGraphUpdater: SemanticDepGraphUpdater | null, annotateForClosureCompiler: boolean, perf: PerfRecorder, importTracker: ImportedSymbolsTracker, includeClassMetadata: boolean, typeCheckScopeRegistry: TypeCheckScopeRegistry, compilationMode: CompilationMode, jitDeclarationRegistry: JitDeclarationRegistry, resourceRegistry: ResourceRegistry, strictStandalone: boolean, implicitStandaloneValue: boolean, usePoisonedData: boolean, typeCheckHostBindings: boolean, emitDeclarationOnly: boolean);
    readonly precedence = HandlerPrecedence.PRIMARY;
    readonly name = "DirectiveDecoratorHandler";
    private readonly undecoratedMetadataExtractor;
    detect(node: ClassDeclaration, decorators: Decorator[] | null): DetectResult<Decorator | null> | undefined;
    analyze(node: ClassDeclaration, decorator: Readonly<Decorator | null>): AnalysisOutput<DirectiveHandlerData>;
    symbol(node: ClassDeclaration, analysis: Readonly<DirectiveHandlerData>): DirectiveSymbol;
    register(node: ClassDeclaration, analysis: Readonly<DirectiveHandlerData>): void;
    typeCheck(ctx: TypeCheckContext, node: ClassDeclaration, meta: Readonly<DirectiveHandlerData>): void;
    resolve(node: ClassDeclaration, analysis: DirectiveHandlerData, symbol: DirectiveSymbol): ResolveResult<unknown>;
    compileFull(node: ClassDeclaration, analysis: Readonly<DirectiveHandlerData>, resolution: Readonly<unknown>, pool: ConstantPool): CompileResult[];
    compilePartial(node: ClassDeclaration, analysis: Readonly<DirectiveHandlerData>, resolution: Readonly<unknown>): CompileResult[];
    compileLocal(node: ClassDeclaration, analysis: Readonly<DirectiveHandlerData>, resolution: Readonly<unknown>, pool: ConstantPool): CompileResult[];
    /**
     * Checks if a given class uses Angular features and returns the TypeScript node
     * that indicated the usage. Classes are considered using Angular features if they
     * contain class members that are either decorated with a known Angular decorator,
     * or if they correspond to a known Angular lifecycle hook.
     */
    private findClassFieldWithAngularFeatures;
}
