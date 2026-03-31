/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import type { ImportManager } from './import_manager';
/**
 * Creates a TypeScript transform for the given import manager.
 *
 *  - The transform updates existing imports with new symbols to be added.
 *  - The transform adds new necessary imports.
 *  - The transform inserts additional optional statements after imports.
 *  - The transform deletes any nodes that are marked for deletion by the manager.
 */
export declare function createTsTransformForImportManager(manager: ImportManager, extraStatementsForFiles?: Map<string, ts.Statement[]>): ts.TransformerFactory<ts.SourceFile>;
