/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type ng from '@angular/compiler-cli';
import type ts from 'typescript';
export type AngularCompilerOptions = ng.CompilerOptions;
export type AngularCompilerHost = ng.CompilerHost;
export interface AngularHostOptions {
    fileReplacements?: Record<string, string>;
    sourceFileCache?: Map<string, ts.SourceFile>;
    modifiedFiles?: Set<string>;
    externalStylesheets?: Map<string, string>;
    transformStylesheet(data: string, containingFile: string, stylesheetFile?: string, order?: number, className?: string): Promise<string | null>;
    processWebWorker(workerFile: string, containingFile: string): string;
}
/**
 * Patches in-place the `getSourceFiles` function on an instance of a TypeScript
 * `Program` to ensure that all returned SourceFile instances have a `version`
 * field. The `version` field is required when used with a TypeScript BuilderProgram.
 * @param program The TypeScript Program instance to patch.
 */
export declare function ensureSourceFileVersions(program: ts.Program): void;
export declare function createAngularCompilerHost(typescript: typeof ts, compilerOptions: AngularCompilerOptions, hostOptions: AngularHostOptions, packageJsonCache: ts.PackageJsonInfoCache | undefined): AngularCompilerHost;
