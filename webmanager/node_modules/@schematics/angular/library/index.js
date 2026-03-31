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
const posix_1 = require("node:path/posix");
const dependency_1 = require("../utility/dependency");
const json_file_1 = require("../utility/json-file");
const latest_versions_1 = require("../utility/latest-versions");
const paths_1 = require("../utility/paths");
const workspace_1 = require("../utility/workspace");
const workspace_models_1 = require("../utility/workspace-models");
const LIBRARY_DEV_DEPENDENCIES = [
    { name: '@angular/compiler-cli', version: latest_versions_1.latestVersions.Angular },
    { name: '@angular/build', version: latest_versions_1.latestVersions.AngularBuild },
    { name: 'ng-packagr', version: latest_versions_1.latestVersions.NgPackagr },
    { name: 'typescript', version: latest_versions_1.latestVersions['typescript'] },
];
function updateTsConfig(packageName, ...paths) {
    return (host) => {
        if (!host.exists('tsconfig.json')) {
            return host;
        }
        const file = new json_file_1.JSONFile(host, 'tsconfig.json');
        const jsonPath = ['compilerOptions', 'paths', packageName];
        const value = file.get(jsonPath);
        file.modify(jsonPath, Array.isArray(value) ? [...value, ...paths] : paths);
    };
}
function addTsProjectReference(...paths) {
    return (host) => {
        if (!host.exists('tsconfig.json')) {
            return host;
        }
        const newReferences = paths.map((path) => ({ path }));
        const file = new json_file_1.JSONFile(host, 'tsconfig.json');
        const jsonPath = ['references'];
        const value = file.get(jsonPath);
        file.modify(jsonPath, Array.isArray(value) ? [...value, ...newReferences] : newReferences);
    };
}
function addDependenciesToPackageJson(skipInstall) {
    return (0, schematics_1.chain)([
        ...LIBRARY_DEV_DEPENDENCIES.map((dependency) => (0, dependency_1.addDependency)(dependency.name, dependency.version, {
            type: dependency_1.DependencyType.Dev,
            existing: dependency_1.ExistingBehavior.Skip,
            install: skipInstall ? dependency_1.InstallBehavior.None : dependency_1.InstallBehavior.Auto,
        })),
        (0, dependency_1.addDependency)('tslib', latest_versions_1.latestVersions['tslib'], {
            type: dependency_1.DependencyType.Default,
            existing: dependency_1.ExistingBehavior.Skip,
            install: skipInstall ? dependency_1.InstallBehavior.None : dependency_1.InstallBehavior.Auto,
        }),
    ]);
}
function addLibToWorkspaceFile(options, projectRoot, projectName, hasZoneDependency) {
    return (0, workspace_1.updateWorkspace)((workspace) => {
        workspace.projects.add({
            name: projectName,
            root: projectRoot,
            sourceRoot: `${projectRoot}/src`,
            projectType: workspace_models_1.ProjectType.Library,
            prefix: options.prefix,
            targets: {
                build: {
                    builder: workspace_models_1.Builders.BuildNgPackagr,
                    defaultConfiguration: 'production',
                    configurations: {
                        production: {
                            tsConfig: `${projectRoot}/tsconfig.lib.prod.json`,
                        },
                        development: {
                            tsConfig: `${projectRoot}/tsconfig.lib.json`,
                        },
                    },
                },
                test: {
                    builder: workspace_models_1.Builders.BuildKarma,
                    options: {
                        tsConfig: `${projectRoot}/tsconfig.spec.json`,
                        polyfills: hasZoneDependency ? ['zone.js', 'zone.js/testing'] : undefined,
                    },
                },
            },
        });
    });
}
function default_1(options) {
    return async (host) => {
        const prefix = options.prefix;
        // If scoped project (i.e. "@foo/bar"), convert projectDir to "foo/bar".
        const packageName = options.name;
        if (/^@.*\/.*/.test(options.name)) {
            const [, name] = options.name.split('/');
            options.name = name;
        }
        const workspace = await (0, workspace_1.getWorkspace)(host);
        const newProjectRoot = workspace.extensions.newProjectRoot || '';
        let folderName = packageName.startsWith('@') ? packageName.slice(1) : packageName;
        if (/[A-Z]/.test(folderName)) {
            folderName = schematics_1.strings.dasherize(folderName);
        }
        const libDir = options.projectRoot !== undefined
            ? (0, posix_1.join)(options.projectRoot)
            : (0, posix_1.join)(newProjectRoot, folderName);
        const distRoot = `dist/${folderName}`;
        const sourceDir = `${libDir}/src/lib`;
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)('./files'), [
            (0, schematics_1.applyTemplates)({
                ...schematics_1.strings,
                ...options,
                packageName,
                libDir,
                distRoot,
                relativePathToWorkspaceRoot: (0, paths_1.relativePathToWorkspaceRoot)(libDir),
                prefix,
                angularLatestVersion: latest_versions_1.latestVersions.Angular.replace(/~|\^/, ''),
                tsLibLatestVersion: latest_versions_1.latestVersions['tslib'].replace(/~|\^/, ''),
                folderName,
            }),
            (0, schematics_1.move)(libDir),
        ]);
        const hasZoneDependency = (0, dependency_1.getDependency)(host, 'zone.js') !== null;
        return (0, schematics_1.chain)([
            (0, schematics_1.mergeWith)(templateSource),
            addLibToWorkspaceFile(options, libDir, packageName, hasZoneDependency),
            options.skipPackageJson ? (0, schematics_1.noop)() : addDependenciesToPackageJson(!!options.skipInstall),
            options.skipTsConfig ? (0, schematics_1.noop)() : updateTsConfig(packageName, './' + distRoot),
            options.skipTsConfig
                ? (0, schematics_1.noop)()
                : addTsProjectReference('./' + (0, posix_1.join)(libDir, 'tsconfig.lib.json'), './' + (0, posix_1.join)(libDir, 'tsconfig.spec.json')),
            options.standalone
                ? (0, schematics_1.noop)()
                : (0, schematics_1.schematic)('module', {
                    name: options.name,
                    commonModule: false,
                    flat: true,
                    path: sourceDir,
                    project: packageName,
                    // Explicitly set the `typeSeparator` this also ensures that the generated files are valid even if the `module` schematic
                    // inherits its `typeSeparator` from the workspace.
                    typeSeparator: '-',
                }),
            (0, schematics_1.schematic)('component', {
                name: options.name,
                selector: `${prefix}-${options.name}`,
                inlineStyle: true,
                inlineTemplate: true,
                flat: true,
                path: sourceDir,
                export: true,
                standalone: options.standalone,
                project: packageName,
                // Explicitly set an empty `type` since it doesn't necessarily make sense in a library.
                // This also ensures that the generated files are valid even if the `component` schematic
                // inherits its `type` from the workspace.
                type: '',
            }),
        ]);
    };
}
