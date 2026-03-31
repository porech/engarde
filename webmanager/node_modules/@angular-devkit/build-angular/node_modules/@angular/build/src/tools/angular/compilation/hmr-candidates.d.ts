/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type ng from '@angular/compiler-cli';
import ts from 'typescript';
/**
 * Analyzes one or more modified files for changes to determine if any
 * class declarations for Angular components are candidates for hot
 * module replacement (HMR). If any source files are also modified but
 * are not candidates then all candidates become invalid. This invalidation
 * ensures that a full rebuild occurs and the running application stays
 * synchronized with the code.
 * @param modifiedFiles A set of modified files to analyze.
 * @param param1 An Angular compiler instance
 * @param staleSourceFiles A map of paths to previous source file instances.
 * @returns A set of HMR candidate component class declarations.
 */
export declare function collectHmrCandidates(modifiedFiles: Set<string>, { compiler }: ng.NgtscProgram, staleSourceFiles: Map<string, ts.SourceFile> | undefined): Set<ts.ClassDeclaration>;
