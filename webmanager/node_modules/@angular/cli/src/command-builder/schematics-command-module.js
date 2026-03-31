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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
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
exports.SchematicsCommandModule = exports.DEFAULT_SCHEMATICS_COLLECTION = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const tools_1 = require("@angular-devkit/schematics/tools");
const node_path_1 = require("node:path");
const analytics_1 = require("../analytics/analytics");
const analytics_parameters_1 = require("../analytics/analytics-parameters");
const config_1 = require("../utilities/config");
const error_1 = require("../utilities/error");
const memoize_1 = require("../utilities/memoize");
const tty_1 = require("../utilities/tty");
const command_module_1 = require("./command-module");
const json_schema_1 = require("./utilities/json-schema");
const schematic_engine_host_1 = require("./utilities/schematic-engine-host");
const schematic_workflow_1 = require("./utilities/schematic-workflow");
exports.DEFAULT_SCHEMATICS_COLLECTION = '@schematics/angular';
let SchematicsCommandModule = (() => {
    let _classSuper = command_module_1.CommandModule;
    let _instanceExtraInitializers = [];
    let _getOrCreateWorkflowForBuilder_decorators;
    let _getOrCreateWorkflowForExecution_decorators;
    let _getSchematicCollections_decorators;
    return class SchematicsCommandModule extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _getOrCreateWorkflowForBuilder_decorators = [memoize_1.memoize];
            _getOrCreateWorkflowForExecution_decorators = [memoize_1.memoize];
            _getSchematicCollections_decorators = [memoize_1.memoize];
            __esDecorate(this, null, _getOrCreateWorkflowForBuilder_decorators, { kind: "method", name: "getOrCreateWorkflowForBuilder", static: false, private: false, access: { has: obj => "getOrCreateWorkflowForBuilder" in obj, get: obj => obj.getOrCreateWorkflowForBuilder }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getOrCreateWorkflowForExecution_decorators, { kind: "method", name: "getOrCreateWorkflowForExecution", static: false, private: false, access: { has: obj => "getOrCreateWorkflowForExecution" in obj, get: obj => obj.getOrCreateWorkflowForExecution }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getSchematicCollections_decorators, { kind: "method", name: "getSchematicCollections", static: false, private: false, access: { has: obj => "getSchematicCollections" in obj, get: obj => obj.getSchematicCollections }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        scope = (__runInitializers(this, _instanceExtraInitializers), command_module_1.CommandScope.In);
        allowPrivateSchematics = false;
        async builder(argv) {
            return argv
                .option('interactive', {
                describe: 'Enable interactive input prompts.',
                type: 'boolean',
                default: true,
            })
                .option('dry-run', {
                describe: 'Run through and reports activity without writing out results.',
                type: 'boolean',
                alias: ['d'],
                default: false,
            })
                .option('defaults', {
                describe: 'Disable interactive input prompts for options with a default.',
                type: 'boolean',
                default: false,
            })
                .option('force', {
                describe: 'Force overwriting of existing files.',
                type: 'boolean',
                default: false,
            })
                .strict();
        }
        /** Get schematic schema options.*/
        async getSchematicOptions(collection, schematicName, workflow) {
            const schematic = collection.createSchematic(schematicName, true);
            const { schemaJson } = schematic.description;
            if (!schemaJson) {
                return [];
            }
            return (0, json_schema_1.parseJsonSchemaToOptions)(workflow.registry, schemaJson);
        }
        getOrCreateWorkflowForBuilder(collectionName) {
            return new tools_1.NodeWorkflow(this.context.root, {
                resolvePaths: this.getResolvePaths(collectionName),
                engineHostCreator: (options) => new schematic_engine_host_1.SchematicEngineHost(options.resolvePaths),
            });
        }
        async getOrCreateWorkflowForExecution(collectionName, options) {
            const { logger, root, packageManager } = this.context;
            const { force, dryRun, packageRegistry } = options;
            const workflow = new tools_1.NodeWorkflow(root, {
                force,
                dryRun,
                packageManager: packageManager.name,
                // A schema registry is required to allow customizing addUndefinedDefaults
                registry: new core_1.schema.CoreSchemaRegistry(schematics_1.formats.standardFormats),
                packageRegistry,
                resolvePaths: this.getResolvePaths(collectionName),
                schemaValidation: true,
                optionTransforms: [
                    // Add configuration file defaults
                    async (schematic, current) => {
                        const projectName = typeof current?.project === 'string' ? current.project : this.getProjectName();
                        return {
                            ...(await (0, config_1.getSchematicDefaults)(schematic.collection.name, schematic.name, projectName)),
                            ...current,
                        };
                    },
                ],
                engineHostCreator: (options) => new schematic_engine_host_1.SchematicEngineHost(options.resolvePaths),
            });
            workflow.registry.addPostTransform(core_1.schema.transforms.addUndefinedDefaults);
            workflow.registry.useXDeprecatedProvider((msg) => logger.warn(msg));
            workflow.registry.addSmartDefaultProvider('projectName', () => this.getProjectName());
            const workingDir = (0, core_1.normalize)((0, node_path_1.relative)(this.context.root, process.cwd()));
            workflow.registry.addSmartDefaultProvider('workingDirectory', () => workingDir === '' ? undefined : workingDir);
            workflow.engineHost.registerOptionsTransform(async (schematic, options) => {
                const { collection: { name: collectionName }, name: schematicName, } = schematic;
                const analytics = (0, analytics_1.isPackageNameSafeForAnalytics)(collectionName)
                    ? await this.getAnalytics()
                    : undefined;
                analytics?.reportSchematicRunEvent({
                    [analytics_parameters_1.EventCustomDimension.SchematicCollectionName]: collectionName,
                    [analytics_parameters_1.EventCustomDimension.SchematicName]: schematicName,
                    ...this.getAnalyticsParameters(options),
                });
                return options;
            });
            if (options.interactive !== false && (0, tty_1.isTTY)()) {
                workflow.registry.usePromptProvider(async (definitions) => {
                    let prompts;
                    const answers = {};
                    for (const definition of definitions) {
                        if (options.defaults && definition.default !== undefined) {
                            continue;
                        }
                        // Only load prompt package if needed
                        prompts ??= await Promise.resolve().then(() => __importStar(require('@inquirer/prompts')));
                        switch (definition.type) {
                            case 'confirmation':
                                answers[definition.id] = await prompts.confirm({
                                    message: definition.message,
                                    default: definition.default,
                                });
                                break;
                            case 'list':
                                if (!definition.items?.length) {
                                    continue;
                                }
                                answers[definition.id] = await (definition.multiselect ? prompts.checkbox : prompts.select)({
                                    message: definition.message,
                                    validate: (values) => {
                                        if (!definition.validator) {
                                            return true;
                                        }
                                        return definition.validator(Object.values(values).map(({ value }) => value));
                                    },
                                    default: definition.multiselect ? undefined : definition.default,
                                    choices: definition.items?.map((item) => typeof item == 'string'
                                        ? {
                                            name: item,
                                            value: item,
                                            checked: definition.multiselect && Array.isArray(definition.default)
                                                ? definition.default?.includes(item)
                                                : item === definition.default,
                                        }
                                        : {
                                            ...item,
                                            name: item.label,
                                            value: item.value,
                                            checked: definition.multiselect && Array.isArray(definition.default)
                                                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    definition.default?.includes(item.value)
                                                : item.value === definition.default,
                                        }),
                                });
                                break;
                            case 'input': {
                                let finalValue;
                                answers[definition.id] = await prompts.input({
                                    message: definition.message,
                                    default: definition.default,
                                    async validate(value) {
                                        if (definition.validator === undefined) {
                                            return true;
                                        }
                                        let lastValidation = false;
                                        for (const type of definition.propertyTypes) {
                                            let potential;
                                            switch (type) {
                                                case 'string':
                                                    potential = String(value);
                                                    break;
                                                case 'integer':
                                                case 'number':
                                                    potential = Number(value);
                                                    break;
                                                default:
                                                    potential = value;
                                                    break;
                                            }
                                            lastValidation = await definition.validator(potential);
                                            // Can be a string if validation fails
                                            if (lastValidation === true) {
                                                finalValue = potential;
                                                return true;
                                            }
                                        }
                                        return lastValidation;
                                    },
                                });
                                // Use validated value if present.
                                // This ensures the correct type is inserted into the final schema options.
                                if (finalValue !== undefined) {
                                    answers[definition.id] = finalValue;
                                }
                                break;
                            }
                        }
                    }
                    return answers;
                });
            }
            return workflow;
        }
        async getSchematicCollections() {
            const getSchematicCollections = (configSection) => {
                if (!configSection) {
                    return undefined;
                }
                const { schematicCollections } = configSection;
                if (Array.isArray(schematicCollections)) {
                    return new Set(schematicCollections);
                }
                return undefined;
            };
            const { workspace, globalConfiguration } = this.context;
            if (workspace) {
                const project = (0, config_1.getProjectByCwd)(workspace);
                if (project) {
                    const value = getSchematicCollections(workspace.getProjectCli(project));
                    if (value) {
                        return value;
                    }
                }
            }
            const value = getSchematicCollections(workspace?.getCli()) ??
                getSchematicCollections(globalConfiguration.getCli());
            if (value) {
                return value;
            }
            return new Set([exports.DEFAULT_SCHEMATICS_COLLECTION]);
        }
        parseSchematicInfo(schematic) {
            if (schematic?.includes(':')) {
                const [collectionName, schematicName] = schematic.split(':', 2);
                return [collectionName, schematicName];
            }
            return [undefined, schematic];
        }
        async runSchematic(options) {
            const { logger } = this.context;
            const { schematicOptions, executionOptions, collectionName, schematicName } = options;
            const workflow = await this.getOrCreateWorkflowForExecution(collectionName, executionOptions);
            if (!schematicName) {
                throw new Error('schematicName cannot be undefined.');
            }
            const { unsubscribe, files } = (0, schematic_workflow_1.subscribeToWorkflow)(workflow, logger);
            try {
                await workflow
                    .execute({
                    collection: collectionName,
                    schematic: schematicName,
                    options: schematicOptions,
                    logger,
                    allowPrivate: this.allowPrivateSchematics,
                })
                    .toPromise();
                if (!files.size) {
                    logger.info('Nothing to be done.');
                }
                if (executionOptions.dryRun) {
                    logger.warn(`\nNOTE: The "--dry-run" option means no changes were made.`);
                }
            }
            catch (err) {
                // In case the workflow was not successful, show an appropriate error message.
                if (err instanceof schematics_1.UnsuccessfulWorkflowExecution) {
                    // "See above" because we already printed the error.
                    logger.fatal('The Schematic workflow failed. See above.');
                }
                else {
                    (0, error_1.assertIsError)(err);
                    logger.fatal(err.message);
                }
                return 1;
            }
            finally {
                unsubscribe();
            }
            return 0;
        }
        getProjectName() {
            const { workspace } = this.context;
            if (!workspace) {
                return undefined;
            }
            const projectName = (0, config_1.getProjectByCwd)(workspace);
            if (projectName) {
                return projectName;
            }
            return undefined;
        }
        getResolvePaths(collectionName) {
            const { workspace, root } = this.context;
            if (collectionName[0] === '.') {
                // Resolve relative collections from the location of `angular.json`
                return [root];
            }
            return workspace
                ? // Workspace
                    collectionName === exports.DEFAULT_SCHEMATICS_COLLECTION
                        ? // Favor __dirname for @schematics/angular to use the build-in version
                            [__dirname, process.cwd(), root]
                        : [process.cwd(), root, __dirname]
                : // Global
                    [__dirname, process.cwd()];
        }
    };
})();
exports.SchematicsCommandModule = SchematicsCommandModule;
