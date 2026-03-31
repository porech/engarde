"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsInfoCommandModule = void 0;
const analytics_1 = require("../../../analytics/analytics");
const command_module_1 = require("../../../command-builder/command-module");
class AnalyticsInfoCommandModule extends command_module_1.CommandModule {
    command = 'info';
    describe = 'Prints analytics gathering and reporting configuration in the console.';
    longDescriptionPath;
    builder(localYargs) {
        return localYargs.strict();
    }
    async run(_options) {
        this.context.logger.info(await (0, analytics_1.getAnalyticsInfoString)(this.context));
    }
}
exports.AnalyticsInfoCommandModule = AnalyticsInfoCommandModule;
