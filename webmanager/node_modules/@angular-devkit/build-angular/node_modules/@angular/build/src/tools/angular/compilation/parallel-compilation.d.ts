/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { CompilerOptions } from '@angular/compiler-cli';
import type { PartialMessage } from 'esbuild';
import type { SourceFile } from 'typescript';
import type { AngularHostOptions } from '../angular-host';
import { AngularCompilation, DiagnosticModes, EmitFileResult } from './angular-compilation';
/**
 * An Angular compilation which uses a Node.js Worker thread to load and execute
 * the TypeScript and Angular compilers. This allows for longer synchronous actions
 * such as semantic and template diagnostics to be calculated in parallel to the
 * other aspects of the application bundling process. The worker thread also has
 * a separate memory pool which significantly reduces the need for adjusting the
 * main Node.js CLI process memory settings with large application code sizes.
 */
export declare class ParallelCompilation extends AngularCompilation {
    #private;
    private readonly jit;
    private readonly browserOnlyBuild;
    constructor(jit: boolean, browserOnlyBuild: boolean);
    initialize(tsconfig: string, hostOptions: AngularHostOptions, compilerOptionsTransformer?: (compilerOptions: CompilerOptions) => CompilerOptions): Promise<{
        affectedFiles: ReadonlySet<SourceFile>;
        compilerOptions: CompilerOptions;
        referencedFiles: readonly string[];
        externalStylesheets?: ReadonlyMap<string, string>;
    }>;
    /**
     * This is not needed with this compilation type since the worker will already send a response
     * with the serializable esbuild compatible diagnostics.
     */
    protected collectDiagnostics(): never;
    diagnoseFiles(modes?: DiagnosticModes): Promise<{
        errors?: PartialMessage[];
        warnings?: PartialMessage[];
    }>;
    emitAffectedFiles(): Promise<Iterable<EmitFileResult>>;
    update(files: Set<string>): Promise<void>;
    close(): Promise<void>;
}
