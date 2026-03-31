"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoopCompilation = void 0;
const angular_compilation_1 = require("./angular-compilation");
class NoopCompilation extends angular_compilation_1.AngularCompilation {
    async initialize(tsconfig, hostOptions, compilerOptionsTransformer) {
        // Load the compiler configuration and transform as needed
        const { options: originalCompilerOptions } = await this.loadConfiguration(tsconfig);
        const compilerOptions = compilerOptionsTransformer?.(originalCompilerOptions) ?? originalCompilerOptions;
        return { affectedFiles: new Set(), compilerOptions, referencedFiles: [] };
    }
    collectDiagnostics() {
        throw new Error('Not available when using noop compilation.');
    }
    emitAffectedFiles() {
        throw new Error('Not available when using noop compilation.');
    }
}
exports.NoopCompilation = NoopCompilation;
