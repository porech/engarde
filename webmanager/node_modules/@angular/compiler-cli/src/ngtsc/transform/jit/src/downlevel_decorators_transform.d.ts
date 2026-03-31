/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { ReflectionHost } from '../../../reflection';
/**
 * Gets a transformer for downleveling Angular constructor parameter and property decorators.
 *
 * Note that Angular class decorators are never processed as those rely on side effects that
 * would otherwise no longer be executed. i.e. the creation of a component definition.
 *
 * @param typeChecker Reference to the program's type checker.
 * @param host Reflection host that is used for determining decorators.
 * @param diagnostics List which will be populated with diagnostics if any.
 * @param isCore Whether the current TypeScript program is for the `@angular/core` package.
 * @param isClosureCompilerEnabled Whether closure annotations need to be added where needed.
 * @param shouldTransformClass Optional function to check if a given class should be transformed.
 */
export declare function getDownlevelDecoratorsTransform(typeChecker: ts.TypeChecker, host: ReflectionHost, diagnostics: ts.Diagnostic[], isCore: boolean, isClosureCompilerEnabled: boolean, shouldTransformClass?: (node: ts.ClassDeclaration) => boolean): ts.TransformerFactory<ts.SourceFile>;
