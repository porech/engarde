/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
export interface RequireInfo {
    module: string;
    export?: string;
    isCall?: boolean;
    arguments?: KarmaConfigValue[];
}
export type KarmaConfigValue = string | boolean | number | KarmaConfigValue[] | {
    [key: string]: KarmaConfigValue;
} | RequireInfo | undefined;
export interface KarmaConfigAnalysis {
    settings: Map<string, KarmaConfigValue>;
    hasUnsupportedValues: boolean;
}
/**
 * Analyzes the content of a Karma configuration file to extract its settings.
 *
 * @param content The string content of the `karma.conf.js` file.
 * @returns An object containing the configuration settings and a flag indicating if unsupported values were found.
 */
export declare function analyzeKarmaConfig(content: string): KarmaConfigAnalysis;
