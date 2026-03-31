/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Argv } from 'yargs';
import { CommandModule, CommandModuleImplementation, Options } from '../../command-builder/command-module';
interface ConfigCommandArgs {
    'json-path'?: string;
    value?: string;
    global?: boolean;
}
export default class ConfigCommandModule extends CommandModule<ConfigCommandArgs> implements CommandModuleImplementation<ConfigCommandArgs> {
    command: string;
    describe: string;
    longDescriptionPath: string;
    builder(localYargs: Argv): Argv<ConfigCommandArgs>;
    run(options: Options<ConfigCommandArgs>): Promise<number | void>;
    private get;
    private set;
}
export {};
