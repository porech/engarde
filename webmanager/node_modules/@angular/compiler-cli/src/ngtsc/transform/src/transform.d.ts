/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { DefaultImportTracker, ImportRewriter, LocalCompilationExtraImportsTracker } from '../../imports';
import { PerfRecorder } from '../../perf';
import { ReflectionHost } from '../../reflection';
import { TraitCompiler } from './compilation';
export declare function ivyTransformFactory(compilation: TraitCompiler, reflector: ReflectionHost, importRewriter: ImportRewriter, defaultImportTracker: DefaultImportTracker, localCompilationExtraImportsTracker: LocalCompilationExtraImportsTracker | null, perf: PerfRecorder, isCore: boolean, isClosureCompilerEnabled: boolean, emitDeclarationOnly: boolean): ts.TransformerFactory<ts.SourceFile>;
