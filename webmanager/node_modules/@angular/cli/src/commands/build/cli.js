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
const architect_command_module_1 = require("../../command-builder/architect-command-module");
const command_config_1 = require("../command-config");
class BuildCommandModule extends architect_command_module_1.ArchitectCommandModule {
    multiTarget = false;
    command = 'build [project]';
    aliases = command_config_1.RootCommands['build'].aliases;
    describe = 'Compiles an Angular application or library into an output directory named dist/ at the given output path.';
    longDescriptionPath = (0, node_path_1.join)(__dirname, 'long-description.md');
}
exports.default = BuildCommandModule;
