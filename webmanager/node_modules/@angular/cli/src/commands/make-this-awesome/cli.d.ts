/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Argv } from 'yargs';
import { CommandModule, CommandModuleImplementation } from '../../command-builder/command-module';
export default class AwesomeCommandModule extends CommandModule implements CommandModuleImplementation {
    command: string;
    describe: false;
    deprecated: boolean;
    longDescriptionPath?: string | undefined;
    builder(localYargs: Argv): Argv;
    run(): void;
}
