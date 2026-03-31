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
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const node_path_1 = require("node:path");
const utility_1 = require("../utility");
const dependencies_1 = require("../utility/dependencies");
const json_file_1 = require("../utility/json-file");
const latest_versions_1 = require("../utility/latest-versions");
const ng_ast_utils_1 = require("../utility/ng-ast-utils");
const paths_1 = require("../utility/paths");
const project_targets_1 = require("../utility/project-targets");
const app_component_1 = require("../utility/standalone/app_component");
const util_1 = require("../utility/standalone/util");
const workspace_1 = require("../utility/workspace");
const workspace_models_1 = require("../utility/workspace-models");
const serverMainEntryName = 'main.server.ts';
function updateConfigFileBrowserBuilder(options, tsConfigDirectory) {
    return (0, workspace_1.updateWorkspace)((workspace) => {
        const clientProject = workspace.projects.get(options.project);
        if (clientProject) {
            // In case the browser builder hashes the assets
            // we need to add this setting to the server builder
            // as otherwise when assets it will be requested twice.
            // One for the server which will be unhashed, and other on the client which will be hashed.
            const getServerOptions = (options = {}) => {
                return {
                    buildOptimizer: options?.buildOptimizer,
                    outputHashing: options?.outputHashing === 'all' ? 'media' : options?.outputHashing,
                    fileReplacements: options?.fileReplacements,
                    optimization: options?.optimization === undefined ? undefined : !!options?.optimization,
                    sourceMap: options?.sourceMap,
                    localization: options?.localization,
                    stylePreprocessorOptions: options?.stylePreprocessorOptions,
                    resourcesOutputPath: options?.resourcesOutputPath,
                    deployUrl: options?.deployUrl,
                    i18nMissingTranslation: options?.i18nMissingTranslation,
                    preserveSymlinks: options?.preserveSymlinks,
                    extractLicenses: options?.extractLicenses,
                    inlineStyleLanguage: options?.inlineStyleLanguage,
                    vendorChunk: options?.vendorChunk,
                };
            };
            const buildTarget = clientProject.targets.get('build');
            if (buildTarget?.options) {
                buildTarget.options.outputPath = `dist/${options.project}/browser`;
            }
            const buildConfigurations = buildTarget?.configurations;
            const configurations = {};
            if (buildConfigurations) {
                for (const [key, options] of Object.entries(buildConfigurations)) {
                    configurations[key] = getServerOptions(options);
                }
            }
            const sourceRoot = clientProject.sourceRoot ?? (0, core_1.join)((0, core_1.normalize)(clientProject.root), 'src');
            const serverTsConfig = (0, core_1.join)(tsConfigDirectory, 'tsconfig.server.json');
            clientProject.targets.add({
                name: 'server',
                builder: workspace_models_1.Builders.Server,
                defaultConfiguration: 'production',
                options: {
                    outputPath: `dist/${options.project}/server`,
                    main: (0, core_1.join)((0, core_1.normalize)(sourceRoot), serverMainEntryName),
                    tsConfig: serverTsConfig,
                    ...(buildTarget?.options ? getServerOptions(buildTarget?.options) : {}),
                },
                configurations,
            });
        }
    });
}
function updateConfigFileApplicationBuilder(options) {
    return (0, workspace_1.updateWorkspace)((workspace) => {
        const project = workspace.projects.get(options.project);
        if (!project) {
            return;
        }
        const buildTarget = project.targets.get('build');
        if (!buildTarget) {
            return;
        }
        buildTarget.options ??= {};
        buildTarget.options['server'] = node_path_1.posix.join(project.sourceRoot ?? node_path_1.posix.join(project.root, 'src'), serverMainEntryName);
        buildTarget.options['outputMode'] = 'static';
    });
}
function updateTsConfigFile(tsConfigPath) {
    return (host) => {
        const json = new json_file_1.JSONFile(host, tsConfigPath);
        // Skip adding the files entry if the server entry would already be included.
        const include = json.get(['include']);
        if (!Array.isArray(include) || !include.includes('src/**/*.ts')) {
            const filesPath = ['files'];
            const files = new Set(json.get(filesPath) ?? []);
            files.add('src/' + serverMainEntryName);
            json.modify(filesPath, [...files]);
        }
        const typePath = ['compilerOptions', 'types'];
        const types = new Set(json.get(typePath) ?? []);
        types.add('node');
        json.modify(typePath, [...types]);
    };
}
function addDependencies(skipInstall) {
    return (host) => {
        const coreDep = (0, dependencies_1.getPackageJsonDependency)(host, '@angular/core');
        if (coreDep === null) {
            throw new schematics_1.SchematicsException('Could not find version.');
        }
        const install = skipInstall ? utility_1.InstallBehavior.None : utility_1.InstallBehavior.Auto;
        return (0, schematics_1.chain)([
            (0, utility_1.addDependency)('@angular/ssr', latest_versions_1.latestVersions.AngularSSR, {
                type: utility_1.DependencyType.Default,
                install,
            }),
            (0, utility_1.addDependency)('@angular/platform-server', coreDep.version, {
                type: utility_1.DependencyType.Default,
                install,
            }),
            (0, utility_1.addDependency)('@types/node', latest_versions_1.latestVersions['@types/node'], {
                type: utility_1.DependencyType.Dev,
                install,
            }),
        ]);
    };
}
function default_1(options) {
    return async (host) => {
        const workspace = await (0, workspace_1.getWorkspace)(host);
        const clientProject = workspace.projects.get(options.project);
        if (clientProject?.extensions.projectType !== 'application') {
            throw new schematics_1.SchematicsException(`Server schematic requires a project type of "application".`);
        }
        const clientBuildTarget = clientProject.targets.get('build');
        if (!clientBuildTarget) {
            throw (0, project_targets_1.targetBuildNotFoundError)();
        }
        const usingApplicationBuilder = (0, project_targets_1.isUsingApplicationBuilder)(clientProject);
        if (clientProject.targets.has('server') ||
            (usingApplicationBuilder && clientBuildTarget.options?.server !== undefined)) {
            // Server has already been added.
            return;
        }
        const clientBuildOptions = clientBuildTarget.options;
        const browserEntryPoint = await (0, util_1.getMainFilePath)(host, options.project);
        const isStandalone = (0, ng_ast_utils_1.isStandaloneApp)(host, browserEntryPoint);
        const sourceRoot = clientProject.sourceRoot ?? (0, core_1.join)((0, core_1.normalize)(clientProject.root), 'src');
        let filesUrl = `./files/${usingApplicationBuilder ? 'application-builder/' : 'server-builder/'}`;
        filesUrl += isStandalone ? 'standalone-src' : 'ngmodule-src';
        const { componentName, componentImportPathInSameFile, moduleName, moduleImportPathInSameFile } = (0, app_component_1.resolveBootstrappedComponentData)(host, browserEntryPoint) || {
            componentName: 'App',
            componentImportPathInSameFile: './app/app',
            moduleName: 'AppModule',
            moduleImportPathInSameFile: './app/app.module',
        };
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)(filesUrl), [
            (0, schematics_1.applyTemplates)({
                ...schematics_1.strings,
                ...options,
                appComponentName: componentName,
                appComponentPath: componentImportPathInSameFile,
                appModuleName: moduleName,
                appModulePath: moduleImportPathInSameFile === null
                    ? null
                    : `./${node_path_1.posix.basename(moduleImportPathInSameFile)}`,
            }),
            (0, schematics_1.move)(sourceRoot),
        ]);
        const clientTsConfig = (0, core_1.normalize)(clientBuildOptions.tsConfig);
        const tsConfigExtends = (0, core_1.basename)(clientTsConfig);
        const tsConfigDirectory = (0, core_1.dirname)(clientTsConfig);
        return (0, schematics_1.chain)([
            (0, schematics_1.mergeWith)(templateSource),
            ...(usingApplicationBuilder
                ? [
                    updateConfigFileApplicationBuilder(options),
                    updateTsConfigFile(clientBuildOptions.tsConfig),
                ]
                : [
                    (0, schematics_1.mergeWith)((0, schematics_1.apply)((0, schematics_1.url)('./files/server-builder/root'), [
                        (0, schematics_1.applyTemplates)({
                            ...schematics_1.strings,
                            ...options,
                            stripTsExtension: (s) => s.replace(/\.ts$/, ''),
                            tsConfigExtends,
                            hasLocalizePackage: !!(0, dependencies_1.getPackageJsonDependency)(host, '@angular/localize'),
                            relativePathToWorkspaceRoot: (0, paths_1.relativePathToWorkspaceRoot)(tsConfigDirectory),
                        }),
                        (0, schematics_1.move)(tsConfigDirectory),
                    ])),
                    updateConfigFileBrowserBuilder(options, tsConfigDirectory),
                ]),
            addDependencies(options.skipInstall),
            (0, utility_1.addRootProvider)(options.project, ({ code, external }) => code `${external('provideClientHydration', '@angular/platform-browser')}(${external('withEventReplay', '@angular/platform-browser')}())`),
        ]);
    };
}
