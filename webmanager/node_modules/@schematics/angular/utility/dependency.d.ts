/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Rule, Tree } from '@angular-devkit/schematics';
/**
 * An enum used to specify the type of a dependency found within a package manifest
 * file (`package.json`).
 */
export declare enum DependencyType {
    Default = "dependencies",
    Dev = "devDependencies",
    Peer = "peerDependencies"
}
/**
 * An enum used to specify the dependency installation behavior for the {@link addDependency}
 * schematics rule. The installation behavior affects if and when {@link NodePackageInstallTask}
 * will be scheduled when using the rule.
 */
export declare enum InstallBehavior {
    /**
     * No installation will occur as a result of the rule when specified.
     *
     * NOTE: This does not prevent other rules from scheduling a {@link NodePackageInstallTask}
     * which may install the dependency.
     */
    None = 0,
    /**
     * Automatically determine the need to schedule a {@link NodePackageInstallTask} based on
     * previous usage of the {@link addDependency} within the schematic.
     */
    Auto = 1,
    /**
     * Always schedule a {@link NodePackageInstallTask} when the rule is executed.
     */
    Always = 2
}
/**
 * An enum used to specify the existing dependency behavior for the {@link addDependency}
 * schematics rule. The existing behavior affects whether the named dependency will be added
 * to the `package.json` when the dependency is already present with a differing specifier.
 */
export declare enum ExistingBehavior {
    /**
     * The dependency will not be added or otherwise changed if it already exists.
     */
    Skip = 0,
    /**
     * The dependency's existing specifier will be replaced with the specifier provided in the
     * {@link addDependency} call. A warning will also be shown during schematic execution to
     * notify the user of the replacement.
     */
    Replace = 1
}
/**
 * Represents a dependency found in a package manifest.
 */
export interface Dependency {
    /**
     * The type of the dependency.
     */
    type: DependencyType;
    /**
     * The name of the package.
     */
    name: string;
    /**
     * The version specifier of the package.
     */
    version: string;
}
/**
 * Gets information about a dependency from a `package.json` file.
 *
 * @param tree The schematic's virtual file system representation.
 * @param name The name of the package to check.
 * @param packageJsonPath The path to the `package.json` file. Defaults to `/package.json`.
 * @returns An object containing the dependency's type and version, or null if not found.
 */
export declare function getDependency(tree: Tree, name: string, packageJsonPath?: string): Dependency | null;
/**
 * Adds a package as a dependency to a `package.json`. By default the `package.json` located
 * at the schematic's root will be used. The `manifestPath` option can be used to explicitly specify
 * a `package.json` in different location. The type of the dependency can also be specified instead
 * of the default of the `dependencies` section by using the `type` option for either `devDependencies`
 * or `peerDependencies`.
 *
 * When using this rule, {@link NodePackageInstallTask} does not need to be included directly by
 * a schematic. A package manager install task will be automatically scheduled as needed.
 *
 * @param name The name of the package to add.
 * @param specifier The package specifier for the package to add. Typically a SemVer range.
 * @param options An optional object that can contain the `type` of the dependency
 * and/or a path (`packageJsonPath`) of a manifest file (`package.json`) to modify.
 * @returns A Schematics {@link Rule}
 */
export declare function addDependency(name: string, specifier: string, options?: {
    /**
     * The type of the dependency determines the section of the `package.json` to which the
     * dependency will be added. Defaults to {@link DependencyType.Default} (`dependencies`).
     */
    type?: DependencyType;
    /**
     * The path of the package manifest file (`package.json`) that will be modified.
     * Defaults to `/package.json`.
     */
    packageJsonPath?: string;
    /**
     * The dependency installation behavior to use to determine whether a
     * {@link NodePackageInstallTask} should be scheduled after adding the dependency.
     * Defaults to {@link InstallBehavior.Auto}.
     */
    install?: InstallBehavior;
    /**
     * The behavior to use when the dependency already exists within the `package.json`.
     * Defaults to {@link ExistingBehavior.Replace}.
     */
    existing?: ExistingBehavior;
}): Rule;
/**
 * Removes a package from the package.json in the project root.
 *
 * @param name The name of the package to remove.
 * @param options An optional object that can contain a path of a manifest file to modify.
 * @returns A Schematics {@link Rule}
 */
export declare function removeDependency(name: string, options?: {
    /**
     * The path of the package manifest file (`package.json`) that will be modified.
     * Defaults to `/package.json`.
     */
    packageJsonPath?: string;
    /**
     * The dependency installation behavior to use to determine whether a
     * {@link NodePackageInstallTask} should be scheduled after removing the dependency.
     * Defaults to {@link InstallBehavior.Auto}.
     */
    install?: InstallBehavior;
}): Rule;
