"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = require("node:path");
const command_module_1 = require("../../command-builder/command-module");
const command_1 = require("../../command-builder/utilities/command");
const color_1 = require("../../utilities/color");
const completion_1 = require("../../utilities/completion");
const error_1 = require("../../utilities/error");
class CompletionCommandModule extends command_module_1.CommandModule {
    command = 'completion';
    describe = 'Set up Angular CLI autocompletion for your terminal.';
    longDescriptionPath = (0, node_path_1.join)(__dirname, 'long-description.md');
    builder(localYargs) {
        (0, command_1.addCommandModuleToYargs)(CompletionScriptCommandModule, this.context);
        return localYargs;
    }
    async run() {
        let rcFile;
        try {
            rcFile = await (0, completion_1.initializeAutocomplete)();
        }
        catch (err) {
            (0, error_1.assertIsError)(err);
            this.context.logger.error(err.message);
            return 1;
        }
        this.context.logger.info(`
Appended \`source <(ng completion script)\` to \`${rcFile}\`. Restart your terminal or run the following to autocomplete \`ng\` commands:

    ${color_1.colors.yellow('source <(ng completion script)')}
      `.trim());
        if ((await (0, completion_1.hasGlobalCliInstall)()) === false) {
            this.context.logger.warn('Setup completed successfully, but there does not seem to be a global install of the' +
                ' Angular CLI. For autocompletion to work, the CLI will need to be on your `$PATH`, which' +
                ' is typically done with the `-g` flag in `npm install -g @angular/cli`.' +
                '\n\n' +
                'For more information, see https://angular.dev/cli/completion#global-install');
        }
        return 0;
    }
}
exports.default = CompletionCommandModule;
class CompletionScriptCommandModule extends command_module_1.CommandModule {
    command = 'script';
    describe = 'Generate a bash and zsh real-time type-ahead autocompletion script.';
    longDescriptionPath = undefined;
    builder(localYargs) {
        return localYargs;
    }
    run() {
        this.context.yargsInstance.showCompletionScript();
    }
}
