"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedTSCompilationState = void 0;
exports.getSharedCompilationState = getSharedCompilationState;
class SharedTSCompilationState {
    #pendingCompilation = true;
    #resolveCompilationReady;
    #compilationReadyPromise;
    #hasErrors = true;
    get waitUntilReady() {
        if (!this.#pendingCompilation) {
            return Promise.resolve(this.#hasErrors);
        }
        this.#compilationReadyPromise ??= new Promise((resolve) => {
            this.#resolveCompilationReady = resolve;
        });
        return this.#compilationReadyPromise;
    }
    markAsReady(hasErrors) {
        this.#hasErrors = hasErrors;
        this.#resolveCompilationReady?.(hasErrors);
        this.#compilationReadyPromise = undefined;
        this.#pendingCompilation = false;
    }
    markAsInProgress() {
        this.#pendingCompilation = true;
    }
    dispose() {
        this.markAsReady(true);
        globalSharedCompilationState = undefined;
    }
}
exports.SharedTSCompilationState = SharedTSCompilationState;
let globalSharedCompilationState;
function getSharedCompilationState() {
    return (globalSharedCompilationState ??= new SharedTSCompilationState());
}
