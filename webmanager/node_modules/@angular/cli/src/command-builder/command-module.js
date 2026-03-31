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
exports.CommandModuleError = exports.CommandModule = exports.CommandScope = void 0;
const core_1 = require("@angular-devkit/core");
const node_fs_1 = require("node:fs");
const path = __importStar(require("node:path"));
const helpers_1 = require("yargs/helpers");
const analytics_1 = require("../analytics/analytics");
const analytics_collector_1 = require("../analytics/analytics-collector");
const analytics_parameters_1 = require("../analytics/analytics-parameters");
const completion_1 = require("../utilities/completion");
const memoize_1 = require("../utilities/memoize");
const json_schema_1 = require("./utilities/json-schema");
var CommandScope;
(function (CommandScope) {
    /** Command can only run inside an Angular workspace. */
    CommandScope[CommandScope["In"] = 0] = "In";
    /** Command can only run outside an Angular workspace. */
    CommandScope[CommandScope["Out"] = 1] = "Out";
    /** Command can run inside and outside an Angular workspace. */
    CommandScope[CommandScope["Both"] = 2] = "Both";
})(CommandScope || (exports.CommandScope = CommandScope = {}));
let CommandModule = (() => {
    let _instanceExtraInitializers = [];
    let _getAnalytics_decorators;
    return class CommandModule {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getAnalytics_decorators = [memoize_1.memoize];
            __esDecorate(this, null, _getAnalytics_decorators, { kind: "method", name: "getAnalytics", static: false, private: false, access: { has: obj => "getAnalytics" in obj, get: obj => obj.getAnalytics }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        context = __runInitializers(this, _instanceExtraInitializers);
        shouldReportAnalytics = true;
        scope = CommandScope.Both;
        optionsWithAnalytics = new Map();
        constructor(context) {
            this.context = context;
        }
        /**
         * Description object which contains the long command descroption.
         * This is used to generate JSON help wich is used in AIO.
         *
         * `false` will result in a hidden command.
         */
        get fullDescribe() {
            return this.describe === false
                ? false
                : {
                    describe: this.describe,
                    ...(this.longDescriptionPath
                        ? {
                            longDescriptionRelativePath: path
                                .relative(path.join(__dirname, '../../../../'), this.longDescriptionPath)
                                .replace(/\\/g, path.posix.sep),
                            longDescription: (0, node_fs_1.readFileSync)(this.longDescriptionPath, 'utf8').replace(/\r\n/g, '\n'),
                        }
                        : {}),
                };
        }
        get commandName() {
            return this.command.split(' ', 1)[0];
        }
        async handler(args) {
            const { _, $0, ...options } = args;
            // Camelize options as yargs will return the object in kebab-case when camel casing is disabled.
            const camelCasedOptions = {};
            for (const [key, value] of Object.entries(options)) {
                camelCasedOptions[helpers_1.Parser.camelCase(key)] = value;
            }
            // Set up autocompletion if appropriate.
            const autocompletionExitCode = await (0, completion_1.considerSettingUpAutocompletion)(this.commandName, this.context.logger);
            if (autocompletionExitCode !== undefined) {
                process.exitCode = autocompletionExitCode;
                return;
            }
            // Gather and report analytics.
            const analytics = await this.getAnalytics();
            const stopPeriodicFlushes = analytics && analytics.periodFlush();
            let exitCode;
            try {
                if (analytics) {
                    this.reportCommandRunAnalytics(analytics);
                    this.reportWorkspaceInfoAnalytics(analytics);
                }
                exitCode = await this.run(camelCasedOptions);
            }
            catch (e) {
                if (e instanceof core_1.schema.SchemaValidationException) {
                    this.context.logger.fatal(`Error: ${e.message}`);
                    exitCode = 1;
                }
                else {
                    throw e;
                }
            }
            finally {
                await stopPeriodicFlushes?.();
                if (typeof exitCode === 'number' && exitCode > 0) {
                    process.exitCode = exitCode;
                }
            }
        }
        async getAnalytics() {
            if (!this.shouldReportAnalytics) {
                return undefined;
            }
            const userId = await (0, analytics_1.getAnalyticsUserId)(this.context, 
            // Don't prompt on `ng update`, 'ng version' or `ng analytics`.
            ['version', 'update', 'analytics'].includes(this.commandName));
            return userId ? new analytics_collector_1.AnalyticsCollector(this.context, userId) : undefined;
        }
        /**
         * Adds schema options to a command also this keeps track of options that are required for analytics.
         * **Note:** This method should be called from the command bundler method.
         */
        addSchemaOptionsToCommand(localYargs, options) {
            const optionsWithAnalytics = (0, json_schema_1.addSchemaOptionsToCommand)(localYargs, options, 
            // This should only be done when `--help` is used otherwise default will override options set in angular.json.
            /* includeDefaultValues= */ this.context.args.options.help);
            // Record option of analytics.
            for (const [name, userAnalytics] of optionsWithAnalytics) {
                this.optionsWithAnalytics.set(name, userAnalytics);
            }
            return localYargs;
        }
        getWorkspaceOrThrow() {
            const { workspace } = this.context;
            if (!workspace) {
                throw new CommandModuleError('A workspace is required for this command.');
            }
            return workspace;
        }
        /**
         * Flush on an interval (if the event loop is waiting).
         *
         * @returns a method that when called will terminate the periodic
         * flush and call flush one last time.
         */
        getAnalyticsParameters(options) {
            const parameters = {};
            const validEventCustomDimensionAndMetrics = new Set([
                ...Object.values(analytics_parameters_1.EventCustomDimension),
                ...Object.values(analytics_parameters_1.EventCustomMetric),
            ]);
            for (const [name, ua] of this.optionsWithAnalytics) {
                if (!validEventCustomDimensionAndMetrics.has(ua)) {
                    continue;
                }
                const value = options[name];
                if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                    parameters[ua] = value;
                }
                else if (Array.isArray(value)) {
                    // GA doesn't allow array as values.
                    parameters[ua] = value.sort().join(', ');
                }
            }
            return parameters;
        }
        reportCommandRunAnalytics(analytics) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const internalMethods = this.context.yargsInstance.getInternalMethods();
            // $0 generate component [name] -> generate_component
            // $0 add <collection> -> add
            const fullCommand = internalMethods.getUsageInstance().getUsage()[0][0]
                .split(' ')
                .filter((x) => {
                const code = x.charCodeAt(0);
                return code >= 97 && code <= 122;
            })
                .join('_');
            analytics.reportCommandRunEvent(fullCommand);
        }
        reportWorkspaceInfoAnalytics(analytics) {
            const { workspace } = this.context;
            if (!workspace) {
                return;
            }
            let applicationProjectsCount = 0;
            let librariesProjectsCount = 0;
            for (const project of workspace.projects.values()) {
                switch (project.extensions['projectType']) {
                    case 'application':
                        applicationProjectsCount++;
                        break;
                    case 'library':
                        librariesProjectsCount++;
                        break;
                }
            }
            analytics.reportWorkspaceInfoEvent({
                [analytics_parameters_1.EventCustomMetric.AllProjectsCount]: librariesProjectsCount + applicationProjectsCount,
                [analytics_parameters_1.EventCustomMetric.ApplicationProjectsCount]: applicationProjectsCount,
                [analytics_parameters_1.EventCustomMetric.LibraryProjectsCount]: librariesProjectsCount,
            });
        }
    };
})();
exports.CommandModule = CommandModule;
/**
 * Creates an known command module error.
 * This is used so during executation we can filter between known validation error and real non handled errors.
 */
class CommandModuleError extends Error {
}
exports.CommandModuleError = CommandModuleError;
