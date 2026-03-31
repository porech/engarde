/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { EnumEntry } from './entities';
import ts from 'typescript';
/** Extracts documentation entry for an enum. */
export declare function extractEnum(declaration: ts.EnumDeclaration, typeChecker: ts.TypeChecker): EnumEntry;
