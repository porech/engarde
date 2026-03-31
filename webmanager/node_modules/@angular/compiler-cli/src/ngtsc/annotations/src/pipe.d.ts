/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { R3ClassMetadata, R3PipeMetadata } from '@angular/compiler';
import ts from 'typescript';
import { SemanticSymbol } from '../../incremental/semantic_graph';
import { MetadataRegistry } from '../../metadata';
import { PartialEvaluator } from '../../partial_evaluator';
import { PerfRecorder } from '../../perf';
import { ClassDeclaration, Decorator, ReflectionHost } from '../../reflection';
import { LocalModuleScopeRegistry } from '../../scope';
import { AnalysisOutput, CompilationMode, CompileResult, DecoratorHandler, DetectResult, HandlerPrecedence, ResolveResult } from '../../transform';
import { InjectableClassRegistry } from '../common';
export interface PipeHandlerData {
    meta: R3PipeMetadata;
    classMetadata: R3ClassMetadata | null;
    pipeNameExpr: ts.Expression | null;
    decorator: ts.Decorator | null;
}
/**
 * Represents an Angular pipe.
 */
export declare class PipeSymbol extends SemanticSymbol {
    readonly name: string;
    constructor(decl: ClassDeclaration, name: string);
    isPublicApiAffected(previousSymbol: SemanticSymbol): boolean;
    isTypeCheckApiAffected(previousSymbol: SemanticSymbol): boolean;
}
export declare class PipeDecoratorHandler implements DecoratorHandler<Decorator, PipeHandlerData, PipeSymbol, unknown> {
    private reflector;
    private evaluator;
    private metaRegistry;
    private scopeRegistry;
    private injectableRegistry;
    private isCore;
    private perf;
    private includeClassMetadata;
    private readonly compilationMode;
    private readonly generateExtraImportsInLocalMode;
    private readonly strictStandalone;
    private readonly implicitStandaloneValue;
    constructor(reflector: ReflectionHost, evaluator: PartialEvaluator, metaRegistry: MetadataRegistry, scopeRegistry: LocalModuleScopeRegistry, injectableRegistry: InjectableClassRegistry, isCore: boolean, perf: PerfRecorder, includeClassMetadata: boolean, compilationMode: CompilationMode, generateExtraImportsInLocalMode: boolean, strictStandalone: boolean, implicitStandaloneValue: boolean);
    readonly precedence = HandlerPrecedence.PRIMARY;
    readonly name = "PipeDecoratorHandler";
    detect(node: ClassDeclaration, decorators: Decorator[] | null): DetectResult<Decorator> | undefined;
    analyze(clazz: ClassDeclaration, decorator: Readonly<Decorator>): AnalysisOutput<PipeHandlerData>;
    symbol(node: ClassDeclaration, analysis: Readonly<PipeHandlerData>): PipeSymbol;
    register(node: ClassDeclaration, analysis: Readonly<PipeHandlerData>): void;
    resolve(node: ClassDeclaration): ResolveResult<unknown>;
    compileFull(node: ClassDeclaration, analysis: Readonly<PipeHandlerData>): CompileResult[];
    compilePartial(node: ClassDeclaration, analysis: Readonly<PipeHandlerData>): CompileResult[];
    compileLocal(node: ClassDeclaration, analysis: Readonly<PipeHandlerData>): CompileResult[];
}
