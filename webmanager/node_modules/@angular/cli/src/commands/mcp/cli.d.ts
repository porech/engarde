/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Argv } from 'yargs';
import { CommandModule, CommandModuleImplementation } from '../../command-builder/command-module';
export default class McpCommandModule extends CommandModule implements CommandModuleImplementation {
    command: string;
    describe: false;
    longDescriptionPath: undefined;
    builder(localYargs: Argv): Argv;
    run(options: {
        readOnly: boolean;
        localOnly: boolean;
        experimentalTool: string[] | undefined;
    }): Promise<void>;
}
