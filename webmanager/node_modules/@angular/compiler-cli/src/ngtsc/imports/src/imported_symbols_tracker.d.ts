/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
/**
 * Tracks which symbols are imported in specific files and under what names. Allows for efficient
 * querying for references to those symbols without having to consult the type checker early in the
 * process.
 *
 * Note that the tracker doesn't account for variable shadowing so a final verification with the
 * type checker may be necessary, depending on the context. Also does not track dynamic imports.
 */
export declare class ImportedSymbolsTracker {
    private fileToNamedImports;
    private fileToNamespaceImports;
    /**
     * Checks if an identifier is a potential reference to a specific named import within the same
     * file.
     * @param node Identifier to be checked.
     * @param exportedName Name of the exported symbol that is being searched for.
     * @param moduleName Module from which the symbol should be imported.
     */
    isPotentialReferenceToNamedImport(node: ts.Identifier, exportedName: string, moduleName: string): boolean;
    /**
     * Checks if an identifier is a potential reference to a specific namespace import within the same
     * file.
     * @param node Identifier to be checked.
     * @param moduleName Module from which the namespace is imported.
     */
    isPotentialReferenceToNamespaceImport(node: ts.Identifier, moduleName: string): boolean;
    /**
     * Checks if a file has a named imported of a certain symbol.
     * @param sourceFile File to be checked.
     * @param exportedName Name of the exported symbol that is being checked.
     * @param moduleName Module that exports the symbol.
     */
    hasNamedImport(sourceFile: ts.SourceFile, exportedName: string, moduleName: string): boolean;
    /**
     * Checks if a file has namespace imports of a certain symbol.
     * @param sourceFile File to be checked.
     * @param moduleName Module whose namespace import is being searched for.
     */
    hasNamespaceImport(sourceFile: ts.SourceFile, moduleName: string): boolean;
    /** Scans a `SourceFile` for import statements and caches them for later use. */
    private scanImports;
}
