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
exports.generateDefaultKarmaConfig = generateDefaultKarmaConfig;
exports.compareKarmaConfigs = compareKarmaConfigs;
exports.hasDifferences = hasDifferences;
exports.compareKarmaConfigToDefault = compareKarmaConfigToDefault;
const promises_1 = require("node:fs/promises");
const posix_1 = __importDefault(require("node:path/posix"));
const node_util_1 = require("node:util");
const paths_1 = require("../../utility/paths");
const karma_config_analyzer_1 = require("./karma-config-analyzer");
/**
 * Generates the default Karma configuration file content as a string.
 * @param relativePathToWorkspaceRoot The relative path from the Karma config file to the workspace root.
 * @param projectName The name of the project.
 * @param needDevkitPlugin A boolean indicating if the devkit plugin is needed.
 * @returns The content of the default `karma.conf.js` file.
 */
async function generateDefaultKarmaConfig(relativePathToWorkspaceRoot, projectName, needDevkitPlugin) {
    const templatePath = require.resolve('../../config/files/karma.conf.js.template');
    let template = await (0, promises_1.readFile)(templatePath, 'utf-8');
    // TODO: Replace this with the actual schematic templating logic.
    template = template
        .replace(/<%= relativePathToWorkspaceRoot %>/g, posix_1.default.normalize(relativePathToWorkspaceRoot).replace(/\\/g, '/'))
        .replace(/<%= folderName %>/g, projectName);
    const devkitPluginRegex = /<% if \(needDevkitPlugin\) { %>(.*?)<% } %>/gs;
    const replacement = needDevkitPlugin ? '$1' : '';
    template = template.replace(devkitPluginRegex, replacement);
    return template;
}
/**
 * Compares two Karma configuration analyses and returns the difference.
 * @param projectAnalysis The analysis of the project's configuration.
 * @param defaultAnalysis The analysis of the default configuration to compare against.
 * @returns A diff object representing the changes between the two configurations.
 */
function compareKarmaConfigs(projectAnalysis, defaultAnalysis) {
    const added = new Map();
    const removed = new Map();
    const modified = new Map();
    const allKeys = new Set([...projectAnalysis.settings.keys(), ...defaultAnalysis.settings.keys()]);
    for (const key of allKeys) {
        const projectValue = projectAnalysis.settings.get(key);
        const defaultValue = defaultAnalysis.settings.get(key);
        if (projectValue !== undefined && defaultValue === undefined) {
            added.set(key, projectValue);
        }
        else if (projectValue === undefined && defaultValue !== undefined) {
            removed.set(key, defaultValue);
        }
        else if (projectValue !== undefined && defaultValue !== undefined) {
            if (!(0, node_util_1.isDeepStrictEqual)(projectValue, defaultValue)) {
                modified.set(key, { projectValue, defaultValue });
            }
        }
    }
    return {
        added,
        removed,
        modified,
        isReliable: !projectAnalysis.hasUnsupportedValues && !defaultAnalysis.hasUnsupportedValues,
    };
}
/**
 * Checks if there are any differences in the provided Karma configuration diff.
 * @param diff The Karma configuration diff object to check.
 * @returns True if there are any differences; false otherwise.
 */
function hasDifferences(diff) {
    return diff.added.size > 0 || diff.removed.size > 0 || diff.modified.size > 0;
}
async function compareKarmaConfigToDefault(projectConfigOrAnalysis, projectName, karmaConfigPath, needDevkitPlugin) {
    const projectAnalysis = typeof projectConfigOrAnalysis === 'string'
        ? (0, karma_config_analyzer_1.analyzeKarmaConfig)(projectConfigOrAnalysis)
        : projectConfigOrAnalysis;
    const defaultContent = await generateDefaultKarmaConfig((0, paths_1.relativePathToWorkspaceRoot)(posix_1.default.dirname(karmaConfigPath)), projectName, needDevkitPlugin);
    const defaultAnalysis = (0, karma_config_analyzer_1.analyzeKarmaConfig)(defaultContent);
    return compareKarmaConfigs(projectAnalysis, defaultAnalysis);
}
