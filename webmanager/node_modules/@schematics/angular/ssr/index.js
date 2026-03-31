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
const json_file_1 = require("../utility/json-file");
const latest_versions_1 = require("../utility/latest-versions");
const ng_ast_utils_1 = require("../utility/ng-ast-utils");
const project_targets_1 = require("../utility/project-targets");
const util_1 = require("../utility/standalone/util");
const workspace_1 = require("../utility/workspace");
const SERVE_SSR_TARGET_NAME = 'serve-ssr';
const PRERENDER_TARGET_NAME = 'prerender';
const DEFAULT_BROWSER_DIR = 'browser';
const DEFAULT_MEDIA_DIR = 'media';
const DEFAULT_SERVER_DIR = 'server';
async function getLegacyOutputPaths(host, projectName, target) {
    // Generate new output paths
    const workspace = await (0, utility_1.readWorkspace)(host);
    const project = workspace.projects.get(projectName);
    const architectTarget = project?.targets.get(target);
    if (!architectTarget?.options) {
        throw new schematics_1.SchematicsException(`Cannot find 'options' for ${projectName} ${target} target.`);
    }
    const { outputPath } = architectTarget.options;
    if (typeof outputPath !== 'string') {
        throw new schematics_1.SchematicsException(`outputPath for ${projectName} ${target} target is not a string.`);
    }
    return outputPath;
}
async function getApplicationBuilderOutputPaths(host, projectName) {
    // Generate new output paths
    const target = 'build';
    const workspace = await (0, utility_1.readWorkspace)(host);
    const project = workspace.projects.get(projectName);
    const architectTarget = project?.targets.get(target);
    if (!architectTarget?.options) {
        throw new schematics_1.SchematicsException(`Cannot find 'options' for ${projectName} ${target} target.`);
    }
    let { outputPath } = architectTarget.options;
    // Use default if not explicitly specified
    outputPath ??= node_path_1.posix.join('dist', projectName);
    const defaultDirs = {
        server: DEFAULT_SERVER_DIR,
        browser: DEFAULT_BROWSER_DIR,
    };
    if (outputPath && (0, core_1.isJsonObject)(outputPath)) {
        return {
            ...defaultDirs,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...outputPath,
        };
    }
    if (typeof outputPath !== 'string') {
        throw new schematics_1.SchematicsException(`outputPath for ${projectName} ${target} target is not a string.`);
    }
    return {
        base: outputPath,
        ...defaultDirs,
    };
}
function addScriptsRule({ project }, isUsingApplicationBuilder) {
    return async (host) => {
        const pkgPath = '/package.json';
        const pkg = host.readJson(pkgPath);
        if (pkg === null) {
            throw new schematics_1.SchematicsException('Could not find package.json');
        }
        if (isUsingApplicationBuilder) {
            const { base, server } = await getApplicationBuilderOutputPaths(host, project);
            pkg.scripts ??= {};
            pkg.scripts[`serve:ssr:${project}`] = `node ${node_path_1.posix.join(base, server)}/server.mjs`;
        }
        else {
            const serverDist = await getLegacyOutputPaths(host, project, 'server');
            pkg.scripts = {
                ...pkg.scripts,
                'dev:ssr': `ng run ${project}:${SERVE_SSR_TARGET_NAME}`,
                'serve:ssr': `node ${serverDist}/main.js`,
                'build:ssr': `ng build && ng run ${project}:server`,
                'prerender': `ng run ${project}:${PRERENDER_TARGET_NAME}`,
            };
        }
        host.overwrite(pkgPath, JSON.stringify(pkg, null, 2));
    };
}
function updateApplicationBuilderTsConfigRule(options) {
    return async (host) => {
        const workspace = await (0, utility_1.readWorkspace)(host);
        const project = workspace.projects.get(options.project);
        const buildTarget = project?.targets.get('build');
        if (!buildTarget || !buildTarget.options) {
            return;
        }
        const tsConfigPath = buildTarget.options.tsConfig;
        if (!tsConfigPath || typeof tsConfigPath !== 'string') {
            // No tsconfig path
            return;
        }
        const json = new json_file_1.JSONFile(host, tsConfigPath);
        // Skip adding the files entry if the server entry would already be included
        const include = json.get(['include']);
        if (Array.isArray(include) && include.includes('src/**/*.ts')) {
            return;
        }
        const filesPath = ['files'];
        const files = new Set(json.get(filesPath) ?? []);
        files.add('src/server.ts');
        json.modify(filesPath, [...files]);
    };
}
function updateApplicationBuilderWorkspaceConfigRule(projectSourceRoot, options, { logger }) {
    return (0, utility_1.updateWorkspace)((workspace) => {
        const buildTarget = workspace.projects.get(options.project)?.targets.get('build');
        if (!buildTarget) {
            return;
        }
        let outputPath = buildTarget.options?.outputPath;
        if (outputPath && (0, core_1.isJsonObject)(outputPath)) {
            if (outputPath.browser === '') {
                const base = outputPath.base;
                logger.warn(`The output location of the browser build has been updated from "${base}" to "${node_path_1.posix.join(base, DEFAULT_BROWSER_DIR)}".
          You might need to adjust your deployment pipeline.`);
                if ((outputPath.media && outputPath.media !== DEFAULT_MEDIA_DIR) ||
                    (outputPath.server && outputPath.server !== DEFAULT_SERVER_DIR)) {
                    delete outputPath.browser;
                }
                else {
                    outputPath = outputPath.base;
                }
            }
        }
        buildTarget.options = {
            ...buildTarget.options,
            outputPath,
            outputMode: 'server',
            ssr: {
                entry: (0, core_1.join)((0, core_1.normalize)(projectSourceRoot), 'server.ts'),
            },
        };
    });
}
function updateWebpackBuilderWorkspaceConfigRule(projectSourceRoot, options) {
    return (0, utility_1.updateWorkspace)((workspace) => {
        const projectName = options.project;
        const project = workspace.projects.get(projectName);
        if (!project) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const serverTarget = project.targets.get('server');
        (serverTarget.options ??= {}).main = node_path_1.posix.join(projectSourceRoot, 'server.ts');
        const serveSSRTarget = project.targets.get(SERVE_SSR_TARGET_NAME);
        if (serveSSRTarget) {
            return;
        }
        project.targets.add({
            name: SERVE_SSR_TARGET_NAME,
            builder: '@angular-devkit/build-angular:ssr-dev-server',
            defaultConfiguration: 'development',
            options: {},
            configurations: {
                development: {
                    browserTarget: `${projectName}:build:development`,
                    serverTarget: `${projectName}:server:development`,
                },
                production: {
                    browserTarget: `${projectName}:build:production`,
                    serverTarget: `${projectName}:server:production`,
                },
            },
        });
        const prerenderTarget = project.targets.get(PRERENDER_TARGET_NAME);
        if (prerenderTarget) {
            return;
        }
        project.targets.add({
            name: PRERENDER_TARGET_NAME,
            builder: '@angular-devkit/build-angular:prerender',
            defaultConfiguration: 'production',
            options: {
                routes: ['/'],
            },
            configurations: {
                production: {
                    browserTarget: `${projectName}:build:production`,
                    serverTarget: `${projectName}:server:production`,
                },
                development: {
                    browserTarget: `${projectName}:build:development`,
                    serverTarget: `${projectName}:server:development`,
                },
            },
        });
    });
}
function updateWebpackBuilderServerTsConfigRule(options) {
    return async (host) => {
        const workspace = await (0, utility_1.readWorkspace)(host);
        const project = workspace.projects.get(options.project);
        const serverTarget = project?.targets.get('server');
        if (!serverTarget || !serverTarget.options) {
            return;
        }
        const tsConfigPath = serverTarget.options.tsConfig;
        if (!tsConfigPath || typeof tsConfigPath !== 'string') {
            // No tsconfig path
            return;
        }
        const tsConfig = new json_file_1.JSONFile(host, tsConfigPath);
        const filesAstNode = tsConfig.get(['files']);
        const serverFilePath = 'src/server.ts';
        if (Array.isArray(filesAstNode) && !filesAstNode.some(({ text }) => text === serverFilePath)) {
            tsConfig.modify(['files'], [...filesAstNode, serverFilePath]);
        }
    };
}
function addDependencies({ skipInstall }, isUsingApplicationBuilder) {
    const install = skipInstall ? utility_1.InstallBehavior.None : utility_1.InstallBehavior.Auto;
    const rules = [
        (0, utility_1.addDependency)('express', latest_versions_1.latestVersions['express'], {
            type: utility_1.DependencyType.Default,
            install,
            existing: utility_1.ExistingBehavior.Replace,
        }),
        (0, utility_1.addDependency)('@types/express', latest_versions_1.latestVersions['@types/express'], {
            type: utility_1.DependencyType.Dev,
            install,
            existing: utility_1.ExistingBehavior.Replace,
        }),
    ];
    if (!isUsingApplicationBuilder) {
        rules.push((0, utility_1.addDependency)('browser-sync', latest_versions_1.latestVersions['browser-sync'], {
            type: utility_1.DependencyType.Dev,
            install,
        }));
    }
    return (0, schematics_1.chain)(rules);
}
function addServerFile(projectSourceRoot, options, isStandalone) {
    return async (host) => {
        const projectName = options.project;
        const workspace = await (0, utility_1.readWorkspace)(host);
        const project = workspace.projects.get(projectName);
        if (!project) {
            throw new schematics_1.SchematicsException(`Invalid project name (${projectName})`);
        }
        const usingApplicationBuilder = (0, project_targets_1.isUsingApplicationBuilder)(project);
        const browserDistDirectory = usingApplicationBuilder
            ? (await getApplicationBuilderOutputPaths(host, projectName)).browser
            : await getLegacyOutputPaths(host, projectName, 'build');
        return (0, schematics_1.mergeWith)((0, schematics_1.apply)((0, schematics_1.url)(`./files/${usingApplicationBuilder ? 'application-builder' : 'server-builder'}`), [
            (0, schematics_1.applyTemplates)({
                ...core_1.strings,
                ...options,
                browserDistDirectory,
                isStandalone,
            }),
            (0, schematics_1.move)(projectSourceRoot),
        ]));
    };
}
function default_1(options) {
    return async (host, context) => {
        const browserEntryPoint = await (0, util_1.getMainFilePath)(host, options.project);
        const isStandalone = (0, ng_ast_utils_1.isStandaloneApp)(host, browserEntryPoint);
        const workspace = await (0, workspace_1.getWorkspace)(host);
        const clientProject = workspace.projects.get(options.project);
        if (!clientProject) {
            throw (0, project_targets_1.targetBuildNotFoundError)();
        }
        const usingApplicationBuilder = (0, project_targets_1.isUsingApplicationBuilder)(clientProject);
        const sourceRoot = clientProject.sourceRoot ?? node_path_1.posix.join(clientProject.root, 'src');
        return (0, schematics_1.chain)([
            (0, schematics_1.schematic)('server', {
                ...options,
                skipInstall: true,
            }),
            ...(usingApplicationBuilder
                ? [
                    updateApplicationBuilderWorkspaceConfigRule(sourceRoot, options, context),
                    updateApplicationBuilderTsConfigRule(options),
                ]
                : [
                    updateWebpackBuilderServerTsConfigRule(options),
                    updateWebpackBuilderWorkspaceConfigRule(sourceRoot, options),
                ]),
            addServerFile(sourceRoot, options, isStandalone),
            addScriptsRule(options, usingApplicationBuilder),
            addDependencies(options, usingApplicationBuilder),
        ]);
    };
}
