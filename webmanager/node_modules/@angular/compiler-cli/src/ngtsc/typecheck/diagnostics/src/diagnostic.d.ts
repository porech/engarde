/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { ParseSourceSpan } from '@angular/compiler';
import ts from 'typescript';
import { TemplateDiagnostic, TypeCheckId, SourceMapping } from '../../api';
interface DeprecatedDiagnosticInfo {
    reportsDeprecated: {} | undefined;
    relatedMessages: ts.DiagnosticRelatedInformation[] | undefined;
}
/**
 * Constructs a `ts.Diagnostic` for a given `ParseSourceSpan` within a template.
 *
 * @param deprecatedDiagInfo Optional information about deprecation and related messages.
 */
export declare function makeTemplateDiagnostic(id: TypeCheckId, mapping: SourceMapping, span: ParseSourceSpan, category: ts.DiagnosticCategory, code: number, messageText: string | ts.DiagnosticMessageChain, relatedMessages?: {
    text: string;
    start: number;
    end: number;
    sourceFile: ts.SourceFile;
}[], deprecatedDiagInfo?: DeprecatedDiagnosticInfo): TemplateDiagnostic;
export declare function setParseTemplateAsSourceFileForTest(fn: typeof parseTemplateAsSourceFile): void;
export declare function resetParseTemplateAsSourceFileForTest(): void;
declare function parseTemplateAsSourceFile(fileName: string, template: string): ts.SourceFile;
export declare function isTemplateDiagnostic(diagnostic: ts.Diagnostic): diagnostic is TemplateDiagnostic;
export {};
