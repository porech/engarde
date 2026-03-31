/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Target } from '@angular-devkit/architect';
import { Argv } from 'yargs';
import { ArchitectBaseCommandModule } from '../../command-builder/architect-base-command-module';
import { CommandModuleImplementation, CommandScope, Options, OtherOptions } from '../../command-builder/command-module';
export interface RunCommandArgs {
    target: string;
}
export default class RunCommandModule extends ArchitectBaseCommandModule<RunCommandArgs> implements CommandModuleImplementation<RunCommandArgs> {
    scope: CommandScope;
    command: string;
    describe: string;
    longDescriptionPath: string;
    builder(argv: Argv): Promise<Argv<RunCommandArgs>>;
    run(options: Options<RunCommandArgs> & OtherOptions): Promise<number>;
    protected makeTargetSpecifier(options?: Options<RunCommandArgs>): Target | undefined;
    /** @returns a sorted list of target specifiers to be used for auto completion. */
    private getTargetChoices;
}
