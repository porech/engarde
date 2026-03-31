/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { Reference } from '../../../imports';
import { ForeignFunctionResolver, SyntheticValue } from '../../../partial_evaluator';
import { ClassDeclaration, ReflectionHost } from '../../../reflection';
/**
 * Creates a foreign function resolver to detect a `ModuleWithProviders<T>` type in a return type
 * position of a function or method declaration. A `SyntheticValue` is produced if such a return
 * type is recognized.
 *
 * @param reflector The reflection host to use for analyzing the syntax.
 * @param isCore Whether the @angular/core package is being compiled.
 */
export declare function createModuleWithProvidersResolver(reflector: ReflectionHost, isCore: boolean): ForeignFunctionResolver;
export interface ResolvedModuleWithProviders {
    ngModule: Reference<ClassDeclaration>;
    mwpCall: ts.CallExpression;
}
export declare function isResolvedModuleWithProviders(sv: SyntheticValue<unknown>): sv is SyntheticValue<ResolvedModuleWithProviders>;
