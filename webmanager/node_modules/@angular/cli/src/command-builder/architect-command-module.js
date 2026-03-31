"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchitectCommandModule = void 0;
const config_1 = require("../utilities/config");
const memoize_1 = require("../utilities/memoize");
const architect_base_command_module_1 = require("./architect-base-command-module");
const command_module_1 = require("./command-module");
let ArchitectCommandModule = (() => {
    let _classSuper = architect_base_command_module_1.ArchitectBaseCommandModule;
    let _instanceExtraInitializers = [];
    let _getProjectNamesByTarget_decorators;
    return class ArchitectCommandModule extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _getProjectNamesByTarget_decorators = [memoize_1.memoize];
            __esDecorate(this, null, _getProjectNamesByTarget_decorators, { kind: "method", name: "getProjectNamesByTarget", static: false, private: false, access: { has: obj => "getProjectNamesByTarget" in obj, get: obj => obj.getProjectNamesByTarget }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        async builder(argv) {
            const target = this.getArchitectTarget();
            // Add default builder if target is not in project and a command default is provided
            if (this.findDefaultBuilderName && this.context.workspace) {
                for (const [project, projectDefinition] of this.context.workspace.projects) {
                    if (projectDefinition.targets.has(target)) {
                        continue;
                    }
                    const defaultBuilder = await this.findDefaultBuilderName(projectDefinition, {
                        project,
                        target,
                    });
                    if (defaultBuilder) {
                        projectDefinition.targets.set(target, {
                            builder: defaultBuilder,
                        });
                    }
                }
            }
            const project = this.getArchitectProject();
            const { jsonHelp, getYargsCompletions, help } = this.context.args.options;
            const localYargs = argv
                .positional('project', {
                describe: 'The name of the project to build. Can be an application or a library.',
                type: 'string',
                // Hide choices from JSON help so that we don't display them in AIO.
                choices: jsonHelp ? undefined : this.getProjectChoices(),
            })
                .option('configuration', {
                describe: `One or more named builder configurations as a comma-separated ` +
                    `list as specified in the "configurations" section in angular.json.\n` +
                    `The builder uses the named configurations to run the given target.\n` +
                    `For more information, see https://angular.dev/reference/configs/workspace-config#alternate-build-configurations.`,
                alias: 'c',
                type: 'string',
                // Show only in when using --help and auto completion because otherwise comma seperated configuration values will be invalid.
                // Also, hide choices from JSON help so that we don't display them in AIO.
                choices: (getYargsCompletions || help) && !jsonHelp && project
                    ? this.getConfigurationChoices(project)
                    : undefined,
            })
                .strict();
            if (!project) {
                return localYargs;
            }
            const schemaOptions = await this.getArchitectTargetOptions({
                project,
                target,
            });
            return this.addSchemaOptionsToCommand(localYargs, schemaOptions);
        }
        async run(options) {
            const originalProcessTitle = process.title;
            try {
                const target = this.getArchitectTarget();
                const { configuration = '', project, ...architectOptions } = options;
                if (project) {
                    process.title = `${originalProcessTitle} (${project})`;
                    return await this.runSingleTarget({ configuration, target, project }, architectOptions);
                }
                // This runs each target sequentially.
                // Running them in parallel would jumble the log messages.
                let result = 0;
                const projectNames = this.getProjectNamesByTarget(target);
                if (!projectNames) {
                    return this.onMissingTarget('Cannot determine project or target for command.');
                }
                for (const project of projectNames) {
                    process.title = `${originalProcessTitle} (${project})`;
                    result |= await this.runSingleTarget({ configuration, target, project }, architectOptions);
                }
                return result;
            }
            finally {
                process.title = originalProcessTitle;
            }
        }
        getArchitectProject() {
            const { options, positional } = this.context.args;
            const [, projectName] = positional;
            if (projectName) {
                return projectName;
            }
            // Yargs allows positional args to be used as flags.
            if (typeof options['project'] === 'string') {
                return options['project'];
            }
            const target = this.getArchitectTarget();
            const projectFromTarget = this.getProjectNamesByTarget(target);
            return projectFromTarget?.length ? projectFromTarget[0] : undefined;
        }
        getProjectNamesByTarget(target) {
            const workspace = this.getWorkspaceOrThrow();
            const allProjectsForTargetName = [];
            for (const [name, project] of workspace.projects) {
                if (project.targets.has(target)) {
                    allProjectsForTargetName.push(name);
                }
            }
            if (allProjectsForTargetName.length === 0) {
                return undefined;
            }
            if (this.multiTarget) {
                // For multi target commands, we always list all projects that have the target.
                return allProjectsForTargetName;
            }
            else {
                if (allProjectsForTargetName.length === 1) {
                    return allProjectsForTargetName;
                }
                const maybeProject = (0, config_1.getProjectByCwd)(workspace);
                if (maybeProject) {
                    return allProjectsForTargetName.includes(maybeProject) ? [maybeProject] : undefined;
                }
                const { getYargsCompletions, help } = this.context.args.options;
                if (!getYargsCompletions && !help) {
                    // Only issue the below error when not in help / completion mode.
                    throw new command_module_1.CommandModuleError('Cannot determine project for command.\n' +
                        'This is a multi-project workspace and more than one project supports this command. ' +
                        `Run "ng ${this.command}" to execute the command for a specific project or change the current ` +
                        'working directory to a project directory.\n\n' +
                        `Available projects are:\n${allProjectsForTargetName
                            .sort()
                            .map((p) => `- ${p}`)
                            .join('\n')}`);
                }
            }
            return undefined;
        }
        /** @returns a sorted list of project names to be used for auto completion. */
        getProjectChoices() {
            const { workspace } = this.context;
            return workspace ? [...workspace.projects.keys()].sort() : undefined;
        }
        /** @returns a sorted list of configuration names to be used for auto completion. */
        getConfigurationChoices(project) {
            const projectDefinition = this.context.workspace?.projects.get(project);
            if (!projectDefinition) {
                return undefined;
            }
            const target = this.getArchitectTarget();
            const configurations = projectDefinition.targets.get(target)?.configurations;
            return configurations ? Object.keys(configurations).sort() : undefined;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
})();
exports.ArchitectCommandModule = ArchitectCommandModule;
