/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
/**
 * An object containing all the version information that will be displayed by the command.
 */
export interface VersionInfo {
    ngCliVersion: string;
    angularCoreVersion: string;
    angularSameAsCore: string[];
    versions: Record<string, string>;
    unsupportedNodeVersion: boolean;
    nodeVersion: string;
    packageManagerName: string;
    packageManagerVersion: string | undefined;
    os: string;
    arch: string;
}
/**
 * Gathers all the version information from the environment and workspace.
 * @returns An object containing all the version information.
 */
export declare function gatherVersionInfo(context: {
    packageManager: {
        name: string;
        version: string | undefined;
    };
    root: string;
}): VersionInfo;
