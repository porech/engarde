/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type ts from 'typescript';
import { MemoryLoadResultCache } from '../load-result-cache';
export declare class SourceFileCache extends Map<string, ts.SourceFile> {
    readonly persistentCachePath?: string | undefined;
    readonly modifiedFiles: Set<string>;
    readonly typeScriptFileCache: Map<string, string | Uint8Array<ArrayBufferLike>>;
    readonly loadResultCache: MemoryLoadResultCache;
    referencedFiles?: readonly string[];
    constructor(persistentCachePath?: string | undefined);
    invalidate(files: Iterable<string>): boolean;
}
