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
export declare function main(args: string[], consoleError?: (s: string) => void, config?: NgcParsedConfiguration, customTransformers?: api.CustomTransformers, programReuse?: {
    program: api.Program | undefined;
}, modifiedResourceFiles?: Set<string> | null): number;
export declare function mainDiagnosticsForTest(args: string[], config?: NgcParsedConfiguration, programReuse?: {
    program: api.Program | undefined;
}, modifiedResourceFiles?: Set<string> | null): {
    exitCode: number;
    diagnostics: ReadonlyArray<ts.Diagnostic>;
};
export interface NgcParsedConfiguration extends ParsedConfiguration {
    watch?: boolean;
}
export declare function readNgcCommandLineAndConfiguration(args: string[]): NgcParsedConfiguration;
export declare function readCommandLineAndConfiguration(args: string[], existingOptions?: api.CompilerOptions, ngCmdLineOptions?: string[]): ParsedConfiguration;
export declare function watchMode(project: string, options: api.CompilerOptions, consoleError: (s: string) => void): {
    close: () => void;
    ready: (cb: () => void) => void;
    firstCompileResult: ReadonlyArray<ts.Diagnostic>;
};
