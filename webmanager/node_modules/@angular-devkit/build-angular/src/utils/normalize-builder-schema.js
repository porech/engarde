"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeBrowserSchema = normalizeBrowserSchema;
const private_1 = require("@angular/build/private");
const normalize_asset_patterns_1 = require("./normalize-asset-patterns");
const normalize_cache_1 = require("./normalize-cache");
const normalize_file_replacements_1 = require("./normalize-file-replacements");
const normalize_optimization_1 = require("./normalize-optimization");
const normalize_polyfills_1 = require("./normalize-polyfills");
const normalize_source_maps_1 = require("./normalize-source-maps");
function normalizeBrowserSchema(workspaceRoot, projectRoot, projectSourceRoot, options, metadata, logger) {
    return {
        ...options,
        cache: (0, normalize_cache_1.normalizeCacheOptions)(metadata, workspaceRoot),
        assets: (0, normalize_asset_patterns_1.normalizeAssetPatterns)(options.assets || [], workspaceRoot, projectRoot, projectSourceRoot),
        fileReplacements: (0, normalize_file_replacements_1.normalizeFileReplacements)(options.fileReplacements || [], workspaceRoot),
        optimization: (0, normalize_optimization_1.normalizeOptimization)(options.optimization),
        sourceMap: (0, normalize_source_maps_1.normalizeSourceMaps)(options.sourceMap || false),
        polyfills: (0, normalize_polyfills_1.normalizePolyfills)(options.polyfills, workspaceRoot),
        preserveSymlinks: options.preserveSymlinks === undefined
            ? process.execArgv.includes('--preserve-symlinks')
            : options.preserveSymlinks,
        statsJson: options.statsJson || false,
        budgets: options.budgets || [],
        scripts: options.scripts || [],
        styles: options.styles || [],
        stylePreprocessorOptions: {
            includePaths: (options.stylePreprocessorOptions && options.stylePreprocessorOptions.includePaths) || [],
        },
        // Using just `--poll` will result in a value of 0 which is very likely not the intention
        // A value of 0 is falsy and will disable polling rather then enable
        // 500 ms is a sensible default in this case
        poll: options.poll === 0 ? 500 : options.poll,
        supportedBrowsers: (0, private_1.getSupportedBrowsers)(projectRoot, logger),
    };
}
