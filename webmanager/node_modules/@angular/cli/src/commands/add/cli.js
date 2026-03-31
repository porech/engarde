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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("@angular-devkit/schematics/tools");
const listr2_1 = require("listr2");
const node_assert_1 = __importDefault(require("node:assert"));
const node_module_1 = require("node:module");
const node_path_1 = require("node:path");
const npm_package_arg_1 = __importDefault(require("npm-package-arg"));
const semver_1 = require("semver");
const workspace_schema_1 = require("../../../lib/config/workspace-schema");
const schematics_command_module_1 = require("../../command-builder/schematics-command-module");
const error_1 = require("../../utilities/error");
const package_metadata_1 = require("../../utilities/package-metadata");
const tty_1 = require("../../utilities/tty");
const version_1 = require("../../utilities/version");
class CommandError extends Error {
}
/**
 * The set of packages that should have certain versions excluded from consideration
 * when attempting to find a compatible version for a package.
 * The key is a package name and the value is a SemVer range of versions to exclude.
 */
const packageVersionExclusions = {
    // @angular/localize@9.x and earlier versions as well as @angular/localize@10.0 prereleases do not have peer dependencies setup.
    '@angular/localize': '<10.0.0',
    // @angular/material@7.x versions have unbounded peer dependency ranges (>=7.0.0).
    '@angular/material': '7.x',
};
class AddCommandModule extends schematics_command_module_1.SchematicsCommandModule {
    command = 'add <collection>';
    describe = 'Adds support for an external library to your project.';
    longDescriptionPath = (0, node_path_1.join)(__dirname, 'long-description.md');
    allowPrivateSchematics = true;
    schematicName = 'ng-add';
    rootRequire = (0, node_module_1.createRequire)(this.context.root + '/');
    async builder(argv) {
        const localYargs = (await super.builder(argv))
            .positional('collection', {
            description: 'The package to be added.',
            type: 'string',
            demandOption: true,
        })
            .option('registry', { description: 'The NPM registry to use.', type: 'string' })
            .option('verbose', {
            description: 'Display additional details about internal operations during execution.',
            type: 'boolean',
            default: false,
        })
            .option('skip-confirmation', {
            description: 'Skip asking a confirmation prompt before installing and executing the package. ' +
                'Ensure package name is correct prior to using this option.',
            type: 'boolean',
            default: false,
        })
            // Prior to downloading we don't know the full schema and therefore we cannot be strict on the options.
            // Possibly in the future update the logic to use the following syntax:
            // `ng add @angular/localize -- --package-options`.
            .strict(false);
        const collectionName = this.getCollectionName();
        if (!collectionName) {
            return localYargs;
        }
        const workflow = this.getOrCreateWorkflowForBuilder(collectionName);
        try {
            const collection = workflow.engine.createCollection(collectionName);
            const options = await this.getSchematicOptions(collection, this.schematicName, workflow);
            return this.addSchemaOptionsToCommand(localYargs, options);
        }
        catch (error) {
            // During `ng add` prior to the downloading of the package
            // we are not able to resolve and create a collection.
            // Or when the collection value is a path to a tarball.
        }
        return localYargs;
    }
    // eslint-disable-next-line max-lines-per-function
    async run(options) {
        const { logger, packageManager } = this.context;
        const { verbose, registry, collection, skipConfirmation } = options;
        let packageIdentifier;
        try {
            packageIdentifier = (0, npm_package_arg_1.default)(collection);
        }
        catch (e) {
            (0, error_1.assertIsError)(e);
            logger.error(e.message);
            return 1;
        }
        if (packageIdentifier.name &&
            packageIdentifier.registry &&
            this.isPackageInstalled(packageIdentifier.name)) {
            const validVersion = await this.isProjectVersionValid(packageIdentifier);
            if (validVersion) {
                // Already installed so just run schematic
                logger.info('Skipping installation: Package already installed');
                return this.executeSchematic({ ...options, collection: packageIdentifier.name });
            }
        }
        const taskContext = {
            packageIdentifier,
            executeSchematic: this.executeSchematic.bind(this),
            hasMismatchedPeer: this.hasMismatchedPeer.bind(this),
        };
        const tasks = new listr2_1.Listr([
            {
                title: 'Determining Package Manager',
                task(context, task) {
                    context.usingYarn = packageManager.name === workspace_schema_1.PackageManager.Yarn;
                    task.output = `Using package manager: ${listr2_1.color.dim(packageManager.name)}`;
                },
                rendererOptions: { persistentOutput: true },
            },
            {
                title: 'Searching for compatible package version',
                enabled: packageIdentifier.type === 'range' && packageIdentifier.rawSpec === '*',
                async task(context, task) {
                    (0, node_assert_1.default)(context.packageIdentifier.name, 'Registry package identifiers should always have a name.');
                    // only package name provided; search for viable version
                    // plus special cases for packages that did not have peer deps setup
                    let packageMetadata;
                    try {
                        packageMetadata = await (0, package_metadata_1.fetchPackageMetadata)(context.packageIdentifier.name, logger, {
                            registry,
                            usingYarn: context.usingYarn,
                            verbose,
                        });
                    }
                    catch (e) {
                        (0, error_1.assertIsError)(e);
                        throw new CommandError(`Unable to load package information from registry: ${e.message}`);
                    }
                    // Start with the version tagged as `latest` if it exists
                    const latestManifest = packageMetadata.tags['latest'];
                    if (latestManifest) {
                        context.packageIdentifier = npm_package_arg_1.default.resolve(latestManifest.name, latestManifest.version);
                    }
                    // Adjust the version based on name and peer dependencies
                    if (latestManifest?.peerDependencies &&
                        Object.keys(latestManifest.peerDependencies).length === 0) {
                        task.output = `Found compatible package version: ${listr2_1.color.blue(latestManifest.version)}.`;
                    }
                    else if (!latestManifest || (await context.hasMismatchedPeer(latestManifest))) {
                        // 'latest' is invalid so search for most recent matching package
                        // Allow prelease versions if the CLI itself is a prerelease
                        const allowPrereleases = (0, semver_1.prerelease)(version_1.VERSION.full);
                        const versionExclusions = packageVersionExclusions[packageMetadata.name];
                        const versionManifests = Object.values(packageMetadata.versions).filter((value) => {
                            // Prerelease versions are not stable and should not be considered by default
                            if (!allowPrereleases && (0, semver_1.prerelease)(value.version)) {
                                return false;
                            }
                            // Deprecated versions should not be used or considered
                            if (value.deprecated) {
                                return false;
                            }
                            // Excluded package versions should not be considered
                            if (versionExclusions &&
                                (0, semver_1.satisfies)(value.version, versionExclusions, { includePrerelease: true })) {
                                return false;
                            }
                            return true;
                        });
                        // Sort in reverse SemVer order so that the newest compatible version is chosen
                        versionManifests.sort((a, b) => (0, semver_1.compare)(b.version, a.version, true));
                        let found = false;
                        for (const versionManifest of versionManifests) {
                            const mismatch = await context.hasMismatchedPeer(versionManifest);
                            if (mismatch) {
                                continue;
                            }
                            context.packageIdentifier = npm_package_arg_1.default.resolve(versionManifest.name, versionManifest.version);
                            found = true;
                            break;
                        }
                        if (!found) {
                            task.output = "Unable to find compatible package. Using 'latest' tag.";
                        }
                        else {
                            task.output = `Found compatible package version: ${listr2_1.color.blue(context.packageIdentifier.toString())}.`;
                        }
                    }
                    else {
                        task.output = `Found compatible package version: ${listr2_1.color.blue(context.packageIdentifier.toString())}.`;
                    }
                },
                rendererOptions: { persistentOutput: true },
            },
            {
                title: 'Loading package information from registry',
                async task(context, task) {
                    let manifest;
                    try {
                        manifest = await (0, package_metadata_1.fetchPackageManifest)(context.packageIdentifier.toString(), logger, {
                            registry,
                            verbose,
                            usingYarn: context.usingYarn,
                        });
                    }
                    catch (e) {
                        (0, error_1.assertIsError)(e);
                        throw new CommandError(`Unable to fetch package information for '${context.packageIdentifier}': ${e.message}`);
                    }
                    context.savePackage = manifest['ng-add']?.save;
                    context.collectionName = manifest.name;
                    if (await context.hasMismatchedPeer(manifest)) {
                        task.output = listr2_1.color.yellow(listr2_1.figures.warning +
                            ' Package has unmet peer dependencies. Adding the package may not succeed.');
                    }
                },
                rendererOptions: { persistentOutput: true },
            },
            {
                title: 'Confirming installation',
                enabled: !skipConfirmation,
                async task(context, task) {
                    if (!(0, tty_1.isTTY)()) {
                        task.output =
                            `'--skip-confirmation' can be used to bypass installation confirmation. ` +
                                `Ensure package name is correct prior to '--skip-confirmation' option usage.`;
                        throw new CommandError('No terminal detected');
                    }
                    const { ListrInquirerPromptAdapter } = await Promise.resolve().then(() => __importStar(require('@listr2/prompt-adapter-inquirer')));
                    const { confirm } = await Promise.resolve().then(() => __importStar(require('@inquirer/prompts')));
                    const shouldProceed = await task.prompt(ListrInquirerPromptAdapter).run(confirm, {
                        message: `The package ${listr2_1.color.blue(context.packageIdentifier.toString())} will be installed and executed.\n` +
                            'Would you like to proceed?',
                        default: true,
                        theme: { prefix: '' },
                    });
                    if (!shouldProceed) {
                        throw new CommandError('Command aborted');
                    }
                },
                rendererOptions: { persistentOutput: true },
            },
            {
                async task(context, task) {
                    // Only show if installation will actually occur
                    task.title = 'Installing package';
                    if (context.savePackage === false) {
                        task.title += ' in temporary location';
                        // Temporary packages are located in a different directory
                        // Hence we need to resolve them using the temp path
                        const { success, tempNodeModules } = await packageManager.installTemp(context.packageIdentifier.toString(), registry ? [`--registry="${registry}"`] : undefined);
                        const tempRequire = (0, node_module_1.createRequire)(tempNodeModules + '/');
                        (0, node_assert_1.default)(context.collectionName, 'Collection name should always be available');
                        const resolvedCollectionPath = tempRequire.resolve((0, node_path_1.join)(context.collectionName, 'package.json'));
                        if (!success) {
                            throw new CommandError('Unable to install package');
                        }
                        context.collectionName = (0, node_path_1.dirname)(resolvedCollectionPath);
                    }
                    else {
                        const success = await packageManager.install(context.packageIdentifier.toString(), context.savePackage, registry ? [`--registry="${registry}"`] : undefined, undefined);
                        if (!success) {
                            throw new CommandError('Unable to install package');
                        }
                    }
                },
                rendererOptions: { bottomBar: Infinity },
            },
            // TODO: Rework schematic execution as a task and insert here
        ]);
        try {
            const result = await tasks.run(taskContext);
            (0, node_assert_1.default)(result.collectionName, 'Collection name should always be available');
            return this.executeSchematic({ ...options, collection: result.collectionName });
        }
        catch (e) {
            if (e instanceof CommandError) {
                return 1;
            }
            throw e;
        }
    }
    async isProjectVersionValid(packageIdentifier) {
        if (!packageIdentifier.name) {
            return false;
        }
        const installedVersion = await this.findProjectVersion(packageIdentifier.name);
        if (!installedVersion) {
            return false;
        }
        if (packageIdentifier.rawSpec === '*') {
            return true;
        }
        if (packageIdentifier.type === 'range' &&
            packageIdentifier.fetchSpec &&
            packageIdentifier.fetchSpec !== '*') {
            return (0, semver_1.satisfies)(installedVersion, packageIdentifier.fetchSpec);
        }
        if (packageIdentifier.type === 'version') {
            const v1 = (0, semver_1.valid)(packageIdentifier.fetchSpec);
            const v2 = (0, semver_1.valid)(installedVersion);
            return v1 !== null && v1 === v2;
        }
        return false;
    }
    getCollectionName() {
        const [, collectionName] = this.context.args.positional;
        if (!collectionName) {
            return undefined;
        }
        // The CLI argument may specify also a version, like `ng add @my/lib@13.0.0`,
        // but here we need only the name of the package, like `@my/lib`.
        try {
            const packageName = (0, npm_package_arg_1.default)(collectionName).name;
            if (packageName) {
                return packageName;
            }
        }
        catch (e) {
            (0, error_1.assertIsError)(e);
            this.context.logger.error(e.message);
        }
        return collectionName;
    }
    isPackageInstalled(name) {
        try {
            this.rootRequire.resolve((0, node_path_1.join)(name, 'package.json'));
            return true;
        }
        catch (e) {
            (0, error_1.assertIsError)(e);
            if (e.code !== 'MODULE_NOT_FOUND') {
                throw e;
            }
        }
        return false;
    }
    async executeSchematic(options) {
        try {
            const { verbose, skipConfirmation, interactive, force, dryRun, registry, defaults, collection: collectionName, ...schematicOptions } = options;
            return await this.runSchematic({
                schematicOptions,
                schematicName: this.schematicName,
                collectionName,
                executionOptions: {
                    interactive,
                    force,
                    dryRun,
                    defaults,
                    packageRegistry: registry,
                },
            });
        }
        catch (e) {
            if (e instanceof tools_1.NodePackageDoesNotSupportSchematics) {
                this.context.logger.error('The package that you are trying to add does not support schematics.' +
                    'You can try using a different version of the package or contact the package author to add ng-add support.');
                return 1;
            }
            throw e;
        }
    }
    async findProjectVersion(name) {
        const { logger, root } = this.context;
        let installedPackage;
        try {
            installedPackage = this.rootRequire.resolve((0, node_path_1.join)(name, 'package.json'));
        }
        catch { }
        if (installedPackage) {
            try {
                const installed = await (0, package_metadata_1.fetchPackageManifest)((0, node_path_1.dirname)(installedPackage), logger);
                return installed.version;
            }
            catch { }
        }
        let projectManifest;
        try {
            projectManifest = await (0, package_metadata_1.fetchPackageManifest)(root, logger);
        }
        catch { }
        if (projectManifest) {
            const version = projectManifest.dependencies?.[name] || projectManifest.devDependencies?.[name];
            if (version) {
                return version;
            }
        }
        return null;
    }
    async hasMismatchedPeer(manifest) {
        for (const peer in manifest.peerDependencies) {
            let peerIdentifier;
            try {
                peerIdentifier = npm_package_arg_1.default.resolve(peer, manifest.peerDependencies[peer]);
            }
            catch {
                this.context.logger.warn(`Invalid peer dependency ${peer} found in package.`);
                continue;
            }
            if (peerIdentifier.type === 'version' || peerIdentifier.type === 'range') {
                try {
                    const version = await this.findProjectVersion(peer);
                    if (!version) {
                        continue;
                    }
                    const options = { includePrerelease: true };
                    if (!(0, semver_1.intersects)(version, peerIdentifier.rawSpec, options) &&
                        !(0, semver_1.satisfies)(version, peerIdentifier.rawSpec, options)) {
                        return true;
                    }
                }
                catch {
                    // Not found or invalid so ignore
                    continue;
                }
            }
            else {
                // type === 'tag' | 'file' | 'directory' | 'remote' | 'git'
                // Cannot accurately compare these as the tag/location may have changed since install
            }
        }
        return false;
    }
}
exports.default = AddCommandModule;
