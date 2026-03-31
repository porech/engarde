/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { MetadataReader } from '../../metadata';
import { ClassEntry } from './entities';
/** Extracts documentation info for a class, potentially including Angular-specific info.  */
export declare function extractClass(classDeclaration: {
    name: ts.Identifier;
} & ts.ClassDeclaration, metadataReader: MetadataReader, typeChecker: ts.TypeChecker): ClassEntry;
