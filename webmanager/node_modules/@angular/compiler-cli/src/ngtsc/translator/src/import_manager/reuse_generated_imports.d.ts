/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { ImportRequest } from '../api/import_generator';
import type { ModuleName } from './import_manager';
/** Branded string identifying a hashed {@link ImportRequest}. */
type ImportRequestHash = string & {
    __importHash: string;
};
/** Tracker capturing re-used generated imports. */
export interface ReuseGeneratedImportsTracker {
    /**
     * Map of previously resolved symbol imports. Cache can be re-used to return
     * the same identifier without checking the source-file again.
     */
    directReuseCache: Map<ImportRequestHash, ts.Identifier | [ts.Identifier, ts.Identifier]>;
    /**
     * Map of module names and their potential namespace import
     * identifiers. Allows efficient re-using of namespace imports.
     */
    namespaceImportReuseCache: Map<ModuleName, ts.Identifier>;
}
/** Attempts to efficiently re-use previous generated import requests. */
export declare function attemptToReuseGeneratedImports(tracker: ReuseGeneratedImportsTracker, request: ImportRequest<ts.SourceFile>): ts.Identifier | [ts.Identifier, ts.Identifier] | null;
/** Captures the given import request and its generated reference node/path for future re-use. */
export declare function captureGeneratedImport(request: ImportRequest<ts.SourceFile>, tracker: ReuseGeneratedImportsTracker, referenceNode: ts.Identifier | [ts.Identifier, ts.Identifier]): void;
export {};
