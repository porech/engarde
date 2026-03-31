/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { ImportSpecifier, NodeArray, SourceFile } from 'typescript';
import type ts from 'typescript';
export declare function loadTypescript(): Promise<typeof ts>;
/**
 * Gets a top-level import specifier with a specific name that is imported from a particular module.
 * E.g. given a file that looks like:
 *
 * ```ts
 * import { Component, Directive } from '@angular/core';
 * import { Foo } from './foo';
 * ```
 *
 * Calling `getImportSpecifier(sourceFile, '@angular/core', 'Directive')` will yield the node
 * referring to `Directive` in the top import.
 *
 * @param sourceFile File in which to look for imports.
 * @param moduleName Name of the import's module.
 * @param specifierName Original name of the specifier to look for. Aliases will be resolved to
 *    their original name.
 */
export declare function getImportSpecifier(sourceFile: SourceFile, moduleName: string | RegExp, specifierName: string): Promise<ImportSpecifier | null>;
/**
 * Finds an import specifier with a particular name.
 * @param nodes Array of import specifiers to search through.
 * @param specifierName Name of the specifier to look for.
 */
export declare function findImportSpecifier(nodes: NodeArray<ImportSpecifier>, specifierName: string): ImportSpecifier | undefined;
/** Creates a TypeScript source file from a file path. */
export declare function createSourceFile(file: string): Promise<SourceFile>;
