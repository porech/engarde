/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Argv } from 'yargs';
import { CommandModule, CommandModuleImplementation, Options } from '../../../command-builder/command-module';
interface AnalyticsCommandArgs {
    global: boolean;
}
declare abstract class AnalyticsSettingModule extends CommandModule<AnalyticsCommandArgs> implements CommandModuleImplementation<AnalyticsCommandArgs> {
    longDescriptionPath?: string;
    builder(localYargs: Argv): Argv<AnalyticsCommandArgs>;
    abstract run({ global }: Options<AnalyticsCommandArgs>): Promise<void>;
}
export declare class AnalyticsDisableModule extends AnalyticsSettingModule implements CommandModuleImplementation<AnalyticsCommandArgs> {
    command: string;
    aliases: string;
    describe: string;
    run({ global }: Options<AnalyticsCommandArgs>): Promise<void>;
}
export declare class AnalyticsEnableModule extends AnalyticsSettingModule implements CommandModuleImplementation<AnalyticsCommandArgs> {
    command: string;
    aliases: string;
    describe: string;
    run({ global }: Options<AnalyticsCommandArgs>): Promise<void>;
}
export declare class AnalyticsPromptModule extends AnalyticsSettingModule implements CommandModuleImplementation<AnalyticsCommandArgs> {
    command: string;
    describe: string;
    run({ global }: Options<AnalyticsCommandArgs>): Promise<void>;
}
export {};
