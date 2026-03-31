"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCacheConfig = updateCacheConfig;
exports.getCacheConfig = getCacheConfig;
const core_1 = require("@angular-devkit/core");
const node_path_1 = require("node:path");
const workspace_schema_1 = require("../../../lib/config/workspace-schema");
function updateCacheConfig(workspace, key, value) {
    const cli = (workspace.extensions['cli'] ??= {});
    const cache = (cli['cache'] ??= {});
    cache[key] = value;
    return workspace.save();
}
function getCacheConfig(workspace) {
    if (!workspace) {
        throw new Error(`Cannot retrieve cache configuration as workspace is not defined.`);
    }
    const defaultSettings = {
        path: (0, node_path_1.resolve)(workspace.basePath, '.angular/cache'),
        environment: workspace_schema_1.Environment.Local,
        enabled: true,
    };
    const cliSetting = workspace.extensions['cli'];
    if (!cliSetting || !(0, core_1.isJsonObject)(cliSetting)) {
        return defaultSettings;
    }
    const cacheSettings = cliSetting['cache'];
    if (!(0, core_1.isJsonObject)(cacheSettings)) {
        return defaultSettings;
    }
    const { path = defaultSettings.path, environment = defaultSettings.environment, enabled = defaultSettings.enabled,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
     } = cacheSettings;
    return {
        path: (0, node_path_1.resolve)(workspace.basePath, path),
        environment,
        enabled,
    };
}
