"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSearchDirectories = generateSearchDirectories;
exports.findTailwindConfiguration = findTailwindConfiguration;
exports.loadPostcssConfiguration = loadPostcssConfiguration;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const postcssConfigurationFiles = ['postcss.config.json', '.postcssrc.json'];
const tailwindConfigFiles = [
    'tailwind.config.js',
    'tailwind.config.cjs',
    'tailwind.config.mjs',
    'tailwind.config.ts',
];
async function generateSearchDirectories(roots) {
    return await Promise.all(roots.map((root) => (0, promises_1.readdir)(root, { withFileTypes: true }).then((entries) => ({
        root,
        files: new Set(entries.filter((entry) => entry.isFile()).map((entry) => entry.name)),
    }))));
}
function findFile(searchDirectories, potentialFiles) {
    for (const { root, files } of searchDirectories) {
        for (const potential of potentialFiles) {
            if (files.has(potential)) {
                return (0, node_path_1.join)(root, potential);
            }
        }
    }
    return undefined;
}
function findTailwindConfiguration(searchDirectories) {
    return findFile(searchDirectories, tailwindConfigFiles);
}
async function readPostcssConfiguration(configurationFile) {
    const data = await (0, promises_1.readFile)(configurationFile, 'utf-8');
    const config = JSON.parse(data);
    return config;
}
async function loadPostcssConfiguration(searchDirectories) {
    const configPath = findFile(searchDirectories, postcssConfigurationFiles);
    if (!configPath) {
        return undefined;
    }
    const raw = await readPostcssConfiguration(configPath);
    // If no plugins are defined, consider it equivalent to no configuration
    if (!raw.plugins || typeof raw.plugins !== 'object') {
        return undefined;
    }
    // Normalize plugin array form
    if (Array.isArray(raw.plugins)) {
        if (raw.plugins.length < 1) {
            return undefined;
        }
        const config = { plugins: [] };
        for (const element of raw.plugins) {
            if (typeof element === 'string') {
                config.plugins.push([element]);
            }
            else {
                config.plugins.push(element);
            }
        }
        return config;
    }
    // Normalize plugin object map form
    const entries = Object.entries(raw.plugins);
    if (entries.length < 1) {
        return undefined;
    }
    const config = { plugins: [] };
    for (const [name, options] of entries) {
        if (!options || (typeof options !== 'object' && typeof options !== 'string')) {
            continue;
        }
        config.plugins.push([name, options]);
    }
    return config;
}
