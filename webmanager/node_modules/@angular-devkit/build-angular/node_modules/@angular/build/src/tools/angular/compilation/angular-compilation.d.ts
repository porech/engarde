/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type ng from '@angular/compiler-cli';
import type { PartialMessage } from 'esbuild';
import type ts from 'typescript';
import type { AngularHostOptions } from '../angular-host';
export interface EmitFileResult {
    filename: string;
    contents: string;
    dependencies?: readonly string[];
}
export declare enum DiagnosticModes {
    None = 0,
    Option = 1,
    Syntactic = 2,
    Semantic = 4,
    All = 7
}
export declare abstract class AngularCompilation {
    #private;
    static loadCompilerCli(): Promise<typeof ng>;
    static loadTypescript(): Promise<typeof ts>;
    protected loadConfiguration(tsconfig: string): Promise<ng.CompilerOptions>;
    abstract initialize(tsconfig: string, hostOptions: AngularHostOptions, compilerOptionsTransformer?: (compilerOptions: ng.CompilerOptions) => ng.CompilerOptions): Promise<{
        affectedFiles: ReadonlySet<ts.SourceFile>;
        compilerOptions: ng.CompilerOptions;
        referencedFiles: readonly string[];
        externalStylesheets?: ReadonlyMap<string, string>;
        templateUpdates?: ReadonlyMap<string, string>;
    }>;
    abstract emitAffectedFiles(): Iterable<EmitFileResult> | Promise<Iterable<EmitFileResult>>;
    protected abstract collectDiagnostics(modes: DiagnosticModes): Iterable<ts.Diagnostic> | Promise<Iterable<ts.Diagnostic>>;
    diagnoseFiles(modes?: DiagnosticModes): Promise<{
        errors?: PartialMessage[];
        warnings?: PartialMessage[];
    }>;
    update?(files: Set<string>): Promise<void>;
    close?(): Promise<void>;
}
