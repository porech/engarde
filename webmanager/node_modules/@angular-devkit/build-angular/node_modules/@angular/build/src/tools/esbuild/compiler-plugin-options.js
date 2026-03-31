"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompilerPluginOptions = createCompilerPluginOptions;
function createCompilerPluginOptions(options, sourceFileCache, loadResultCache, templateUpdates) {
    const { sourcemapOptions, tsconfig, fileReplacements, advancedOptimizations, jit, externalRuntimeStyles, instrumentForCoverage, optimizationOptions, } = options;
    const incremental = !!options.watch;
    return {
        sourcemap: !!sourcemapOptions.scripts && (sourcemapOptions.hidden ? 'external' : true),
        thirdPartySourcemaps: sourcemapOptions.vendor,
        tsconfig,
        jit,
        advancedOptimizations,
        fileReplacements,
        sourceFileCache,
        loadResultCache,
        incremental,
        externalRuntimeStyles,
        instrumentForCoverage,
        templateUpdates,
        includeTestMetadata: !optimizationOptions.scripts,
    };
}
