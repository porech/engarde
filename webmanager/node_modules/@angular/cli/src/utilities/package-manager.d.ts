/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { PackageManager } from '../../lib/config/workspace-schema';
import { AngularWorkspace } from './config';
export interface PackageManagerUtilsContext {
    globalConfiguration: AngularWorkspace;
    workspace?: AngularWorkspace;
    root: string;
}
/**
 * Utilities for interacting with various package managers.
 */
export declare class PackageManagerUtils {
    private readonly context;
    /**
     * @param context The context for the package manager utilities, including workspace and global configuration.
     */
    constructor(context: PackageManagerUtilsContext);
    /** Get the package manager name. */
    get name(): PackageManager;
    /** Get the package manager version. */
    get version(): string | undefined;
    /** Install a single package. */
    install(packageName: string, save?: 'dependencies' | 'devDependencies' | true, extraArgs?: string[], cwd?: string): Promise<boolean>;
    /** Install all packages. */
    installAll(extraArgs?: string[], cwd?: string): Promise<boolean>;
    /** Install a single package temporary. */
    installTemp(packageName: string, extraArgs?: string[]): Promise<{
        success: boolean;
        tempNodeModules: string;
    }>;
    private getArguments;
    private run;
    private getVersion;
    private getName;
    /**
     * Checks if a lockfile for a specific package manager exists in the root directory.
     * @param packageManager The package manager to check for.
     * @param filesInRoot An array of file names in the root directory.
     * @returns True if the lockfile exists, false otherwise.
     */
    private hasLockfile;
    private getConfiguredPackageManager;
}
