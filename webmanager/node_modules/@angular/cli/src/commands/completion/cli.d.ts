/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Argv } from 'yargs';
import { CommandModule, CommandModuleImplementation } from '../../command-builder/command-module';
export default class CompletionCommandModule extends CommandModule implements CommandModuleImplementation {
    command: string;
    describe: string;
    longDescriptionPath: string;
    builder(localYargs: Argv): Argv;
    run(): Promise<number>;
}
