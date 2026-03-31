"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsPromptModule = exports.AnalyticsEnableModule = exports.AnalyticsDisableModule = void 0;
const analytics_1 = require("../../../analytics/analytics");
const command_module_1 = require("../../../command-builder/command-module");
class AnalyticsSettingModule extends command_module_1.CommandModule {
    longDescriptionPath;
    builder(localYargs) {
        return localYargs
            .option('global', {
            description: `Configure analytics gathering and reporting globally in the caller's home directory.`,
            alias: ['g'],
            type: 'boolean',
            default: false,
        })
            .strict();
    }
}
class AnalyticsDisableModule extends AnalyticsSettingModule {
    command = 'disable';
    aliases = 'off';
    describe = 'Disables analytics gathering and reporting for the user.';
    async run({ global }) {
        await (0, analytics_1.setAnalyticsConfig)(global, false);
        process.stderr.write(await (0, analytics_1.getAnalyticsInfoString)(this.context));
    }
}
exports.AnalyticsDisableModule = AnalyticsDisableModule;
class AnalyticsEnableModule extends AnalyticsSettingModule {
    command = 'enable';
    aliases = 'on';
    describe = 'Enables analytics gathering and reporting for the user.';
    async run({ global }) {
        await (0, analytics_1.setAnalyticsConfig)(global, true);
        process.stderr.write(await (0, analytics_1.getAnalyticsInfoString)(this.context));
    }
}
exports.AnalyticsEnableModule = AnalyticsEnableModule;
class AnalyticsPromptModule extends AnalyticsSettingModule {
    command = 'prompt';
    describe = 'Prompts the user to set the analytics gathering status interactively.';
    async run({ global }) {
        await (0, analytics_1.promptAnalytics)(this.context, global, true);
    }
}
exports.AnalyticsPromptModule = AnalyticsPromptModule;
