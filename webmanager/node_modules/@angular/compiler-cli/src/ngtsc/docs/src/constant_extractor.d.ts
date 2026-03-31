/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { ConstantEntry, EnumEntry } from './entities';
/** Extracts documentation entry for a constant. */
export declare function extractConstant(declaration: ts.VariableDeclaration, typeChecker: ts.TypeChecker): ConstantEntry | EnumEntry;
/** Gets whether a given constant is an Angular-added const that should be ignored for docs. */
export declare function isSyntheticAngularConstant(declaration: ts.VariableDeclaration): boolean;
