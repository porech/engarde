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
exports.WorkspaceNodeModulesArchitectHost = void 0;
exports.loadEsmModule = loadEsmModule;
const node_fs_1 = require("node:fs");
const node_module_1 = require("node:module");
const path = __importStar(require("node:path"));
const node_url_1 = require("node:url");
const node_v8_1 = require("node:v8");
const internal_1 = require("../src/internal");
// TODO_ESM: Update to use import.meta.url
const localRequire = (0, node_module_1.createRequire)(__filename);
function clone(obj) {
    try {
        return (0, node_v8_1.deserialize)((0, node_v8_1.serialize)(obj));
    }
    catch {
        return JSON.parse(JSON.stringify(obj));
    }
}
function findProjectTarget(workspace, project, target) {
    const projectDefinition = workspace.projects.get(project);
    if (!projectDefinition) {
        throw new Error(`Project "${project}" does not exist.`);
    }
    const targetDefinition = projectDefinition.targets.get(target);
    if (!targetDefinition) {
        throw new Error('Project target does not exist.');
    }
    if (!targetDefinition.builder) {
        throw new Error(`A builder is not set for target '${target}' in project '${project}'.`);
    }
    return targetDefinition;
}
class WorkspaceNodeModulesArchitectHost {
    _root;
    workspaceHost;
    constructor(workspaceOrHost, _root) {
        this._root = _root;
        if ('getBuilderName' in workspaceOrHost) {
            this.workspaceHost = workspaceOrHost;
        }
        else {
            this.workspaceHost = {
                async getBuilderName(project, target) {
                    const { builder } = findProjectTarget(workspaceOrHost, project, target);
                    return builder;
                },
                async getOptions(project, target, configuration) {
                    const targetDefinition = findProjectTarget(workspaceOrHost, project, target);
                    if (configuration === undefined) {
                        return (targetDefinition.options ?? {});
                    }
                    if (!targetDefinition.configurations?.[configuration]) {
                        throw new Error(`Configuration '${configuration}' for target '${target}' in project '${project}' is not set in the workspace.`);
                    }
                    return (targetDefinition.configurations?.[configuration] ?? {});
                },
                async getMetadata(project) {
                    const projectDefinition = workspaceOrHost.projects.get(project);
                    if (!projectDefinition) {
                        throw new Error(`Project "${project}" does not exist.`);
                    }
                    return {
                        root: projectDefinition.root,
                        sourceRoot: projectDefinition.sourceRoot,
                        prefix: projectDefinition.prefix,
                        ...clone(workspaceOrHost.extensions),
                        ...clone(projectDefinition.extensions),
                    };
                },
                async hasTarget(project, target) {
                    return !!workspaceOrHost.projects.get(project)?.targets.has(target);
                },
                async getDefaultConfigurationName(project, target) {
                    return workspaceOrHost.projects.get(project)?.targets.get(target)?.defaultConfiguration;
                },
            };
        }
    }
    async getBuilderNameForTarget(target) {
        return this.workspaceHost.getBuilderName(target.project, target.target);
    }
    /**
     * Resolve a builder. This needs to be a string which will be used in a dynamic `import()`
     * clause. This should throw if no builder can be found. The dynamic import will throw if
     * it is unsupported.
     * @param builderStr The name of the builder to be used.
     * @returns All the info needed for the builder itself.
     */
    resolveBuilder(builderStr, basePath = this._root, seenBuilders) {
        if (seenBuilders?.has(builderStr)) {
            throw new Error('Circular builder alias references detected: ' + [...seenBuilders, builderStr]);
        }
        const [packageName, builderName] = builderStr.split(':', 2);
        if (!builderName) {
            throw new Error('No builder name specified.');
        }
        // Resolve and load the builders manifest from the package's `builders` field, if present
        const packageJsonPath = localRequire.resolve(packageName + '/package.json', {
            paths: [basePath],
        });
        const packageJson = JSON.parse((0, node_fs_1.readFileSync)(packageJsonPath, 'utf-8'));
        const buildersManifestRawPath = packageJson['builders'];
        if (!buildersManifestRawPath) {
            throw new Error(`Package ${JSON.stringify(packageName)} has no builders defined.`);
        }
        let buildersManifestPath = path.normalize(buildersManifestRawPath);
        if (path.isAbsolute(buildersManifestRawPath) || buildersManifestRawPath.startsWith('..')) {
            throw new Error(`Package "${packageName}" has an invalid builders manifest path: "${buildersManifestRawPath}"`);
        }
        buildersManifestPath = path.join(path.dirname(packageJsonPath), buildersManifestPath);
        const buildersManifest = JSON.parse((0, node_fs_1.readFileSync)(buildersManifestPath, 'utf-8'));
        const buildersManifestDirectory = path.dirname(buildersManifestPath);
        // Attempt to locate an entry for the specified builder by name
        const builder = buildersManifest.builders?.[builderName];
        if (!builder) {
            throw new Error(`Cannot find builder ${JSON.stringify(builderStr)}.`);
        }
        // Resolve alias reference if entry is a string
        if (typeof builder === 'string') {
            return this.resolveBuilder(builder, path.dirname(packageJsonPath), (seenBuilders ?? new Set()).add(builderStr));
        }
        // Determine builder implementation path (relative within package only)
        const implementationPath = builder.implementation && path.normalize(builder.implementation);
        if (!implementationPath) {
            throw new Error('Could not find the implementation for builder ' + builderStr);
        }
        if (path.isAbsolute(implementationPath) || implementationPath.startsWith('..')) {
            throw new Error(`Package "${packageName}" has an invalid builder implementation path: "${builderName}" --> "${builder.implementation}"`);
        }
        // Determine builder option schema path (relative within package only)
        let schemaPath = builder.schema;
        if (!schemaPath) {
            throw new Error('Could not find the schema for builder ' + builderStr);
        }
        if (path.isAbsolute(schemaPath) || path.normalize(schemaPath).startsWith('..')) {
            throw new Error(`Package "${packageName}" has an invalid builder schema path: "${builderName}" --> "${builder.schema}"`);
        }
        // The file could be either a package reference or in the local manifest directory.
        if (schemaPath.startsWith('.')) {
            schemaPath = path.join(buildersManifestDirectory, schemaPath);
        }
        else {
            const manifestRequire = (0, node_module_1.createRequire)(buildersManifestDirectory + '/');
            schemaPath = manifestRequire.resolve(schemaPath);
        }
        const schemaText = (0, node_fs_1.readFileSync)(schemaPath, 'utf-8');
        return Promise.resolve({
            name: builderStr,
            builderName,
            description: builder['description'],
            optionSchema: JSON.parse(schemaText),
            import: path.join(buildersManifestDirectory, implementationPath),
        });
    }
    async getCurrentDirectory() {
        return process.cwd();
    }
    async getWorkspaceRoot() {
        return this._root;
    }
    async getOptionsForTarget(target) {
        if (!(await this.workspaceHost.hasTarget(target.project, target.target))) {
            return null;
        }
        let options = await this.workspaceHost.getOptions(target.project, target.target);
        const targetConfiguration = target.configuration ||
            (await this.workspaceHost.getDefaultConfigurationName(target.project, target.target));
        if (targetConfiguration) {
            const configurations = targetConfiguration.split(',').map((c) => c.trim());
            for (const configuration of configurations) {
                options = {
                    ...options,
                    ...(await this.workspaceHost.getOptions(target.project, target.target, configuration)),
                };
            }
        }
        return clone(options);
    }
    async getProjectMetadata(target) {
        const projectName = typeof target === 'string' ? target : target.project;
        const metadata = this.workspaceHost.getMetadata(projectName);
        return metadata;
    }
    async loadBuilder(info) {
        const builder = await getBuilder(info.import);
        if (builder[internal_1.BuilderSymbol]) {
            return builder;
        }
        // Default handling code is for old builders that incorrectly export `default` with non-ESM module
        if (builder?.default[internal_1.BuilderSymbol]) {
            return builder.default;
        }
        throw new Error('Builder is not a builder');
    }
}
exports.WorkspaceNodeModulesArchitectHost = WorkspaceNodeModulesArchitectHost;
/**
 * Lazily compiled dynamic import loader function.
 */
let load;
/**
 * This uses a dynamic import to load a module which may be ESM.
 * CommonJS code can load ESM code via a dynamic import. Unfortunately, TypeScript
 * will currently, unconditionally downlevel dynamic import into a require call.
 * require calls cannot load ESM code and will result in a runtime error. To workaround
 * this, a Function constructor is used to prevent TypeScript from changing the dynamic import.
 * Once TypeScript provides support for keeping the dynamic import this workaround can
 * be dropped.
 *
 * @param modulePath The path of the module to load.
 * @returns A Promise that resolves to the dynamically imported module.
 */
function loadEsmModule(modulePath) {
    load ??= new Function('modulePath', `return import(modulePath);`);
    return load(modulePath);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getBuilder(builderPath) {
    let builder;
    switch (path.extname(builderPath)) {
        case '.mjs':
            // Load the ESM configuration file using the TypeScript dynamic import workaround.
            // Once TypeScript provides support for keeping the dynamic import this workaround can be
            // changed to a direct dynamic import.
            builder = (await loadEsmModule((0, node_url_1.pathToFileURL)(builderPath))).default;
            break;
        case '.cjs':
            builder = localRequire(builderPath);
            break;
        default:
            // The file could be either CommonJS or ESM.
            // CommonJS is tried first then ESM if loading fails.
            try {
                builder = localRequire(builderPath);
            }
            catch (e) {
                if (e.code === 'ERR_REQUIRE_ESM' ||
                    e.code === 'ERR_REQUIRE_ASYNC_MODULE') {
                    // Load the ESM configuration file using the TypeScript dynamic import workaround.
                    // Once TypeScript provides support for keeping the dynamic import this workaround can be
                    // changed to a direct dynamic import.
                    builder = await loadEsmModule((0, node_url_1.pathToFileURL)(builderPath));
                }
                throw e;
            }
            break;
    }
    return 'default' in builder ? builder.default : builder;
}
