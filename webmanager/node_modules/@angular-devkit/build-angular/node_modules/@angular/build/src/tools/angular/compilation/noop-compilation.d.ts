/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type ng from '@angular/compiler-cli';
import type ts from 'typescript';
import { AngularHostOptions } from '../angular-host';
import { AngularCompilation } from './angular-compilation';
export declare class NoopCompilation extends AngularCompilation {
    initialize(tsconfig: string, hostOptions: AngularHostOptions, compilerOptionsTransformer?: (compilerOptions: ng.CompilerOptions) => ng.CompilerOptions): Promise<{
        affectedFiles: ReadonlySet<ts.SourceFile>;
        compilerOptions: ng.CompilerOptions;
        referencedFiles: readonly string[];
    }>;
    collectDiagnostics(): never;
    emitAffectedFiles(): never;
}
