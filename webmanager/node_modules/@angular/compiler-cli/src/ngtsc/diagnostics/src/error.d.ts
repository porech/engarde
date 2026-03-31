/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { ErrorCode } from './error_code';
export declare class FatalDiagnosticError extends Error {
    readonly code: ErrorCode;
    readonly node: ts.Node;
    readonly diagnosticMessage: string | ts.DiagnosticMessageChain;
    readonly relatedInformation?: ts.DiagnosticRelatedInformation[] | undefined;
    constructor(code: ErrorCode, node: ts.Node, diagnosticMessage: string | ts.DiagnosticMessageChain, relatedInformation?: ts.DiagnosticRelatedInformation[] | undefined);
    message: never;
    toDiagnostic(): ts.DiagnosticWithLocation;
}
export declare function makeDiagnostic(code: ErrorCode, node: ts.Node, messageText: string | ts.DiagnosticMessageChain, relatedInformation?: ts.DiagnosticRelatedInformation[], category?: ts.DiagnosticCategory): ts.DiagnosticWithLocation;
export declare function makeDiagnosticChain(messageText: string, next?: ts.DiagnosticMessageChain[]): ts.DiagnosticMessageChain;
export declare function makeRelatedInformation(node: ts.Node, messageText: string): ts.DiagnosticRelatedInformation;
export declare function addDiagnosticChain(messageText: string | ts.DiagnosticMessageChain, add: ts.DiagnosticMessageChain[]): ts.DiagnosticMessageChain;
export declare function isFatalDiagnosticError(err: any): err is FatalDiagnosticError;
/**
 * Whether the compiler diagnostics represents an error related to local compilation mode.
 *
 * This helper has application in 1P where we check whether a diagnostic is related to local
 * compilation in order to add some g3 specific info to it.
 */
export declare function isLocalCompilationDiagnostics(diagnostic: ts.Diagnostic): boolean;
