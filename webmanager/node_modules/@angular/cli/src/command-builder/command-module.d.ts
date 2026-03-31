/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { logging } from '@angular-devkit/core';
import type { ArgumentsCamelCase, Argv, CamelCaseKey, CommandModule as YargsCommandModule } from 'yargs' with { 'resolution-mode': 'require' };
import { AnalyticsCollector } from '../analytics/analytics-collector';
import { EventCustomDimension, EventCustomMetric } from '../analytics/analytics-parameters';
import { AngularWorkspace } from '../utilities/config';
import { PackageManagerUtils } from '../utilities/package-manager';
import { Option } from './utilities/json-schema';
export type Options<T> = {
    [key in keyof T as CamelCaseKey<key>]: T[key];
};
export declare enum CommandScope {
    /** Command can only run inside an Angular workspace. */
    In = 0,
    /** Command can only run outside an Angular workspace. */
    Out = 1,
    /** Command can run inside and outside an Angular workspace. */
    Both = 2
}
export interface CommandContext {
    currentDirectory: string;
    root: string;
    workspace?: AngularWorkspace;
    globalConfiguration: AngularWorkspace;
    logger: logging.Logger;
    packageManager: PackageManagerUtils;
    yargsInstance: Argv<{}>;
    /** Arguments parsed in free-from without parser configuration. */
    args: {
        positional: string[];
        options: {
            help: boolean;
            jsonHelp: boolean;
            getYargsCompletions: boolean;
        } & Record<string, unknown>;
    };
}
export type OtherOptions = Record<string, unknown>;
export interface CommandModuleImplementation<T extends {} = {}> extends Omit<YargsCommandModule<{}, T>, 'builder' | 'handler'> {
    /** Scope in which the command can be executed in. */
    scope: CommandScope;
    /** Path used to load the long description for the command in JSON help text. */
    longDescriptionPath?: string;
    /** Object declaring the options the command accepts, or a function accepting and returning a yargs instance. */
    builder(argv: Argv): Promise<Argv<T>> | Argv<T>;
    /** A function which will be passed the parsed argv. */
    run(options: Options<T> & OtherOptions): Promise<number | void> | number | void;
}
export interface FullDescribe {
    describe?: string;
    longDescription?: string;
    longDescriptionRelativePath?: string;
}
export declare abstract class CommandModule<T extends {} = {}> implements CommandModuleImplementation<T> {
    protected readonly context: CommandContext;
    abstract readonly command: string;
    abstract readonly describe: string | false;
    abstract readonly longDescriptionPath?: string;
    protected readonly shouldReportAnalytics: boolean;
    readonly scope: CommandScope;
    private readonly optionsWithAnalytics;
    constructor(context: CommandContext);
    /**
     * Description object which contains the long command descroption.
     * This is used to generate JSON help wich is used in AIO.
     *
     * `false` will result in a hidden command.
     */
    get fullDescribe(): FullDescribe | false;
    protected get commandName(): string;
    abstract builder(argv: Argv): Promise<Argv<T>> | Argv<T>;
    abstract run(options: Options<T> & OtherOptions): Promise<number | void> | number | void;
    handler(args: ArgumentsCamelCase<T> & OtherOptions): Promise<void>;
    protected getAnalytics(): Promise<AnalyticsCollector | undefined>;
    /**
     * Adds schema options to a command also this keeps track of options that are required for analytics.
     * **Note:** This method should be called from the command bundler method.
     */
    protected addSchemaOptionsToCommand<T>(localYargs: Argv<T>, options: Option[]): Argv<T>;
    protected getWorkspaceOrThrow(): AngularWorkspace;
    /**
     * Flush on an interval (if the event loop is waiting).
     *
     * @returns a method that when called will terminate the periodic
     * flush and call flush one last time.
     */
    protected getAnalyticsParameters(options: (Options<T> & OtherOptions) | OtherOptions): Partial<Record<EventCustomDimension | EventCustomMetric, string | boolean | number>>;
    private reportCommandRunAnalytics;
    private reportWorkspaceInfoAnalytics;
}
/**
 * Creates an known command module error.
 * This is used so during executation we can filter between known validation error and real non handled errors.
 */
export declare class CommandModuleError extends Error {
}
