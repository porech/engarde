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
const dependency_1 = require("../utility/dependency");
const json_file_1 = require("../utility/json-file");
const latest_versions_1 = require("../utility/latest-versions");
const standalone_1 = require("../utility/standalone");
const workspace_1 = require("../utility/workspace");
const workspace_models_1 = require("../utility/workspace-models");
/**
 * The list of development dependencies used by the E2E protractor-based builder.
 * The versions are sourced from the latest versions `../utility/latest-versions/package.json`
 * file which is automatically updated via renovate.
 */
const E2E_DEV_DEPENDENCIES = Object.freeze([
    'protractor',
    'jasmine-spec-reporter',
    'ts-node',
    '@types/node',
]);
function addScriptsToPackageJson() {
    return (host) => {
        const pkgJson = new json_file_1.JSONFile(host, 'package.json');
        const e2eScriptPath = ['scripts', 'e2e'];
        if (!pkgJson.get(e2eScriptPath)) {
            pkgJson.modify(e2eScriptPath, 'ng e2e', false);
        }
    };
}
function default_1(options) {
    const { relatedAppName } = options;
    return (0, workspace_1.updateWorkspace)((workspace) => {
        const project = workspace.projects.get(relatedAppName);
        if (!project) {
            throw new schematics_1.SchematicsException(`Project name "${relatedAppName}" doesn't not exist.`);
        }
        const e2eRootPath = node_path_1.posix.join(project.root, 'e2e');
        project.targets.add({
            name: 'e2e',
            builder: workspace_models_1.Builders.Protractor,
            defaultConfiguration: 'development',
            options: {
                protractorConfig: node_path_1.posix.join(e2eRootPath, 'protractor.conf.js'),
            },
            configurations: {
                production: {
                    devServerTarget: `${relatedAppName}:serve:production`,
                },
                development: {
                    devServerTarget: `${relatedAppName}:serve:development`,
                },
            },
        });
        return (0, schematics_1.chain)([
            (0, schematics_1.mergeWith)((0, schematics_1.apply)((0, schematics_1.url)('./files'), [
                (0, schematics_1.applyTemplates)({
                    utils: schematics_1.strings,
                    ...options,
                    relativePathToWorkspaceRoot: node_path_1.posix.relative(node_path_1.posix.join('/', e2eRootPath), '/'),
                }),
                (0, schematics_1.move)(e2eRootPath),
            ])),
            (0, standalone_1.addRootProvider)(relatedAppName, ({ code, external }) => code `${external('provideProtractorTestingSupport', '@angular/platform-browser')}()`),
            ...E2E_DEV_DEPENDENCIES.map((name) => (0, dependency_1.addDependency)(name, latest_versions_1.latestVersions[name], {
                type: dependency_1.DependencyType.Dev,
                existing: dependency_1.ExistingBehavior.Skip,
            })),
            addScriptsToPackageJson(),
        ]);
    });
}
