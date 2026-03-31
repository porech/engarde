/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { R3DirectiveMetadata, R3QueryMetadata } from '@angular/compiler';
import ts from 'typescript';
import { ImportedSymbolsTracker, Reference, ReferenceEmitter } from '../../../imports';
import { ClassPropertyMapping, DecoratorInputTransform, HostDirectiveMeta, InputMapping, Resource } from '../../../metadata';
import { DynamicValue, PartialEvaluator } from '../../../partial_evaluator';
import { ClassDeclaration, Decorator, ReflectionHost } from '../../../reflection';
import { CompilationMode } from '../../../transform';
import { ReferencesRegistry, UndecoratedMetadataExtractor } from '../../common';
type QueryDecoratorName = 'ViewChild' | 'ViewChildren' | 'ContentChild' | 'ContentChildren';
export declare const queryDecoratorNames: QueryDecoratorName[];
export interface HostBindingNodes {
    literal: ts.ObjectLiteralExpression | null;
    bindingDecorators: Set<ts.Decorator>;
    listenerDecorators: Set<ts.Decorator>;
}
/**
 * Helper function to extract metadata from a `Directive` or `Component`. `Directive`s without a
 * selector are allowed to be used for abstract base classes. These abstract directives should not
 * appear in the declarations of an `NgModule` and additional verification is done when processing
 * the module.
 */
export declare function extractDirectiveMetadata(clazz: ClassDeclaration, decorator: Readonly<Decorator>, reflector: ReflectionHost, importTracker: ImportedSymbolsTracker, evaluator: PartialEvaluator, refEmitter: ReferenceEmitter, referencesRegistry: ReferencesRegistry, isCore: boolean, annotateForClosureCompiler: boolean, compilationMode: CompilationMode, defaultSelector: string | null, strictStandalone: boolean, implicitStandaloneValue: boolean, emitDeclarationOnly: boolean): {
    jitForced: false;
    decorator: Map<string, ts.Expression>;
    metadata: R3DirectiveMetadata;
    inputs: ClassPropertyMapping<InputMapping>;
    outputs: ClassPropertyMapping;
    isStructural: boolean;
    hostDirectives: HostDirectiveMeta[] | null;
    rawHostDirectives: ts.Expression | null;
    inputFieldNamesFromMetadataArray: Set<string>;
    hostBindingNodes: HostBindingNodes;
} | {
    jitForced: true;
};
export declare function extractDecoratorQueryMetadata(exprNode: ts.Node, name: string, args: ReadonlyArray<ts.Expression>, propertyName: string, reflector: ReflectionHost, evaluator: PartialEvaluator): R3QueryMetadata;
export declare function parseDirectiveStyles(directive: Map<string, ts.Expression>, evaluator: PartialEvaluator, compilationMode: CompilationMode): null | string[];
export declare function parseFieldStringArrayValue(directive: Map<string, ts.Expression>, field: string, evaluator: PartialEvaluator): null | string[];
/**
 * Returns a function that can be used to extract data for the `setClassMetadata`
 * calls from undecorated directive class members.
 */
export declare function getDirectiveUndecoratedMetadataExtractor(reflector: ReflectionHost, importTracker: ImportedSymbolsTracker): UndecoratedMetadataExtractor;
/**
 * Parses the `transform` function and its type for a decorator `@Input`.
 *
 * This logic verifies feasibility of extracting the transform write type
 * into a different place, so that the input write type can be captured at
 * a later point in a static acceptance member.
 *
 * Note: This is not needed for signal inputs where the transform type is
 * automatically captured in the type of the `InputSignal`.
 *
 */
export declare function parseDecoratorInputTransformFunction(clazz: ClassDeclaration, classPropertyName: string, value: DynamicValue | Reference, reflector: ReflectionHost, refEmitter: ReferenceEmitter, compilationMode: CompilationMode, emitDeclarationOnly: boolean): DecoratorInputTransform;
export declare function extractHostBindingResources(nodes: HostBindingNodes): ReadonlySet<Resource>;
export {};
