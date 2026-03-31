/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
export interface ESMInMemoryFileLoaderWorkerData {
    outputFiles: Record<string, string>;
    workspaceRoot: string;
}
export declare function initialize(data: ESMInMemoryFileLoaderWorkerData): void;
export declare function resolve(specifier: string, context: {
    parentURL: undefined | string;
}, nextResolve: Function): any;
export declare function load(url: string, context: {
    format?: string | null;
}, nextLoad: Function): Promise<any>;
