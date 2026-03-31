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
const dependency_1 = require("../../utility/dependency");
const json_file_1 = require("../../utility/json-file");
const latest_versions_1 = require("../../utility/latest-versions");
const workspace_1 = require("../../utility/workspace");
const workspace_models_1 = require("../../utility/workspace-models");
const stylesheet_updates_1 = require("./stylesheet-updates");
function* updateBuildTarget(projectName, buildTarget, serverTarget, tree, context) {
    // Update builder target and options
    buildTarget.builder = workspace_models_1.Builders.Application;
    for (const [, options] of (0, workspace_1.allTargetOptions)(buildTarget, false)) {
        if (options['index'] === '') {
            options['index'] = false;
        }
        // Rename and transform options
        options['browser'] = options['main'];
        if (serverTarget && typeof options['browser'] === 'string') {
            options['server'] = (0, posix_1.dirname)(options['browser']) + '/main.server.ts';
        }
        options['serviceWorker'] = options['ngswConfigPath'] ?? options['serviceWorker'];
        if (typeof options['polyfills'] === 'string') {
            options['polyfills'] = [options['polyfills']];
        }
        let outputPath = options['outputPath'];
        if (typeof outputPath === 'string') {
            if (!/\/browser\/?$/.test(outputPath)) {
                // TODO: add prompt.
                context.logger.warn(`The output location of the browser build has been updated from "${outputPath}" to ` +
                    `"${(0, posix_1.join)(outputPath, 'browser')}". ` +
                    'You might need to adjust your deployment pipeline or, as an alternative, ' +
                    'set outputPath.browser to "" in order to maintain the previous functionality.');
            }
            else {
                outputPath = outputPath.replace(/\/browser\/?$/, '');
            }
            options['outputPath'] = {
                base: outputPath,
            };
            if (typeof options['resourcesOutputPath'] === 'string') {
                const media = options['resourcesOutputPath'].replaceAll('/', '');
                if (media && media !== 'media') {
                    options['outputPath'] = {
                        base: outputPath,
                        media,
                    };
                }
            }
        }
        // Delete removed options
        delete options['vendorChunk'];
        delete options['commonChunk'];
        delete options['resourcesOutputPath'];
        delete options['buildOptimizer'];
        delete options['main'];
        delete options['ngswConfigPath'];
    }
    // Merge browser and server tsconfig
    if (serverTarget) {
        const browserTsConfig = buildTarget.options?.tsConfig;
        const serverTsConfig = serverTarget.options?.tsConfig;
        if (typeof browserTsConfig !== 'string') {
            throw new schematics_1.SchematicsException(`Cannot update project "${projectName}" to use the application builder` +
                ` as the browser tsconfig cannot be located.`);
        }
        if (typeof serverTsConfig !== 'string') {
            throw new schematics_1.SchematicsException(`Cannot update project "${projectName}" to use the application builder` +
                ` as the server tsconfig cannot be located.`);
        }
        const browserJson = new json_file_1.JSONFile(tree, browserTsConfig);
        const serverJson = new json_file_1.JSONFile(tree, serverTsConfig);
        const filesPath = ['files'];
        const files = new Set([
            ...(browserJson.get(filesPath) ?? []),
            ...(serverJson.get(filesPath) ?? []),
        ]);
        // Server file will be added later by the means of the ssr schematic.
        files.delete('server.ts');
        browserJson.modify(filesPath, Array.from(files));
        const typesPath = ['compilerOptions', 'types'];
        browserJson.modify(typesPath, Array.from(new Set([
            ...(browserJson.get(typesPath) ?? []),
            ...(serverJson.get(typesPath) ?? []),
        ])));
        // Delete server tsconfig
        yield deleteFile(serverTsConfig);
    }
    // Update server file
    const ssrMainFile = serverTarget?.options?.['main'];
    if (typeof ssrMainFile === 'string') {
        // Do not delete the server main file if it's the same as the browser file.
        if (buildTarget.options?.browser !== ssrMainFile) {
            yield deleteFile(ssrMainFile);
        }
        yield (0, schematics_1.externalSchematic)('@schematics/angular', 'ssr', {
            project: projectName,
        });
    }
}
function updateProjects(tree, context) {
    return (0, workspace_1.updateWorkspace)((workspace) => {
        const rules = [];
        for (const [name, project] of workspace.projects) {
            if (project.extensions.projectType !== workspace_models_1.ProjectType.Application) {
                // Only interested in application projects since these changes only effects application builders
                continue;
            }
            const buildTarget = project.targets.get('build');
            if (!buildTarget || buildTarget.builder === workspace_models_1.Builders.Application) {
                continue;
            }
            if (buildTarget.builder !== workspace_models_1.Builders.BrowserEsbuild &&
                buildTarget.builder !== workspace_models_1.Builders.Browser) {
                context.logger.error(`Cannot update project "${name}" to use the application builder.` +
                    ` Only "${workspace_models_1.Builders.BrowserEsbuild}" and "${workspace_models_1.Builders.Browser}" can be automatically migrated.`);
                continue;
            }
            const serverTarget = project.targets.get('server');
            rules.push(...updateBuildTarget(name, buildTarget, serverTarget, tree, context));
            // Delete all redundant targets
            for (const [key, target] of project.targets) {
                switch (target.builder) {
                    case workspace_models_1.Builders.Server:
                    case workspace_models_1.Builders.Prerender:
                    case workspace_models_1.Builders.AppShell:
                    case workspace_models_1.Builders.SsrDevServer:
                        project.targets.delete(key);
                        break;
                }
            }
            // Update CSS/Sass import specifiers
            const projectSourceRoot = (0, posix_1.join)(project.root, project.sourceRoot ?? 'src');
            (0, stylesheet_updates_1.updateStyleImports)(tree, projectSourceRoot, buildTarget);
        }
        // Check for @angular-devkit/build-angular Webpack usage
        let hasAngularDevkitUsage = false;
        for (const [, target] of (0, workspace_1.allWorkspaceTargets)(workspace)) {
            switch (target.builder) {
                case workspace_models_1.Builders.Application:
                case workspace_models_1.Builders.DevServer:
                case workspace_models_1.Builders.ExtractI18n:
                case workspace_models_1.Builders.Karma:
                case workspace_models_1.Builders.NgPackagr:
                    // Ignore application, dev server, and i18n extraction for devkit usage check.
                    // Both will be replaced if no other usage is found.
                    continue;
            }
            if (target.builder.startsWith('@angular-devkit/build-angular:')) {
                hasAngularDevkitUsage = true;
                break;
            }
        }
        // Use @angular/build directly if there is no devkit package usage
        if (!hasAngularDevkitUsage) {
            const karmaConfigFiles = new Set();
            for (const [, target] of (0, workspace_1.allWorkspaceTargets)(workspace)) {
                switch (target.builder) {
                    case workspace_models_1.Builders.Application:
                        target.builder = '@angular/build:application';
                        break;
                    case workspace_models_1.Builders.DevServer:
                        target.builder = '@angular/build:dev-server';
                        break;
                    case workspace_models_1.Builders.ExtractI18n:
                        target.builder = '@angular/build:extract-i18n';
                        break;
                    case workspace_models_1.Builders.Karma:
                        target.builder = '@angular/build:karma';
                        for (const [, karmaOptions] of (0, workspace_1.allTargetOptions)(target)) {
                            // Remove "builderMode" option since the builder will always use "application"
                            delete karmaOptions['builderMode'];
                            // Collect custom karma configurations for @angular-devkit/build-angular plugin removal
                            const karmaConfig = karmaOptions['karmaConfig'];
                            if (karmaConfig && typeof karmaConfig === 'string') {
                                karmaConfigFiles.add(karmaConfig);
                            }
                        }
                        break;
                    case workspace_models_1.Builders.NgPackagr:
                        target.builder = '@angular/build:ng-packagr';
                        break;
                }
            }
            // Add direct @angular/build dependencies and remove @angular-devkit/build-angular
            rules.push((0, dependency_1.addDependency)('@angular/build', latest_versions_1.latestVersions.DevkitBuildAngular, {
                type: dependency_1.DependencyType.Dev,
                existing: dependency_1.ExistingBehavior.Replace,
            }), (0, dependency_1.removeDependency)('@angular-devkit/build-angular'));
            // Add less dependency if any projects contain a Less stylesheet file.
            // This check does not consider Node.js packages due to the performance
            // cost of searching such a large directory structure. A build time error
            // will provide instructions to install the package in this case.
            if ((0, stylesheet_updates_1.hasLessStylesheets)(tree)) {
                rules.push((0, dependency_1.addDependency)('less', latest_versions_1.latestVersions['less'], {
                    type: dependency_1.DependencyType.Dev,
                    existing: dependency_1.ExistingBehavior.Skip,
                }));
            }
            // Add postcss dependency if any projects have a custom postcss configuration file.
            // The build system only supports files in a project root or workspace root with
            // names of either 'postcss.config.json' or '.postcssrc.json'.
            if ((0, stylesheet_updates_1.hasPostcssConfiguration)(tree, workspace)) {
                rules.push((0, dependency_1.addDependency)('postcss', latest_versions_1.latestVersions['postcss'], {
                    type: dependency_1.DependencyType.Dev,
                    existing: dependency_1.ExistingBehavior.Replace,
                }));
            }
            for (const karmaConfigFile of karmaConfigFiles) {
                if (!tree.exists(karmaConfigFile)) {
                    continue;
                }
                try {
                    const originalKarmaConfigText = tree.readText(karmaConfigFile);
                    const updatedKarmaConfigText = originalKarmaConfigText
                        .replaceAll(`require('@angular-devkit/build-angular/plugins/karma'),`, '')
                        .replaceAll(`require('@angular-devkit/build-angular/plugins/karma')`, '');
                    if (updatedKarmaConfigText.includes('@angular-devkit/build-angular/plugins')) {
                        throw new Error('Migration does not support found usage of "@angular-devkit/build-angular".');
                    }
                    else {
                        tree.overwrite(karmaConfigFile, updatedKarmaConfigText);
                    }
                }
                catch (error) {
                    const reason = error instanceof Error ? `Reason: ${error.message}` : '';
                    context.logger.warn(`Unable to update custom karma configuration file ("${karmaConfigFile}"). ` +
                        reason +
                        '\nReferences to the "@angular-devkit/build-angular" package within the file may need to be removed manually.');
                }
            }
        }
        return (0, schematics_1.chain)(rules);
    });
}
function deleteFile(path) {
    return (tree) => {
        tree.delete(path);
    };
}
function updateJsonFile(path, updater) {
    return (tree, ctx) => {
        if (tree.exists(path)) {
            updater(new json_file_1.JSONFile(tree, path));
        }
        else {
            ctx.logger.info(`Skipping updating '${path}' as it does not exist.`);
        }
    };
}
/**
 * Migration main entrypoint
 */
function default_1() {
    return (0, schematics_1.chain)([
        updateProjects,
        // Delete package.json helper scripts
        updateJsonFile('package.json', (pkgJson) => ['build:ssr', 'dev:ssr', 'serve:ssr', 'prerender'].forEach((s) => pkgJson.remove(['scripts', s]))),
        // Update main tsconfig
        updateJsonFile('tsconfig.json', (rootJson) => {
            rootJson.modify(['compilerOptions', 'esModuleInterop'], true);
            rootJson.modify(['compilerOptions', 'downlevelIteration'], undefined);
            rootJson.modify(['compilerOptions', 'allowSyntheticDefaultImports'], undefined);
        }),
    ]);
}
