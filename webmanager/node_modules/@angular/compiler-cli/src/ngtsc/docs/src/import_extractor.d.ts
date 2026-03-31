/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
/**
 * For a given SourceFile, it extracts all imported symbols from other Angular packages.
 *
 * @returns a map Symbol => Package, eg: ApplicationRef => @angular/core
 */
export declare function getImportedSymbols(sourceFile: ts.SourceFile): Map<string, string>;
