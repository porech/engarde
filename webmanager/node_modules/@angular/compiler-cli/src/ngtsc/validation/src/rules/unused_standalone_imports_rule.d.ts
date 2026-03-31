/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import type { ImportedSymbolsTracker } from '../../../imports';
import type { TemplateTypeChecker, TypeCheckingConfig } from '../../../typecheck/api';
import type { SourceFileValidatorRule } from './api';
/**
 * Rule that flags unused symbols inside of the `imports` array of a component.
 */
export declare class UnusedStandaloneImportsRule implements SourceFileValidatorRule {
    private templateTypeChecker;
    private typeCheckingConfig;
    private importedSymbolsTracker;
    constructor(templateTypeChecker: TemplateTypeChecker, typeCheckingConfig: TypeCheckingConfig, importedSymbolsTracker: ImportedSymbolsTracker);
    shouldCheck(sourceFile: ts.SourceFile): boolean;
    checkNode(node: ts.Node): ts.Diagnostic | ts.Diagnostic[] | null;
    private getUnusedSymbols;
    /**
     * Determines if an import reference *might* be coming from a shared imports array.
     * @param reference Reference to be checked.
     * @param rawImports AST node that defines the `imports` array.
     */
    private isPotentialSharedReference;
}
