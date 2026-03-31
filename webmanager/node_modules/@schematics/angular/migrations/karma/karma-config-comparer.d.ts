/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { KarmaConfigAnalysis, KarmaConfigValue } from './karma-config-analyzer';
/**
 * Represents the difference between two Karma configurations.
 */
export interface KarmaConfigDiff {
    /** A map of settings that were added in the project's configuration. */
    added: Map<string, KarmaConfigValue>;
    /** A map of settings that were removed from the project's configuration. */
    removed: Map<string, KarmaConfigValue>;
    /** A map of settings that were modified between the two configurations. */
    modified: Map<string, {
        projectValue: KarmaConfigValue;
        defaultValue: KarmaConfigValue;
    }>;
    /** A boolean indicating if the comparison is reliable (i.e., no unsupported values were found). */
    isReliable: boolean;
}
/**
 * Generates the default Karma configuration file content as a string.
 * @param relativePathToWorkspaceRoot The relative path from the Karma config file to the workspace root.
 * @param projectName The name of the project.
 * @param needDevkitPlugin A boolean indicating if the devkit plugin is needed.
 * @returns The content of the default `karma.conf.js` file.
 */
export declare function generateDefaultKarmaConfig(relativePathToWorkspaceRoot: string, projectName: string, needDevkitPlugin: boolean): Promise<string>;
/**
 * Compares two Karma configuration analyses and returns the difference.
 * @param projectAnalysis The analysis of the project's configuration.
 * @param defaultAnalysis The analysis of the default configuration to compare against.
 * @returns A diff object representing the changes between the two configurations.
 */
export declare function compareKarmaConfigs(projectAnalysis: KarmaConfigAnalysis, defaultAnalysis: KarmaConfigAnalysis): KarmaConfigDiff;
/**
 * Checks if there are any differences in the provided Karma configuration diff.
 * @param diff The Karma configuration diff object to check.
 * @returns True if there are any differences; false otherwise.
 */
export declare function hasDifferences(diff: KarmaConfigDiff): boolean;
/**
 * Compares a project's Karma configuration with the default configuration.
 * @param projectConfigContent The content of the project's `karma.conf.js` file.
 * @param projectRoot The root directory of the project.
 * @param needDevkitPlugin A boolean indicating if the devkit plugin is needed for the default config.
 * @param karmaConfigPath The path to the Karma configuration file, used to resolve relative paths.
 * @returns A diff object representing the changes.
 */
export declare function compareKarmaConfigToDefault(projectConfigContent: string, projectName: string, karmaConfigPath: string, needDevkitPlugin: boolean): Promise<KarmaConfigDiff>;
/**
 * Compares a project's Karma configuration with the default configuration.
 * @param projectAnalysis The analysis of the project's configuration.
 * @param projectRoot The root directory of the project.
 * @param needDevkitPlugin A boolean indicating if the devkit plugin is needed for the default config.
 * @param karmaConfigPath The path to the Karma configuration file, used to resolve relative paths.
 * @returns A diff object representing the changes.
 */
export declare function compareKarmaConfigToDefault(projectAnalysis: KarmaConfigAnalysis, projectName: string, karmaConfigPath: string, needDevkitPlugin: boolean): Promise<KarmaConfigDiff>;
