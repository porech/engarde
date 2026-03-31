"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBudgetStats = generateBudgetStats;
const bundler_context_1 = require("./bundler-context");
const utils_1 = require("./utils");
/**
 * Generates a bundle budget calculator compatible stats object that provides
 * the necessary information for the Webpack-based bundle budget code to
 * interoperate with the esbuild-based builders.
 * @param metafile The esbuild metafile of a build to use.
 * @param initialFiles The records of all initial files of a build.
 * @returns A bundle budget compatible stats object.
 */
function generateBudgetStats(metafile, outputFiles, initialFiles) {
    const stats = {
        chunks: [],
        assets: [],
    };
    for (const { path: file, size, type } of outputFiles) {
        if (!file.endsWith('.js') && !file.endsWith('.css')) {
            continue;
        }
        // Exclude server bundles
        if (type === bundler_context_1.BuildOutputFileType.ServerApplication || type === bundler_context_1.BuildOutputFileType.ServerRoot) {
            continue;
        }
        const initialRecord = initialFiles.get(file);
        const name = initialRecord?.name ?? (0, utils_1.getChunkNameFromMetafile)(metafile, file);
        stats.chunks.push({
            files: [file],
            initial: !!initialRecord,
            names: name ? [name] : undefined,
        });
        stats.assets.push({
            name: file,
            size,
        });
    }
    // Add component styles from metafile
    // TODO: Provide this information directly from the AOT compiler
    for (const [file, entry] of Object.entries(metafile.outputs)) {
        if (!file.endsWith('.css')) {
            continue;
        }
        // 'ng-component' is set by the angular plugin's component stylesheet bundler
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const componentStyle = entry['ng-component'];
        if (!componentStyle) {
            continue;
        }
        stats.assets.push({
            // Component styles use the input file
            name: Object.keys(entry.inputs)[0],
            size: entry.bytes,
            componentStyle,
        });
    }
    return stats;
}
