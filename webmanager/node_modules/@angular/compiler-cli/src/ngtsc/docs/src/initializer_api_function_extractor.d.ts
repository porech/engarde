/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { InitializerApiFunctionEntry } from './entities';
/**
 * Checks whether the given node corresponds to an initializer API function.
 *
 * An initializer API function is a function declaration or variable declaration
 * that is explicitly annotated with `@initializerApiFunction`.
 *
 * Note: The node may be a function overload signature that is automatically
 * resolved to its implementation to detect the JSDoc tag.
 */
export declare function isInitializerApiFunction(node: ts.Node, typeChecker: ts.TypeChecker): node is ts.VariableDeclaration | ts.FunctionDeclaration;
/**
 * Extracts the given node as initializer API function and returns
 * a docs entry that can be rendered to represent the API function.
 */
export declare function extractInitializerApiFunction(node: ts.VariableDeclaration | ts.FunctionDeclaration, typeChecker: ts.TypeChecker): InitializerApiFunctionEntry;
