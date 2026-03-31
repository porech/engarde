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
const dependency_1 = require("../utility/dependency");
const json_file_1 = require("../utility/json-file");
const latest_versions_1 = require("../utility/latest-versions");
const paths_1 = require("../utility/paths");
const workspace_1 = require("../utility/workspace");
const workspace_models_1 = require("../utility/workspace-models");
const schema_1 = require("./schema");
const APPLICATION_DEV_DEPENDENCIES = [
    { name: '@angular/compiler-cli', version: latest_versions_1.latestVersions.Angular },
    { name: '@angular/build', version: latest_versions_1.latestVersions.AngularBuild },
    { name: 'typescript', version: latest_versions_1.latestVersions['typescript'] },
];
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
function default_1(options) {
    return async (host) => {
        const { appDir, appRootSelector, componentOptions, folderName, sourceDir } = await getAppOptions(host, options);
        return (0, schematics_1.chain)([
            addAppToWorkspaceFile(options, appDir),
            addTsProjectReference('./' + (0, core_1.join)((0, core_1.normalize)(appDir), 'tsconfig.app.json')),
            options.skipTests || options.minimal
                ? (0, schematics_1.noop)()
                : addTsProjectReference('./' + (0, core_1.join)((0, core_1.normalize)(appDir), 'tsconfig.spec.json')),
            options.standalone
                ? (0, schematics_1.noop)()
                : (0, schematics_1.schematic)('module', {
                    name: 'app',
                    commonModule: false,
                    flat: true,
                    routing: options.routing,
                    routingScope: 'Root',
                    path: sourceDir,
                    project: options.name,
                    typeSeparator: undefined,
                }),
            (0, schematics_1.schematic)('component', {
                name: 'app',
                selector: appRootSelector,
                flat: true,
                path: sourceDir,
                skipImport: true,
                project: options.name,
                ...componentOptions,
            }),
            (0, schematics_1.mergeWith)((0, schematics_1.apply)((0, schematics_1.url)(options.standalone ? './files/standalone-files' : './files/module-files'), [
                options.routing ? (0, schematics_1.noop)() : (0, schematics_1.filter)((path) => !path.endsWith('app.routes.ts.template')),
                componentOptions.skipTests
                    ? (0, schematics_1.filter)((path) => !path.endsWith('.spec.ts.template'))
                    : (0, schematics_1.noop)(),
                (0, schematics_1.applyTemplates)({
                    utils: schematics_1.strings,
                    ...options,
                    ...componentOptions,
                    selector: appRootSelector,
                    relativePathToWorkspaceRoot: (0, paths_1.relativePathToWorkspaceRoot)(appDir),
                    appName: options.name,
                    folderName,
                }),
                (0, schematics_1.move)(appDir),
            ]), schematics_1.MergeStrategy.Overwrite),
            (0, schematics_1.mergeWith)((0, schematics_1.apply)((0, schematics_1.url)('./files/common-files'), [
                options.minimal
                    ? (0, schematics_1.filter)((path) => !path.endsWith('tsconfig.spec.json.template'))
                    : (0, schematics_1.noop)(),
                componentOptions.inlineTemplate
                    ? (0, schematics_1.filter)((path) => !path.endsWith('app.html.template'))
                    : (0, schematics_1.noop)(),
                (0, schematics_1.applyTemplates)({
                    utils: schematics_1.strings,
                    ...options,
                    selector: appRootSelector,
                    relativePathToWorkspaceRoot: (0, paths_1.relativePathToWorkspaceRoot)(appDir),
                    appName: options.name,
                    folderName,
                }),
                (0, schematics_1.move)(appDir),
            ]), schematics_1.MergeStrategy.Overwrite),
            options.ssr
                ? (0, schematics_1.schematic)('ssr', {
                    project: options.name,
                    skipInstall: true,
                })
                : (0, schematics_1.noop)(),
            options.skipPackageJson ? (0, schematics_1.noop)() : addDependenciesToPackageJson(options),
        ]);
    };
}
function addDependenciesToPackageJson(options) {
    const rules = APPLICATION_DEV_DEPENDENCIES.map((dependency) => (0, dependency_1.addDependency)(dependency.name, dependency.version, {
        type: dependency_1.DependencyType.Dev,
        existing: dependency_1.ExistingBehavior.Skip,
        install: options.skipInstall ? dependency_1.InstallBehavior.None : dependency_1.InstallBehavior.Auto,
    }));
    if (!options.zoneless) {
        rules.push((0, dependency_1.addDependency)('zone.js', latest_versions_1.latestVersions['zone.js'], {
            type: dependency_1.DependencyType.Default,
            existing: dependency_1.ExistingBehavior.Skip,
            install: options.skipInstall ? dependency_1.InstallBehavior.None : dependency_1.InstallBehavior.Auto,
        }));
    }
    if (options.style === schema_1.Style.Less) {
        rules.push((0, dependency_1.addDependency)('less', latest_versions_1.latestVersions['less'], {
            type: dependency_1.DependencyType.Dev,
            existing: dependency_1.ExistingBehavior.Skip,
            install: options.skipInstall ? dependency_1.InstallBehavior.None : dependency_1.InstallBehavior.Auto,
        }));
    }
    return (0, schematics_1.chain)(rules);
}
function addAppToWorkspaceFile(options, appDir) {
    let projectRoot = appDir;
    if (projectRoot) {
        projectRoot += '/';
    }
    const schematics = {};
    if (options.inlineTemplate ||
        options.inlineStyle ||
        options.minimal ||
        options.style !== schema_1.Style.Css) {
        const componentSchematicsOptions = {};
        if (options.inlineTemplate ?? options.minimal) {
            componentSchematicsOptions.inlineTemplate = true;
        }
        if (options.inlineStyle ?? options.minimal) {
            componentSchematicsOptions.inlineStyle = true;
        }
        if (options.style && options.style !== schema_1.Style.Css) {
            componentSchematicsOptions.style = options.style;
        }
        schematics['@schematics/angular:component'] = componentSchematicsOptions;
    }
    if (options.skipTests || options.minimal) {
        const schematicsWithTests = [
            'class',
            'component',
            'directive',
            'guard',
            'interceptor',
            'pipe',
            'resolver',
            'service',
        ];
        schematicsWithTests.forEach((type) => {
            (schematics[`@schematics/angular:${type}`] ??= {}).skipTests = true;
        });
    }
    if (!options.standalone) {
        const schematicsWithStandalone = ['component', 'directive', 'pipe'];
        schematicsWithStandalone.forEach((type) => {
            (schematics[`@schematics/angular:${type}`] ??= {}).standalone = false;
        });
    }
    const sourceRoot = (0, core_1.join)((0, core_1.normalize)(projectRoot), 'src');
    let budgets = [];
    if (options.strict) {
        budgets = [
            {
                type: 'initial',
                maximumWarning: '500kB',
                maximumError: '1MB',
            },
            {
                type: 'anyComponentStyle',
                maximumWarning: '4kB',
                maximumError: '8kB',
            },
        ];
    }
    else {
        budgets = [
            {
                type: 'initial',
                maximumWarning: '2MB',
                maximumError: '5MB',
            },
            {
                type: 'anyComponentStyle',
                maximumWarning: '6kB',
                maximumError: '10kB',
            },
        ];
    }
    const inlineStyleLanguage = options?.style !== schema_1.Style.Css ? options.style : undefined;
    const project = {
        root: (0, core_1.normalize)(projectRoot),
        sourceRoot,
        projectType: workspace_models_1.ProjectType.Application,
        prefix: options.prefix || 'app',
        schematics,
        targets: {
            build: {
                builder: workspace_models_1.Builders.BuildApplication,
                defaultConfiguration: 'production',
                options: {
                    browser: `${sourceRoot}/main.ts`,
                    polyfills: options.zoneless ? undefined : ['zone.js'],
                    tsConfig: `${projectRoot}tsconfig.app.json`,
                    inlineStyleLanguage,
                    assets: [{ 'glob': '**/*', 'input': `${projectRoot}public` }],
                    styles: [`${sourceRoot}/styles.${options.style}`],
                },
                configurations: {
                    production: {
                        budgets,
                        outputHashing: 'all',
                    },
                    development: {
                        optimization: false,
                        extractLicenses: false,
                        sourceMap: true,
                    },
                },
            },
            serve: {
                builder: workspace_models_1.Builders.BuildDevServer,
                defaultConfiguration: 'development',
                options: {},
                configurations: {
                    production: {
                        buildTarget: `${options.name}:build:production`,
                    },
                    development: {
                        buildTarget: `${options.name}:build:development`,
                    },
                },
            },
            'extract-i18n': {
                builder: workspace_models_1.Builders.BuildExtractI18n,
            },
            test: options.minimal
                ? undefined
                : {
                    builder: workspace_models_1.Builders.BuildKarma,
                    options: {
                        polyfills: options.zoneless ? undefined : ['zone.js', 'zone.js/testing'],
                        tsConfig: `${projectRoot}tsconfig.spec.json`,
                        inlineStyleLanguage,
                        assets: [{ 'glob': '**/*', 'input': `${projectRoot}public` }],
                        styles: [`${sourceRoot}/styles.${options.style}`],
                    },
                },
        },
    };
    return (0, workspace_1.updateWorkspace)((workspace) => {
        workspace.projects.add({
            name: options.name,
            ...project,
        });
    });
}
async function getAppOptions(host, options) {
    const appRootSelector = `${options.prefix}-root`;
    const componentOptions = getComponentOptions(options);
    const workspace = await (0, workspace_1.getWorkspace)(host);
    const newProjectRoot = workspace.extensions.newProjectRoot || '';
    // If scoped project (i.e. "@foo/bar"), convert dir to "foo/bar".
    let folderName = options.name.startsWith('@') ? options.name.slice(1) : options.name;
    if (/[A-Z]/.test(folderName)) {
        folderName = schematics_1.strings.dasherize(folderName);
    }
    const appDir = options.projectRoot === undefined
        ? (0, core_1.join)((0, core_1.normalize)(newProjectRoot), folderName)
        : (0, core_1.normalize)(options.projectRoot);
    const sourceDir = `${appDir}/src/app`;
    return {
        appDir,
        appRootSelector,
        componentOptions,
        folderName,
        sourceDir,
    };
}
function getComponentOptions(options) {
    const componentOptions = !options.minimal
        ? {
            inlineStyle: options.inlineStyle,
            inlineTemplate: options.inlineTemplate,
            skipTests: options.skipTests,
            style: options.style,
            viewEncapsulation: options.viewEncapsulation,
        }
        : {
            inlineStyle: options.inlineStyle ?? true,
            inlineTemplate: options.inlineTemplate ?? true,
            skipTests: true,
            style: options.style,
            viewEncapsulation: options.viewEncapsulation,
        };
    return componentOptions;
}
