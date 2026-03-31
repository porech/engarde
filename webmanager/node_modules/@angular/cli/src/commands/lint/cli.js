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
class LintCommandModule extends architect_command_module_1.ArchitectCommandModule {
    missingTargetChoices = [
        {
            name: 'ESLint',
            value: 'angular-eslint',
        },
    ];
    multiTarget = true;
    command = 'lint [project]';
    longDescriptionPath = (0, node_path_1.join)(__dirname, 'long-description.md');
    describe = 'Runs linting tools on Angular application code in a given project folder.';
}
exports.default = LintCommandModule;
