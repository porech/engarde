"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangedFiles = void 0;
exports.createWatcher = createWatcher;
const watchpack_1 = __importDefault(require("watchpack"));
class ChangedFiles {
    added = new Set();
    modified = new Set();
    removed = new Set();
    get all() {
        return [...this.added, ...this.modified, ...this.removed];
    }
    toDebugString() {
        const content = {
            added: Array.from(this.added),
            modified: Array.from(this.modified),
            removed: Array.from(this.removed),
        };
        return JSON.stringify(content, null, 2);
    }
}
exports.ChangedFiles = ChangedFiles;
function createWatcher(options) {
    const watcher = new watchpack_1.default({
        poll: options?.polling ? options?.interval ?? true : false,
        ignored: options?.ignored,
        followSymlinks: options?.followSymlinks,
        aggregateTimeout: 250,
    });
    const watchedFiles = new Set();
    const nextQueue = [];
    let currentChangedFiles;
    watcher.on('aggregated', (changes, removals) => {
        const changedFiles = currentChangedFiles ?? new ChangedFiles();
        for (const file of changes) {
            changedFiles.modified.add(file);
        }
        for (const file of removals) {
            changedFiles.removed.add(file);
        }
        const next = nextQueue.shift();
        if (next) {
            currentChangedFiles = undefined;
            next(changedFiles);
        }
        else {
            currentChangedFiles = changedFiles;
        }
    });
    return {
        [Symbol.asyncIterator]() {
            return this;
        },
        async next() {
            if (currentChangedFiles && nextQueue.length === 0) {
                const result = { value: currentChangedFiles };
                currentChangedFiles = undefined;
                return result;
            }
            return new Promise((resolve) => {
                nextQueue.push((value) => resolve(value ? { value } : { done: true, value }));
            });
        },
        add(paths) {
            const previousSize = watchedFiles.size;
            if (typeof paths === 'string') {
                watchedFiles.add(paths);
            }
            else {
                for (const file of paths) {
                    watchedFiles.add(file);
                }
            }
            if (previousSize !== watchedFiles.size) {
                watcher.watch({
                    files: watchedFiles,
                });
            }
        },
        remove(paths) {
            const previousSize = watchedFiles.size;
            if (typeof paths === 'string') {
                watchedFiles.delete(paths);
            }
            else {
                for (const file of paths) {
                    watchedFiles.delete(file);
                }
            }
            if (previousSize !== watchedFiles.size) {
                watcher.watch({
                    files: watchedFiles,
                });
            }
        },
        async close() {
            try {
                watcher.close();
            }
            finally {
                let next;
                while ((next = nextQueue.shift()) !== undefined) {
                    next();
                }
            }
        },
    };
}
