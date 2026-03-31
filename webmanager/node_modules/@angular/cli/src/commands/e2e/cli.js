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
class E2eCommandModule extends architect_command_module_1.ArchitectCommandModule {
    missingTargetChoices = [
        {
            name: 'Playwright',
            value: 'playwright-ng-schematics',
        },
        {
            name: 'Cypress',
            value: '@cypress/schematic',
        },
        {
            name: 'Nightwatch',
            value: '@nightwatch/schematics',
        },
        {
            name: 'WebdriverIO',
            value: '@wdio/schematics',
        },
        {
            name: 'Puppeteer',
            value: '@puppeteer/ng-schematics',
        },
    ];
    multiTarget = true;
    command = 'e2e [project]';
    aliases = command_config_1.RootCommands['e2e'].aliases;
    describe = 'Builds and serves an Angular application, then runs end-to-end tests.';
    longDescriptionPath;
}
exports.default = E2eCommandModule;
