/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { ImportSpecifier, Node, SourceFile } from 'typescript';
import { MigrationResponse } from './types';
export declare function analyzeForUnsupportedZoneUses(sourceFile: SourceFile): Promise<MigrationResponse | null>;
/**
 * Finds usages of `NgZone` that are not supported in zoneless applications.
 * @param sourceFile The source file to check.
 * @param ngZoneImport The import specifier for `NgZone`.
 * @returns A list of nodes that are unsupported `NgZone` usages.
 */
export declare function findUnsupportedZoneUsages(sourceFile: SourceFile, ngZoneImport: ImportSpecifier): Promise<Node[]>;
