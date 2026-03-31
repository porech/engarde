/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { AbsoluteFsPath, ReadonlyFileSystem } from '../src/ngtsc/file_system';
import * as api from './transformers/api';
export declare function formatDiagnostics(diags: ReadonlyArray<ts.Diagnostic>, host?: ts.FormatDiagnosticsHost): string;
/** Used to read configuration files. */
export type ConfigurationHost = Pick<ReadonlyFileSystem, 'readFile' | 'exists' | 'lstat' | 'resolve' | 'join' | 'dirname' | 'extname' | 'pwd' | 'readdir'>;
export interface ParsedConfiguration {
    project: string;
    options: api.CompilerOptions;
    rootNames: string[];
    projectReferences?: readonly ts.ProjectReference[] | undefined;
    emitFlags: api.EmitFlags;
    errors: ts.Diagnostic[];
}
export declare function calcProjectFileAndBasePath(project: string, host?: ConfigurationHost): {
    projectFile: AbsoluteFsPath;
    basePath: AbsoluteFsPath;
};
export declare function readConfiguration(project: string, existingOptions?: api.CompilerOptions, host?: ConfigurationHost): ParsedConfiguration;
export interface PerformCompilationResult {
    diagnostics: ReadonlyArray<ts.Diagnostic>;
    program?: api.Program;
    emitResult?: ts.EmitResult;
}
export declare function exitCodeFromResult(diags: ReadonlyArray<ts.Diagnostic> | undefined): number;
export declare function performCompilation<CbEmitRes extends ts.EmitResult = ts.EmitResult>({ rootNames, options, host, oldProgram, emitCallback, mergeEmitResultsCallback, gatherDiagnostics, customTransformers, emitFlags, forceEmit, modifiedResourceFiles, }: {
    rootNames: string[];
    options: api.CompilerOptions;
    host?: api.CompilerHost;
    oldProgram?: api.Program;
    emitCallback?: api.TsEmitCallback<CbEmitRes>;
    mergeEmitResultsCallback?: api.TsMergeEmitResultsCallback<CbEmitRes>;
    gatherDiagnostics?: (program: api.Program) => ReadonlyArray<ts.Diagnostic>;
    customTransformers?: api.CustomTransformers;
    emitFlags?: api.EmitFlags;
    forceEmit?: boolean;
    modifiedResourceFiles?: Set<string> | null;
}): PerformCompilationResult;
export declare function defaultGatherDiagnostics(program: api.Program): ReadonlyArray<ts.Diagnostic>;
