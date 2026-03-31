/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { R3ClassMetadata, R3DependencyMetadata, R3InjectableMetadata } from '@angular/compiler';
import { InjectableClassRegistry } from '../../annotations/common';
import { PartialEvaluator } from '../../partial_evaluator';
import { PerfRecorder } from '../../perf';
import { ClassDeclaration, Decorator, ReflectionHost } from '../../reflection';
import { AnalysisOutput, CompilationMode, CompileResult, DecoratorHandler, DetectResult, HandlerPrecedence, ResolveResult } from '../../transform';
export interface InjectableHandlerData {
    meta: R3InjectableMetadata;
    classMetadata: R3ClassMetadata | null;
    ctorDeps: R3DependencyMetadata[] | 'invalid' | null;
    needsFactory: boolean;
}
/**
 * Adapts the `compileInjectable` compiler for `@Injectable` decorators to the Ivy compiler.
 */
export declare class InjectableDecoratorHandler implements DecoratorHandler<Decorator, InjectableHandlerData, null, unknown> {
    private reflector;
    private evaluator;
    private isCore;
    private strictCtorDeps;
    private injectableRegistry;
    private perf;
    private includeClassMetadata;
    private readonly compilationMode;
    /**
     * What to do if the injectable already contains a ɵprov property.
     *
     * If true then an error diagnostic is reported.
     * If false then there is no error and a new ɵprov property is not added.
     */
    private errorOnDuplicateProv;
    constructor(reflector: ReflectionHost, evaluator: PartialEvaluator, isCore: boolean, strictCtorDeps: boolean, injectableRegistry: InjectableClassRegistry, perf: PerfRecorder, includeClassMetadata: boolean, compilationMode: CompilationMode, 
    /**
     * What to do if the injectable already contains a ɵprov property.
     *
     * If true then an error diagnostic is reported.
     * If false then there is no error and a new ɵprov property is not added.
     */
    errorOnDuplicateProv?: boolean);
    readonly precedence = HandlerPrecedence.SHARED;
    readonly name = "InjectableDecoratorHandler";
    detect(node: ClassDeclaration, decorators: Decorator[] | null): DetectResult<Decorator> | undefined;
    analyze(node: ClassDeclaration, decorator: Readonly<Decorator>): AnalysisOutput<InjectableHandlerData>;
    symbol(): null;
    register(node: ClassDeclaration, analysis: InjectableHandlerData): void;
    resolve(node: ClassDeclaration, analysis: Readonly<InjectableHandlerData>): ResolveResult<unknown>;
    compileFull(node: ClassDeclaration, analysis: Readonly<InjectableHandlerData>): CompileResult[];
    compilePartial(node: ClassDeclaration, analysis: Readonly<InjectableHandlerData>): CompileResult[];
    compileLocal(node: ClassDeclaration, analysis: Readonly<InjectableHandlerData>): CompileResult[];
    private compile;
}
