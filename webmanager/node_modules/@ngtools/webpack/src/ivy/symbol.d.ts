/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
export declare const AngularPluginSymbol: unique symbol;
export interface EmitFileResult {
    content?: string;
    map?: string;
    dependencies: readonly string[];
    hash?: Uint8Array;
}
export type FileEmitter = (file: string) => Promise<EmitFileResult | undefined>;
export declare class FileEmitterRegistration {
    #private;
    update(emitter: FileEmitter): void;
    emit(file: string): Promise<EmitFileResult | undefined>;
}
export declare class FileEmitterCollection {
    #private;
    register(): FileEmitterRegistration;
    emit(file: string): Promise<EmitFileResult | undefined>;
}
