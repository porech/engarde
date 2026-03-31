"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExistingBehavior = exports.InstallBehavior = exports.DependencyType = void 0;
exports.getDependency = getDependency;
exports.addDependency = addDependency;
exports.removeDependency = removeDependency;
const tasks_1 = require("@angular-devkit/schematics/tasks");
const path = __importStar(require("node:path"));
const installTasks = new WeakMap();
/**
 * An enum used to specify the type of a dependency found within a package manifest
 * file (`package.json`).
 */
var DependencyType;
(function (DependencyType) {
    DependencyType["Default"] = "dependencies";
    DependencyType["Dev"] = "devDependencies";
    DependencyType["Peer"] = "peerDependencies";
})(DependencyType || (exports.DependencyType = DependencyType = {}));
/**
 * An enum used to specify the dependency installation behavior for the {@link addDependency}
 * schematics rule. The installation behavior affects if and when {@link NodePackageInstallTask}
 * will be scheduled when using the rule.
 */
var InstallBehavior;
(function (InstallBehavior) {
    /**
     * No installation will occur as a result of the rule when specified.
     *
     * NOTE: This does not prevent other rules from scheduling a {@link NodePackageInstallTask}
     * which may install the dependency.
     */
    InstallBehavior[InstallBehavior["None"] = 0] = "None";
    /**
     * Automatically determine the need to schedule a {@link NodePackageInstallTask} based on
     * previous usage of the {@link addDependency} within the schematic.
     */
    InstallBehavior[InstallBehavior["Auto"] = 1] = "Auto";
    /**
     * Always schedule a {@link NodePackageInstallTask} when the rule is executed.
     */
    InstallBehavior[InstallBehavior["Always"] = 2] = "Always";
})(InstallBehavior || (exports.InstallBehavior = InstallBehavior = {}));
/**
 * An enum used to specify the existing dependency behavior for the {@link addDependency}
 * schematics rule. The existing behavior affects whether the named dependency will be added
 * to the `package.json` when the dependency is already present with a differing specifier.
 */
var ExistingBehavior;
(function (ExistingBehavior) {
    /**
     * The dependency will not be added or otherwise changed if it already exists.
     */
    ExistingBehavior[ExistingBehavior["Skip"] = 0] = "Skip";
    /**
     * The dependency's existing specifier will be replaced with the specifier provided in the
     * {@link addDependency} call. A warning will also be shown during schematic execution to
     * notify the user of the replacement.
     */
    ExistingBehavior[ExistingBehavior["Replace"] = 1] = "Replace";
})(ExistingBehavior || (exports.ExistingBehavior = ExistingBehavior = {}));
/**
 * Gets information about a dependency from a `package.json` file.
 *
 * @param tree The schematic's virtual file system representation.
 * @param name The name of the package to check.
 * @param packageJsonPath The path to the `package.json` file. Defaults to `/package.json`.
 * @returns An object containing the dependency's type and version, or null if not found.
 */
function getDependency(tree, name, packageJsonPath = '/package.json') {
    const manifest = tree.readJson(packageJsonPath);
    for (const type of [DependencyType.Default, DependencyType.Dev, DependencyType.Peer]) {
        const section = manifest[type];
        if (section?.[name]) {
            return {
                type,
                name,
                version: section[name],
            };
        }
    }
    return null;
}
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
function addDependency(name, specifier, options = {}) {
    const { type = DependencyType.Default, packageJsonPath = '/package.json', install = InstallBehavior.Auto, existing = ExistingBehavior.Replace, } = options;
    return (tree, context) => {
        const manifest = tree.readJson(packageJsonPath);
        const dependencySection = manifest[type];
        if (!dependencySection) {
            // Section is not present. The dependency can be added to a new object literal for the section.
            manifest[type] = { [name]: specifier };
        }
        else {
            const existingSpecifier = dependencySection[name];
            if (existingSpecifier === specifier) {
                // Already present with same specifier
                return;
            }
            if (existingSpecifier) {
                // Already present but different specifier
                if (existing === ExistingBehavior.Skip) {
                    return;
                }
                // ExistingBehavior.Replace is the only other behavior currently
                context.logger.warn(`Package dependency "${name}" already exists with a different specifier. ` +
                    `"${existingSpecifier}" will be replaced with "${specifier}".`);
            }
            // Add new dependency in alphabetical order
            const entries = Object.entries(dependencySection);
            entries.push([name, specifier]);
            entries.sort((a, b) => a[0].localeCompare(b[0]));
            manifest[type] = Object.fromEntries(entries);
        }
        tree.overwrite(packageJsonPath, JSON.stringify(manifest, null, 2));
        const installPaths = installTasks.get(context) ?? new Set();
        if (install === InstallBehavior.Always ||
            (install === InstallBehavior.Auto && !installPaths.has(packageJsonPath))) {
            context.addTask(new tasks_1.NodePackageInstallTask({ workingDirectory: path.dirname(packageJsonPath) }));
            installPaths.add(packageJsonPath);
            installTasks.set(context, installPaths);
        }
    };
}
/**
 * Removes a package from the package.json in the project root.
 *
 * @param name The name of the package to remove.
 * @param options An optional object that can contain a path of a manifest file to modify.
 * @returns A Schematics {@link Rule}
 */
function removeDependency(name, options = {}) {
    const { packageJsonPath = '/package.json', install = InstallBehavior.Auto } = options;
    return (tree, context) => {
        const manifest = tree.readJson(packageJsonPath);
        let wasRemoved = false;
        for (const type of [DependencyType.Default, DependencyType.Dev, DependencyType.Peer]) {
            const dependencySection = manifest[type];
            if (dependencySection?.[name]) {
                delete dependencySection[name];
                wasRemoved = true;
            }
        }
        if (wasRemoved) {
            tree.overwrite(packageJsonPath, JSON.stringify(manifest, null, 2));
            const installPaths = installTasks.get(context) ?? new Set();
            if (install === InstallBehavior.Always ||
                (install === InstallBehavior.Auto && !installPaths.has(packageJsonPath))) {
                context.addTask(new tasks_1.NodePackageInstallTask({ workingDirectory: path.dirname(packageJsonPath) }));
                installPaths.add(packageJsonPath);
                installTasks.set(context, installPaths);
            }
        }
    };
}
