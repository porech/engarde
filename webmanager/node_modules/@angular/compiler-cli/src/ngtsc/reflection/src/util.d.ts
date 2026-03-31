/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { ClassDeclaration, ClassMemberAccessLevel } from './host';
export declare function isNamedClassDeclaration(node: ts.Node): node is ClassDeclaration<ts.ClassDeclaration>;
export declare function isNamedFunctionDeclaration(node: ts.Node): node is ClassDeclaration<ts.FunctionDeclaration>;
export declare function isNamedVariableDeclaration(node: ts.Node): node is ClassDeclaration<ts.VariableDeclaration>;
/**
 * Converts the given class member access level to a string.
 * Useful fo error messages.
 */
export declare function classMemberAccessLevelToString(level: ClassMemberAccessLevel): string;
