/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type ng from '@angular/compiler-cli';
import ts from 'typescript';
import { AngularHostOptions } from '../angular-host';
import { AngularCompilation, DiagnosticModes, EmitFileResult } from './angular-compilation';
export declare class AotCompilation extends AngularCompilation {
    #private;
    private readonly browserOnlyBuild;
    constructor(browserOnlyBuild: boolean);
    initialize(tsconfig: string, hostOptions: AngularHostOptions, compilerOptionsTransformer?: (compilerOptions: ng.CompilerOptions) => ng.CompilerOptions): Promise<{
        affectedFiles: ReadonlySet<ts.SourceFile>;
        compilerOptions: ng.CompilerOptions;
        referencedFiles: readonly string[];
        externalStylesheets?: ReadonlyMap<string, string>;
        templateUpdates?: ReadonlyMap<string, string>;
    }>;
    collectDiagnostics(modes: DiagnosticModes): Iterable<ts.Diagnostic>;
    emitAffectedFiles(): Iterable<EmitFileResult>;
}
