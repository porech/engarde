/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Argv } from 'yargs';
import { CommandModuleImplementation, Options, OtherOptions } from '../../command-builder/command-module';
import { SchematicsCommandArgs, SchematicsCommandModule } from '../../command-builder/schematics-command-module';
interface GenerateCommandArgs extends SchematicsCommandArgs {
    schematic?: string;
}
export default class GenerateCommandModule extends SchematicsCommandModule implements CommandModuleImplementation<GenerateCommandArgs> {
    command: string;
    aliases: string[] | undefined;
    describe: string;
    longDescriptionPath?: string | undefined;
    builder(argv: Argv): Promise<Argv<GenerateCommandArgs>>;
    run(options: Options<GenerateCommandArgs> & OtherOptions): Promise<number | void>;
    private getCollectionNames;
    private shouldAddCollectionNameAsPartOfCommand;
    /**
     * Generate an aliases string array to be passed to the command builder.
     *
     * @example `[component]` or `[@schematics/angular:component]`.
     */
    private generateCommandAliasesStrings;
    /**
     * Generate a command string to be passed to the command builder.
     *
     * @example `component [name]` or `@schematics/angular:component [name]`.
     */
    private generateCommandString;
    /**
     * Get schematics that can to be registered as subcommands.
     */
    private getSchematics;
    private listSchematicAliases;
    /**
     * Get schematics that should to be registered as subcommands.
     *
     * @returns a sorted list of schematic that needs to be registered as subcommands.
     */
    private getSchematicsToRegister;
}
export {};
