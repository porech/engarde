"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileReferenceTracker = void 0;
const node_path_1 = require("node:path");
class FileReferenceTracker {
    #referencingFiles = new Map();
    get referencedFiles() {
        return this.#referencingFiles.keys();
    }
    add(containingFile, referencedFiles) {
        const normalizedContainingFile = (0, node_path_1.normalize)(containingFile);
        for (const file of referencedFiles) {
            const normalizedReferencedFile = (0, node_path_1.normalize)(file);
            if (normalizedReferencedFile === normalizedContainingFile) {
                // Containing file is already known to the AOT compiler
                continue;
            }
            const referencing = this.#referencingFiles.get(normalizedReferencedFile);
            if (referencing === undefined) {
                this.#referencingFiles.set(normalizedReferencedFile, new Set([normalizedContainingFile]));
            }
            else {
                referencing.add(normalizedContainingFile);
            }
        }
    }
    /**
     *
     * @param changed The set of changed files.
     */
    update(changed) {
        // Lazily initialized to avoid unneeded copying if there are no additions to return
        let allChangedFiles;
        // Add referencing files to fully notify the AOT compiler of required component updates
        for (const modifiedFile of changed) {
            const normalizedModifiedFile = (0, node_path_1.normalize)(modifiedFile);
            const referencing = this.#referencingFiles.get(normalizedModifiedFile);
            if (referencing) {
                allChangedFiles ??= new Set(changed);
                for (const referencingFile of referencing) {
                    allChangedFiles.add(referencingFile);
                }
                // Cleanup the stale record which will be updated by new resource transforms
                this.#referencingFiles.delete(normalizedModifiedFile);
            }
        }
        return allChangedFiles ?? changed;
    }
}
exports.FileReferenceTracker = FileReferenceTracker;
