"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const architect_command_module_1 = require("../../command-builder/architect-command-module");
const command_config_1 = require("../command-config");
class ServeCommandModule extends architect_command_module_1.ArchitectCommandModule {
    multiTarget = false;
    command = 'serve [project]';
    aliases = command_config_1.RootCommands['serve'].aliases;
    describe = 'Builds and serves your application, rebuilding on file changes.';
    longDescriptionPath;
}
exports.default = ServeCommandModule;
