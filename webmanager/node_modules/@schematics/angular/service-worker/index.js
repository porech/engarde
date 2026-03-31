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
exports.default = default_1;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const ts = __importStar(require("../third_party/github.com/Microsoft/TypeScript/lib/typescript"));
const utility_1 = require("../utility");
const ast_utils_1 = require("../utility/ast-utils");
const change_1 = require("../utility/change");
const dependency_1 = require("../utility/dependency");
const ng_ast_utils_1 = require("../utility/ng-ast-utils");
const paths_1 = require("../utility/paths");
const project_targets_1 = require("../utility/project-targets");
const app_config_1 = require("../utility/standalone/app_config");
const util_1 = require("../utility/standalone/util");
const workspace_models_1 = require("../utility/workspace-models");
function addDependencies() {
    return (host) => {
        const coreDep = (0, dependency_1.getDependency)(host, '@angular/core');
        if (!coreDep) {
            throw new schematics_1.SchematicsException('Could not find "@angular/core" version.');
        }
        return (0, utility_1.addDependency)('@angular/service-worker', coreDep.version);
    };
}
function updateAppModule(mainPath) {
    return (host, context) => {
        context.logger.debug('Updating appmodule');
        const modulePath = (0, ng_ast_utils_1.getAppModulePath)(host, mainPath);
        context.logger.debug(`module path: ${modulePath}`);
        addImport(host, modulePath, 'ServiceWorkerModule', '@angular/service-worker');
        addImport(host, modulePath, 'isDevMode', '@angular/core');
        // register SW in application module
        const importText = core_1.tags.stripIndent `
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: !isDevMode(),
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000'
      })
    `;
        const moduleSource = getTsSourceFile(host, modulePath);
        const metadataChanges = (0, ast_utils_1.addSymbolToNgModuleMetadata)(moduleSource, modulePath, 'imports', importText);
        if (metadataChanges) {
            const recorder = host.beginUpdate(modulePath);
            (0, change_1.applyToUpdateRecorder)(recorder, metadataChanges);
            host.commitUpdate(recorder);
        }
        return host;
    };
}
function addProvideServiceWorker(projectName, mainPath) {
    return (host) => {
        const bootstrapCall = (0, util_1.findBootstrapApplicationCall)(host, mainPath);
        const appConfig = (0, app_config_1.findAppConfig)(bootstrapCall, host, mainPath)?.filePath || mainPath;
        addImport(host, appConfig, 'isDevMode', '@angular/core');
        return (0, utility_1.addRootProvider)(projectName, ({ code, external }) => code `${external('provideServiceWorker', '@angular/service-worker')}('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })`);
    };
}
function getTsSourceFile(host, path) {
    const content = host.readText(path);
    const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
    return source;
}
function default_1(options) {
    return async (host) => {
        const workspace = await (0, utility_1.readWorkspace)(host);
        const project = workspace.projects.get(options.project);
        if (!project) {
            throw new schematics_1.SchematicsException(`Invalid project name (${options.project})`);
        }
        if (project.extensions.projectType !== 'application') {
            throw new schematics_1.SchematicsException(`Service worker requires a project type of "application".`);
        }
        const buildTarget = project.targets.get('build');
        if (!buildTarget) {
            throw (0, project_targets_1.targetBuildNotFoundError)();
        }
        const buildOptions = buildTarget.options;
        const browserEntryPoint = await (0, util_1.getMainFilePath)(host, options.project);
        const ngswConfigPath = (0, core_1.join)((0, core_1.normalize)(project.root), 'ngsw-config.json');
        if (buildTarget.builder === workspace_models_1.Builders.Application ||
            buildTarget.builder === workspace_models_1.Builders.BuildApplication) {
            const productionConf = buildTarget.configurations?.production;
            if (productionConf) {
                productionConf.serviceWorker = ngswConfigPath;
            }
        }
        else {
            buildOptions.serviceWorker = true;
            buildOptions.ngswConfigPath = ngswConfigPath;
        }
        await (0, utility_1.writeWorkspace)(host, workspace);
        return (0, schematics_1.chain)([
            addDependencies(),
            (0, schematics_1.mergeWith)((0, schematics_1.apply)((0, schematics_1.url)('./files'), [
                (0, schematics_1.applyTemplates)({
                    ...options,
                    relativePathToWorkspaceRoot: (0, paths_1.relativePathToWorkspaceRoot)(project.root),
                }),
                (0, schematics_1.move)(project.root),
            ])),
            (0, ng_ast_utils_1.isStandaloneApp)(host, browserEntryPoint)
                ? addProvideServiceWorker(options.project, browserEntryPoint)
                : updateAppModule(browserEntryPoint),
        ]);
    };
}
function addImport(host, filePath, symbolName, moduleName) {
    const moduleSource = getTsSourceFile(host, filePath);
    const change = (0, ast_utils_1.insertImport)(moduleSource, filePath, symbolName, moduleName);
    if (change) {
        const recorder = host.beginUpdate(filePath);
        (0, change_1.applyToUpdateRecorder)(recorder, [change]);
        host.commitUpdate(recorder);
    }
}
