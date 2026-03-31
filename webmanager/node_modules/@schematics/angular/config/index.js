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
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const paths_1 = require("../utility/paths");
const workspace_1 = require("../utility/workspace");
const workspace_models_1 = require("../utility/workspace-models");
const schema_1 = require("./schema");
function default_1(options) {
    switch (options.type) {
        case schema_1.Type.Karma:
            return addKarmaConfig(options);
        case schema_1.Type.Browserslist:
            return addBrowserslistConfig(options);
        default:
            throw new schematics_1.SchematicsException(`"${options.type}" is an unknown configuration file type.`);
    }
}
function addBrowserslistConfig(options) {
    return async (host) => {
        const workspace = await (0, workspace_1.getWorkspace)(host);
        const project = workspace.projects.get(options.project);
        if (!project) {
            throw new schematics_1.SchematicsException(`Project name "${options.project}" doesn't not exist.`);
        }
        // Read Angular's default vendored `.browserslistrc` file.
        const config = await (0, promises_1.readFile)(node_path_1.posix.join(__dirname, '.browserslistrc'), 'utf8');
        return (0, schematics_1.mergeWith)((0, schematics_1.apply)((0, schematics_1.url)('./files'), [
            (0, schematics_1.filter)((p) => p.endsWith('.browserslistrc.template')),
            (0, schematics_1.applyTemplates)({ config }),
            (0, schematics_1.move)(project.root),
        ]));
    };
}
function addKarmaConfig(options) {
    return (0, workspace_1.updateWorkspace)((workspace) => {
        const project = workspace.projects.get(options.project);
        if (!project) {
            throw new schematics_1.SchematicsException(`Project name "${options.project}" doesn't not exist.`);
        }
        const testTarget = project.targets.get('test');
        if (!testTarget) {
            throw new schematics_1.SchematicsException(`No "test" target found for project "${options.project}".` +
                ' A "test" target is required to generate a karma configuration.');
        }
        if (testTarget.builder !== workspace_models_1.Builders.Karma &&
            testTarget.builder !== workspace_models_1.Builders.BuildKarma) {
            throw new schematics_1.SchematicsException(`Cannot add a karma configuration as builder for "test" target in project does not` +
                ` use "${workspace_models_1.Builders.Karma}" or "${workspace_models_1.Builders.BuildKarma}".`);
        }
        testTarget.options ??= {};
        testTarget.options.karmaConfig = node_path_1.posix.join(project.root, 'karma.conf.js');
        // If scoped project (i.e. "@foo/bar"), convert dir to "foo/bar".
        let folderName = options.project.startsWith('@') ? options.project.slice(1) : options.project;
        if (/[A-Z]/.test(folderName)) {
            folderName = schematics_1.strings.dasherize(folderName);
        }
        return (0, schematics_1.mergeWith)((0, schematics_1.apply)((0, schematics_1.url)('./files'), [
            (0, schematics_1.filter)((p) => p.endsWith('karma.conf.js.template')),
            (0, schematics_1.applyTemplates)({
                relativePathToWorkspaceRoot: (0, paths_1.relativePathToWorkspaceRoot)(project.root),
                folderName,
                needDevkitPlugin: testTarget.builder === workspace_models_1.Builders.Karma,
            }),
            (0, schematics_1.move)(project.root),
        ]));
    });
}
