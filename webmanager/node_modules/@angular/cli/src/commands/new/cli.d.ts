/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Argv } from 'yargs';
import { CommandModuleImplementation, CommandScope, Options, OtherOptions } from '../../command-builder/command-module';
import { SchematicsCommandArgs, SchematicsCommandModule } from '../../command-builder/schematics-command-module';
interface NewCommandArgs extends SchematicsCommandArgs {
    collection?: string;
}
export default class NewCommandModule extends SchematicsCommandModule implements CommandModuleImplementation<NewCommandArgs> {
    private readonly schematicName;
    scope: CommandScope;
    protected allowPrivateSchematics: boolean;
    command: string;
    aliases: string[] | undefined;
    describe: string;
    longDescriptionPath: string;
    builder(argv: Argv): Promise<Argv<NewCommandArgs>>;
    run(options: Options<NewCommandArgs> & OtherOptions): Promise<number | void>;
    /** Find a collection from config that has an `ng-new` schematic. */
    private getCollectionFromConfig;
}
export {};
