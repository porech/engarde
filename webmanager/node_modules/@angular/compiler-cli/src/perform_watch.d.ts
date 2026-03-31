/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { ParsedConfiguration } from './perform_compile';
import * as api from './transformers/api';
export declare enum FileChangeEvent {
    Change = 0,
    CreateDelete = 1,
    CreateDeleteDir = 2
}
export interface PerformWatchHost<CbEmitRes extends ts.EmitResult = ts.EmitResult> {
    reportDiagnostics(diagnostics: ReadonlyArray<ts.Diagnostic>): void;
    readConfiguration(): ParsedConfiguration;
    createCompilerHost(options: api.CompilerOptions): api.CompilerHost;
    createEmitCallback(options: api.CompilerOptions): api.TsEmitCallback<CbEmitRes> | undefined;
    onFileChange(options: api.CompilerOptions, listener: (event: FileChangeEvent, fileName: string) => void, ready: () => void): {
        close: () => void;
    };
    setTimeout(callback: () => void, ms: number): any;
    clearTimeout(timeoutId: any): void;
}
export declare function createPerformWatchHost<CbEmitRes extends ts.EmitResult = ts.EmitResult>(configFileName: string, reportDiagnostics: (diagnostics: ReadonlyArray<ts.Diagnostic>) => void, existingOptions?: ts.CompilerOptions, createEmitCallback?: (options: api.CompilerOptions) => api.TsEmitCallback<CbEmitRes> | undefined): PerformWatchHost;
/**
 * The logic in this function is adapted from `tsc.ts` from TypeScript.
 */
export declare function performWatchCompilation(host: PerformWatchHost): {
    close: () => void;
    ready: (cb: () => void) => void;
    firstCompileResult: ReadonlyArray<ts.Diagnostic>;
};
