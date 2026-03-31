/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { MetadataReader } from '../../metadata';
import { DocEntry } from './entities';
/**
 * Extracts all information from a source file that may be relevant for generating
 * public API documentation.
 */
export declare class DocsExtractor {
    private typeChecker;
    private metadataReader;
    constructor(typeChecker: ts.TypeChecker, metadataReader: MetadataReader);
    /**
     * Gets the set of all documentable entries from a source file, including
     * declarations that are re-exported from this file as an entry-point.
     *
     * @param sourceFile The file from which to extract documentable entries.
     */
    extractAll(sourceFile: ts.SourceFile, rootDir: string, privateModules: Set<string>): {
        entries: DocEntry[];
        symbols: Map<string, string>;
    };
    /** Extract the doc entry for a single declaration. */
    private extractDeclaration;
    /** Gets the list of exported declarations for doc extraction. */
    private getExportedDeclarations;
}
