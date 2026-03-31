/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
export declare class ChangedFiles {
    readonly added: Set<string>;
    readonly modified: Set<string>;
    readonly removed: Set<string>;
    get all(): string[];
    toDebugString(): string;
}
export interface BuildWatcher extends AsyncIterableIterator<ChangedFiles> {
    add(paths: string | readonly string[]): void;
    remove(paths: string | readonly string[]): void;
    close(): Promise<void>;
}
export declare function createWatcher(options?: {
    polling?: boolean;
    interval?: number;
    ignored?: string[];
    followSymlinks?: boolean;
}): BuildWatcher;
