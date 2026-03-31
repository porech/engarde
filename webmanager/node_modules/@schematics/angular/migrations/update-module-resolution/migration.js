"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const json_file_1 = require("../../utility/json-file");
const workspace_1 = require("../../utility/workspace");
function default_1() {
    return async (host) => {
        const uniqueTsConfigs = new Set();
        if (host.exists('tsconfig.json')) {
            // Workspace level tsconfig
            uniqueTsConfigs.add('tsconfig.json');
        }
        const workspace = await (0, workspace_1.getWorkspace)(host);
        for (const [, target] of (0, workspace_1.allWorkspaceTargets)(workspace)) {
            for (const [, opt] of (0, workspace_1.allTargetOptions)(target)) {
                if (typeof opt?.tsConfig === 'string') {
                    uniqueTsConfigs.add(opt.tsConfig);
                }
            }
        }
        for (const tsConfig of uniqueTsConfigs) {
            if (host.exists(tsConfig)) {
                updateModuleResolution(host, tsConfig);
            }
        }
    };
}
function updateModuleResolution(host, tsConfigPath) {
    const json = new json_file_1.JSONFile(host, tsConfigPath);
    const jsonPath = ['compilerOptions'];
    const compilerOptions = json.get(jsonPath);
    if (compilerOptions && typeof compilerOptions === 'object') {
        const { moduleResolution, module } = compilerOptions;
        if (typeof moduleResolution !== 'string' || moduleResolution.toLowerCase() === 'bundler') {
            return;
        }
        if (typeof module === 'string' && module.toLowerCase() === 'preserve') {
            return;
        }
        json.modify(jsonPath, {
            ...compilerOptions,
            'moduleResolution': 'bundler',
        });
    }
}
