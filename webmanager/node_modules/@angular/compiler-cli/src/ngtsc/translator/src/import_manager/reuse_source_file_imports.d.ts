/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { AliasImportDeclaration } from '../../../imports';
import { ImportRequest } from '../api/import_generator';
/**
 * Tracker necessary for enabling re-use of original source file imports.
 *
 * The tracker holds information about original source file imports that
 * need to be updated, or import declarations/specifiers that are now
 * referenced due to the import manager.
 */
export interface ReuseExistingSourceFileImportsTracker {
    /**
     * Map of import declarations that need to be updated to include the
     * given symbols.
     */
    updatedImports: Map<ts.ImportDeclaration, {
        propertyName: ts.Identifier;
        fileUniqueAlias: ts.Identifier | null;
    }[]>;
    /**
     * Set of re-used alias import declarations.
     *
     * These are captured so that we can tell TypeScript to not elide these source file
     * imports as we introduced references to them. More details: {@link AliasImportDeclaration}.
     */
    reusedAliasDeclarations: Set<AliasImportDeclaration>;
    /** Generates a unique identifier for a name in the given file. */
    generateUniqueIdentifier(file: ts.SourceFile, symbolName: string): ts.Identifier | null;
}
/** Attempts to re-use original source file imports for the given request. */
export declare function attemptToReuseExistingSourceFileImports(tracker: ReuseExistingSourceFileImportsTracker, sourceFile: ts.SourceFile, request: ImportRequest<ts.SourceFile>): ts.Identifier | [ts.Identifier, ts.Identifier] | null;
