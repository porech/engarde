"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheEnableModule = exports.CacheDisableModule = void 0;
const command_module_1 = require("../../../command-builder/command-module");
const utilities_1 = require("../utilities");
class CacheDisableModule extends command_module_1.CommandModule {
    command = 'disable';
    aliases = 'off';
    describe = 'Disables persistent disk cache for all projects in the workspace.';
    longDescriptionPath;
    scope = command_module_1.CommandScope.In;
    builder(localYargs) {
        return localYargs;
    }
    run() {
        return (0, utilities_1.updateCacheConfig)(this.getWorkspaceOrThrow(), 'enabled', false);
    }
}
exports.CacheDisableModule = CacheDisableModule;
class CacheEnableModule extends command_module_1.CommandModule {
    command = 'enable';
    aliases = 'on';
    describe = 'Enables disk cache for all projects in the workspace.';
    longDescriptionPath;
    scope = command_module_1.CommandScope.In;
    builder(localYargs) {
        return localYargs;
    }
    run() {
        return (0, utilities_1.updateCacheConfig)(this.getWorkspaceOrThrow(), 'enabled', true);
    }
}
exports.CacheEnableModule = CacheEnableModule;
