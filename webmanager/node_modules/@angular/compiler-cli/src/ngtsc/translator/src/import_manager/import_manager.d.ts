/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { AliasImportDeclaration, ImportRewriter } from '../../../imports';
import { ImportGenerator, ImportRequest } from '../api/import_generator';
/** Configuration for the import manager. */
export interface ImportManagerConfig {
    generateUniqueIdentifier(file: ts.SourceFile, baseName: string): ts.Identifier | null;
    shouldUseSingleQuotes(file: ts.SourceFile): boolean;
    rewriter: ImportRewriter | null;
    namespaceImportPrefix: string;
    disableOriginalSourceFileReuse: boolean;
    forceGenerateNamespacesForNewImports: boolean;
}
/**
 * Preset configuration for forcing namespace imports.
 *
 * This preset is commonly used to avoid test differences to previous
 * versions of the `ImportManager`.
 */
export declare const presetImportManagerForceNamespaceImports: Partial<ImportManagerConfig>;
/** Branded string to identify a module name. */
export type ModuleName = string & {
    __moduleName: boolean;
};
/**
 * Import manager that can be used to conveniently and efficiently generate
 * imports It efficiently re-uses existing source file imports, or previous
 * generated imports.
 *
 * These capabilities are important for efficient TypeScript transforms that
 * minimize structural changes to the dependency graph of source files, enabling
 * as much incremental re-use as possible.
 *
 * Those imports may be inserted via a TypeScript transform, or via manual string
 * manipulation using e.g. `magic-string`.
 */
export declare class ImportManager implements ImportGenerator<ts.SourceFile, ts.Identifier | ts.PropertyAccessExpression> {
    /** List of new imports that will be inserted into given source files. */
    private newImports;
    /**
     * Keeps track of imports marked for removal. The root-level key is the file from which the
     * import should be removed, the inner map key is the name of the module from which the symbol
     * is being imported. The value of the inner map is a set of symbol names that should be removed.
     * Note! the inner map tracks the original names of the imported symbols, not their local aliases.
     */
    private removedImports;
    private nextUniqueIndex;
    private config;
    private reuseSourceFileImportsTracker;
    private reuseGeneratedImportsTracker;
    constructor(config?: Partial<ImportManagerConfig>);
    /** Adds a side-effect import for the given module. */
    addSideEffectImport(requestedFile: ts.SourceFile, moduleSpecifier: string): void;
    /**
     * Adds an import to the given source-file and returns a TypeScript
     * expression that can be used to access the newly imported symbol.
     */
    addImport(request: ImportRequest<ts.SourceFile> & {
        asTypeReference: true;
    }): ts.Identifier | ts.QualifiedName;
    addImport(request: ImportRequest<ts.SourceFile> & {
        asTypeReference?: undefined;
    }): ts.Identifier | ts.PropertyAccessExpression;
    /**
     * Marks all imported symbols with a specific name for removal.
     * Call `addImport` to undo this operation.
     * @param requestedFile File from which to remove the imports.
     * @param exportSymbolName Declared name of the symbol being removed.
     * @param moduleSpecifier Module from which the symbol is being imported.
     */
    removeImport(requestedFile: ts.SourceFile, exportSymbolName: string, moduleSpecifier: string): void;
    private _generateNewImport;
    /**
     * Finalizes the import manager by computing all necessary import changes
     * and returning them.
     *
     * Changes are collected once at the end, after all imports are requested,
     * because this simplifies building up changes to existing imports that need
     * to be updated, and allows more trivial re-use of previous generated imports.
     */
    finalize(): {
        affectedFiles: Set<string>;
        updatedImports: Map<ts.NamedImports, ts.NamedImports>;
        newImports: Map<string, ts.ImportDeclaration[]>;
        reusedOriginalAliasDeclarations: Set<AliasImportDeclaration>;
        deletedImports: Set<ts.ImportDeclaration>;
    };
    /**
     * Gets a TypeScript transform for the import manager.
     *
     * @param extraStatementsMap Additional set of statements to be inserted
     *   for given source files after their imports. E.g. top-level constants.
     */
    toTsTransform(extraStatementsMap?: Map<string, ts.Statement[]>): ts.TransformerFactory<ts.SourceFile>;
    /**
     * Transforms a single file as a shorthand, using {@link toTsTransform}.
     *
     * @param extraStatementsMap Additional set of statements to be inserted
     *   for given source files after their imports. E.g. top-level constants.
     */
    transformTsFile(ctx: ts.TransformationContext, file: ts.SourceFile, extraStatementsAfterImports?: ts.Statement[]): ts.SourceFile;
    private _getNewImportsTrackerForFile;
    private _canAddSpecifier;
}
