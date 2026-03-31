/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { ImportedSymbolsTracker } from '../../imports';
import { ReflectionHost } from '../../reflection';
import { TemplateTypeChecker, TypeCheckingConfig } from '../../typecheck/api';
/**
 * Validates that TypeScript files match a specific set of rules set by the Angular compiler.
 */
export declare class SourceFileValidator {
    private rules;
    constructor(reflector: ReflectionHost, importedSymbolsTracker: ImportedSymbolsTracker, templateTypeChecker: TemplateTypeChecker, typeCheckingConfig: TypeCheckingConfig);
    /**
     * Gets the diagnostics for a specific file, or null if the file is valid.
     * @param sourceFile File to be checked.
     */
    getDiagnosticsForFile(sourceFile: ts.SourceFile): ts.Diagnostic[] | null;
}
