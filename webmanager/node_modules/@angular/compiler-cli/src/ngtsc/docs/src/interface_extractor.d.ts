/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { InterfaceEntry } from './entities';
/** Extracts documentation info for an interface. */
export declare function extractInterface(declaration: ts.InterfaceDeclaration, typeChecker: ts.TypeChecker): InterfaceEntry;
