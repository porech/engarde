/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { FatalDiagnosticError } from '../../../diagnostics';
import { Reference } from '../../../imports';
import { HostDirectiveMeta, MetadataReader } from '../../../metadata';
import { PartialEvaluator, ResolvedValue } from '../../../partial_evaluator';
import { ClassDeclaration, ReflectionHost } from '../../../reflection';
import { DeclarationData, LocalModuleScopeRegistry } from '../../../scope';
import { InjectableClassRegistry } from './injectable_registry';
import { CompilationMode } from '../../../transform';
/**
 * Create a `ts.Diagnostic` which indicates the given class is part of the declarations of two or
 * more NgModules.
 *
 * The resulting `ts.Diagnostic` will have a context entry for each NgModule showing the point where
 * the directive/pipe exists in its `declarations` (if possible).
 */
export declare function makeDuplicateDeclarationError(node: ClassDeclaration, data: DeclarationData[], kind: string): ts.Diagnostic;
/**
 * Creates a `FatalDiagnosticError` for a node that did not evaluate to the expected type. The
 * diagnostic that is created will include details on why the value is incorrect, i.e. it includes
 * a representation of the actual type that was unsupported, or in the case of a dynamic value the
 * trace to the node where the dynamic value originated.
 *
 * @param node The node for which the diagnostic should be produced.
 * @param value The evaluated value that has the wrong type.
 * @param messageText The message text of the error.
 */
export declare function createValueHasWrongTypeError(node: ts.Node, value: ResolvedValue, messageText: string): FatalDiagnosticError;
/**
 * Gets the diagnostics for a set of provider classes.
 * @param providerClasses Classes that should be checked.
 * @param providersDeclaration Node that declares the providers array.
 * @param registry Registry that keeps track of the registered injectable classes.
 */
export declare function getProviderDiagnostics(providerClasses: Set<Reference<ClassDeclaration>>, providersDeclaration: ts.Expression, registry: InjectableClassRegistry): ts.Diagnostic[];
export declare function getDirectiveDiagnostics(node: ClassDeclaration, injectableRegistry: InjectableClassRegistry, evaluator: PartialEvaluator, reflector: ReflectionHost, scopeRegistry: LocalModuleScopeRegistry, strictInjectionParameters: boolean, kind: 'Directive' | 'Component'): ts.Diagnostic[] | null;
export declare function validateHostDirectives(origin: ts.Expression, hostDirectives: HostDirectiveMeta[], metaReader: MetadataReader): ts.DiagnosticWithLocation[];
export declare function getUndecoratedClassWithAngularFeaturesDiagnostic(node: ClassDeclaration): ts.Diagnostic;
export declare function checkInheritanceOfInjectable(node: ClassDeclaration, injectableRegistry: InjectableClassRegistry, reflector: ReflectionHost, evaluator: PartialEvaluator, strictInjectionParameters: boolean, kind: 'Directive' | 'Component' | 'Pipe' | 'Injectable'): ts.Diagnostic | null;
interface ClassWithCtor {
    ref: Reference<ClassDeclaration>;
    isCtorValid: boolean;
    isDecorated: boolean;
}
export declare function findInheritedCtor(node: ClassDeclaration, injectableRegistry: InjectableClassRegistry, reflector: ReflectionHost, evaluator: PartialEvaluator): ClassWithCtor | null;
/**
 * Throws `FatalDiagnosticError` with error code `LOCAL_COMPILATION_UNRESOLVED_CONST`
 * if the compilation mode is local and the value is not resolved due to being imported
 * from external files. This is a common scenario for errors in local compilation mode,
 * and so this helper can be used to quickly generate the relevant errors.
 *
 * @param nodeToHighlight Node to be highlighted in teh error message.
 * Will default to value.node if not provided.
 */
export declare function assertLocalCompilationUnresolvedConst(compilationMode: CompilationMode, value: ResolvedValue, nodeToHighlight: ts.Node | null, errorMessage: string): void;
export {};
