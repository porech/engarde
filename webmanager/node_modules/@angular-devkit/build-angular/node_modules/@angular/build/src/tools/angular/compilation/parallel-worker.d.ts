/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { PartialMessage } from 'esbuild';
import { type MessagePort } from 'node:worker_threads';
import type { DiagnosticModes } from './angular-compilation';
export interface InitRequest {
    jit: boolean;
    browserOnlyBuild: boolean;
    tsconfig: string;
    fileReplacements?: Record<string, string>;
    stylesheetPort: MessagePort;
    optionsPort: MessagePort;
    optionsSignal: Int32Array;
    webWorkerPort: MessagePort;
    webWorkerSignal: Int32Array;
}
export declare function initialize(request: InitRequest): Promise<{
    externalStylesheets: ReadonlyMap<string, string> | undefined;
    templateUpdates: ReadonlyMap<string, string> | undefined;
    referencedFiles: readonly string[];
    compilerOptions: {
        allowJs: boolean | undefined;
        isolatedModules: boolean | undefined;
        sourceMap: boolean | undefined;
        inlineSourceMap: boolean | undefined;
    };
}>;
export declare function diagnose(modes: DiagnosticModes): Promise<{
    errors?: PartialMessage[];
    warnings?: PartialMessage[];
}>;
export declare function emit(): Promise<import("./angular-compilation").EmitFileResult[]>;
export declare function update(files: Set<string>): void;
