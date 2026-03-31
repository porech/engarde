/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
export declare class FileReferenceTracker {
    #private;
    get referencedFiles(): MapIterator<string>;
    add(containingFile: string, referencedFiles: Iterable<string>): void;
    /**
     *
     * @param changed The set of changed files.
     */
    update(changed: Set<string>): Set<string>;
}
