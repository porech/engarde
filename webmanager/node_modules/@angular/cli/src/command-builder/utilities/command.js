"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.demandCommandFailureMessage = void 0;
exports.addCommandModuleToYargs = addCommandModuleToYargs;
const command_module_1 = require("../command-module");
exports.demandCommandFailureMessage = `You need to specify a command before moving on. Use '--help' to view the available commands.`;
function addCommandModuleToYargs(commandModule, context) {
    const cmd = new commandModule(context);
    const { args: { options: { jsonHelp }, }, workspace, } = context;
    const describe = jsonHelp ? cmd.fullDescribe : cmd.describe;
    context.yargsInstance.command({
        command: cmd.command,
        aliases: cmd.aliases,
        describe: 
        // We cannot add custom fields in help, such as long command description which is used in AIO.
        // Therefore, we get around this by adding a complex object as a string which we later parse when generating the help files.
        typeof describe === 'object' ? JSON.stringify(describe) : describe,
        deprecated: cmd.deprecated,
        builder: (argv) => {
            // Skip scope validation when running with '--json-help' since it's easier to generate the output for all commands this way.
            const isInvalidScope = !jsonHelp &&
                ((cmd.scope === command_module_1.CommandScope.In && !workspace) ||
                    (cmd.scope === command_module_1.CommandScope.Out && workspace));
            if (isInvalidScope) {
                throw new command_module_1.CommandModuleError(`This command is not available when running the Angular CLI ${workspace ? 'inside' : 'outside'} a workspace.`);
            }
            return cmd.builder(argv);
        },
        handler: (args) => cmd.handler(args),
    });
}
