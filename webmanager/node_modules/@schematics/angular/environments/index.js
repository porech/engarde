"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const schematics_1 = require("@angular-devkit/schematics");
const node_path_1 = require("node:path");
const workspace_1 = require("../utility/workspace");
const workspace_models_1 = require("../utility/workspace-models");
const ENVIRONMENTS_DIRECTORY = 'environments';
const ENVIRONMENT_FILE_CONTENT = 'export const environment = {};\n';
function default_1(options) {
    return (0, workspace_1.updateWorkspace)((workspace) => {
        const project = workspace.projects.get(options.project);
        if (!project) {
            throw new schematics_1.SchematicsException(`Project name "${options.project}" doesn't not exist.`);
        }
        const type = project.extensions['projectType'];
        if (type !== 'application') {
            return log('error', 'Only application project types are support by this schematic.' + type
                ? ` Project "${options.project}" has a "projectType" of "${type}".`
                : ` Project "${options.project}" has no "projectType" defined.`);
        }
        const buildTarget = project.targets.get('build');
        if (!buildTarget) {
            return log('error', `No "build" target found for project "${options.project}".` +
                ' A "build" target is required to generate environment files.');
        }
        const serverTarget = project.targets.get('server');
        const sourceRoot = project.sourceRoot ?? node_path_1.posix.join(project.root, 'src');
        // The generator needs to be iterated prior to returning to ensure all workspace changes that occur
        // within the generator are present for `updateWorkspace` when it writes the workspace file.
        return (0, schematics_1.chain)([
            ...generateConfigurationEnvironments(buildTarget, serverTarget, sourceRoot, options.project),
        ]);
    });
}
function createIfMissing(path) {
    return (tree, context) => {
        if (tree.exists(path)) {
            context.logger.info(`Skipping creation of already existing environment file "${path}".`);
        }
        else {
            tree.create(path, ENVIRONMENT_FILE_CONTENT);
        }
    };
}
function log(type, text) {
    return (_, context) => context.logger[type](text);
}
function* generateConfigurationEnvironments(buildTarget, serverTarget, sourceRoot, projectName) {
    if (buildTarget.builder !== workspace_models_1.Builders.Browser &&
        buildTarget.builder !== workspace_models_1.Builders.BrowserEsbuild &&
        buildTarget.builder !== workspace_models_1.Builders.Application &&
        buildTarget.builder !== workspace_models_1.Builders.BuildApplication) {
        yield log('warn', `"build" target found for project "${projectName}" has a third-party builder "${buildTarget.builder}".` +
            ' The generated project options may not be compatible with this builder.');
    }
    if (serverTarget && serverTarget.builder !== workspace_models_1.Builders.Server) {
        yield log('warn', `"server" target found for project "${projectName}" has a third-party builder "${buildTarget.builder}".` +
            ' The generated project options may not be compatible with this builder.');
    }
    // Create default environment file
    const defaultFilePath = node_path_1.posix.join(sourceRoot, ENVIRONMENTS_DIRECTORY, 'environment.ts');
    yield createIfMissing(defaultFilePath);
    const configurationEntries = [
        ...Object.entries(buildTarget.configurations ?? {}),
        ...Object.entries(serverTarget?.configurations ?? {}),
    ];
    const addedFiles = new Set();
    for (const [name, configurationOptions] of configurationEntries) {
        if (!configurationOptions) {
            // Invalid configuration
            continue;
        }
        // Default configuration will use the default environment file
        if (name === buildTarget.defaultConfiguration) {
            continue;
        }
        const configurationFilePath = node_path_1.posix.join(sourceRoot, ENVIRONMENTS_DIRECTORY, `environment.${name}.ts`);
        // Add file replacement option entry for the configuration environment file
        const replacements = (configurationOptions['fileReplacements'] ??= []);
        const existing = replacements.find((value) => value.replace === defaultFilePath);
        if (existing) {
            if (existing.with === configurationFilePath) {
                yield log('info', `Skipping addition of already existing file replacements option for "${defaultFilePath}" to "${configurationFilePath}".`);
            }
            else {
                yield log('warn', `Configuration "${name}" has a file replacements option for "${defaultFilePath}" but with a different replacement.` +
                    ` Expected "${configurationFilePath}" but found "${existing.with}". This may result in unexpected build behavior.`);
            }
        }
        else {
            replacements.push({ replace: defaultFilePath, with: configurationFilePath });
        }
        // Create configuration specific environment file if not already added
        if (!addedFiles.has(configurationFilePath)) {
            addedFiles.add(configurationFilePath);
            yield createIfMissing(configurationFilePath);
        }
    }
}
