/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { ImportedSymbolsTracker } from '../../../../imports';
import { ReflectionHost } from '../../../../reflection';
/**
 * Creates an AST transform that looks for Angular classes and transforms
 * initializer-based declared members to work with JIT compilation.
 *
 * For example, an `input()` member may be transformed to add an `@Input`
 * decorator for JIT.
 *
 * @param host Reflection host
 * @param importTracker Import tracker for efficient import checking.
 * @param isCore Whether this transforms runs against `@angular/core`.
 * @param shouldTransformClass Optional function to check if a given class should be transformed.
 */
export declare function getInitializerApiJitTransform(host: ReflectionHost, importTracker: ImportedSymbolsTracker, isCore: boolean, shouldTransformClass?: (node: ts.ClassDeclaration) => boolean): ts.TransformerFactory<ts.SourceFile>;
