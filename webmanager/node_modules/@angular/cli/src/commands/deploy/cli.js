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
class DeployCommandModule extends architect_command_module_1.ArchitectCommandModule {
    // The below choices should be kept in sync with the list in https://angular.dev/tools/cli/deployment
    missingTargetChoices = [
        {
            name: 'Amazon S3',
            value: '@jefiozie/ngx-aws-deploy',
        },
        {
            name: 'Firebase',
            value: '@angular/fire',
        },
        {
            name: 'Netlify',
            value: '@netlify-builder/deploy',
        },
        {
            name: 'GitHub Pages',
            value: 'angular-cli-ghpages',
        },
    ];
    multiTarget = false;
    command = 'deploy [project]';
    longDescriptionPath = (0, node_path_1.join)(__dirname, 'long-description.md');
    describe = 'Invokes the deploy builder for a specified project or for the default project in the workspace.';
}
exports.default = DeployCommandModule;
