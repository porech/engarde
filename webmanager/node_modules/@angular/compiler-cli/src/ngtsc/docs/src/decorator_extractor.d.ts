/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { DecoratorEntry } from './entities';
/** Extracts an API documentation entry for an Angular decorator. */
export declare function extractorDecorator(declaration: ts.VariableDeclaration, typeChecker: ts.TypeChecker): DecoratorEntry;
/** Gets whether the given variable declaration is an Angular decorator declaration. */
export declare function isDecoratorDeclaration(declaration: ts.VariableDeclaration): boolean;
/** Gets whether an interface is the options interface for a decorator in the same file. */
export declare function isDecoratorOptionsInterface(declaration: ts.InterfaceDeclaration): boolean;
